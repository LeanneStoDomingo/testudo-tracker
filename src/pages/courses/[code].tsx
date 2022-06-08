import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { Listbox } from "@headlessui/react";
import SeatsChart from "@/components/SeatsChart";
import useFilters from "@/hooks/useFilters";

const Course = ({
  code,
  name,
  filters,
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  const { categories, options, selected, setSelected, clearSelected } =
    useFilters(filters);

  if (router.isFallback) return <>Loading...</>;

  return (
    <>
      <h1>{code}</h1>
      <p>{name}</p>
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
              {options[category].map((option) => (
                <Listbox.Option
                  key={option.key}
                  value={option.value}
                  disabled={option.disabled}
                  className={option.disabled ? "text-gray-500" : ""}
                >
                  {option.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
          <button onClick={clearSelected(category)}>Clear</button>
        </div>
      ))}
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
      filters: {
        semesters: [
          {
            label: "Fall 2021",
            professors: ["larry-herman", "fawzi-emad"],
            sections: ["0101", "0102", "0201", "0202"],
          },
          {
            label: "Spring 2022",
            professors: ["larry-herman", "fawzi-emad"],
            sections: ["0201", "0202", "0301", "0302"],
          },
        ],
        professors: [
          {
            label: "larry-herman",
            semesters: ["Fall 2021", "Spring 2022"],
            sections: ["0101", "0102", "0201", "0202"],
          },
          {
            label: "fawzi-emad",
            semesters: ["Fall 2021", "Spring 2022"],
            sections: ["0201", "0202", "0301", "0302"],
          },
        ],
        sections: [
          {
            label: "0101",
            professors: ["larry-herman"],
            semesters: ["Fall 2021"],
          },
          {
            label: "0102",
            professors: ["larry-herman"],
            semesters: ["Fall 2021"],
          },
          {
            label: "0201",
            professors: ["larry-herman", "fawzi-emad"],
            semesters: ["Fall 2021", "Spring 2022"],
          },
          {
            label: "0202",
            professors: ["larry-herman", "fawzi-emad"],
            semesters: ["Fall 2021", "Spring 2022"],
          },
          {
            label: "0301",
            professors: ["fawzi-emad"],
            semesters: ["Spring 2022"],
          },
          {
            label: "0302",
            professors: ["fawzi-emad"],
            semesters: ["Spring 2022"],
          },
        ],
      },
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
