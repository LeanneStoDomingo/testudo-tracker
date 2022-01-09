import useSearch from "@utils/useSearch"
import { useRouter } from "next/router"
import { useState } from "react"

const useSearchBar = () => {
    const router = useRouter()
    const { search, error } = useSearch()
    const [value, setValue] = useState('')

    const filtered = search.filter((item) => item.text.toLowerCase().includes(value.toLowerCase()))

    const onChange = (e) => setValue(e.target.value)

    const onSubmit = (e) => {
        e.preventDefault()

        if (filtered.length === 1) {
            router.push(filtered[0].link)
        } else {
            router.push(`/search?query=${value}`)
        }
    }

    return { value, onChange, onSubmit, error }
}

export default useSearchBar
