// ==========================================================================
// Archival Play - Accessible Storefront & Cart Controller
// ==========================================================================

// Track our cart state
let cart = new Set();

// DOM Element references (defined once navigation loads)
let cartCountEl, cartBtnEl, cartAnnouncer;
const productGrid = document.getElementById('product-grid');

/**
 * Initializes DOM elements for the cart header
 */
function initCartElements() {
    cartCountEl = document.getElementById('cart-count');
    cartBtnEl = document.getElementById('cart-btn');
    cartAnnouncer = document.getElementById('cart-announcer');
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

// Listen for navigation completion before setting up cart elements
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
            <button aria-label="Add ${toy.name} to cart">Add to Cart</button>
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
          
          button.textContent = "Added!";
          button.style.backgroundColor = "var(--color-accent)";
          
          updateCartUI(`${toyTitle} successfully added to cart.`);
        }
      }
    });
}
