import React, { Component } from "react";
import { LinkContainer } from 'react-router-bootstrap'
import { withRouter } from "react-router-dom";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import PedidosAdministrador from "./PedidosAdministrador";




class Usuarios extends Component {

    render() {
        let usuarios = this.props.usuarios.map(elemento => (
            <tr>
                <td>{ elemento.email }</td>
                <td>{ elemento.first_name }</td>
                <td>{ elemento.last_name }</td>
                <td>{ elemento.is_staff ?
                        "Administrador"
                        :
                        "Cliente" }
                </td>
            </tr>
        ))


        return (
            <>
                <h2 className="mb-5">Usuarios</h2>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Correo</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Tipo de usuario</th>
                        </tr>
                    </thead>

                    <tbody>
                        { usuarios }
                    </tbody>

                </Table>

                <Row className="mt-5">
                    <Col>
                    <LinkContainer to="/usuarios/aniadir">
                        <Button variant="primary">Añadir administrador</Button>
                    </LinkContainer>
                    </Col>
                </Row>
            </>
        );
    }

}

export default withRouter(Usuarios);