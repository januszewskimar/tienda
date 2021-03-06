import { React, Component } from 'react';
import { withRouter } from 'react-router-dom';

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import listaPaises from '../utils/ListaPaises'

import axiosInstance from '../../axiosApi';



class TiendaAniadir extends Component {

    constructor(props){
        super(props);

        this.state = {
            nombre: "",
            descripcion: "",
            precio: "",
            unidades_disponibles: "",
            imagen: "",

            direccion: "",
            localidad: "",
            provincia: "",
            codigo_postal: "",
            pais: "España",

            mostrarMensajeError: "",
            mensajeError: ""
        };
    }

    handleChange = (event) => {
        this.setState( { [event.target.name]: event.target.value } );
    }

    handleChangeImagen = (event) => {
        this.setState( { imagen: event.target.files[0] } );
    }

    cerrarMensajeError = () =>{
        this.setState( { mostrarMensajeError: false, mensajeError: "" } );
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState( { mostrarMensajeError: false, mensajeError: "" } );

        if (this.state.pais === "España" && this.state.provincia === ""){
            this.setState( { mostrarMensajeError: true,
                             mensajeError: "Es necesario rellenar el campo de provincia en caso de una dirección en España." } );
        }
        else if (this.state.pais === "España" &&
                 (this.state.codigo_postal.length !== 5 || /^\d+$/.test(this.state.codigo_postal) === false)){
            this.setState( { mostrarMensajeError: true, mensajeError: "El código postal es incorrecto." } );
        }
        else{
            try {
                let datos = new FormData();

                let direccion = {
                    destinatario: this.state.nombre,
                    direccion: this.state.direccion,
                    localidad: this.state.localidad,
                    codigo_postal: this.state.codigo_postal,
                    pais: this.state.pais };

                if (this.state.provincia !== ""){
                    direccion.provincia = this.state.provincia;
                }

                datos.append('nombre', this.state.nombre);
                datos.append('descripcion', this.state.descripcion);
                datos.append('imagen', this.state.imagen);
                datos.append('direccion', JSON.stringify(direccion));

                await axiosInstance.post('/tiendas/', datos);
                this.props.actualizarTiendas();
                this.props.history.push('/tiendas');
            } catch (error) {
                this.setState( { mostrarMensajeError: true,
                                 mensajeError: "No se ha podido añadir la tienda" } );
                console.log(error)
            }
        }
    }


    
    render() {

        let paises = listaPaises();

        return (
            <>
                <Form onSubmit={this.handleSubmit}>

                    <h2 className="mb-4">Añadir una nueva tienda</h2>


                    <Form.Group controlId="formNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control placeholder="Introduzca el nombre de la tienda" value={this.state.nombre} 
                                    name="nombre" onChange={this.handleChange} required />
                    </Form.Group>

                    <Form.Group controlId="formDescripcion">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control placeholder="Introduzca la descripción" value={this.state.descripcion} 
                                    name="descripcion" onChange={this.handleChange} as="textarea" rows="5" required />
                    </Form.Group>

                    <Form.Group controlId="formImagen">
                        <Form.Label>Imagen</Form.Label>
                        <Form.File name="imagen" onChange={this.handleChangeImagen} required />
                    </Form.Group>


                    <h4 className="mt-5 mb-3">Dirección</h4>

                    <Form.Group controlId="formDireccion">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control placeholder="Introduzca el tipo de vía (p.ej. calle), su nombre, número, etc." value={this.state.direccion} 
                                    name="direccion" onChange={this.handleChange} required />
                    </Form.Group>

                    <Form.Group controlId="formLocalidad">
                        <Form.Label>Localidad</Form.Label>
                        <Form.Control placeholder="Introduzca la localidad" value={this.state.localidad} 
                                    name="localidad" onChange={this.handleChange} required />
                    </Form.Group>

                    <Form.Group controlId="formProvincia">
                        <Form.Label>Provincia</Form.Label>
                        <Form.Control placeholder="Introduzca la provincia" value={this.state.provincia} 
                                    name="provincia" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="formCodigoPostal">
                        <Form.Label>Código postal</Form.Label>
                        <Form.Control placeholder="Introduzca el código postal" value={this.state.codigo_postal} 
                                    name="codigo_postal" onChange={this.handleChange} required />
                    </Form.Group>

                    <Form.Group controlId="formPais">
                        <Form.Label>País</Form.Label>
                        <Form.Control as="select" name="pais" value={this.state.pais} onChange={this.handleChange}>
                            { paises.map((elemento) => (
                                <option>{ elemento }</option>
                            )) }
                        </Form.Control>
                    </Form.Group>


                    <Button className="mt-4" variant="primary" type="submit">
                        Añadir
                    </Button>           



                    { this.state.mostrarMensajeError ?
                        <Modal show={this.state.mostrarMensajeError} onHide={this.cerrarMensajeError}>
                            <Modal.Header closeButton>
                                <Modal.Title>Error al añadir la tienda</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>{ this.state.mensajeError }</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.cerrarMensajeError}>
                                    Cerrar
                                </Button>
                            </Modal.Footer>
                        </Modal>
                     : null
                    }

                </Form>
            </>
        );
    }
}

export default withRouter(TiendaAniadir);