# Script para configurar tipos de usuarios existentes
# Ejecutar con: python manage.py shell < scripts/configurar_tipos_usuarios.py

import os
import sys

# Ajusta la ruta al directorio raíz del proyecto
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vitalink.settings')

import django
django.setup()

from django.db.models import Count
from django.contrib.auth import get_user_model
from mensajeria.models import PerfilMensajeria

User = get_user_model()

def configurar_tipos_usuarios():
    """
    Configura los tipos de usuarios basándose en patrones o manualmente
    """
    print("🔧 Configurando tipos de usuarios...")
    
    # Obtener todos los usuarios
    usuarios = User.objects.all()
    
    for usuario in usuarios:
        # Crear perfil si no existe
        perfil, created = PerfilMensajeria.objects.get_or_create(
            usuario=usuario,
            defaults={'tipo_usuario': 'cliente'}
        )
        
        if created:
            print(f"✅ Creado perfil para {usuario.username}")
        
        # Configurar tipos específicos (puedes personalizar esto)
        username_lower = usuario.username.lower()
        
        # Ejemplos de configuración automática
        if any(palabra in username_lower for palabra in ['nutricionista', 'nutri', 'doctor', 'dra', 'dr']):
            perfil.tipo_usuario = 'nutricionista'
            perfil.save()
            print(f"🥗 {usuario.username} configurado como Nutricionista")
        
        elif any(palabra in username_lower for palabra in ['proveedor', 'empresa', 'comercio', 'tienda']):
            perfil.tipo_usuario = 'proveedor'
            perfil.save()
            print(f"🏪 {usuario.username} configurado como Proveedor")
        
        elif usuario.is_staff or usuario.is_superuser:
            perfil.tipo_usuario = 'admin'
            perfil.save()
            print(f"👑 {usuario.username} configurado como Administrador")
        
        else:
            # Por defecto, cliente
            if perfil.tipo_usuario != 'cliente':
                perfil.tipo_usuario = 'cliente'
                perfil.save()
            print(f"👤 {usuario.username} configurado como Cliente")

def mostrar_estadisticas():
    """
    Muestra estadísticas de tipos de usuarios
    """
    print("\n📊 Estadísticas de usuarios:")
    
    stats = PerfilMensajeria.objects.values('tipo_usuario').annotate(
        count=Count('id')
    )
    
    for stat in stats:
        tipo = dict(PerfilMensajeria._meta.get_field('tipo_usuario').choices)[stat['tipo_usuario']]
        print(f"{tipo}: {stat['count']}")
    
    print(f"\n📈 Total de usuarios: {User.objects.count()}")

# Ejecutar configuración
configurar_tipos_usuarios()
mostrar_estadisticas()

print("\n✅ Configuración completada!")
print("\n💡 Consejos:")
print("   - Los clientes pueden contactar a nutricionistas y proveedores")
print("   - Los nutricionistas pueden contactar a todos")
print("   - Los proveedores pueden contactar a nutricionistas y clientes")
print("   - Los administradores pueden contactar a todos")
