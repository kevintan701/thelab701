// JavaScript for Kevin's Final Project - THE.LAB.701 website

async function fetchProducts() {
    try {
        const response = await fetch(window.appConfig.getApiUrl('products'));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function addToCart(product) {
    try {
        const response = await fetch(window.appConfig.getApiUrl('cart'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
            credentials: 'include'  // Important for cookies
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

function fetchProducts() {
    const productsContainer = document.getElementById('menu-coffee');
    console.log('Starting fetchProducts()', { containerExists: !!productsContainer });
    
    if (!productsContainer) {
        console.error('Products container not found!');
        return;
    }
    
    productsContainer.innerHTML = '<p>Loading products...</p>';
    
    console.log('Fetching from:', 'http://localhost:3000/products');
    
    fetch('http://localhost:3000/products', {
        cache: "no-store",
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        console.log('Response received:', {
            status: response.status,
            ok: response.ok,
            statusText: response.statusText
        });
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Error response:', text);
                throw new Error(`HTTP error! status: ${response.status}`);
            });
        }
        return response.json();
    })
    .then(products => {
        console.log('Products received:', products);
        productsContainer.innerHTML = ''; // Clear previous entries
        
        if (!products || products.length === 0) {
            console.log('No products found in response');
            productsContainer.innerHTML = '<p>No products available.</p>';
            return;
        }
        
        const imageMap = {
            'Americano 701': ['medias/americano-1.jpeg', 'medias/americano-2.jpeg', 'medias/americano-3.jpeg'],
            'Cold Brew 701': ['medias/coldbrew-1.jpeg', 'medias/coldbrew-2.jpeg'],
            'Latte 701': ['medias/latte-1.jpeg', 'medias/latte-2.jpeg', 'medias/latte-3.jpeg', 'medias/latte-4.jpeg'],
            'Special 701': ['medias/special-1.jpeg', 'medias/special-2.jpeg', 'medias/special-3.jpeg', 'medias/special-4.jpeg']
        };
        
        // Function to handle image slideshow
        function startSlideshow(imgElement, images) {
            if (!imgElement || !images || images.length < 1) {
                return;
            }
            
            let currentIndex = 0;
            imgElement.style.opacity = '1';
            imgElement.style.transition = 'opacity 1.2s ease-in-out'; // Added smooth transition
            
            return setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                imgElement.style.opacity = '0';
                
                setTimeout(() => {
                    imgElement.src = images[currentIndex];
                    // Use requestAnimationFrame for smoother transition
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            imgElement.style.opacity = '1';
                        });
                    });
                }, 1200); // Increased fade out duration to match transition
            }, 6000); // Increased display duration for better viewing
        }
        
        // Clear existing content
        productsContainer.innerHTML = '';
        
        // Create all cards first
        const cards = products.map(product => {
            const price = parseFloat(product.price);
            const images = imageMap[product.name];
            
            // Define customization options based on product type
            const customizationOptions = {
                milk: {
                    options: ['None', 'Whole Milk', 'Oat Milk (+$1)', 'Almond Milk (+$1)', 'Soy Milk (+$1)'],
                    default: 'None'
                },
                sweetness: {
                    options: ['No Sugar', 'Light Sugar', 'Normal Sugar', 'Extra Sugar'],
                    default: 'No Sugar'
                },
                temperature: {
                    options: ['Hot', 'Warm', 'Iced'],
                    default: 'Hot'
                }
            };
            
            if (product.name === 'Cold Brew 701') {
                customizationOptions.temperature.options = ['Iced'];
                customizationOptions.temperature.default = 'Iced';
            } else if (product.name === 'Latte 701') {
                customizationOptions.milk.default = 'Whole Milk';
            } else if (product.name === 'Special 701') {
                customizationOptions.milk.options = ['Stay Active'];
                customizationOptions.milk.default = 'Stay Active';
                customizationOptions.sweetness.options = ['Be Well'];
                customizationOptions.sweetness.default = 'Be Well';
                customizationOptions.temperature.options = ['Be Loved'];
                customizationOptions.temperature.default = 'Be Loved';
            }
            
            return `
                <div class="product-card">
                    <img src="${images ? images[0] : 'medias/memory-4.jpeg'}" alt="${product.name}" class="product-image" data-product="${product.name}">
                    <h2>${product.name}</h2>
                    <h2>$${price.toFixed(2)}</h2>
                    <div class="customization-options">
                        <div class="option-group">
                            <label for="milk-${product.name}">Milk Type:</label>
                            <select id="milk-${product.name}" class="custom-select">
                                ${customizationOptions.milk.options.map(option => `<option value="${option.toLowerCase().replace(' ', '_')}" ${option === customizationOptions.milk.default ? 'selected' : ''}>${option}</option>`).join('')}
                            </select>
                        </div>
                        <div class="option-group">
                            <label for="sweetness-${product.name}">Sweetness:</label>
                            <select id="sweetness-${product.name}" class="custom-select">
                                ${customizationOptions.sweetness.options.map(option => `<option value="${option.toLowerCase().replace(' ', '_')}" ${option === customizationOptions.sweetness.default ? 'selected' : ''}>${option}</option>`).join('')}
                            </select>
                        </div>
                        <div class="option-group">
                            <label for="temp-${product.name}">Temperature:</label>
                            <select id="temp-${product.name}" class="custom-select">
                                ${customizationOptions.temperature.options.map(option => `<option value="${option.toLowerCase()}" ${option === customizationOptions.temperature.default ? 'selected' : ''}>${option}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <button id="cart-coffee" class="material-symbols-outlined" 
                        onclick="addToCart('${product.name}', ${price}, 
                        document.getElementById('milk-${product.name}').value,
                        document.getElementById('sweetness-${product.name}').value,
                        document.getElementById('temp-${product.name}').value)">
                        shopping_cart
                    </button>
                </div>`;
        });
        
        // Add all cards to the container at once
        productsContainer.innerHTML = cards.join('');
        
        // Start slideshows after all cards are added
        products.forEach(product => {
            const images = imageMap[product.name];
            if (images && images.length > 1) {
                const imgElement = document.querySelector(`img[data-product="${product.name}"]`);
                if (imgElement) {
                    startSlideshow(imgElement, images);
                }
            }
        });
    })
    .catch(error => {
        console.error('Error loading products:', error);
        productsContainer.innerHTML = `<p>Error loading products: ${error.message}</p>`;
    });
}

// Ensure the function is called when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    const menuContainer = document.getElementById('menu-coffee');
    console.log('Menu container found:', !!menuContainer);
    if (menuContainer) {
        console.log('Calling fetchProducts()');
        fetchProducts();
    }
});

let cart = {};

document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    cartIcon.addEventListener('click', toggleCartDropdown);
    cartCount.addEventListener('click', toggleCartDropdown);

    loadCart();
    updateCartCount();
    updateCartDropdown();
});

function addToCart(product, basePrice, milkType, sweetness, temperature) {
    const extraCharge = milkType !== 'whole' ? 1.00 : 0;
    const totalPrice = basePrice + extraCharge;
    
    const cartItem = {
        price: totalPrice,
        qty: 1,
        customization: {
            milk: milkType,
            sweetness: sweetness,
            temperature: temperature
        }
    };

    if (cart[product]) {
        // Check if this exact customization exists
        const existingCustomization = cart[product].customizations.find(c => 
            c.milk === milkType && 
            c.sweetness === sweetness && 
            c.temperature === temperature
        );

        if (existingCustomization) {
            existingCustomization.qty += 1;
        } else {
            cart[product].customizations.push({
                milk: milkType,
                sweetness: sweetness,
                temperature: temperature,
                qty: 1,
                price: totalPrice
            });
        }
    } else {
        cart[product] = {
            customizations: [{
                milk: milkType,
                sweetness: sweetness,
                temperature: temperature,
                qty: 1,
                price: totalPrice
            }]
        };
    }
    
    saveCart();
    updateCartCount();
    updateCartDropdown();
}

function saveCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

function loadCart() {
    cart = JSON.parse(localStorage.getItem("shoppingCart")) || {};
    updateCartDropdown();
}

function updateCartCount() {
    const count = Object.values(cart).reduce((acc, { customizations }) => acc + customizations.reduce((acc, { qty }) => acc + qty, 0), 0);
    document.getElementById('cart-count').textContent = count;
}

function toggleCartDropdown() {
    const cartDropdown = document.getElementById('cart-dropdown');
    const mainContent = document.querySelector('main');
    const footerContent = document.querySelector('footer');
    if (cartDropdown.style.display === 'block') {
        cartDropdown.style.display = 'none';
        mainContent.style.filter = ''; // Remove blur effect
        footerContent.style.filter = '';
    } else {
        cartDropdown.style.display = 'block';
        mainContent.style.filter = 'blur(4px)'; // Apply blur effect
        footerContent.style.filter = 'blur(4px)';
    }
}

function updateCartDropdown() {
    const cartItemsList = document.getElementById('cart-items-list');
    cartItemsList.innerHTML = ''; // Clear current list

    let total = 0;
    let totalCups = 0;

    Object.entries(cart).forEach(([product, details]) => {
        // Add product header
        const productHeader = document.createElement('li');
        productHeader.className = 'cart-product-header';
        productHeader.textContent = product;
        cartItemsList.appendChild(productHeader);

        details.customizations.forEach(customization => {
            total += customization.qty * customization.price;
            totalCups += customization.qty;

            const itemElement = document.createElement('li');
            itemElement.className = 'cart-item';
            
            const customizationDetails = document.createElement('div');
            customizationDetails.className = 'cart-item-details';

            // Format customization text based on product type
            let customizationText = '';
            if (product === 'Special 701') {
                // Format Special 701 customizations
                const milk = customization.milk.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                const sweetness = customization.sweetness.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                const temp = customization.temperature.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                customizationText = `${milk} • ${sweetness} • ${temp}`;
            } else {
                // Format regular drinks customizations
                const milkText = customization.milk.toLowerCase() === 'none' || customization.milk.toLowerCase() === 'no_milk' 
                    ? 'No Milk' 
                    : customization.milk.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                
                const sweetnessText = customization.sweetness.toLowerCase() === 'none' || customization.sweetness.toLowerCase() === 'no_sugar'
                    ? 'No Sugar'
                    : customization.sweetness.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                
                const tempText = customization.temperature.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                customizationText = `${milkText} • ${sweetnessText} • ${tempText}`;
            }
            
            customizationDetails.innerHTML = `
                <div class="cart-item-main">
                    <span class="cart-item-price">$${customization.price.toFixed(2)} × ${customization.qty}</span>
                </div>
                <div class="cart-item-customization">
                    ${customizationText}
                </div>
            `;

            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'cart-item-buttons';

            const addButton = document.createElement('button');
            addButton.className = "material-symbols-outlined";
            addButton.textContent = "add_circle";
            addButton.onclick = () => {
                customization.qty += 1;
                saveCart();
                updateCartCount();
                updateCartDropdown();
                // Update checkout summary if on checkout page
                if (window.location.pathname.includes('checkout.html')) {
                    loadCheckoutSummary();
                }
            };

            const removeButton = document.createElement('button');
            removeButton.className = "material-symbols-outlined";
            removeButton.textContent = "do_not_disturb_on";
            removeButton.onclick = () => {
                if (customization.qty > 1) {
                    customization.qty -= 1;
                } else {
                    const customizationIndex = details.customizations.indexOf(customization);
                    if (customizationIndex > -1) {
                        details.customizations.splice(customizationIndex, 1);
                    }
                    if (details.customizations.length === 0) {
                        delete cart[product];
                    }
                }
                saveCart();
                updateCartCount();
                updateCartDropdown();
                // Update checkout summary if on checkout page
                if (window.location.pathname.includes('checkout.html')) {
                    loadCheckoutSummary();
                }
            };

            buttonsContainer.appendChild(addButton);
            buttonsContainer.appendChild(removeButton);
            itemElement.appendChild(customizationDetails);
            itemElement.appendChild(buttonsContainer);
            cartItemsList.appendChild(itemElement);
        });
    });

    // Add summary information
    const summaryElement = document.createElement('div');
    summaryElement.className = 'cart-summary';
    summaryElement.innerHTML = `
        <div class="cart-total-cups">Total Cups: ${totalCups}</div>
        <div class="cart-total-price">Total: $${total.toFixed(2)}</div>
        ${window.location.pathname.includes('checkout.html') ? '' : `
        <button onclick="checkoutCart()" class="cart-checkout-btn">
            <span class="material-symbols-outlined">shopping_bag</span>
            Proceed to Checkout
        </button>
        `}
    `;
    cartItemsList.appendChild(summaryElement);
}

function closeCart() {
    const cartDropdown = document.getElementById('cart-dropdown');
    const mainContent = document.querySelector('main');
    const footerContent = document.querySelector('footer');

    cartDropdown.style.display = 'none';
    mainContent.style.filter = ''; // Remove blur effect
    footerContent.style.filter = '';

}

function checkoutCart() {
    console.log('Starting checkout process');
    console.log('Current cart:', cart);
    
    // Save current cart state to localStorage before redirecting
    const cartData = localStorage.getItem('shoppingCart');
    console.log('Cart data from localStorage:', cartData);
    
    localStorage.setItem('checkoutCart', cartData);
    console.log('Saved to checkoutCart:', localStorage.getItem('checkoutCart'));
    
    window.location.href = 'checkout.html';
}

// Add function to load checkout summary
function loadCheckoutSummary() {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotalCups = document.getElementById('checkout-total-cups');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');
    
    if (!checkoutItems || !checkoutTotalCups || !checkoutTotalPrice) return;
    
    const savedCart = JSON.parse(localStorage.getItem('checkoutCart')) || {};
    let total = 0;
    let totalCups = 0;
    
    checkoutItems.innerHTML = '';
    
    Object.entries(savedCart).forEach(([product, details]) => {
        const productElement = document.createElement('div');
        productElement.className = 'checkout-product';
        
        details.customizations.forEach(customization => {
            total += customization.qty * customization.price;
            totalCups += customization.qty;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'checkout-item';
            
            // Format customization text based on product type
            let customizationText = '';
            if (product === 'Special 701') {
                customizationText = `${customization.milk} • ${customization.sweetness} • ${customization.temperature}`;
            } else {
                const milkText = customization.milk === 'none' ? 'No Milk' : 
                               `${customization.milk.charAt(0).toUpperCase() + customization.milk.slice(1)} Milk`;
                const sweetnessText = customization.sweetness === 'none' ? 'No Sugar' : 
                                    `${customization.sweetness.charAt(0).toUpperCase() + customization.sweetness.slice(1)} Sugar`;
                const tempText = customization.temperature.charAt(0).toUpperCase() + customization.temperature.slice(1);
                customizationText = `${milkText} • ${sweetnessText} • ${tempText}`;
            }
            
            itemElement.innerHTML = `
                <div class="checkout-item-details">
                    <div class="checkout-item-name">${product}</div>
                    <div class="checkout-item-customization">
                        ${customizationText}
                    </div>
                    <div class="checkout-item-price">
                        $${customization.price.toFixed(2)} × ${customization.qty}
                    </div>
                </div>
            `;
            productElement.appendChild(itemElement);
        });
        
        checkoutItems.appendChild(productElement);
    });
    
    checkoutTotalCups.textContent = totalCups;
    checkoutTotalPrice.textContent = total.toFixed(2);
}

// Add event listener for payment form submission
document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const cardDetails = document.getElementById('card-details');
    
    if (paymentForm) {
        loadCheckoutSummary(); // Load checkout summary when on checkout page
        
        // Handle payment method selection
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                paymentMethods.forEach(m => m.classList.remove('selected'));
                method.classList.add('selected');
                
                // Show/hide card details based on payment method
                if (method.dataset.method === 'credit' || method.dataset.method === 'debit') {
                    cardDetails.style.display = 'block';
                } else {
                    cardDetails.style.display = 'none';
                }
            });
        });
        
        // Handle form submission
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                customerInfo: {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value
                },
                paymentMethod: document.querySelector('.payment-method.selected')?.dataset.method || 'credit',
                cart: JSON.parse(localStorage.getItem('checkoutCart')) || {}
            };
            
            try {
                const response = await fetch('/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    // Clear cart and redirect to confirmation
                    localStorage.removeItem('checkoutCart');
                    localStorage.removeItem('shoppingCart');
                    cart = {};
                    alert('Order placed successfully!');
                    window.location.href = 'index.html';
                } else {
                    throw new Error('Failed to process order');
                }
            } catch (error) {
                console.error('Error processing order:', error);
                alert('Failed to process order. Please try again.');
            }
        });
    }
});


//hamburger menu function
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    const mainContent = document.querySelector('main');
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    const logoAbout = document.getElementById('logo-mark-about'); // This might not exist on all pages

    // Set active page in navigation
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage.split('/').pop()) {
            link.classList.add('active');
        }
    });

    const hamburgerBtn = document.getElementById("hamburger-btn");
    if (hamburgerBtn && header && mainContent && cartIcon && cartCount) {
        hamburgerBtn.addEventListener("click", () => {
            header.classList.toggle("show-mobile-menu");
            mainContent.classList.toggle('content-blur');
            cartIcon.classList.toggle('content-blur');
            cartCount.classList.toggle('content-blur');
            if (logoAbout) logoAbout.classList.toggle('content-blur'); // Only toggle if exists
            console.log("Hamburger menu toggled. Menu visible:", header.classList.contains("show-mobile-menu"));
        });
    }

    const closeMenuBtn = document.getElementById("close-menu-btn");
    if (closeMenuBtn && hamburgerBtn) {
        closeMenuBtn.addEventListener("click", () => {
            hamburgerBtn.click(); // Reuse the toggle functionality
        });
    }
});



// Navigation link setups
setupNavigation("#navigation-arrow-menu", "menu.html");
setupNavigation("#navigation-arrow-explore", "memory.html");
setupNavigation("#navigation-arrow-about", "about.html");
setupNavigation("#left-arrow-memories", "memory.html");
setupNavigation("#right-arrow-about", "about.html");
setupNavigation("#left-arrow-menu", "menu.html");
setupNavigation("#right-arrow-memories", "memory.html");

// Helper function to setup navigation redirection
function setupNavigation(selector, url) {
    const element = document.querySelector(selector);
    if (element) {
        element.addEventListener("click", () => {
            window.location.href = url;
        });
    }
}


// Function to toggle the theme
function applyTheme() {
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';

    document.body.classList.toggle('dark-theme', isDarkTheme);

    // Helper function to change image source if the element exists
    const updateImageSource = (element, darkSrc, lightSrc) => {
        if (element) {
            element.src = isDarkTheme ? darkSrc : lightSrc;
        }
    };

    // Set the source for your images based on the theme
    updateImageSource(logoWordMarkHome, 'medias/Logo_Word_Mark_white.png', 'medias/Logo_Word_Mark.png');
    updateImageSource(logoWordMarkMenu, 'medias/Logo_Word_Mark_white.png', 'medias/Logo_Word_Mark.png');
    updateImageSource(logoWordMarkMemory, 'medias/Logo_Word_Mark_white.png', 'medias/Logo_Word_Mark.png');
    updateImageSource(logoWordMarkAbout, 'medias/Logo_Word_Mark_white.png', 'medias/Logo_Word_Mark.png');
    updateImageSource(logoMarkHome, 'medias/Lab_Logo_white.svg', 'medias/Lab_Logo.svg');
    updateImageSource(logoMarkAbout, 'medias/Lab_Logo_white.svg', 'medias/Lab_Logo.svg');
}

// Function to toggle the theme and store user preference
function toggleTheme() {
    const isDarkTheme = !document.body.classList.contains('dark-theme');
    localStorage.setItem('isDarkTheme', isDarkTheme);
    applyTheme();
}

document.addEventListener('DOMContentLoaded', applyTheme);


// Select the logo elements
const logoWordMarkHome = document.querySelector("#logo-word-mark-home");
const logoMarkHome = document.querySelector("#logo-mark-home");
const logoWordMarkMenu = document.querySelector("#logo-word-mark-menu");
const logoWordMarkMemory = document.querySelector("#logo-word-mark-memory");
const logoWordMarkAbout = document.querySelector("#logo-word-mark-about");
const logoMarkAbout = document.querySelector("#logo-mark-about");

// Event listener for toggling theme on logo click
if (logoWordMarkHome) {
    logoWordMarkHome.addEventListener("click", toggleTheme);
}


if (logoWordMarkMenu) {
    logoWordMarkMenu.addEventListener("click", toggleTheme);
}

if (logoWordMarkMemory) {
    logoWordMarkMemory.addEventListener("click", toggleTheme);
}

if (logoWordMarkAbout) {
    logoWordMarkAbout.addEventListener("click", toggleTheme);
}

if (logoMarkHome) {
    logoMarkHome.addEventListener("click", toggleTheme);
}

if (logoMarkAbout) {
    logoMarkAbout.addEventListener("click", toggleTheme);
}
// JavaScript to handle hover and focus events for image source switching and video popup display

// Function to change image source
function changeImageSource(element, newSrc) {
    const originalSrc = element.src;
    element.addEventListener('mouseover', () => {
        element.src = newSrc;
    });
    element.addEventListener('mouseout', () => {
        element.src = originalSrc;
    });
    element.addEventListener('focus', () => {
        element.src = newSrc;
    });
    element.addEventListener('blur', () => {
        element.src = originalSrc;
    });
}

// Implement the change on each memory image
changeImageSource(document.getElementById('memory-1'), 'medias/memory-1-1.JPG');
changeImageSource(document.getElementById('memory-2'), 'medias/memory-2-1.JPG');
changeImageSource(document.getElementById('memory-3'), 'medias/memory-3-1.JPG');
changeImageSource(document.getElementById('memory-4'), 'medias/memory-4-2.JPG');
changeImageSource(document.getElementById('memory-5'), 'medias/memory-5-2.JPG');
changeImageSource(document.getElementById('memory-6'), 'medias/memory-6-1.JPG');

// Function to create and display a video player overlay with accessible close button
function setupVideoPopup(id, videoSrc) {
    console.log('Setting up video popup for:', id);
    
    const imgElement = document.getElementById(id);
    if (!imgElement) {
        console.error('Image element not found:', id);
        return;
    }
    
    // Add hover effect to indicate video is available
    imgElement.style.transition = 'transform 0.4s ease-out, filter 0.3s ease';
    imgElement.style.transformOrigin = 'center center';
    imgElement.style.willChange = 'transform';
    imgElement.title = 'Click to play video';
    
    // Add hover effects with larger scale
    imgElement.addEventListener('mouseover', () => {
        imgElement.style.transform = 'scale(1.5)';
        imgElement.style.filter = 'brightness(0.85)';
        imgElement.style.zIndex = '1';
    });
    
    imgElement.addEventListener('mouseout', () => {
        imgElement.style.transform = 'scale(1)';
        imgElement.style.filter = 'brightness(1)';
        imgElement.style.zIndex = '0';
    });

    // Add click event listener to image
    imgElement.addEventListener('click', handleClick);
    
    // Function to handle click event
    function handleClick(event) {
        event.preventDefault();
        console.log('Video click triggered for:', id);
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0);
            z-index: 999;
            transition: background-color 0.3s ease;
        `;
        
        // Create video container
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';
        videoContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            width: 85%;
            max-width: 1200px;
            background-color: #000;
            z-index: 1000;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transition: all 0.3s ease;
            overflow: hidden;
        `;

        // Add loading spinner
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        loadingSpinner.innerHTML = `
            <div class="spinner">
                <span class="material-symbols-outlined">sync</span>
            </div>
        `;
        videoContainer.appendChild(loadingSpinner);

        // Create video player
        const videoWrapper = document.createElement('div');
        videoWrapper.style.cssText = `
            position: relative;
            padding-top: 56.25%;
            width: 100%;
            background-color: #000;
        `;
        
        const video = document.createElement('video');
        video.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        video.src = videoSrc;
        video.controls = true;
        video.autoplay = true;
        
        // Error handling for video
        video.onerror = (e) => {
            console.error('Video error:', e);
            loadingSpinner.innerHTML = '<div style="color: white; text-align: center;">Error loading video</div>';
        };

        // Add title bar with the new title
        const titleBar = document.createElement('div');
        titleBar.className = 'video-title-bar';
        titleBar.innerHTML = `
            <div class="video-title">Stay Active, Be Well, Be Loved.</div>
            <button aria-label="Close video" class="close-video-btn">
                <span class="material-symbols-outlined">close</span>
            </button>
        `;
        
        // Append elements
        videoWrapper.appendChild(video);
        videoContainer.appendChild(titleBar);
        videoContainer.appendChild(videoWrapper);
        overlay.appendChild(videoContainer);
        document.body.appendChild(overlay);

        // Fade in animation
        requestAnimationFrame(() => {
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            videoContainer.style.opacity = '1';
            videoContainer.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        // Handle video loading
        video.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
            loadingSpinner.style.display = 'none';
            video.style.opacity = '1';
        });

        // Close button functionality
        const closeBtn = titleBar.querySelector('.close-video-btn');
        closeBtn.addEventListener('click', closeVideo);
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeVideo();
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyPress);

        function handleKeyPress(e) {
            if (e.key === 'Escape') closeVideo();
            if (e.key === ' ') {
                e.preventDefault();
                if (video.paused) video.play();
                else video.pause();
            }
        }

        function closeVideo() {
            console.log('Closing video');
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            videoContainer.style.opacity = '0';
            videoContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
            
            setTimeout(() => {
                document.removeEventListener('keydown', handleKeyPress);
                overlay.remove();
            }, 300);
        }
    };
}

// Ensure the Material Icons font is loaded
const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';
document.head.appendChild(linkElement);

// Add required CSS with improved styles
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
    }
    
    .spinner {
        animation: spin 1s linear infinite;
    }
    
    .spinner .material-symbols-outlined {
        font-size: 48px;
        color: #fff;
    }
    
    .video-title-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background-color: rgba(0, 0, 0, 0.8);
        color: #fff;
    }
    
    .video-title {
        font-size: 18px;
        font-weight: 500;
        font-family: 'Helvetica Neue', Arial, sans-serif;
        letter-spacing: 0.5px;
    }
    
    .close-video-btn {
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .close-video-btn:hover {
        background-color: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }
    
    .close-video-btn:focus {
        outline: 2px solid #fff;
        outline-offset: 2px;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Wait for DOM to be ready before setting up video popups
document.addEventListener('DOMContentLoaded', () => {
    console.log('Setting up video popups...');
    setupVideoPopup('memory-1', 'medias/video-1.mp4');
    setupVideoPopup('memory-2', 'medias/video-1.mp4');
    setupVideoPopup('memory-3', 'medias/video-1.mp4');
    setupVideoPopup('memory-4', 'medias/video-1.mp4');
    setupVideoPopup('memory-5', 'medias/video-1.mp4');
    setupVideoPopup('memory-6', 'medias/video-1.mp4');
});

// Menu Navigation
document.addEventListener('DOMContentLoaded', function() {
    const menu = document.querySelector('.menu');
    const prevBtn = document.querySelector('.menu-nav-btn.prev');
    const nextBtn = document.querySelector('.menu-nav-btn.next');

    if (menu && prevBtn && nextBtn) {
        // Initially hide prev button if at start
        prevBtn.style.display = menu.scrollLeft <= 0 ? 'none' : 'flex';

        // Hide navigation buttons on mobile
        function updateNavButtonsVisibility() {
            if (window.innerWidth < 600) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                // Show/hide based on scroll position
                prevBtn.style.display = menu.scrollLeft <= 0 ? 'none' : 'flex';
                nextBtn.style.display = 
                    menu.scrollLeft >= menu.scrollWidth - menu.clientWidth - 10 
                    ? 'none' : 'flex';
            }
        }

        // Update buttons visibility on resize
        window.addEventListener('resize', updateNavButtonsVisibility);

        // Scroll menu on button click
        prevBtn.addEventListener('click', () => {
            menu.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            menu.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });

        // Update button visibility on scroll
        menu.addEventListener('scroll', () => {
            if (window.innerWidth >= 600) {
                prevBtn.style.display = menu.scrollLeft <= 0 ? 'none' : 'flex';
                nextBtn.style.display = 
                    menu.scrollLeft >= menu.scrollWidth - menu.clientWidth - 10 
                    ? 'none' : 'flex';
            }
        });

        // Initial check for button visibility
        updateNavButtonsVisibility();
    }
});

