import { useState } from "react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import { TRPCClientError, httpBatchLink, loggerLink } from "@trpc/client";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import superjson from "superjson";

import { api } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${inter.style.fontFamily};
          }
        `}
      </style>
      <Head>
        <title>Testudo Tracker</title>
        <meta
          name="description"
          content="A student run website that tracks seat availability for courses at the University of Maryland, College Park"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <APIProvider>
        <SessionProvider session={session}>
          <header>Header</header>
          <main>
            <Component {...pageProps} />
          </main>
          <footer>Footer</footer>
          <Toaster />
        </SessionProvider>
      </APIProvider>
    </>
  );
};

export default MyApp;

const APIProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { queryClient } = useQueryClient();
  const { trpcClient } = useTRPCClient();

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
};

const useQueryClient = () => {
  const { toast } = useToast();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (err, query) => {
            let title = "Oops! Something went wrong";
            let description = [""];

            if (err instanceof TRPCClientError) {
              title = "Error: " + err.message;
              description = [
                "Endpoint: " + (query.queryKey[0] as string[]).join("."),
                "Input: " +
                  JSON.stringify(
                    (query.queryKey[1] as { input: unknown }).input
                  ),
              ];
            }

            toast({
              variant: "destructive",
              title,
              description: description.map((line, i) => <p key={i}>{line}</p>),
            });
          },
        }),
      })
  );

  return { queryClient };
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const useTRPCClient = () => {
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return { trpcClient };
};
