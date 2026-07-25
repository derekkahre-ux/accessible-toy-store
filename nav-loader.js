// nav-loader.js - Dynamic Navigation Loader
async function loadNavigation() {
    try {
        // Construct path relative to current page location
        const navPath = new URL('nav.html', window.location.href).href;
        
        const response = await fetch(navPath);
        if (!response.ok) throw new Error(`Status: ${response.status}`);

        const navHtml = await response.text();
        const headerContainer = document.getElementById('main-header');

        if (!headerContainer) {
            console.error('Error: Could not find <header id="main-header"> in the DOM.');
            return;
        }

        // Inject the nav HTML
        headerContainer.innerHTML = navHtml;

        // Highlight Active Page for Screen Readers
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = headerContainer.querySelectorAll('nav a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.setAttribute('aria-current', 'page');
            }
        });

        // Broadcast event so app.js knows the cart button exists!
        document.dispatchEvent(new CustomEvent('navigationLoaded'));

    } catch (error) {
        console.error('Navigation Loader Error:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavigation);
} else {
    loadNavigation();
}
