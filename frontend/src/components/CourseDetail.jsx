import React, { useEffect, useState } from 'react'
import { Container, Spinner, Row, Col, Button, Modal } from 'react-bootstrap'
import useAxios from '../utils/useAxios'
import Select from 'react-select'
import LineChart from './LineChart'
import { FaFilter } from 'react-icons/fa'

const CourseDetail = ({ id, code, name }) => {
    // const [query, setQuery] = useState([])
    const { data, loading } = useAxios(`/courses/${id}`)
    const [show, setShow] = useState(false)
    const [sections, setSections] = useState([])
    const [selectedSections, setSelectedSections] = useState([])

    useEffect(() => {
        console.log('data', data)
        setSections(!loading ? (
            data.filters.sections.map(item => {
                return { value: item.id, label: item.code }
            })
        ) : null)
    }, [data, loading])

    const handleShow = () => {
        setShow(true)
        console.log('sections', sections)
    }

    const handleClose = () => setShow(false)

    const handleSelect = e => {
        setSelectedSections(e)
    }

    return (
        <Container className='text-center top-container'>
            <Row><Col><h1>{code}</h1></Col></Row>
            <Row><Col><h5>{name}</h5></Col></Row>
            {loading ? <Spinner animation="border" /> :
                <>
                    <Button onClick={handleShow} className='my-4'><FaFilter /><span className='ml-2'>Filter</span></Button>
                    <Modal show={show} onHide={handleClose} size='lg'>
                        <Modal.Header closeButton>
                            <Modal.Title>Filters for {code}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Container>
                                <Row>
                                    <Col xs={12} lg={4} className='my-3'>
                                        <h5 className='text-center'>Sections</h5>
                                        <Select isMulti options={sections} onChange={handleSelect} />
                                    </Col>
                                    <Col xs={12} lg={4} className='my-3'>
                                        <h5 className='text-center'>Professors</h5>
                                        <Select isMulti options={sections} onChange={handleSelect} />
                                    </Col>
                                    <Col xs={12} lg={4} className='my-3'>
                                        <h5 className='text-center'>Semesters</h5>
                                        <Select isMulti options={sections} onChange={handleSelect} />
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-between'>
                            <Button variant='danger'>Clear All</Button>
                            <Button variant='success' onClick={handleClose}>Save</Button>
                        </Modal.Footer>
                    </Modal>
                    <LineChart data={data} />
                </>
            }
        </Container>
    )
}

export default CourseDetail
