import SearchBar from "@/components/SearchBar";
import { seo } from "@/utils/constants";

const Home = () => {
  return (
    <>
      <h1>{seo.title}</h1>
      <p>{seo.description}</p>
      <SearchBar />
    </>
  );
};

export default Home;
