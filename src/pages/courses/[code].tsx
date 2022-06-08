import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import SeatsChart from "@/components/SeatsChart";

const Course = ({
  code,
  name,
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  if (router.isFallback) return <>Loading...</>;

  return (
    <>
      <h1>{code}</h1>
      <p>{name}</p>
      <SeatsChart data={data} />
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
      data: [
        {
          label: "Total",
          data: [
            { day: 0, seats: 10 },
            { day: 1, seats: 10 },
            { day: 2, seats: 10 },
            { day: 3, seats: 10 },
            { day: 4, seats: 10 },
            { day: 5, seats: 10 },
          ],
        },
        {
          label: "Open",
          data: [
            { day: 0, seats: 10 },
            { day: 1, seats: 7 },
            { day: 2, seats: 3 },
            { day: 3, seats: 0 },
            { day: 4, seats: 0 },
            { day: 5, seats: 1 },
          ],
        },
        {
          label: "Waitlist",
          data: [
            { day: 0, seats: 0 },
            { day: 1, seats: 0 },
            { day: 2, seats: 0 },
            { day: 3, seats: 4 },
            { day: 4, seats: 2 },
            { day: 5, seats: 0 },
          ],
        },
        {
          label: "Holdfile",
          data: [
            { day: 0, seats: 0 },
            { day: 1, seats: 1 },
            { day: 2, seats: 2 },
            { day: 3, seats: 1 },
            { day: 4, seats: 0 },
            { day: 5, seats: 0 },
          ],
        },
      ],
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
