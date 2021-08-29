from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class Usuario(AbstractUser):
    email = models.EmailField('Email address', unique=True)
    username = None

    USERNAME_FIELD = 'email'
    
    REQUIRED_FIELDS = ['password', 'first_name', 'last_name']


    def __str__(self):
        return self.email
        

class Producto(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=8, decimal_places=2)
    unidades_disponibles = models.IntegerField()
    imagen = models.ImageField(upload_to="productos/")
    fecha_introduccion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)


class Direccion(models.Model):
    destinatario = models.CharField(max_length=50)
    direccion = models.CharField(max_length=50)
    localidad = models.CharField(max_length=40)
    provincia = models.CharField(max_length=30, null=True)
    codigo_postal = models.CharField(max_length=10)
    pais = models.CharField(max_length=40)


class Tienda(models.Model):
    nombre = models.CharField(max_length=40)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to="tiendas/")
    direccion = models.OneToOneField(
        Direccion,
        on_delete=models.CASCADE
    )


class Pedido(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=30)
    nota = models.CharField(max_length=50, null=True)

class PedidoEntregaTienda(Pedido):
    tienda = models.ForeignKey(Tienda, on_delete=models.SET_NULL, null=True)
    codigo_recogida = models.CharField(max_length=6)

class PedidoEntregaPostal(Pedido):
    direccion = models.ForeignKey(Direccion, on_delete=models.SET_NULL, null=True)

class ProductoPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True)
    precio = models.DecimalField(max_digits=8, decimal_places=2)
    cantidad = models.PositiveSmallIntegerField()


class OpinionProducto(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)
    valoracion_numerica = models.DecimalField(max_digits=1, decimal_places=0)
    titulo = models.CharField(max_length=50)
    descripcion = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)