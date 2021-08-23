import React, { Component } from "react";
import { LinkContainer } from 'react-router-bootstrap'
import { withRouter } from "react-router-dom";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'



class Usuarios extends Component {

    render() {

        return (
            <>
                <h2 className="mb-5">Usuarios</h2>

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