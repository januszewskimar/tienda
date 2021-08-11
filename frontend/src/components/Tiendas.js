import React, { Component } from "react";
import { Link } from "react-router-dom";
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'



class Tiendas extends Component {

    render() {
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

                { botonAniadir }
                
            </>
        );
    }

}

export default Tiendas;