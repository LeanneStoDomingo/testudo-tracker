import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "@/utils/api";

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
      <SessionProvider session={session}>
        <header>Header</header>
        <main>
          <Component {...pageProps} />
        </main>
        <footer>Footer</footer>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
