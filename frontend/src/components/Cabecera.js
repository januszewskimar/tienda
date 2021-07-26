import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from "react-router-bootstrap";


class Cabecera extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    componentDidMount(){

    }

    render(){
        return (
                <Navbar bg="light" variant="light">
                    <LinkContainer to="/"><Navbar.Brand>Tienda</Navbar.Brand></LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <LinkContainer to="/registro"><Nav.Link>Registrarse</Nav.Link></LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
        )
    }
}

export default Cabecera;



