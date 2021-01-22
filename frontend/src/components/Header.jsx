import React from 'react'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'
import '../scss/header.scss'
import { FaQuestionCircle } from 'react-icons/fa'

const Header = () => {
    return (
        <Navbar collapseOnSelect={true} expand='md' variant='dark' fixed='top'>
            <Navbar.Brand as={Link} to='/'><FaQuestionCircle size={50} /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
                <Nav>
                    <Nav.Link as={Link} to='/' className='text-center' eventKey='1'>Home</Nav.Link>
                    <NavDropdown title='Courses' className='text-center'>
                        <NavDropdown.Item as={Link} to='/departments' eventKey='1'>By Department</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to='/professors' eventKey='1'>By Professor</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to='/geneds' eventKey='1'>By Gened</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link as={Link} to='/about' className='text-center' eventKey='1'>About</Nav.Link>
                    <Nav.Link as={Link} to='/contact' className='text-center' eventKey='1'>Contact</Nav.Link>
                </Nav>
                <SearchBar formClass='ml-auto' controlClass='mr-2' placeholder='Search...' />
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
