import React, { useEffect, useState } from 'react'
import axios from 'axios'

const axiosInstance = axios.create(process.env.REACT_APP_API_URL)

const useAxios = (endpoint, initial = {}) => {
    const [data, setData] = useState(initial)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        axiosInstance.get(endpoint)
            .then(res => {
                setData(res)
                setLoading(false)
            })
            .catch(err => console.error(err))
    }, [])

    return { data, loading }
}

export default useAxios
