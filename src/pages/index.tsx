import { type NextPage } from "next";

import SearchBar from "@/components/search-bar";

const Home: NextPage = () => {
  return (
    <>
      <h1>Testudo Tracker</h1>
      <p>
        A student run website that tracks seat availability for courses at the
        University of Maryland, College Park
      </p>
      <SearchBar />
    </>
  );
};

export default Home;
