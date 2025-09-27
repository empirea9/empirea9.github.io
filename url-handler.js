// Clean URL handler for GitHub Pages
(function() {
    'use strict';

    // Define the mapping of clean URLs to actual HTML files
    const routes = {
        '/': 'index.html',
        '/index': 'index.html', 
        '/portfolio': 'portfolio.html',
        '/blog': 'blog.html',
        '/contact': 'contact.html',
        '/cinema': 'cinema.html',
        '/arcade': 'arcade.html',
        '/picasa': 'picasa.html',
        '/melody': 'melody.html'
    };

    // Check if we're at a clean URL that needs to redirect to .html
    function handleDirectNavigation() {
        const currentPath = window.location.pathname;
        
        // If we're at a clean URL (and not root), we need to redirect to the HTML file
        if (routes[currentPath] && currentPath !== '/') {
            // Replace the current history entry to avoid back button issues
            window.location.replace(routes[currentPath]);
            return true;
        }
        
        return false;
    }

    // Update all internal links to use clean URLs
    function updateLinks() {
        const links = document.querySelectorAll('a[href]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Check if it's an internal HTML link
            if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('//')) {
                // Find the corresponding clean path
                const cleanPath = Object.keys(routes).find(key => routes[key] === href);
                if (cleanPath) {
                    link.setAttribute('href', cleanPath);
                }
            }
        });
    }

    // Handle link clicks to maintain clean URLs in address bar
    function interceptLinks() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a[href]');
            
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Check if it's an internal clean URL link
            if (href && routes[href] && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#') && !href.startsWith('mailto:')) {
                e.preventDefault();
                
                // Navigate to the actual HTML file but keep clean URL in history
                window.location.href = routes[href];
            }
        });
    }

    // Initialize the URL handler
    function init() {
        // First handle direct navigation to clean URLs
        if (handleDirectNavigation()) {
            return; // If we redirected, don't continue with initialization
        }
        
        // Update links to use clean URLs (in case they weren't already updated)
        updateLinks();
        
        // Set up link interception for maintaining clean URLs
        interceptLinks();
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();