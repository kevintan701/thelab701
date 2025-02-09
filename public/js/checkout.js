// Checkout Process Functions
function initializeCheckout() {
    const deliveryOptions = document.querySelectorAll('.delivery-option');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const prevButton = document.getElementById('prev-step');
    const nextButton = document.getElementById('next-step');
    const completeOrderButton = document.getElementById('complete-order');
    
    if (!deliveryOptions.length || !paymentMethods.length) return;
    
    let currentStep = 1;

    // Load cart data into checkout summary
    loadCheckoutSummary();

    // Initialize delivery options
    deliveryOptions.forEach(option => {
        option.addEventListener('click', () => {
            deliveryOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            const method = option.dataset.method;
            const deliveryFields = document.getElementById('delivery-fields');
            const pickupFields = document.getElementById('pickup-fields');
            
            if (method === 'delivery') {
                deliveryFields.style.display = 'block';
                pickupFields.style.display = 'none';
            } else {
                deliveryFields.style.display = 'none';
                pickupFields.style.display = 'block';
            }
        });
    });

    // Initialize payment methods
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            method.classList.add('selected');
            
            const cardDetails = document.getElementById('card-details');
            if (method.dataset.method === 'credit' || method.dataset.method === 'debit') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });

    // Navigation buttons
    prevButton.addEventListener('click', () => {
        if (currentStep > 1) {
            updateCheckoutStep(--currentStep);
        }
    });

    nextButton.addEventListener('click', () => {
        if (validateCurrentStep(currentStep)) {
            if (currentStep < 4) {
                updateCheckoutStep(++currentStep);
            }
        }
    });

    completeOrderButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (validateCurrentStep(currentStep)) {
            submitOrder();
        }
    });
}

function updateCheckoutStep(step) {
    const steps = document.querySelectorAll('.checkout-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const prevButton = document.getElementById('prev-step');
    const nextButton = document.getElementById('next-step');
    const completeOrderButton = document.getElementById('complete-order');

    // Update steps visibility
    steps.forEach((s, index) => {
        s.classList.remove('active');
        if (index + 1 === step) {
            s.classList.add('active');
        }
    });

    // Update progress indicator
    progressSteps.forEach((p, index) => {
        p.classList.remove('active', 'completed');
        if (index + 1 === step) {
            p.classList.add('active');
        } else if (index + 1 < step) {
            p.classList.add('completed');
        }
    });

    // Update navigation buttons
    prevButton.style.display = step === 1 ? 'none' : 'block';
    nextButton.style.display = step === 4 ? 'none' : 'block';
    completeOrderButton.style.display = step === 4 ? 'block' : 'none';

    // Update review section if on last step
    if (step === 4) {
        updateReviewSection();
    }
}

function validateCurrentStep(step) {
    switch(step) {
        case 1:
            return validateDeliveryMethod();
        case 2:
            return validateInformation();
        case 3:
            return validatePayment();
        case 4:
            return true;
        default:
            return false;
    }
}

function validateDeliveryMethod() {
    const selectedMethod = document.querySelector('.delivery-option.selected');
    if (!selectedMethod) {
        alert('Please select a delivery method');
        return false;
    }
    return true;
}

function validateInformation() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    if (!name || !email || !phone) {
        alert('Please fill in all required fields');
        return false;
    }

    const deliveryMethod = document.querySelector('.delivery-option.selected').dataset.method;
    if (deliveryMethod === 'delivery') {
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zipcode = document.getElementById('zipcode').value;
        if (!address || !city || !zipcode) {
            alert('Please fill in all delivery information');
            return false;
        }
    } else {
        const pickupTime = document.getElementById('pickup-time').value;
        if (!pickupTime) {
            alert('Please select a pickup time');
            return false;
        }
    }

    return true;
}

function validatePayment() {
    const selectedMethod = document.querySelector('.payment-method.selected');
    if (!selectedMethod) {
        alert('Please select a payment method');
        return false;
    }

    if (selectedMethod.dataset.method === 'credit' || selectedMethod.dataset.method === 'debit') {
        const card = document.getElementById('card').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!card || !expiry || !cvv) {
            alert('Please fill in all card details');
            return false;
        }
    }

    return true;
}

function updateReviewSection() {
    const deliveryMethod = document.querySelector('.delivery-option.selected');
    const paymentMethod = document.querySelector('.payment-method.selected');
    
    if (document.getElementById('review-delivery-method')) {
        document.getElementById('review-delivery-method').textContent = 
            deliveryMethod ? deliveryMethod.querySelector('p').textContent : '';
    }
    
    if (document.getElementById('review-contact')) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        let contactInfo = `Name: ${name}<br>Email: ${email}<br>Phone: ${phone}`;
        
        const deliveryType = deliveryMethod?.dataset.method;
        if (deliveryType === 'delivery') {
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const zipcode = document.getElementById('zipcode').value;
            contactInfo += `<br>Address: ${address}<br>City: ${city}<br>ZIP: ${zipcode}`;
        } else if (deliveryType === 'pickup') {
            const pickupTime = document.getElementById('pickup-time').value;
            contactInfo += `<br>Pickup Time: ${pickupTime}`;
        }
        
        document.getElementById('review-contact').innerHTML = contactInfo;
    }
    
    if (document.getElementById('review-payment')) {
        document.getElementById('review-payment').textContent = 
            paymentMethod ? paymentMethod.querySelector('p').textContent : '';
    }
}

function submitOrder() {
    const deliveryMethod = document.querySelector('.delivery-option.selected');
    const paymentMethod = document.querySelector('.payment-method.selected');
    const savedCart = JSON.parse(localStorage.getItem('checkoutCart')) || {};
    
    const orderData = {
        customerInfo: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            ...(deliveryMethod.dataset.method === 'delivery' ? {
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                zipcode: document.getElementById('zipcode').value
            } : {
                pickupTime: document.getElementById('pickup-time').value
            })
        },
        deliveryMethod: deliveryMethod.dataset.method,
        paymentMethod: paymentMethod.dataset.method,
        cart: savedCart
    };

    // Show success modal
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Clear cart data
        localStorage.removeItem('checkoutCart');
        localStorage.removeItem('shoppingCart');
        
        // Update cart UI if available
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
        
        // Add event listener to close modal and redirect
        const returnHomeButton = modal.querySelector('.primary-button');
        if (returnHomeButton) {
            returnHomeButton.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    }
}

// Initialize checkout process when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Checkout page loaded');
    if (window.location.pathname.includes('checkout.html')) {
        console.log('Initializing checkout process');
        
        // Load cart data from localStorage
        const savedCart = localStorage.getItem('shoppingCart');
        console.log('Cart data from localStorage:', savedCart);
        
        // Set checkoutCart to match current shopping cart
        localStorage.setItem('checkoutCart', savedCart);
        console.log('Updated checkoutCart:', localStorage.getItem('checkoutCart'));
        
        // Initialize checkout process
        initializeCheckout();
        
        // Ensure cart data is loaded in the summary
        console.log('Loading checkout summary');
        loadCheckoutSummary();
        
        // Set up real-time updates when cart changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'shoppingCart') {
                console.log('Cart updated, refreshing checkout summary');
                localStorage.setItem('checkoutCart', e.newValue);
                loadCheckoutSummary();
            }
        });
    }
});

// Function to load checkout summary
function loadCheckoutSummary() {
    console.log('Starting loadCheckoutSummary');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotalCups = document.getElementById('checkout-total-cups');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');
    
    console.log('Elements found:', {
        checkoutItems: !!checkoutItems,
        checkoutTotalCups: !!checkoutTotalCups,
        checkoutTotalPrice: !!checkoutTotalPrice
    });
    
    if (!checkoutItems || !checkoutTotalCups || !checkoutTotalPrice) {
        console.log('Required elements not found');
        return;
    }
    
    // Always use the latest cart data
    const savedCart = JSON.parse(localStorage.getItem('shoppingCart')) || {};
    console.log('Parsed cart data:', savedCart);
    
    let total = 0;
    let totalCups = 0;

    // Define image mapping for products
    const imageMap = {
        'Americano 701': ['medias/americano-1.jpeg', 'medias/americano-2.jpeg', 'medias/americano-3.jpeg'],
        'Cold Brew 701': ['medias/coldbrew-1.jpeg', 'medias/coldbrew-2.jpeg'],
        'Latte 701': ['medias/latte-1.jpeg', 'medias/latte-2.jpeg', 'medias/latte-3.jpeg', 'medias/latte-4.jpeg'],
        'Special 701': ['medias/special-1.jpeg', 'medias/special-2.jpeg', 'medias/special-3.jpeg', 'medias/special-4.jpeg']
    };
    
    checkoutItems.innerHTML = '';
    
    Object.entries(savedCart).forEach(([product, details]) => {
        console.log('Processing product:', product, details);
        const productElement = document.createElement('div');
        productElement.className = 'checkout-product';
        
        details.customizations.forEach(customization => {
            total += customization.qty * customization.price;
            totalCups += customization.qty;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'checkout-item';
            
            // Get random image for the product
            const productImages = imageMap[product] || [];
            const randomImage = productImages[Math.floor(Math.random() * productImages.length)];
            
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
            
            itemElement.innerHTML = `
                <div class="checkout-item-details">
                    <div class="checkout-item-image">
                        <img src="${randomImage}" alt="${product}">
                    </div>
                    <div class="checkout-item-info">
                        <div class="checkout-item-name">${product}</div>
                        <div class="checkout-item-customization">
                            ${customizationText}
                        </div>
                        <div class="checkout-item-price">
                            $${customization.price.toFixed(2)} × ${customization.qty}
                        </div>
                    </div>
                </div>
            `;
            productElement.appendChild(itemElement);
        });
        
        checkoutItems.appendChild(productElement);
    });
    
    console.log('Final totals:', { totalCups, total });
    checkoutTotalCups.textContent = totalCups;
    checkoutTotalPrice.textContent = total.toFixed(2);
} 