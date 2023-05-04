import React, { useId } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useIsFetching } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useCombobox } from "downshift";
import { z } from "zod";
import { Search } from "lucide-react";

import { cn } from "@/utils/cn";
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
  const id = useId();

  const router = useRouter();

  const form = useZodForm({ schema, defaultValues: { query: defaultQuery } });
  const rawQuery = form.watch("query");
  const query = rawQuery.trim();

  const debouncedQuery = useDebounce(query);

  const search = api.search.useQuery(
    { query: debouncedQuery },
    { enabled: !!debouncedQuery, keepPreviousData: true }
  );

  const items = search.data?.slice(0, 5) ?? [];

  const apiContext = api.useContext();

  const numSearchIsFetching = useIsFetching({
    queryKey: getQueryKey(api.search, { query }),
  });

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items,
    itemToString: (item) => item?.label ?? "",
  });

  const onSubmit = async () => {
    const results = await apiContext.search.fetch({ query });

    const link =
      results.length === 1 && !!results[0]
        ? results[0].link
        : `/search?query=${query}`;

    void router.push(link);
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) =>
    void form.handleSubmit(() => {
      void onSubmit();
    })(e);

  const isListboxOpen =
    isOpen && !!query && (!!debouncedQuery || !search.isPreviousData);

  return (
    <form onSubmit={onSubmitForm}>
      <div className="flex items-center">
        {numSearchIsFetching > 0 ||
        ((search.isFetching || search.isPreviousData) && !!query) ? (
          <Spinner className="absolute m-2 h-4 w-4" />
        ) : (
          <Search className="absolute m-2 h-4 w-4" />
        )}
        <Input
          {...getInputProps({
            id: `input-${id}`,
            "aria-controls": `input-${id}`,
            "aria-labelledby": `input-${id}`,
            type: "search",
            placeholder: "Search",
            className: "pl-8",
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                void onSubmit();
              }
            },
            value: rawQuery,
            ...form.register("query"),
          })}
        />
      </div>
      <ul
        {...getMenuProps({
          id: `ul-${id}`,
          "aria-labelledby": `ul-${id}`,
          className: cn(
            "absolute z-10 mt-1 max-h-80 w-full bg-white p-0 shadow-md",
            !(isListboxOpen && !!items.length) && "hidden"
          ),
        })}
      >
        {isListboxOpen &&
          items.map((item, index) => (
            <li
              key={item.link}
              {...getItemProps({
                item,
                index,
                className: cn(
                  highlightedIndex === index && "bg-blue-300",
                  selectedItem === item && "font-bold",
                  "shadow-sm"
                ),
              })}
            >
              <Link href={item.link} className="flex px-3 py-2">
                {item.label}
              </Link>
            </li>
          ))}
      </ul>
      <Button type="submit">Search</Button>
    </form>
  );
};

export default SearchBar;
