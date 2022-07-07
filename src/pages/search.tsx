import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { Listbox } from "@headlessui/react";
import { trpc } from "@/hooks/trpc";
import useSearchFilter from "@/hooks/useSearchFilter";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { formattedGroupings, noneSelected } from "@/utils/constants";

const Search = () => {
  const router = useRouter();
  const q = (router.query.q || "") as string;
  const filterParam = router.query.filter as string;

  const { selectedFilter, setSelectedFilter } = useSearchFilter(filterParam);

  const filter = selectedFilter !== noneSelected ? selectedFilter : undefined;

  const results = trpc.useQuery(
    [
      "search",
      {
        query: q,
        filter,
      },
    ],
    { enabled: !!q || !!filter }
  );

  return (
    <>
      <NextSeo title="Search" />
      <h1>Search</h1>
      <SearchBar initialQuery={q} filter={filter} />
      <Listbox value={selectedFilter} onChange={setSelectedFilter}>
        <Listbox.Button className="capitalize">{selectedFilter}</Listbox.Button>
        <Listbox.Options>
          <Listbox.Option
            key={noneSelected}
            value={noneSelected}
            className="capitalize"
          >
            {noneSelected}
          </Listbox.Option>
          {formattedGroupings.map((filter) => (
            <Listbox.Option
              key={filter as string}
              value={filter}
              className="capitalize"
            >
              {filter}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
      {results.isError && <>Error!!!</>}
      {results.isLoading && <>Loading...</>}
      {!!results.data && <SearchResults results={results.data} />}
    </>
  );
};

export default Search;
