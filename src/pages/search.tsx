import { useRouter } from "next/router";
import { trpc } from "@/hooks/trpc";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";

const Search = () => {
  const router = useRouter();
  const q = router.query.q as string;

  const results = trpc.useQuery(["search", { query: q }], {
    enabled: !!q,
  });

  return (
    <>
      <h1>Search</h1>
      <SearchBar initialQuery={q} />
      {results.isError && <>Error!!!</>}
      {results.isLoading && <>Loading...</>}
      {!!results.data && <SearchResults results={results.data} />}
    </>
  );
};

export default Search;
