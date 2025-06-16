def validar_peso_altura(peso, altura):
    if not isinstance(peso, (int,float)):
        return False, "El peso debe ser un numero entero o flotante."
    if not isinstance(altura, (int,float)):
        return False, "La altura debe ser un numero entero o flotante."
    if peso <= 0:
        return False, "El peso debe ser mayor a cero."
    if altura <= 0:
        return False, "La altura debe ser mayor a cero."
    return True, ""

def calcularIMC(peso, altura):
    esValido, mensajeError = validar_peso_altura(peso, altura)
    if(esValido):
        return peso / pow(altura, 2)  #Retornamos el indice de masa corporal
    return mensajeError
