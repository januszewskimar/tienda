import React, { Component } from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap'
import { withRouter } from "react-router-dom";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'






class Carrito extends Component {

    constructor(props){
        super(props)
        this.state = {
            modalModificarCantidadVisible: false,
            idEditado: null,
            cantidadIntroducida: null,
            cantidadMax: null
        }
    }

    eliminarProducto(id){
        let carrito = this.props.carrito
        delete carrito[id]
        this.props.setCarrito(carrito)
    }

    ocultarModalModificarCantidad = () => {
        this.setState({modalModificarCantidadVisible: false, 
            idEditado: null,
            cantidadMax: null, 
            cantidadIntroducida: null})    }

    mostrarModalModificarCantidad = (id) => {
        let producto
        let cont = true
        for (let i = 0 ; cont && i < this.props.catalogo.length ; i++){
            if (parseInt(this.props.catalogo[i].id) === parseInt(id)){
                producto = this.props.catalogo[i]
                cont = false
            }
        }
        this.setState({modalModificarCantidadVisible: true, 
                       idEditado: id,
                       cantidadMax: producto['unidades_disponibles'], 
                       cantidadIntroducida: this.props.carrito[id]})
    }

    modificarCantidadProducto = (event) => {
        event.preventDefault()
        let carrito = this.props.carrito
        carrito[this.state.idEditado] = this.state.cantidadIntroducida
        this.props.setCarrito(carrito)
        this.ocultarModalModificarCantidad()
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        let importeTotal = 0
        let productos = Object.entries(this.props.carrito).map(([key, value]) => {
            let elemento
            let cont = true
            for (let i = 0 ; cont && i < this.props.catalogo.length ; i++){
                if (parseInt(this.props.catalogo[i].id) === parseInt(key)){
                    elemento = this.props.catalogo[i]
                    cont = false
                }
            }

            importeTotal += elemento.precio * value

            return  <ListGroup.Item>
                        <Row>
                            <Col xs="2" className="my-auto">
                                <Link to={"/catalogo/info/" + elemento.id }>
                                    <Card>
                                        <Card.Img variant="top" src={"http://localhost:8000" + elemento.imagen} />
                                    </Card>
                                </Link>
                            </Col>
                            <Col xs="6" className="my-auto">

                                <Link to={"/catalogo/info/" + elemento.id }>
                                    <h4>{ elemento.nombre }</h4>
                                </Link>

                                Precio: { elemento.precio } €<br/>
                                Cantidad: { value }<br/>
                                Total: { parseFloat(elemento.precio * value).toFixed(2) }
                            </Col>
                            <Col xs="4" className="my-auto">
                                <Button className="float-right ml-2" variant="danger" onClick={() => this.eliminarProducto(elemento.id)}>Eliminar</Button>
                                <Button className="float-right" variant="secondary" onClick={() => this.mostrarModalModificarCantidad(elemento.id)}>Modificar cantidad</Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
        })


        return (
            <>
                <h2 className="mb-5">Carrito</h2>

                <ListGroup>
                    { productos }
                </ListGroup>

                <h5 className="mt-5">Importe total: <b>{ parseFloat(importeTotal).toFixed(2) } €</b></h5>

                { Object.keys(this.props.carrito).length !== 0 ?
                <LinkContainer to="/carrito/realizar-pedido">
                    <Button className="mt-3" variant="primary">Realizar pedido</Button>
                </LinkContainer>
                : null}

                <Modal show={this.state.modalModificarCantidadVisible} onHide={this.ocultarModalModificarCantidad}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modificar la cantidad del producto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="formCantidad" onSubmit={this.modificarCantidadProducto}>
                            <Form.Group>
                                <Form.Label column lg={2}>Cantidad:</Form.Label>
                                <Form.Control name="cantidadIntroducida" value={this.state.cantidadIntroducida} type="number"
                                            min={1} max={this.state.cantidadMax} onChange={this.handleChange} required />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.ocultarModalModificarCantidad}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit" form="formCantidad">
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

}

export default withRouter(Carrito);