import SearchResults from "@components/search/SearchResults"
import useSearch from "@utils/api/useSearch"

const Departments = () => {
    const { search } = useSearch()

    const searchData = search.filter((item) => item.link.includes('/departments/'))

    return <SearchResults title='Departments' search={searchData} />
}

export default Departments
