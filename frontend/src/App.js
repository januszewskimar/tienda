import React, { Component} from "react";
import Container from 'react-bootstrap/Container'
import { Switch, Route } from "react-router-dom";
import axiosInstance from "./axiosApi";
import Registro from "./components/Registro";
import InicioSesion from "./components/InicioSesion";
import Cabecera from "./components/Cabecera";
import UsuarioInfo from "./components/UsuarioInfo";
import UsuarioEditar from "./components/UsuarioEditar";
import CambiarContrasenia from "./components/CambiarContrasenia";



import 'bootstrap/dist/css/bootstrap.min.css';



class App extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            usuarioLogueado: null
        }
    }

    componentDidMount(){
        this.actualizarUsuarioLogueado()
    }

    actualizarUsuarioLogueado = () => {
        axiosInstance.get('/usuario-sesion-iniciada/').then(
            result => {
                this.setState( {usuarioLogueado: result.data } )
            }
        ).catch (error => {
            console.log(error)
            this.setState( { usuarioLogueado: null })
        })
    }


    render() {
        let inicioSesion = <InicioSesion usuarioLogueado={this.state.usuarioLogueado} actualizarUsuarioLogueado={this.actualizarUsuarioLogueado} />
        let usuarioInfo, usuarioEditar, cambiarContrasenia

        if (this.state.usuarioLogueado != null){
            usuarioInfo = <UsuarioInfo usuarioLogueado={this.state.usuarioLogueado} actualizarUsuarioLogueado={this.actualizarUsuarioLogueado} />
            usuarioEditar = <UsuarioEditar usuarioLogueado={this.state.usuarioLogueado} actualizarUsuarioLogueado={this.actualizarUsuarioLogueado} />
            cambiarContrasenia = <CambiarContrasenia usuarioLogueado={this.state.usuarioLogueado} actualizarUsuarioLogueado={this.actualizarUsuarioLogueado} />
        }
        else{
            cambiarContrasenia = usuarioInfo = usuarioEditar = inicioSesion
        }

        return (
            <>
            <Cabecera usuarioLogueado={this.state.usuarioLogueado} actualizarUsuarioLogueado={this.actualizarUsuarioLogueado} />
            <Container className="mt-5">
                <Switch>
                    <Route exact path={"/registro/"} component={Registro}/>
                    <Route exact path={"/inicio-sesion/"}>
                        { inicioSesion }
                    </Route>
                    <Route path={"/usuario/info"}>
                        { usuarioInfo }
                    </Route>
                    <Route path={"/usuario/editar"}>
                        { usuarioEditar }
                    </Route>
                    <Route path={"/usuario/cambiar-contrasenia"}>
                        { cambiarContrasenia }
                    </Route>
                    <Route exact path={"/"} render={() => <h2>Bienvenido a la tienda</h2>}/>
                </Switch>
            </Container>
        </>
        );
    }
}

export default App;