import React, { Component} from "react";
import Container from 'react-bootstrap/Container'
import { Switch, Route } from "react-router-dom";
import Registro from "./components/Registro";
import InicioSesion from "./components/InicioSesion";
import Cabecera from "./components/Cabecera";
import UsuarioInfo from "./components/UsuarioInfo";


import 'bootstrap/dist/css/bootstrap.min.css';



class App extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            sesionIniciada: false
        }
    }

    setSesionIniciada = (v) => {
        this.setState( { sesionIniciada: v })
    }

    render() {
        return (
            <>
            <Cabecera sesionIniciada={this.state.sesionIniciada} setSesionIniciada={this.setSesionIniciada} />
            <Container className="mt-5">
                <Switch>
                    <Route exact path={"/registro/"} component={Registro}/>
                    <Route exact path={"/inicio-sesion/"}>
                        <InicioSesion setSesionIniciada={this.setSesionIniciada}/>
                    </Route>
                    <Route exact path={"/usuario/info"}>
                        <UsuarioInfo setSesionIniciada={this.setSesionIniciada}/>
                    </Route>
                    <Route exact path={"/"} render={() => <h2>Bienvenido a la tienda</h2>}/>
                </Switch>
            </Container>
        </>
        );
    }
}

export default App;
