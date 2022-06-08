import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";

const Course = ({
  code,
  name,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  if (router.isFallback) return <>Loading...</>;

  return (
    <>
      <h1>{code}</h1>
      <p>{name}</p>
    </>
  );
};

export default Course;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) return { notFound: true };

  return {
    props: {
      code: params.code,
      name: "Object-Oriented Programming II",
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = ["CMSC132"];

  return {
    paths: paths.map((path) => ({ params: { code: path } })),
    fallback: true,
  };
};
