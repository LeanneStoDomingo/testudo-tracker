import SearchResults from "@components/search/SearchResults"
import useSearch from "@utils/useSearch"
import axios from "@utils/axios"
import filterByCategory from "@utils/filterByCategory"
// import useSWR from "@utils/useSWR"

const filterProfessors = (data) => filterByCategory('professors', data)

const Professors = ({ fallbackData }) => {
    // const { professors } = useSWR('/professors', fallbackData)
    const { search } = useSearch({ data: fallbackData })

    const searchData = filterProfessors(search)

    return <SearchResults title='Professors' search={searchData} />
    // return <SearchResults title='Professors' search={professors} />
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