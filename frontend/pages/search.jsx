import SearchSection from "@components/SearchSection"
import { useRouter } from "next/router"

const Search = () => {
    const router = useRouter()
    const { query } = router.query

    return <SearchSection query={query} showAll={false} />
}

export default Search
