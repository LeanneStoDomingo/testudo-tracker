import React from 'react'
import { Form, FormControl, Button } from 'react-bootstrap'

const SearchBar = () => {
    return (
        <Form inline>
            <FormControl type="text" />
            <Button>Search</Button>
        </Form>
    )
}

export default SearchBar
