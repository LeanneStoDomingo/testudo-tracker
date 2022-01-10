import { useState } from "react"
import { useRouter } from "next/router"

const useSearchBar = (search) => {
    const router = useRouter()
    const [value, setValue] = useState('')

    const filtered = search.filter(item => item.text.toLowerCase().includes(value.toLowerCase()))

    const autocomplete = !!value ? filtered.slice(0, 10) : []

    const onChange = (e) => setValue(e.target.value)

    const onSubmit = (e) => {
        e.preventDefault()

        if (filtered.length === 1) {
            router.push(filtered[0].link)
        } else {
            router.push(`/search?query=${value}`)
        }
    }

    return { value, onChange, onSubmit, autocomplete }
}

export default useSearchBar
