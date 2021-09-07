import { React, Component } from 'react';
import { withRouter } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import axiosInstance from '../../axiosApi';


class UsuarioEditar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.usuarioLogueado['id'],
            correo: this.props.usuarioLogueado['email'],
            nombre: this.props.usuarioLogueado['first_name'],
            apellidos: this.props.usuarioLogueado['last_name'],
            mostrarMensajeError: false,
            mensajeError: ""
        };
    }


    handleSubmit = (event) => {
        event.preventDefault();
        this.setState( { mostrarMensajeError: false, mensajeError: "" } );
        axiosInstance.patch('/usuarios/' + this.state.id, {
            email: this.state.correo,
            first_name: this.state.nombre,
            last_name: this.state.apellidos,
        }).then(
            () => {
                this.props.actualizarUsuarioLogueado();
                this.props.history.push('/usuario/info');
            }
        ).catch (error => {
            if (error.response.status === 409){
                this.setState( { mensajeError: "Ya existe una cuenta con el correo que ha proporcionado" } );
            }
            else{
                this.setState( { mensajeError: "" } );
            }
            this.setState( { mostrarMensajeError: true } );
        });
    }

    handleChange = (event) => {
        this.setState( { [event.target.name]: event.target.value } );
    }


    
    render() {

        return (
            <>
                { this.state.mostrarMensajeError ?
                    <Alert variant="danger">
                        <Alert.Heading>Error al modificar los datos.</Alert.Heading>
                        <p>
                            { this.state.mensajeError }
                        </p>
                    </Alert>
                 : null
                }

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