import { React, Component } from 'react';
import { withRouter } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import axiosInstance from '../../axiosApi';

class UsuarioCambiarContraseniaAdmin extends Component{
    constructor(props){
        super(props);

        this.state = {
            password1: "",
            password2: "",

            modalExitoVisible: false,
            modalErrorVisible: false,
            mensajeError:"",
        };
    }

    handleChange = (event) => {
        this.setState( { [event.target.name]: event.target.value } );
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        if (this.state.password1 !== this.state.password2){
            this.setState( { modalErrorVisible: true, mensajeError: "Las contraseñas no coinciden." } );
        }
        else{
            try {
                await axiosInstance.patch('/usuarios/' + this.props.match.params['id'], {
                    password: this.state.password1
                });
                this.setState( { modalExitoVisible: true } );
                
            } catch (error) {
                this.setState( { modalErrorVisible: true, mensajeError: "No se ha podido cambiar la contraseña" } );
                console.log(error);
            }
        }
    }

    ocultarModalExito = () => {
        this.setState( { modalExitoVisible: false } );
        this.props.history.push('/usuarios/');
    }

    ocultarModalError = () => {
        this.setState( { modalErrorVisible: false, mensajeError: "" } );
    }


    
    render() {

        return (
            <>
                <Form onSubmit={this.handleSubmit}>
                    <h2 className="mb-4">Cambiar la contraseña</h2>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Contraseña nueva</Form.Label>
                            <Form.Control type="password" minLength="8" placeholder="Introduzca la contraseña nueva" value={this.state.password1} 
                                        name="password1" onChange={this.handleChange} required />
                            <Form.Text className="text-muted">
                                Tiene que ser de al menos 8 carácteres.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formPassword2">
                            <Form.Label>Contraseña nueva (repetir)</Form.Label>
                            <Form.Control type="password" minLength="8" placeholder="Repita la contraseña nueva" value={this.state.password2} 
                                        name="password2" onChange={this.handleChange} required />
                        </Form.Group>


                        <Button className="mt-3" variant="primary" type="submit">
                            Guardar
                        </Button>               
                </Form>

                <Modal show={this.state.modalExitoVisible} onHide={this.ocultarModalExito}>
                        <Modal.Header closeButton>
                            <Modal.Title>Contraseña modificada</Modal.Title>
                        </Modal.Header>
                                        
                        <Modal.Body>
                            <p>La contraseña se ha modificado correctamente.</p>
                        </Modal.Body>
                                        
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.ocultarModalExito}>Cerrar</Button>
                        </Modal.Footer>
                    </Modal>

                <Modal show={this.state.modalErrorVisible} onHide={this.ocultarModalError}>
                        <Modal.Header closeButton>
                            <Modal.Title>Error al cambiar la contraseña</Modal.Title>
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

export default withRouter(UsuarioCambiarContraseniaAdmin);
