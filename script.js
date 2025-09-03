// Cart functionality
let cart = []
let cartTotal = 0

// DOM elements
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const desktopMenuBtn = document.getElementById("desktopMenuBtn")
const sidebar = document.getElementById("sidebar")
const sidebarOverlay = document.getElementById("sidebarOverlay")
const closeSidebar = document.getElementById("closeSidebar")
const cartBtn = document.getElementById("cartBtn")
const cartSidebar = document.getElementById("cartSidebar")
const closeCart = document.getElementById("closeCart")
const cartCount = document.getElementById("cartCount")
const cartItems = document.getElementById("cartItems")
const cartFooter = document.getElementById("cartFooter")
const emptyCart = document.getElementById("emptyCart")
const cartTotalElement = document.getElementById("cartTotal")
const placeOrderBtn = document.getElementById("placeOrderBtn")
const orderModal = document.getElementById("orderModal")
const closeOrderModal = document.getElementById("closeOrderModal")

// Sidebar functionality
function openSidebar() {
  sidebar.classList.remove("-translate-x-full")
  sidebarOverlay.classList.remove("hidden")
  document.body.style.overflow = "hidden"
}

function closeSidebarFunc() {
  sidebar.classList.add("-translate-x-full")
  sidebarOverlay.classList.add("hidden")
  document.body.style.overflow = "auto"
}

function openCart() {
  cartSidebar.classList.remove("translate-x-full")
  sidebarOverlay.classList.remove("hidden")
  document.body.style.overflow = "hidden"
}

function closeCartFunc() {
  cartSidebar.classList.add("translate-x-full")
  sidebarOverlay.classList.add("hidden")
  document.body.style.overflow = "auto"
}

// Event listeners for sidebar
mobileMenuBtn.addEventListener("click", openSidebar)
desktopMenuBtn.addEventListener("click", openSidebar)
closeSidebar.addEventListener("click", closeSidebarFunc)
sidebarOverlay.addEventListener("click", () => {
  closeSidebarFunc()
  closeCartFunc()
})

// Event listeners for cart
cartBtn.addEventListener("click", openCart)
closeCart.addEventListener("click", closeCartFunc)

// Floating bag button
const floatingBagBtn = document.getElementById("floatingBagBtn")
if (floatingBagBtn) {
  floatingBagBtn.addEventListener("click", openCart)
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("increase-btn") || e.target.closest(".increase-btn")) {
    e.preventDefault()
    const button = e.target.classList.contains("increase-btn") ? e.target : e.target.closest(".increase-btn")
    const productId = button.getAttribute("data-id")
    const existingItem = cart.find((item) => item.id === productId)

    if (existingItem) {
      updateQuantity(productId, existingItem.quantity + 1)
    }
  }

  if (e.target.classList.contains("decrease-btn") || e.target.closest(".decrease-btn")) {
    e.preventDefault()
    const button = e.target.classList.contains("decrease-btn") ? e.target : e.target.closest(".decrease-btn")
    const productId = button.getAttribute("data-id")
    const existingItem = cart.find((item) => item.id === productId)

    if (existingItem && existingItem.quantity > 0) {
      updateQuantity(productId, existingItem.quantity - 1)
    }
  }
})

// Dropdown functionality
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("dropdown-toggle") || e.target.closest(".dropdown-toggle")) {
    e.preventDefault()

    const button = e.target.classList.contains("dropdown-toggle") ? e.target : e.target.closest(".dropdown-toggle")
    const targetId = button.getAttribute("data-target")
    const dropdown = document.getElementById(targetId)
    const arrow = button.querySelector(".dropdown-arrow")

    if (dropdown.classList.contains("open")) {
      dropdown.classList.remove("open")
      arrow.style.transform = "rotate(0deg)"
    } else {
      // Close all other dropdowns
      document.querySelectorAll(".dropdown-menu.open").forEach((menu) => {
        menu.classList.remove("open")
        const parentButton = document.querySelector(`[data-target="${menu.id}"]`)
        if (parentButton) {
          const parentArrow = parentButton.querySelector(".dropdown-arrow")
          if (parentArrow) {
            parentArrow.style.transform = "rotate(0deg)"
          }
        }
      })

      dropdown.classList.add("open")
      arrow.style.transform = "rotate(90deg)"
    }
  }
})

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      ...product,
      quantity: 1,
    })
  }

  updateCartUI()
  updateCartCount()
  updateProductQuantityDisplays()

  // Add bounce animation to cart count
  cartCount.classList.add("cart-badge")
  setTimeout(() => {
    cartCount.classList.remove("cart-badge")
  }, 500)
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCartUI()
  updateCartCount()
  updateProductQuantityDisplays()
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId)
    return
  }

  const item = cart.find((item) => item.id === productId)
  if (item) {
    item.quantity = newQuantity
    updateCartUI()
    updateCartCount()
    updateProductQuantityDisplays()
  }
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems

  // Update floating bag
  const floatingBag = document.getElementById("floatingBag")
  const floatingBagCount = document.getElementById("floatingBagCount")
  const floatingBagTotal = document.getElementById("floatingBagTotal")
  const cartItemCount = document.getElementById("cartItemCount")

  if (totalItems > 0) {
    floatingBag.classList.remove("hidden")
    floatingBagCount.textContent = `${totalItems} ITEM${totalItems > 1 ? "S" : ""}`
    cartItemCount.textContent = `${totalItems} ITEM${totalItems > 1 ? "S" : ""}`

    // Update floating bag total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    floatingBagTotal.textContent = total
  } else {
    floatingBag.classList.add("hidden")
  }
}

function updateCartUI() {
  cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<div id="emptyCart" class="text-center py-8"><i class="fas fa-shopping-cart text-gray-300 text-4xl mb-4"></i><p class="text-gray-500">Your cart is empty</p></div>'
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
      <div class="p-4 border-b flex items-center space-x-3">
        <div class="flex flex-col items-center">
          <span class="text-lg font-bold">${item.quantity}</span>
          <div class="flex flex-col space-y-1 mt-1">
            <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" class="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300">
              <i class="fas fa-chevron-up text-xs"></i>
            </button>
            <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" class="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300">
              <i class="fas fa-chevron-down text-xs"></i>
            </button>
          </div>
        </div>
        
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-contain rounded">
        
        <div class="flex-1">
          <h4 class="font-medium text-sm text-gray-800">${item.name}</h4>
          <p class="text-xs text-gray-500 mt-1">৳${item.price}/ piece</p>
        </div>
        
        <div class="text-right">
          <p class="font-bold text-lg">৳ ${item.price * item.quantity}</p>
          <button onclick="removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-500 mt-1">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `,
      )
      .join("")
  }

  cartTotalElement.textContent = `৳ ${cartTotal}`
}

function updateProductQuantityDisplays() {
  // Update products in cart
  cart.forEach((item) => {
    const productControls = document.querySelector(`.product-controls[data-id="${item.id}"]`)
    if (productControls) {
      const addButton = productControls.querySelector(".add-to-cart")
      const quantityControls = productControls.querySelector(".quantity-controls")
      const quantityDisplay = productControls.querySelector(".quantity-display")

      addButton.classList.add("hidden")
      quantityControls.classList.remove("hidden")
      quantityDisplay.textContent = item.quantity
    }
  })

  // Reset products not in cart
  document.querySelectorAll(".product-controls").forEach((control) => {
    const productId = control.getAttribute("data-id")
    const inCart = cart.find((item) => item.id === productId)

    if (!inCart) {
      const addButton = control.querySelector(".add-to-cart")
      const quantityControls = control.querySelector(".quantity-controls")

      addButton.classList.remove("hidden")
      quantityControls.classList.add("hidden")
    }
  })
}

// Add to cart button event listener
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart") || e.target.closest(".add-to-cart")) {
    e.preventDefault()

    const button = e.target.classList.contains("add-to-cart") ? e.target : e.target.closest(".add-to-cart")

    const product = {
      id: button.getAttribute("data-id"),
      name: button.getAttribute("data-name"),
      price: Number.parseInt(button.getAttribute("data-price")),
      image: button.getAttribute("data-image"),
    }

    addToCart(product)

    // Visual feedback
    const originalHTML = button.innerHTML
    button.innerHTML = '<i class="fas fa-check mr-2"></i>Added!'
    button.classList.add("bg-green-500", "hover:bg-green-600")
    button.classList.remove("bg-red-500", "hover:bg-red-600")

    setTimeout(() => {
      button.innerHTML = originalHTML
      button.classList.remove("bg-green-500", "hover:bg-green-600")
      button.classList.add("bg-red-500", "hover:bg-red-600")
    }, 1000)
  }
})

placeOrderBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!")
    return
  }

  // Show order confirmation modal
  document.getElementById("modalOrderTotal").textContent = `৳ ${cartTotal}`
  orderModal.classList.remove("hidden")

  // Clear cart after order
  setTimeout(() => {
    cart = []
    cartTotal = 0
    updateCartUI()
    updateCartCount()
    updateProductQuantityDisplays()
    closeCartFunc()
  }, 2000)
})

// Close order modal
closeOrderModal.addEventListener("click", () => {
  orderModal.classList.add("hidden")
})

// Close modal when clicking outside
orderModal.addEventListener("click", (e) => {
  if (e.target === orderModal) {
    orderModal.classList.add("hidden")
  }
})

// Close sidebar when clicking on links (mobile)
document.querySelectorAll("#sidebar a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      closeSidebarFunc()
    }
  })
})

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    closeSidebarFunc()
    closeCartFunc()
  }
})

// Initialize
updateCartCount()
updateProductQuantityDisplays()
