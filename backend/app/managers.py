from django.contrib.auth.models import BaseUserManager
from .models import Usuario

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
        if not extrafields.first_name:
            raise ValueError('Es necesario establecer el nombre')
        if not extrafields.last_name:
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
