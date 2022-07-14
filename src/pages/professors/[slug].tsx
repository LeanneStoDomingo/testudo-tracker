import type { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { exampleProfessor } from "@/utils/constants";
import type { inferSSGProps } from "@/utils/types";
import { trpc } from "@/hooks/trpc";
import SeatsChart from "@/components/SeatsChart";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { prisma } from "@/backend/db/client";

const Professor: NextPage<inferSSGProps<typeof getStaticProps>> = ({
  slug,
  name,
}) => {
  const router = useRouter();

  const professor = trpc.useQuery(["professor", { slug }], {
    enabled: !!slug,
  });

  if (router.isFallback) return <>Loading...</>;

  if (!professor.data)
    return (
      <>
        <NextSeo title={name} />
        <h1>{name}</h1>
        {professor.isLoading && <div>Loading...</div>}
        {professor.isError && <div>Error!!!</div>}
      </>
    );

  return (
    <>
      <NextSeo title={name} />
      <h1>{name}</h1>
      <SeatsChart data={professor.data.seats} />
      <SearchBar type="professor" payload={slug} />
      <SearchResults results={professor.data.courses} />
    </>
  );
};

export default Professor;

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  if (!params?.slug || typeof params.slug !== "string") {
    return { notFound: true };
  }

  const professor = await prisma.professor.findUnique({
    where: { slug: params.slug },
    select: {
      slug: true,
      name: true,
    },
  });

  if (!professor) return { notFound: true };

  return {
    props: {
      slug: professor.slug,
      name: professor.name,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: exampleProfessor.paths.map((path) => ({ params: { slug: path } })),
    fallback: true,
  };
};
