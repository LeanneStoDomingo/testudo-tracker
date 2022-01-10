import useSWR from "swr"

const useDepartment = (code) => {
    const { data, error } = useSWR(`/departments/${code}`)

    return {
        ...data,
        loading: !error && !data,
        error
    }
}

export default useDepartment
