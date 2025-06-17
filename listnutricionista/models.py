from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class Usuario(AbstractUser):

    es_nutricionista = models.BooleanField(default=False)
    certificacion_venta_productos = models.BooleanField(default=False)
    esta_suscrito = models.BooleanField(default=False)

