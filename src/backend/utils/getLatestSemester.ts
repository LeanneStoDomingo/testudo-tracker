import type { Context } from "@/backend/context";

interface Args {
  ctx: Context;
}

const getLatestSemester = async ({ ctx }: Args) => {
  const [semester] = await ctx.prisma.semester.findMany({
    where: { endDate: { lt: new Date() } },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  return semester;
};

export default getLatestSemester;
