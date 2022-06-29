import { AppType } from "next/dist/shared/lib/utils";
import Script from "next/script";
import "@/styles/globals.css";
import "@fontsource/inter";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "@/backend/router";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReactQueryDevtools } from "react-query/devtools";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
        src={process.env.NEXT_PUBLIC_UMAMI_URL}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
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
      url: "/api/trpc",
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
