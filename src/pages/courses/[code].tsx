import type { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { Listbox } from "@headlessui/react";
import { trpc } from "@/hooks/trpc";
import getOptions from "@/utils/getOptions";
import SeatsChart from "@/components/SeatsChart";
import useSelectedOptions from "@/hooks/useSelectedOptions";
import { categories, exampleCourse } from "@/utils/constants";
import type { inferSSGProps } from "@/utils/types";
import { prisma } from "@/backend/db/client";

const Course: NextPage<inferSSGProps<typeof getStaticProps>> = ({
  code,
  name,
}) => {
  const router = useRouter();

  const { selected, setSelected, clearSelected } = useSelectedOptions();

  const course = trpc.useQuery(["course", { code, selected }], {
    enabled: !!code && !!selected,
  });

  if (router.isFallback) return <>Loading...</>;

  if (!course.data)
    return (
      <>
        <NextSeo title={code} />
        <h1>{code}</h1>
        <p>{name}</p>
        {course.isLoading && <div>Loading...</div>}
        {course.isError && <div>Error!!!</div>}
      </>
    );

  return (
    <>
      <NextSeo title={code} />
      <h1>{code}</h1>
      <p>{course.data.name}</p>
      {categories.map((category) => (
        <div key={category}>
          <Listbox
            value={selected[category]}
            onChange={setSelected(category)}
            multiple
          >
            <Listbox.Button>
              {selected[category].join(", ") || "None selected"}
            </Listbox.Button>
            <Listbox.Options>
              {getOptions(course.data.filters, selected)[category].map(
                (option) => (
                  <Listbox.Option
                    key={option.key}
                    value={option.value}
                    disabled={option.disabled}
                    className={option.disabled ? "text-gray-500" : ""}
                  >
                    {option.label}
                  </Listbox.Option>
                )
              )}
            </Listbox.Options>
          </Listbox>
          <button onClick={clearSelected(category)}>Clear</button>
        </div>
      ))}
      <SeatsChart data={course.data.data} />
    </>
  );
};

export default Course;

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  if (!params?.code || typeof params.code !== "string") {
    return { notFound: true };
  }

  const course = await prisma.course.findUnique({
    where: { code: params.code },
    select: {
      code: true,
      name: true,
    },
  });

  if (!course) return { notFound: true };

  return {
    props: {
      code: course.code,
      name: course.name,
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: exampleCourse.paths.map((path) => ({ params: { code: path } })),
    fallback: true,
  };
};
