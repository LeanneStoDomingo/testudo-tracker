import type { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { trpc } from "@/hooks/trpc";
import type { inferSSGProps } from "@/utils/types";
import { exampleGened } from "@/utils/constants";
import SeatsChart from "@/components/SeatsChart";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { prisma } from "@/backend/db/client";

const Gened: NextPage<inferSSGProps<typeof getStaticProps>> = ({
  code,
  name,
}) => {
  const router = useRouter();

  const gened = trpc.useQuery(["gened", { code }], {
    enabled: !!code,
  });

  if (router.isFallback) return <>Loading...</>;

  if (!gened.data)
    return (
      <>
        <NextSeo title={code} />
        <h1>{code}</h1>
        <p>{name}</p>
        {gened.isLoading && <div>Loading...</div>}
        {gened.isError && <div>Error!!!</div>}
      </>
    );

  return (
    <>
      <NextSeo title={code} />
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
  if (!params?.code || typeof params.code !== "string") {
    return { notFound: true };
  }

  const gened = await prisma.gened.findUnique({
    where: { code: params.code },
    select: {
      code: true,
      name: true,
    },
  });

  if (!gened) return { notFound: true };

  return {
    props: {
      code: gened.code,
      name: gened.name,
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const geneds = await prisma.gened.findMany({
    select: { code: true },
  });

  return {
    paths: geneds.map((gened) => ({ params: { code: gened.code } })),
    fallback: true,
  };
};
