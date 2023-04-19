import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import { api } from "@/utils/api";
import SearchBar from "@/components/search-bar";

const Search: NextPage<{ query: string }> = ({ query }) => {
  const search = api.search.useQuery({ query });

  const virtualizer = useWindowVirtualizer({
    count: search.data?.length ?? 0,
    estimateSize: () => 100,
    overscan: 5,
  });

  return (
    <>
      <Head>
        <title>Search | Testudo Tracker</title>
      </Head>
      <h1>Search</h1>
      <SearchBar defaultQuery={query} />
      {!!search.data && (
        <ul
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((item) => {
            const link = search.data[item.index]?.link;

            if (!link) return null;

            return (
              <li
                key={item.key}
                data-index={item.index}
                ref={virtualizer.measureElement}
                className="absolute left-0 top-0 w-full p-2"
                style={{ transform: `translateY(${item.start}px)` }}
              >
                <Link href={link}>{search.data[item.index]?.label}</Link>
              </li>
            );
          })}
        </ul>
      )}
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
