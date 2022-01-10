import axios from '@utils/axios'

// const fetcher = async (...args) => {
//     const res = await fetch(...args)
//     const data = await res.json()
//     return data
// }

const fetcher = async (args) => {
    if (Array.isArray(args)) {
        const { data } = await axios.get(...args)
        return data
    } else {
        const { data } = await axios.get(args)
        return data
    }
}

export default fetcher