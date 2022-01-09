import SearchBar from "@components/search/SearchBar"

const Home = () => {
    return (
        <>
            <section>
                <h1>Testudo Tracker</h1>
                <p>A student run website that tracks seat availability for courses at the University of Maryland, College Park</p>
                <SearchBar />
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
