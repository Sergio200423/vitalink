// Authentication JavaScript

// DOM Elements
const loginForm = document.getElementById("loginForm")
const registerForm = document.getElementById("registerForm")
const userTypeOptions = document.querySelectorAll(".user-type-option")
const nutritionistFields = document.querySelector(".nutritionist-fields")
const passwordInputs = document.querySelectorAll('input[type="password"]')

// Initialize authentication functionality
document.addEventListener("DOMContentLoaded", () => {
  initializeUserTypeSelection()
  initializePasswordStrength()
  initializeFormValidation()
  initializeSocialLogin()
})

// User Type Selection
function initializeUserTypeSelection() {
  userTypeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Remove active class from all options
      userTypeOptions.forEach((opt) => opt.classList.remove("active"))
      // Add active class to clicked option
      option.classList.add("active")
      // Check the radio button
      const radio = option.querySelector('input[type="radio"]')
      radio.checked = true

      // Show/hide nutritionist fields
      if (nutritionistFields) {
        if (radio.value === "nutritionist") {
          nutritionistFields.style.display = "flex"
          // Make nutritionist fields required
          nutritionistFields.querySelectorAll("input, select").forEach((field) => {
            field.required = true
          })
        } else {
          nutritionistFields.style.display = "none"
          // Remove required from nutritionist fields
          nutritionistFields.querySelectorAll("input, select").forEach((field) => {
            field.required = false
          })
        }
      }
    })
  })
}

// Password Toggle Functionality
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const toggle = input.parentElement.querySelector(".password-toggle i")

  if (input.type === "password") {
    input.type = "text"
    toggle.classList.remove("fa-eye")
    toggle.classList.add("fa-eye-slash")
  } else {
    input.type = "password"
    toggle.classList.remove("fa-eye-slash")
    toggle.classList.add("fa-eye")
  }
}

// Password Strength Checker
function initializePasswordStrength() {
  const passwordInput = document.getElementById("registerPassword")
  if (!passwordInput) return

  const strengthBar = document.querySelector(".strength-fill")
  const strengthText = document.querySelector(".strength-text")

  passwordInput.addEventListener("input", (e) => {
    const password = e.target.value
    const strength = calculatePasswordStrength(password)

    // Update strength bar
    strengthBar.style.width = `${strength.percentage}%`
    strengthBar.style.backgroundColor = strength.color
    strengthText.textContent = strength.text
  })
}

function calculatePasswordStrength(password) {
  let score = 0
  const feedback = []

  // Length check
  if (password.length >= 8) score += 25
  else feedback.push("mínimo 8 caracteres")

  // Uppercase check
  if (/[A-Z]/.test(password)) score += 25
  else feedback.push("una mayúscula")

  // Lowercase check
  if (/[a-z]/.test(password)) score += 25
  else feedback.push("una minúscula")

  // Number or special character check
  if (/[\d\W]/.test(password)) score += 25
  else feedback.push("un número o símbolo")

  const strength = {
    percentage: score,
    color: "#ff5722",
    text: "Muy débil",
  }

  if (score >= 25 && score < 50) {
    strength.color = "#ff9800"
    strength.text = "Débil"
  } else if (score >= 50 && score < 75) {
    strength.color = "#ffc107"
    strength.text = "Regular"
  } else if (score >= 75 && score < 100) {
    strength.color = "#4caf50"
    strength.text = "Fuerte"
  } else if (score === 100) {
    strength.color = "#2e7d32"
    strength.text = "Muy fuerte"
  }

  if (feedback.length > 0 && password.length > 0) {
    strength.text += ` (falta: ${feedback.join(", ")})`
  }

  return strength
}

// Form Validation
function initializeFormValidation() {
  // Login Form
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit)
  }

  // Register Form
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegisterSubmit)

    // Real-time validation
    const inputs = registerForm.querySelectorAll("input")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input))
      input.addEventListener("input", () => clearFieldError(input))
    })
  }
}

function handleLoginSubmit(e) {
  e.preventDefault()

  const formData = new FormData(loginForm)
  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
    remember: formData.get("remember"),
  }

  // Validate login data
  if (!validateLoginData(loginData)) {
    return
  }

  // Show loading state
  setFormLoading(loginForm, true)

  // Simulate login API call
  setTimeout(() => {
    // Simulate successful login
    showNotification("¡Inicio de sesión exitoso! Redirigiendo...", "success")

    setTimeout(() => {
      // Redirect to dashboard or home page
      window.location.href = "index.html"
    }, 1500)
  }, 2000)
}

function handleRegisterSubmit(e) {
  e.preventDefault()

  const formData = new FormData(registerForm)
  const registerData = {
    userType: formData.get("userType"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    license: formData.get("license"),
    specialization: formData.get("specialization"),
    terms: formData.get("terms"),
    newsletter: formData.get("newsletter"),
  }

  // Validate registration data
  if (!validateRegisterData(registerData)) {
    return
  }

  // Show loading state
  setFormLoading(registerForm, true)

  // Simulate registration API call
  setTimeout(() => {
    // Simulate successful registration
    showNotification("¡Cuenta creada exitosamente! Verifica tu email para activar tu cuenta.", "success")

    setTimeout(() => {
      // Redirect to login page
      window.location.href = "/inicioSesion/"
    }, 2000)
  }, 2500)
}

// Validation Functions
function validateLoginData(data) {
  const errors = []

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Email inválido")
    setFieldError(document.getElementById("email"), "Ingresa un email válido")
  }

  if (!data.password || data.password.length < 6) {
    errors.push("Contraseña muy corta")
    setFieldError(document.getElementById("password"), "La contraseña debe tener al menos 6 caracteres")
  }

  return errors.length === 0
}

function validateRegisterData(data) {
  const errors = []

  // Name validation
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push("Nombre inválido")
    setFieldError(document.getElementById("firstName"), "El nombre debe tener al menos 2 caracteres")
  }

  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.push("Apellido inválido")
    setFieldError(document.getElementById("lastName"), "El apellido debe tener al menos 2 caracteres")
  }

  // Email validation
  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Email inválido")
    setFieldError(document.getElementById("registerEmail"), "Ingresa un email válido")
  }

  // Phone validation
  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push("Teléfono inválido")
    setFieldError(document.getElementById("phone"), "Ingresa un número de teléfono válido")
  }

  // Password validation
  if (!data.password || data.password.length < 8) {
    errors.push("Contraseña muy corta")
    setFieldError(document.getElementById("registerPassword"), "La contraseña debe tener al menos 8 caracteres")
  }

  // Confirm password validation
  if (data.password !== data.confirmPassword) {
    errors.push("Las contraseñas no coinciden")
    setFieldError(document.getElementById("confirmPassword"), "Las contraseñas no coinciden")
  }

  // Nutritionist specific validation
  if (data.userType === "nutritionist") {
    if (!data.license || data.license.trim().length < 3) {
      errors.push("Número de licencia inválido")
      setFieldError(document.getElementById("license"), "Ingresa un número de licencia válido")
    }

    if (!data.specialization) {
      errors.push("Especialización requerida")
      setFieldError(document.getElementById("specialization"), "Selecciona tu especialización")
    }
  }

  // Terms validation
  if (!data.terms) {
    errors.push("Debes aceptar los términos y condiciones")
    showNotification("Debes aceptar los términos y condiciones para continuar", "error")
  }

  return errors.length === 0
}

function validateField(field) {
  const value = field.value.trim()
  let isValid = true

  switch (field.type) {
    case "email":
      isValid = isValidEmail(value)
      if (!isValid) setFieldError(field, "Ingresa un email válido")
      break

    case "tel":
      isValid = isValidPhone(value)
      if (!isValid) setFieldError(field, "Ingresa un número de teléfono válido")
      break

    case "password":
      isValid = value.length >= 8
      if (!isValid) setFieldError(field, "La contraseña debe tener al menos 8 caracteres")
      break

    case "text":
      isValid = value.length >= 2
      if (!isValid) setFieldError(field, "Este campo debe tener al menos 2 caracteres")
      break
  }

  if (isValid) {
    clearFieldError(field)
  }

  return isValid
}

// Utility Functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone) {
  const phoneRegex = /^[+]?[\d\s\-$$$$]{8,}$/
  return phoneRegex.test(phone)
}

function setFieldError(field, message) {
  clearFieldError(field)

  field.classList.add("form-error")
  const errorDiv = document.createElement("div")
  errorDiv.className = "error-message"
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`

  field.parentElement.parentElement.appendChild(errorDiv)
}

function clearFieldError(field) {
  field.classList.remove("form-error")
  const errorMessage = field.parentElement.parentElement.querySelector(".error-message")
  if (errorMessage) {
    errorMessage.remove()
  }
}

function setFormLoading(form, loading) {
  if (loading) {
    form.classList.add("form-loading")
  } else {
    form.classList.remove("form-loading")
  }
}

// Social Login
function initializeSocialLogin() {
  const socialButtons = document.querySelectorAll(".social-btn")

  socialButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const provider = button.classList.contains("google-btn") ? "Google" : "Facebook"

      showNotification(`Redirigiendo a ${provider}...`, "info")

      // Simulate social login redirect
      setTimeout(() => {
        showNotification(`Función de ${provider} estará disponible próximamente`, "info")
      }, 1500)
    })
  })
}

// Notification System (reuse from main script)
function showNotification(message, type = "info") {
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${
          type === "success" ? "var(--primary-green)" : type === "error" ? "var(--accent-red)" : "var(--accent-orange)"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `

  document.body.appendChild(notification)

  const closeButton = notification.querySelector(".notification-close")
  closeButton.addEventListener("click", () => {
    notification.style.animation = "slideOutRight 0.3s ease-out"
    setTimeout(() => notification.remove(), 300)
  })

  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOutRight 0.3s ease-out"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  // Enter key on user type options
  if (e.key === "Enter" && e.target.closest(".user-type-option")) {
    e.target.closest(".user-type-option").click()
  }

  // Escape key to clear notifications
  if (e.key === "Escape") {
    const notification = document.querySelector(".notification")
    if (notification) {
      notification.querySelector(".notification-close").click()
    }
  }
})

// Auto-fill detection and styling
function detectAutoFill() {
  const inputs = document.querySelectorAll("input")

  inputs.forEach((input) => {
    // Check for autofill on page load
    setTimeout(() => {
      if (input.value) {
        input.classList.add("has-value")
      }
    }, 100)

    // Check for autofill on input change
    input.addEventListener("input", () => {
      if (input.value) {
        input.classList.add("has-value")
      } else {
        input.classList.remove("has-value")
      }
    })
  })
}

// Initialize autofill detection
document.addEventListener("DOMContentLoaded", detectAutoFill)

// Form Analytics (for future implementation)
function trackFormInteraction(action, formType, field = null) {
  // This would integrate with analytics services
  console.log(`Form Analytics: ${action} on ${formType}`, field ? `field: ${field}` : "")
}

// Track form starts
document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    const formType = form.id === "loginForm" ? "login" : "register"

    form.addEventListener("focusin", () => {
      trackFormInteraction("form_start", formType)
    })

    form.querySelectorAll("input").forEach((input) => {
      input.addEventListener("focus", () => {
        trackFormInteraction("field_focus", formType, input.name)
      })
    })
  })
})

console.log("VitaLink Authentication system initialized! 🔐")
