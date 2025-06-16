from django.urls import path
from . import views

urlpatterns = [
    path('', views.inicio, name='inicio'), #Nombre de mi vista
]