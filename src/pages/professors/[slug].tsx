import type { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { exampleProfessor } from "@/utils/constants";
import type { inferSSGProps } from "@/utils/types";
import { trpc } from "@/hooks/trpc";
import SeatsChart from "@/components/SeatsChart";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";

const Professor: NextPage<inferSSGProps<typeof getStaticProps>> = ({
  slug,
  name,
}) => {
  const router = useRouter();

  const professor = trpc.useQuery(["professor", { slug }]);

  if (router.isFallback) return <>Loading...</>;

  if (!professor.data)
    return (
      <>
        <h1>{name}</h1>
        {professor.isLoading && <div>Loading...</div>}
        {professor.isError && <div>Error!!!</div>}
      </>
    );

  return (
    <>
      <h1>{name}</h1>
      <SeatsChart data={professor.data.seats} />
      <SearchBar type="professor" payload={slug} />
      <SearchResults results={professor.data.courses} />
    </>
  );
};

export default Professor;

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  if (!params || !params.slug || typeof params.slug !== "string") {
    return { notFound: true };
  }

  return {
    props: {
      slug: params.slug,
      name: exampleProfessor.name,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: exampleProfessor.paths.map((path) => ({ params: { slug: path } })),
    fallback: true,
  };
};
