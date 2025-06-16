# listnutricionista/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('nutricionistas/', views.nutricionistas_suscritos, name='nutricionistas_suscritos'),
]