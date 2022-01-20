import useSWR from "@utils/useSWR"

const useSearch = (fallbackData = { data: [] }) => {
    const { data, ...rest } = useSWR('/search', fallbackData)

    return {
        search: data,
        ...rest
    }
}

export default useSearch