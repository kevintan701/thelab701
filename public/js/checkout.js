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
            const cashPaymentOption = document.querySelector('.payment-method[data-method="cash"]');
            
            if (method === 'delivery') {
                deliveryFields.style.display = 'block';
                pickupFields.style.display = 'none';
                // Hide cash payment option for delivery
                if (cashPaymentOption) {
                    cashPaymentOption.style.display = 'none';
                }
                // Update tracking step text for delivery
                if (document.getElementById('delivery-step-text')) {
                    document.getElementById('delivery-step-text').textContent = 'On The Way';
                }
                if (document.getElementById('delivery-pickup-label')) {
                    document.getElementById('delivery-pickup-label').textContent = 'Delivery';
                }
            } else {
                deliveryFields.style.display = 'none';
                pickupFields.style.display = 'block';
                // Show cash payment option for pickup
                if (cashPaymentOption) {
                    cashPaymentOption.style.display = 'block';
                }
                // Update tracking step text for pickup
                if (document.getElementById('delivery-step-text')) {
                    document.getElementById('delivery-step-text').textContent = 'Ready for Pickup';
                }
                if (document.getElementById('delivery-pickup-label')) {
                    document.getElementById('delivery-pickup-label').textContent = 'Pickup';
                }
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

    // Add trust indicators and security badges
    const checkoutForm = document.querySelector('.checkout-form');
    if (checkoutForm) {
        const trustIndicators = document.createElement('div');
        trustIndicators.className = 'trust-indicators';
        trustIndicators.innerHTML = `
            <div class="security-badges">
                <div class="badge">
                    <span class="material-symbols-outlined">security</span>
                    <span>Secure Checkout</span>
                </div>
                <div class="badge">
                    <span class="material-symbols-outlined">lock</span>
                    <span>SSL Encrypted</span>
                </div>
                <div class="badge">
                    <span class="material-symbols-outlined">verified_user</span>
                    <span>Verified by Visa</span>
                </div>
            </div>
        `;
        checkoutForm.appendChild(trustIndicators);
    }

    // Add interactive progress feedback
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach(step => {
        step.addEventListener('click', () => {
            const targetStep = parseInt(step.dataset.step);
            if (targetStep < currentStep) {
                updateCheckoutStep(targetStep);
            }
        });
    });

    // Add real-time validation feedback
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
        });
    });

    // Initialize order tracking functionality
    initializeOrderTracking();
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

function createConfetti() {
    const colors = ['#ff718d', '#fdbb2d', '#22c1c3', '#ff9a9e', '#a1c4fd'];
    const confettiCount = 150;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random initial position across the width of the screen
            const startingPosition = Math.random() * window.innerWidth;
            confetti.style.left = `${startingPosition}px`;
            
            // Random confetti color
            confetti.style.setProperty('--confetti-color', colors[Math.floor(Math.random() * colors.length)]);
            
            // Random rotation and delay
            const randomRotation = Math.random() * 360;
            const randomDelay = Math.random() * 1; // Reduced from 2s to 1s max delay
            confetti.style.transform = `rotate(${randomRotation}deg)`;
            confetti.style.animationDelay = `${randomDelay}s`;
            
            // Random size variation
            const size = 8 + Math.random() * 8; // Between 8px and 16px
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            document.body.appendChild(confetti);
            
            // Remove confetti element after animation
            setTimeout(() => {
                confetti.remove();
            }, 2500); // Reduced from 6000ms to 3000ms to match new animation duration
        }, i * 5); // Reduced from 20ms to 10ms for faster creation
    }
}

function submitOrder() {
    // Simulate order processing
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Processing your order...</p>
    `;
    document.body.appendChild(loadingOverlay);

    // Generate a unique order number
    const orderNumber = generateOrderNumber();
    
    // Generate an estimated time based on delivery method
    const isDelivery = document.querySelector('.delivery-option.selected')?.dataset.method === 'delivery';
    const estimatedMinutes = isDelivery ? 30 : 15;
    
    setTimeout(() => {
        document.body.removeChild(loadingOverlay);
        
        // Clear the cart
        cart = {};
        saveCart();
        updateCartCount();
        
        // Show success modal
        const successModal = document.getElementById('success-modal');
        successModal.style.display = 'block';

        // Update order number in the modal
        if (document.getElementById('modal-order-number')) {
            document.getElementById('modal-order-number').textContent = orderNumber;
        }

        // Add event listener to "Track Order" button
        const trackOrderBtn = document.getElementById('track-order-btn');
        if (trackOrderBtn) {
            trackOrderBtn.addEventListener('click', () => {
                // Hide success modal
                successModal.style.display = 'none';
                
                // Show order tracking interface
                const orderTrackingContainer = document.querySelector('.order-tracking-container');
                if (orderTrackingContainer) {
                    orderTrackingContainer.style.display = 'block';
                }
                
                // Initialize and update tracking info
                initializeTracking(orderNumber, estimatedMinutes, isDelivery);
            });
        }

        // Add event listener to copy order number button
        const copyOrderNumberBtn = document.getElementById('copy-order-number');
        if (copyOrderNumberBtn) {
            copyOrderNumberBtn.addEventListener('click', () => {
                const orderNumber = document.getElementById('modal-order-number').textContent;
                navigator.clipboard.writeText(orderNumber).then(() => {
                    // Create a temporary tooltip
                    const tooltip = document.createElement('div');
                    tooltip.className = 'copy-tooltip';
                    tooltip.textContent = 'Order number copied!';
                    copyOrderNumberBtn.appendChild(tooltip);
                    
                    // Remove the tooltip after 2 seconds
                    setTimeout(() => {
                        tooltip.remove();
                    }, 2000);
                });
            });
        }

        // Create confetti effect
        createConfetti();
        
        // Store the order details in localStorage
        saveOrderDetails({
            orderNumber: orderNumber,
            timestamp: new Date().toISOString(),
            deliveryMethod: document.querySelector('.delivery-option.selected')?.dataset.method || 'pickup',
            paymentMethod: document.querySelector('.payment-method.selected')?.dataset.method || 'credit',
            customerName: document.getElementById('name')?.value,
            customerEmail: document.getElementById('email')?.value,
            customerPhone: document.getElementById('phone')?.value,
            estimatedMinutes: estimatedMinutes,
            status: 'received'
        });
    }, 2000);
}

function validateInput(input) {
    const field = input.id;
    let isValid = true;
    let message = '';

    switch(field) {
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
            message = isValid ? '✅ Valid email' : 'Please enter a valid email';
            break;
        case 'phone':
            isValid = /^\d{10}$/.test(input.value.replace(/\D/g, ''));
            message = isValid ? '✅ Valid phone number' : 'Please enter a valid 10-digit phone number';
            break;
        case 'card':
            isValid = /^\d{16}$/.test(input.value.replace(/\D/g, ''));
            message = isValid ? '✅ Valid card number' : 'Please enter a valid 16-digit card number';
            break;
        // Add more validation cases as needed
    }

    // Show validation feedback
    let feedback = input.parentElement.querySelector('.validation-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'validation-feedback';
        input.parentElement.appendChild(feedback);
    }
    
    feedback.textContent = message;
    feedback.className = `validation-feedback ${isValid ? 'valid' : 'invalid'}`;
    input.classList.toggle('valid', isValid);
    input.classList.toggle('invalid', !isValid);

    return isValid;
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

// Order Tracking Functions
function initializeOrderTracking() {
    // Initialize the refresh button
    const refreshBtn = document.getElementById('refresh-tracking');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateTrackingStatus();
        });
    }
    
    // Initialize the contact support button
    const contactBtn = document.getElementById('contact-support');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            // Create a modal or form for contacting support
            alert('Our support team will contact you shortly. Thank you for your patience!');
        });
    }
}

function generateOrderNumber() {
    // Generate a unique order number with format: 701-XXXX-XXXX
    const timestamp = new Date().getTime().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `701-${timestamp.slice(0, 4)}-${random}`;
}

function initializeTracking(orderNumber, estimatedMinutes, isDelivery) {
    // Set order number
    if (document.getElementById('tracking-number')) {
        document.getElementById('tracking-number').textContent = orderNumber;
    }
    
    // Calculate and set estimated time
    const now = new Date();
    const estimatedTime = new Date(now.getTime() + estimatedMinutes * 60000);
    const timeString = estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (document.getElementById('estimated-time')) {
        document.getElementById('estimated-time').textContent = `${timeString} (${estimatedMinutes} min)`;
    }
    
    // Set order received time
    if (document.getElementById('order-received-time')) {
        document.getElementById('order-received-time').textContent = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    // Update delivery/pickup step text
    if (document.getElementById('delivery-step-text')) {
        document.getElementById('delivery-step-text').textContent = isDelivery ? 'On The Way' : 'Ready for Pickup';
    }
    
    // Simulate order progress
    simulateOrderProgress(estimatedMinutes);
}

function simulateOrderProgress(totalEstimatedMinutes) {
    // This is a simulation for demonstration purposes
    // In a real application, this would be replaced by real-time updates from a server
    
    // Calculate time intervals based on total estimated time
    const preparingTime = Math.floor(totalEstimatedMinutes * 0.3);
    const deliveryTime = Math.floor(totalEstimatedMinutes * 0.6);
    const completionTime = totalEstimatedMinutes;
    
    // Simulate preparing status
    setTimeout(() => {
        updateTrackingStep('preparing');
    }, preparingTime * 1000); // Using seconds instead of minutes for demonstration
    
    // Simulate delivery/pickup status
    setTimeout(() => {
        updateTrackingStep('delivery');
    }, deliveryTime * 1000);
    
    // Simulate completion status
    setTimeout(() => {
        updateTrackingStep('completed');
    }, completionTime * 1000);
}

function updateTrackingStep(step) {
    const trackingSteps = document.querySelectorAll('.tracking-step');
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (step === 'preparing' && trackingSteps.length > 1) {
        trackingSteps[0].classList.add('completed');
        trackingSteps[1].classList.add('active');
        if (document.getElementById('preparing-time')) {
            document.getElementById('preparing-time').textContent = timeString;
        }
    } else if (step === 'delivery' && trackingSteps.length > 2) {
        trackingSteps[1].classList.add('completed');
        trackingSteps[2].classList.add('active');
        if (document.getElementById('delivery-time')) {
            document.getElementById('delivery-time').textContent = timeString;
        }
    } else if (step === 'completed' && trackingSteps.length > 3) {
        trackingSteps[2].classList.add('completed');
        trackingSteps[3].classList.add('active');
        if (document.getElementById('completed-time')) {
            document.getElementById('completed-time').textContent = timeString;
        }
    }
    
    // Update status in localStorage
    const orderDetails = getOrderDetails();
    if (orderDetails) {
        orderDetails.status = step;
        saveOrderDetails(orderDetails);
    }
}

function updateTrackingStatus() {
    // In a real application, this would fetch the latest status from the server
    // For demonstration, we'll just simulate progress
    
    const trackingSteps = document.querySelectorAll('.tracking-step');
    let currentActive = -1;
    
    // Find the current active step
    trackingSteps.forEach((step, index) => {
        if (step.classList.contains('active') && !step.classList.contains('completed')) {
            currentActive = index;
        }
    });
    
    // Move to the next step if not completed
    if (currentActive >= 0 && currentActive < trackingSteps.length - 1) {
        const nextStep = ['received', 'preparing', 'delivery', 'completed'][currentActive + 1];
        updateTrackingStep(nextStep);
    }
}

function saveOrderDetails(orderDetails) {
    localStorage.setItem('currentOrder', JSON.stringify(orderDetails));
}

function getOrderDetails() {
    const orderData = localStorage.getItem('currentOrder');
    return orderData ? JSON.parse(orderData) : null;
} 