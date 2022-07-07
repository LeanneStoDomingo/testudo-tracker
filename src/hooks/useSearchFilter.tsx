import { formattedGroupings, noneSelected } from "@/utils/constants";
import { useState, useEffect } from "react";

const useSearchFilter = (filter: string) => {
  const [selectedFilter, setSelectedFilter] = useState(noneSelected);

  useEffect(() => {
    setSelectedFilter(() => {
      if (formattedGroupings.includes(filter)) return filter;
      return noneSelected;
    });
  }, [filter]);

  return { selectedFilter, setSelectedFilter };
};

export default useSearchFilter;
