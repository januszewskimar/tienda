import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'


class InicioSesion extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            email:"",
            password: "",
            error: false,
            mensajeError: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event){
        event.preventDefault();
        axiosInstance.post('/token/obtener/', {
            email: this.state.email,
            password: this.state.password
        }).then(
            result => {
                axiosInstance.defaults.headers['Authorization'] = "JWT " + result.data.access;
                localStorage.setItem('access_token', result.data.access);
                localStorage.setItem('refresh_token', result.data.refresh);
                this.props.actualizarUsuarioLogueado()
                this.props.history.push('/')
            }
        ).catch (error => {
            this.setState( {error: true} )
            if (error.response.status === 401){
                this.setState( {mensajeError: "El correo o la contraseña son incorrectos"} )
            }
            else{
                this.setState( {mensajeError: ""} )
            }
    
        })
    }

    

    render() {
        let alertaError;
        
        if (this.state.error){
            alertaError = <Alert variant="danger">
                        <Alert.Heading>No se ha podido iniciar sesión.</Alert.Heading>
                            <p>
                                { this.state.mensajeError }
                            </p>
                    </Alert>
        }

                     

        return (
            <>
            {alertaError}
            <Form onSubmit={this.handleSubmit}>
                <h2 className="mb-4">Iniciar sesión</h2>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control type="email" placeholder="Introduzca el correo electrónico" value={this.state.email} 
                                      name="email" onChange={this.handleChange} required />
                    </Form.Group>

                    <Form.Group controlId="formPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" minLength="8" placeholder="Introduzca la contraseña" value={this.state.password} 
                                      name="password" onChange={this.handleChange} required />
                    </Form.Group>


                    <Button className="mt-3" variant="primary" type="submit">
                        Iniciar sesión
                    </Button>               
            </Form>
            </>
        )
    }
}

export default withRouter(InicioSesion);
