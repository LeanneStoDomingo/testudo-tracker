// import useSWR from "swr"

import useSWR from "@utils/useSWR"

const useGened = (code, fallbackData) => useSWR(`/geneds/${code}`, fallbackData)
//     const { data, error } = useSWR(`/geneds/${code}`, { fallbackData })

//     return {
//         ...data,
//         loading: !error && !data,
//         error
//     }
// }

export default useGened
