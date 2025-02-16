// Frontend configuration
const config = {
    // Environment detection
    isGitHubPages: window.location.hostname === 'kevintan701.github.io',
    
    // API base URL - use local server when running locally
    apiBaseUrl: window.location.hostname === 'kevintan701.github.io'
        ? ''  // Empty for GitHub Pages - will use static data
        : 'http://localhost:3000',  // Local backend server
    
    // API endpoints
    endpoints: {
        products: '/products',
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