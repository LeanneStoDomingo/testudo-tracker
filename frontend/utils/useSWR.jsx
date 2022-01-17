import swr from 'swr'

const useSWR = (url, fallbackData = {}, options = {}) => {
    const { data, error } = swr(url, { fallbackData, ...options })
    return {
        ...data,
        loading: !error && !data,
        error
    }
}

export default useSWR
