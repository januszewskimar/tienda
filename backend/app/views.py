from django.shortcuts import render
from django.http import HttpResponse
from .models import Usuario
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import SerializadorUsuario


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