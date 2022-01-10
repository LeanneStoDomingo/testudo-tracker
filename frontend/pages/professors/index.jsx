import SearchResults from "@components/search/SearchResults"
import useSearch from "@utils/api/useSearch"

const Professors = () => {
    const { search } = useSearch()

    const searchData = search.filter((item) => item.link.includes('/professors/'))

    return <SearchResults title='Departments' search={searchData} />
}

export default Professors
