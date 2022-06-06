import type { AppProps } from "next/app";
import Script from "next/script";
import "@/styles/globals.css";
import "@fontsource/inter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

function App({ Component, pageProps }: AppProps) {
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
    </>
  );
}

export default App;
