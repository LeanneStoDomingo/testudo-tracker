import SearchResults from "@components/search/SearchResults"
import useSearch from "@utils/useSearch"
import axios from "@utils/axios"
import filterByCategory from "@utils/filterByCategory"
// import useSWR from "@utils/useSWR"

const filterDepartments = (data) => filterByCategory('departments', data)

const Departments = ({ fallbackData }) => {
    // const { departments } = useSWR('/departments', fallbackData)
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