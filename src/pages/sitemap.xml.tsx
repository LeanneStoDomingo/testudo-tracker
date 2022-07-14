import type { GetServerSidePropsContext } from "next";
import { prisma } from "@/backend/db/client";

const SiteMap = () => {};

export const getServerSideProps = async ({
  res,
}: GetServerSidePropsContext) => {
  const baseURL = `https://${process.env.VERCEL_URL}`;
  const staticLinks = ["/about", "/search"];

  const courses = await prisma.course.findMany({
    select: { code: true },
  });

  const courseLinks = courses.map((course) => `/courses/${course.code}`);

  const departments = await prisma.department.findMany({
    select: { code: true },
  });

  const departmentLinks = departments.map(
    (department) => `/departments/${department.code}`
  );

  const geneds = await prisma.gened.findMany({
    select: { code: true },
  });

  const genedLinks = geneds.map((gened) => `/geneds/${gened.code}`);

  const professors = await prisma.professor.findMany({
    select: { slug: true },
  });

  const professorLinks = professors.map(
    (professor) => `/professors/${professor.slug}`
  );

  const links = [
    ...staticLinks,
    ...courseLinks,
    ...departmentLinks,
    ...genedLinks,
    ...professorLinks,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>${baseURL}</loc></url>
      ${links
        .map((link) => `<url><loc>${baseURL}${link}</loc></url>`)
        .join("\n")}
    </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default SiteMap;
