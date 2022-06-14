import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { name, filters, data } from "@/utils/exampleCourse";

export const appRouter = trpc
  .router()
  .query("course.info", {
    input: z.object({
      code: z.string(),
    }),
    resolve: ({ input }) => {
      return {
        code: input.code,
        name,
      };
    },
  })
  .query("course.data", {
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
        name,
        filters,
        data,
      };
    },
  })
  .query("search", {
    input: z.object({
      query: z.string(),
    }),
    resolve: async ({ input }) => {
      const results = [
        {
          label: "CMSC132 Object-Oriented Programming II",
          link: "/courses/CMSC132",
        },
        {
          label: "AAST443 Asian American Politics",
          link: "/courses/AAST443",
        },
        {
          label: "MATH241 Calculus II",
          link: "/courses/MATH241",
        },
      ];
      return results.filter((result) => {
        return result.label
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .includes(input.query.toLowerCase().replace(/[^a-z0-9]/g, ""));
      });
    },
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
});
