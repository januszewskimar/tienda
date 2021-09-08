import { React, Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';



class PaginaPrincipal extends Component {

    render(){
        return(
            <>
            <h2 className="mb-5">Bienvenido a la tienda</h2>
            <h4><LinkContainer to="/inicio-sesion"><a>Inicie sesión</a></LinkContainer> o <LinkContainer to="/registro"><a>regístrese</a></LinkContainer></h4>
            </>
        );
    }
}

export default PaginaPrincipal;