from django.shortcuts import render
from django.http import HttpResponse
from .models import Usuario, Producto
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime

from .serializers import SerializadorProducto, SerializadorUsuario


class Usuarios(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format='json'):
        serializador = SerializadorUsuario(data=request.data)
        if serializador.is_valid():
            if Usuario.objects.filter(email=serializador.validated_data['email']).count() == 1:
                return Response(status=status.HTTP_409_CONFLICT)
            else:
                usuario = serializador.save()
                if usuario:
                    json = serializador.data
                    return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializador.errors, status=status.HTTP_400_BAD_REQUEST)



class UsuariosId(APIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, id, format='json'):
        if request.user.id != int(id):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            usuario = Usuario.objects.get(id=id)
            if "email" in request.data:
                if usuario.email != request.data['email']:
                    if Usuario.objects.filter(email=request.data['email']).count() == 1:
                        return Response(status=status.HTTP_409_CONFLICT)
                usuario.email = request.data['email']
            if "first_name" in request.data:
                usuario.first_name = request.data['first_name']
            if "last_name" in request.data:
                usuario.last_name = request.data['last_name']
            if "password" in request.data:
                usuario.set_password(request.data['password'])

            try:
                usuario.save()
                return Response(status=status.HTTP_200_OK)
            except Exception as e:
                return Response(status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, id, format='json'):
        if request.user.id != int(id):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            usuario = Usuario.objects.get(id=id)
            usuario.delete()
            return Response(status=status.HTTP_200_OK)


class UsuarioSesionIniciada(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format='json'):
        serializer = SerializadorUsuario(request.user)
        return Response(serializer.data)

class InvalidarToken(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format='json'):
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

    def get(self, request, format='json'):
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
        