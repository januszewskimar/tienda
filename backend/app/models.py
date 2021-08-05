from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from datetime import datetime


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
    fecha_introduccion = models.DateTimeField(default=datetime.now)
    fecha_modificacion = models.DateTimeField(default=None, null=True)
