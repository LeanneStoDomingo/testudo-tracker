import React from 'react'
import { Form, FormControl, Button } from 'react-bootstrap'

const SearchBar = props => {
    return (
        <Form inline className={`${props.formClass} justify-content-center flex-nowrap`}>
            <FormControl size={props.controlSize} type="text" className={props.controlClass} placeholder={props.placeholder} />
            <Button size={props.buttonSize} className={props.buttonClass}>Search</Button>
        </Form>
    )
}

export default SearchBar
