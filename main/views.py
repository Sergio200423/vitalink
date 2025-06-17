from django.shortcuts import render

# Create your views here.
def inicio_main(request):
    return render(request, 'main/index.html')

def registroSesion(request):
    return render(request, 'main/register.html')

def inicioSesion(request):
    return render(request, 'main/login.html')

