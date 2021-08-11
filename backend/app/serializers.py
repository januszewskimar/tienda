from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Direccion, Tienda, Usuario, Producto

class SerializadorUsuario(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    email = serializers.EmailField(max_length=100, required=True)
    password = serializers.CharField(min_length=8, write_only=True, required=True)
    first_name = serializers.CharField(max_length=40)
    last_name = serializers.CharField(max_length=40)
    is_staff = serializers.BooleanField(default=False)

    class Meta:
        model = Usuario
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'is_staff')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class SerializadorProducto(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'precio', 'unidades_disponibles', 'imagen', 'fecha_introduccion', 'fecha_modificacion']


class SerializadorDireccion(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = ['id', 'destinatario', 'direccion', 'localidad', 'provincia', 'codigo_postal', 'pais']


class SerializadorTienda(serializers.ModelSerializer):
    direccion = SerializadorDireccion(many=False)

    class Meta:
        model = Tienda
        fields = ['id', 'nombre', 'descripcion', 'imagen', 'direccion']

    def create(self, validated_data):
        direccion = validated_data.pop('direccion')
        dir = Direccion.objects.create(**direccion)
        tienda = Tienda.objects.create(direccion=dir, **validated_data)
        return tienda