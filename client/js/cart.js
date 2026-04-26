// =============================================
// cart.js — Cart System JavaScript File
// Handles all cart operations
// =============================================


// =============================================
// LOAD CART FROM LOCALSTORAGE
// =============================================
function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const emptyCart = document.getElementById('emptyCart');
  const cartContent = document.getElementById('cartContent');
  const cartItemCount = document.getElementById('cartItemCount');

  // Calculate total items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update item count in heading
  if (cartItemCount) {
    cartItemCount.textContent = `(${totalItems} items)`;
  }

  // Update navbar cart count
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
  }

  // If cart is empty — show empty message
  if (cart.length === 0) {
    if (emptyCart) emptyCart.classList.remove('hidden');
    if (cartContent) cartContent.classList.add('hidden');
    return;
  }

  // Show cart content
  if (emptyCart) emptyCart.classList.add('hidden');
  if (cartContent) cartContent.classList.remove('hidden');

  // Render cart items
  renderCartItems(cart);

  // Calculate and show totals
  calculateTotal(cart);
}


// =============================================
// RENDER CART ITEMS
// =============================================
function renderCartItems(cart) {
  const cartItemsList = document.getElementById('cartItemsList');
  if (!cartItemsList) return;

  cartItemsList.innerHTML = cart.map(item => `
    <div class="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4">

      <!-- Product Image -->
      <img
        src="${item.image}"
        alt="${item.title}"
        class="w-20 h-20 object-cover rounded-xl flex-shrink-0"
        onerror="this.src='https://via.placeholder.com/80?text=No+Image'"
      />

      <!-- Product Details -->
      <div class="flex-1 min-w-0">

        <!-- Title -->
        <h3 class="font-semibold text-gray-800 text-sm truncate">
          ${item.title}
        </h3>

        <!-- Price per item -->
        <p class="text-purple-600 font-bold mt-1">
          ৳${item.price.toLocaleString()} each
        </p>

        <!-- Quantity Controls -->
        <div class="flex items-center space-x-3 mt-2">

          <!-- Decrease Button -->
          <button
            onclick="updateQuantity('${item.id}', -1)"
            class="w-7 h-7 bg-gray-100 hover:bg-red-100 rounded-full text-gray-600 hover:text-red-600 font-bold flex items-center justify-center transition">
            <i class="fa-solid fa-minus text-xs"></i>
          </button>

          <!-- Quantity Number -->
          <span class="font-semibold text-gray-700 w-6 text-center">
            ${item.quantity}
          </span>

          <!-- Increase Button -->
          <button
            onclick="updateQuantity('${item.id}', 1)"
            class="w-7 h-7 bg-gray-100 hover:bg-green-100 rounded-full text-gray-600 hover:text-green-600 font-bold flex items-center justify-center transition">
            <i class="fa-solid fa-plus text-xs"></i>
          </button>

        </div>
      </div>

      <!-- Item Total & Remove -->
      <div class="text-right flex-shrink-0">

        <!-- Item Total Price -->
        <p class="font-bold text-gray-800 text-sm">
          ৳${(item.price * item.quantity).toLocaleString()}
        </p>

        <!-- Remove Button -->
        <button
          onclick="removeFromCart('${item.id}')"
          class="text-red-400 hover:text-red-600 text-xs mt-2 transition flex items-center">
          <i class="fa-solid fa-trash mr-1"></i>Remove
        </button>

      </div>
    </div>
  `).join('');
}


// =============================================
// CALCULATE TOTAL PRICE
// =============================================
function calculateTotal(cart) {
  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Update subtotal display
  const subtotalEl = document.getElementById('subtotal');
  if (subtotalEl) {
    subtotalEl.textContent = `৳${subtotal.toLocaleString()}`;
  }

  // Update total display
  const totalEl = document.getElementById('totalPrice');
  if (totalEl) {
    totalEl.textContent = `৳${subtotal.toLocaleString()}`;
  }
}


// =============================================
// UPDATE QUANTITY (INCREASE OR DECREASE)
// =============================================
function updateQuantity(id, change) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Find the item in cart
  const item = cart.find(item => item.id === id);

  if (item) {
    // Update quantity
    item.quantity += change;

    // If quantity reaches 0 — remove item
    if (item.quantity <= 0) {
      removeFromCart(id);
      return;
    }
  }

  // Save updated cart
  localStorage.setItem('cart', JSON.stringify(cart));

  // Reload cart display
  loadCart();
}


// =============================================
// REMOVE ITEM FROM CART
// =============================================
function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Remove item by filtering it out
  cart = cart.filter(item => item.id !== id);

  // Save updated cart
  localStorage.setItem('cart', JSON.stringify(cart));

  // Reload cart display
  loadCart();

  // Show notification
  showNotification('🗑️ Item removed from cart!', 'error');
}


// =============================================
// CLEAR ENTIRE CART
// =============================================
function clearCart() {
  localStorage.removeItem('cart');
  loadCart();
  showNotification('🗑️ Cart cleared!', 'error');
}


// =============================================
// CHECKOUT
// =============================================
function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Check if cart is empty
  if (cart.length === 0) {
    showNotification('❌ Your cart is empty!', 'error');
    return;
  }

  // Calculate total
  const total = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Show success message
  showNotification(`✅ Order placed! Total: ৳${total.toLocaleString()}`, 'success');

  // Clear cart after 2 seconds
  setTimeout(() => {
    localStorage.removeItem('cart');
    loadCart();
  }, 2000);
}


// =============================================
// SHOW NOTIFICATION
// =============================================
function showNotification(message, type = 'success') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500'
  };

  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-full shadow-lg z-50 text-sm font-medium`;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}


// =============================================
// CHECK LOGIN STATUS
// =============================================
function checkLoginStatus() {
  const user = JSON.parse(localStorage.getItem('user'));
  const loginBtn = document.getElementById('loginBtn');

  if (user && loginBtn) {
    loginBtn.innerHTML = `<i class="fa-solid fa-user mr-1"></i>${user.name}`;
  }
}


// =============================================
// RUN WHEN PAGE LOADS
// =============================================
window.onload = function () {
  loadCart();
  checkLoginStatus();
};