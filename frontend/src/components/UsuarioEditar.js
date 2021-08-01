import React, { Component} from "react";
import { withRouter } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'


class UsuarioEditar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.usuarioLogueado['id'],
            correo: this.props.usuarioLogueado['email'],
            nombre: this.props.usuarioLogueado['first_name'],
            apellidos: this.props.usuarioLogueado['last_name'],
            error: false,
            mensajeError: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    handleSubmit(event){
        event.preventDefault()
        this.setState({ error: false, mensajeError: "" })
        axiosInstance.put('/usuarios/' + this.state.id, {
            email: this.state.correo,
            first_name: this.state.nombre,
            last_name: this.state.apellidos,
        }).then(
            result => {
                this.props.actualizarUsuarioLogueado()
                this.props.history.push('/usuario/info')
            }
        ).catch (error => {
            if (error.response.status === 409){
                this.setState({ error: true, mensajeError: "Ya existe una cuenta con el correo que ha proporcionado" })
            }
            else{
                this.setState({ error: true, mensajeError: "" })
            }
        })
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        let mensaje
        if (this.state.error){
            mensaje =   <Alert variant="danger" className={ this.state.mostrar_mensaje_error }>
                            <Alert.Heading>Error al modificar los datos.</Alert.Heading>
                            <p>
                                { this.state.mensajeError }
                            </p>
                        </Alert>
        }

        return (
            <>
                { mensaje }

                <h2 className="mb-4">Modificar los datos personales de la cuenta</h2>

                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control type="email" placeholder="Introduzca el correo electrónico" value={this.state.correo} 
                                      name="correo" onChange={this.handleChange} required />
                    </Form.Group>

                    <Form.Group controlId="formFirstName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control placeholder="Introduzca el nombre" value={this.state.nombre}
                                      name="nombre" onChange={this.handleChange} required />
                    </Form.Group>

                    <Form.Group controlId="formLastName">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control placeholder="Introduzca los apellidos" value={this.state.apellidos}
                                      name="apellidos" onChange={this.handleChange} required />
                    </Form.Group>

                    <Button className="mt-3" variant="primary" type="submit">
                        Guardar
                    </Button> 
            </Form>
        </>
        );
    }

}

export default withRouter(UsuarioEditar);