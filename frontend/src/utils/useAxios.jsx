import { useEffect, useState } from 'react'
import axios from 'axios'

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })

const useAxios = (endpoint, initial = {}, query) => {
    const [data, setData] = useState(initial)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        axiosInstance.get(`api${endpoint}/`, { params: query })
            .then(res => {
                setData(res.data)
                setLoading(false)
            })
            .catch(err => console.error(err))
    }, [endpoint, query])

    return { data, loading }
}

export default useAxios
