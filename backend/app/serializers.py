from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from datetime import datetime
from .models import Usuario, Producto

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
#    id = serializers.ReadOnlyField()
#    nombre = serializers.CharField(max_length=50, required=True)
#    descripcion = serializers.CharField(required=True)
#    precio = serializers.DecimalField(max_digits=8, decimal_places=2, required=True)
#    unidades_disponibles = serializers.IntegerField(required=True)
#    imagen = serializers.ImageField(required=True)
#    fecha_introduccion = serializers.DateTimeField(default=datetime.now())
#    fecha_modificacion = serializers.DateTimeField(default=None)

#    def create(self, validated_data):
#        return Producto.objects.create(**validated_data)
