"""
URL configuration for vitalink project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    path('listanutricionista/', include('listnutricionista.urls')), #Le permitimos saber cuales son las urls de la app main
    path('mensajes/', include('mensajeria.urls', namespace='mensajeria')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('herramientas/', include('herramientas.urls')),
    path('clientes/', include('clientes.urls')),
]
