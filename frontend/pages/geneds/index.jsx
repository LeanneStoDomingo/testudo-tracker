import SearchResults from "@components/search/SearchResults"
import useSearch from "@utils/api/useSearch"

const Geneds = () => {
    const { search } = useSearch()

    const searchData = search.filter((item) => item.link.includes('/geneds/'))

    return <SearchResults title='Departments' search={searchData} />
}

export default Geneds
