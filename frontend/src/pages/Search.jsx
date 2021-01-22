import React, { useContext, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import CardGrid from '../components/CardGrid'
import BigSearchBar from '../components/BigSearchBar'
import SearchContext from '../utils/SearchContext'

const Search = () => {
    const search = useContext(SearchContext)
    const [data, setData] = useState([])

    useEffect(() => {
        // dummy data
        search ? setData(search.slice(0, 10)) : setData([])
    }, [search])

    return (
        <Container className='text-center top-container'>
            <h1>Search</h1>
            <BigSearchBar placeholder='Search...' />
            {search !== {} ? (
                <>
                    <CardGrid cards={data} />
                    <div>stuff has loaded</div>
                    <div>{JSON.stringify(data)}</div>
                </>
            ) : <div>hasnt loaded yet</div>}

        </Container>
    )
}

export default Search
