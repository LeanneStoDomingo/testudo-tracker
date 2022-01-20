import SearchResults from "@components/search/SearchResults"
import useSearch from "@utils/useSearch"
import { useRouter } from "next/router"

const Search = () => {
    const router = useRouter()
    const { query } = router.query
    const { search } = useSearch()

    const results = !!query ? search.filter((item) => item.text.toLowerCase().includes(query.toLowerCase())) : []

    return <SearchResults search={search} cards={results} />
}

export default Search
