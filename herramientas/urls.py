from django.urls import path
from . import views

urlpatterns = [
    path('', views.inicio_herramientas, name="inicio_herramientas"),
    path('expediente/', views.expediente, name="expediente")
]