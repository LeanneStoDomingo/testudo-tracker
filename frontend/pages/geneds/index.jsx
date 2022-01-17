import SearchResults from "@components/search/SearchResults"
// import useGeneds from "@utils/api/useGeneds"
import useSearch from "@utils/api/useSearch"
import axios from "@utils/axios"
import filterByCategory from "@utils/filterByCategory"

const filterGeneds = (data) => filterByCategory('geneds', data)

const Geneds = ({ fallbackData }) => {
    // const { geneds } = useGeneds(fallbackData)
    const { search } = useSearch({ data: fallbackData })

    const searchData = filterGeneds(search)

    return <SearchResults title='Geneds' search={searchData} />
    // return <SearchResults title='Geneds' search={geneds} />
}

export default Geneds

export const getStaticProps = async () => {
    // add `/geneds` endpoint to api (won't need filterByCategory)
    // const { data } = await axios.get('/geneds')
    const { data } = await axios.get('/search')

    return {
        props: {
            // fallbackData: data
            fallbackData: filterGeneds(data.data)
        }
    }
}