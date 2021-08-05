import React, { Component } from "react";
import { Link } from "react-router-dom";
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'



class Catalogo extends Component {

    render() {
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
                { botonAniadir }
            </>

        );
    }

}

export default Catalogo;