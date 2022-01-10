import useSearchBar from "@utils/useSearchBar"
import Link from "next/link"

const SearchBar = ({ search }) => {
    const { value, onChange, onSubmit, autocomplete } = useSearchBar(search)

    return (
        <form onSubmit={onSubmit}>
            <input value={value} onChange={onChange} type="text" />
            <ul>
                {autocomplete.map((item, i) => <li key={i}><Link href={item.link}><a>{item.text}</a></Link></li>)}
            </ul>
        </form>
    )
}

export default SearchBar
