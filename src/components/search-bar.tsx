import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { z } from "zod";

import { api } from "@/utils/api";
import { useZodForm } from "@/hooks/use-zod-form";
import { useDebounce } from "@/hooks/use-debounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const schema = z.object({
  query: z.string().min(1),
});

const SearchBar: React.FC<{ defaultQuery?: string }> = ({
  defaultQuery = "",
}) => {
  const router = useRouter();

  const form = useZodForm({ schema, defaultValues: { query: defaultQuery } });
  const query = form.watch("query").trim();

  const debouncedQuery = useDebounce(query);

  const search = api.search.useQuery(
    { query: debouncedQuery },
    { enabled: !!debouncedQuery, keepPreviousData: true }
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    void form.handleSubmit((data) => {
      const link =
        search.data?.length === 1 && !!search.data[0]?.link
          ? search.data[0].link
          : `/search?query=${data.query}`;

      void router.push(link);
    })(e);

  return (
    <>
      <form onSubmit={onSubmit}>
        <Input {...form.register("query")} />
        <Button>Search</Button>
        {search.isFetching && <Spinner />}
      </form>
      {!!query && (
        <ul>
          {search.data?.map((item) => (
            <li key={item.link}>
              <Link href={item.link}>{item.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SearchBar;
