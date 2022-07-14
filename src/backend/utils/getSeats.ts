import type { Prisma } from "@prisma/client";
import type { ISeries } from "@/utils/types";
import type { Context } from "@/backend/context";

interface Args {
  ctx: Context;
  section: Prisma.DayWhereInput["section"];
}

const getSeats = async ({ ctx, section }: Args) => {
  const groupedSeats = await ctx.prisma.day.groupBy({
    by: ["number"],
    where: { section },
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

  return seats;
};

export default getSeats;
