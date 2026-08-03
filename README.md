# PlayAble Toys (Accessible Nostalgia Storefront)

A lightweight, highly accessible, and modular e-commerce storefront showcasing classic nostalgic toys. Built with modern web standards, semantic HTML, dynamic JSON inventory management, and user preference controls.

---

## 🛠️ Tech Stack & Tools

* **Frontend:** HTML5, CSS3, JavaScript (ES6+), Tailwind CSS
* **Backend & Database:** Supabase (PostgreSQL RESTful API integration)
* **Accessibility & QA:** WAVE Web Accessibility Evaluation Tool, WCAG 2.1 AA Standards, Semantic Markup, ARIA

---

## Key Highlights & Engineering Achievements

* **♿ Accessibility First (a11y):** Fully audited with the **WAVE Evaluation Tool** to ensure high contrast compliance, proper landmark regions, keyboard-first navigation, and a semantic heading hierarchy. Features custom high-contrast toggle themes respecting user display preferences.
* **📦 Dynamic Inventory & Backend Integration:** Driven by structured JSON data (`toys.json`) and connected to a **Supabase (PostgreSQL)** backend to dynamically manage product inventory and handle user reviews.
* **🧩 Modular UI Architecture:** Shared navigation menu asynchronously injected via `fetch()` (`nav-loader.js`) to keep code DRY across multi-page views (`index.html`, `about.html`) with dynamic `aria-current="page"` accessibility state management.
* **🛒 Persistent Shopping Cart State:** Session-aware cart logic that preserves selected items across page updates and sub-page navigations without resetting client state.

---

## 📁 Project Structure

```text
├── index.html        # Main storefront view
├── about.html        # Project background and history
├── app.js            # Core application & cart state logic
├── nav-loader.js     # Modular navigation injector & dynamic a11y script
├── nav.html          # Shared navigation component snippet
├── style.css         # Styling system including light/dark theme variables
└── data/
    └── toys.json     # Toy inventory, image paths, and product metadata

```

---

## 🧠 Engineering Challenges & Solutions

### 1. DRY Navigation Component Loading

* **Challenge:** Updating navigation links across multiple static HTML pages created redundant maintenance overhead.
* **Solution:** Decoupled the navigation into a single `nav.html` component fetched dynamically by `nav-loader.js`.

### 2. Script Timing & Asynchronous DOM Execution

* **Challenge:** The primary application script (`app.js`) needed to attach cart events to elements inside `nav.html`. However, `fetch()` runs asynchronously, causing `null` reference errors when `app.js` executed before the DOM injection finished.
* **Solution:** Built a custom event pipeline. `nav-loader.js` dispatches a custom `navigationLoaded` event as soon as the HTML snippet is attached to the DOM, prompting `app.js` to execute safely.

### 3. State Persistence Across Multi-Page Navigations

* **Challenge:** Shopping cart items were cleared on page refresh or when navigating between `index.html` and `about.html`.
* **Solution:** Refactored state handling to synchronize cart data with browser storage, maintaining item state across page transitions.

---

## 📖 Development Log & Lessons Learned

Built iteratively as part of a hands-on web engineering journey. Key competencies gained include Network tab DevTools debugging, WCAG contrast compliance, modular component design, and zero-dependency state management.

```
