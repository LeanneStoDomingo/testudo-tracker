import { useRouter } from "next/router";
import SearchBar from "@/components/SearchBar";

const Search = () => {
  const router = useRouter();
  const q = router.query.q as string;

  return <SearchBar initialQuery={q} />;
};

export default Search;
