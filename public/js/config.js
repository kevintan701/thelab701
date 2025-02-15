// Frontend configuration
const config = {
    // Theme settings
    defaultTheme: 'light',
    
    // Cart settings
    maxCartItems: 10,
    
    // Product settings
    defaultCurrency: 'USD',
    
    // Review settings
    maxReviewsPerPage: 5
};

// Prevent accidental modifications
Object.freeze(config);

// Export for use in other files
window.appConfig = config; 