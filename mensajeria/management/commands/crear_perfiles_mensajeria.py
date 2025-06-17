from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from mensajeria.models import PerfilMensajeria

User = get_user_model()

class Command(BaseCommand):
    help = 'Crea perfiles de mensajería para usuarios existentes'

    def add_arguments(self, parser):
        parser.add_argument(
            '--tipo-default',
            type=str,
            default='cliente',
            help='Tipo de usuario por defecto (cliente, nutricionista, proveedor, admin)'
        )

    def handle(self, *args, **options):
        usuarios_sin_perfil = User.objects.filter(perfil_mensajeria__isnull=True)
        
        perfiles_creados = 0
        for usuario in usuarios_sin_perfil:
            # Intentar determinar el tipo de usuario basado en el nombre de usuario o email
            tipo_usuario = self.determinar_tipo_usuario(usuario, options['tipo_default'])
            
            PerfilMensajeria.objects.create(
                usuario=usuario,
                tipo_usuario=tipo_usuario
            )
            perfiles_creados += 1
            
            self.stdout.write(
                f'Creado perfil para {usuario.username} como {tipo_usuario}'
            )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Se crearon {perfiles_creados} perfiles de mensajería'
            )
        )
    
    def determinar_tipo_usuario(self, usuario, default):
        """Determina el tipo de usuario basado en patrones en username o email"""
        username_lower = usuario.username.lower()
        email_lower = usuario.email.lower() if usuario.email else ''
        
        # Patrones para nutricionistas
        if any(palabra in username_lower for palabra in ['nutricionista', 'nutri', 'doctor', 'dra', 'dr']):
            return 'nutricionista'
        if any(palabra in email_lower for palabra in ['nutricionista', 'nutri', 'doctor']):
            return 'nutricionista'
        
        # Patrones para proveedores
        if any(palabra in username_lower for palabra in ['proveedor', 'empresa', 'comercio', 'tienda']):
            return 'proveedor'
        if any(palabra in email_lower for palabra in ['proveedor', 'empresa', 'comercio']):
            return 'proveedor'
        
        # Patrones para administradores
        if any(palabra in username_lower for palabra in ['admin', 'administrador', 'staff']):
            return 'admin'
        if usuario.is_staff or usuario.is_superuser:
            return 'admin'
        
        return default
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from mensajeria.models import PerfilMensajeria

User = get_user_model()

class Command(BaseCommand):
    help = 'Crea perfiles de mensajería para usuarios existentes'

    def add_arguments(self, parser):
        parser.add_argument(
            '--tipo-default',
            type=str,
            default='cliente',
            help='Tipo de usuario por defecto (cliente, nutricionista, proveedor, admin)'
        )

    def handle(self, *args, **options):
        usuarios_sin_perfil = User.objects.filter(perfil_mensajeria__isnull=True)
        
        perfiles_creados = 0
        for usuario in usuarios_sin_perfil:
            # Intentar determinar el tipo de usuario basado en el nombre de usuario o email
            tipo_usuario = self.determinar_tipo_usuario(usuario, options['tipo_default'])
            
            PerfilMensajeria.objects.create(
                usuario=usuario,
                tipo_usuario=tipo_usuario
            )
            perfiles_creados += 1
            
            self.stdout.write(
                f'Creado perfil para {usuario.username} como {tipo_usuario}'
            )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Se crearon {perfiles_creados} perfiles de mensajería'
            )
        )
    
    def determinar_tipo_usuario(self, usuario, default):
        """Determina el tipo de usuario basado en patrones en username o email"""
        username_lower = usuario.username.lower()
        email_lower = usuario.email.lower() if usuario.email else ''
        
        # Patrones para nutricionistas
        if any(palabra in username_lower for palabra in ['nutricionista', 'nutri', 'doctor', 'dra', 'dr']):
            return 'nutricionista'
        if any(palabra in email_lower for palabra in ['nutricionista', 'nutri', 'doctor']):
            return 'nutricionista'
        
        # Patrones para proveedores
        if any(palabra in username_lower for palabra in ['proveedor', 'empresa', 'comercio', 'tienda']):
            return 'proveedor'
        if any(palabra in email_lower for palabra in ['proveedor', 'empresa', 'comercio']):
            return 'proveedor'
        
        # Patrones para administradores
        if any(palabra in username_lower for palabra in ['admin', 'administrador', 'staff']):
            return 'admin'
        if usuario.is_staff or usuario.is_superuser:
            return 'admin'
        
        return default
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from mensajeria.models import PerfilMensajeria

User = get_user_model()

class Command(BaseCommand):
    help = 'Crea perfiles de mensajería para usuarios existentes'

    def add_arguments(self, parser):
        parser.add_argument(
            '--tipo-default',
            type=str,
            default='cliente',
            help='Tipo de usuario por defecto (cliente, nutricionista, proveedor, admin)'
        )

    def handle(self, *args, **options):
        usuarios_sin_perfil = User.objects.filter(perfil_mensajeria__isnull=True)
        
        perfiles_creados = 0
        for usuario in usuarios_sin_perfil:
            # Intentar determinar el tipo de usuario basado en el nombre de usuario o email
            tipo_usuario = self.determinar_tipo_usuario(usuario, options['tipo_default'])
            
            PerfilMensajeria.objects.create(
                usuario=usuario,
                tipo_usuario=tipo_usuario
            )
            perfiles_creados += 1
            
            self.stdout.write(
                f'Creado perfil para {usuario.username} como {tipo_usuario}'
            )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Se crearon {perfiles_creados} perfiles de mensajería'
            )
        )
    
    def determinar_tipo_usuario(self, usuario, default):
        """Determina el tipo de usuario basado en patrones en username o email"""
        username_lower = usuario.username.lower()
        email_lower = usuario.email.lower() if usuario.email else ''
        
        # Patrones para nutricionistas
        if any(palabra in username_lower for palabra in ['nutricionista', 'nutri', 'doctor', 'dra', 'dr']):
            return 'nutricionista'
        if any(palabra in email_lower for palabra in ['nutricionista', 'nutri', 'doctor']):
            return 'nutricionista'
        
        # Patrones para proveedores
        if any(palabra in username_lower for palabra in ['proveedor', 'empresa', 'comercio', 'tienda']):
            return 'proveedor'
        if any(palabra in email_lower for palabra in ['proveedor', 'empresa', 'comercio']):
            return 'proveedor'
        
        # Patrones para administradores
        if any(palabra in username_lower for palabra in ['admin', 'administrador', 'staff']):
            return 'admin'
        if usuario.is_staff or usuario.is_superuser:
            return 'admin'
        
        return default
