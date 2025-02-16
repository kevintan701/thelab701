// Frontend configuration
const config = {
    // API base URL - automatically detect if we're running on GitHub Pages
    apiBaseUrl: window.location.hostname === 'kevintan701.github.io' 
        ? 'http://localhost:3000'  // Local backend server
        : '',  // Same origin when running locally
    
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