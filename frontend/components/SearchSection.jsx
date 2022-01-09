import SearchBar from "@components/SearchBar"
import Card from "@components/Card"

const SearchSection = ({ title = '', results = [], h2 = false }) => {
    return (
        <>
            {!h2 ? <h1>Search {title}</h1> : <h2>Search {title}</h2>}
            <SearchBar />
            <div>
                {results.map((result, i) => <Card key={i} {...result} />)}
            </div>
        </>
    )
}

export default SearchSection
