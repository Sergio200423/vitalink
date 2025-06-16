from django.apps import AppConfig

class MensajeriaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mensajeria'
    verbose_name = 'Sistema de Mensajería'
    
    def ready(self):
        import mensajeria.signals