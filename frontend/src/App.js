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

import Carrito from "./components/Carrito"
import RealizarPedido from "./components/RealizarPedido"
import PedidosCliente from "./components/PedidosCliente"
import PedidosAdministrador from "./components/PedidosAdministrador"

import Usuarios from "./components/Usuarios"
import UsuarioAniadir from "./components/UsuarioAniadir"
import UsuarioEditarAdmin from "./components/UsuarioEditarAdmin"
import UsuarioCambiarContraseniaAdmin from "./components/UsuarioCambiarContraseniaAdmin"




import 'bootstrap/dist/css/bootstrap.min.css';



class App extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            usuarioLogueado: null,
            catalogo: null,
            tiendas: null,
            carrito: {},
            usuarios: null
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
            resultProductos => {
                for (let i = 0 ; i < resultProductos.data.length ; i++){
                    resultProductos.data[i]['opiniones'] = []
                }
                axiosInstance.get('/opiniones/').then(
                    resultOpiniones => {
                        for (let i = 0 ; i < resultOpiniones.data.length ; i++){
                            let o = resultOpiniones.data[i]
                            let cont = true
                            for (let j = 0 ; cont && j < resultProductos.data.length ; j++){
                                if (o['producto'] === resultProductos.data[j]['id']){
                                    resultProductos.data[j]['opiniones'].push(o)
                                    cont = false
                                }
                            }
                        }

                        this.setState( { catalogo: resultProductos.data } )
                    }
                ).catch (error => {
                    console.log(error)
                    this.setState( { catalogo: null })
                })
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

    actualizarUsuarios = () => {
        axiosInstance.get('/usuarios/').then(
            result => {
                this.setState( { usuarios: result.data } )
            }
        ).catch (error => {
            console.log(error)
            this.setState( { usuarios: null })
        })
    }

    setCarrito = (carrito) => {
        this.setState( { carrito: carrito } )
    }

    vaciarCarrito = () => {
        this.setState( { carrito: {} } )
    }

    actualizarTodo = () => {
        this.actualizarUsuarioLogueado()
        this.actualizarCatalogo()
        this.actualizarTiendas()
        this.actualizarUsuarios()
    }


    render() {
        let inicioSesion = <InicioSesion actualizarTodo={this.actualizarTodo} vaciarCarrito={this.vaciarCarrito} />
        let usuarioCambiarContraseniaAdmin, usuarioEditarAdmin, usuarioAniadir, usuarios, realizarPedido, carrito, pedidos,
            usuarioInfo, usuarioEditar, cambiarContrasenia, catalogo, aniadirProducto, productoInfo, productoEditar, tiendas, tiendaAniadir, tiendaEditar

        if (this.state.usuarioLogueado != null){
            usuarioInfo = <UsuarioInfo usuarioLogueado={this.state.usuarioLogueado} actualizarUsuarioLogueado={this.actualizarUsuarioLogueado} />
            usuarioEditar = <UsuarioEditar usuarioLogueado={this.state.usuarioLogueado} actualizarUsuarioLogueado={this.actualizarUsuarioLogueado} />
            cambiarContrasenia = <CambiarContrasenia usuarioLogueado={this.state.usuarioLogueado} actualizarUsuarioLogueado={this.actualizarUsuarioLogueado} />
            catalogo = <Catalogo usuarioLogueado={this.state.usuarioLogueado} catalogo={this.state.catalogo} />
            productoInfo = <ProductoInfo catalogo={this.state.catalogo} actualizarCatalogo={this.actualizarCatalogo} usuarioLogueado={this.state.usuarioLogueado}
                                         carrito={this.state.carrito} setCarrito={this.setCarrito} />
            tiendas = <Tiendas tiendas={this.state.tiendas} actualizarTiendas={this.actualizarTiendas} usuarioLogueado={this.state.usuarioLogueado} />


            if (this.state.usuarioLogueado['is_staff']){
                aniadirProducto = <AniadirProducto actualizarCatalogo={this.actualizarCatalogo}/>
                productoEditar = <ProductoEditar catalogo={this.state.catalogo} actualizarCatalogo={this.actualizarCatalogo} />
                tiendaAniadir = <TiendaAniadir tiendas={this.state.tiendas} actualizarTiendas={this.actualizarTiendas} usuarioLogueado={this.state.usuarioLogueado} />
                tiendaEditar = <TiendaEditar tiendas={this.state.tiendas} actualizarTiendas={this.actualizarTiendas} />
                pedidos = <PedidosAdministrador catalogo={this.state.catalogo} tiendas={this.state.tiendas} usuarios={this.state.usuarios} /> 
                usuarios = <Usuarios usuarios={this.state.usuarios} />
                usuarioAniadir = <UsuarioAniadir actualizarUsuarios={this.actualizarUsuarios} />
                usuarioEditarAdmin = <UsuarioEditarAdmin usuarios={this.state.usuarios} actualizarUsuarios={this.actualizarUsuarios} />
                usuarioCambiarContraseniaAdmin = <UsuarioCambiarContraseniaAdmin />
                realizarPedido = carrito = inicioSesion
            }
            else{
                carrito = <Carrito carrito={this.state.carrito} setCarrito={this.setCarrito} catalogo={this.state.catalogo} />
                realizarPedido = <RealizarPedido carrito={this.state.carrito} setCarrito={this.setCarrito} usuarioLogueado={this.state.usuarioLogueado}
                                                 tiendas={this.state.tiendas} />
                pedidos = <PedidosCliente usuarioLogueado={this.state.usuarioLogueado} catalogo={this.state.catalogo} tiendas={this.state.tiendas} /> 
                usuarioCambiarContraseniaAdmin = 
                usuarioEditarAdmin = usuarioAniadir = usuarios = tiendaEditar = tiendaAniadir = productoEditar = aniadirProducto = inicioSesion
            }

        }
        else{
            usuarioCambiarContraseniaAdmin = usuarioEditarAdmin = usuarioAniadir 
            = usuarios = pedidos = realizarPedido = carrito = tiendaEditar = tiendaAniadir = tiendas = productoEditar = 
            productoInfo = catalogo = aniadirProducto = cambiarContrasenia = usuarioInfo = usuarioEditar = inicioSesion
        }

        return (
            <>
            <Cabecera usuarioLogueado={this.state.usuarioLogueado} actualizarTodo={this.actualizarTodo} vaciarCarrito={this.vaciarCarrito} />
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
                    <Route exact path={"/carrito"}>
                        { carrito }
                    </Route>
                    <Route exact path={"/carrito/realizar-pedido"}>
                        { realizarPedido }
                    </Route>
                    <Route exact path={"/pedidos"}>
                        { pedidos }
                    </Route>
                    <Route exact path={"/usuarios"}>
                        { usuarios }
                    </Route>
                    <Route exact path={"/usuarios/aniadir"}>
                        { usuarioAniadir }
                    </Route>
                    <Route exact path={"/usuarios/editar/:id"}>
                        { usuarioEditarAdmin }
                    </Route>
                    <Route exact path={"/usuarios/cambiar-contrasenia/:id"}>
                        { usuarioCambiarContraseniaAdmin }
                    </Route>
                    <Route exact path={"/"} render={() => <h2>Bienvenido a la tienda</h2>}/>
                </Switch>
            </Container>
        </>
        );
    }
}

export default App;