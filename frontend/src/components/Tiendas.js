import React, { Component } from "react";
import { Link } from "react-router-dom";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'




class Tiendas extends Component {

    render() {
        let tiendas = this.props.tiendas.map(elemento => (
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey={ elemento.id }>
                        { elemento.nombre } - { elemento.direccion.localidad } - { (elemento.direccion.provincia !== null ? (elemento.direccion.provincia + " - ") : null ) } { elemento.direccion.pais }
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={ elemento.id }>
                    <Card.Body>

                        <Row className="mb-2">
                            <Col>
                                <h4>Descripción</h4>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <p className="text-justify">{ elemento.descripcion }</p>

                                <h4 className="mt-4 mb-3">Dirección</h4>

                                <p>{ elemento.direccion.direccion }</p>
                                <p>{ elemento.direccion.localidad } { (elemento.direccion.provincia !== null ? ("(" + elemento.direccion.provincia + ")") : " " ) } { elemento.direccion.codigo_postal }</p>
                                <p>{ elemento.direccion.pais }</p>

                                { this.props.usuarioLogueado['is_staff'] ?
                                    <>
                                        <h4 className="mt-5 mb-4">Panel de administración</h4>
                                            <Row>
                                                <Col className="col-auto">
                                                    <Link to={"/tiendas/editar/" + elemento.id}>
                                                        <Button variant="secondary">Editar datos</Button>
                                                    </Link>
                                                </Col>
                                            </Row>
                                    </>

                                    : null
                                }
                            </Col>

                            <Col>
                                <Card>
                                    <Card.Img variant="top" src={"http://localhost:8000" + elemento.imagen} width="200" />
                                </Card>
                            </Col>
                        </Row>



                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        ))
        

        let botonAniadir

        if (this.props.usuarioLogueado['is_staff']){
            botonAniadir =  <Row className="mt-5">
                                <Link to="/tiendas/aniadir">
                                    <Button variant="primary">Añadir tienda</Button>
                                </Link>
                            </Row>
        }

        return (
            <>
                <h2 className="mb-5">Tiendas</h2>

                <Accordion defaultActiveKey="0">
                    { tiendas }
                </Accordion>

                { botonAniadir }

            </>
        );
    }

}

export default Tiendas;