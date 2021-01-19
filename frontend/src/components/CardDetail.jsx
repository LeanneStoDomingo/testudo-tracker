import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const CardDetail = ({ code, name, link }) => {
    return (
        <Card as={Link} to={link}>
            <Card.Header>{code}</Card.Header>
            <Card.Body>{name}</Card.Body>
        </Card>
    )
}

export default CardDetail
