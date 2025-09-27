// Clean URL handler for GitHub Pages
(function() {
    'use strict';

    // This script ensures internal links work correctly with clean URLs
    // No redirects - just makes sure links point to the right places
    
    // Update all internal links to use clean URLs if they're not already
    function updateLinks() {
        const links = document.querySelectorAll('a[href]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Convert .html links to clean URLs
            if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('//')) {
                const cleanPath = href.replace('.html', '');
                link.setAttribute('href', cleanPath);
            }
        });
    }

    // Initialize the URL handler
    function init() {
        // Update links to use clean URLs
        updateLinks();
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();