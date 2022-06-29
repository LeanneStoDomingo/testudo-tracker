import { useRouter } from "next/router";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";

const Search = () => {
  const router = useRouter();
  const q = router.query.q as string;

  return (
    <>
      <h1>Search</h1>
      <SearchBar initialQuery={q} />
      <SearchResults query={q} />
    </>
  );
};

export default Search;
