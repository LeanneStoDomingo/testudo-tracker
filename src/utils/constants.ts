export const categories = ["semesters", "professors", "sections"] as const;
export const groupings = ["department", "gened", "professor"] as const;

const exampleSeats = [
  {
    label: "Total",
    data: [
      { day: 0, seats: 10 },
      { day: 1, seats: 10 },
      { day: 2, seats: 10 },
      { day: 3, seats: 10 },
      { day: 4, seats: 10 },
      { day: 5, seats: 10 },
    ],
  },
  {
    label: "Open",
    data: [
      { day: 0, seats: 10 },
      { day: 1, seats: 7 },
      { day: 2, seats: 3 },
      { day: 3, seats: 0 },
      { day: 4, seats: 0 },
      { day: 5, seats: 1 },
    ],
  },
  {
    label: "Waitlist",
    data: [
      { day: 0, seats: 0 },
      { day: 1, seats: 0 },
      { day: 2, seats: 0 },
      { day: 3, seats: 4 },
      { day: 4, seats: 2 },
      { day: 5, seats: 0 },
    ],
  },
  {
    label: "Holdfile",
    data: [
      { day: 0, seats: 0 },
      { day: 1, seats: 1 },
      { day: 2, seats: 2 },
      { day: 3, seats: 1 },
      { day: 4, seats: 0 },
      { day: 5, seats: 0 },
    ],
  },
];

export const exampleCourse = {
  name: "Object-Oriented Programming II",
  filters: {
    semesters: [
      {
        label: "Fall 2021",
        professors: ["larry-herman", "fawzi-emad"],
        sections: ["0101", "0102", "0201", "0202"],
      },
      {
        label: "Spring 2022",
        professors: ["larry-herman", "fawzi-emad"],
        sections: ["0201", "0202", "0301", "0302"],
      },
    ],
    professors: [
      {
        label: "larry-herman",
        semesters: ["Fall 2021", "Spring 2022"],
        sections: ["0101", "0102", "0201", "0202"],
      },
      {
        label: "fawzi-emad",
        semesters: ["Fall 2021", "Spring 2022"],
        sections: ["0201", "0202", "0301", "0302"],
      },
    ],
    sections: [
      {
        label: "0101",
        professors: ["larry-herman"],
        semesters: ["Fall 2021"],
      },
      {
        label: "0102",
        professors: ["larry-herman"],
        semesters: ["Fall 2021"],
      },
      {
        label: "0201",
        professors: ["larry-herman", "fawzi-emad"],
        semesters: ["Fall 2021", "Spring 2022"],
      },
      {
        label: "0202",
        professors: ["larry-herman", "fawzi-emad"],
        semesters: ["Fall 2021", "Spring 2022"],
      },
      {
        label: "0301",
        professors: ["fawzi-emad"],
        semesters: ["Spring 2022"],
      },
      {
        label: "0302",
        professors: ["fawzi-emad"],
        semesters: ["Spring 2022"],
      },
    ],
  },
  data: exampleSeats,
  paths: ["CMSC132"],
};

export const exampleDepartment = {
  name: "Computer Science",
  courses: [
    {
      label: "CMSC132 Object-Oriented Programming II",
      link: "/courses/CMSC132",
    },
    {
      label: "CMSC250 Discrete Mathematics",
      link: "/courses/CMSC250",
    },
    {
      label: "CMSC351 Algorithms",
      link: "/courses/CMSC351",
    },
  ],
  seats: exampleSeats,
  paths: ["CMSC"],
};

export const exampleProfessor = {
  name: "John Doe",
  courses: [
    {
      label: "CMSC132 Object-Oriented Programming II",
      link: "/courses/CMSC132",
    },
    {
      label: "CMSC250 Discrete Mathematics",
      link: "/courses/CMSC250",
    },
    {
      label: "CMSC351 Algorithms",
      link: "/courses/CMSC351",
    },
  ],
  seats: exampleSeats,
  paths: ["john-doe"],
};

export const exampleSearch = {
  results: [
    {
      label: "CMSC132 Object-Oriented Programming II",
      link: "/courses/CMSC132",
    },
    {
      label: "AAST443 Asian American Politics",
      link: "/courses/AAST443",
    },
    {
      label: "MATH241 Calculus II",
      link: "/courses/MATH241",
    },
  ],
};
