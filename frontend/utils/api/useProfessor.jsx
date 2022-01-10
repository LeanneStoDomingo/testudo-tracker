import useSWR from "swr"

const useProfessor = (slug) => {
    const { data, error } = useSWR(`/professors/${slug}`)

    return {
        ...data,
        loading: !error && !data,
        error
    }
}

export default useProfessor
