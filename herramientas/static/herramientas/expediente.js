// Global variables
let currentSection = "datos-generales"
let followUpCounter = 0
let patientData = {}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  loadSavedData()
  setupFormValidation()

  // Add first follow-up entry
  addFollowUp()
})

// Navigation functionality
function initializeNavigation() {
  const navItems = document.querySelectorAll(".nav-item")

  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section")
      showSection(sectionId)
    })
  })
}

function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll(".form-section")
  sections.forEach((section) => {
    section.classList.remove("active")
  })

  // Show selected section
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.add("active")
  }

  // Update navigation
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.classList.remove("active")
  })

  const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`)
  if (activeNavItem) {
    activeNavItem.classList.add("active")
  }

  currentSection = sectionId

  // Scroll to top of form content
  document.querySelector(".form-content").scrollTop = 0
}

// Age calculation
function calculateAge() {
  const birthDate = document.getElementById("fecha-nacimiento").value
  if (birthDate) {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    document.getElementById("edad").value = age
  }
}

// BMI calculation
function calculateIMC() {
  const weight = Number.parseFloat(document.getElementById("peso-actual").value)
  const height = Number.parseFloat(document.getElementById("talla").value)

  if (weight && height) {
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    document.getElementById("imc").value = bmi.toFixed(2)

    // Calculate ideal weight (using Devine formula)
    const idealWeight =
      height > 152
        ? document.getElementById("genero").value === "femenino"
          ? 45.5 + 2.3 * ((height - 152.4) / 2.54)
          : 50 + 2.3 * ((height - 152.4) / 2.54)
        : weight

    document.getElementById("peso-ideal").value = idealWeight.toFixed(1)
  }
}

// Waist-Hip Ratio calculation
function calculateWHR() {
  const waist = Number.parseFloat(document.getElementById("perimetro-abdominal").value)
  const hip = Number.parseFloat(document.getElementById("perimetro-cadera").value)

  if (waist && hip) {
    const whr = waist / hip
    document.getElementById("relacion-cintura-cadera").value = whr.toFixed(2)
  }
}

// Follow-up management
function addFollowUp() {
  followUpCounter++
  const followUpsList = document.getElementById("seguimientos-list")

  const followUpItem = document.createElement("div")
  followUpItem.className = "seguimiento-item"
  followUpItem.id = `seguimiento-${followUpCounter}`

  const today = new Date().toISOString().split("T")[0]

  followUpItem.innerHTML = `
        <div class="seguimiento-header-item">
            <div class="seguimiento-date">Seguimiento #${followUpCounter}</div>
            <div class="seguimiento-actions">
                <button type="button" class="btn btn-danger btn-small" onclick="removeFollowUp(${followUpCounter})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
        <div class="seguimiento-content">
            <div class="form-group">
                <label for="fecha-cita-${followUpCounter}">Fecha de Cita</label>
                <input type="date" id="fecha-cita-${followUpCounter}" name="fechaCita${followUpCounter}" value="${today}">
            </div>
            <div class="form-group">
                <label for="peso-seguimiento-${followUpCounter}">Peso (kg)</label>
                <input type="number" id="peso-seguimiento-${followUpCounter}" name="pesoSeguimiento${followUpCounter}" step="0.1">
            </div>
            <div class="form-group">
                <label for="cumplimiento-${followUpCounter}">Cumplimiento del Plan</label>
                <select id="cumplimiento-${followUpCounter}" name="cumplimiento${followUpCounter}">
                    <option value="">Seleccionar</option>
                    <option value="excelente">Excelente (90-100%)</option>
                    <option value="bueno">Bueno (70-89%)</option>
                    <option value="regular">Regular (50-69%)</option>
                    <option value="deficiente">Deficiente (<50%)</option>
                </select>
            </div>
            <div class="form-group full-width">
                <label for="notas-progreso-${followUpCounter}">Notas de Progreso</label>
                <textarea id="notas-progreso-${followUpCounter}" name="notasProgreso${followUpCounter}" rows="3" placeholder="Cambios observados, respuesta del paciente, etc."></textarea>
            </div>
            <div class="form-group full-width">
                <label for="ajustes-plan-${followUpCounter}">Ajustes Realizados al Plan</label>
                <textarea id="ajustes-plan-${followUpCounter}" name="ajustesPlan${followUpCounter}" rows="2"></textarea>
            </div>
            <div class="form-group">
                <label for="proxima-cita-${followUpCounter}">Próxima Cita</label>
                <input type="date" id="proxima-cita-${followUpCounter}" name="proximaCita${followUpCounter}">
            </div>
        </div>
    `

  followUpsList.appendChild(followUpItem)
}

function removeFollowUp(id) {
  showModal("Confirmar Eliminación", "¿Está seguro de que desea eliminar este seguimiento?", () => {
    const followUpItem = document.getElementById(`seguimiento-${id}`)
    if (followUpItem) {
      followUpItem.remove()
    }
    closeModal()
  })
}

// Form validation
function setupFormValidation() {
  const form = document.getElementById("patient-record-form")
  const requiredFields = form.querySelectorAll("[required]")

  requiredFields.forEach((field) => {
    field.addEventListener("blur", validateField)
    field.addEventListener("input", clearFieldError)
  })
}

function validateField(event) {
  const field = event.target
  const value = field.value.trim()

  if (!value) {
    showFieldError(field, "Este campo es obligatorio")
    return false
  }

  // Specific validations
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      showFieldError(field, "Ingrese un email válido")
      return false
    }
  }

  if (field.type === "tel" && value) {
    const phoneRegex = /^[\d\s\-+$$$$]+$/
    if (!phoneRegex.test(value)) {
      showFieldError(field, "Ingrese un teléfono válido")
      return false
    }
  }

  clearFieldError(field)
  return true
}

function showFieldError(field, message) {
  clearFieldError(field)

  field.style.borderColor = "var(--accent-red)"

  const errorDiv = document.createElement("div")
  errorDiv.className = "field-error"
  errorDiv.style.color = "var(--accent-red)"
  errorDiv.style.fontSize = "var(--font-size-sm)"
  errorDiv.style.marginTop = "var(--spacing-xs)"
  errorDiv.textContent = message

  field.parentNode.appendChild(errorDiv)
}

function clearFieldError(field) {
  field.style.borderColor = ""
  const errorDiv = field.parentNode.querySelector(".field-error")
  if (errorDiv) {
    errorDiv.remove()
  }
}

// Data management
function collectFormData() {
  const form = document.getElementById("patient-record-form")
  const formData = new FormData(form)
  const data = {}

  for (const [key, value] of formData.entries()) {
    data[key] = value
  }

  // Add follow-up data
  data.seguimientos = []
  for (let i = 1; i <= followUpCounter; i++) {
    const seguimientoElement = document.getElementById(`seguimiento-${i}`)
    if (seguimientoElement) {
      const seguimiento = {
        id: i,
        fechaCita: document.getElementById(`fecha-cita-${i}`)?.value || "",
        pesoSeguimiento: document.getElementById(`peso-seguimiento-${i}`)?.value || "",
        cumplimiento: document.getElementById(`cumplimiento-${i}`)?.value || "",
        notasProgreso: document.getElementById(`notas-progreso-${i}`)?.value || "",
        ajustesPlan: document.getElementById(`ajustes-plan-${i}`)?.value || "",
        proximaCita: document.getElementById(`proxima-cita-${i}`)?.value || "",
      }
      data.seguimientos.push(seguimiento)
    }
  }

  return data
}

function saveRecord() {
  const data = collectFormData()

  // Validate required fields
  const requiredFields = document.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (!validateField({ target: field })) {
      isValid = false
    }
  })

  if (!isValid) {
    showModal("Campos Requeridos", "Por favor complete todos los campos obligatorios antes de guardar.", () =>
      closeModal(),
    )
    return
  }

  // Save to localStorage
  localStorage.setItem("vitalink-patient-record", JSON.stringify(data))
  patientData = data

  showModal("Guardado Exitoso", "El expediente del paciente ha sido guardado correctamente.", () => closeModal())
}

function loadSavedData() {
  const savedData = localStorage.getItem("vitalink-patient-record")
  if (savedData) {
    try {
      patientData = JSON.parse(savedData)
      populateForm(patientData)
    } catch (error) {
      console.error("Error loading saved data:", error)
    }
  }
}

function populateForm(data) {
  // Populate basic form fields
  Object.keys(data).forEach((key) => {
    if (key !== "seguimientos") {
      const field = document.querySelector(`[name="${key}"]`)
      if (field) {
        field.value = data[key]
      }
    }
  })

  // Populate follow-ups
  if (data.seguimientos && data.seguimientos.length > 0) {
    // Clear existing follow-ups
    document.getElementById("seguimientos-list").innerHTML = ""
    followUpCounter = 0

    // Add saved follow-ups
    data.seguimientos.forEach((seguimiento) => {
      addFollowUp()
      const currentId = followUpCounter

      document.getElementById(`fecha-cita-${currentId}`).value = seguimiento.fechaCita || ""
      document.getElementById(`peso-seguimiento-${currentId}`).value = seguimiento.pesoSeguimiento || ""
      document.getElementById(`cumplimiento-${currentId}`).value = seguimiento.cumplimiento || ""
      document.getElementById(`notas-progreso-${currentId}`).value = seguimiento.notasProgreso || ""
      document.getElementById(`ajustes-plan-${currentId}`).value = seguimiento.ajustesPlan || ""
      document.getElementById(`proxima-cita-${currentId}`).value = seguimiento.proximaCita || ""
    })
  }

  // Recalculate computed fields
  calculateAge()
  calculateIMC()
  calculateWHR()
}

function exportRecord() {
  const data = collectFormData()

  if (!data.nombreCompleto) {
    showModal("Datos Incompletos", "Por favor ingrese al menos el nombre del paciente antes de exportar.", () =>
      closeModal(),
    )
    return
  }

  // Create a formatted text version for export
  let exportText = `EXPEDIENTE DEL PACIENTE - VITALINK\n`
  exportText += `${"=".repeat(50)}\n\n`

  // Patient basic info
  exportText += `DATOS GENERALES\n`
  exportText += `Nombre: ${data.nombreCompleto || "N/A"}\n`
  exportText += `Fecha de Nacimiento: ${data.fechaNacimiento || "N/A"}\n`
  exportText += `Edad: ${data.edad || "N/A"} años\n`
  exportText += `Género: ${data.genero || "N/A"}\n`
  exportText += `Teléfono: ${data.telefono || "N/A"}\n`
  exportText += `Email: ${data.email || "N/A"}\n\n`

  // Medical history
  exportText += `ANTECEDENTES MÉDICOS\n`
  exportText += `Enfermedades Crónicas: ${data.enfermedadesCronicas || "Ninguna reportada"}\n`
  exportText += `Alergias: ${data.alergias || "Ninguna reportada"}\n`
  exportText += `Medicamentos Actuales: ${data.tratamientos || "Ninguno reportado"}\n\n`

  // Anthropometric data
  exportText += `EVALUACIÓN ANTROPOMÉTRICA\n`
  exportText += `Peso: ${data.pesoActual || "N/A"} kg\n`
  exportText += `Talla: ${data.talla || "N/A"} cm\n`
  exportText += `IMC: ${data.imc || "N/A"}\n`
  exportText += `Perímetro Abdominal: ${data.perimetroAbdominal || "N/A"} cm\n\n`

  // Nutritional plan
  exportText += `PLAN NUTRICIONAL\n`
  exportText += `Objetivos: ${data.objetivosNutricionales || "No especificados"}\n`
  exportText += `Calorías Diarias: ${data.ingestaCalorica || "N/A"} kcal\n`
  exportText += `Plan de Comidas:\n${data.planComidas || "No especificado"}\n\n`

  // Follow-ups
  if (data.seguimientos && data.seguimientos.length > 0) {
    exportText += `SEGUIMIENTOS\n`
    data.seguimientos.forEach((seg, index) => {
      exportText += `Seguimiento ${index + 1}:\n`
      exportText += `  Fecha: ${seg.fechaCita}\n`
      exportText += `  Peso: ${seg.pesoSeguimiento} kg\n`
      exportText += `  Cumplimiento: ${seg.cumplimiento}\n`
      exportText += `  Notas: ${seg.notasProgreso}\n\n`
    })
  }

  exportText += `\nExportado el: ${new Date().toLocaleString()}\n`

  // Create and download file
  const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `expediente_${data.nombreCompleto?.replace(/\s+/g, "_") || "paciente"}_${new Date().toISOString().split("T")[0]}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)

  showModal("Exportación Exitosa", "El expediente ha sido exportado correctamente.", () => closeModal())
}

// Modal functionality
function showModal(title, message, confirmCallback) {
  document.getElementById("modal-title").textContent = title
  document.getElementById("modal-message").textContent = message
  document.getElementById("modal").style.display = "block"

  const confirmBtn = document.getElementById("modal-confirm")
  confirmBtn.onclick = confirmCallback
}

function closeModal() {
  document.getElementById("modal").style.display = "none"
}

// Keyboard shortcuts
document.addEventListener("keydown", (event) => {
  // Ctrl+S to save
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault()
    saveRecord()
  }

  // Escape to close modal
  if (event.key === "Escape") {
    closeModal()
  }
})

// Auto-save functionality
let autoSaveTimer
function setupAutoSave() {
  const form = document.getElementById("patient-record-form")

  form.addEventListener("input", () => {
    clearTimeout(autoSaveTimer)
    autoSaveTimer = setTimeout(() => {
      const data = collectFormData()
      localStorage.setItem("vitalink-patient-record-autosave", JSON.stringify(data))
    }, 2000) // Auto-save after 2 seconds of inactivity
  })
}

// Initialize auto-save
setupAutoSave()

// Print functionality
function printRecord() {
  window.print()
}

// Add print button to header actions
document.addEventListener("DOMContentLoaded", () => {
  const headerActions = document.querySelector(".header-actions")
  const printBtn = document.createElement("button")
  printBtn.className = "btn btn-secondary"
  printBtn.innerHTML = '<i class="fas fa-print"></i> Imprimir'
  printBtn.onclick = printRecord
  headerActions.insertBefore(printBtn, headerActions.firstChild)
})

// Utility functions
function formatDate(dateString) {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES")
}

function validateNumericInput(input, min = 0, max = null) {
  const value = Number.parseFloat(input.value)
  if (isNaN(value) || value < min || (max !== null && value > max)) {
    showFieldError(input, `Ingrese un valor válido entre ${min} y ${max || "∞"}`)
    return false
  }
  clearFieldError(input)
  return true
}

// Add input validation for numeric fields
document.addEventListener("DOMContentLoaded", () => {
  const numericFields = document.querySelectorAll('input[type="number"]')

  numericFields.forEach((field) => {
    field.addEventListener("blur", () => {
      const min = Number.parseFloat(field.getAttribute("min")) || 0
      const max = Number.parseFloat(field.getAttribute("max")) || null
      validateNumericInput(field, min, max)
    })
  })
})
