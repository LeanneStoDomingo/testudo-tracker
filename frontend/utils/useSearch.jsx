import useSWR from "swr"

const useSearch = (fallbackData = { data: [] }) => {
    const { data, error } = useSWR('https://server.testudotracker.com/api/search/', { fallbackData })

    return {
        search: data.data,
        loading: !error && !data,
        error
    }
}

export default useSearch