import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import axiosInstance from "../axiosApi";
import { LinkContainer } from "react-router-bootstrap";
import { withRouter } from "react-router-dom";



class UsuarioEditarAdmin extends Component{
    constructor(props){
        super(props);

        this.state = {
            id: parseInt(this.props.match.params['id']),
            email: "",
            first_name: "",
            last_name: "",

            mensajeError:"",
            modalErrorVisible: false,
            modalExitoVisible: false
        };
    }

    componentDidMount(){
        if (this.props.usuarios !== null){
            this.cargarDatos()
        }
    }

    componentDidUpdate(prevProps){
        if (prevProps.usuarios === null && this.props.usuarios !== null){
            this.cargarDatos()
        }
    }

    cargarDatos = () => {
        for (let i = 0 ; i < this.props.usuarios.length ; i++){
            if (parseInt(this.props.usuarios[i]['id']) === this.state.id){
                this.setState( { email: this.props.usuarios[i]['email'],
                                 first_name: this.props.usuarios[i]['first_name'],
                                 last_name: this.props.usuarios[i]['last_name'] } )
            }
        }
    }
    
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    ocultarModalExito = () => {
        this.setState( { modalExitoVisible: false } )
    }

    ocultarModalError = () => {
        this.setState( { modalErrorVisible: false } )
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState( { mostrarMensajeExito: false, mostrarMensajeError: false, mensajeError: "" } )

        axiosInstance.patch('/usuarios/' + this.state.id, {
            email: this.state.email,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
        }).then( result => {
            this.setState( { modalExitoVisible: true } )
        }).catch(error => {
            if (error.response.status === 409){
                this.setState( { mensajeError: "Ya existe un usuario con el correo que ha proporcionado en el formulario." } )
            }
            else{
                this.setState( { mensajeError: "No se han podido modificar los datos."} )
            }
            
            this.setState( { modalErrorVisible: true } )
        })
    }

    

    render() {

        return (
            <>
            <Form onSubmit={this.handleSubmit}>
                <h2 className="mb-4">Editar datos del usuario</h2>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control type="email" placeholder="Introduzca el correo electrónico" value={this.state.email} 
                                      name="email" onChange={this.handleChange} required />
                        <Form.Text className="text-muted">
                            Mediante este correo podrá iniciar sesión.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formFirstName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control placeholder="Introduzca el nombre" value={this.state.first_name}
                                      name="first_name" onChange={this.handleChange} required />
                    </Form.Group>

                    <Form.Group controlId="formLastName">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control placeholder="Introduzca los apellidos" value={this.state.last_name}
                                      name="last_name" onChange={this.handleChange} required />
                    </Form.Group>

                    <Button className="mt-3" variant="primary" type="submit">
                        Guardar
                    </Button>               
            </Form>



            <Modal show={this.state.modalExitoVisible} onHide={this.ocultarModalExito}>
                    <Modal.Header closeButton>
                        <Modal.Title>Datos modificados</Modal.Title>
                    </Modal.Header>
                                    
                    <Modal.Body>
                        <p>Los datos se han modificado.</p>
                    </Modal.Body>
                                    
                    <Modal.Footer>
                        <LinkContainer to="/usuarios">
                            <Button variant="secondary">Cerrar</Button>
                        </LinkContainer>
                    </Modal.Footer>
            </Modal>

            <Modal show={this.state.modalErrorVisible} onHide={this.ocultarModalError}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error al modificar los datos</Modal.Title>
                    </Modal.Header>
                                    
                    <Modal.Body>
                        <p>{ this.state.mensajeError }</p>
                    </Modal.Body>
                                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.ocultarModalError}>Cerrar</Button>
                    </Modal.Footer>
            </Modal>
            </>
        )
    }
}

export default withRouter(UsuarioEditarAdmin);