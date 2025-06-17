from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Mensaje, Participante

@receiver(post_save, sender=Mensaje)
def actualizar_no_leidos(sender, instance, created, **kwargs):
    """
    Incrementa el contador de mensajes no leídos para los participantes
    que no son el remitente cuando se crea un nuevo mensaje.
    """
    if created:
        participantes = Participante.objects.filter(
            conversacion=instance.conversacion
        ).exclude(usuario=instance.remitente)
        
        for participante in participantes:
            participante.no_leidos += 1
            participante.save()