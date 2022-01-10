import useSWR from "swr"

const useGened = (code) => {
    const { data, error } = useSWR(`/geneds/${code}`)

    return {
        ...data,
        loading: !error && !data,
        error
    }
}

export default useGened
