import { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { Listbox } from "@headlessui/react";
import { trpc } from "@/hooks/trpc";
import getOptions from "@/utils/getOptions";
import SeatsChart from "@/components/SeatsChart";
import useSelectedOptions from "@/hooks/useSelectedOptions";
import { categories, exampleCourse } from "@/utils/constants";
import type { inferSSGProps } from "@/utils/types";

const Course: NextPage<inferSSGProps<typeof getStaticProps>> = ({
  code,
  name,
}) => {
  const router = useRouter();

  const { selected, setSelected, clearSelected } = useSelectedOptions();

  const course = trpc.useQuery(["course.data", { code, selected }]);

  if (router.isFallback) return <>Loading...</>;

  if (!course.data)
    return (
      <>
        <h1>{code}</h1>
        <p>{name}</p>
        {course.isLoading && <div>Loading...</div>}
        {course.isError && <div>Error!!!</div>}
      </>
    );

  return (
    <>
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
  if (!params || !params.code || typeof params.code !== "string") {
    return { notFound: true };
  }

  return {
    props: {
      code: params.code,
      name: exampleCourse.name,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: exampleCourse.paths.map((path) => ({ params: { code: path } })),
    fallback: true,
  };
};
