import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'




class Carrito extends Component {

    constructor(props){
        super(props)
        this.state = {

        }
    }

    eliminarProducto(id){
        let carrito = this.props.carrito
        delete carrito[id]
        this.props.setCarrito(carrito)
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
                            <Col xs="8" className="my-auto">

                                <Link to={"/catalogo/info/" + elemento.id }>
                                    <h4>{ elemento.nombre }</h4>
                                </Link>

                                Precio: { elemento.precio } €<br/>
                                Cantidad: { value }<br/>
                                Total: { parseFloat(elemento.precio * value).toFixed(2) }
                            </Col>
                            <Col xs="2" className="my-auto">
                                <Button variant="danger" onClick={() => this.eliminarProducto(elemento.id)}>Eliminar</Button>
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
            </>
        );
    }

}

export default withRouter(Carrito);