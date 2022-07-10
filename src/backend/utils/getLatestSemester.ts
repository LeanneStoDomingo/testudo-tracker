import { prisma } from "@/backend/db/client";

const getLatestSemester = async () => {
  const [semester] = await prisma.semester.findMany({
    where: { endDate: { lt: new Date() } },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  return semester;
};

export default getLatestSemester;
