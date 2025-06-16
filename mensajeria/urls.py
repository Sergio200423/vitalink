from django.urls import path
from . import views

app_name = 'mensajeria'

urlpatterns = [
    path('', views.lista_conversaciones, name='lista_conversaciones'),
    path('conversacion/<int:conversacion_id>/', views.detalle_conversacion, name='detalle_conversacion'),
    path('nueva/', views.nueva_conversacion, name='nueva_conversacion'),
    path('nueva/<int:usuario_id>/', views.nueva_conversacion, name='nueva_conversacion_con_usuario'),
    path('enviar/<int:conversacion_id>/', views.enviar_mensaje_ajax, name='enviar_mensaje_ajax'),
    path('actualizar/<int:conversacion_id>/<int:ultimo_mensaje_id>/', 
         views.actualizar_mensajes, name='actualizar_mensajes'),
    path('contador-no-leidos/', views.contador_no_leidos, name='contador_no_leidos'),
    path('buscar-usuarios/', views.buscar_usuarios, name='buscar_usuarios'),
]
