import { createElement } from "react"
import SearchBar from "@components/search/SearchBar"
import Card from "@components/Card"

const SearchResults = ({ title = '', titleTag = 'h1', search = [], cards = search }) => {
    return (
        <>
            {createElement(titleTag, null, `Search ${title}`)}
            <SearchBar search={search} />
            <div>
                {cards.map((item, i) => <Card key={i} {...item} />)}
            </div>
        </>
    )
}

export default SearchResults
