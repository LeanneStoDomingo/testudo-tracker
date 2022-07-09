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
import { prisma } from "@/backend/db/client";
import type { ISeries } from "@/utils/types";

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

      const [semester] = await prisma.semester.findMany({
        where: { endDate: { lt: new Date() } },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true },
      });

      const groupedSeats = await prisma.day.groupBy({
        by: ["number"],
        where: {
          section: {
            course: { department: { id: department.id } },
            semester: { id: semester.id },
          },
        },
        _sum: {
          totalSeats: true,
          openSeats: true,
          waitlistSeats: true,
          holdfileSeats: true,
        },
      });

      const seats: ISeries[] = [
        {
          label: "Total",
          data: [],
        },
        {
          label: "Open",
          data: [],
        },
        {
          label: "Waitlist",
          data: [],
        },
        {
          label: "Holdfile",
          data: [],
        },
      ];

      groupedSeats.forEach(({ number, _sum }) => {
        seats[0].data.push({ day: number, seats: _sum.totalSeats ?? 0 });
        seats[1].data.push({ day: number, seats: _sum.openSeats ?? 0 });
        seats[2].data.push({ day: number, seats: _sum.waitlistSeats ?? 0 });
        seats[3].data.push({ day: number, seats: _sum.holdfileSeats ?? 0 });
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
