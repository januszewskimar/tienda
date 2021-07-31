import React, { Component} from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'



class UsuarioInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            correo: "",
            nombre: "",
            apellidos: ""
        };

    }

    componentDidMount(){
        axiosInstance.get('/usuario-sesion-iniciada/').then(
            result => {
                let tipo
                if (result.data.is_staff){
                    tipo = 'Administrador';
                }
                else{
                    tipo = 'Cliente'
                }
                this.setState( { correo: result.data.email, nombre: result.data.first_name, apellidos: result.data.last_name, tipo: tipo } )
            }
        ).catch (error => {
                if (error.response.status === 401){
                    this.props.setSesionIniciada(false)
                    this.props.history.push('/inicio-sesion')
                }
            })
    }

    render() {
        return (
            <>
                <h2 className="mb-4">Datos personales de la cuenta</h2>

                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formCorreo">
                        <Form.Label column sm="2">
                        Correo electrónico
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={this.state.correo} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formNombre">
                        <Form.Label column sm="2">
                        Nombre
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={this.state.nombre} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formApellidos">
                        <Form.Label column sm="2">
                        Apellidos
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={this.state.apellidos} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formTipo">
                        <Form.Label column sm="2">
                        Tipo de usuario
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={this.state.tipo} />
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