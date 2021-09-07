import { React, Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import axiosInstance from '../../axiosApi';



class UsuarioAniadir extends Component{
    constructor(props){
        super(props);

        this.state = {
            password1: "",
            password2: "",
            email:"",
            first_name:"",
            last_name:"",

            mensajeError:"",
            modalErrorVisible: false,
            modalExitoVisible: false
        };
    }

    

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    ocultarModalExito = () => {
        this.setState( { modalExitoVisible: false } );
    }

    ocultarModalError = () => {
        this.setState( { modalErrorVisible: false } );
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState( { mostrarMensajeExito: false,
                         mostrarMensajeError: false,
                         mensajeError: "" } );

        if (this.state.password1 !== this.state.password2){
            this.setState( { mostrarMensajeError: true, mensajeError: "Las contraseñas no coinciden." } );
        }
        else{
            axiosInstance.post('/usuarios/', {
                email: this.state.email,
                password: this.state.password1,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                is_staff: true
            }).then( () => {
                this.setState( { modalExitoVisible: true } );
                this.props.actualizarUsuarios();
            }).catch(error => {
                if (error.response.status === 409){
                    this.setState( { mensajeError: "Ya existe un usuario con el correo que ha proporcionado en el formulario." } );
                }
                else{
                    this.setState( { mensajeError: "No se ha podido crear el usuario."} );
                }
                
                this.setState( { modalErrorVisible: true } );
            });
        }
    }

    

    render() {

        return (
            <>
                <Form onSubmit={this.handleSubmit}>
                    <h2 className="mb-4">Formulario de registro de administrador</h2>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control type="email" placeholder="Introduzca el correo electrónico" value={this.state.email} 
                                        name="email" onChange={this.handleChange} required />
                            <Form.Text className="text-muted">
                                Mediante este correo podrá iniciar sesión.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" minLength="8" placeholder="Introduzca la contraseña" value={this.state.password1} 
                                        name="password1" onChange={this.handleChange} required />
                            <Form.Text className="text-muted">
                                Tiene que ser de al menos 8 carácteres.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formPassword2">
                            <Form.Label>Contraseña (repetir)</Form.Label>
                            <Form.Control type="password" minLength="8" placeholder="Repita la contraseña" value={this.state.password2} 
                                        name="password2" onChange={this.handleChange} required />
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
                            <Modal.Title>Cuenta creada correctamente</Modal.Title>
                        </Modal.Header>
                                        
                        <Modal.Body>
                            <p>El administrador podrá iniciar sesión usando las credenciales introducidas</p>
                        </Modal.Body>
                                        
                        <Modal.Footer>
                            <LinkContainer to="/usuarios">
                                <Button variant="secondary">Cerrar</Button>
                            </LinkContainer>
                        </Modal.Footer>
                </Modal>

                <Modal show={this.state.modalErrorVisible} onHide={this.ocultarModalError}>
                        <Modal.Header closeButton>
                            <Modal.Title>Error al crear la cuenta</Modal.Title>
                        </Modal.Header>
                                        
                        <Modal.Body>
                            <p>{ this.state.mensajeError }</p>
                        </Modal.Body>
                                        
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.ocultarModalError}>Cerrar</Button>
                        </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default UsuarioAniadir;