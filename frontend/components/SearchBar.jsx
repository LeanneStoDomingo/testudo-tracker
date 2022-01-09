import useSearchBar from "@utils/useSearchBar"
import Link from "next/link"

const SearchBar = () => {
    const { value, autocomplete, onChange, onSubmit, error } = useSearchBar()

    return (
        <form onSubmit={onSubmit}>
            {error && <>error</>}
            <input value={value} onChange={onChange} type='text' />
            <ul>
                {autocomplete.map((item, i) => (
                    <li key={i}>
                        <Link href={item.link}>
                            <a>{item.text}</a>
                        </Link>
                    </li>
                ))}
            </ul>
        </form>
    )
}

export default SearchBar
