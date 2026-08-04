// ==========================================================================
// Archival Play - Accessible Storefront & Cart Controller
// ==========================================================================

// Helper functions for localStorage persistence (Sets must be converted to/from Arrays for JSON)
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('playAbleCart');
    return savedCart ? new Set(JSON.parse(savedCart)) : new Set();
}

function saveCartToStorage() {
    localStorage.setItem('playAbleCart', JSON.stringify(Array.from(cart)));
}

// Track our cart state (initialized from localStorage)
let cart = loadCartFromStorage();

// DOM Element references (defined once navigation loads)
let cartCountEl, cartBtnEl, cartAnnouncer;
const productGrid = document.getElementById('product-grid');

/**
 * Initializes DOM elements for the cart header and syncs initial UI state
 */
function initCartElements() {
    cartCountEl = document.getElementById('cart-count');
    cartBtnEl = document.getElementById('cart-btn');
    cartAnnouncer = document.getElementById('cart-announcer');

    // Update UI immediately when navigation elements load
    updateCartUI();
}

/**
 * Updates the visual cart counter and the invisible accessibility announcer
 * @param {string} message - Announcement for screen reader users
 */
function updateCartUI(message) {
    if (!cartCountEl || !cartBtnEl) initCartElements();

    if (cartCountEl) cartCountEl.textContent = cart.size;
    
    if (cartBtnEl) {
        cartBtnEl.setAttribute('aria-label', `Cart, ${cart.size} item${cart.size === 1 ? '' : 's'}`);
    }
    
    if (cartAnnouncer && message) {
        cartAnnouncer.textContent = message;
    }
}

// Sync cart UI on DOM load and when header navigation loads dynamically
document.addEventListener('DOMContentLoaded', () => updateCartUI());
document.addEventListener('navigationLoaded', initCartElements);

// ==========================================================================
// 1. Fetch & Render Toys from JSON (Only on pages with a product grid)
// ==========================================================================
if (productGrid) {
    fetch('toys.json')
      .then(response => response.json())
      .then(toys => {
        productGrid.innerHTML = '';
        
        toys.forEach(toy => {
          const card = document.createElement('article');
          card.classList.add('product-card');
          
          const isAlreadyInCart = cart.has(toy.name);
          
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
            <button aria-label="Add ${toy.name} to cart" 
                    ${isAlreadyInCart ? 'style="background-color: var(--color-accent);"' : ''}>
              ${isAlreadyInCart ? 'Added!' : 'Add to Cart'}
            </button>
          `;
          
          productGrid.appendChild(card);
        });
      })
      .catch(error => console.error('Error loading toys from JSON:', error));

    // ==========================================================================
    // 2. Add to Cart Event Listener
    // ==========================================================================
    productGrid.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
        const button = event.target;
        const productCard = button.closest('.product-card');
        const toyTitle = productCard.querySelector('h3').textContent;

        if (cart.has(toyTitle)) {
          updateCartUI(`${toyTitle} is already in your cart.`);
          alert(`"${toyTitle}" is already in your cart. Since these are unique vintage collectibles, we only have one available!`);
        } else {
          cart.add(toyTitle);
          saveCartToStorage(); // Save updated Set to localStorage
          
          button.textContent = "Added!";
          button.style.backgroundColor = "var(--color-accent)";
          
          updateCartUI(`${toyTitle} successfully added to cart.`);
        }
      }
    });
}
