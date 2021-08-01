import React, { Component} from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'



class UsuarioInfo extends Component {

    render() {
        let tipo
        if (this.props.usuarioLogueado['is_staff']){
            tipo = "Administrador"
        }
        else{
            tipo = "Cliente"
        }

        return (
            <>
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
                            <Form.Control plaintext readOnly value={tipo} />
                        </Col>
                    </Form.Group>
                </Form>

                <Link to="/usuario/editar">
                    <Button variant="primary" className="mt-3">Modificar datos</Button>
                </Link>
            </>
        );
    }

}

export default withRouter(UsuarioInfo);