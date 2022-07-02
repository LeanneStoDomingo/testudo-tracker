import type { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/hooks/trpc";
import type { inferSSGProps } from "@/utils/types";
import { exampleDepartment } from "@/utils/constants";
import SeatsChart from "@/components/SeatsChart";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

const Department: NextPage<inferSSGProps<typeof getStaticProps>> = ({
  code,
  name,
}) => {
  const router = useRouter();

  const department = trpc.useQuery(["department", { code }]);

  if (router.isFallback) return <>Loading...</>;

  if (!department.data)
    return (
      <>
        <h1>{code}</h1>
        <p>{name}</p>
        {department.isLoading && <div>Loading...</div>}
        {department.isError && <div>Error!!!</div>}
      </>
    );

  return (
    <>
      <h1>{code}</h1>
      <p>{department.data.name}</p>
      <SeatsChart data={department.data.seats} />
      <SearchBar type="department" payload={code} />
      <ul>
        {department.data.courses.map((result) => (
          <li key={result.link}>
            <Link href={result.link}>
              <a>{result.label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Department;

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  if (!params || !params.code || typeof params.code !== "string") {
    return { notFound: true };
  }

  return {
    props: {
      code: params.code,
      name: exampleDepartment.name,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: exampleDepartment.paths.map((path) => ({ params: { code: path } })),
    fallback: true,
  };
};
