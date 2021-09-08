import { React, Component } from 'react';
import { Link } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import axiosInstance from '../../axiosApi';



class Registro extends Component{
    constructor(props){
        super(props);
        this.state = {
            password1: "",
            password2: "",
            email:"",
            first_name:"",
            last_name:"",
            mensajeError:"",
            mostrarMensajeError: false,
            mostrarMensajeExito: false
        };
    }

    handleChange = (event) => {
        this.setState( { [event.target.name]: event.target.value } );
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState( { mostrarMensajeExito: false,
                         mostrarMensajeError: false,
                         mensajeError: "" } );

        if (this.state.password1 !== this.state.password2){
            this.setState( { mostrarMensajeError: true,
                             mensajeError: "Las contraseñas no coinciden." } );
        }
        else{
            try {
                const response = await axiosInstance.post('/usuarios/', {
                    email: this.state.email,
                    password: this.state.password1,
                    first_name: this.state.first_name,
                    last_name: this.state.last_name
                });
                this.setState({mostrarMensajeExito: true});
                return response;
            } catch (error) {
                if (error.response.status === 409){
                    this.setState( { mensajeError: "Ya existe un usuario con el correo que ha proporcionado en el formulario" } );
                }
                else{
                    this.setState( { mensajeError: "No se ha podido crear el usuario" } );
                }
                
                this.setState( { mostrarMensajeError: true } );
            }
        }
    }

    

    render() {

        return (
            <>
                { this.state.mostrarMensajeError ?
                    <Alert variant="danger">
                        <Alert.Heading>La cuenta no se ha creado.</Alert.Heading>
                        <p>
                            { this.state.mensajeError }
                        </p>
                    </Alert>
                : null
                }
                
                { this.state.mostrarMensajeExito ?
                    <Alert variant="success">
                        <Alert.Heading>Cuenta creada</Alert.Heading>
                        <p>
                            A partir de ahora podrá <Link to="/inicio-sesion">iniciar sesión</Link> usando el correo y la contraseña que ha proporcionado.
                        </p>
                        </Alert>
                : null
                }

                <Form onSubmit={this.handleSubmit}>
                    <h2 className="mb-4">Formulario de registro</h2>
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
                            Registrarse
                        </Button>               
                </Form>
            </>
        );
    }
}

export default Registro;
