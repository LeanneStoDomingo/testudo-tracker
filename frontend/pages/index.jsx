import SearchBar from "@components/search/SearchBar"
import useSearch from "@utils/api/useSearch"

const Home = () => {
    const { search } = useSearch()

    return (
        <>
            <section>
                <h1>Testudo Tracker</h1>
                <p>A student run website that tracks seat availability for courses at the University of Maryland, College Park</p>
                <SearchBar search={search} />
            </section>
            <section>
                <h2>Popular Courses</h2>
                <div>charts</div>
            </section>
            <section>
                <div>charts</div>
            </section>
        </>
    )
}

export default Home
