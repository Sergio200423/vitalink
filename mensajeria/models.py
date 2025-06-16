from django.db import models
from django.conf import settings
from django.utils import timezone

class TipoUsuario(models.TextChoices):
    CLIENTE = 'cliente', 'Cliente'
    NUTRICIONISTA = 'nutricionista', 'Nutricionista'
    PROVEEDOR = 'proveedor', 'Proveedor'
    ADMINISTRADOR = 'admin', 'Administrador'

class PerfilMensajeria(models.Model):
    """Perfil extendido para mensajería"""
    usuario = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='perfil_mensajeria')
    tipo_usuario = models.CharField(max_length=20, choices=TipoUsuario.choices, default=TipoUsuario.CLIENTE)
    avatar = models.ImageField(upload_to='mensajeria/avatares/', blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.usuario.username} - {self.get_tipo_usuario_display()}"

class Conversacion(models.Model):
    """Modelo para representar una conversación entre dos usuarios"""
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)
    activa = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-actualizado']
        verbose_name = 'Conversación'
        verbose_name_plural = 'Conversaciones'
    
    def ultimo_mensaje(self):
        """Retorna el último mensaje de la conversación"""
        return self.mensajes.order_by('-fecha_envio').first()
    
    def participantes_nombres(self):
        """Retorna los nombres de los participantes"""
        return ", ".join([p.usuario.get_full_name() or p.usuario.username for p in self.participantes.all()])
    
    def __str__(self):
        return f"Conversación: {self.participantes_nombres()}"

class Participante(models.Model):
    """Modelo para representar un participante en una conversación"""
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversaciones')
    conversacion = models.ForeignKey(Conversacion, on_delete=models.CASCADE, related_name='participantes')
    no_leidos = models.IntegerField(default=0)
    fecha_union = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['usuario', 'conversacion']
        verbose_name = 'Participante'
        verbose_name_plural = 'Participantes'
    
    def __str__(self):
        return f"{self.usuario.username} en {self.conversacion.id}"

class Mensaje(models.Model):
    """Modelo para representar un mensaje en una conversación"""
    conversacion = models.ForeignKey(Conversacion, on_delete=models.CASCADE, related_name='mensajes')
    remitente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mensajes_enviados')
    contenido = models.TextField()
    fecha_envio = models.DateTimeField(default=timezone.now)
    leido = models.BooleanField(default=False)
    fecha_lectura = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['fecha_envio']
        verbose_name = 'Mensaje'
        verbose_name_plural = 'Mensajes'
    
    def marcar_como_leido(self):
        """Marca el mensaje como leído"""
        if not self.leido:
            self.leido = True
            self.fecha_lectura = timezone.now()
            self.save()
            
            # Actualizar contador de no leídos para el destinatario
            for participante in self.conversacion.participantes.all():
                if participante.usuario != self.remitente and participante.no_leidos > 0:
                    participante.no_leidos -= 1
                    participante.save()
    
    def __str__(self):
        return f"Mensaje de {self.remitente.username}: {self.contenido[:50]}..."

class Adjunto(models.Model):
    """Modelo para archivos adjuntos en mensajes"""
    mensaje = models.ForeignKey(Mensaje, on_delete=models.CASCADE, related_name='adjuntos')
    archivo = models.FileField(upload_to='mensajeria/adjuntos/')
    nombre = models.CharField(max_length=255)
    tipo_archivo = models.CharField(max_length=100)
    fecha_subida = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Adjunto'
        verbose_name_plural = 'Adjuntos'
    
    def __str__(self):
        return f"Adjunto: {self.nombre}"
    
    def tamaño_legible(self):
        """Retorna el tamaño del archivo en formato legible"""
        if self.tamaño < 1024:
            return f"{self.tamaño} B"
        elif self.tamaño < 1024 * 1024:
            return f"{self.tamaño / 1024:.1f} KB"
        else:
            return f"{self.tamaño / (1024 * 1024):.1f} MB"
