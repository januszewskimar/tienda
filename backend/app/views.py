from django.shortcuts import render
from django.http import HttpResponse
from .models import Usuario
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import SerializadorUsuario


class Usuarios(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format='json'):
        print(request.data)
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
