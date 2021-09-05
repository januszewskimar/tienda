import React, { Component } from "react";
import { Link } from "react-router-dom";
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'



class Catalogo extends Component {

    constructor(props){
        super(props)

        this.state = { filtroNombre: "" }
    }

    handleChangeFiltroNombre = (event) => {
        this.setState( { filtroNombre: event.target.value } )
    }

    filtrarNombre = (productos) => {
        if (this.state.filtroNombre === ""){
            return productos
        }

        let p = [];
        for (let i = 0 ; i < productos.length ; i++){
            if (productos[i]['nombre'].toLowerCase().includes(this.state.filtroNombre.toLowerCase())) {
                p.push(productos[i]);
            }
        }
        return p;
    }

    render() {

        if (this.props.catalogo === null){        
            return null;
        }

        let productos

        let productosFiltrados = this.props.catalogo
        productosFiltrados = this.filtrarNombre(productosFiltrados)

        if (productosFiltrados.length != 0){
           let arrays = [], tamanio = 3

            for (let i = 0 ; i < productosFiltrados.length ; i += tamanio){
                arrays.push(productosFiltrados.slice(i, i + tamanio))
            }

                productos = arrays.map(grupo => (
                    <Row className="d-flex mb-5 justify-content-center">
                        {
                        grupo.map(elemento => (
                            <Col className="d-flex justify-content-center">
                                <Card className="text-center" style={{ width: '20rem' }}>
                                    <Card.Img variant="top" src={"http://localhost:8000" + elemento.imagen} width="200" height="200" />
                                    <Card.Body>
                                        <Card.Title>{ elemento.nombre }</Card.Title>
                                        <Card.Text>
                                            { elemento.precio } €
                                        </Card.Text>
                                        <Link to={"/catalogo/info/" + elemento.id }>
                                            <Button variant="outline-info" size="sm">Ver más</Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            ))
        }
        else{
            productos = <h4>No se han encontrado resultados</h4>
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

                <Form.Control className="mb-5" placeholder="Introduzca el nombre para buscar"
                              value={this.state.filtroNombre} onChange={this.handleChangeFiltroNombre} />

                { productos }

                { botonAniadir }
            </>
        );
    }

}

export default Catalogo;