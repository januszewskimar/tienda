from django.contrib.auth.models import BaseUserManager

class GestorUsuarios(BaseUserManager):
    use_in_migrations = True

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
