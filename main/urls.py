from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.inicio_main, name='inicio_main'), #La pagina inicial
    path('registroSesion/', views.registroSesion, name='registroSesion'), #La pagina de registro de sesion
    path('inicioSesion/', views.inicioSesion, name='inicioSesion'), #La pagina de inicio de sesion
]