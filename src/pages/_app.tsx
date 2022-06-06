import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "@fontsource/inter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default App;
