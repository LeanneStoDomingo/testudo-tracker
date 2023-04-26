import { PromisePool } from "@supercharge/promise-pool";
import { Season } from "@prisma/client";

import { prisma } from "@/server/db";
import * as scraper from "@/server/scraper";

const semester = "202301";

const departments = [
  { code: "ENGL", name: "English" },
  { code: "CHEM", name: "Chemistry" },
  { code: "AAST", name: "Asian American Studies" },
];

const seats = [
  {
    number: 0,
    totalSeats: 10,
    openSeats: 10,
    waitlistSeats: 0,
    holdfileSeats: 0,
  },
  {
    number: 1,
    totalSeats: 10,
    openSeats: 7,
    waitlistSeats: 0,
    holdfileSeats: 1,
  },
  {
    number: 2,
    totalSeats: 10,
    openSeats: 3,
    waitlistSeats: 0,
    holdfileSeats: 2,
  },
  {
    number: 3,
    totalSeats: 10,
    openSeats: 0,
    waitlistSeats: 4,
    holdfileSeats: 1,
  },
  {
    number: 4,
    totalSeats: 10,
    openSeats: 0,
    waitlistSeats: 2,
    holdfileSeats: 0,
  },
  {
    number: 5,
    totalSeats: 10,
    openSeats: 1,
    waitlistSeats: 0,
    holdfileSeats: 0,
  },
];

const clear = async () => {
  await prisma.day.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.gened.deleteMany({});
  await prisma.professor.deleteMany({});
  await prisma.semester.deleteMany({});
};

const seed = async () => {
  const semesterObj = await prisma.semester.create({
    data: {
      season: Season.Spring,
      year: 2023,
      startDate: new Date(2022, 10, 27),
      endDate: new Date(2023, 2, 15),
    },
  });

  const geneds = await scraper.getGeneds();

  await Promise.allSettled([
    prisma.gened.createMany({ data: geneds }), // create geneds
    prisma.department.createMany({ data: departments }), // create departments
  ]);

  // scrape courses
  const { results: coursesByDepartments } = await PromisePool.for(departments)
    .withConcurrency(100)
    .process(async (department) => {
      try {
        const courses = await scraper.getCourses(semester, department.code);
        return { courses, departmentCode: department.code };
      } catch {
        console.log({ department });
        process.exit(1);
      }
    });

  const coursesWithDepartment = coursesByDepartments
    .map((department) => {
      return department.courses.map((course) => {
        return { ...course, departmentCode: department.departmentCode };
      });
    })
    .flat();

  // create courses
  await PromisePool.for(coursesWithDepartment)
    .withConcurrency(100)
    .process(async (course) => {
      try {
        return await prisma.course.create({
          data: {
            code: course.code,
            name: course.name,
            department: { connect: { code: course.departmentCode } },
            geneds: { connect: course.geneds },
          },
        });
      } catch {
        console.log({ course });
        process.exit(1);
      }
    });

  const courses = coursesByDepartments
    .map((department) => department.courses)
    .flat();

  // scrape sections
  const { results: sectionsByCourses } = await PromisePool.for(courses)
    .withConcurrency(100)
    .process(async (course) => {
      try {
        const sections = await scraper.getSections(semester, course.code);
        return { sections, course: course.code };
      } catch {
        console.log({ course });
        process.exit(1);
      }
    });

  const professors = sectionsByCourses
    .map((sectionByCourse) => sectionByCourse.sections)
    .flat()
    .map((section) => section.professors)
    .flat();

  // create professors
  await prisma.professor.createMany({ data: professors, skipDuplicates: true });

  const sections = sectionsByCourses
    .map((sectionByCourse) => {
      return sectionByCourse.sections.map((section) => {
        return {
          sectionCode: section.code,
          courseCode: sectionByCourse.course,
          professors: section.professors.map((professor) => ({
            slug: professor.slug,
          })),
        };
      });
    })
    .flat();

  // create sections
  await PromisePool.for(sections)
    .withConcurrency(100)
    .process(async (section) => {
      try {
        return await prisma.section.create({
          data: {
            code: section.sectionCode,
            course: { connect: { code: section.courseCode } },
            semester: { connect: { id: semesterObj.id } },
            professors: { connect: section.professors },
            days: { createMany: { data: seats } },
          },
        });
      } catch {
        console.log({ section });
        process.exit(1);
      }
    });
};

const main = async () => {
  await clear();
  await seed();
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
