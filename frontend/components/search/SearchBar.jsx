import useKeydown from "@utils/useKeydown"
import useSearchBar from "@utils/useSearchBar"
import Link from "next/link"
import { useEffect, useRef } from "react"

const SearchBar = ({ search }) => {
    const { value, onChange, onSubmit, autocomplete } = useSearchBar(search)
    const inputRef = useRef(null)
    const refs = useRef([])

    useEffect(() => {
        refs.current = refs.current.slice(0, autocomplete.length)
    }, [autocomplete])

    useKeydown('ArrowUp', () => {
        if (refs.current.includes(document.activeElement)) {
            const currentIndex = refs.current.indexOf(document.activeElement)
            const index = currentIndex === 0 ? refs.current.length - 1 : currentIndex - 1
            refs.current[index].focus()
        }
    })

    useKeydown('ArrowDown', () => {
        if (inputRef.current === document.activeElement && refs.current.length !== 0) {
            refs.current[0].focus()
        } else if (refs.current.includes(document.activeElement)) {
            const currentIndex = refs.current.indexOf(document.activeElement)
            const index = currentIndex === refs.current.length - 1 ? 0 : currentIndex + 1
            refs.current[index].focus()
        }
    })

    return (
        <form onSubmit={onSubmit}>
            <input value={value} onChange={onChange} ref={inputRef} type="text" />
            <ul>
                {autocomplete.map((item, i) => <li key={i}><Link href={item.link}><a ref={e => refs.current[i] = e}>{item.text}</a></Link></li>)}
            </ul>
        </form>
    )
}

export default SearchBar
