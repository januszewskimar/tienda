from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from .managers import GestorUsuarios




class Usuario(AbstractUser):
    email = models.EmailField('Email address', unique=True)
    username = None

    USERNAME_FIELD = 'email'
    
    REQUIRED_FIELDS = ['password', 'first_name', 'last_name']


    def __str__(self):
        return self.email
        

