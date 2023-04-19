import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import SearchBar from "@/components/search-bar";

const Search: NextPage<{ query: string }> = ({ query }) => {
  const search = api.search.useQuery({ query });

  return (
    <>
      <Head>
        <title>Search | Testudo Tracker</title>
      </Head>
      <h1>Search</h1>
      <SearchBar defaultQuery={query} />
      <ul>
        {search.data?.map((item) => (
          <li key={item.link}>
            <Link href={item.link}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query.query ?? "";

  if (typeof query !== "string") throw new Error("Invalid query");

  return {
    props: {
      query,
    },
  };
};

export default Search;
