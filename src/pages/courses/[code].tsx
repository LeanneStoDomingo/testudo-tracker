import { useState } from "react";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "@/utils/api";
import { generateSSGHelper } from "@/server/ssg-helper";
import { Combobox } from "@/components/ui/combobox";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

const Course: NextPage<{ code: string }> = ({ code }) => {
  const course = api.course.getName.useQuery({ code });

  if (course.isLoading) return <>Loading...</>;

  if (!course.data) return <>Course not found</>;

  return (
    <>
      <Head>
        <title>{code} | Testudo Tracker</title>
      </Head>
      <h1>{code}</h1>
      <p>{course.data.name}</p>
      <ChartWithFilters code={code} />
    </>
  );
};

export default Course;

const ChartWithFilters: React.FC<{ code: string }> = ({ code }) => {
  const [semester, setSemester] = useState({ value: "", id: "" });
  const [professor, setProfessor] = useState({ value: "", slug: "" });
  const [section, setSection] = useState("");

  const filters = api.course.getFilters.useQuery({ code });

  const seats = api.course.getSeats.useQuery(
    {
      code,
      semester: semester.id,
      professor: professor.slug,
      section,
    },
    { keepPreviousData: true }
  );

  return (
    <>
      {filters.isLoading ? (
        <Skeleton className="h-10 w-2/3" />
      ) : !filters.data ? (
        <>No filters</>
      ) : (
        <div className="flex items-center">
          <Combobox
            buttonText="Select semester..."
            placeholder="Search semester..."
            emptyMessage="No semester found"
            options={Array.from(
              filters.data.semesters,
              ([name, { professors }]) => {
                const isDisabledByProfessor =
                  !!professor.slug && !professors.get(professor.slug);
                const isDisabledBySection =
                  !!section &&
                  !Array.from(professors.values()).some(({ sections }) =>
                    sections.has(section)
                  );

                return {
                  label: name,
                  value: name.toLowerCase(),
                  disabled:
                    semester.value !== name.toLowerCase() &&
                    (isDisabledByProfessor || isDisabledBySection),
                };
              }
            )}
            value={
              semester.value || filters.data.latestSemester.name.toLowerCase()
            }
            setValue={(v) => {
              setSemester({
                value: v || filters.data.latestSemester.name.toLowerCase(),
                id:
                  Array.from(filters.data.semesters).find(
                    ([name]) => name.toLowerCase() === v
                  )?.[1].id ?? filters.data.latestSemester.id,
              });
            }}
          />
          <Combobox
            buttonText="Select professor..."
            placeholder="Search professor..."
            emptyMessage="No professor found..."
            options={Array.from(
              filters.data.professors,
              ([professorOptionSlug, professorOptionName]) => {
                const [, selectedSemester] =
                  Array.from(filters.data.semesters).find(
                    ([name]) =>
                      name.toLowerCase() ===
                      (semester.value ||
                        filters.data.latestSemester.name.toLowerCase())
                  ) ?? [];
                const isDisabledBySemester =
                  !!selectedSemester &&
                  !selectedSemester.professors.get(professorOptionSlug);
                const isDisabledBySection =
                  !!section &&
                  !Array.from(filters.data.semesters.values()).some(
                    ({ professors }) =>
                      professors.get(professorOptionSlug)?.sections.has(section)
                  );

                return {
                  label: professorOptionName,
                  value: professorOptionName.toLowerCase(),
                  disabled:
                    professorOptionName.toLowerCase() !== professor.value &&
                    (isDisabledBySemester || isDisabledBySection),
                };
              }
            )}
            value={professor.value}
            setValue={(v) => {
              setProfessor({
                value: v,
                slug:
                  Array.from(filters.data.professors).find(
                    ([, name]) => name.toLowerCase() === v
                  )?.[0] ?? "",
              });
            }}
          />
          <Combobox
            buttonText="Select section..."
            placeholder="Search section..."
            emptyMessage="No section found"
            options={Array.from(filters.data.sections, (sectionOption) => {
              const [, selectedSemester] =
                Array.from(filters.data.semesters).find(
                  ([name]) =>
                    name.toLowerCase() ===
                    (semester.value ||
                      filters.data.latestSemester.name.toLowerCase())
                ) ?? [];
              const isDisabledBySemester =
                !!selectedSemester &&
                !Array.from(selectedSemester.professors.values()).some(
                  ({ sections }) => sections.has(sectionOption)
                );
              const isDisabledByProfessor =
                !!professor.slug &&
                !Array.from(filters.data.semesters.values()).some(
                  ({ professors }) =>
                    professors.get(professor.slug)?.sections.has(sectionOption)
                );

              return {
                label: sectionOption,
                value: sectionOption,
                disabled:
                  sectionOption !== section &&
                  (isDisabledBySemester || isDisabledByProfessor),
              };
            })}
            value={section}
            setValue={setSection}
          />
          {seats.isFetching && <Spinner />}
        </div>
      )}
      <div className="h-[70vh] w-full">
        {seats.isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : !seats.data ? (
          <>No seats</>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={seats.data}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  const dayNumber = label as string;

                  return (
                    active &&
                    payload &&
                    payload.length && (
                      <div className="bg-white p-2">
                        <p>{`Day ${dayNumber}`}</p>
                        {payload.map((p) => {
                          const payloadName = p.name as string;
                          const payloadValue = p.value as string;

                          return (
                            <p key={payloadName} style={{ color: p.color }}>
                              {`${payloadName}: ${payloadValue}`}
                            </p>
                          );
                        })}
                      </div>
                    )
                  );
                }}
              />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Line type="monotone" dataKey="Total" stroke="#49AAF3" />
              <Line type="monotone" dataKey="Open" stroke="#43E669" />
              <Line type="monotone" dataKey="Waitlist" stroke="#E64343" />
              <Line type="monotone" dataKey="Holdfile" stroke="#9943E6" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const code = context.params?.code;

  if (typeof code !== "string") throw new Error("Invalid course code");

  const ssg = generateSSGHelper();

  await ssg.course.getName.prefetch({ code });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      code,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
