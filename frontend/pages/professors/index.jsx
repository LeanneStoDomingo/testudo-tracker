import SearchResults from "@components/search/SearchResults"
// import useProfessors from "@utils/api/useProfessors"
import useSearch from "@utils/api/useSearch"
import axios from "@utils/axios"
import filterByCategory from "@utils/filterByCategory"

const filterProfessors = (data) => filterByCategory('professors', data)

const Professors = ({ fallbackData }) => {
    // const { professors } = useProfessors(fallbackData)
    const { search } = useSearch({ data: fallbackData })

    const searchData = filterProfessors(search)

    return <SearchResults title='Professors' search={searchData} />
    // return <SearchResults title='Professors' search={searchData} />
}

export default Professors

export const getStaticProps = async () => {
    // add `/professors` endpoint to api (won't need filterByCategory)
    // const { data } = await axios.get('/professors')
    const { data } = await axios.get('/search')

    return {
        props: {
            // fallbackData: data
            fallbackData: filterProfessors(data.data)
        }
    }
}