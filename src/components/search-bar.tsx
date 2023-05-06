import React, { useId } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useIsFetching } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useCombobox } from "downshift";
import { useController } from "react-hook-form";
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
  const controller = useController({ name: "query", control: form.control });

  const query = form.watch("query").trim();
  const debouncedQuery = useDebounce(query);

  const search = api.search.getAll.useQuery(
    { query: debouncedQuery },
    { enabled: !!debouncedQuery, keepPreviousData: true }
  );

  const apiContext = api.useContext();

  const numSearchIsFetching = useIsFetching({
    queryKey: getQueryKey(api.search.getAll, { query }),
  });

  const items = search.data?.slice(0, 5) ?? [];

  const {
    isOpen,
    highlightedIndex,
    selectedItem,
    getLabelProps,
    getInputProps,
    getMenuProps,
    getItemProps,
  } = useCombobox({
    items,
    itemToString: (item) => item?.label ?? "",
    onSelectedItemChange: (e) => {
      if (e.type === "__input_keydown_enter__" && !!e.selectedItem?.link) {
        void router.push(e.selectedItem.link);
      }
    },
    onInputValueChange: (e) => {
      controller.field.onChange(e.inputValue);
    },
    onStateChange: (e) => {
      if (e.type === "__input_keydown_enter__" && !e.isOpen) {
        void onSubmit();
      }
    },
    onHighlightedIndexChange: (e) => {
      const highlightedIndex = e.highlightedIndex ?? -1;

      if (highlightedIndex === -1) return;

      const highlightedItem = items[highlightedIndex];

      // TODO: prefetch professor/department/gened data when those pages are implemented
      if (!highlightedItem || highlightedItem.type !== "course") return;

      const code = highlightedItem.link.split("/")[2];

      if (!code) return;

      void apiContext.course.getFilters.prefetch({ code });
      void apiContext.course.getSeats.prefetch({
        code,
        semester: "",
        professor: "",
        section: "",
      });
    },
  });

  const onSubmit = async () => {
    const results = await apiContext.search.getAll.fetch({ query });

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
        <label
          {...getLabelProps({
            id: `label-${id}`,
            htmlFor: `input-${id}`,
            className: "absolute m-2 h-4 w-4",
          })}
        >
          {numSearchIsFetching > 0 ||
          ((search.isFetching || search.isPreviousData) && !!query) ? (
            <Spinner className="h-full w-full" />
          ) : (
            <Search className="h-full w-full" />
          )}
        </label>
        <Input
          {...getInputProps({
            id: `input-${id}`,
            "aria-controls": `input-${id}`,
            "aria-labelledby": `input-${id}`,
            type: "search",
            placeholder: "Search",
            className: "pl-8",
            name: controller.field.name,
            ref: controller.field.ref,
            value: controller.field.value,
            onBlur: controller.field.onBlur,
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
