// import useSWR from "swr"

import useSWR from "@utils/useSWR"

const useDepartment = (code, fallbackData) => useSWR(`/departments/${code}`, fallbackData)
// const { data, error } = useSWR(`/departments/${code}`, { fallbackData })

// return {
//     ...data,
//     loading: !error && !data,
//     error
// }

// }

export default useDepartment
