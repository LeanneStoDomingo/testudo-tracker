import { useDeferredValue, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Combobox } from "@headlessui/react";
import { trpc } from "@/hooks/trpc";
import { exampleDepartment } from "@/utils/constants";

// TODO: remove this in favor of trpc type
type InitialResults = typeof exampleDepartment.courses;

const SearchBar: React.FC<{
  initialQuery?: string;
  initialResults?: InitialResults;
}> = ({ initialQuery = "", initialResults = [] }) => {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);

  const filteredResults = trpc.useQuery(["search", { query: deferredQuery }], {
    enabled: !!deferredQuery && !initialResults,
  });

  const filtered =
    filteredResults.data ??
    initialResults.filter((result) => {
      return result.label.toLowerCase().includes(deferredQuery.toLowerCase());
    });

  const onChange = (selected?: string) => {
    if (selected === null || !filtered) return;

    const index = filtered.findIndex((result) => result.label === selected);

    if (index !== -1) {
      router.push(filtered[index].link);
      return;
    }

    const url = filtered.length === 1 ? filtered[0].link : `/search?q=${query}`;

    router.push(url);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onChange();
  };

  return (
    <form onSubmit={onSubmit}>
      <Combobox value={query} onChange={onChange} nullable>
        <Combobox.Input onChange={(e) => setQuery(e.target.value)} />
        <Combobox.Options>
          <Combobox.Option value={query} className="hidden">
            <Link href={`/search?q=${query}`}>
              <a>See more results for {query}</a>
            </Link>
          </Combobox.Option>
          {filtered.map((result) => (
            <Combobox.Option key={result.label} value={result.label}>
              {({ active }) => (
                <Link href={result.link}>
                  <a className={active ? "text-blue-500" : ""}>
                    {result.label}
                  </a>
                </Link>
              )}
            </Combobox.Option>
          ))}
          {filtered?.length === 0 && <li>No results</li>}
        </Combobox.Options>
      </Combobox>
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
