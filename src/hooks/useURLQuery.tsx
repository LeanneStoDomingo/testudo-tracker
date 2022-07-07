import { useEffect, useState } from "react";

const useURLQuery = (q: string) => {
  const [query, setQuery] = useState(q);

  useEffect(() => {
    setQuery(q);
  }, [q]);

  return { query, setQuery };
};

export default useURLQuery;
