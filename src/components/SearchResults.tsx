import Link from "next/link";
import type { InferQueryOutput } from "@/hooks/trpc";

type Results = InferQueryOutput<"search">;

const SearchResults: React.FC<{ results: Results }> = ({ results }) => {
  return (
    <ul>
      {results.map((result) => (
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
