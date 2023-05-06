import { z } from "zod";
import { type Season as TSeason, Season } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({
  getSemesters: adminProcedure.query(({ ctx }) => {
    return ctx.prisma.semester.findMany({});
  }),
  createSemester: adminProcedure
    .input(
      z.object({
        season: z.enum([
          Season.Fall,
          Season.Spring,
        ]) satisfies z.ZodType<TSeason>,
        year: z.number().int().positive().finite().safe(),
        startDate: z.date().min(new Date()),
        endDate: z.date().min(new Date()),
      })
    )
    .mutation(({ ctx, input }) => {
      if (input.endDate < input.startDate)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Semester end date must be after start date",
        });

      return ctx.prisma.semester.create({ data: input });
    }),
});
