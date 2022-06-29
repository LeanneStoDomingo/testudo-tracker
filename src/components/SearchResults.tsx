import { trpc } from "@/hooks/trpc";
import Link from "next/link";

const SearchResults: React.FC<{ query: string }> = ({ query }) => {
  const results = trpc.useQuery(["search", { query }], {
    enabled: !!query,
  });

  if (results.isError) return <>Error!!!</>;

  if (results.isLoading || !results.data) return <>Loading...</>;

  return (
    <ul>
      {results.data.map((result) => (
        <li key={result.link}>
          <Link href={result.link}>
            <a>{result.label}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
