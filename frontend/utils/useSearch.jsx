import useSWR from "swr"

const useSearch = () => {
    const { data, error } = useSWR('https://server.testudotracker.com/api/search/')

    return {
        search: data?.data,
        loading: !error && !data,
        error
    }
}

export default useSearch