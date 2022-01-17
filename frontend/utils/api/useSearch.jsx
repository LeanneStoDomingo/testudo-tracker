// import useSWR from "swr"

import useSWR from "@utils/useSWR"

const useSearch = (fallbackData = { data: [] }) => {

    const { data, ...rest } = useSWR('/search', fallbackData)

    return {
        search: data,
        ...rest
    }




    // const { data, error } = useSWR('/search', { fallbackData })

    // return {
    //     search: data.data,
    //     loading: !error && !data,
    //     error
    // }
}

export default useSearch