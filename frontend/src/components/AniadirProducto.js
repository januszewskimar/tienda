import React, { Component } from "react";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { withRouter } from "react-router-dom";

import axiosInstance from "../axiosApi";



class AniadirProducto extends Component {

    constructor(props){
        super(props)
        this.state = {
            nombre: "",
            descripcion: "",
            precio: "",
            unidades_disponibles: "",
            imagen: "",

            mostrarMensajeError: "",
            mensajeError: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeImagen = this.handleChangeImagen.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleChangeImagen(event) {
        this.setState( { imagen: event.target.files[0] } );
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState( { mostrarMensajeError: false, mensajeError: "" } )
        
        try {
            let datos = new FormData();
            datos.append('nombre', this.state.nombre);
            datos.append('descripcion', this.state.descripcion);
            datos.append('precio', this.state.precio);
            datos.append('unidades_disponibles', this.state.unidades_disponibles);
            datos.append('imagen', this.state.imagen);

            const response = await axiosInstance.post('/productos/', datos);
            this.props.actualizarCatalogo()
            this.props.history.push('/catalogo')
        } catch (error) {
            this.setState( { mostrarMensajeError: true, mensajeError: ""})    
            
        }
    }

    render() {
        let alertError
        if (this.state.mostrarMensajeError){
            alertError =    <Alert variant="danger">
                                <Alert.Heading>Error al añadir el producto</Alert.Heading>
                                <p>
                                    { this.state.mensajeError }
                                </p>
                            </Alert>
        }


        return (
            <>
                { alertError }
                <Form onSubmit={this.handleSubmit}>
                    <h2 className="mb-4">Añadir un nuevo producto</h2>

                    <Form.Group controlId="formNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control placeholder="Introduzca el nombre del producto" value={this.state.nombre} 
                                    name="nombre" onChange={this.handleChange} required />
                    </Form.Group>

                    <Form.Group controlId="formDescripcion">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control placeholder="Introduzca la descripción" value={this.state.descripcion} 
                                    name="descripcion" onChange={this.handleChange} as="textarea" rows="5" required />
                    </Form.Group>

                    <Form.Group controlId="formPrecio">
                        <Form.Label>Precio</Form.Label>
                        <Form.Control placeholder="Introduzca el precio por unidad" value={this.state.precio} 
                                      name="precio" onChange={this.handleChange} pattern="^\d*(\.\d{0,2})?$" required />
                    </Form.Group>

                    <Form.Group controlId="formUnidadesDisponibles">
                        <Form.Label>Unidades disponibles</Form.Label>
                        <Form.Control placeholder="Introduzca el número de unidades disponibles" value={this.state.unidades_disponibles} 
                                      name="unidades_disponibles" onChange={this.handleChange} pattern="^[1-9]\d*$" required />
                    </Form.Group>

                    <Form.Group controlId="formImagen">
                        <Form.Label>Imagen</Form.Label>
                        <Form.File name="imagen" onChange={this.handleChangeImagen} required />
                    </Form.Group>

                    <Button className="mt-4" variant="primary" type="submit">
                        Añadir
                    </Button>               
                </Form>
            </>

        );
    }

}

export default withRouter(AniadirProducto);