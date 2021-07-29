from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from . import views


urlpatterns = [
    path('usuarios/', views.Usuarios.as_view(), name='usuarios'),
    path('usuario-sesion-iniciada/', views.UsuarioSesionIniciada.as_view(), name='usuario_sesion_iniciada'),
    path('token/obtener/', jwt_views.TokenObtainPairView.as_view(), name='crear_token'),
    path('token/refrescar/', jwt_views.TokenRefreshView.as_view(), name='refrescar_token'),
]
