import React from 'react'
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import '../scss/home.scss'
import BigSearchBar from '../components/BigSearchBar'
import LineChart from '../components/LineChart'
import useAxios from '../utils/useAxios'
import { Link } from 'react-router-dom'


const Home = () => {
    const { data: course1 } = useAxios('/courses/2085', null)
    const { data: course2 } = useAxios('/courses/2699', null)
    const { data: course3 } = useAxios('/courses/2769', null)

    return (
        <>
            <div className='red grow'>
                <Container className='text-center hero'>
                    <h1 className='font-weight-bold display-4'>Testudo Tracker</h1>
                    <p className='mb-5'>A student run website that tracks seat availability for courses at the University of Maryland, College Park</p>
                    <BigSearchBar placeholder='Search for Courses, Professors, Departments, GenEds, etc...' />
                </Container>
            </div>
            {course1 || course2 || course3 ?
                <>
                    <div className='text-center custom-container my-4'>
                        <h1>Popular Courses</h1>
                        <Row>
                            <Col xs={12} xl={4} className='my-3'>
                                {course1 ?
                                    <>
                                        <Link to={`/courses/${course1.code}`} className='h2'>{course1.code}</Link>
                                        <LineChart data={course1} />
                                    </> : null}
                            </Col>
                            <Col xs={12} xl={4} className='my-3'>
                                {course2 ?
                                    <>
                                        <Link to={`/courses/${course2.code}`} className='h2'>{course2.code}</Link>
                                        <LineChart data={course2} />
                                    </> : <Spinner animation='border' />}
                            </Col>
                            <Col xs={12} xl={4} className='my-3'>
                                {course3 ?
                                    <>
                                        <Link to={`/courses/${course3.code}`} className='h2'>{course3.code}</Link>
                                        <LineChart data={course3} />
                                    </> : null}
                            </Col>
                        </Row>
                    </div>
                    <div className='red'>
                        <Container className='text-center'>
                            <Row>
                                <Col xs={12} lg={6}>
                                    <h2>Average Semester</h2>
                                    <div>chart goes here</div>
                                </Col>
                                <Col xs={12} lg={6}>
                                    <h2>Fall 2021</h2>
                                    <div>chart goes here</div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </>
                : null}

        </>
    )
}

export default Home
