from django.shortcuts import render
from . import servicios 
from django.http import JsonResponse

# Create your views here.
def inicio_herramientas(request):
    """
    Capturar el metodo post
    """
    contexto = {}#diccionario para mandar al template
    if request.method == "POST":
        """
        Capturar las variables del template, procesar las variables
        y calcular el indice de masa corporal con las variables.
        Mandar el resultado al template en caso de que todo haya
        estado bien, y sino enviar un mensaje de error
        """
        
        peso_str = request.POST.get('peso')
        altura_str = request.POST.get('altura')
        resultado = servicios.procesar_peso_altura(peso_str, altura_str)

        if resultado["ok"]:
            indiceMasaCorporal = servicios.calcularIMC(resultado["peso"], resultado["altura"] / 100)
            if isinstance(indiceMasaCorporal, (int, float)):
                return JsonResponse({"imc": indiceMasaCorporal})
            else:
                return JsonResponse({"mensaje": indiceMasaCorporal})  
        else:
            return JsonResponse({"mensaje": resultado["mensaje"]})
    return render(request, 'herramientas/index.html')

def expediente(request):
    return render(request, 'herramientas/expediente.html')
