import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import axiosInstance from "../axiosApi";




class PedidosAdministrador extends Component {

    constructor(props){
        super(props)
        this.state = {
            pedidos: null,
            pedidosFiltrados: [],
            estados: {},
            mostrarMensajeExitoEstado: false,
            mostrarMensajeErrorEstado: false,
            mensajeErrorEstado: "",
            modalEliminarVisible: false,
            pedidoAEliminar: null,

            filtroEstado: "Todos",
            filtroCliente: "",
            filtroFechaDesde: "",
            filtroFechaHasta: ""
        }
    }

    componentDidMount(){
        axiosInstance.get('/pedidos/')
        .then( result => {
             this.setState( { pedidos: result.data } )
         }).catch (error => {
             console.log(error);
         })
    }

    handleChangeEstado(event, id) {
        let estados = this.state.estados
        estados[id] = event.target.value
        this.setState({estados: estados});
    }

    handleSubmitEstado(event, id){
        event.preventDefault();


        if (this.state.estados[id] === null || this.state.estados[id] === undefined){
            this.setState( { mostrarMensajeErrorEstado: true, mensajeErrorEstado: "Tiene que seleccionar un estado." } )
        }
        else{
            axiosInstance.patch('/pedidos/' + id, { estado: this.state.estados[id] })
            .then( result => {
                    this.setState( { mostrarMensajeExitoEstado: true  } )
                    this.actualizarPedidos()
                }).catch (error => {
                    this.setState( { mostrarMensajeErrorEstado: true, mensajeErrorEstado: "No se ha podido cambiar el estado." } )
                })
        }
    }

    cerrarMensajeErrorEstado = () => {
        this.setState( { mostrarMensajeErrorEstado: false, mensajeErrorEstado: "" } )
    }

    cerrarMensajeExitoEstado = () => {
        this.setState( { mostrarMensajeExitoEstado: false } )
    }

    handleChangeFiltroEstado = (event) => {
        this.setState( { filtroEstado: event.target.value } )
    }

    filtrarEstado = (pedidos) => {
        if (this.state.filtroEstado === "Todos"){
            return pedidos;
        }
        else{
            let p = [];
            for (let i = 0 ; i < pedidos.length ; i++){
                if (pedidos[i]['estado'] === this.state.filtroEstado){
                    p.push(pedidos[i]);
                }
            }
            return p;
        }
    }

    handleChangeFiltroCliente = (event) => {
        this.setState( { filtroCliente: event.target.value.toLowerCase() } )
    }

    filtrarCliente = (pedidos) => {
        if (this.state.filtroCliente === ""){
            return pedidos;
        }
        else{
            let p = [];
            for (let i = 0 ; i < pedidos.length ; i++){
                let cont = true;
                let usuario
                for (let j = 0 ; cont && j < this.props.usuarios.length ; j++){
                    if (this.props.usuarios[j]['id'] === pedidos[i]['usuario']){
                        cont = false;
                        usuario = this.props.usuarios[j]
                        let nombre = usuario['first_name'] + ' ' + usuario['last_name'];
                        nombre = nombre.toLowerCase()
                        if (usuario['email'].toLowerCase().includes(this.state.filtroCliente) ||
                            nombre.includes(this.state.filtroCliente)){
                                p.push(pedidos[i]);
                        }
                    }
                }
            }
            return p;
        }
    }

    handleChangeFiltroFechaDesde = (event) => {
        this.setState( { filtroFechaDesde: event.target.value } )
    }

    handleChangeFiltroFechaHasta = (event) => {
        this.setState( { filtroFechaHasta: event.target.value } )
    }

    filtrarFechaDesde = (pedidos) => {
        if (this.state.filtroFechaDesde === ""){
            return pedidos;
        }

        let fechaDesde = new Date(this.state.filtroFechaDesde);

        let p = [];
        for (let i = 0 ; i < pedidos.length ; i++){
            let fecha = new Date(pedidos[i]['fecha'])
            if (fecha >= fechaDesde){
                p.push(pedidos[i]);
            }
        }
        
        return p;
    }


    filtrarFechaHasta = (pedidos) => {
        if (this.state.filtroFechaHasta === ""){
            return pedidos;
        }

        let fechaHasta = new Date(this.state.filtroFechaHasta);
        fechaHasta.setDate(fechaHasta.getDate() + 1);

        let p = [];
        for (let i = 0 ; i < pedidos.length ; i++){
            let fecha = new Date(pedidos[i]['fecha']);
            if (fecha <= fechaHasta){
                p.push(pedidos[i]);
            }
        }
        
        return p;
    }

    restablecerFiltros = () => {
        this.setState( { filtroEstado: "Todos", filtroCliente: "", filtroFechaDesde: "", filtroFechaHasta: ""} );
    }

    ocultarModalEliminar = () => {
        this.setState({modalEliminarVisible: false, pedidoAEliminar: null})
    }

    mostrarModalEliminar = (id) => {
        this.setState({modalEliminarVisible: true, pedidoAEliminar: id})
    }

    eliminarPedido = () => {
        axiosInstance.delete('/pedidos/' + this.state.pedidoAEliminar)
        .then( result => {
                this.actualizarPedidos();
                this.ocultarModalEliminar();
            }).catch (error => {
                console.log(error)
            })
    }

    render() {
        if (this.state.pedidos === null){
            return null;
        }

        let pedidosFiltrados = this.state.pedidos
        pedidosFiltrados = this.filtrarEstado(pedidosFiltrados)
        pedidosFiltrados = this.filtrarCliente(pedidosFiltrados)
        pedidosFiltrados = this.filtrarFechaDesde(pedidosFiltrados)
        pedidosFiltrados = this.filtrarFechaHasta(pedidosFiltrados)

        let pedidos = pedidosFiltrados.map(elemento => {
            let fecha = new Date(elemento.fecha)
            fecha = fecha.toLocaleString()

            let importeTotal = 0
            let productos = elemento.productos.map((e) => {
                let producto
                let cont = true
                for (let i = 0 ; cont && i < this.props.catalogo.length ; i++){
                    if (parseInt(this.props.catalogo[i].id) === parseInt(e.producto)){
                        producto = this.props.catalogo[i]
                        cont = false
                    }
                }

                if (cont === true){
                    producto = null;
                }
    
                importeTotal += e.precio * e.cantidad
    
                if (producto !== null){
                    return  (<ListGroup.Item>
                                <Row>
                                    <Col xs="2" className="my-auto">
                                        <Link to={"/catalogo/info/" + producto.id }>
                                            <Card>
                                                <Card.Img variant="top" src={"http://localhost:8000" + producto.imagen} />
                                            </Card>
                                        </Link>
                                    </Col>
                                    <Col xs="10" className="my-auto">
        
                                        <Link to={"/catalogo/info/" + producto.id }>
                                            <h4>{ producto.nombre }</h4>
                                        </Link>
        
                                        Precio: { e.precio } €<br/>
                                        Cantidad: { e.cantidad }<br/>
                                        Total: { parseFloat(e.precio * e.cantidad).toFixed(2) }
                                    </Col>
                                </Row>
                            </ListGroup.Item>)
                }
                else{
                    return  (<ListGroup.Item>
                                <Row>
                                    <Col xs="2" className="my-auto">

                                    </Col>
                                    <Col xs="10" className="my-auto">

                                        <h4>Producto eliminado del catálogo</h4>

                                        Precio: { e.precio } €<br/>
                                        Cantidad: { e.cantidad }<br/>
                                        Total: { parseFloat(e.precio * e.cantidad).toFixed(2) }
                                    </Col>
                                </Row>
                            </ListGroup.Item>)                }
            })
            let dir
            if ("tienda" in elemento){
                let cont = true
                for (let i = 0 ; cont && i < this.props.tiendas.length ; i++){
                    if (parseInt(elemento['tienda']) === parseInt(this.props.tiendas[i]['id'])){
                        dir = this.props.tiendas[i]['direccion']
                        cont = true
                    }
                }
            }
            else{
                dir = elemento['direccion']
            }
            let direccion = <>    
                                <p>{ dir.destinatario }</p>
                                <p>{ dir.direccion }</p>
                                <p>{ dir.localidad } { (dir.provincia !== null ? ("(" + dir.provincia + ")") : " " ) } { dir.codigo_postal }</p>
                                <p>{ dir.pais }</p>
                            </>

            let usuario
            let cont = true
            for (let i = 0 ; cont && i < this.props.usuarios.length ; i++){
                if (parseInt(elemento['usuario']) === parseInt(this.props.usuarios[i]['id'])){
                    usuario = this.props.usuarios[i]
                    cont = false
                }
            }

            if (cont === true){
                usuario = null
            }

            return(
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey={ elemento.id }>
                            { fecha } - { elemento.estado }
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={ elemento.id }>
                        <Card.Body>

                            <Row>
                                <Col>
                                    <h4 className="mb-3">Contenido</h4>
                                    <ListGroup>
                                        { productos }
                                    </ListGroup>
                                </Col>
                            </Row>
                            <h5 className="mt-4">Importe total: <b>{ parseFloat(importeTotal).toFixed(2) } €</b></h5>

                            <h4 className="mt-5 mb-3">
                            { "tienda" in elemento ?
                              "Recogida en tienda"
                              : "Envío postal"
                            }
                            </h4>

                            { direccion }

                            { "codigo_recogida" in elemento ?
                              ( <p className="mt-4">Código de recogida: <mark>{ elemento.codigo_recogida }</mark></p> )
                              : null
                            }

                            <h4 className="mt-5 mb-3">Cliente</h4>

                            { usuario !== null ?
                              <>
                                <p>{ usuario.first_name } { usuario.last_name }</p>
                                <p>{ usuario.email }</p>
                              </>
                              :
                              <p>La cuenta con la que se realizó este pedido ya no existe.</p>
                            }

                            { elemento.nota !== null ?
                              ( <>
                                    <h4 className="mt-5 mb-3">Nota</h4>
                                    <p>{ elemento.nota }</p>
                                </>
                              )
                              : null
                            }

                            <h4 className="mt-5 mb-4">Panel de administración</h4>

                            <Form inline onSubmit={ (event) => this.handleSubmitEstado(event, elemento.id)}>
                                <Form.Label className="mr-3">Modificar estado</Form.Label>
                                <Form.Control className="mr-3" as="select" name="pais" value={this.state.estados[elemento.id]} 
                                              onChange={(evento) => this.handleChangeEstado(evento, elemento.id)}>
                                    <option disabled hidden selected>Seleccionar estado</option>
                                    <option>Confirmado</option>
                                    <option>En preparación</option>
                                    { "tienda" in elemento ?
                                    <>
                                    <option>Listo para recoger</option>
                                    <option>Recogido</option>
                                    </>
                                    :
                                    <option>Enviado</option> }

                                </Form.Control>
                                <Button variant="primary" type="submit">
                                    Cambiar
                                </Button>
                            </Form>

                            <Button variant="danger" className="mt-4" onClick={() => this.mostrarModalEliminar(elemento.id)}>
                                    Eliminar pedido
                                </Button>
                            
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
        )})
        

        return (
            <>
                <h2 className="mb-5">Pedidos</h2>

                <Row>
                    <Col xs="2">
                        <h4 className="mb-4">Filtros</h4>

                        <Form.Label className="mt-2 mr-3">Estado</Form.Label>
                        <Form.Control className="mr-3" as="select" value={this.state.filtroEstado} 
                                      onChange={this.handleChangeFiltroEstado}>
                            <option>Todos</option>
                            <option>Confirmado</option>
                            <option>En preparación</option>
                            <option>Listo para recoger</option>
                            <option>Recogido</option>
                            <option>Enviado</option>
                        </Form.Control>


                        <Form.Label className="mt-4">Cliente</Form.Label>
                        <Form.Control className="mr-3" placeholder="Correo o nombre" value={this.state.filtroCliente} 
                                          onChange={this.handleChangeFiltroCliente} />

                        <Form.Label className="mt-4">Fecha desde</Form.Label>
                        <Form.Control type="date" value={this.state.filtroFechaDesde} onChange={this.handleChangeFiltroFechaDesde}/>

                        <Form.Label className="mt-4">Fecha hasta</Form.Label>
                        <Form.Control type="date" className="mb-2" value={this.state.filtroFechaHasta} onChange={this.handleChangeFiltroFechaHasta}/>

                        <Button className="mt-4" variant="secondary" onClick={this.restablecerFiltros}>
                            Restablecer filtros
                        </Button>

                    </Col>

                    <Col>
                        <Accordion defaultActiveKey="0">
                            { pedidos }
                        </Accordion>
                    </Col>
                </Row>
                
                <Modal show={this.state.mostrarMensajeErrorEstado} onHide={this.cerrarMensajeErrorEstado}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error al cambiar el estado</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{ this.state.mensajeErrorEstado }</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.cerrarMensajeErrorEstado}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={this.state.mostrarMensajeExitoEstado} onHide={this.cerrarMensajeExitoEstado}>
                    <Modal.Header closeButton>
                        <Modal.Title>Estado cambiado correctamente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Se ha modificado el estado correctamente.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.cerrarMensajeExitoEstado}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.modalEliminarVisible} onHide={this.ocultarModalEliminar}>
                    <Modal.Header closeButton>
                        <Modal.Title>Eliminar el pedido</Modal.Title>
                    </Modal.Header>
                                    
                    <Modal.Body>
                        <p>¿Está seguro de que quiere eliminar el pedido?</p>
                    </Modal.Body>
                                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.ocultarModalEliminar}>No</Button>
                        <Button variant="danger" onClick={this.eliminarPedido}>Sí</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

}

export default withRouter(PedidosAdministrador);