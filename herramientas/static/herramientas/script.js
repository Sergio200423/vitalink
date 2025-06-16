// Datos almacenados localmente
let planes = JSON.parse(localStorage.getItem("planes")) || []
let expedientes = JSON.parse(localStorage.getItem("expedientes")) || []

// Función para calcular IMC
function calcularIMC() {
  const peso = Number.parseFloat(document.getElementById("peso").value)
  const altura = Number.parseFloat(document.getElementById("altura").value)
  const resultadoDiv = document.getElementById("resultado-imc")

  if (!peso || !altura || peso <= 0 || altura <= 0) {
    resultadoDiv.innerHTML =
      '<p style="color: var(--accent-red);">Por favor, ingresa valores válidos para peso y altura.</p>'
    return
  }

  // Convertir altura de cm a metros
  const alturaMetros = altura / 100
  const imc = peso / (alturaMetros * alturaMetros)

  let categoria = ""
  let clase = ""
  let recomendacion = ""

  if (imc < 18.5) {
    categoria = "Bajo peso"
    clase = "bajo-peso"
    recomendacion = "Se recomienda consultar con un profesional para evaluar un plan de ganancia de peso saludable."
  } else if (imc >= 18.5 && imc < 25) {
    categoria = "Peso normal"
    clase = "normal"
    recomendacion = "Mantén un estilo de vida saludable con una dieta equilibrada y ejercicio regular."
  } else if (imc >= 25 && imc < 30) {
    categoria = "Sobrepeso"
    clase = "sobrepeso"
    recomendacion = "Se recomienda adoptar hábitos alimenticios más saludables y aumentar la actividad física."
  } else {
    categoria = "Obesidad"
    clase = "obesidad"
    recomendacion =
      "Es importante consultar con un profesional de la salud para desarrollar un plan de pérdida de peso seguro."
  }

  resultadoDiv.innerHTML = `
        <div class="resultado ${clase}">
            <h4>Resultado del IMC</h4>
            <p><strong>IMC: ${imc.toFixed(1)}</strong></p>
            <p><strong>Categoría: ${categoria}</strong></p>
            <p>${recomendacion}</p>
        </div>
    `
}

// Función para crear plan personalizado
function crearPlan() {
  const nombre = document.getElementById("cliente-nombre").value.trim()
  const objetivo = document.getElementById("objetivo").value
  const calorias = document.getElementById("calorias-diarias").value

  if (!nombre || !objetivo || !calorias) {
    alert("Por favor, completa todos los campos para crear el plan.")
    return
  }

  const plan = {
    id: Date.now(),
    nombre: nombre,
    objetivo: objetivo,
    calorias: Number.parseInt(calorias),
    fecha: new Date().toLocaleDateString("es-ES"),
  }

  planes.push(plan)
  localStorage.setItem("planes", JSON.stringify(planes))

  // Limpiar formulario
  document.getElementById("cliente-nombre").value = ""
  document.getElementById("objetivo").value = ""
  document.getElementById("calorias-diarias").value = ""

  mostrarPlanes()
}

// Función para mostrar planes
function mostrarPlanes() {
  const planesLista = document.getElementById("planes-lista")

  if (planes.length === 0) {
    planesLista.innerHTML =
      '<p style="color: var(--gray); text-align: center; margin-top: var(--spacing-lg);">No hay planes creados aún.</p>'
    return
  }

  const objetivoTexto = {
    "perdida-peso": "Pérdida de peso",
    "ganancia-masa": "Ganancia de masa muscular",
    mantenimiento: "Mantenimiento",
    deportivo: "Rendimiento deportivo",
  }

  planesLista.innerHTML = planes
    .map(
      (plan) => `
        <div class="plan-item">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4>${plan.nombre}</h4>
                <button class="btn btn-danger" onclick="eliminarPlan(${plan.id})">Eliminar</button>
            </div>
            <p><strong>Objetivo:</strong> ${objetivoTexto[plan.objetivo]}</p>
            <p><strong>Calorías diarias:</strong> ${plan.calorias} kcal</p>
            <p><strong>Fecha de creación:</strong> ${plan.fecha}</p>
        </div>
    `,
    )
    .join("")
}

// Función para eliminar plan
function eliminarPlan(id) {
  if (confirm("¿Estás seguro de que quieres eliminar este plan?")) {
    planes = planes.filter((plan) => plan.id !== id)
    localStorage.setItem("planes", JSON.stringify(planes))
    mostrarPlanes()
  }
}

// Función para agregar expediente
function agregarExpediente() {
  const nombre = document.getElementById("exp-nombre").value.trim()
  const edad = document.getElementById("exp-edad").value
  const peso = document.getElementById("exp-peso").value
  const altura = document.getElementById("exp-altura").value
  const notas = document.getElementById("exp-notas").value.trim()

  if (!nombre || !edad || !peso || !altura) {
    alert("Por favor, completa todos los campos obligatorios.")
    return
  }

  // Calcular IMC automáticamente
  const alturaMetros = Number.parseFloat(altura) / 100
  const imc = Number.parseFloat(peso) / (alturaMetros * alturaMetros)

  const expediente = {
    id: Date.now(),
    nombre: nombre,
    edad: Number.parseInt(edad),
    peso: Number.parseFloat(peso),
    altura: Number.parseFloat(altura),
    imc: imc.toFixed(1),
    notas: notas,
    fecha: new Date().toLocaleDateString("es-ES"),
  }

  expedientes.push(expediente)
  localStorage.setItem("expedientes", JSON.stringify(expedientes))

  // Limpiar formulario
  document.getElementById("exp-nombre").value = ""
  document.getElementById("exp-edad").value = ""
  document.getElementById("exp-peso").value = ""
  document.getElementById("exp-altura").value = ""
  document.getElementById("exp-notas").value = ""

  mostrarExpedientes()
}

// Función para mostrar expedientes
function mostrarExpedientes() {
  const expedientesLista = document.getElementById("expedientes-lista")

  if (expedientes.length === 0) {
    expedientesLista.innerHTML =
      '<p style="color: var(--gray); text-align: center; margin-top: var(--spacing-lg);">No hay expedientes registrados aún.</p>'
    return
  }

  expedientesLista.innerHTML = expedientes
    .map(
      (exp) => `
        <div class="expediente-item">
            <div class="expediente-header">
                <h4>${exp.nombre}</h4>
                <button class="btn btn-danger" onclick="eliminarExpediente(${exp.id})">Eliminar</button>
            </div>
            <div class="expediente-info">
                <span><strong>Edad:</strong> ${exp.edad} años</span>
                <span><strong>Peso:</strong> ${exp.peso} kg</span>
                <span><strong>Altura:</strong> ${exp.altura} cm</span>
                <span><strong>IMC:</strong> ${exp.imc}</span>
                <span><strong>Fecha:</strong> ${exp.fecha}</span>
            </div>
            ${exp.notas ? `<div class="expediente-notas"><strong>Notas:</strong> ${exp.notas}</div>` : ""}
        </div>
    `,
    )
    .join("")
}

// Función para eliminar expediente
function eliminarExpediente(id) {
  if (confirm("¿Estás seguro de que quieres eliminar este expediente?")) {
    expedientes = expedientes.filter((exp) => exp.id !== id)
    localStorage.setItem("expedientes", JSON.stringify(expedientes))
    mostrarExpedientes()
  }
}

// Inicializar la página
document.addEventListener("DOMContentLoaded", () => {
  mostrarPlanes()
  mostrarExpedientes()

  // Agregar event listeners para Enter en los campos de IMC
  document.getElementById("peso").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      calcularIMC()
    }
  })

  document.getElementById("altura").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      calcularIMC()
    }
  })
})

// Navegación simple
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault()

    // Remover clase active de todos los links
    document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"))

    // Agregar clase active al link clickeado
    this.classList.add("active")
  })
})
