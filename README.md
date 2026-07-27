# Accessible McDonald's Nostalgia Toy Store

A lightweight, accessible, and modular web application showcasing a personal collection of classic McDonald's nostalgic toys. Designed with modern web standards, semantic HTML, and user preference controls.

---

##  Features

* **Dynamic Inventory:** Toy items, descriptions, and imagery are dynamically driven from a structured JSON dataset (`toys.json`), making data updates seamless and scalable without hardcoding HTML.
* **Accessibility (a11y) First:**
  * Fully tested using the **WAVE Evaluation Tool** to ensure high contrast, proper landmark regions, and fix heading hierarchy alerts.
  * Native Light/Dark mode toggle switch respecting user contrast preferences.
  * Dynamic `aria-current="page"` attributes injected via JS for accurate screen-reader navigation context.
* **Modular UI Architecture:**
  * Shared navigation menu asynchronously injected via `fetch()` (`nav-loader.js`) to keep code DRY across multi-page views (`index.html`, `about.html`).
  * Custom event listener architecture (`navigationLoaded`) ensuring DOM element availability before binding dynamic handlers.
* **Persistent Cart Experience:** Session-aware shopping cart state that preserves selected items across page updates and sub-page navigations.

---

##  Tech Stack

* **Frontend:** HTML5, Modern CSS3, JavaScript (ES6+)
* **Data Management:** JSON
* **Accessibility Testing:** WAVE Web Accessibility Evaluation Tool

---

##  Project Structure

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

##  Engineering Challenges & Solutions

### 1. DRY Navigation Component Loading

* **Challenge:** Updating navigation links across 20+ static HTML pages quickly becomes a maintenance nightmare.
* **Solution:** Decoupled the navigation into a single `nav.html` file fetched dynamically by `nav-loader.js`.

### 2. Script Timing & DOM Readiness

* **Challenge:** The primary app script (`app.js`) needed to attach cart events to elements inside `nav.html`, but `fetch()` is asynchronous—causing `null` reference errors when `app.js` ran before `nav.html` finished loading.
* **Solution:** Built a custom event pipeline. `nav-loader.js` emits a custom `navigationLoaded` event as soon as the HTML snippet is attached to the DOM, prompting `app.js` to execute safely.

### 3. Persistent Cart Across Page Navigation

* **Challenge:** Cart items were lost on page refresh or when switching from `index.html` to `about.html`.
* **Solution:** Refactored state handling to synchronize cart data with browser storage, preserving items across multi-page transitions.

---


## Lessons Learned & Development Log

This project was built iteratively as part of an ongoing hands-on software development and web accessibility journey. Key highlights include learning Network tab DevTools debugging, WCAG contrast compliance, and structuring clean git workflows.
