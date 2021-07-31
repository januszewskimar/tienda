import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
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
                this.props.setSesionIniciada(true)
            }
        ).catch (error => {
            if (error.response.status === 401){
                this.props.setSesionIniciada(false)
            }
        })
    }

    cerrarSesion = () => {
        axiosInstance.post('/token/invalidar/', {
            "refresh_token": localStorage.getItem("refresh_token")
        }).then( result => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            this.props.setSesionIniciada(false);
        }).catch (error => {
            console.log(error);
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
            let nombreCompleto = this.state.nombre + ' ' + this.state.apellidos
            parteDerecha = <>
                                <Navbar.Text className="mr-2">
                                    Sesión iniciada como: <LinkContainer to="/usuario/info"><a>{nombreCompleto}</a></LinkContainer>
                                </Navbar.Text>
                                <Button variant="outline-secondary" onClick={this.cerrarSesion}>Cerrar sesión</Button>
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

export default withRouter(Cabecera);



