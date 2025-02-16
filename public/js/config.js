// Frontend configuration
const config = {
    // Environment detection
    isGitHubPages: window.location.hostname === 'kevintan701.github.io',
    
    // API base URL - use static data on GitHub Pages, backend API locally
    apiBaseUrl: window.location.hostname === 'kevintan701.github.io'
        ? '/thelab701/data'  // Path to static JSON files on GitHub Pages
        : '',  // Same origin when running locally
    
    // API endpoints
    endpoints: {
        products: window.location.hostname === 'kevintan701.github.io' 
            ? '/menu-data.json'  // Static JSON file for GitHub Pages
            : '/products',  // Backend API endpoint for local
        cart: '/add-to-cart',
        inventory: '/admin/inventory'
    },
    
    // Utility function to get full API URL
    getApiUrl: function(endpoint) {
        return this.apiBaseUrl + this.endpoints[endpoint];
    }
};

// Prevent accidental modifications
Object.freeze(config);
Object.freeze(config.endpoints);

// Export for use in other files
window.appConfig = config; 