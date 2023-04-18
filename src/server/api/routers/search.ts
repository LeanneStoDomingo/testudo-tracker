import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";

export const searchRouter = publicProcedure
  .input(z.object({ query: z.string() }))
  .query(async ({ ctx, input }) => {
    const courses = await ctx.prisma.course.findMany({
      where: {
        OR: [
          {
            name: { contains: input.query },
          },
          {
            code: { contains: input.query },
          },
        ],
      },
      select: {
        code: true,
        name: true,
      },
    });

    const departments = await ctx.prisma.department.findMany({
      where: {
        OR: [
          {
            name: { contains: input.query },
          },
          {
            code: { contains: input.query },
          },
        ],
      },
    });

    const professors = await ctx.prisma.professor.findMany({
      where: {
        OR: [
          {
            name: { contains: input.query },
          },
          {
            slug: { contains: input.query },
          },
        ],
      },
    });

    const geneds = await ctx.prisma.gened.findMany({
      where: {
        OR: [
          {
            code: { contains: input.query },
          },
          {
            name: { contains: input.query },
          },
        ],
      },
    });

    return [
      ...departments.map((department) => ({
        label: `${department.code} ${department.name}`,
        link: `/departments/${department.code}`,
        type: "department",
      })),
      ...courses.map((course) => ({
        label: `${course.code} ${course.name}`,
        link: `/courses/${course.code}`,
        type: "course",
      })),
      ...professors.map((professor) => ({
        label: professor.name,
        link: `/professors/${professor.slug}`,
        type: "professor",
      })),
      ...geneds.map((gened) => ({
        label: `${gened.code} ${gened.name}`,
        link: `/geneds/${gened.code}`,
        type: "gened",
      })),
    ];
  });
