import type { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { trpc } from "@/hooks/trpc";
import type { inferSSGProps } from "@/utils/types";
import { exampleDepartment } from "@/utils/constants";
import SeatsChart from "@/components/SeatsChart";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { prisma } from "@/backend/db/client";

const Department: NextPage<inferSSGProps<typeof getStaticProps>> = ({
  code,
  name,
}) => {
  const router = useRouter();

  const department = trpc.useQuery(["department", { code }], {
    enabled: !!code,
  });

  if (router.isFallback) return <>Loading...</>;

  if (!department.data)
    return (
      <>
        <NextSeo title={code} />
        <h1>{code}</h1>
        <p>{name}</p>
        {department.isLoading && <div>Loading...</div>}
        {department.isError && <div>Error!!!</div>}
      </>
    );

  return (
    <>
      <NextSeo title={code} />
      <h1>{code}</h1>
      <p>{department.data.name}</p>
      <SeatsChart data={department.data.seats} />
      <SearchBar type="department" payload={code} />
      <SearchResults results={department.data.courses} />
    </>
  );
};

export default Department;

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  if (!params?.code || typeof params.code !== "string") {
    return { notFound: true };
  }

  const department = await prisma.department.findUnique({
    where: { code: params.code },
    select: {
      code: true,
      name: true,
    },
  });

  if (!department) return { notFound: true };

  return {
    props: {
      code: department.code,
      name: department.name,
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: exampleDepartment.paths.map((path) => ({ params: { code: path } })),
    fallback: true,
  };
};
