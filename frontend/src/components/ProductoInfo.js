import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Alert from 'react-bootstrap/Alert'

import StarOutlineIcon from '@material-ui/icons/StarOutline';
import StarIcon from '@material-ui/icons/Star';

import axiosInstance from "../axiosApi";



class ProductoInfo extends Component{

    constructor(props){
        super(props)
        this.state = {
            id: parseInt(this.props.match.params['id']),
            
            cantidadCompra: 1,

            modalEliminarProductoVisible: false,

            modalAniadirOpinionVisible: false,
            mensajeErrorAniadirOpinionVisible: false,
            mensajeErrorAniadirOpinion: "",

            modalModificarOpinionVisible: false,
            mensajeErrorModificarOpinionVisible: false,
            mensajeErrorModificarOpinion: "",

            valoracionNumerica: 0,
            titulo: "",
            descripcion: "",

            modalEliminarOpinionVisible: false,
            opinionAEliminar: null
        }
    }

    ocultarModalEliminarProducto = () => {
        this.setState( { modalEliminarProductoVisible: false } )
    }

    mostrarModalEliminarProducto = () => {
        this.setState( { modalEliminarProductoVisible: true } )
    }

    eliminarProducto = () => {
        axiosInstance.delete('/productos/' + this.props.match.params['id']).then(
            result => {
                this.props.actualizarCatalogo()
                this.props.history.push('/catalogo')
            }
        ).catch (error => {
            console.log(error)
        })
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    aniadirAlCarrito = (event) => {
        event.preventDefault()
        let carrito = this.props.carrito
        carrito[this.state.id] = this.state.cantidadCompra
        this.props.setCarrito(carrito)
    }

    mostrarModalAniadirOpinion = () => {
        this.setState( { modalAniadirOpinionVisible: true, valoracionNumerica: 0, titulo: "", descripcion: "", mensajeErrorAniadirOpinionVisible: false } )
    }

    ocultarModalAniadirOpinion = () => {
        this.setState( { modalAniadirOpinionVisible: false, mensajeErrorAniadirOpinionVisible: false } )
    }

    setValoracionNumerica = (num) => {
        this.setState( { valoracionNumerica: num } )
    }

    handleGuardarOpinion = (event) => {
        event.preventDefault()

        if (this.state.valoracionNumerica === 0){
            this.setState( { mensajeErrorAniadirOpinionVisible: true, mensajeErrorAniadirOpinion: "Seleccione una valoración numérica." } )
        }
        else{
            let datos = { producto: this.state.id,
                          valoracion_numerica: this.state.valoracionNumerica,
                          titulo: this.state.titulo,
                          descripcion: this.state.descripcion }

            axiosInstance.post('/opiniones/', datos).then(
                result => {
                    this.props.actualizarCatalogo()
                    this.setState( { modalAniadirOpinionVisible: false, mensajeErrorAniadirOpinionVisible: false } )
                }
            ).catch (error => {
                console.log(error)
                this.setState( { mensajeErrorAniadirOpinionVisible: true, mensajeErrorAniadirOpinion: "No se ha podido añadir la opinión." } )
            })
        }
    }

    handleChangeTitulo = (event) => {
        this.setState( { titulo: event.target.value } )
    }

    handleChangeDescripcion = (event) => {
        this.setState( { descripcion: event.target.value } )
    }

    mostrarModalModificarOpinion = () => {
        let opinion = this.getOpinionUsuario()

        this.setState( { modalModificarOpinionVisible: true,
                         valoracionNumerica: opinion['valoracion_numerica'],
                         titulo: opinion['titulo'],
                         descripcion: opinion['descripcion'],
                         mensajeErrorModificarOpinionVisible: false } )
    }

    ocultarModalModificarOpinion = () => {
        this.setState( { modalModificarOpinionVisible: false, mensajeErrorModificarOpinionVisible: false } )
    }

    handleModificarOpinion = (event) => {
        event.preventDefault()

        let opinion = this.getOpinionUsuario();

        if (this.state.valoracionNumerica === 0){
            this.setState( { mensajeErrorModificarOpinionVisible: true, mensajeErrorModificarOpinion: "Seleccione una valoración numérica." } )
        }
        else{
            let datos = { producto: this.state.id,
                          valoracion_numerica: this.state.valoracionNumerica,
                          titulo: this.state.titulo,
                          descripcion: this.state.descripcion }

            axiosInstance.patch('/opiniones/' + opinion['id'], datos).then(
                result => {
                    this.props.actualizarCatalogo()
                    this.setState( { modalModificarOpinionVisible: false, mensajeErrorModificarOpinionVisible: false } )
                }
            ).catch (error => {
                console.log(error)
                this.setState( { mensajeErrorModificarOpinionVisible: true, mensajeErrorModificarOpinion: "No se ha podido modificar la opinión." } )
            })
        }
    }

    getOpinionUsuario = () => {
        let id = this.state.id
        let producto
        let cont = true
        for (let i = 0 ; cont && i < this.props.catalogo.length ; i++){
            if (this.props.catalogo[i]['id'] === id){
                producto = this.props.catalogo[i]
                cont = false
            }
        }
        cont = true
        let opiniones = producto['opiniones']
        let opinion
        for (let i = 0 ; cont && i < opiniones.length ; i++){
            if (parseInt(opiniones[i]['usuario']) === parseInt(this.props.usuarioLogueado['id'])){
                opinion = opiniones[i]
            }
        }
        return opinion
    }

    mostrarModalEliminarOpinion = (id) => {
        this.setState( { modalEliminarOpinionVisible: true, opinionAEliminar: id } )
    }

    ocultarModalEliminarOpinion = () => {
        this.setState( { modalEliminarOpinionVisible: false, mensajeErrorEliminarOpinionVisible: false, opinionAEliminar: null } )
    }

    eliminarOpinion = () => {
        axiosInstance.delete('/opiniones/' + this.state.opinionAEliminar).then(
            result => {
                this.props.actualizarCatalogo()
                this.setState( { modalEliminarOpinionVisible: false, mensajeErrorEliminarOpinionVisible: false } )
            }
        ).catch (error => {
            console.log(error)
            this.setState( { mensajeErrorEliminarOpinionVisible: true, mensajeErrorEliminarOpinion: "No se ha podido eliminar la opinión." } )
        })
    }

    render() {
        if (this.props.catalogo === null){
            return null;
        }

        let id = this.state.id
        let producto
        for (let i = 0 ; i < this.props.catalogo.length ; i++){
            if (this.props.catalogo[i]['id'] === id){
                producto = this.props.catalogo[i]
            }
        }

        let fecha_introduccion = new Date(producto.fecha_introduccion)
        fecha_introduccion = fecha_introduccion.toLocaleString()

        let fecha_modificacion = new Date(producto.fecha_modificacion)
        fecha_modificacion = fecha_modificacion.toLocaleString()


        let botonesAdministrador, areaCompra

        if (this.props.usuarioLogueado['is_staff']){
            botonesAdministrador =  <Row className="mt-4">
                                        <Col className="col-auto">
                                            <Link to={"/catalogo/editar/" + id}>
                                                <Button variant="secondary">Editar datos</Button>
                                            </Link>
                                        </Col>
                                        <Col className="col-auto">
                                            <Button variant="danger" onClick={this.mostrarModalEliminarProducto}>Eliminar producto</Button>
                                        </Col>
                                    </Row>
        }
        else{
            if (!(id in this.props.carrito)){
                if (producto.unidades_disponibles > 0){
                    areaCompra =    <Form>
                                        <Form.Row className="mt-4">
                                            <Form.Label column lg={2}>Cantidad:</Form.Label>

                                            <Col xs={2}>
                                                <Form.Control name="cantidadCompra" value={this.state.cantidadCompra} type="number"
                                                            min={1} max={producto.unidades_disponibles} onChange={this.handleChange} />
                                            </Col>

                                            <Col>
                                                <Button type="submit" onClick={this.aniadirAlCarrito}>Añadir al carrito</Button>
                                            </Col>
                                        </Form.Row>
                                    </Form>
                }
                else{
                    areaCompra = <a style={{ color: "red" }}>Este producto no está disponible.</a>
                }
            }
            else{
                areaCompra =    <Row className="mt-4">
                                    <Col>
                                        Ha añadido {this.props.carrito[id] === 1 ? "una unidad" : this.props.carrito[id] + " unidades" } de este producto al <Link to="/carrito/">carrito</Link>.
                                    </Col>
                                </Row>
            }
            
        }

        let opiniones = producto['opiniones'].map( elemento =>{
            let fecha_creacion = new Date(elemento['fecha_creacion'])
            fecha_creacion = fecha_creacion.toLocaleString()

            let fecha_modificacion = new Date(elemento['fecha_modificacion'])
            fecha_modificacion = fecha_modificacion.toLocaleString()
            
            return(
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Body>
                            { elemento.usuario === this.props.usuarioLogueado.id ?
                             <h5 className="mb-3"><mark>Opinión añadida por Usted</mark></h5>
                             : null}


                            { elemento.valoracion_numerica >= 1 ?
                              <StarIcon/>
                            : <StarOutlineIcon/>
                            }
                            { elemento.valoracion_numerica >= 2 ?
                              <StarIcon/>
                            : <StarOutlineIcon/>
                            }
                            { elemento.valoracion_numerica >= 3 ?
                              <StarIcon/>
                            : <StarOutlineIcon/>
                            }
                            { elemento.valoracion_numerica >= 4 ?
                              <StarIcon/>
                            : <StarOutlineIcon/>
                            }
                            { elemento.valoracion_numerica >= 5 ?
                              <StarIcon/>
                            : <StarOutlineIcon/>
                            }
                        

                            <Card.Title className="mt-4">{ elemento.titulo }</Card.Title>

                            <p className="text-justify">{ elemento.descripcion }</p>

                            <Row className="mt-4 mb-1">
                                <Col>
                                    <small>Fecha de creación: { fecha_creacion }</small>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <small>Fecha de modificación: { fecha_modificacion }</small>
                                </Col>
                            </Row>

                            { this.props.usuarioLogueado['is_staff'] ?
                                <Row>
                                    <Col>
                                        <Button variant="danger" className="mt-4" onClick={() => this.mostrarModalEliminarOpinion(elemento['id'])}>
                                            Eliminar opinión
                                        </Button>
                                    </Col>
                                </Row>
                                : null
                            }


                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        )})
        
        let haPublicadoOpinion = false
        let opinionUsuario = this.getOpinionUsuario();
        let cont = true
        for (let i = 0 ; cont && i < producto['opiniones'].length ; i++){
            if (this.props.usuarioLogueado['id'] === producto['opiniones'][i]['usuario']){
                haPublicadoOpinion = true
                cont = false
            }
        }

        let valoracionMedia = 0
        let suma = 0
        if (producto['opiniones'].length > 0){
            for (let i = 0 ; i < producto['opiniones'].length ; i++){
                suma += parseInt(producto['opiniones'][i]['valoracion_numerica'])
            }
            valoracionMedia = suma / producto['opiniones'].length
        }

        let fragmentoValoracionMedia =  <Row className="mb-5">
                                                <Col>
                                                    <h3 className="mb-3">Valoración media</h3>

                                                    { valoracionMedia >= 1 ?
                                                        <StarIcon/>
                                                    : <StarOutlineIcon/>
                                                    }

                                                    { valoracionMedia >= 2 ?
                                                        <StarIcon/>
                                                    : <StarOutlineIcon/>
                                                    }

                                                    { valoracionMedia >= 3 ?
                                                        <StarIcon/>
                                                    : <StarOutlineIcon/>
                                                    }

                                                    { valoracionMedia >= 4 ?
                                                        <StarIcon/>
                                                    : <StarOutlineIcon/>
                                                    }
                                                    
                                                    { valoracionMedia >= 5 ?
                                                        <StarIcon/>
                                                    : <StarOutlineIcon/>
                                                    }
                                            </Col>
                                        </Row>

        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Img variant="top" src={"http://localhost:8000" + producto.imagen} />
                        </Card>

                        <Card className="mt-3">
                            <Card.Body>
                                { producto.opiniones.length > 0 ?
                                  fragmentoValoracionMedia
                                :
                                null}     

                                <Card.Title><h3 className="mb-4">Opiniones</h3></Card.Title>

                                { this.props.usuarioLogueado['is_staff'] || haPublicadoOpinion
                                  ? 
                                    null
                                :
                                <Row className="mt-4">
                                        <Col>
                                            <Button variant="secondary" onClick={this.mostrarModalAniadirOpinion}>Añadir opinión</Button>
                                        </Col>
                                </Row>
                                }

                                { haPublicadoOpinion ?
                                    <>
                                        <Button variant="secondary" onClick={this.mostrarModalModificarOpinion}>Modificar mi opinión</Button>
                                        <Button variant="danger" className="ml-3" onClick={() => this.mostrarModalEliminarOpinion(opinionUsuario['id'])}>
                                            Eliminar mi opinión
                                        </Button>
                                    </>
                                    :
                                    null
                                }

                                { producto.opiniones.length > 0 ?
                                  opiniones
                                :
                                <h5 className="mt-5">Todavía no hay opiniones sobre este producto</h5>}           
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card className="text-left">
                            <Card.Body>
                                <Card.Title><h2 className="mb-4">{ producto.nombre }</h2></Card.Title>
                                <Card.Text>
                                    <Row>
                                        <Col>
                                            <p className="text-justify">{ producto.descripcion }</p>
                                        </Col>
                                    </Row>

                                    { areaCompra }

                                    <Row className="mt-4">
                                        <Col>
                                            <h4>{ producto.precio } €/unidad</h4>
                                        </Col>
                                    </Row>
                                                    
                                    <Row className="mt-2">
                                        <Col>
                                            <small>Unidades disponibles: { producto.unidades_disponibles }</small>
                                        </Col>
                                    </Row>

                                    <Row className="mt-2">
                                        <Col>
                                            <small>Fecha de introducción: { fecha_introduccion }</small>
                                        </Col>
                                    </Row>

                                    <Row className="mt-2">
                                        <Col>
                                            <small>Fecha de modificación: { fecha_modificacion }</small>
                                        </Col>
                                    </Row>

                                    { botonesAdministrador }

                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Modal show={this.state.modalEliminarProductoVisible} onHide={this.ocultarModalEliminarProducto}>
                    <Modal.Header closeButton>
                        <Modal.Title>Eliminar el producto</Modal.Title>
                    </Modal.Header>
                                    
                    <Modal.Body>
                        <p>¿Está seguro de que quiere eliminar el producto?</p>
                    </Modal.Body>
                                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.ocultarModalEliminarProducto}>No</Button>
                        <Button variant="danger" onClick={this.eliminarProducto}>Sí</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.modalAniadirOpinionVisible} onHide={this.ocultarModalAniadirOpinion}>
                    <Modal.Header closeButton>
                        <Modal.Title>Añadir una opinión</Modal.Title>
                    </Modal.Header>
                                    
                    <Modal.Body>
                    <Form id="formAniadirOpinion" onSubmit={this.handleGuardarOpinion}>

                        <Form.Group controlId="formNombre">
                            <Row>
                                <Col>
                                    <Form.Label>Valoración numérica</Form.Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <ToggleButtonGroup type="checkbox" >

                                        <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(1)}>
                                            { this.state.valoracionNumerica >= 1 ?
                                            <StarIcon />
                                            :
                                            <StarOutlineIcon /> }
                                        </ToggleButton>

                                        <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(2)}>
                                        { this.state.valoracionNumerica >= 2 ?
                                            <StarIcon />
                                            :
                                            <StarOutlineIcon /> }                                
                                        </ToggleButton>

                                        <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(3)}>
                                        { this.state.valoracionNumerica >= 3 ?
                                            <StarIcon />
                                            :
                                            <StarOutlineIcon /> }                                
                                        </ToggleButton>

                                        <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(4)}>
                                        { this.state.valoracionNumerica >= 4 ?
                                            <StarIcon />
                                            :
                                            <StarOutlineIcon /> }                                
                                        </ToggleButton>

                                        <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(5)}>
                                        { this.state.valoracionNumerica === 5 ?
                                            <StarIcon />
                                            :
                                            <StarOutlineIcon /> }                                
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId="formNombre">
                            <Form.Label>Título</Form.Label>
                            <Form.Control placeholder="Introduzca el título de la opinión" value={this.state.titulo} 
                                        name="nombre" onChange={this.handleChangeTitulo} required />
                        </Form.Group>

                        <Form.Group controlId="formDescripcion">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control placeholder="Introduzca la descripción" value={this.state.descripcion} 
                                        name="descripcion" onChange={this.handleChangeDescripcion} as="textarea" rows="5" required />
                        </Form.Group>
                        </Form>

                        { this.state.mensajeErrorAniadirOpinionVisible ? 
                            <Alert variant="danger">
                                <Alert.Heading>Error al añadir la opinión.</Alert.Heading>
                                <p>
                                    { this.state.mensajeErrorAniadirOpinión }
                                </p>
                            </Alert>
                            : null
                        }

                    </Modal.Body>
                                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.ocultarModalAniadirOpinion}>Cerrar</Button>
                        <Button variant="primary" form="formAniadirOpinion" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Modal>
                
                <Modal show={this.state.modalModificarOpinionVisible} onHide={this.ocultarModalModificarOpinion}>
                <Modal.Header closeButton>
                    <Modal.Title>Modificar la opinión</Modal.Title>
                </Modal.Header>
                                
                <Modal.Body>
                <Form id="formModificarOpinion" onSubmit={this.handleModificarOpinion}>

                    <Form.Group controlId="formNombre">
                        <Row>
                            <Col>
                                <Form.Label>Valoración numérica</Form.Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ToggleButtonGroup type="checkbox" >

                                    <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(1)}>
                                        { this.state.valoracionNumerica >= 1 ?
                                        <StarIcon />
                                        :
                                        <StarOutlineIcon /> }
                                    </ToggleButton>

                                    <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(2)}>
                                    { this.state.valoracionNumerica >= 2 ?
                                        <StarIcon />
                                        :
                                        <StarOutlineIcon /> }                                
                                    </ToggleButton>

                                    <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(3)}>
                                    { this.state.valoracionNumerica >= 3 ?
                                        <StarIcon />
                                        :
                                        <StarOutlineIcon /> }                                
                                    </ToggleButton>

                                    <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(4)}>
                                    { this.state.valoracionNumerica >= 4 ?
                                        <StarIcon />
                                        :
                                        <StarOutlineIcon /> }                                
                                    </ToggleButton>

                                    <ToggleButton variant="secondary" onClick={() => this.setValoracionNumerica(5)}>
                                    { this.state.valoracionNumerica === 5 ?
                                        <StarIcon />
                                        :
                                        <StarOutlineIcon /> }                                
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Col>
                        </Row>
                    </Form.Group>

                    <Form.Group controlId="formNombre">
                        <Form.Label>Título</Form.Label>
                        <Form.Control placeholder="Introduzca el título de la opinión" value={this.state.titulo} 
                                    name="nombre" onChange={this.handleChangeTitulo} required />
                    </Form.Group>

                    <Form.Group controlId="formDescripcion">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control placeholder="Introduzca la descripción" value={this.state.descripcion} 
                                    name="descripcion" onChange={this.handleChangeDescripcion} as="textarea" rows="5" required />
                    </Form.Group>
                    </Form>

                    { this.state.mensajeErrorModificarOpinionVisible ? 
                        <Alert variant="danger">
                            <Alert.Heading>Error al modificar la opinión.</Alert.Heading>
                            <p>
                                { this.state.mensajeErrorModificarOpinion }
                            </p>
                        </Alert>
                        : null
                    }

                </Modal.Body>
                                
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.ocultarModalModificarOpinion}>Cerrar</Button>
                    <Button variant="primary" form="formModificarOpinion" type="submit">Guardar</Button>
                </Modal.Footer>
            </Modal>    

            <Modal show={this.state.modalEliminarOpinionVisible} onHide={this.ocultarModalEliminarOpinion}>
                    <Modal.Header closeButton>
                        <Modal.Title>Eliminar la opinión</Modal.Title>
                    </Modal.Header>
                                    
                    <Modal.Body>
                        <p>¿Está seguro de que quiere eliminar la opinión?</p>

                        { this.state.mensajeErrorEliminarOpinionVisible ? 
                        <Alert variant="danger">
                            <Alert.Heading>Error al eliminar la opinión.</Alert.Heading>
                            <p>
                                { this.state.mensajeErrorEliminarOpinion }
                            </p>
                        </Alert>
                        : null
                    }
                    </Modal.Body>
                                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.ocultarModalEliminarOpinion}>No</Button>
                        <Button variant="danger" onClick={this.eliminarOpinion}>Sí</Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default withRouter(ProductoInfo);