from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Direccion, PedidoEntregaTienda, Tienda, Usuario, Producto, Pedido, PedidoEntregaPostal, PedidoEntregaTienda, ProductoPedido, OpinionProducto

class SerializadorUsuario(serializers.ModelSerializer):

    class Meta:
        model = Usuario
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'is_staff']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password', None)
            instance.set_password(password)
        return super().update(instance, validated_data)


class SerializadorProducto(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'precio', 'unidades_disponibles', 'imagen', 'fecha_introduccion', 'fecha_modificacion']


class SerializadorDireccion(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = ['id', 'destinatario', 'direccion', 'localidad', 'provincia', 'codigo_postal', 'pais']

    def to_internal_value(self, data):
        obj = super(SerializadorDireccion, self).to_internal_value(data)
        
        if 'id' in data:
            obj['id'] = data['id']
        return obj


class SerializadorTienda(serializers.ModelSerializer):
    direccion = SerializadorDireccion(many=False)
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Tienda
        fields = ['id', 'nombre', 'descripcion', 'imagen', 'direccion']

    def create(self, validated_data):
        direccion = validated_data.pop('direccion')
        dir = Direccion.objects.create(**direccion)
        tienda = Tienda.objects.create(direccion=dir, **validated_data)
        return tienda

    def update(self, instance, validated_data):
        direccion = validated_data.pop('direccion')
        Direccion.objects.filter(pk=direccion['id']).update(**direccion)
        return super().update(instance, validated_data)



class SerializadorProductoPedido(serializers.ModelSerializer):

    class Meta:
        model = ProductoPedido
        fields = ['id', 'pedido', 'producto', 'cantidad', 'precio']
        extra_kwargs = {'pedido': {'write_only': True}}


class SerializadorPedido(serializers.ModelSerializer):
    productos = SerializadorProductoPedido(many=True, read_only=True)
    
    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'fecha', 'estado', 'nota', 'productos']
        read_only_fields = ['fecha']



class SerializadorPedidoEntregaTienda(SerializadorPedido):
    tienda = serializers.PrimaryKeyRelatedField(queryset=Tienda.objects.all())

    class Meta(SerializadorPedido.Meta):
        model = PedidoEntregaTienda
        fields = SerializadorPedido.Meta.fields + ['tienda', 'codigo_recogida']


class SerializadorPedidoEntregaPostal(SerializadorPedido):
    direccion = SerializadorDireccion(many=False)

    class Meta(SerializadorPedido.Meta):
        model = PedidoEntregaTienda
        fields = SerializadorPedido.Meta.fields + ['direccion']

    def create(self, validated_data):
        direccion = validated_data.pop('direccion')
        dir = Direccion.objects.create(**direccion)
        pedido = PedidoEntregaPostal.objects.create(direccion=dir, **validated_data)
        return pedido


class SerializadorOpinionProducto(serializers.ModelSerializer):

    class Meta:
        model = OpinionProducto
        fields = ['id', 'producto', 'usuario', 'valoracion_numerica', 'titulo', 'descripcion', 'fecha_creacion', 'fecha_modificacion']