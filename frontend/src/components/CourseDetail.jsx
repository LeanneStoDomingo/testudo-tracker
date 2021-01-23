import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { Container, Spinner, Row, Col, Button, Modal } from 'react-bootstrap'
import { FaFilter } from 'react-icons/fa'

import useAxios from '../utils/useAxios'
import LineChart from './LineChart'

const CourseDetail = ({ id, code, name }) => {
    const [show, setShow] = useState(false)

    const [query, setQuery] = useState({})
    const { data, loading } = useAxios(`/courses/${id}`, {}, query)

    const [sections, setSections] = useState([])
    const [selectedSections, setSelectedSections] = useState([])

    const [professors, setProfessors] = useState([])
    const [selectedProfessors, setSelectedProfessors] = useState([])

    const [semesters, setSemesters] = useState([])
    const [selectedsemesters, setSelectedsemesters] = useState([])

    useEffect(() => {
        setSections(data?.filters?.sections.map(item => {
            return { value: item.id, label: item.code }
        }))
        setProfessors(data?.filters?.professors.map(item => {
            return { value: item.id, label: item.name }
        }))
        setSemesters(data?.filters?.semesters.map(item => {
            return { value: item.id, label: `${item.month === '01' ? 'Spring' : 'Fall'} ${item.year}` }
        }))
    }, [data, loading])

    useEffect(() => {
        console.log('query', query)
    }, [query])

    const handleShow = () => setShow(true)

    const handleClose = () => setShow(false)

    const handleSection = e => setSelectedSections(e || [])

    const handleProfessor = e => setSelectedProfessors(e || [])

    const handleSemester = e => setSelectedsemesters(e || [])

    const handleClear = () => {
        setSelectedSections([])
        setSelectedProfessors([])
        setSelectedsemesters([])
    }

    const handleSave = () => {
        setQuery({
            sections: selectedSections.map(item => item.label),
            professors: selectedProfessors.map(item => item.value),
            semesters: selectedsemesters.map(item => item.value)
        })
        handleClose()
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
                                        <Select isMulti options={sections} onChange={handleSection} value={selectedSections} />
                                    </Col>
                                    <Col xs={12} lg={4} className='my-3'>
                                        <h5 className='text-center'>Professors</h5>
                                        <Select isMulti options={professors} onChange={handleProfessor} value={selectedProfessors} />
                                    </Col>
                                    <Col xs={12} lg={4} className='my-3'>
                                        <h5 className='text-center'>Semesters</h5>
                                        <Select isMulti options={semesters} onChange={handleSemester} value={selectedsemesters} />
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-between'>
                            <Button variant='danger' onClick={handleClear}>Clear All</Button>
                            <Button variant='success' onClick={handleSave}>Save</Button>
                        </Modal.Footer>
                    </Modal>
                    <LineChart data={data} />
                </>
            }
        </Container>
    )
}

export default CourseDetail
