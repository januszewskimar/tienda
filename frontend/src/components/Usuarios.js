import React, { Component } from "react";
import { LinkContainer } from 'react-router-bootstrap'
import { withRouter } from "react-router-dom";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import axiosInstance from "../axiosApi";




class Usuarios extends Component {

    constructor(props){
        super(props)
        this.state = { filtroNombreCorreo: "",
                       filtroTipo: "Cualquier tipo",
            
                       modalEliminarCuentaVisible: false,
                       idUsuarioAEliminar: null,

                       modalErrorEliminarCuentaVisible: false,
                       mensajeErrorEliminarCuenta: "",
                       modalExitoEliminarCuentaVisible: false }
    }

    mostrarModalEliminarCuenta = (id) => {
        this.setState( { idUsuarioAEliminar: id,
                         modalEliminarCuentaVisible: true, 
                        } )
    }

    ocultarModalEliminarCuenta = () => {
        this.setState( { modalEliminarCuentaVisible: false } )
    }

    ocultarModalExitoEliminarCuenta = () => {
        this.setState( { modalExitoEliminarCuentaVisible: false } )
    }

    ocultarModalErrorEliminarCuenta = () => {
        this.setState( { modalErrorEliminarCuentaVisible: false } )
    }

    eliminarCuenta = () => {
        axiosInstance.delete('/usuarios/' + this.state.idUsuarioAEliminar).then(
            result => {
                this.props.actualizarUsuarios()
                this.ocultarModalEliminarCuenta()
                this.setState( { modalExitoEliminarCuentaVisible: true } )
            }
        ).catch (error => {
            this.setState( { modalErrorEliminarCuentaVisible: true, mensajeErrorEliminarCuenta: "No se ha podido eliminar la cuenta." })
            console.log(error)
        })
    }

    filtrarNombreCorreo = (usuarios) => {
        if (this.state.filtroNombreCorreo === ""){
            return usuarios
        }

        let u = []
        for (let i = 0 ; i < usuarios.length ; i++){
            let nombre = usuarios[i]['first_name'] + ' ' + usuarios[i]['last_name'];
            nombre = nombre.toLowerCase()
            if (nombre.toLowerCase().includes(this.state.filtroNombreCorreo.toLowerCase()) ||
                usuarios[i]['email'].includes(this.state.filtroNombreCorreo.toLowerCase())){
                    u.push(usuarios[i]);
            }
        }
        return u
    }

    handleChangeFiltroNombreCorreo = (event) => {
        this.setState( { filtroNombreCorreo: event.target.value } )
    }

    filtrarTipo = (usuarios) => {
        if (this.state.filtroTipo === "Cualquier tipo"){
            return usuarios;
        }
        else{
            let u = [];
            for (let i = 0 ; i < usuarios.length ; i++){
                if ( (this.state.filtroTipo === "Clientes" && !usuarios[i]['is_staff']) ||
                     (this.state.filtroTipo === "Administradores" && usuarios[i]['is_staff'])){
                    u.push(usuarios[i]);
                }
            }
            return u;
        }
    }

    handleChangeFiltroTipo = (event) => {
        this.setState( { filtroTipo: event.target.value } )
    }

    restablecerFiltros = () => {
        this.setState( { filtroNombreCorreo: "", filtroTipo: "Cualquier tipo" } )
    }

    render() {
        if (this.props.usuarios === null || this.props.usuarioLogueado === null){
            return null;
        }

        let usuariosFiltrados = this.props.usuarios
        usuariosFiltrados = this.filtrarNombreCorreo(usuariosFiltrados)
        usuariosFiltrados = this.filtrarTipo(usuariosFiltrados)

        let usuarios = usuariosFiltrados.map(elemento => (
            <tr>
                <td>{ elemento.email }</td>
                <td>{ elemento.first_name }</td>
                <td>{ elemento.last_name }</td>
                <td>{ elemento.is_staff ?
                        "Administrador"
                        :
                        "Cliente" }
                </td>
                <td>
                    <ButtonGroup>
                        <LinkContainer to={"/usuarios/editar/" + elemento.id }>
                            <Button variant="outline-primary" size="sm">Editar datos</Button>
                        </LinkContainer>

                        <LinkContainer to={"/usuarios/cambiar-contrasenia/" + elemento.id }>
                            <Button variant="outline-secondary" size="sm">Cambiar contraseña</Button>
                        </LinkContainer>

                        { this.props.usuarioLogueado['id'] !== elemento['id'] ?
                            <Button variant="outline-danger" size="sm" onClick={() => this.mostrarModalEliminarCuenta(elemento['id'])}>
                                Eliminar cuenta
                            </Button>
                            : null
                        }
                    </ButtonGroup>
                </td>
            </tr>
        ))


        return (
            <>
                <h2 className="mb-5">Usuarios</h2>

                <Row className="mb-4 d-flex">

                    <Col>
                        <Form.Control className="" placeholder="Introduzca el correo o nombre para buscar"
                                            value={this.state.filtroNombreCorreo} onChange={this.handleChangeFiltroNombreCorreo} />
                    </Col>

                    <Col xs="auto">
                        <Form.Control className="" as="select" value={this.state.filtroTipo} 
                                    onChange={this.handleChangeFiltroTipo}>
                            <option>Cualquier tipo</option>
                            <option>Clientes</option>
                            <option>Administradores</option>
                        </Form.Control>
                    </Col>

                    <Col xs="auto">
                        <Button className="float-right" variant="secondary" onClick={this.restablecerFiltros}>
                            Restablecer filtros
                        </Button>
                    </Col>

                </Row>

                { usuarios.length > 0 ?
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Correo</th>
                                <th>Nombre</th>
                                <th>Apellidos</th>
                                <th>Tipo de usuario</th>
                                <th>Editar</th>
                            </tr>
                        </thead>

                        <tbody>
                            { usuarios }
                        </tbody>

                    </Table>
                    : <h4 className="mt-5">No se han encontrado resultados</h4> }

                <Row className="mt-5">
                    <Col>
                        <LinkContainer to="/usuarios/aniadir">
                            <Button variant="primary">Añadir administrador</Button>
                        </LinkContainer>
                    </Col>
                </Row>



                <Modal show={this.state.modalEliminarCuentaVisible} onHide={this.ocultarModalEliminarCuenta}>
                    <Modal.Header closeButton>
                        <Modal.Title>Eliminar la cuenta</Modal.Title>
                    </Modal.Header>
                                    
                    <Modal.Body>
                        <p>¿Está seguro de que quiere eliminar la cuenta?</p>
                    </Modal.Body>
                                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.ocultarModalEliminarCuenta}>No</Button>
                        <Button variant="danger" onClick={this.eliminarCuenta}>Sí</Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={this.state.modalExitoEliminarCuentaVisible} onHide={this.ocultarModalExitoEliminarCuenta}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cuenta eliminada</Modal.Title>
                    </Modal.Header>
                                    
                    <Modal.Body>
                        <p>La cuenta se ha eliminado correctamente.</p>
                    </Modal.Body>
                                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.ocultarModalExitoEliminarCuenta}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={this.state.modalErrorEliminarCuentaVisible} onHide={this.ocultarModalErrorEliminarCuenta}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error al eliminar la cuenta</Modal.Title>
                    </Modal.Header>
                                    
                    <Modal.Body>
                        <p>{ this.state.mensajeErrorEliminarCuenta }</p>
                    </Modal.Body>
                                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.ocultarModalErrorEliminarCuenta}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>

            </>
        );
    }

}

export default withRouter(Usuarios);