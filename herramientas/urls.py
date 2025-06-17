from django.urls import path
from . import views

urlpatterns = [
    path('', views.inicio, name="inicio"),
    path('expediente/', views.expediente, name="expediente")
]