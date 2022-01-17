// import useSWR from "swr"

import useSWR from "@utils/useSWR"

const useProfessor = (slug, fallbackData) => useSWR(`/professors/${slug}`, fallbackData)
//     const { data, error } = useSWR(`/professors/${slug}`, { fallbackData })

//     return {
//         ...data,
//         loading: !error && !data,
//         error
//     }
// }

export default useProfessor
