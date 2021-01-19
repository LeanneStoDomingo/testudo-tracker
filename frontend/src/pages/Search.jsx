import React, { useContext, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import CardGrid from '../components/CardGrid'
import SearchBar from '../components/SearchBar'
import SearchContext from '../utils/SearchContext'

const Search = () => {
    const search = useContext(SearchContext)
    const [data, setData] = useState([])

    useEffect(() => {
        // dummy data
        search ? setData(search.slice(0, 10)) : setData([])
    }, [search])

    return (
        <Container className='text-center'>
            <h1>Search</h1>
            <SearchBar />
            <CardGrid cards={data} />
        </Container>
    )
}

export default Search
