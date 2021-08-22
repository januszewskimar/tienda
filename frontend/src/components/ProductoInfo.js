import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Alert from 'react-bootstrap/Alert'

import StarOutlineIcon from '@material-ui/icons/StarOutline';
import StarIcon from '@material-ui/icons/Star';

import axiosInstance from "../axiosApi";



class ProductoInfo extends Component{

    constructor(props){
        super(props)
        this.state = {
            id: parseInt(this.props.match.params['id']),
            mostrarModalEliminar: false,
            cantidadCompra: 1,

            modalAniadirComentarioVisible: false,
            valoracionNumerica: 0,
            titulo: "",
            descripcion: "",
            mensajeErrorAniadirComentarioVisible: false,
            mensajeErrorAniadirComentario: ""
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

    mostrarModalAniadirComentario = () => {
        this.setState( { modalAniadirComentarioVisible: true, valoracionNumerica: 0, titulo: "", descripcion: "", mensajeErrorAniadirComentarioVisible: false } )
    }

    ocultarModalAniadirComentario = () => {
        this.setState( { modalAniadirComentarioVisible: false, mensajeErrorAniadirComentarioVisible: false } )
    }

    setValoracionNumerica = (num) => {
        this.setState( { valoracionNumerica: num } )
    }

    handleGuardarComentario = (event) => {
        event.preventDefault()

        if (this.state.valoracionNumerica === 0){
            this.setState( { mensajeErrorAniadirComentarioVisible: true, mensajeErrorAniadirComentario: "Seleccione una valoración numérica." } )
        }
        else{
            let datos = { producto: this.state.id,
                          valoracion_numerica: this.state.valoracionNumerica,
                          titulo: this.state.titulo,
                          descripcion: this.state.descripcion }

            axiosInstance.post('/opiniones/', datos).then(
                result => {
                    this.props.actualizarCatalogo()
                    this.setState( { modalAniadirComentarioVisible: false, mensajeErrorAniadirComentarioVisible: false } )
                }
            ).catch (error => {
                console.log(error)
                this.setState( { mensajeErrorAniadirComentarioVisible: true, mensajeErrorAniadirComentario: "No se ha podido añadir el comentario." } )
            })
        }
    }

    handleChangeTitulo = (event) => {
        this.setState( { titulo: event.target.value } )
    }

    handleChangeDescripcion = (event) => {
        this.setState( { descripcion: event.target.value } )
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
                <Row>
                    <Col>
                        <Card>
                            <Card.Img variant="top" src={"http://localhost:8000" + producto.imagen} />
                        </Card>

                        <Card className="mt-3">
                            <Card.Body>
                                <Card.Title><h3 className="mb-4">Opiniones</h3></Card.Title>

                                { this.props.usuarioLogueado['is_staff'] ? 
                                    null
                                :
                                <Row className="mt-4">
                                        <Col>
                                            <Button variant="secondary" onClick={this.mostrarModalAniadirComentario}>Añadir opinión</Button>
                                        </Col>
                                </Row>
                                }                   
                            </Card.Body>
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

                <Modal show={this.state.modalAniadirComentarioVisible} onHide={this.ocultarModalAniadirComentario}>
                    <Modal.Header closeButton>
                        <Modal.Title>Añadir un comentario</Modal.Title>
                    </Modal.Header>
                                    
                    <Modal.Body>
                    <Form id="formAniadirComentario" onSubmit={this.handleGuardarComentario}>

                        <Form.Group controlId="formNombre">
                            <Row>
                                <Col>
                                    <Form.Label>Valoración numérica</Form.Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <ToggleButtonGroup type="checkbox" >

                                        <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(1)}>
                                            { this.state.valoracionNumerica >= 1 ?
                                            <StarIcon />
                                            :
                                            <StarOutlineIcon /> }
                                        </ToggleButton>

                                        <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(2)}>
                                        { this.state.valoracionNumerica >= 2 ?
                                            <StarIcon />
                                            :
                                            <StarOutlineIcon /> }                                
                                        </ToggleButton>

                                        <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(3)}>
                                        { this.state.valoracionNumerica >= 3 ?
                                            <StarIcon />
                                            :
                                            <StarOutlineIcon /> }                                
                                        </ToggleButton>

                                        <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(4)}>
                                        { this.state.valoracionNumerica >= 4 ?
                                            <StarIcon />
                                            :
                                            <StarOutlineIcon /> }                                
                                        </ToggleButton>

                                        <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(5)}>
                                        { this.state.valoracionNumerica === 5 ?
                                            <StarIcon />
                                            :
                                            <StarOutlineIcon /> }                                
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId="formNombre">
                            <Form.Label>Título</Form.Label>
                            <Form.Control placeholder="Introduzca el título del comentario" value={this.state.tituloFormulario} 
                                        name="nombre" onChange={this.handleChangeTitulo} required />
                        </Form.Group>

                        <Form.Group controlId="formDescripcion">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control placeholder="Introduzca la descripción" value={this.state.descripcionFormulario} 
                                        name="descripcion" onChange={this.handleChangeDescripcion} as="textarea" rows="5" required />
                        </Form.Group>
                        </Form>

                        { this.state.mensajeErrorAniadirComentarioVisible ? 
                            <Alert variant="danger">
                                <Alert.Heading>Error al añadir el comentario.</Alert.Heading>
                                <p>
                                    { this.state.mensajeErrorAniadirComentario }
                                </p>
                            </Alert>
                            : null
                        }

                    </Modal.Body>
                                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.ocultarModalAniadirComentario}>Cerrar</Button>
                        <Button variant="primary" form="formAniadirComentario" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Modal>            
            </>
        )
    }
}

export default withRouter(ProductoInfo);