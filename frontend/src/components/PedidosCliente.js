import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import axiosInstance from "../axiosApi";




class PedidosCliente extends Component {

    constructor(props){
        super(props)
        this.state = {
            pedidos: null,
        }
    }

    componentDidMount(){
        axiosInstance.get('/usuarios/' + this.props.usuarioLogueado.id + '/pedidos')
           .then( result => {
                this.setState( { pedidos: result.data } )
            }).catch (error => {
                console.log(error);
            })

    }

    render() {
        if (this.state.pedidos === null){
            return null;
        }

        let pedidos = this.state.pedidos.map(elemento => {
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
                                        Total: { parseFloat(e.precio * e.cantidad).toFixed(2) } €
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
                            </ListGroup.Item>)
                }
            })
            let dir
            let es_tienda = false
            if ("tienda" in elemento){
                let cont = true
                for (let i = 0 ; cont && i < this.props.tiendas.length ; i++){
                    if (parseInt(elemento['tienda']) === parseInt(this.props.tiendas[i]['id'])){
                        dir = this.props.tiendas[i]['direccion'];
                        cont = false;
                    }
                }
                if (cont === true){
                    es_tienda = true;
                    dir = null;
                }
            }
            else{
                dir = elemento['direccion']
            }
            let direccion;

            if (dir !== null){
                direccion = <>    
                                <p>{ dir.destinatario }</p>
                                <p>{ dir.direccion }</p>
                                <p>{ dir.localidad } { (dir.provincia !== null ? ("(" + dir.provincia + ")") : " " ) } { dir.codigo_postal }</p>
                                <p>{ dir.pais }</p>
                            </>
            }
            else{
                if (es_tienda){
                    direccion = <p>La tienda que se seleccionó para la entrega ya no existe.</p>
                }
                else{
                    direccion = <p>La dirección que se introdujo para la entrega no está disponible.</p>
                }
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


                            { elemento.nota !== null ?
                              ( <>
                                    <h4 className="mt-5 mb-3">Nota</h4>
                                    <p>{ elemento.nota }</p>
                                </>
                              )
                              : null
                            }
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
        )})
        

        return (
            <>
                <h2 className="mb-5">Pedidos</h2>

                <Accordion defaultActiveKey="0">
                    { pedidos }
                </Accordion>
            </>
        );
    }

}

export default withRouter(PedidosCliente);