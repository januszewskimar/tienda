from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from . import views


urlpatterns = [
    path('usuarios/', views.Usuarios.as_view(), name='usuarios'),
    path('usuarios/<id>', views.UsuariosId.as_view(), name='usuarios_id'),
    path('usuario-sesion-iniciada/', views.UsuarioSesionIniciada.as_view(), name='usuario_sesion_iniciada'),
    path('token/obtener/', jwt_views.TokenObtainPairView.as_view(), name='crear_token'),
    path('token/refrescar/', jwt_views.TokenRefreshView.as_view(), name='refrescar_token'),
    path('token/invalidar/', views.InvalidarToken.as_view(), name='invalidar_token'),

    path('productos/', views.Productos.as_view(), name='productos'),
    path('productos/<id>', views.ProductosId.as_view(), name='productos_id'),

    path('tiendas/', views.Tiendas.as_view(), name='tiendas'),
    path('tiendas/<id>', views.TiendasId.as_view(), name='tiendas_id')

]
