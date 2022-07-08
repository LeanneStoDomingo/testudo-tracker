import { prisma } from "../src/backend/db/client";

const main = async () => {
  await prisma.day.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.professor.deleteMany({});
  await prisma.gened.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.semester.deleteMany({});
};

export default main;

main();
