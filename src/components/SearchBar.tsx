import { useDeferredValue, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Combobox } from "@headlessui/react";
import { trpc } from "@/hooks/trpc";

const SearchBar: React.FC<{ initialQuery?: string }> = ({
  initialQuery = "",
}) => {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);

  const filteredResults = trpc.useQuery(["search", { query: deferredQuery }], {
    enabled: !!deferredQuery,
  });

  const onChange = (selected?: string) => {
    if (selected === null || !filteredResults.data) return;

    const index = filteredResults.data.findIndex(
      (result) => result.label === selected
    );

    if (index !== -1) {
      router.push(filteredResults.data[index].link);
      return;
    }

    const url =
      filteredResults.data.length === 1
        ? filteredResults.data[0].link
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
        <Combobox.Input onChange={(e) => setQuery(e.target.value)} />
        <Combobox.Options>
          <Combobox.Option value={query} className="hidden">
            <Link href={`/search?q=${query}`}>
              <a>See more results for {query}</a>
            </Link>
          </Combobox.Option>
          {filteredResults.data?.map((result) => (
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
