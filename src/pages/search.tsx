import { type NextPage } from "next";
import { useRouter } from "next/router";

const Search: NextPage = () => {
  const router = useRouter();
  const { query } = router.query;

  return (
    <>
      <h1>Search</h1>
      <p>Query: {query}</p>
    </>
  );
};

export default Search;
