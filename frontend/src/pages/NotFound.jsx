import React from 'react'
import { useLocation } from 'react-router-dom'

const NotFound = () => {
    const location = useLocation()

    return (
        <div>
            404: Page Not Found<br />
            {location.pathname} does not exist
        </div>
    )
}

export default NotFound
