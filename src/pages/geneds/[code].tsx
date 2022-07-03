import type { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/hooks/trpc";
import type { inferSSGProps } from "@/utils/types";
import { exampleGened } from "@/utils/constants";
import SeatsChart from "@/components/SeatsChart";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";

const Gened: NextPage<inferSSGProps<typeof getStaticProps>> = ({
  code,
  name,
}) => {
  const router = useRouter();

  const gened = trpc.useQuery(["gened", { code }]);

  if (router.isFallback) return <>Loading...</>;

  if (!gened.data)
    return (
      <>
        <h1>{code}</h1>
        <p>{name}</p>
        {gened.isLoading && <div>Loading...</div>}
        {gened.isError && <div>Error!!!</div>}
      </>
    );

  return (
    <>
      <h1>{code}</h1>
      <p>{gened.data.name}</p>
      <SeatsChart data={gened.data.seats} />
      <SearchBar type="gened" payload={code} />
      <SearchResults results={gened.data.courses} />
    </>
  );
};

export default Gened;

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  if (!params || !params.code || typeof params.code !== "string") {
    return { notFound: true };
  }

  return {
    props: {
      code: params.code,
      name: exampleGened.name,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: exampleGened.paths.map((path) => ({ params: { code: path } })),
    fallback: true,
  };
};
