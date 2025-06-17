
def procesar_peso_altura(peso_str, altura_str):
    """Funcion para convertir los strings obtenidos del formulario
    que son altura y peso a numeros flotantes.
    Mandamos un mensaje de error en caso de que peso_str o 
    altura_str no se puedan convertir a flotantes
    """
    try:
        peso = float(peso_str)
        altura = float(altura_str)
        return {"ok": True, "peso": peso, "altura": altura, "mensaje": ""}
    except (TypeError, ValueError):
        return {"ok": False, "peso": None, "altura": None, "mensaje": "Por favor, ingrese numeros validos"}

def validar_peso_altura(peso, altura):
    """
    Funcion para validar que la altura y el peso sean numeros mayores que cero
    """
    mensajes = []
    if peso <= 0:
        mensajes.append("El peso debe ser mayor a cero.\n")
    if altura <= 0:
        mensajes.append("La altura debe ser mayor a cero.")
    
    if mensajes:
        return False, " ".join(mensajes)
    return True, ""


def calcularIMC(peso, altura):
    """
    Funcion para calcular el IMC, mensaje de error en caso de que 
    alguna variable tuviera un valor incorrecto. Redondeamos a un 
    digito
    """
    esValido, mensajeError = validar_peso_altura(peso, altura)
    if(esValido):
        return round(peso / pow(altura, 2), 1)  #Retornamos el indice de masa corporal
    return mensajeError
