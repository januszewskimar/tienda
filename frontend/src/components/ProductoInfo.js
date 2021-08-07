import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'



class ProductoInfo extends Component{

    render() {
        let id = parseInt(this.props.match.params['id'])
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


        let botonEditar

        if (this.props.usuarioLogueado['is_staff']){
            botonEditar =   <Row className="mt-4">
                                <Col>
                                    <Link to={"/catalogo/editar/" + id}>
                                        <Button variant="secondary">Editar datos</Button>
                                    </Link>
                                </Col>
                            </Row>
        }

        return (
            <>
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


                                    <Row className="mt-4">
                                        <Col>
                                            <Button>Comprar</Button>
                                        </Col>
                                    </Row>


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
                                    { botonEditar }

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