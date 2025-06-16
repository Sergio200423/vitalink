document.addEventListener("DOMContentLoaded", () => {
  // Funcionalidad para dispositivos móviles - MEJORADA
  const mensajeriaSidebar = document.querySelector(".mensajeria-sidebar")
  const mensajeriaHeader = document.querySelector(".mensajeria-header")

  if (mensajeriaSidebar && mensajeriaHeader) {
    // En móvil, hacer el header clickeable para expandir/contraer
    if (window.innerWidth <= 768) {
      mensajeriaHeader.addEventListener("click", () => {
        mensajeriaSidebar.classList.toggle("expanded")
      })

      // Cerrar sidebar al hacer click fuera en móvil
      document.addEventListener("click", (e) => {
        if (
          window.innerWidth <= 768 &&
          !mensajeriaSidebar.contains(e.target) &&
          mensajeriaSidebar.classList.contains("expanded")
        ) {
          mensajeriaSidebar.classList.remove("expanded")
        }
      })
    }
  }

  // Función para ajustar altura del contenedor según el viewport
  function ajustarAlturaContenedor() {
    const mensajeriaContainer = document.querySelector(".mensajeria-container")
    if (mensajeriaContainer) {
      const headerHeight = document.querySelector(".header")?.offsetHeight || 80
      const availableHeight = window.innerHeight - headerHeight - 40 // 40px para márgenes
      mensajeriaContainer.style.height = `${availableHeight}px`
    }
  }

  // Ajustar altura al cargar y al redimensionar
  ajustarAlturaContenedor()
  window.addEventListener("resize", ajustarAlturaContenedor)

  // Función para mostrar notificaciones toast
  function mostrarToast(mensaje, tipo = "info") {
    const toast = document.createElement("div")
    toast.className = `toast ${tipo}`
    toast.textContent = mensaje

    document.body.appendChild(toast)

    setTimeout(() => {
      toast.remove()
    }, 3000)
  }

  // Función para formatear fecha
  function formatearFecha(fecha) {
    const ahora = new Date()
    const fechaMensaje = new Date(fecha)
    const diferencia = ahora - fechaMensaje

    // Si es del mismo día, mostrar solo la hora
    if (diferencia < 24 * 60 * 60 * 1000 && ahora.toDateString() === fechaMensaje.toDateString()) {
      return fechaMensaje.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    // Si es de ayer
    const ayer = new Date(ahora)
    ayer.setDate(ayer.getDate() - 1)
    if (ayer.toDateString() === fechaMensaje.toDateString()) {
      return "Ayer"
    }

    // Si es de esta semana
    if (diferencia < 7 * 24 * 60 * 60 * 1000) {
      return fechaMensaje.toLocaleDateString("es-ES", { weekday: "long" })
    }

    // Fecha completa
    return fechaMensaje.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  }

  // Función para escapar HTML
  function escaparHTML(texto) {
    const div = document.createElement("div")
    div.textContent = texto
    return div.innerHTML
  }

  // Función para detectar URLs en texto y convertirlas en enlaces
  function convertirURLsEnEnlaces(texto) {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return texto.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
  }

  // Función para procesar texto de mensaje
  function procesarTextoMensaje(texto) {
    let textoEscapado = escaparHTML(texto)
    textoEscapado = convertirURLsEnEnlaces(textoEscapado)
    return textoEscapado.replace(/\n/g, "<br>")
  }

  // Función para auto-resize del textarea
  function autoResizeTextarea(textarea) {
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
  }

  // Aplicar auto-resize a textareas de mensaje
  const mensajeInputs = document.querySelectorAll(".mensaje-input")
  mensajeInputs.forEach((input) => {
    input.addEventListener("input", () => autoResizeTextarea(input))
    input.addEventListener("keydown", (e) => {
      // Enviar con Ctrl+Enter
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault()
        const form = input.closest("form")
        if (form) {
          form.dispatchEvent(new Event("submit"))
        }
      }
    })
  })

  // Función para manejar notificaciones del navegador
  function solicitarPermisoNotificaciones() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }

  function mostrarNotificacionNavegador(titulo, mensaje, icono = null) {
    if ("Notification" in window && Notification.permission === "granted") {
      const notificacion = new Notification(titulo, {
        body: mensaje,
        icon: icono || "/static/main/img/vitalink-icon.png",
        tag: "vitalink-mensaje",
      })

      notificacion.onclick = () => {
        window.focus()
        notificacion.close()
      }

      setTimeout(() => {
        notificacion.close()
      }, 5000)
    }
  }

  // Solicitar permisos de notificación al cargar la página
  solicitarPermisoNotificaciones()

  // Función para validar archivos adjuntos
  function validarArchivo(archivo) {
    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    const tamañoMaximo = 5 * 1024 * 1024 // 5MB

    if (!tiposPermitidos.includes(archivo.type)) {
      mostrarToast("Tipo de archivo no permitido.", "error")
      return false
    }

    if (archivo.size > tamañoMaximo) {
      mostrarToast("El archivo es demasiado grande. Máximo 5MB.", "error")
      return false
    }

    return true
  }

  // Función para previsualizar imágenes
  function previsualizarImagen(archivo, contenedor) {
    if (archivo.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement("img")
        img.src = e.target.result
        img.style.maxWidth = "100px"
        img.style.maxHeight = "100px"
        img.style.borderRadius = "4px"
        img.style.marginRight = "8px"
        contenedor.appendChild(img)
      }
      reader.readAsDataURL(archivo)
    }
  }

  // Función para formatear tamaño de archivo
  function formatearTamañoArchivo(bytes) {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const tamaños = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + tamaños[i]
  }

  // Manejar visibilidad de la página para pausar/reanudar actualizaciones
  let paginaVisible = true

  document.addEventListener("visibilitychange", () => {
    paginaVisible = !document.hidden
  })

  // Función para manejar errores de red
  function manejarErrorRed(error) {
    console.error("Error de red:", error)
    mostrarToast("Error de conexión. Verifica tu conexión a internet.", "error")
  }

  // Exportar funciones para uso en otras partes de la aplicación
  window.VitaLinkMensajeria = {
    mostrarToast,
    formatearFecha,
    procesarTextoMensaje,
    validarArchivo,
    previsualizarImagen,
    formatearTamañoArchivo,
    mostrarNotificacionNavegador,
    ajustarAlturaContenedor,
    autoResizeTextarea,
  }

  // Inicialización final
  console.log("✅ VitaLink Mensajería inicializada correctamente")
})
