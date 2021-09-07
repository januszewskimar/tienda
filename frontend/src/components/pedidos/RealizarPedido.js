import { React, Component } from 'react';
import { withRouter } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import listaPaises from '../utils/ListaPaises'

import axiosInstance from '../../axiosApi';



class RealizarPedido extends Component {

    constructor(props){
        super(props);
        this.state = {
            tipo_entrega: null,
            tienda: null,

            destinatario: this.props.usuarioLogueado.first_name +
                          " " +
                          this.props.usuarioLogueado.last_name,
            direccion: "",
            localidad: "",
            provincia: "",
            codigo_postal: "",
            pais: "España",

            nota: "",

            mostrarMensajeError: false,
            mensajeError: "",

            mostrarMensajeExito: false,

            codigo_recogida: ""
        };
    }

    handleChange = (event) => {
        this.setState( { [event.target.name]: event.target.value } );
    }

    handleChangeImagen = (event) => {
        this.setState( { imagen: event.target.files[0] } );
    }

    handleRadio = (event) => {
        this.setState( { tipo_entrega: event.target.id } );
    }

    handleSeleccionTienda = (event) => {
        this.setState( { tienda: event.target.value } );
    }
    
    cerrarMensajeError = () => {
        this.setState( { mostrarMensajeError: false, mensajeError: "" } );
    }

    cerrarMensajeExito = () => {
        this.setState( { mostrarMensajeError: false } );
        this.props.history.push('/');
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState( { mostrarMensajeError: false, mensajeError: "" } );

        let error = false

        if (this.state.tipo_entrega === "entregaPostal"){
            if (this.state.pais === "España" && this.state.provincia === ""){
                this.setState( { mostrarMensajeError: true,
                                 mensajeError: "Es necesario rellenar el campo de provincia en caso de una dirección en España." } );
                error = true;
            }
            else if (this.state.pais === "España" &&
                     (this.state.codigo_postal.length !== 5 || /^\d+$/.test(this.state.codigo_postal) === false)){
                this.setState( { mostrarMensajeError: true,
                                 mensajeError: "El código postal es incorrecto." } );
                error = true;
            }
        }
        else{
            if (this.state.tienda === null){
                this.setState( { mostrarMensajeError: true,
                                 mensajeError: "Es necesario seleccionar una tienda" } );
                error = true;

            }
        }

        if (!error){
            try {
                let productos = [];

                Object.entries(this.props.carrito).forEach(([key, value]) => {
                    productos.push( { producto: key, cantidad: value } );
                })

                let datos = { productos: productos };

                if (this.state.nota !== ""){
                    datos.nota = this.state.nota;
                }
                
                if (this.state.tipo_entrega === "entregaPostal"){
                    datos.direccion = { destinatario: this.state.destinatario,
                                        direccion: this.state.direccion,
                                        localidad: this.state.localidad,
                                        codigo_postal: this.state.codigo_postal,
                                        pais: this.state.pais
                                      };
                    if (this.state.provincia !== ""){
                        datos.direccion.provincia = this.state.provincia;
                    }
                }
                else{
                    datos.tienda = this.state.tienda;
                }

                const result = await axiosInstance.post('/pedidos/', datos);
                if (this.state.tipo_entrega === "entregaTienda"){
                    this.setState( { codigo_recogida: result.data['codigo_recogida'] } );
                }
                this.setState( { mostrarMensajeExito: true } );
                this.props.setCarrito( { } );
                this.props.actualizarCatalogo();

            } catch (error) {
                if (error.response){
                    if (error.response.status === 409){
                        this.setState( { mensajeError: "No hay unidades disponibles de un producto para poder realizar este pedido." } );
                    }
                    else{
                        this.setState( { mensajeError: "No se ha podido realizar el pedido." } );
                    } 
                }
                else{
                    console.log(error);
                }
                this.setState( { mostrarMensajeError: true } );
            }
        }
    }


    
    render() {
        if (this.props.tiendas === null){
            return null;
        }

        let paises = listaPaises();

        let formulario;
        
        if (this.state.tipo_entrega === "entregaTienda"){
            formulario =    <>
                                <h4 className="mt-5 mb-4">Tienda</h4>

                                <Form.Control as="select" onChange={this.handleSeleccionTienda} required >
                                    <option disabled hidden selected value>Elegir una tienda de la lista</option>
                                    { this.props.tiendas.map((elemento) => 
                                        <option value={ elemento.id }>
                                            { elemento.nombre + " - "}
                                            { elemento.direccion.localidad + " - "}
                                            { (elemento.direccion.provincia !== null ?
                                                (elemento.direccion.provincia + " - ")
                                                : null )
                                            }
                                            { elemento.direccion.pais }
                                        </option>
                                      )
                                    }
                                </Form.Control>

                                <h4 className="mt-5 mb-3">Nota</h4>


                                <Form.Group controlId="formNota">
                                    <Form.Control placeholder="Puede introducir una nota sobre el pedido" value={this.state.nota} 
                                                name="nota" onChange={this.handleChange} />
                                </Form.Group>

                                <Button className="mt-4" variant="primary" type="submit">
                                    Realizar pedido
                                </Button>    
                            </>
        }
        else if (this.state.tipo_entrega === "entregaPostal"){
            formulario = <>
                                <h4 className="mt-5 mb-3">Dirección</h4>

                                <Form.Group controlId="formNombre">
                                    <Form.Label>Destinatario</Form.Label>
                                    <Form.Control placeholder="Introduzca el nombre del destinatario" value={this.state.destinatario} 
                                                  name="destinatario" onChange={this.handleChange} required />
                                </Form.Group>

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

                                <h4 className="mt-5 mb-3">Nota</h4>


                                <Form.Group controlId="formNota">
                                    <Form.Control placeholder="Puede introducir una nota sobre el pedido" value={this.state.nota} 
                                                name="nota" onChange={this.handleChange} />
                                </Form.Group>

                                <Button className="mt-4" variant="primary" type="submit">
                                    Realizar pedido
                                </Button>    
                            </>
        }

        return (
            <>
                <h2 className="mb-5">Realizar pedido</h2>

                <h4 className="mb-4">Tipo de entrega</h4>

                <Form.Check inline
                    type="radio"
                    label="Entrega postal"
                    name="tipoEntrega"
                    id="entregaPostal"
                    onChange={this.handleRadio.bind(this)}
                />

                <Form.Check inline
                    type="radio"
                    label="Entrega en una tienda"
                    name="tipoEntrega"
                    id="entregaTienda"
                    onChange={this.handleRadio.bind(this)}
                />

                <Form onSubmit={this.handleSubmit}>
                    { formulario }
                </Form>


                <Modal show={this.state.mostrarMensajeError} onHide={this.cerrarMensajeError}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error al realizar el pedido</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{ this.state.mensajeError }</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.cerrarMensajeError}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={this.state.mostrarMensajeExito} onHide={this.cerrarMensajeExito}>
                    <Modal.Header closeButton>
                        <Modal.Title>Pedido realizado correctamente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{ this.state.tipo_entrega === "entregaTienda" ?
                                    <>Cuando el pedido esté disponible para recoger, podrá hacerlo usando el siguiente código: { this.state.codigo_recogida }.</> 
                                  : <>El pedido llegará a la dirección que ha indicado en el formulario.</>}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.cerrarMensajeExito}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default withRouter(RealizarPedido);