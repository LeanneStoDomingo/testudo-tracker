import type { AppType } from "next/dist/shared/lib/utils";
import Script from "next/script";
import "@/styles/globals.css";
import "@fontsource/inter";
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "@/backend/router";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReactQueryDevtools } from "react-query/devtools";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
        src={process.env.NEXT_PUBLIC_UMAMI_URL}
      />
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
      <ReactQueryDevtools />
    </>
  );
};

export default withTRPC<AppRouter>({
  config: ({ ctx }) => {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV !== "production" &&
              typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            keepPreviousData: true,
          },
        },
      },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(App);
