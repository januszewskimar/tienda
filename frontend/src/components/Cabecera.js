import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from "react-router-bootstrap";
import axiosInstance from "../axiosApi";



class Cabecera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: "",
            apellidos: ""
        };

    }

    componentDidMount(){
        axiosInstance.get('/usuario-sesion-iniciada/').then(
            result => {
                this.setState( { nombre: result.data.first_name, apellidos: result.data.last_name } )
                if (this.props.sesionIniciada == false){
                    this.props.setSesionIniciada(true)
                }
            }
        ).catch (error => {
                if (error.response.status == 401){
                    if (this.props.sesionIniciada == true){
                        this.props.setSesionIniciada(false)
                    }
                }
            })
    }

    render(){
        let parteDerecha;

        if (!this.props.sesionIniciada){
            parteDerecha =  <>
                                <LinkContainer to="/inicio-sesion"><Nav.Link>Iniciar sesión</Nav.Link>
                                </LinkContainer><LinkContainer to="/registro"><Nav.Link>Registrarse</Nav.Link></LinkContainer>
                           </>
        }
        else{
            parteDerecha = <>
                                Sesión iniciada como: {this.state.nombre} {this.state.apellidos}
                           </>
        }
        return (
                <Navbar bg="light" variant="light">
                    <LinkContainer to="/"><Navbar.Brand>Tienda</Navbar.Brand></LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">

                        </Nav>
                        <Nav>
                            {parteDerecha}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
        )
    }
}

export default Cabecera;



