import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";

import SearchBar from "@/components/search-bar";

const Search: NextPage<{ query: string }> = ({ query }) => {
  return (
    <>
      <Head>
        <title>Search | Testudo Tracker</title>
      </Head>
      <h1>Search</h1>
      <p>Query: {query}</p>
      <SearchBar defaultQuery={query} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query.query;

  if (typeof query !== "string") throw new Error("Invalid query");

  return {
    props: {
      query,
    },
  };
};

export default Search;
