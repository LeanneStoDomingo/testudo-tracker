import { TRPCError } from "@trpc/server";
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

  if (!semester) {
    throw new TRPCError({ code: "NOT_FOUND", message: "No semester found" });
  }

  return semester;
};

export default getLatestSemester;
