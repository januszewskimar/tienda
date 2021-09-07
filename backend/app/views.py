from django.shortcuts import render
from django.http import HttpResponse
from .models import OpinionProducto, ProductoPedido, Usuario, Producto, Tienda, Direccion, PedidoEntregaTienda, PedidoEntregaPostal, Pedido
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime
import json
import random
import string


from .serializers import SerializadorOpinionProducto, SerializadorPedido, SerializadorProductoPedido, SerializadorPedidoEntregaTienda, SerializadorPedidoEntregaPostal, SerializadorProducto, SerializadorUsuario, SerializadorTienda


class Usuarios(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        if not request.user.is_staff:
            if 'is_staff' in request.data:
                if request.data['is_staff']:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)

        if 'email' in request.data:
            if Usuario.objects.filter(email=request.data['email']).count() == 1:
                return Response(status=status.HTTP_409_CONFLICT)

        serializador = SerializadorUsuario(data=request.data)

        if serializador.is_valid():
            serializador.save()
            return Response(serializador.data, status=status.HTTP_201_CREATED)
        return Response(serializador.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        if not request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        usuarios = Usuario.objects.all()
        serializador = SerializadorUsuario(usuarios, many=True)
        return Response(serializador.data)


class UsuariosId(APIView):
    permission_classes = (permissions.AllowAny,)
        
    def patch(self, request, id):
        if request.user.id != int(id) and not request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            usuario = Usuario.objects.get(id=id)
        except Usuario.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if "email" in request.data:
            if usuario.email != request.data['email']:
                if Usuario.objects.filter(email=request.data['email']).count() == 1:
                    return Response(status=status.HTTP_409_CONFLICT)
        
        if "is_staff" in request.data:
            if request.data['is_staff'] != request.user.is_staff:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializador = SerializadorUsuario(usuario, data=request.data, partial=True)

        if serializador.is_valid():
            serializador.save()
            return Response(serializador.data, status=status.HTTP_200_OK)
        return Response(serializador.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, id):
        if request.user.id != int(id) and not request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            usuario = Usuario.objects.get(pk=id)
        except Usuario.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        usuario.delete()
        return Response(status=status.HTTP_200_OK)


class UsuarioSesionIniciada(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = SerializadorUsuario(request.user)
        return Response(serializer.data)

class InvalidarToken(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            token_refresco = request.data['refresh_token']
            token = RefreshToken(token_refresco)
            token.blacklist()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class Productos(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        if not request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializador = SerializadorProducto(data=request.data)
        if serializador.is_valid():
            serializador.save()
            return Response(serializador.data, status=status.HTTP_201_CREATED)
        return Response(serializador.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        productos = Producto.objects.all()
        serializador = SerializadorProducto(productos, many=True)
        return Response(serializador.data)

class ProductosId(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def patch(self, request, id):
        if not request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            producto = Producto.objects.get(pk=id)
        except Producto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializador = SerializadorProducto(producto, data=request.data, partial=True)

        if serializador.is_valid():
            serializador.save()
            return Response(serializador.data, status=status.HTTP_200_OK)
        return Response(serializador.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, id):
        if not request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            producto = Producto.objects.get(pk=id)
        except Producto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        producto.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class Tiendas(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        if not request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        datos = dict(request.data)
        datos['nombre'] = datos['nombre'][0]
        datos['imagen'] = datos['imagen'][0]
        datos['direccion'] = json.loads(datos['direccion'][0])
        datos['descripcion'] = datos['descripcion'][0]

        serializador = SerializadorTienda(data=datos)

        if serializador.is_valid():
            serializador.save()
            return Response(serializador.data, status=status.HTTP_201_CREATED)
        return Response(serializador.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        tiendas = Tienda.objects.all()
        serializador = SerializadorTienda(tiendas, many=True)
        return Response(serializador.data)


class TiendasId(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def patch(self, request, id):
        if not request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        datos = dict(request.data)
        if 'nombre' in datos:
            datos['nombre'] = datos['nombre'][0]
        if 'imagen' in datos:
            datos['imagen'] = datos['imagen'][0]
        if 'direccion' in datos:
            datos['direccion'] = json.loads(datos['direccion'][0])
        if 'descripcion' in datos:
            datos['descripcion'] = datos['descripcion'][0]

        try:
            tienda = Tienda.objects.get(pk=id)
        except Tienda.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializador = SerializadorTienda(tienda, data=datos, partial=True)

        if serializador.is_valid():
            serializador.save()
            return Response(serializador.data, status=status.HTTP_200_OK)
        return Response(serializador.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        if not request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            tienda = Tienda.objects.get(pk=id)
        except Tienda.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        direccion_id = tienda.direccion.id

        tienda.delete()

        try:
            direccion = Direccion.objects.get(pk=direccion_id)
        except Direccion.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        direccion.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


class Pedidos(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        if request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        request.data['estado'] = 'Confirmado'
        request.data['usuario'] = request.user.id

        if 'tienda' in request.data:
            request.data['codigo_recogida'] = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            serializador_pedido = SerializadorPedidoEntregaTienda(data=request.data)
        else:
            serializador_pedido = SerializadorPedidoEntregaPostal(data=request.data)

        if not serializador_pedido.is_valid():
            return Response(serializador_pedido.errors, status=status.HTTP_400_BAD_REQUEST)

        pedido = serializador_pedido.save()
            
        for e in request.data['productos']:
            e['pedido'] = pedido.id
            p = Producto.objects.get(pk=e['producto'])
            e['precio'] = p.precio
            serializador_producto = SerializadorProductoPedido(data=e)
            if not serializador_producto.is_valid():
                return Response(serializador_producto.errors, status=status.HTTP_400_BAD_REQUEST)
            if p.unidades_disponibles >= int(e['cantidad']):
                p.unidades_disponibles = p.unidades_disponibles - int(e['cantidad'])
                p.save()
            else:
                return Response(status=status.HTTP_409_CONFLICT)
            serializador_producto.save()

        return Response(serializador_pedido.data, status=status.HTTP_201_CREATED)

    def get(self, request):
        if not request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        pedidos_postales = list(PedidoEntregaPostal.objects.all().values())
        pedidos_tienda = list(PedidoEntregaTienda.objects.all().values())

        for e in pedidos_postales:
            e['productos'] = ProductoPedido.objects.filter(pedido=e['id'])
            try:
                e['direccion'] = Direccion.objects.get(pk=e['direccion_id'])
            except Direccion.DoesNotExist:
                e['direccion'] = None
            try:
                e['usuario'] = Usuario.objects.get(pk=e['usuario_id'])
            except Usuario.DoesNotExist:
                e['usuario'] = None
                
        for e in pedidos_tienda:
            e['productos'] = ProductoPedido.objects.filter(pedido=e['id'])
            try:
                e['tienda'] = Tienda.objects.get(pk=e['tienda_id'])
            except Tienda.DoesNotExist:
                e['tienda'] = None
            try:
                e['usuario'] = Usuario.objects.get(pk=e['usuario_id'])
            except Usuario.DoesNotExist:
                e['usuario'] = None

        serializador_pedidos_postales = SerializadorPedidoEntregaPostal(pedidos_postales, many=True)
        serializador_pedidos_tienda = SerializadorPedidoEntregaTienda(pedidos_tienda, many=True)

        pedidos = serializador_pedidos_postales.data + serializador_pedidos_tienda.data

        pedidos = sorted(pedidos, key=lambda pedido: pedido['fecha'], reverse=True)

        return Response(data=pedidos, status=status.HTTP_201_CREATED)


class PedidosUsuarios(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, id):
        if request.user.id != int(id):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        pedidos_postales = list(PedidoEntregaPostal.objects.filter(usuario=request.user.id).values())
        pedidos_tienda = list(PedidoEntregaTienda.objects.filter(usuario=request.user.id).values())

        for e in pedidos_postales:
            e['productos'] = ProductoPedido.objects.filter(pedido=e['id'])
            try:
                e['direccion'] = Direccion.objects.get(pk=e['direccion_id'])
            except Direccion.DoesNotExist:
                e['direccion'] = None
            e['usuario'] = Usuario.objects.get(pk=e['usuario_id'])

        for e in pedidos_tienda:
            e['productos'] = ProductoPedido.objects.filter(pedido=e['id'])
            try:
                e['tienda'] = Tienda.objects.get(pk=e['tienda_id'])
            except Tienda.DoesNotExist:
                e['tienda'] = None
            e['usuario'] = Usuario.objects.get(pk=e['usuario_id'])

        serializador_pedidos_postales = SerializadorPedidoEntregaPostal(pedidos_postales, many=True)
        serializador_pedidos_tienda = SerializadorPedidoEntregaTienda(pedidos_tienda, many=True)

        pedidos = serializador_pedidos_postales.data + serializador_pedidos_tienda.data

        pedidos = sorted(pedidos, key=lambda pedido: pedido['fecha'], reverse=True)

        return Response(data=pedidos, status=status.HTTP_201_CREATED)

class PedidosId(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def patch(self, request, id):
        if not request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            pedido = Pedido.objects.get(pk=id)
        except Pedido.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializador = SerializadorPedido(pedido, data=request.data, partial=True)

        if serializador.is_valid():
            serializador.save()
            return Response(serializador.data, status=status.HTTP_200_OK)
        return Response(serializador.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, id):
        if not request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            pedido = Pedido.objects.get(pk=id)
        except Pedido.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        pedido.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class OpinionesProducto(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        if request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        if OpinionProducto.objects.filter(usuario=request.user.id, producto=request.data['producto']).count() >= 1:
                return Response(status=status.HTTP_409_CONFLICT)

        request.data['usuario'] = request.user.id

        serializador = SerializadorOpinionProducto(data=request.data)
        if serializador.is_valid():
            serializador.save()
            return Response(serializador.data, status=status.HTTP_201_CREATED)
        return Response(serializador.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        opiniones = OpinionProducto.objects.all()
        serializador = SerializadorOpinionProducto(opiniones, many=True)
        return Response(serializador.data)


class OpinionesProductoId(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def patch(self, request, id):
        try:
            opinion = OpinionProducto.objects.get(pk=id)
        except OpinionProducto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.user.id != opinion.usuario.id:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializador = SerializadorOpinionProducto(opinion, data=request.data, partial=True)

        if serializador.is_valid():
            serializador.save()
            return Response(serializador.data, status=status.HTTP_200_OK)
        return Response(serializador.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            opinion = OpinionProducto.objects.get(pk=id)
        except OpinionProducto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if not request.user.is_staff and opinion.usuario.id != request.user.id:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        opinion.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)