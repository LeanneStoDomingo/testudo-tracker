import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { type Session } from "next-auth";
import { SessionProvider, signOut, useSession } from "next-auth/react";

import { api } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
      <SessionProvider session={session}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main>
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
        <Toaster />
      </SessionProvider>
    </>
  );
};

const Header: React.FC = () => {
  const { status } = useSession();
  const { toast } = useToast();

  const onClick = async () => {
    await signOut({ redirect: false });
    toast({
      title: "Successfully logged out",
      className: "bg-green-500 text-white",
    });
  };

  return (
    <header>
      <Link href="/">Header</Link>
      {status === "authenticated" && (
        <Button onClick={() => void onClick()}>Log Out</Button>
      )}
    </header>
  );
};

const Footer: React.FC = () => {
  return <footer className="mt-auto">Footer</footer>;
};

export default api.withTRPC(MyApp);
