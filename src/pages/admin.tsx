import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import { getBaseUrl } from "@/utils/get-base-url";

const Admin: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const isAdmin = session?.user.role === Role.ADMIN;
  const isAuthenticated = status === "authenticated";

  const semesters = api.admin.getSemesters.useQuery(undefined, {
    enabled: isAdmin,
  });

  if (!isAuthenticated) void router.push("/");

  return (
    <>
      <Head>
        <title>Admin | Testudo Tracker</title>
      </Head>
      <h1>Admin Dashboard</h1>
      <LoadingStates
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        isError={semesters.isError}
        isLoading={semesters.isLoading}
      />
      {semesters.data?.map((semester) => (
        <div key={semester.id}>
          {semester.season} {semester.year}
        </div>
      ))}
    </>
  );
};

export default Admin;

const LoadingStates: React.FC<{
  isAuthenticated: boolean;
  isAdmin: boolean;
  isError: boolean;
  isLoading: boolean;
}> = ({ isAuthenticated, isAdmin, isError, isLoading }) => {
  if (!isAuthenticated)
    return (
      <>
        <p>Redirecting to home page...</p>
        <Link href="/" className="underline hover:font-medium">
          Click here if you are not redirected
        </Link>
      </>
    );

  if (!isAdmin) return <p>You are not authorized to view this page.</p>;

  if (isError) return <p>Error</p>;

  if (isLoading) return <p>Loading...</p>;

  return null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session)
    return {
      redirect: {
        destination:
          "/api/auth/signin?callbackUrl=" + getBaseUrl() + context.resolvedUrl,
        permanent: false,
      },
    };

  return {
    props: {
      session,
    },
  };
};
