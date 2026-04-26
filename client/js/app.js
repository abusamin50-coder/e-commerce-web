const API_URL = '/api';

async function loadProducts(category = '') {
  const spinner = document.getElementById('loadingSpinner');
  const grid = document.getElementById('productsGrid');
  const noProducts = document.getElementById('noProducts');

  spinner.classList.remove('hidden');
  grid.classList.add('hidden');
  noProducts.classList.add('hidden');

  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    spinner.classList.add('hidden');

    let products = data.products;
    if (category) products = products.filter(p => p.category === category);

    if (!products || products.length === 0) {
      noProducts.classList.remove('hidden');
      return;
    }

    grid.classList.remove('hidden');
    displayProducts(products);

  } catch (error) {
    spinner.classList.add('hidden');
    noProducts.classList.remove('hidden');
    console.error('❌ Error:', error.message);
  }
}

function displayProducts(products) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = products.map(product => `
    <div class="product-card bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
      <div class="relative overflow-hidden">
        <img
          src="${product.image}"
          alt="${product.title}"
          class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
        />
        <span class="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
          ${product.category || 'General'}
        </span>
        <span class="absolute top-2 right-2 ${product.inStock ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-2 py-1 rounded-full">
          ${product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
      <div class="p-4">
        <h3 class="product-title font-semibold text-gray-800 text-sm mb-1 truncate">${product.title}</h3>
        <p class="text-gray-400 text-xs mb-3 truncate">${product.description || 'No description'}</p>
        <div class="flex items-center justify-between mt-2">
          <span class="text-purple-600 font-bold text-lg">৳${product.price.toLocaleString()}</span>
          <button
            onclick="addToCart('${product._id}', '${product.title}', ${product.price}, '${product.image}')"
            ${product.inStock ? '' : 'disabled'}
            class="${product.inStock ? 'bg-purple-600 hover:bg-purple-700 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'} text-white text-xs px-3 py-2 rounded-full transition">
            <i class="fa-solid fa-cart-plus mr-1"></i>${product.inStock ? 'Add' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      const title = card.querySelector('.product-title').textContent.toLowerCase();
      card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
  });
}

function filterCategory(category) {
  loadProducts(category);
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function addToCart(id, title, price, image) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, title, price, image, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification(`✅ ${title} added to cart!`);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.textContent = totalItems;
}

function toggleDropdown() {
  const menu = document.getElementById('dropdownMenu');
  menu.classList.toggle('hidden');
}

document.addEventListener('click', function (e) {
  const dropdown = document.getElementById('profileDropdown');
  const menu = document.getElementById('dropdownMenu');
  if (dropdown && menu && !dropdown.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

function checkLoginStatus() {
  const user = JSON.parse(localStorage.getItem('user'));
  const loginBtn = document.getElementById('loginBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const adminBtn = document.getElementById('adminBtn');
  const userNameDisplay = document.getElementById('userNameDisplay');

  if (user) {
    if (loginBtn) loginBtn.classList.add('hidden');
    if (profileDropdown) profileDropdown.classList.remove('hidden');
    if (userNameDisplay) userNameDisplay.textContent = user.name;
    if (adminBtn && user.role === 'admin') adminBtn.classList.remove('hidden');
  } else {
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (profileDropdown) profileDropdown.classList.add('hidden');
  }
}

function logoutUser() {
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  window.location.href = '/login.html';
}

function showNotification(message, type = 'success') {
  const colors = { success: 'bg-green-500', error: 'bg-red-500', warning: 'bg-yellow-500' };
  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-full shadow-lg z-50 text-sm font-medium`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => { notification.remove(); }, 3000);
}

window.onload = function () {
  loadProducts();
  updateCartCount();
  checkLoginStatus();
  setupSearch();
};