import SearchResults from "@components/search/SearchResults"
// import useDepartments from "@utils/api/useDepartments"
import useSearch from "@utils/api/useSearch"
import axios from "@utils/axios"
import filterByCategory from "@utils/filterByCategory"

const filterDepartments = (data) => filterByCategory('departments', data)

const Departments = ({ fallbackData }) => {
    // const { departments } = useDepartments(fallbackData)
    const { search } = useSearch({ data: fallbackData })

    const searchData = filterDepartments(search)

    return <SearchResults title='Departments' search={searchData} />
    // return <SearchResults title='Departments' search={departments} />
}

export default Departments

export const getStaticProps = async () => {
    // add `/departments` endpoint to api (won't need filterByCategory)
    // const { data } = await axios.get('/departments')
    const { data } = await axios.get('/search')

    return {
        props: {
            // fallbackData: data
            fallbackData: filterDepartments(data.data)
        }
    }
}