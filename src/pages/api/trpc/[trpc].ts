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
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
});
