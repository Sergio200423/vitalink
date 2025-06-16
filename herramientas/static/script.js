// VitaLink JavaScript Functionality

// DOM Elements
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")
const contactForm = document.getElementById("contactForm")
const categoryButtons = document.querySelectorAll(".category-btn")
const productCards = document.querySelectorAll(".product-card")

// Navigation Toggle
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  navToggle.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
  })
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const headerOffset = 80
      const elementPosition = target.offsetTop
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Product Category Filter
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    categoryButtons.forEach((btn) => btn.classList.remove("active"))
    // Add active class to clicked button
    button.classList.add("active")

    const category = button.getAttribute("data-category")

    // Filter products
    productCards.forEach((card) => {
      if (category === "all" || card.getAttribute("data-category") === category) {
        card.style.display = "block"
        card.style.animation = "fadeInUp 0.5s ease-out"
      } else {
        card.style.display = "none"
      }
    })
  })
})

// Testimonials Slider
let currentTestimonialIndex = 0
const testimonialCards = document.querySelectorAll(".testimonial-card")
const testimonialDots = document.querySelectorAll(".dot")

function showTestimonial(index) {
  // Hide all testimonials
  testimonialCards.forEach((card) => card.classList.remove("active"))
  testimonialDots.forEach((dot) => dot.classList.remove("active"))

  // Show selected testimonial
  if (testimonialCards[index]) {
    testimonialCards[index].classList.add("active")
    testimonialDots[index].classList.add("active")
  }
}

function changeTestimonial(direction) {
  currentTestimonialIndex += direction

  if (currentTestimonialIndex >= testimonialCards.length) {
    currentTestimonialIndex = 0
  } else if (currentTestimonialIndex < 0) {
    currentTestimonialIndex = testimonialCards.length - 1
  }

  showTestimonial(currentTestimonialIndex)
}

function currentTestimonial(index) {
  currentTestimonialIndex = index - 1
  showTestimonial(currentTestimonialIndex)
}

// Auto-advance testimonials
setInterval(() => {
  changeTestimonial(1)
}, 5000)

// Contact Form Handling
contactForm.addEventListener("submit", function (e) {
  e.preventDefault()

  // Get form data
  const formData = new FormData(this)
  const formObject = {}
  formData.forEach((value, key) => {
    formObject[key] = value
  })

  // Validate form
  if (validateForm(formObject)) {
    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]')
    const originalText = submitButton.textContent
    submitButton.textContent = "Enviando..."
    submitButton.disabled = true

    // Simulate form submission
    setTimeout(() => {
      showNotification("¡Mensaje enviado exitosamente! Te contactaremos pronto.", "success")
      this.reset()
      submitButton.textContent = originalText
      submitButton.disabled = false
    }, 2000)
  }
})

// Form Validation
function validateForm(data) {
  const errors = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres")
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Por favor ingresa un email válido")
  }

  if (!data.subject) {
    errors.push("Por favor selecciona un tema")
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("El mensaje debe tener al menos 10 caracteres")
  }

  if (errors.length > 0) {
    showNotification(errors.join("\n"), "error")
    return false
  }

  return true
}

// Email Validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `

  // Add notification styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === "success" ? "var(--primary-green)" : type === "error" ? "var(--accent-red)" : "var(--accent-orange)"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `

  // Add to document
  document.body.appendChild(notification)

  // Close button functionality
  const closeButton = notification.querySelector(".notification-close")
  closeButton.addEventListener("click", () => {
    notification.style.animation = "slideOutRight 0.3s ease-out"
    setTimeout(() => notification.remove(), 300)
  })

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOutRight 0.3s ease-out"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

// Add notification animations to CSS
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`
document.head.appendChild(notificationStyles)

// Scroll Animations
function animateOnScroll() {
  const elements = document.querySelectorAll(".service-card, .product-card, .nutritionist-card, .testimonial-card")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up")
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  elements.forEach((element) => {
    observer.observe(element)
  })
}

// Header Scroll Effect
function handleHeaderScroll() {
  const header = document.querySelector(".header")
  let lastScrollTop = 0

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > 100) {
      header.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
      header.style.backdropFilter = "blur(10px)"
    } else {
      header.style.backgroundColor = "var(--white)"
      header.style.backdropFilter = "none"
    }

    // Hide/show header on scroll
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      header.style.transform = "translateY(-100%)"
    } else {
      header.style.transform = "translateY(0)"
    }

    lastScrollTop = scrollTop
  })
}

// Loading Screen
function showLoadingScreen() {
  const loadingScreen = document.createElement("div")
  loadingScreen.id = "loading-screen"
  loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <h2>VitaLink</h2>
                <span>Conectando Vida y Bienestar</span>
            </div>
            <div class="loading-spinner"></div>
        </div>
    `

  loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, var(--light-green), rgba(255, 193, 7, 0.1));
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        transition: opacity 0.5s ease;
    `

  document.body.appendChild(loadingScreen)

  // Remove loading screen after page load
  window.addEventListener("load", () => {
    setTimeout(() => {
      loadingScreen.style.opacity = "0"
      setTimeout(() => {
        if (loadingScreen.parentNode) {
          loadingScreen.remove()
        }
      }, 500)
    }, 1000)
  })
}

// Shopping Cart Functionality
const cart = JSON.parse(localStorage.getItem("vitalink-cart")) || []

function addToCart(productId, productName, price, image) {
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: price,
      image: image,
      quantity: 1,
    })
  }

  localStorage.setItem("vitalink-cart", JSON.stringify(cart))
  updateCartUI()
  showNotification(`${productName} agregado al carrito`, "success")
}

function updateCartUI() {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartBadge = document.querySelector(".cart-badge")

  if (cartBadge) {
    cartBadge.textContent = cartCount
    cartBadge.style.display = cartCount > 0 ? "block" : "none"
  }
}

// Add event listeners to "Add to Cart" buttons
document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".btn-primary.btn-small")

  addToCartButtons.forEach((button, index) => {
    if (button.textContent.includes("Agregar al Carrito")) {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        const productCard = button.closest(".product-card")
        const productName = productCard.querySelector("h4").textContent
        const productPrice = productCard.querySelector(".current-price").textContent
        const productImage = productCard.querySelector("img").src

        addToCart(`product-${index}`, productName, productPrice, productImage)
      })
    }
  })
})

// Search Functionality
function initializeSearch() {
  const searchInput = document.createElement("input")
  searchInput.type = "text"
  searchInput.placeholder = "Buscar productos, nutricionistas..."
  searchInput.className = "search-input"

  searchInput.style.cssText = `
        padding: 0.5rem 1rem;
        border: 2px solid var(--light-gray);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        width: 250px;
        transition: border-color 0.3s ease;
    `

  // Add search to navigation
  const navActions = document.querySelector(".nav-actions")
  if (navActions) {
    navActions.insertBefore(searchInput, navActions.firstChild)
  }

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase()

    // Search products
    const products = document.querySelectorAll(".product-card")
    products.forEach((product) => {
      const productName = product.querySelector("h4").textContent.toLowerCase()
      const productDescription = product.querySelector(".product-description").textContent.toLowerCase()

      if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
        product.style.display = "block"
      } else {
        product.style.display = searchTerm === "" ? "block" : "none"
      }
    })

    // Search nutritionists
    const nutritionists = document.querySelectorAll(".nutritionist-card")
    nutritionists.forEach((nutritionist) => {
      const name = nutritionist.querySelector("h4").textContent.toLowerCase()
      const specialization = nutritionist.querySelector(".specialization").textContent.toLowerCase()

      if (name.includes(searchTerm) || specialization.includes(searchTerm)) {
        nutritionist.style.display = "block"
      } else {
        nutritionist.style.display = searchTerm === "" ? "block" : "none"
      }
    })
  })
}

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Show loading screen
  showLoadingScreen()

  // Initialize features
  animateOnScroll()
  handleHeaderScroll()
  initializeSearch()
  updateCartUI()

  // Add smooth transitions to all interactive elements
  const interactiveElements = document.querySelectorAll("button, .card, .nav-link")
  interactiveElements.forEach((element) => {
    element.style.transition = "all 0.3s ease"
  })

  console.log("VitaLink website initialized successfully! 🌱")
})

// Accessibility improvements
document.addEventListener("keydown", (e) => {
  // Close mobile menu with Escape key
  if (e.key === "Escape" && navMenu.classList.contains("active")) {
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
  }

  // Navigate testimonials with arrow keys
  if (document.activeElement.closest(".testimonials")) {
    if (e.key === "ArrowLeft") {
      changeTestimonial(-1)
    } else if (e.key === "ArrowRight") {
      changeTestimonial(1)
    }
  }
})

// Performance optimization
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute("data-src")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("VitaLink Error:", e.error)
  showNotification("Ha ocurrido un error. Por favor recarga la página.", "error")
})

// Service Worker registration for PWA capabilities
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
