from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Cliente(models.Model):
    nombre_completo = models.CharField(max_length=255)
    fecha_nacimiento = models.DateField()
    edad = models.PositiveIntegerField()
    genero = models.CharField(max_length=50)
    estado_civil = models.CharField(max_length=50)
    ocupacion = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    correo = models.EmailField()
    direccion = models.TextField()
    numero_identificacion = models.CharField(max_length=100, blank=True, null=True)
    nombre_responsable = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.nombre_completo

class Expediente(models.Model):
    cliente = models.OneToOneField(Cliente, on_delete=models.CASCADE, related_name='expediente')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    notas = models.TextField(blank=True, null=True)

    # ANTECEDENTES MÉDICOS
    antecedentes_personales = models.TextField(blank=True, null=True, help_text="Enfermedades crónicas, alergias, cirugías, tratamientos, embarazo/lactancia, etc.")
    antecedentes_familiares = models.TextField(blank=True, null=True, help_text="Enfermedades hereditarias o comunes en la familia.")

    # ANTECEDENTES NUTRICIONALES
    antecedentes_nutricionales = models.TextField(blank=True, null=True, help_text="Patrón alimentario, hábitos, actividad física, restricciones, síntomas digestivos.")

    # EVALUACIÓN ANTROPOMÉTRICA Y BIOQUÍMICA
    evaluacion_antropometrica = models.TextField(blank=True, null=True, help_text="Peso, talla, IMC, perímetros, pliegues, composición corporal, evolución.")
    evaluacion_bioquimica = models.TextField(blank=True, null=True, help_text="Glucemia, perfil lipídico, hemograma, función hepática, otros análisis.")

    # ESTADO NUTRICIONAL GLOBAL
    estado_nutricional_global = models.TextField(blank=True, null=True, help_text="ESG, escalas de riesgo, síntomas, apoyo social, motivación, factores psicológicos.")

    # PLAN DE ALIMENTACIÓN PERSONALIZADO
    plan_alimentacion = models.TextField(blank=True, null=True, help_text="Objetivos, calorías, macronutrientes, plan de comidas, recomendaciones, guías, estrategias.")

    # SEGUIMIENTO Y EVOLUCIÓN
    seguimiento = models.TextField(blank=True, null=True, help_text="Notas de progreso, cambios, resultados, cumplimiento, ajustes, próxima cita.")

    def __str__(self):
        return f"Expediente de {self.cliente.nombre_completo}"
