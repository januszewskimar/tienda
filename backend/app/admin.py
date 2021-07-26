from django.contrib import admin
from .models import Usuario

class UsuarioAdmin(admin.ModelAdmin):
    model = Usuario

admin.site.register(Usuario, UsuarioAdmin)

