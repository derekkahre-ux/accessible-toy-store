// ==========================================================================
// Archival Play - Accessible Storefront & Cart Controller
// ==========================================================================

// Helper functions for localStorage persistence (Sets converted to/from Arrays for JSON)
function loadCartFromStorage() {
  try {
    const savedCart = localStorage.getItem('playAbleCart');
    return savedCart ? new Set(JSON.parse(savedCart)) : new Set();
  } catch (error) {
    console.error('Failed to parse cart from localStorage:', error);
    return new Set();
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem('playAbleCart', JSON.stringify(Array.from(cart)));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
}

// Track cart state (initialized from localStorage)
let cart = loadCartFromStorage();

// DOM Element references (defined once navigation loads)
let cartCountEl, cartBtnEl, cartAnnouncer;
const productGrid = document.getElementById('product-grid');

/**
 * Binds references to DOM elements in the header navigation
 */
function initCartElements() {
  cartCountEl = document.getElementById('cart-count');
  cartBtnEl = document.getElementById('cart-btn');
  cartAnnouncer = document.getElementById('cart-announcer');

  // Sync UI immediately once header elements are present in the DOM
  updateCartUI();
}

/**
 * Updates the visual cart counter and the invisible accessibility announcer
 * @param {string} [message] - Announcement for screen reader users
 */
function updateCartUI(message) {
  if (cartCountEl) {
    cartCountEl.textContent = cart.size;
  }

  if (cartBtnEl) {
    cartBtnEl.setAttribute('aria-label', `Cart, ${cart.size} item${cart.size === 1 ? '' : 's'}`);
  }

  if (cartAnnouncer && message) {
    cartAnnouncer.textContent = message;
  }
}

/**
 * Clears all items from the cart, removes persistent storage, and updates UI
 */
function clearCart() {
  cart.clear();

  try {
    localStorage.removeItem('playAbleCart');
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }

  updateCartUI('Cart has been emptied.');

  // Reset all product grid button states if on the storefront page
  if (productGrid) {
    const buttons = productGrid.querySelectorAll('.product-card button');
    buttons.forEach(button => {
      const productCard = button.closest('.product-card');
      const toyTitle = productCard ? productCard.querySelector('h3').textContent : 'item';
      
      button.textContent = 'Add to Cart';
      button.style.backgroundColor = '';
      button.setAttribute('aria-label', `Add ${toyTitle} to cart`);
    });
  }
}

// Ensure elements bind regardless of whether navigationLoaded or DOMContentLoaded finishes first
document.addEventListener('navigationLoaded', initCartElements);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-count')) initCartElements();
  });
} else if (document.getElementById('cart-count')) {
  initCartElements();
}

// Sync state across multiple open tabs/windows
window.addEventListener('storage', (event) => {
  if (event.key === 'playAbleCart') {
    cart = loadCartFromStorage();
    updateCartUI('Cart updated in another session.');
  }
});

// ==========================================================================
// 1. Fetch & Render Toys from JSON (Only on pages with a product grid)
// ==========================================================================
if (productGrid) {
  fetch('toys.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(toys => {
      productGrid.innerHTML = '';

      toys.forEach(toy => {
        const card = document.createElement('article');
        card.classList.add('product-card');

        const isAlreadyInCart = cart.has(toy.name);

        // Sanitize & build component with dynamic accessibility attributes
        card.innerHTML = `
          <img src="${toy.image}" 
               alt="${toy.altText}" 
               width="300" 
               height="300">
          <h3>${toy.name}</h3>
          <p class="condition">Condition: ${toy.condition}</p>
          <p class="price">
              <data value="${toy.priceNum}">${toy.priceStr}</data>
          </p>
          <button aria-label="${isAlreadyInCart ? `Remove ${toy.name} from cart` : `Add ${toy.name} to cart`}" 
                  ${isAlreadyInCart ? 'style="background-color: var(--color-accent);"' : ''}>
            ${isAlreadyInCart ? 'Added!' : 'Add to Cart'}
          </button>
        `;

        productGrid.appendChild(card);
      });
    })
    .catch(error => console.error('Error loading toys from JSON:', error));

  // ==========================================================================
  // 2. Add / Remove Cart Event Listener (Toggle behavior)
  // ==========================================================================
  productGrid.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const button = event.target;
      const productCard = button.closest('.product-card');
      const toyTitle = productCard.querySelector('h3').textContent;

      if (cart.has(toyTitle)) {
        // --- REMOVE ITEM LOGIC ---
        cart.delete(toyTitle);
        saveCartToStorage();

        // Update Button UI & Accessibility
        button.textContent = "Add to Cart";
        button.style.backgroundColor = "";
        button.setAttribute('aria-label', `Add ${toyTitle} to cart`);

        updateCartUI(`${toyTitle} removed from cart.`);
      } else {
        // --- ADD ITEM LOGIC ---
        cart.add(toyTitle);
        saveCartToStorage();

        // Update Button UI & Accessibility
        button.textContent = "Added!";
        button.style.backgroundColor = "var(--color-accent)";
        button.setAttribute('aria-label', `Remove ${toyTitle} from cart`);

        updateCartUI(`${toyTitle} successfully added to cart.`);
      }
    }
  });
}
