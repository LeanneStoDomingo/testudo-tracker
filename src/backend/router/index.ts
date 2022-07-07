import * as trpc from "@trpc/server";
import { z } from "zod";
import type { Context } from "@/backend/context";
import {
  exampleCourse,
  exampleDepartment,
  exampleGened,
  exampleProfessor,
  exampleSearch,
  groupings,
} from "@/utils/constants";

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
      return {
        name: exampleDepartment.name,
        seats: exampleDepartment.seats,
        courses: exampleDepartment.courses,
      };
    },
  })
  .query("professor", {
    input: z.object({
      slug: z.string(),
    }),
    resolve: async ({ input }) => {
      return {
        name: exampleProfessor.name,
        seats: exampleProfessor.seats,
        courses: exampleProfessor.courses,
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
