import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script
          strategy="afterInteractive"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
          src={process.env.NEXT_PUBLIC_UMAMI_URL}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
