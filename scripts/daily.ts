import { PromisePool } from "@supercharge/promise-pool";
import { prisma } from "@/server/db";
import * as scraper from "@/server/scraper";
import { Season } from "@prisma/client";

const main = async () => {
  const [semester] = await prisma.semester.findMany({
    orderBy: { startDate: "desc" },
    take: 1,
  });

  if (!semester) throw new Error("Semester not found");

  const msSinceStartDate = new Date().getTime() - semester.startDate.getTime();

  const day = Math.floor(msSinceStartDate / (1000 * 3600 * 24));

  const semesterSeasonCode =
    semester.season === Season.Fall
      ? "08"
      : semester.season === Season.Spring
      ? "01"
      : undefined;

  if (!semesterSeasonCode) throw new Error("Invalid semester season");

  const semesterCode = `${semester.year}${semesterSeasonCode}`;

  const departments = await prisma.department.findMany();

  console.log("scraping for courses");

  const { results: coursesResults } = await PromisePool.for(departments)
    .withConcurrency(100)
    .process(async (department) => {
      const courses = await scraper.getCourses(semesterCode, department.code);
      return courses.map((course) => ({
        ...course,
        departmentCode: department.code,
      }));
    });

  const courses = coursesResults.flat();

  console.log("upserting courses");

  await Promise.allSettled(
    courses.map((course) => {
      return prisma.course.upsert({
        where: { code: course.code },
        update: { name: course.name, geneds: { connect: course.geneds } },
        create: {
          code: course.code,
          name: course.name,
          department: { connect: { code: course.departmentCode } },
          geneds: { connect: course.geneds },
        },
      });
    })
  );

  console.log("scraping for sections");

  const { results: sectionsResults } = await PromisePool.for(courses)
    .withConcurrency(100)
    .process(async (course) => {
      const sections = await scraper.getSections(semesterCode, course.code);
      return sections.map((section) => ({
        ...section,
        courseCode: course.code,
      }));
    });

  const sections = sectionsResults.flat();

  const professors = sections.map((section) => section.professors).flat();

  console.log("upserting professors");

  await PromisePool.for(professors)
    .withConcurrency(1)
    .process((professor) => {
      return prisma.professor.upsert({
        where: { slug: professor.slug },
        update: { name: professor.name },
        create: professor,
      });
    });

  console.log("creating days");

  await Promise.allSettled(
    sections.map((section) => {
      return prisma.day.create({
        data: {
          number: day,
          totalSeats: section.seats.total,
          openSeats: section.seats.open,
          waitlistSeats: section.seats.waitlist,
          holdfileSeats: section.seats.holdfile,
          section: {
            connectOrCreate: {
              where: {
                sectionIdentifier: {
                  code: section.code,
                  courseCode: section.courseCode,
                  semesterId: semester.id,
                },
              },
              create: {
                code: section.code,
                course: { connect: { code: section.courseCode } },
                semester: { connect: { id: semester.id } },
              },
            },
          },
        },
      });
    })
  );

  console.log("connecting professors to sections");

  await Promise.allSettled(
    sections.map((section) => {
      return prisma.section.update({
        where: {
          sectionIdentifier: {
            code: section.code,
            courseCode: section.courseCode,
            semesterId: semester.id,
          },
        },
        data: {
          professors: {
            connect: section.professors.map((professor) => ({
              slug: professor.slug,
            })),
          },
        },
      });
    })
  );
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
