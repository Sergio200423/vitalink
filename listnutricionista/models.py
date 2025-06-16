from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class Usuario(AbstractUser):
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=150)
    correo_electronico = models.EmailField(unique=True)
    es_nutricionista = models.BooleanField(default=False)
    certificacion_venta_productos = models.BooleanField(default=False)
    esta_suscrito = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nombre} {self.apellidos}"