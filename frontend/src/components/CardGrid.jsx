import React from 'react'
import { Row, Col } from 'react-bootstrap'
import CardDetail from './CardDetail'

const CardGrid = ({ cards }) => {
    return (
        <Row>
            {cards ? cards.map((card) => {
                return (
                    <Col key={card.link} sm={6} lg={4} xl={3}>
                        <CardDetail code={card.code} name={card.name} link={card.link} />
                    </Col>
                )
            }) : null}
        </Row>
    )
}

export default CardGrid
