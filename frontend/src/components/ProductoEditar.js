import React, { Component } from "react";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { withRouter } from "react-router-dom";

import axiosInstance from "../axiosApi";



class ProductoEditar extends Component {

    constructor(props){
        super(props)

        this.state = {
            id: parseInt(this.props.match.params['id']),
            nombre: "",
            descripcion: "",
            precio: "0",
            unidades_disponibles: "0",
            imagen: null,

            mostrarMensajeError: "",
            mensajeError: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeImagen = this.handleChangeImagen.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        if (this.props.catalogo !== null){
            this.cargarDatos()
        }
    }

    componentDidUpdate(prevProps){
        if (prevProps.catalogo === null && this.props.catalogo !== null){
            this.cargarDatos()
        }
    }

    cargarDatos = () => {
        let producto

        for (let i = 0 ; i < this.props.catalogo.length ; i++){
            if (this.props.catalogo[i]['id'] === this.state.id){
                producto = this.props.catalogo[i]
            }
        }

        this.setState( { nombre: producto.nombre,
                         descripcion: producto.descripcion,
                         precio: producto.precio,
                         unidades_disponibles: producto.unidades_disponibles,
                        } )
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleChangeImagen(event) {
        if (event.value !== ""){
            this.setState( { imagen: event.target.files[0] } );
        }
        else{
            this.setState( {imagen: null} )
        }
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
            if (this.state.imagen != null){
                datos.append('imagen', this.state.imagen);
            }

            await axiosInstance.patch('/productos/' + this.state.id, datos);
            this.props.actualizarCatalogo()
            this.props.history.push('/catalogo/')
        } catch (error) {
            this.setState( { mostrarMensajeError: true, mensajeError: ""})    
            
        }
    }

    render() {
        let alertError
        if (this.state.mostrarMensajeError){
            alertError =    <Alert variant="danger">
                                <Alert.Heading>Error al modificar los datos</Alert.Heading>
                                <p>
                                    { this.state.mensajeError }
                                </p>
                            </Alert>
        }


        return (
            <>
                { alertError }
                <Form onSubmit={this.handleSubmit}>
                    <h2 className="mb-4">Modificar los datos del producto</h2>

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
                        <Form.File name="imagen" onChange={this.handleChangeImagen} />
                        <Form.Text className="text-muted">
                            Si no selecciona una imagen, se mantendrá la actual.
                        </Form.Text>
                    </Form.Group>

                    <Button className="mt-4" variant="primary" type="submit">
                        Guardar
                    </Button>               
                </Form>
            </>

        );
    }

}

export default withRouter(ProductoEditar);