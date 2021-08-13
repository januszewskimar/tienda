import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import axiosInstance from "../axiosApi";



class ProductoInfo extends Component{

    constructor(props){
        super(props)
        this.state = {
            id: parseInt(this.props.match.params['id']),
            mostrarModalEliminar: false,
            cantidadCompra: 1
        }
    }

    ocultarModalEliminar = () => {
        this.setState({mostrarModalEliminar: false})
    }

    mostrarModalEliminar = () => {
        this.setState({mostrarModalEliminar: true})
    }

    eliminarProducto = () => {
        axiosInstance.delete('/productos/' + this.props.match.params['id']).then(
            result => {
                this.props.actualizarCatalogo()
                this.props.history.push('/catalogo')
            }
        ).catch (error => {
            console.log(error)
        })
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    aniadirAlCarrito = (event) => {
        event.preventDefault()
        let carrito = this.props.carrito
        carrito[this.state.id] = this.state.cantidadCompra
        this.props.setCarrito(carrito)
    }


    render() {

        let id = this.state.id
        let producto
        for (let i = 0 ; i < this.props.catalogo.length ; i++){
            if (this.props.catalogo[i]['id'] === id){
                producto = this.props.catalogo[i]
            }
        }

        let fecha_introduccion = new Date(producto.fecha_introduccion)
        fecha_introduccion = fecha_introduccion.toLocaleString()

        let fecha_modificacion = new Date(producto.fecha_modificacion)
        fecha_modificacion = fecha_modificacion.toLocaleString()


        let botonesAdministrador, areaCompra

        if (this.props.usuarioLogueado['is_staff']){
            botonesAdministrador =  <Row className="mt-4">
                                        <Col className="col-auto">
                                            <Link to={"/catalogo/editar/" + id}>
                                                <Button variant="secondary">Editar datos</Button>
                                            </Link>
                                        </Col>
                                        <Col className="col-auto">
                                            <Button variant="danger" onClick={this.mostrarModalEliminar}>Eliminar producto</Button>
                                        </Col>
                                    </Row>
        }
        else{
            if (!(id in this.props.carrito)){
                areaCompra =    <Form>
                                    <Form.Row className="mt-4">
                                        <Form.Label column lg={2}>Cantidad:</Form.Label>

                                        <Col xs={2}>
                                            <Form.Control name="cantidadCompra" value={this.state.cantidadCompra} type="number"
                                                        min={1} max={producto.unidades_disponibles} onChange={this.handleChange} />
                                        </Col>

                                        <Col>
                                            <Button type="submit" onClick={this.aniadirAlCarrito}>Añadir al carrito</Button>
                                        </Col>
                                    </Form.Row>
                                </Form>
            }
            else{
                areaCompra =    <Row className="mt-4">
                                    <Col>
                                        Ha añadido {this.props.carrito[id] === 1 ? "una unidad" : this.props.carrito[id] + " unidades" } de este producto al <Link to="/carrito/">carrito</Link>.
                                    </Col>
                                </Row>
            }
            
        }

        return (
            <>
                <Modal show={this.state.mostrarModalEliminar} onHide={this.ocultarModalEliminar}>
                    <Modal.Header closeButton>
                        <Modal.Title>Eliminar el producto</Modal.Title>
                    </Modal.Header>
                                    
                    <Modal.Body>
                        <p>¿Está seguro de que quiere eliminar el producto?</p>
                    </Modal.Body>
                                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.ocultarModalEliminar}>No</Button>
                        <Button variant="danger" onClick={this.eliminarProducto}>Sí</Button>
                    </Modal.Footer>
                </Modal>

                <Row>
                    <Col>
                        <Card>
                            <Card.Img variant="top" src={"http://localhost:8000" + producto.imagen} />
                        </Card>
                    </Col>

                    <Col>
                        <Card className="text-left">
                            <Card.Body>
                                <Card.Title><h2 className="mb-4">{ producto.nombre }</h2></Card.Title>
                                <Card.Text>
                                    <Row>
                                        <Col>
                                            <p className="text-justify">{ producto.descripcion }</p>
                                        </Col>
                                    </Row>

                                    { areaCompra }

                                    <Row className="mt-4">
                                        <Col>
                                            <h4>{ producto.precio } €/unidad</h4>
                                        </Col>
                                    </Row>
                                                    
                                    <Row className="mt-2">
                                        <Col>
                                            <small>Unidades disponibles: { producto.unidades_disponibles }</small>
                                        </Col>
                                    </Row>

                                    <Row className="mt-2">
                                        <Col>
                                            <small>Fecha de introducción: { fecha_introduccion }</small>
                                        </Col>
                                    </Row>

                                    <Row className="mt-2">
                                        <Col>
                                            <small>Fecha de modificación: { fecha_modificacion }</small>
                                        </Col>
                                    </Row>

                                    { botonesAdministrador }

                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }
}

export default withRouter(ProductoInfo);