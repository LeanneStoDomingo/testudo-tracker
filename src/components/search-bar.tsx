import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useIsFetching } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
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

  const [inputIsFocused, setInputIsFocused] = useState(false);

  const form = useZodForm({ schema, defaultValues: { query: defaultQuery } });
  const query = form.watch("query").trim();

  const debouncedQuery = useDebounce(query);

  const search = api.search.useQuery(
    { query: debouncedQuery },
    { enabled: !!debouncedQuery, keepPreviousData: true }
  );

  const apiContext = api.useContext();

  const searchIsFetching = useIsFetching({
    queryKey: getQueryKey(api.search, { query }),
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    void form.handleSubmit(async () => {
      const results = await apiContext.search.fetch({ query });

      const link =
        results.length === 1 && !!results[0]
          ? results[0].link
          : `/search?query=${query}`;

      void router.push(link);
    })(e);

  return (
    <>
      <form onSubmit={onSubmit}>
        <Input
          {...form.register("query")}
          onFocus={() => setInputIsFocused(true)}
          onBlur={() => setInputIsFocused(false)}
        />
        <Button>Search</Button>
        {!!searchIsFetching && <Spinner />}
      </form>
      {!!query && inputIsFocused && (
        <ul>
          {search.data?.slice(0, 10).map((item) => (
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
