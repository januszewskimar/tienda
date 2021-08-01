import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { LinkContainer } from "react-router-bootstrap";
import axiosInstance from "../axiosApi";




class Cabecera extends Component {

    cerrarSesion = () => {
        axiosInstance.post('/token/invalidar/', {
            "refresh_token": localStorage.getItem("refresh_token")
        }).then( result => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            this.props.actualizarUsuarioLogueado();
            this.props.history.push('/');
        }).catch (error => {
            console.log(error);
        })
    }

    render(){
        let parteDerecha;

        if (this.props.usuarioLogueado === null){
            parteDerecha =  <>
                                <LinkContainer to="/inicio-sesion"><Nav.Link>Iniciar sesión</Nav.Link>
                                </LinkContainer><LinkContainer to="/registro"><Nav.Link>Registrarse</Nav.Link></LinkContainer>
                           </>
        }
        else{
            let nombreCompleto = this.props.usuarioLogueado['first_name'] + ' ' + this.props.usuarioLogueado['last_name']
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



