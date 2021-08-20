import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { LinkContainer } from "react-router-bootstrap";
import axiosInstance from "../axiosApi";
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';



class Cabecera extends Component {

    cerrarSesion = () => {
        axiosInstance.post('/token/invalidar/', {
            "refresh_token": localStorage.getItem("refresh_token")
        }).then( result => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            this.props.actualizarTodo();
            this.props.vaciarCarrito();
            this.props.history.push('/');
        }).catch (error => {
            console.log(error);
        })
    }

    render(){
        let parteDerecha, parteIzquierda;

        if (this.props.usuarioLogueado === null){
            parteDerecha =  <>
                                <LinkContainer to="/inicio-sesion"><Nav.Link>Iniciar sesión</Nav.Link></LinkContainer>
                                <LinkContainer to="/registro"><Nav.Link>Registrarse</Nav.Link></LinkContainer>
                            </>
        }
        else{
            let nombreCompleto = this.props.usuarioLogueado['first_name'] + ' ' + this.props.usuarioLogueado['last_name']
            parteDerecha = <>
                                { !(this.props.usuarioLogueado['is_staff']) ?
                                    <LinkContainer to="/carrito">
                                        <Nav.Link>
                                            <Button variant="link">
                                                <ShoppingCartOutlinedIcon />
                                            </Button>
                                        </Nav.Link>
                                    </LinkContainer>
                                : null}
                                <Navbar.Text className="mr-2">
                                    <LinkContainer to="/usuario/info">
                                        <Button variant="link">{nombreCompleto}</Button>
                                    </LinkContainer>
                                </Navbar.Text>
                                <Button variant="outline-secondary" onClick={this.cerrarSesion}>Cerrar sesión</Button>

                           </>

            parteIzquierda =    <>
                                    <LinkContainer to="/catalogo"><Nav.Link>Catálogo</Nav.Link></LinkContainer>
                                    <LinkContainer to="/tiendas"><Nav.Link>Tiendas</Nav.Link></LinkContainer>
                                    <LinkContainer to="/pedidos"><Nav.Link>Pedidos</Nav.Link></LinkContainer>
                                </>
        }
        return (
                <Navbar bg="light" variant="light">
                    <LinkContainer to="/"><Navbar.Brand>Tienda</Navbar.Brand></LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            {parteIzquierda}
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



