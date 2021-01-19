import React, { createContext } from 'react'
import useAxios from './useAxios'

const SearchContext = createContext([])

export const SearchProvider = ({ children }) => {
    const { data } = useAxios('/search')

    return (
        <SearchContext.Provider value={data.data}>
            {children}
        </SearchContext.Provider>
    )
}

export default SearchContext