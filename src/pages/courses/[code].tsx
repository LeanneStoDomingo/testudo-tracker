import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import SeatsChart from "@/components/SeatsChart";

interface IOption {
  label: string;
  professors?: string[];
  semesters?: string[];
  sections?: string[];
}

const categories = ["semesters", "professors", "sections"] as const;
type TCategory = typeof categories[number];

interface IState {
  [key: string]: string[];
}

interface IAction {
  type: string;
  category: string;
  payload: string;
}

type TReducer = (state: IState, action: IAction) => IState;

interface IReduce {
  [key: string]: TReducer;
}

const initialState = {
  semesters: [],
  professors: [],
  sections: [],
};

const reduce: IReduce = {
  select: (state, action) => ({
    ...state,
    [action.category]: [...state[action.category], action.payload],
  }),
  deselect: (state, action) => ({
    ...state,
    [action.category]: [...state[action.category]].splice(
      state[action.category].indexOf(action.payload),
      1
    ),
  }),
};

const reducer: TReducer = (state, action) => {
  return reduce[action.type](state, action);
};

const Course = ({
  code,
  name,
  filters,
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  const [selected, dispatch] = useReducer(reducer, initialState);

  const getOptions = (category: TCategory) =>
    filters[category].map((elt: IOption) => ({
      value: elt.label,
      label: elt.label,
      disabled: categories
        .filter((item) => item !== category)
        .reduce(
          (acc, curr) =>
            acc ||
            selected[curr].reduce((a, c) => a || c in selected[curr], false),
          false
        ),
    }));

  const options = Object.fromEntries(
    categories.map((c) => {
      return [c, getOptions(c)];
    })
  );

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
