// ==========================================================================
// Archival Play - Accessible Cart Controller
// ==========================================================================

// Track our cart state (Using a Set ensures unique vintage items are only added once)
let cart = new Set();

// DOM Elements
const cartCountEl = document.getElementById('cart-count');
const cartBtnEl = document.getElementById('cart-btn');
const cartAnnouncer = document.getElementById('cart-announcer');
const addToCartButtons = document.querySelectorAll('.product-card button');

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

// Add event listeners to all "Add to Cart" buttons
addToCartButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    // Find the closest product card to read the specific toy's title
    const productCard = event.target.closest('.product-card');
    const toyTitle = productCard.querySelector('h3').textContent;

    if (cart.has(toyTitle)) {
      // Accessible notification that the unique item is already in the cart
      updateCartUI(`${toyTitle} is already in your cart.`);
      alert(`"${toyTitle}" is already in your cart. Since these are unique vintage collectibles, we only have one available!`);
    } else {
      // Add to cart
      cart.add(toyTitle);
      
      // Update button visual state slightly to show it's added
      event.target.textContent = "Added!";
      event.target.style.backgroundColor = "var(--color-accent)";
      
      // Update UI and read out success message to screen readers
      updateCartUI(`${toyTitle} successfully added to cart.`);
    }
  });
});
