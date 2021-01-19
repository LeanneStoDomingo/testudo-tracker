import React from 'react'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <Navbar expand='md'>
            <Navbar.Brand as={Link} to='/'>Logo</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
                <Nav>
                    <Nav.Link as={Link} to='/'>Home</Nav.Link>
                    <NavDropdown title='Courses'>
                        <NavDropdown.Item as={Link} to='/departments'>By Department</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to='/professors'>By Professor</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to='/geneds'>By Gened</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link as={Link} to='/about'>About</Nav.Link>
                    <Nav.Link as={Link} to='/contact'>Contact</Nav.Link>
                </Nav>
                <SearchBar />
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
