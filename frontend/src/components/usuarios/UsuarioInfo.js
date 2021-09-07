import { React, Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import axiosInstance from '../../axiosApi';




class UsuarioInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
            mostrarModalEliminar: false
        };
    }

    ocultarModalEliminar = () => {
        this.setState( { mostrarModalEliminar: false } );
    }

    mostrarModalEliminar = () => {
        this.setState( { mostrarModalEliminar: true } );
    }

    eliminarUsuario = () => {
        axiosInstance.delete('/usuarios/' + this.props.usuarioLogueado['id']).then(
            () => {
                this.props.actualizarUsuarioLogueado();
                this.props.history.push('/');
            }
        ).catch (error => {
            console.log(error);
        });
    }


    
    render() {

        return (
            <>
                <Modal show={this.state.mostrarModalEliminar} onHide={this.ocultarModalEliminar}>
                    <Modal.Header closeButton>
                        <Modal.Title>Eliminar la cuenta</Modal.Title>
                    </Modal.Header>
                                    
                    <Modal.Body>
                        <p>¿Está seguro de que quiere eliminar su cuenta de usuario?</p>
                    </Modal.Body>
                                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.ocultarModalEliminar}>No</Button>
                        <Button variant="danger" onClick={this.eliminarUsuario}>Sí</Button>
                    </Modal.Footer>
                </Modal>



                <h2 className="mb-4">Datos personales de la cuenta</h2>

                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formCorreo">
                        <Form.Label column sm="2">
                            Correo electrónico
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly value={this.props.usuarioLogueado['email']} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formNombre">
                        <Form.Label column sm="2">
                            Nombre
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly value={this.props.usuarioLogueado['first_name']} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formApellidos">
                        <Form.Label column sm="2">
                            Apellidos
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly value={this.props.usuarioLogueado['last_name']} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formTipo">
                        <Form.Label column sm="2">
                            Tipo de usuario
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly value={ this.props.usuarioLogueado['is_staff'] ?
                                                                        "Administrador"
                                                                     :  "Cliente"
                                                                    } />
                        </Col>
                    </Form.Group>
                </Form>

                <Row className="mt-5">
                    <Col>
                        <Link to="/usuario/editar">
                            <Button variant="primary">Modificar datos</Button>
                        </Link>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col>
                        <Link to="/usuario/cambiar-contrasenia">
                            <Button variant="secondary" className="">Cambiar contraseña</Button>
                        </Link>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col>
                        <Button variant="danger" className="warning" onClick={this.mostrarModalEliminar}>Eliminar cuenta</Button>
                    </Col>
                </Row>
            </>
        );
    }

}

export default withRouter(UsuarioInfo);