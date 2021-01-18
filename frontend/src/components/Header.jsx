import React from 'react'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import SearchBar from './SearchBar'

const Header = () => {
    return (
        <Navbar expand='md'>
            <Navbar.Brand>Logo</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
                <Nav>
                    <Nav.Link>Home</Nav.Link>
                    <NavDropdown title='Courses'>
                        <NavDropdown.Item>By Department</NavDropdown.Item>
                        <NavDropdown.Item>By Professor</NavDropdown.Item>
                        <NavDropdown.Item>By Gened</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link>About</Nav.Link>
                    <Nav.Link>Contact</Nav.Link>
                </Nav>
                <SearchBar />
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
