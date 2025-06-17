from django.shortcuts import render
from .models import Usuario
# Create your views here.


def nutricionistas_suscritos(request):
    nutricionistas = Usuario.objects.filter(es_nutricionista=True, esta_suscrito=True)
    return render(request, 'listnutricionista/nutricionistas.html', {'nutricionistas': nutricionistas})