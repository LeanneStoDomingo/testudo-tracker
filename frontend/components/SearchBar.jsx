import useSearchBar from "@utils/useSearchBar"

const SearchBar = () => {
    const { value, onChange, onSubmit, error } = useSearchBar()

    return (
        <form onSubmit={onSubmit}>
            {error && <>error</>}
            <input value={value} onChange={onChange} type='text' />
        </form>
    )
}

export default SearchBar
