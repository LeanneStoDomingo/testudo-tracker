import { prisma } from "../src/backend/db/client";
import * as scraper from "./scraper";
import clear from "./clear-db";

const main = async () => {
  await clear();

  console.log("Cleared database");

  const semester = "202208";

  const semesterObj = await prisma.semester.create({
    data: {
      season: "Fall",
      year: 2022,
      startDate: new Date(2022, 2, 1),
      endDate: new Date(2022, 8, 10),
    },
  });

  console.log("Created semester");

  const geneds = await scraper.getGeneds();

  const genedPromises = geneds.map((gened) => async () => {
    console.log("Creating gened:", gened.code);

    await prisma.gened.create({
      data: gened,
    });
  });

  for (const promise of genedPromises) {
    await promise();
  }

  console.log("Created geneds");

  const departments = [
    { code: "CMSC", name: "Computer Science" },
    { code: "ENGL", name: "English" },
    { code: "CHEM", name: "Chemistry" },
  ];

  const departmentPromises = departments.map((department) => async () => {
    console.log("Creating department:", department.code);

    const departmentObj = await prisma.department.create({
      data: department,
    });
    const courses = await scraper.getCourses(semester, department.code);

    const coursePromises = courses.map((course) => async () => {
      console.log("Creating course:", course.code);

      const courseObj = await prisma.course.create({
        data: {
          code: course.code,
          name: course.name,
          department: { connect: { id: departmentObj.id } },
          geneds: { connect: course.geneds },
        },
      });

      const sections = await scraper.getSections(semester, course.code);

      const sectionPromises = sections.map((section) => async () => {
        console.log("Creating section:", section.code);

        const professorPromises = section.professors.map(
          (professor) => async () => {
            console.log("Creating professor:", professor.slug);

            await prisma.professor.upsert({
              where: { slug: professor.slug },
              update: professor,
              create: professor,
            });
          }
        );

        for (const promise of professorPromises) {
          await promise();
        }

        console.log("Created professors");

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

        await prisma.section.create({
          data: {
            code: section.code,
            course: { connect: { id: courseObj.id } },
            semester: { connect: { id: semesterObj.id } },
            professors: {
              connect: section.professors.map((professor) => ({
                slug: professor.slug,
              })),
            },
            days: { createMany: { data: seats } },
          },
        });
      });

      for (const promise of sectionPromises) {
        await promise();
      }

      console.log("Created sections");
    });

    for (const promise of coursePromises) {
      await promise();
    }

    console.log("Created courses");
  });

  for (const promise of departmentPromises) {
    await promise();
  }

  console.log("Created departments");
};

main();
