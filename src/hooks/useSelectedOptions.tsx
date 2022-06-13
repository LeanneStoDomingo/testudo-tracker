import { useState } from "react";

const useSelectedOptions = () => {
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

  return { selected, setSelected, clearSelected };
};

export default useSelectedOptions;
