import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { exampleCourse, exampleSearch } from "@/utils/constants";

export const appRouter = trpc
  .router()
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
        name: exampleCourse.name,
        filters: exampleCourse.filters,
        data: exampleCourse.data,
      };
    },
  })
  .query("search", {
    input: z.object({
      query: z.string(),
    }),
    resolve: async ({ input }) => {
      return exampleSearch.results.filter((result) => {
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
