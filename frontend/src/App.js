import React, { Component} from "react";
import Container from 'react-bootstrap/Container'
import { Switch, Route } from "react-router-dom";
import Registro from "./components/Registro";
import Cabecera from "./components/Cabecera";


import 'bootstrap/dist/css/bootstrap.min.css';



class App extends Component {

    render() {
        return (
            <>
            <Cabecera/>
            <Container className="mt-5">
                <Switch>
                    <Route exact path={"/registro/"} component={Registro}/>
                    <Route path={"/"} render={() => <h2>Bienvenido a la tienda</h2>}/>
                </Switch>
            </Container>
        </>
        );
    }
}

export default App;
