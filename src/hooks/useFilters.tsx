import { useState } from "react";

const categories = ["semesters", "professors", "sections"] as const;
type TCategory = typeof categories[number];

interface IFilters {
  semesters: {
    label: string;
    professors: string[];
    sections: string[];
  }[];
  professors: {
    label: string;
    semesters: string[];
    sections: string[];
  }[];
  sections: {
    label: string;
    semesters: string[];
    professors: string[];
  }[];
}

type TSelected = {
  [key in TCategory]: string[];
};

interface IOption {
  key: string;
  label: string;
  value: string;
  disabled: boolean;
}

type TOptions = {
  [key in TCategory]: IOption[];
};

const useFilters = (filters: IFilters) => {
  const [selected, dispatchSelected] = useState<TSelected>({
    semesters: [],
    professors: [],
    sections: [],
  });

  const setSelected = (category: TCategory) => (e: string[]) => {
    dispatchSelected((s) => ({
      ...s,
      [category]: e,
    }));
  };

  const clearSelected = (category: TCategory) => () => {
    dispatchSelected((s) => ({
      ...s,
      [category]: [],
    }));
  };

  const getOptions = (): TOptions => {
    const options: { [key in TCategory]: any } = {
      semesters: [],
      professors: [],
      sections: [],
    };

    if (filters === undefined) return options;

    categories.forEach((category) => {
      options[category] = filters[category].map((filter) => {
        return {
          key: filter.label,
          label: filter.label,
          value: filter.label,
          disabled: Object.entries(selected)
            .filter(([key]) => key !== category)
            .reduce((acc, [key, value]) => {
              // remade filter object to make typescript happy
              const f: { [key: string]: string[] } = {
                ...filter,
                label: [],
              };
              return acc || value.some((v) => !f[key].includes(v));
            }, false),
        };
      });
    });

    return options;
  };

  return {
    categories,
    options: getOptions(),
    selected,
    setSelected,
    clearSelected,
  };
};

export default useFilters;
