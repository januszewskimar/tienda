import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { withRouter } from "react-router-dom";


import axiosInstance from "../axiosApi";

class CambiarContrasenia extends Component{
    constructor(props){
        super(props);
        this.state = {
            password1: "",
            password2: "",
            mensajeError:"",
            mostrarMensajeError: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState( { mostrarMensajeError: false, mensajeError: "" } )

        if (this.state.password1 !== this.state.password2){
            this.setState({mostrarMensajeError: true, mensajeError: "Las contraseñas no coinciden."})
        }
        else{
            try {
                const response = await axiosInstance.put('/usuarios/' + this.props.usuarioLogueado['id'], {
                    password: this.state.password1
                });
                this.props.history.push('/usuario/info')
                return response;
            } catch (error) {
                this.setState({mostrarMensajeError: true, mensajeError: "No se ha podido cambiar la contraseña"})
                console.log(error)
            }
        }
    }

    

    render() {
        let alertError

        if (this.state.mostrarMensajeError){
            alertError =    <Alert variant="danger">
                                <Alert.Heading>Error</Alert.Heading>
                                <p>
                                    { this.state.mensajeError }
                                </p>
                            </Alert>
        }

        return (
            <>
            { alertError }

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
                        Confirmar
                    </Button>               
            </Form>
            </>
        )
    }
}

export default withRouter(CambiarContrasenia);
