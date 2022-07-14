import * as trpc from "@trpc/server";
import { z } from "zod";
import type { Context } from "@/backend/context";
import {
  exampleCourse,
  exampleDepartment,
  exampleSearch,
  groupings,
} from "@/utils/constants";
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
    resolve: async ({ ctx, input }) => {
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
    resolve: async ({ ctx, input }) => {
      const department = await ctx.prisma.department.findUniqueOrThrow({
        where: { code: input.code },
        select: {
          id: true,
          code: true,
          name: true,
          courses: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
        },
      });

      const courses = department.courses.map((course) => ({
        id: course.id,
        link: `/courses/${course.code}`,
        label: `${course.code} - ${course.name}`,
      }));

      const semester = await getLatestSemester({ ctx });

      const seats = await getSeats({
        ctx,
        section: {
          course: { department: { id: department.id } },
          semester: { id: semester.id },
        },
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
    resolve: async ({ ctx, input }) => {
      const professor = await ctx.prisma.professor.findUniqueOrThrow({
        where: { slug: input.slug },
      });

      const rawCourses = await ctx.prisma.course.findMany({
        where: {
          sections: { some: { professors: { some: { id: professor.id } } } },
        },
        select: {
          id: true,
          code: true,
          name: true,
        },
      });

      const courses = rawCourses.map((course) => ({
        id: course.id,
        link: `/courses/${course.code}`,
        label: `${course.code} - ${course.name}`,
      }));

      const semester = await getLatestSemester({ ctx });

      const seats = await getSeats({
        ctx,
        section: {
          professors: { some: { id: professor.id } },
          semester: { id: semester.id },
        },
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
    resolve: async ({ ctx, input }) => {
      const gened = await ctx.prisma.gened.findUniqueOrThrow({
        where: { code: input.code },
      });

      const rawCourses = await ctx.prisma.course.findMany({
        where: { geneds: { some: { id: gened.id } } },
        select: {
          id: true,
          code: true,
          name: true,
        },
      });

      const courses = rawCourses.map((course) => ({
        id: course.id,
        link: `/courses/${course.code}`,
        label: `${course.code} - ${course.name}`,
      }));

      const semester = await getLatestSemester({ ctx });

      const seats = await getSeats({
        ctx,
        section: {
          course: { geneds: { some: { id: gened.id } } },
          semester: { id: semester.id },
        },
      });
      return {
        name: gened.name,
        code: gened.code,
        courses,
        seats,
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
    resolve: async ({ ctx, input }) => {
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
