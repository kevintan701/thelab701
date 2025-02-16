// Frontend configuration
const config = {
    // API base URL - automatically detect if we're running on GitHub Pages
    isGitHubPages: window.location.hostname === 'kevintan701.github.io',
    
    apiBaseUrl: window.location.hostname === 'kevintan701.github.io' 
        ? '/thelab701/public'  // Path to static JSON files on GitHub Pages
        : '',  // Same origin when running locally
    
    // API endpoints
    endpoints: {
        products: window.location.hostname === 'kevintan701.github.io'
            ? '/data/products.json'  // Static JSON file for GitHub Pages
            : '/products',  // Dynamic endpoint for local development
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