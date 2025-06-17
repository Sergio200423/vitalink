// Global variables
let waterCount = 0
let totalCalories = 0
const foodItems = []
const createdPlans = []

// Page navigation
function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll(".page")
  pages.forEach((page) => page.classList.remove("active"))

  // Show selected page
  document.getElementById(pageId).classList.add("active")

  // Update navigation links
  const links = document.querySelectorAll(".nav-links a")
  links.forEach((link) => link.classList.remove("active"))
  document.getElementById(pageId + "-link").classList.add("active")
}

// BMI Calculator
function calculateBMI() {
  const weight = Number.parseFloat(document.getElementById("weight").value)
  const height = Number.parseFloat(document.getElementById("height").value)

  if (!weight || !height) {
    alert("Por favor, ingresa peso y altura válidos")
    return
  }

  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  let category = ""
  if (bmi < 18.5) {
    category = "Bajo peso"
  } else if (bmi < 25) {
    category = "Peso normal"
  } else if (bmi < 30) {
    category = "Sobrepeso"
  } else {
    category = "Obesidad"
  }

  document.getElementById("bmi-value").textContent = bmi.toFixed(1)
  document.getElementById("bmi-category").textContent = category
  document.getElementById("bmi-result").style.display = "block"
}

// Plan Creator
function createPlan() {
  const name = document.getElementById("client-name").value
  const objective = document.getElementById("objective").value
  const calories = document.getElementById("daily-calories").value

  if (!name || !objective || !calories) {
    alert("Por favor, completa todos los campos")
    return
  }

  const plan = {
    name: name,
    objective: objective,
    calories: calories,
    date: new Date().toLocaleDateString(),
  }

  createdPlans.push(plan)
  displayPlans()

  // Clear form
  document.getElementById("client-name").value = ""
  document.getElementById("objective").value = ""
  document.getElementById("daily-calories").value = ""
}

function displayPlans() {
  const plansContainer = document.getElementById("created-plans")
  const noPlansMessage = document.getElementById("no-plans")

  if (createdPlans.length === 0) {
    noPlansMessage.style.display = "block"
    plansContainer.innerHTML = ""
    return
  }

  noPlansMessage.style.display = "none"
  plansContainer.innerHTML = createdPlans
    .map(
      (plan) => `
        <div style="background-color: var(--light-green); padding: var(--spacing-md); border-radius: var(--radius-md); margin-top: var(--spacing-md);">
            <div style="font-weight: 600; margin-bottom: var(--spacing-xs);">${plan.name}</div>
            <div style="font-size: var(--font-size-sm); color: var(--dark-gray);">
                Objetivo: ${plan.objective} | ${plan.calories} kcal/día | Creado: ${plan.date}
            </div>
        </div>
    `,
    )
    .join("")
}

// Water Tracker
function addWater() {
  if (waterCount < 8) {
    waterCount++
    updateWaterDisplay()
  }
}

function resetWater() {
  waterCount = 0
  updateWaterDisplay()
}

function updateWaterDisplay() {
  document.getElementById("water-count").textContent = `${waterCount}/8`
  const percentage = (waterCount / 8) * 100
  document.getElementById("water-bar").style.width = `${percentage}%`
}

// Calorie Counter
function addFood() {
  const foodName = document.getElementById("food-item").value
  const calories = Number.parseFloat(document.getElementById("calories").value)

  if (!foodName || !calories) {
    alert("Por favor, ingresa el alimento y las calorías")
    return
  }

  const foodItem = {
    name: foodName,
    calories: calories,
  }

  foodItems.push(foodItem)
  totalCalories += calories

  updateCalorieDisplay()

  // Clear form
  document.getElementById("food-item").value = ""
  document.getElementById("calories").value = ""
}

function updateCalorieDisplay() {
  document.getElementById("total-calories").textContent = `${totalCalories} kcal`

  const foodList = document.getElementById("food-list")
  foodList.innerHTML = foodItems
    .map(
      (item, index) => `
        <div style="display: flex; justify-content: space-between; padding: var(--spacing-sm); border-bottom: 1px solid var(--light-gray);">
            <span>${item.name}</span>
            <span>${item.calories} kcal</span>
        </div>
    `,
    )
    .join("")
}

// Weekly recommendation rotation
const recommendations = [
  {
    text: "Esta semana enfócate en aumentar tu consumo de agua. Intenta beber al menos 8 vasos de agua al día para mantener una hidratación óptima y mejorar tu metabolismo.",
    icon: "💧",
  },
  {
    text: "Incorpora más vegetales de hoja verde en tus comidas. Las espinacas, lechuga y kale son ricas en nutrientes esenciales y bajas en calorías.",
    icon: "🥬",
  },
  {
    text: "Dedica 30 minutos diarios a caminar. Es una excelente forma de ejercicio cardiovascular que puedes hacer en cualquier momento del día.",
    icon: "🚶‍♀️",
  },
  {
    text: "Practica la alimentación consciente: come despacio, mastica bien y disfruta cada bocado. Esto te ayudará a sentirte satisfecho con menos cantidad.",
    icon: "🧘‍♀️",
  },
]

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  // Set random weekly recommendation
  const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)]
  document.getElementById("weekly-recommendation").textContent = randomRecommendation.text
  document.querySelector(".recommendation-icon").textContent = randomRecommendation.icon

  // Update days count (simulate user progress)
  const startDate = new Date("2024-01-01")
  const today = new Date()
  const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24))
  document.getElementById("days-count").textContent = daysDiff
})
