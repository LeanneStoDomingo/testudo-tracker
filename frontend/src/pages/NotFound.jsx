import React from 'react'
import { useLocation } from 'react-router-dom'
import { Container } from 'react-bootstrap'

const NotFound = () => {
    const location = useLocation()

    return (
        <Container className='text-center mt-5 top-container'>
            <h1>404: Page Not Found</h1>
            <br />
            <h4><code>{location.pathname}</code> does not exist</h4>
        </Container>
    )
}

export default NotFound
