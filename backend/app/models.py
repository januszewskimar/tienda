from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class GestorUsuarios(BaseUserManager):
    use_in_migrations = True
    
    def authenticate(self, request, **extra_fields):
        email = extra_fields['email']
        password = extra_fields['password']
        
        try:
            usuario = Usuario.objects.get(email=email)
            if usuario.check_password(password) is True:
                return usuario
        except Usuario.DoesNotExist:
            pass

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Es necesario establecer el correo')
        if not password:
            raise ValueError('Es necesario establecer la contraseña')
        if not 'first_name' in extra_fields:
            raise ValueError('Es necesario establecer el nombre')
        if not 'last_name' in extra_fields:
            raise ValueError('Es necesario establecer los apellidos')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        
        return user

    def create_user(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self._create_user(email, password, **extra_fields)
        
        
class Usuario(AbstractUser):
    email = models.EmailField('Email address', unique=True)
    username = None

    USERNAME_FIELD = 'email'
    
    REQUIRED_FIELDS = ['password', 'first_name', 'last_name']
    
    objects = GestorUsuarios()
        

class Producto(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=8, decimal_places=2)
    unidades_disponibles = models.PositiveIntegerField()
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
