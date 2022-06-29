import { categories } from "./constants";

export type TCategory = typeof categories[number];

export type TSelected = {
  [key in TCategory]: string[];
};