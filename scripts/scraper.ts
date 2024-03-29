import axios from "axios";
import * as cheerio from "cheerio";
import slugify from "slugify";

const get = axios.create({
  baseURL: "https://app.testudo.umd.edu/soc",
});

export const getDepartments = async () => {
  try {
    const { data } = await get("/");

    const $ = cheerio.load(data);

    const departments = $(".course-prefix")
      .toArray()
      .map((elt) => {
        const department = $(elt);
        return {
          code: department.find(".prefix-abbrev").text(),
          name: department.find(".prefix-name").text(),
        };
      });

    return departments;
  } catch (error) {
    console.log({ error });
    return [];
  }
};

export const getGeneds = async () => {
  try {
    const { data } = await get("/gen-ed");

    const $ = cheerio.load(data);

    const geneds = $(".subcategory")
      .toArray()
      .map((elt) => {
        const text = $(elt).find("a").text().trim();
        const match = /(?<name>.+)\s\((?<code>.+)\)/.exec(text);

        if (match === null || match.groups === undefined)
          return {
            code: "",
            name: "",
          };

        const { code, name } = match.groups;

        return {
          code: code ?? "",
          name: name ?? "",
        };
      })
      .filter((gened) => gened.code !== "" && gened.name !== "");

    return geneds;
  } catch (error) {
    console.log({ error });
    return [];
  }
};

export const getCourses = async (semester: string, department: string) => {
  try {
    const { data } = await get(`/${semester}/${department}`);

    const $ = cheerio.load(data);

    const courses = $(".course")
      .toArray()
      .map((elt) => {
        const course = $(elt);

        const code = course.find(".course-id").text();
        const name = course.find(".course-title").text();

        const geneds = course
          .find(".course-subcategory")
          .toArray()
          .map((genedElt) => ({
            code: $(genedElt).text().trim().substring(0, 4),
          }));

        return { code, name, geneds };
      });

    return courses;
  } catch (error) {
    console.log({ error });
    return [];
  }
};

export const getSections = async (semester: string, course: string) => {
  try {
    const { data } = await get(
      `/${semester}/${course.substring(0, 4)}/${course}`
    );

    const $ = cheerio.load(data);

    const sections = $(`#${course}`)
      .find(".section-info-container")
      .toArray()
      .map((elt) => {
        const section = $(elt);

        const code = section.find(".section-id").text().trim();

        const professors = section
          .find(".section-instructor")
          .toArray()
          .map((profElt) => {
            const name = $(profElt).text();
            return {
              slug: slugify(name, { lower: true, strict: true }),
              name,
            };
          });

        const [, waitlist, , holdfile] = section
          .find(".waitlist > a > span")
          .toArray()
          .map((seatsElt) => $(seatsElt).text());

        const seats = {
          total: +section.find(".total-seats-count").text(),
          open: +section.find(".open-seats-count").text(),
          waitlist: +(waitlist ?? 0),
          holdfile: +(holdfile ?? 0),
        };

        return { code, professors, seats };
      });

    return sections;
  } catch (error) {
    console.log({ error });
    return [];
  }
};
