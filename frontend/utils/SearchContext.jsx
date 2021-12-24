import { createContext, useEffect, useState } from 'react'

const SearchContext = createContext([])

export const SearchProvider = ({ children }) => {
    const [data, setData] = useState([])

    useEffect(() => {
        fetch('https://server.testudotracker.com/api/search/')
            .then((res) => res.json())
            .then(({ data }) => setData(data))
    }, [])

    return (
        <SearchContext.Provider value={data}>
            {children}
        </SearchContext.Provider>
    )
}

export default SearchContext