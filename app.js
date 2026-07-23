// ==========================================================================
// Archival Play - Accessible Storefront & Cart Controller
// ==========================================================================

// Track our cart state (Using a Set ensures unique vintage items are only added once)
let cart = new Set();

// DOM Elements
const cartCountEl = document.getElementById('cart-count');
const cartBtnEl = document.getElementById('cart-btn');
const cartAnnouncer = document.getElementById('cart-announcer');
const productGrid = document.getElementById('product-grid');

/**
 * Updates the visual cart counter and the invisible accessibility announcer
 * @param {string} message - Announcement for screen reader users
 */
function updateCartUI(message) {
  // Update visual number
  cartCountEl.textContent = cart.size;
  
  // Update aria-label on the main cart button for screen readers
  cartBtnEl.setAttribute('aria-label', `Cart, ${cart.size} item${cart.size === 1 ? '' : 's'}`);
  
  // Announce the action dynamically to assistive technologies
  if (message) {
    cartAnnouncer.textContent = message;
  }
}

// ==========================================================================
// 1. Fetch & Render Toys from JSON
// ==========================================================================
fetch('toys.json')
  .then(response => response.json())
  .then(toys => {
    // Clear out any old content before appending
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
// 2. Add to Cart Event Listener (Event Delegation)
// ==========================================================================
// Listen on the parent grid container so dynamically created buttons work instantly!
productGrid.addEventListener('click', (event) => {
  // Check if the clicked element was an "Add to Cart" button inside a card
  if (event.target.tagName === 'BUTTON') {
    const button = event.target;
    const productCard = button.closest('.product-card');
    const toyTitle = productCard.querySelector('h3').textContent;

    if (cart.has(toyTitle)) {
      // Accessible notification that the unique item is already in the cart
      updateCartUI(`${toyTitle} is already in your cart.`);
      alert(`"${toyTitle}" is already in your cart. Since these are unique vintage collectibles, we only have one available!`);
    } else {
      // Add to cart
      cart.add(toyTitle);
      
      // Update button visual state slightly to show it's added
      button.textContent = "Added!";
      button.style.backgroundColor = "var(--color-accent)";
      
      // Update UI and read out success message to screen readers
      updateCartUI(`${toyTitle} successfully added to cart.`);
    }
  }
});
