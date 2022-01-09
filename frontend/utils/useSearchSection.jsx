import useSearch from "@utils/useSearch"

const useSearchSection = (filter = '', query = '', showAll = true) => {
    const { search } = useSearch()

    const filtered = search.filter((item) => item.link.includes(filter) && item.text.toLowerCase().includes(query.toLowerCase()))

    const results = !!query || showAll ? filtered : []

    return results
}

export default useSearchSection
