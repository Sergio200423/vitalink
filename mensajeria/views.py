from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.db.models import Q, Max, Count, F, ExpressionWrapper, BooleanField
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_POST
from django.contrib import messages
from .models import Conversacion, Mensaje, Participante, Adjunto, PerfilMensajeria
from .forms import MensajeForm

User = get_user_model()

@login_required
def lista_conversaciones(request):
    """Vista para mostrar la lista de conversaciones del usuario"""
    # Obtener todas las conversaciones donde el usuario es participante
    participaciones = Participante.objects.filter(
        usuario=request.user
    ).select_related('conversacion')
    
    conversaciones_ids = [p.conversacion.id for p in participaciones]
    
    # Obtener las conversaciones con información del último mensaje
    conversaciones = Conversacion.objects.filter(
        id__in=conversaciones_ids
    ).annotate(
        ultimo_mensaje_fecha=Max('mensajes__fecha_envio'),
        mensajes_no_leidos=Count('participantes__no_leidos', 
                                filter=Q(participantes__usuario=request.user) & 
                                       Q(participantes__no_leidos__gt=0))
    ).order_by('-ultimo_mensaje_fecha')
    
    # Preparar datos para la plantilla
    conversaciones_data = []
    for conv in conversaciones:
        # Obtener el otro participante (asumiendo conversaciones de 2 personas)
        otro_participante = conv.participantes.exclude(usuario=request.user).first()
        if otro_participante:
            ultimo_mensaje = conv.ultimo_mensaje()
            # Obtener el contador de no leídos específico para este usuario
            participante_actual = conv.participantes.filter(usuario=request.user).first()
            no_leidos = participante_actual.no_leidos if participante_actual else 0
            
            conversaciones_data.append({
                'id': conv.id,
                'otro_usuario': otro_participante.usuario,
                'ultimo_mensaje': ultimo_mensaje,
                'no_leidos': no_leidos,
                'fecha_ultimo': conv.ultimo_mensaje_fecha,
            })
    
    return render(request, 'mensajeria/lista_conversaciones.html', {
        'conversaciones': conversaciones_data,
    })

def obtener_usuarios_disponibles(usuario_actual):
    """
    Función para obtener usuarios disponibles según el tipo de usuario actual
    """
    try:
        perfil_actual = usuario_actual.perfil_mensajeria
        tipo_actual = perfil_actual.tipo_usuario
    except PerfilMensajeria.DoesNotExist:
        # Si no tiene perfil, crear uno por defecto
        perfil_actual = PerfilMensajeria.objects.create(
            usuario=usuario_actual,
            tipo_usuario='cliente'
        )
        tipo_actual = 'cliente'
    
    # Lógica de negocio para VitaLink
    usuarios_disponibles = User.objects.exclude(id=usuario_actual.id).select_related('perfil_mensajeria')
    
    if tipo_actual == 'cliente':
        # Los clientes pueden contactar a nutricionistas y proveedores
        usuarios_disponibles = usuarios_disponibles.filter(
            perfil_mensajeria__tipo_usuario__in=['nutricionista', 'proveedor']
        )
    elif tipo_actual == 'nutricionista':
        # Los nutricionistas pueden contactar a clientes, otros nutricionistas y proveedores
        usuarios_disponibles = usuarios_disponibles.filter(
            perfil_mensajeria__tipo_usuario__in=['cliente', 'nutricionista', 'proveedor']
        )
    elif tipo_actual == 'proveedor':
        # Los proveedores pueden contactar a nutricionistas y clientes
        usuarios_disponibles = usuarios_disponibles.filter(
            perfil_mensajeria__tipo_usuario__in=['nutricionista', 'cliente']
        )
    elif tipo_actual == 'admin':
        # Los administradores pueden contactar a todos
        pass  # No filtrar nada
    
    return usuarios_disponibles.filter(
        perfil_mensajeria__activo=True
    ).order_by('perfil_mensajeria__tipo_usuario', 'first_name', 'last_name', 'username')

@login_required
def detalle_conversacion(request, conversacion_id):
    """Vista para mostrar una conversación específica y enviar mensajes"""
    conversacion = get_object_or_404(Conversacion, id=conversacion_id)
    
    # Verificar que el usuario sea participante
    participante = get_object_or_404(Participante, 
                                    conversacion=conversacion, 
                                    usuario=request.user)
    
    # Obtener el otro participante
    otro_participante = conversacion.participantes.exclude(usuario=request.user).first()
    
    # Marcar mensajes como leídos
    mensajes_no_leidos = Mensaje.objects.filter(
        conversacion=conversacion,
        leido=False
    ).exclude(remitente=request.user)
    
    for mensaje in mensajes_no_leidos:
        mensaje.marcar_como_leido()
    
    # Resetear contador de no leídos
    participante.no_leidos = 0
    participante.save()
    
    # Formulario para nuevo mensaje
    form = MensajeForm()
    
    if request.method == 'POST':
        form = MensajeForm(request.POST, request.FILES)
        if form.is_valid():
            mensaje = form.save(commit=False)
            mensaje.conversacion = conversacion
            mensaje.remitente = request.user
            mensaje.save()
            
            # Manejar archivos adjuntos
            if request.FILES:
                for f in request.FILES.getlist('adjuntos'):
                    Adjunto.objects.create(
                        mensaje=mensaje,
                        archivo=f,
                        nombre=f.name,
                        tipo_archivo=f.content_type
                    )
            
            messages.success(request, 'Mensaje enviado correctamente.')
            return redirect('mensajeria:detalle_conversacion', conversacion_id=conversacion.id)
    
    # Obtener todos los mensajes de la conversación
    mensajes = conversacion.mensajes.all().select_related('remitente').prefetch_related('adjuntos')
    
    return render(request, 'mensajeria/detalle_conversacion.html', {
        'conversacion': conversacion,
        'mensajes': mensajes,
        'form': form,
        'otro_usuario': otro_participante.usuario if otro_participante else None,
    })

@login_required
def nueva_conversacion(request, usuario_id=None):
    """Vista para iniciar una nueva conversación"""
    destinatario = None
    if usuario_id:
        destinatario = get_object_or_404(User, id=usuario_id)
        
        # Verificar si ya existe una conversación entre estos usuarios
        conversaciones_existentes = Conversacion.objects.filter(
            participantes__usuario=request.user
        ).filter(
            participantes__usuario=destinatario
        )
        
        if conversaciones_existentes.exists():
            # Redirigir a la conversación existente
            messages.info(request, f'Ya tienes una conversación activa con {destinatario.get_full_name() or destinatario.username}.')
            return redirect('mensajeria:detalle_conversacion', 
                           conversacion_id=conversaciones_existentes.first().id)
    
    if request.method == 'POST':
        destinatario_id = request.POST.get('destinatario')
        mensaje_texto = request.POST.get('mensaje')
        
        if destinatario_id and mensaje_texto:
            try:
                destinatario = User.objects.get(id=destinatario_id)
                
                # Verificar que no sea el mismo usuario
                if destinatario == request.user:
                    messages.error(request, 'No puedes iniciar una conversación contigo mismo.')
                    return redirect('mensajeria:nueva_conversacion')
                
                # Verificar que el destinatario esté en la lista de usuarios disponibles
                usuarios_disponibles = obtener_usuarios_disponibles(request.user)
                if not usuarios_disponibles.filter(id=destinatario.id).exists():
                    messages.error(request, 'No tienes permisos para contactar a este usuario.')
                    return redirect('mensajeria:nueva_conversacion')
                
                # Crear nueva conversación
                conversacion = Conversacion.objects.create()
                
                # Añadir participantes
                Participante.objects.create(usuario=request.user, conversacion=conversacion)
                Participante.objects.create(usuario=destinatario, conversacion=conversacion)
                
                # Crear primer mensaje
                Mensaje.objects.create(
                    conversacion=conversacion,
                    remitente=request.user,
                    contenido=mensaje_texto
                )
                
                messages.success(request, f'Conversación iniciada con {destinatario.get_full_name() or destinatario.username}.')
                return redirect('mensajeria:detalle_conversacion', conversacion_id=conversacion.id)
            except User.DoesNotExist:
                messages.error(request, 'El usuario seleccionado no existe.')
        else:
            messages.error(request, 'Por favor, selecciona un destinatario y escribe un mensaje.')
    
    # Obtener usuarios disponibles según el tipo de usuario actual
    usuarios = obtener_usuarios_disponibles(request.user)
    
    return render(request, 'mensajeria/nueva_conversacion.html', {
        'usuarios': usuarios,
        'destinatario': destinatario,
    })

@login_required
@require_POST
def enviar_mensaje_ajax(request, conversacion_id):
    """Vista para enviar mensajes vía AJAX"""
    conversacion = get_object_or_404(Conversacion, id=conversacion_id)
    
    # Verificar que el usuario sea participante
    get_object_or_404(Participante, conversacion=conversacion, usuario=request.user)
    
    contenido = request.POST.get('contenido', '').strip()
    if contenido:
        mensaje = Mensaje.objects.create(
            conversacion=conversacion,
            remitente=request.user,
            contenido=contenido
        )
        
        return JsonResponse({
            'status': 'success',
            'mensaje_id': mensaje.id,
            'remitente': request.user.username,
            'remitente_nombre': request.user.get_full_name() or request.user.username,
            'contenido': mensaje.contenido,
            'fecha': mensaje.fecha_envio.strftime('%d/%m/%Y %H:%M'),
        })
    
    return JsonResponse({'status': 'error', 'message': 'Contenido vacío'}, status=400)

@login_required
def actualizar_mensajes(request, conversacion_id, ultimo_mensaje_id):
    """Vista para obtener nuevos mensajes vía AJAX (polling)"""
    conversacion = get_object_or_404(Conversacion, id=conversacion_id)
    
    # Verificar que el usuario sea participante
    participante = get_object_or_404(Participante, 
                                    conversacion=conversacion, 
                                    usuario=request.user)
    
    # Obtener mensajes nuevos
    nuevos_mensajes = Mensaje.objects.filter(
        conversacion=conversacion,
        id__gt=ultimo_mensaje_id
    ).select_related('remitente')
    
    # Marcar mensajes como leídos
    mensajes_no_leidos = nuevos_mensajes.filter(
        leido=False
    ).exclude(remitente=request.user)
    
    for mensaje in mensajes_no_leidos:
        mensaje.marcar_como_leido()
    
    # Resetear contador de no leídos si hay mensajes nuevos
    if mensajes_no_leidos.exists():
        participante.no_leidos = 0
        participante.save()
    
    # Preparar datos para respuesta JSON
    mensajes_data = []
    for mensaje in nuevos_mensajes:
        mensajes_data.append({
            'id': mensaje.id,
            'remitente_id': mensaje.remitente.id,
            'remitente_nombre': mensaje.remitente.get_full_name() or mensaje.remitente.username,
            'contenido': mensaje.contenido,
            'fecha': mensaje.fecha_envio.strftime('%d/%m/%Y %H:%M'),
            'es_propio': mensaje.remitente == request.user,
        })
    
    return JsonResponse({
        'status': 'success',
        'mensajes': mensajes_data,
    })

@login_required
def contador_no_leidos(request):
    """Vista para obtener el contador de mensajes no leídos del usuario"""
    total_no_leidos = Participante.objects.filter(
        usuario=request.user
    ).aggregate(
        total=Count('no_leidos')
    )['total'] or 0
    
    return JsonResponse({
        'count': total_no_leidos
    })

@login_required
def buscar_usuarios(request):
    """Vista para buscar usuarios disponibles para iniciar conversaciones"""
    query = request.GET.get('q', '').strip()
    
    if len(query) < 2:
        return JsonResponse({'usuarios': []})
    
    # Obtener usuarios disponibles según el tipo de usuario actual
    usuarios_disponibles = obtener_usuarios_disponibles(request.user)
    
    # Filtrar por la búsqueda
    usuarios = usuarios_disponibles.filter(
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(username__icontains=query)
    )[:10]
    
    usuarios_data = []
    for usuario in usuarios:
        try:
            perfil = usuario.perfil_mensajeria
            tipo_usuario = perfil.get_tipo_usuario_display()
            avatar_url = perfil.avatar.url if perfil.avatar else None
        except PerfilMensajeria.DoesNotExist:
            tipo_usuario = 'Usuario'
            avatar_url = None
        
        usuarios_data.append({
            'id': usuario.id,
            'nombre': usuario.get_full_name() or usuario.username,
            'username': usuario.username,
            'tipo_usuario': tipo_usuario,
            'avatar': avatar_url,
        })
    
    return JsonResponse({'usuarios': usuarios_data})
