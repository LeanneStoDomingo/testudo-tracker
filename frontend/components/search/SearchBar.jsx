import useSearchBar from "@utils/useSearchBar"

const SearchBar = ({ search }) => {
    const { value, onChange, onSubmit } = useSearchBar(search)

    return (
        <form onSubmit={onSubmit}>
            <input value={value} onChange={onChange} type="text" />
        </form>
    )
}

export default SearchBar
