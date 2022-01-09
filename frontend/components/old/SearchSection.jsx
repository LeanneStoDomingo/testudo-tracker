import SearchBar from "@components/SearchBar"
import Card from "@components/Card"
import useSearchSection from "@utils/useSearchSection"
import { createElement } from "react"

// const SearchSection = ({ title = '', filter = '', query = '', results = [], showAll = true, titleTag = 'h1' }) => {
// const SearchSection = ({ title = '', filter = '', query = '', showAll = true, titleTag = 'h1' }) => {
const SearchSection = ({ title = '', query = '', showAll = true, titleTag = 'h1' }) => {

    return (
        <>
            {createElement(titleTag, null, `Search ${title}`)}
            <SearchBar />
            <div>
                {results.map((result, i) => <Card key={i} {...result} />)}
            </div>
        </>
    )
}

export default SearchSection
