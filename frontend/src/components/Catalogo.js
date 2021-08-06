import React, { Component } from "react";
import { Link } from "react-router-dom";
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'



class Catalogo extends Component {

    render() {
        let productos

        if (this.props.catalogo != null){        
            let arrays = [], tamanio = 3

            for (let i = 0 ; i < this.props.catalogo.length ; i += tamanio){
                arrays.push(this.props.catalogo.slice(i, i + tamanio))
            }

            productos = arrays.map(grupo => (
                <Row className="mb-5">
                    {
                        grupo.map(elemento => (
                            <Col>
                                <Card className="text-center" style={{ width: '20rem' }}>
                                    <Card.Img variant="top" src={"http://localhost:8000" + elemento.imagen} width="200" height="200" />
                                    <Card.Body>
                                        <Card.Title>{ elemento.nombre }</Card.Title>
                                        <Card.Text>
                                            { elemento.precio } €
                                        </Card.Text>
                                        <Button variant="outline-info" size="sm">Ver más</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            ))
        }
        else{
            productos = <h4>No hay productos en el catálgo</h4>
        }

        let botonAniadir

        if (this.props.usuarioLogueado['is_staff']){
            botonAniadir =  <Row className="mt-5">
                                <Link to="/catalogo/aniadir">
                                    <Button variant="primary">Añadir producto</Button>
                                </Link>
                            </Row>
        }

        return (
            <>
                <h2 className="mb-5">Catálogo</h2>

                { productos }

                { botonAniadir }
            </>
        );
    }

}

export default Catalogo;