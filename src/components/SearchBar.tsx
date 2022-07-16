import { useDeferredValue } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Combobox } from "@headlessui/react";
import { trpc } from "@/hooks/trpc";
import { groupings } from "@/utils/constants";
import useURLQuery from "@/hooks/useURLQuery";

type Groupings = typeof groupings[number];

const SearchBar: React.FC<{
  initialQuery?: string;
  type?: Groupings;
  payload?: string;
  filter?: string;
}> = ({ initialQuery = "", type, payload, filter }) => {
  const router = useRouter();

  const { query, setQuery } = useURLQuery(initialQuery);
  const deferredQuery = useDeferredValue(query);

  const filteredResults = trpc.useQuery(
    ["search", { query: deferredQuery, type, payload, filter }],
    { enabled: !!deferredQuery }
  );

  const onChange = (selected?: string) => {
    if (selected === null) return;

    if (!filteredResults.data) {
      const url = !!filter
        ? `/search?q=${query}&filter=${filter}`
        : `/search?q=${query}`;

      router.push(url);
      return;
    }

    const index = filteredResults.data.findIndex(
      (result) => result.label === selected
    );

    if (index !== -1) {
      router.push(filteredResults.data[index]!.link);
      return;
    }

    const url =
      filteredResults.data.length === 1
        ? filteredResults.data[0]!.link
        : !!filter
        ? `/search?q=${query}&filter=${filter}`
        : `/search?q=${query}`;

    router.push(url);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onChange();
  };

  return (
    <form onSubmit={onSubmit}>
      <Combobox value={query} onChange={onChange} nullable>
        <Combobox.Label className="sr-only">Search Bar</Combobox.Label>
        <Combobox.Input onChange={(e) => setQuery(e.target.value)} />
        <Combobox.Options>
          <Combobox.Option value={query} className="hidden">
            <Link href={`/search?q=${query}`}>
              <a>See more results for {query}</a>
            </Link>
          </Combobox.Option>
          {!!query &&
            filteredResults.data?.map((result) => (
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
          {filteredResults.data?.length === 0 && <li>No results</li>}
        </Combobox.Options>
      </Combobox>
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
