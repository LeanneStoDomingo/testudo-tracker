const categories = ["semesters", "professors", "sections"] as const;
type TCategory = typeof categories[number];

type TSelected = {
  [key in TCategory]: string[];
};
