from django import forms
from .models import Mensaje

class MensajeForm(forms.ModelForm):
    """Formulario para crear un nuevo mensaje (solo texto)"""
    class Meta:
        model = Mensaje
        fields = ['contenido']
        widgets = {
            'contenido': forms.Textarea(attrs={
                'rows': 3, 
                'placeholder': 'Escribe tu mensaje aquí...',
                'class': 'mensaje-input'
            }),
        }

# El campo adjuntos se maneja solo en la vista y en la plantilla, no en el formulario.