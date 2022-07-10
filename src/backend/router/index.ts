import * as trpc from "@trpc/server";
import { z } from "zod";
import type { Context } from "@/backend/context";
import {
  exampleCourse,
  exampleDepartment,
  exampleGened,
  exampleSearch,
  groupings,
} from "@/utils/constants";
import { prisma } from "@/backend/db/client";
import getLatestSemester from "@/backend/utils/getLatestSemester";
import getSeats from "@/backend/utils/getSeats";

export const createRouter = () => {
  return trpc.router<Context>();
};

export const appRouter = createRouter()
  .query("course", {
    input: z.object({
      code: z.string(),
      selected: z.object({
        semesters: z.array(z.string()),
        professors: z.array(z.string()),
        sections: z.array(z.string()),
      }),
    }),
    resolve: ({ input }) => {
      return {
        name: exampleCourse.name,
        filters: exampleCourse.filters,
        data: exampleCourse.data,
      };
    },
  })
  .query("department", {
    input: z.object({
      code: z.string(),
    }),
    resolve: async ({ input }) => {
      const department = await prisma.department.findUniqueOrThrow({
        where: { code: input.code },
        select: {
          id: true,
          code: true,
          name: true,
          courses: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      });

      const courses = department.courses.map((course) => ({
        link: `/courses/${course.code}`,
        label: `${course.code} - ${course.name}`,
      }));

      const semester = await getLatestSemester();

      const seats = await getSeats({
        course: { department: { id: department.id } },
        semester: { id: semester.id },
      });

      return {
        name: department.name,
        code: department.code,
        courses,
        seats,
      };
    },
  })
  .query("professor", {
    input: z.object({
      slug: z.string(),
    }),
    resolve: async ({ input }) => {
      const professor = await prisma.professor.findUniqueOrThrow({
        where: { slug: input.slug },
      });

      const rawCourses = await prisma.course.findMany({
        where: {
          sections: { some: { professors: { some: { id: professor.id } } } },
        },
      });

      const courses = rawCourses.map((course) => ({
        link: `/courses/${course.code}`,
        label: `${course.code} - ${course.name}`,
      }));

      const semester = await getLatestSemester();

      const seats = await getSeats({
        professors: { some: { id: professor.id } },
        semester: { id: semester.id },
      });

      return {
        name: professor.name,
        slug: professor.slug,
        courses,
        seats,
      };
    },
  })
  .query("gened", {
    input: z.object({
      code: z.string(),
    }),
    resolve: async ({ input }) => {
      return {
        name: exampleGened.name,
        seats: exampleGened.seats,
        courses: exampleGened.courses,
      };
    },
  })
  .query("search", {
    input: z.object({
      query: z.string(),
      type: z.enum(groupings).optional(),
      payload: z.string().optional(),
      filter: z.string().optional(),
    }),
    resolve: async ({ input }) => {
      if (!!input.type && !!input.payload) {
        return exampleDepartment.courses.filter((result) => {
          return result.label.toLowerCase().includes(input.query.toLowerCase());
        });
      }

      if (!!input.filter) {
        const filter = input.filter;
        return exampleSearch.results
          .filter((result) => result.link.includes(filter))
          .filter((result) =>
            result.label.toLowerCase().includes(input.query.toLowerCase())
          );
      }

      return exampleSearch.results.filter((result) => {
        return result.label
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .includes(input.query.toLowerCase().replace(/[^a-z0-9]/g, ""));
      });
    },
  });

export type AppRouter = typeof appRouter;
