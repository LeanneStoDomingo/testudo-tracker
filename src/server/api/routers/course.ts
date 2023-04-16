import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const courseRouter = createTRPCRouter({
  getName: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: { code: input.code },
        select: { name: true },
      });

      if (!course)
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });

      return course;
    }),

  getSeats: publicProcedure
    .input(
      z.object({
        code: z.string(),
        semester: z.string(),
        professor: z.string(),
        section: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      let inputSemesterId = input.semester;

      if (!inputSemesterId) {
        const [latestSemester] = await ctx.prisma.semester.findMany({
          select: { id: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        });

        if (!latestSemester)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Latest semester not found",
          });

        inputSemesterId = latestSemester.id;
      }

      const days = await ctx.prisma.day.groupBy({
        by: ["number"],
        where: {
          section: {
            course: { code: input.code },
            semester: { id: inputSemesterId },
            code: input.section || undefined,
            professors: !!input.professor
              ? { some: { slug: input.professor } }
              : undefined,
          },
        },
        _sum: {
          totalSeats: true,
          openSeats: true,
          waitlistSeats: true,
          holdfileSeats: true,
        },
      });

      const seats = days.map(({ number, _sum }) => {
        return {
          day: number,
          Total: _sum.totalSeats ?? 0,
          Open: _sum.openSeats ?? 0,
          Waitlist: _sum.waitlistSeats ?? 0,
          Holdfile: _sum.holdfileSeats ?? 0,
        };
      });

      return seats;
    }),

  getFilters: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findFirst({
        where: { code: input.code },
        select: {
          sections: {
            select: {
              id: true,
              code: true,
              professors: true,
              semester: { select: { id: true, season: true, year: true } },
            },
          },
        },
      });

      if (!course)
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });

      const sections = new Set(course.sections.map((section) => section.code));

      const professors: Map<string, string> = new Map();

      course.sections.forEach((section) => {
        section.professors.forEach((professor) => {
          professors.set(professor.slug, professor.name);
        });
      });

      const semesters: Map<
        string,
        {
          id: string;
          professors: Map<string, { name: string; sections: Set<string> }>;
        }
      > = new Map();

      course.sections.forEach((section) => {
        const semesterName = `${section.semester.season} ${section.semester.year}`;

        const semesterProfessors = new Map(
          semesters.get(semesterName)?.professors
        );

        section.professors.forEach(({ slug, name }) => {
          const professorSections = new Set(
            semesterProfessors.get(slug)?.sections
          );
          semesterProfessors.set(slug, {
            name,
            sections: professorSections.add(section.code),
          });
        });

        semesters.set(semesterName, {
          id: section.semester.id,
          professors: semesterProfessors,
        });
      });

      const [latestSemester] = await ctx.prisma.semester.findMany({
        select: { id: true, season: true, year: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      });

      if (!latestSemester)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Latest semester not found",
        });

      return {
        semesters,
        professors,
        sections,
        latestSemester: {
          id: latestSemester.id,
          name: `${latestSemester.season} ${latestSemester.year}`,
        },
      };
    }),
});
