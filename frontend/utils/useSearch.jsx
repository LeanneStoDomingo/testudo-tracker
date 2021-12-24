import useSWR from "swr"
import fetcher from "./fecther"


const useSearch = () => {
    const { data, error } = useSWR('https://server.testudotracker.com/api/search/', fetcher)

    return {
        search: data?.data,
        loading: !error && !data,
        error
    }
}

export default useSearch