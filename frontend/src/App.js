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

import Catalogo from "./components/Catalogo";
import AniadirProducto from "./components/AniadirProducto";
import ProductoInfo from "./components/ProductoInfo";
import ProductoEditar from "./components/ProductoEditar";

import Tiendas from "./components/Tiendas"
import TiendaAniadir from "./components/TiendaAniadir"
import TiendaEditar from "./components/TiendaEditar"







import 'bootstrap/dist/css/bootstrap.min.css';



class App extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            usuarioLogueado: null,
            catalogo: null,
            tiendas: null
        }
    }

    componentDidMount(){
        this.actualizarTodo()
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

    actualizarCatalogo = () => {
        axiosInstance.get('/productos/').then(
            result => {
                this.setState( { catalogo: result.data } )
            }
        ).catch (error => {
            console.log(error)
            this.setState( { catalogo: null })
        })
    }

    actualizarTiendas = () => {
        axiosInstance.get('/tiendas/').then(
            result => {
                this.setState( { tiendas: result.data } )
            }
        ).catch (error => {
            console.log(error)
            this.setState( { tiendas: null })
        })
    }

    actualizarTodo = () => {
        this.actualizarUsuarioLogueado()
        this.actualizarCatalogo()
        this.actualizarTiendas()
    }


    render() {
        let inicioSesion = <InicioSesion actualizarTodo={this.actualizarTodo} />
        let usuarioInfo, usuarioEditar, cambiarContrasenia, catalogo, aniadirProducto, productoInfo, productoEditar, tiendas, tiendaAniadir, tiendaEditar

        if (this.state.usuarioLogueado != null){
            usuarioInfo = <UsuarioInfo usuarioLogueado={this.state.usuarioLogueado} actualizarUsuarioLogueado={this.actualizarUsuarioLogueado} />
            usuarioEditar = <UsuarioEditar usuarioLogueado={this.state.usuarioLogueado} actualizarUsuarioLogueado={this.actualizarUsuarioLogueado} />
            cambiarContrasenia = <CambiarContrasenia usuarioLogueado={this.state.usuarioLogueado} actualizarUsuarioLogueado={this.actualizarUsuarioLogueado} />
            catalogo = <Catalogo usuarioLogueado={this.state.usuarioLogueado} catalogo={this.state.catalogo} />
            productoInfo = <ProductoInfo catalogo={this.state.catalogo} actualizarCatalogo={this.actualizarCatalogo} usuarioLogueado={this.state.usuarioLogueado} />
            tiendas = <Tiendas tiendas={this.state.tiendas} actualizarTiendas={this.actualizarTiendas} usuarioLogueado={this.state.usuarioLogueado} />


            if (this.state.usuarioLogueado['is_staff']){
                aniadirProducto = <AniadirProducto actualizarCatalogo={this.actualizarCatalogo}/>
                productoEditar = <ProductoEditar catalogo={this.state.catalogo} actualizarCatalogo={this.actualizarCatalogo} />
                tiendaAniadir = <TiendaAniadir tiendas={this.state.tiendas} actualizarTiendas={this.actualizarTiendas} usuarioLogueado={this.state.usuarioLogueado} />
                tiendaEditar = <TiendaEditar tiendas={this.state.tiendas} actualizarTiendas={this.actualizarTiendas} />
            }
            else{
                tiendaEditar = tiendaAniadir = productoEditar = aniadirProducto = inicioSesion
            }

        }
        else{
            tiendaEditar = tiendaAniadir = tiendas = productoEditar 
            = productoInfo = catalogo = aniadirProducto = cambiarContrasenia = usuarioInfo = usuarioEditar = inicioSesion
        }

        return (
            <>
            <Cabecera usuarioLogueado={this.state.usuarioLogueado} actualizarTodo={this.actualizarTodo} />
            <Container className="mt-5 mb-5">
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
                    <Route exact path={"/catalogo"}>
                        { catalogo }
                    </Route>
                    <Route path={"/catalogo/aniadir"}>
                        { aniadirProducto }
                    </Route>
                    <Route path={"/catalogo/info/:id"}>
                        { productoInfo }
                    </Route>
                    <Route path={"/catalogo/editar/:id"}>
                        { productoEditar }
                    </Route>
                    <Route exact path={"/tiendas/"}>
                        { tiendas }
                    </Route>
                    <Route path={"/tiendas/aniadir"}>
                        { tiendaAniadir }
                    </Route>
                    <Route path={"/tiendas/editar/:id"}>
                        { tiendaEditar }
                    </Route>
                    <Route exact path={"/"} render={() => <h2>Bienvenido a la tienda</h2>}/>
                </Switch>
            </Container>
        </>
        );
    }
}

export default App;