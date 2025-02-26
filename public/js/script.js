// JavaScript for Kevin's Final Project - THE.LAB.701 website

// ==============================================
// Global Variables and State Management
// ==============================================
let cart = {};
let currentTrackIndex = 0;
let isPlaying = false;
let player = null;

// ==============================================
// Music Player Configuration and Functions
// ==============================================
const playlist = [
    {
        name: "Enjoy Your Cozy Morning",
        youtubeId: "r3GcGPr5Bxk",
        thumbnail: "medias/Cover-M1.png"
    },
    {
        name: "Your Fresh Groove",
        youtubeId: "QelOR3Yf3mI",
        thumbnail: "medias/Cover-M2.png"
    },
    {
        name: "A new Start, A new Space",
        youtubeId: "DTfYN61kmS8",
        thumbnail: "medias/Cover-M3.png"
    },
    {
        name: "6 AM",
        youtubeId: "kGnc77jVGyY",
        thumbnail: "medias/Cover-M4.png"
    },
    {
        name: "Going Somewhere Warm With you",
        youtubeId: "_P2khewAx6Q",
        thumbnail: "medias/Cover-M5.png"
    }
];

// Store player state in localStorage
function savePlayerState() {
    const playerState = {
        currentTrackIndex,
        isPlaying: player ? player.getPlayerState() === YT.PlayerState.PLAYING : false,
        currentTime: player ? player.getCurrentTime() : 0,
        wasPlayingBeforeNavigation: isPlaying
    };
    localStorage.setItem('playerState', JSON.stringify(playerState));
}

// Load player state from localStorage
function loadPlayerState() {
    const savedState = localStorage.getItem('playerState');
    if (savedState) {
        const state = JSON.parse(savedState);
        currentTrackIndex = state.currentTrackIndex;
        isPlaying = state.wasPlayingBeforeNavigation;
        return state;
    }
    return null;
}

// Initialize YouTube IFrame API
function initYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Called automatically by YouTube API when ready
window.onYouTubeIframeAPIReady = function() {
    const savedState = loadPlayerState();
    
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: playlist[currentTrackIndex].youtubeId,
        playerVars: {
            'autoplay': savedState?.wasPlayingBeforeNavigation ? 1 : 0,
            'controls': 0,
            'disablekb': 1,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0,
            'fs': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

// Handle player ready event
function onPlayerReady(event) {
    const savedState = loadPlayerState();
    if (savedState) {
        player.seekTo(savedState.currentTime, true);
        if (savedState.wasPlayingBeforeNavigation) {
            player.playVideo();
        } else {
            player.pauseVideo();
        }
    }
    updateTrackInfo();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        playNext();
    }
    updatePlayPauseButton();
    savePlayerState();
}

function updatePlayPauseButton() {
    const playPauseBtn = document.querySelector('#play-pause');
    if (!playPauseBtn) return;

    if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
        playPauseBtn.textContent = 'pause_circle';
        isPlaying = true;
    } else {
        playPauseBtn.textContent = 'play_circle';
        isPlaying = false;
    }
    savePlayerState();
}

function togglePlay() {
    if (!player) return;

    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
    isPlaying = !isPlaying;
    updatePlayPauseButton();
    savePlayerState();
}

function playNext() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadAndPlayTrack();
    savePlayerState();
}

function playPrevious() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadAndPlayTrack();
    savePlayerState();
}

function loadAndPlayTrack() {
    const track = playlist[currentTrackIndex];
    player.loadVideoById(track.youtubeId);
    updateTrackInfo();
    savePlayerState();
}

function updateTrackInfo() {
    const track = playlist[currentTrackIndex];
    const trackName = document.querySelector('#track-name');
    const thumbnail = document.querySelector('#track-thumbnail');
    
    if (trackName) trackName.textContent = track.name;
    if (thumbnail) thumbnail.src = track.thumbnail;
}

// Save player state before page unload
window.addEventListener('beforeunload', () => {
    savePlayerState();
});

// ==============================================
// Shopping Cart Functions
// ==============================================
function saveCart() {
    try {
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

function loadCart() {
    try {
        const savedCart = localStorage.getItem("shoppingCart");
        cart = savedCart ? JSON.parse(savedCart) : {};
        updateCartDropdown();
        updateCartCount();
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = {};
    }
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;
    
    const count = Object.values(cart).reduce((acc, { customizations }) => 
        acc + customizations.reduce((acc, { qty }) => acc + qty, 0), 0);
    cartCountElement.textContent = count;
}

function toggleCartDropdown() {
    const cartDropdown = document.getElementById('cart-dropdown');
    if (!cartDropdown) return;
    
    const mainContent = document.querySelector('main');
    const footerContent = document.querySelector('footer');
    
    if (cartDropdown.style.display === 'block') {
        cartDropdown.style.display = 'none';
        if (mainContent) mainContent.style.filter = '';
        if (footerContent) footerContent.style.filter = '';
    } else {
        cartDropdown.style.display = 'block';
        if (mainContent) mainContent.style.filter = 'blur(4px)';
        if (footerContent) footerContent.style.filter = 'blur(4px)';
        updateCartDropdown(); // Refresh cart contents when showing
    }
}

function closeCart() {
    const cartDropdown = document.getElementById('cart-dropdown');
    const mainContent = document.querySelector('main');
    const footerContent = document.querySelector('footer');

    cartDropdown.style.display = 'none';
    mainContent.style.filter = '';
    footerContent.style.filter = '';
}

function updateCartDropdown() {
    const cartItemsList = document.getElementById('cart-items-list');
    if (!cartItemsList) return;

    cartItemsList.innerHTML = '';
    let total = 0;
    let totalCups = 0;

    Object.entries(cart).forEach(([product, details]) => {
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

            let customizationText = '';
            if (product === 'Special 701') {
                const milk = customization.milk.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                const sweetness = customization.sweetness.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                const temp = customization.temperature.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                customizationText = `${milk} • ${sweetness} • ${temp}`;
            } else {
                const milkText = customization.milk.toLowerCase() === 'none' ? 'No Milk' : 
                    customization.milk.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                const sweetnessText = customization.sweetness.toLowerCase() === 'none' ? 'No Sugar' :
                    customization.sweetness.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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

// ==============================================
// Checkout Functions
// ==============================================
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

function checkoutCart() {
    const cartData = localStorage.getItem('shoppingCart');
    localStorage.setItem('checkoutCart', cartData);
    window.location.href = 'checkout.html';
}

// ==============================================
// Theme Management
// ==============================================
function applyTheme() {
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
    document.body.classList.toggle('dark-theme', isDarkTheme);

    const updateImageSource = (element, darkSrc, lightSrc) => {
        if (element) {
            element.src = isDarkTheme ? darkSrc : lightSrc;
        }
    };

    updateImageSource(document.querySelector('#logo-word-mark-home'), 'medias/Logo_Word_Mark_white.png', 'medias/Logo_Word_Mark.png');
    updateImageSource(document.querySelector('#logo-word-mark-menu'), 'medias/Logo_Word_Mark_white.png', 'medias/Logo_Word_Mark.png');
    updateImageSource(document.querySelector('#logo-word-mark-memory'), 'medias/Logo_Word_Mark_white.png', 'medias/Logo_Word_Mark.png');
    updateImageSource(document.querySelector('#logo-word-mark-about'), 'medias/Logo_Word_Mark_white.png', 'medias/Logo_Word_Mark.png');
    updateImageSource(document.querySelector('#logo-mark-home'), 'medias/Lab_Logo_white.svg', 'medias/Lab_Logo.svg');
    updateImageSource(document.querySelector('#logo-mark-about'), 'medias/Lab_Logo_white.svg', 'medias/Lab_Logo.svg');
}

function toggleTheme() {
    const isDarkTheme = !document.body.classList.contains('dark-theme');
    localStorage.setItem('isDarkTheme', isDarkTheme);
    applyTheme();
}

// ==============================================
// Navigation and UI Functions
// ==============================================
function setupNavigation(selector, url) {
    const element = document.querySelector(selector);
    if (element) {
        element.addEventListener("click", () => {
            window.location.href = url;
        });
    }
}

// ==============================================
// Menu Functions
// ==============================================
// Product reviews data
const productReviews = {
    'Americano 701': generateRandomReviews(171),
    'Cold Brew 701': generateRandomReviews(289),
    'Latte 701': generateRandomReviews(302),
    'Special 701': generateRandomReviews(568)
};

// Function to generate random reviews
function generateRandomReviews(count) {
    const reviewers = ['Coffee Lover', 'Morning Person', 'Cafe Explorer', 'Bean Enthusiast', 'Espresso Fan', 
                      'Brew Master', 'Coffee Connoisseur', 'Caffeine Addict', 'Coffee Wanderer', 'Urban Sipper'];
    const comments = [
        'Absolutely perfect! Just what I needed to start my day.',
        'The flavor profile is incredible. So well balanced!',
        'Best coffee experience in town. Will definitely come back!',
        'Love the attention to detail in every cup.',
        'Such a cozy atmosphere and amazing coffee.',
        'The baristas really know their craft. Impressed!',
        'A hidden gem with exceptional quality.',
        'The aroma alone is worth the visit.',
        'Consistently excellent. Never disappoints.',
        'Perfect temperature and amazing taste.'
    ];

    const reviews = [];
    const baseDate = new Date();
    
    for (let i = 0; i < count; i++) {
        const randomRating = Math.random() < 0.8 ? 5 : 4; // 80% chance of 5 stars, 20% chance of 4 stars
        const randomReviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
        const randomComment = comments[Math.floor(Math.random() * comments.length)];
        const randomDays = Math.floor(Math.random() * 30); // Random date within last 30 days
        const reviewDate = new Date(baseDate);
        reviewDate.setDate(reviewDate.getDate() - randomDays);
        
        reviews.push({
            name: randomReviewer,
            rating: randomRating,
            content: randomComment,
            time: reviewDate.toISOString().split('T')[0],
            likes: Math.floor(Math.random() * 50), // Random number of likes between 0 and 49
            comments: [] // Array to store user comments on this review
        });
    }
    
    // Sort reviews by date (newest first)
    return reviews.sort((a, b) => new Date(b.time) - new Date(a.time));
}

// Calculate average rating for a product
function getAverageRating(productName) {
    const reviews = productReviews[productName] || [];
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<span class="material-symbols-outlined star-filled">star</span>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<span class="material-symbols-outlined star-half">star_half</span>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<span class="material-symbols-outlined star-empty">star</span>';
    }
    
    return starsHtml;
}

// Product descriptions for the modal
const productDescriptions = {
    'Americano 701': 'A bold and smooth coffee crafted with our signature espresso shots and hot water. Perfect for those who appreciate the pure essence of coffee. Each sip delivers a rich flavor profile with subtle notes of chocolate and caramel.',
    'Cold Brew 701': 'Steeped for 12 hours in cold water, our signature cold brew offers a naturally sweet, incredibly smooth taste. Less acidic than traditional iced coffee, it delivers a refreshing caffeine kick with subtle chocolate notes.',
    'Latte 701': 'Our signature espresso harmoniously blended with steamed milk and topped with a delicate layer of foam. A perfect balance of rich espresso and creamy milk, creating a comforting and satisfying drink.',
    'Special 701': 'Our barista\'s special creation, combining premium coffee with unique ingredients. A perfect fusion of flavors that will energize your day. Each cup is crafted with care to deliver an extraordinary coffee experience.'
};

function showProductModal(product, price, images) {
    const modal = document.getElementById('product-modal');
    const modalName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-product-price');
    const modalDescription = document.getElementById('modal-product-description');
    const modalMainImage = document.getElementById('modal-main-image');
    const thumbnailContainer = document.querySelector('.thumbnail-container');
    const customizationOptions = document.querySelector('.modal-customization-options');
    const quantityInput = document.getElementById('product-quantity');
    
    // Reset quantity
    quantityInput.value = 1;
    
    // Set modal content
    modalName.textContent = product;
    modalPrice.textContent = price.toFixed(2);
    modalDescription.textContent = productDescriptions[product];
    modalMainImage.src = images[0];
    
    // Clear and populate thumbnails
    thumbnailContainer.innerHTML = '';
    images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `${product} view ${index + 1}`;
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.addEventListener('click', () => {
            modalMainImage.src = image;
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // Setup customization options
    const options = {
        milk: {
            label: 'Milk Type',
            options: product === 'Special 701' ? ['Stay Active'] :
                ['None', 'Whole Milk', 'Oat Milk (+$1)', 'Almond Milk (+$1)', 'Soy Milk (+$1)']
        },
        sweetness: {
            label: 'Sweetness',
            options: product === 'Special 701' ? ['Be Well'] :
                ['No Sugar', 'Light Sugar', 'Normal Sugar', 'Extra Sugar']
        },
        temperature: {
            label: 'Temperature',
            options: product === 'Cold Brew 701' ? ['Iced'] :
                product === 'Special 701' ? ['Be Loved'] : ['Hot', 'Warm', 'Iced']
        }
    };
    
    customizationOptions.innerHTML = '';
    Object.entries(options).forEach(([key, value]) => {
        const group = document.createElement('div');
        group.className = 'option-group';
        group.innerHTML = `
            <label for="modal-${key}-${product}">${value.label}:</label>
            <select id="modal-${key}-${product}" class="custom-select">
                ${value.options.map(option => 
                    `<option value="${option.toLowerCase().replace(' ', '_')}" ${
                        product === 'Latte 701' && key === 'milk' && option === 'Whole Milk' ? 'selected' : ''
                    }>${option}</option>`
                ).join('')}
            </select>
        `;
        customizationOptions.appendChild(group);
    });
    
    // Add reviews section
    const reviews = productReviews[product] || [];
    const averageRating = getAverageRating(product);
    
    const reviewsSection = document.createElement('div');
    reviewsSection.className = 'reviews-section';
    reviewsSection.innerHTML = `
        <h3>Customer Reviews</h3>
        <div class="reviews-header">
            <div class="star-rating">
                ${generateStarRating(averageRating)}
                <span class="rating-count">(${reviews.length} reviews)</span>
            </div>
            <button id="write-review-btn" class="write-review-btn">Write a Review</button>
        </div>
        
        <div id="review-form" class="review-form" style="display: none;">
            <h4>Write Your Review</h4>
            <div class="rating-input">
                <span>Your Rating:</span>
                <div class="star-input">
                    ${[1,2,3,4,5].map(num => `
                        <span class="material-symbols-outlined star-rate" data-rating="${num}">star</span>
                    `).join('')}
                </div>
            </div>
            <textarea id="review-content" placeholder="Share your experience with this product..." maxlength="500"></textarea>
            <div class="review-form-buttons">
                <button id="cancel-review" class="cancel-btn">Cancel</button>
                <button id="submit-review" class="submit-btn">Submit Review</button>
            </div>
        </div>

        <div class="reviews-list">
            ${reviews.slice(0, 5).map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <span class="reviewer-name">${review.name}</span>
                        <span class="review-date">${new Date(review.time).toLocaleDateString()}</span>
                    </div>
                    <div class="review-rating" style="justify-content: flex-start;">
                        ${generateStarRating(review.rating)}
                    </div>
                    <p class="review-content">${review.content}</p>
                    <div class="review-actions">
                        <button class="like-button" data-likes="${review.likes}">
                            <span class="material-symbols-outlined">favorite</span>
                            <span class="like-count">${review.likes}</span>
                        </button>
                        <button class="comment-button">
                            <span class="material-symbols-outlined">chat_bubble</span>
                            <span class="comment-count">${review.comments.length}</span>
                        </button>
                    </div>
                    <div class="review-comments" style="display: none;">
                        ${review.comments.map(comment => `
                            <div class="review-comment">
                                <p>${comment.text}</p>
                                <small>${new Date(comment.time).toLocaleDateString()}</small>
                            </div>
                        `).join('')}
                        <div class="comment-input">
                            <div class="emoji-picker">
                                <button class="emoji-btn">😊</button>
                                <button class="emoji-btn">👍</button>
                                <button class="emoji-btn">❤️</button>
                                <button class="emoji-btn">🌟</button>
                                <button class="emoji-btn">☕️</button>
                            </div>
                            <textarea placeholder="Add a comment..."></textarea>
                            <div class="comment-buttons">
                                <button class="cancel-comment">Cancel</button>
                                <button class="submit-comment">Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        ${reviews.length > 5 ? `
            <button class="load-more-reviews">Load More Reviews</button>
        ` : ''}
    `;
    
    const reviewsContainer = document.querySelector('.reviews-container');
    reviewsContainer.innerHTML = ''; // Clear any existing reviews
    reviewsContainer.appendChild(reviewsSection);

    // Setup review form functionality
    const writeReviewBtn = reviewsContainer.querySelector('#write-review-btn');
    const reviewForm = reviewsContainer.querySelector('#review-form');
    const starInputs = reviewsContainer.querySelectorAll('.star-input .star-rate');
    let selectedRating = 5;

    writeReviewBtn?.addEventListener('click', () => {
        reviewForm.style.display = 'block';
        writeReviewBtn.style.display = 'none';
    });

    reviewsContainer.querySelector('#cancel-review')?.addEventListener('click', () => {
        reviewForm.style.display = 'none';
        writeReviewBtn.style.display = 'block';
    });

    // Star rating functionality
    starInputs.forEach(star => {
        star.addEventListener('click', (e) => {
            selectedRating = parseInt(e.target.dataset.rating);
            starInputs.forEach(s => {
                if (parseInt(s.dataset.rating) <= selectedRating) {
                    s.textContent = 'star';
                    s.classList.add('selected');
                } else {
                    s.textContent = 'star';
                    s.classList.remove('selected');
                }
            });
        });
    });

    // Submit review functionality
    reviewsContainer.querySelector('#submit-review')?.addEventListener('click', () => {
        const content = reviewsContainer.querySelector('#review-content').value.trim();
        if (content) {
            const newReview = {
                name: 'Customer', // You might want to get this from user login
                rating: selectedRating,
                content: content,
                time: new Date().toISOString().split('T')[0],
                likes: 0,
                comments: []
            };
            
            reviews.unshift(newReview);
            reviewForm.style.display = 'none';
            writeReviewBtn.style.display = 'block';
            
            // Update the reviews display
            showProductModal(product, price, images);
        }
    });

    // Setup like and comment functionality
    const likeButtons = reviewsContainer.querySelectorAll('.like-button');
    const commentButtons = reviewsContainer.querySelectorAll('.comment-button');

    likeButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const likeCount = button.querySelector('.like-count');
            const currentLikes = parseInt(likeCount.textContent);
            likeCount.textContent = currentLikes + 1;
            reviews[index].likes = currentLikes + 1;
            button.classList.add('liked');
        });
    });

    commentButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const reviewCard = button.closest('.review-card');
            const commentsSection = reviewCard.querySelector('.review-comments');
            commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
        });
    });

    // Setup comment submission
    const submitCommentButtons = reviewsContainer.querySelectorAll('.submit-comment');
    submitCommentButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const reviewCard = button.closest('.review-card');
            const commentInput = reviewCard.querySelector('.comment-input textarea');
            const commentText = commentInput.value.trim();
            
            if (commentText) {
                const newComment = {
                    text: commentText,
                    time: new Date().toISOString()
                };
                
                reviews[index].comments.push(newComment);
                commentInput.value = '';
                
                // Update comment count
                const commentCount = reviewCard.querySelector('.comment-count');
                commentCount.textContent = reviews[index].comments.length;
                
                // Add new comment to display
                const commentsSection = reviewCard.querySelector('.review-comments');
                const newCommentElement = document.createElement('div');
                newCommentElement.className = 'review-comment';
                newCommentElement.innerHTML = `
                    <p>${newComment.text}</p>
                    <small>${new Date(newComment.time).toLocaleDateString()}</small>
                `;
                commentsSection.insertBefore(newCommentElement, commentsSection.querySelector('.comment-input'));
            }
        });
    });

    // Load more reviews functionality
    const loadMoreBtn = reviewsContainer.querySelector('.load-more-reviews');
    let currentlyDisplayed = 5;
    
    loadMoreBtn?.addEventListener('click', () => {
        const reviewsList = reviewsContainer.querySelector('.reviews-list');
        const nextBatch = reviews.slice(currentlyDisplayed, currentlyDisplayed + 5);
        
        nextBatch.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-card';
            reviewElement.innerHTML = `
                <div class="review-header">
                    <span class="reviewer-name">${review.name}</span>
                    <span class="review-date">${new Date(review.time).toLocaleDateString()}</span>
                </div>
                <div class="review-rating" style="justify-content: flex-start;">
                    ${generateStarRating(review.rating)}
                </div>
                <p class="review-content">${review.content}</p>
                <div class="review-actions">
                    <button class="like-button" data-likes="${review.likes}">
                        <span class="material-symbols-outlined">favorite</span>
                        <span class="like-count">${review.likes}</span>
                    </button>
                    <button class="comment-button">
                        <span class="material-symbols-outlined">chat_bubble</span>
                        <span class="comment-count">${review.comments.length}</span>
                    </button>
                </div>
                <div class="review-comments" style="display: none;">
                    ${review.comments.map(comment => `
                        <div class="review-comment">
                            <p>${comment.text}</p>
                            <small>${new Date(comment.time).toLocaleDateString()}</small>
                        </div>
                    `).join('')}
                    <div class="comment-input">
                        <div class="emoji-picker">
                            <button class="emoji-btn">😊</button>
                            <button class="emoji-btn">👍</button>
                            <button class="emoji-btn">❤️</button>
                            <button class="emoji-btn">🌟</button>
                            <button class="emoji-btn">☕️</button>
                        </div>
                        <textarea placeholder="Add a comment..."></textarea>
                        <div class="comment-buttons">
                            <button class="cancel-comment">Cancel</button>
                            <button class="submit-comment">Post</button>
                        </div>
                    </div>
                </div>
            `;
            reviewsList.appendChild(reviewElement);
        });
        
        currentlyDisplayed += 5;
        if (currentlyDisplayed >= reviews.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
    
    // Setup add to cart button
    const addToCartBtn = document.getElementById('modal-add-to-cart');
    addToCartBtn.onclick = () => {
        const quantity = parseInt(quantityInput.value);
        const milk = document.getElementById(`modal-milk-${product}`).value;
        const sweetness = document.getElementById(`modal-sweetness-${product}`).value;
        const temperature = document.getElementById(`modal-temperature-${product}`).value;
        
        // Add to cart multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(product, price, milk, sweetness, temperature);
        }
        
        // Close modal after adding to cart
        modal.style.display = 'none';
    };
    
    // Show modal
    modal.style.display = 'block';
    
    // Close modal when clicking outside
    modal.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Close modal with close button
    document.getElementById('close-modal').onclick = () => {
        modal.style.display = 'none';
    };
    
    // Setup quantity buttons
    document.getElementById('decrease-qty').onclick = () => {
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    };
    
    document.getElementById('increase-qty').onclick = () => {
        if (quantityInput.value < 10) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        }
    };

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });

    // Add touch swipe support for image gallery
    let touchStartX = 0;
    let touchEndX = 0;
    
    modalMainImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    modalMainImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const currentIndex = images.findIndex(img => img === modalMainImage.src);
        if (touchEndX < touchStartX && currentIndex < images.length - 1) {
            // Swipe left - next image
            const nextImage = images[currentIndex + 1];
            modalMainImage.src = nextImage;
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            document.querySelectorAll('.thumbnail')[currentIndex + 1].classList.add('active');
        }
        if (touchEndX > touchStartX && currentIndex > 0) {
            // Swipe right - previous image
            const prevImage = images[currentIndex - 1];
            modalMainImage.src = prevImage;
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            document.querySelectorAll('.thumbnail')[currentIndex - 1].classList.add('active');
        }
    }

    // Add emoji button functionality
    reviewsContainer.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const commentInput = btn.closest('.comment-input').querySelector('textarea');
            commentInput.value += btn.textContent;
        });
    });

    // Add cancel comment functionality
    reviewsContainer.querySelectorAll('.cancel-comment').forEach(btn => {
        btn.addEventListener('click', () => {
            const commentInput = btn.closest('.comment-input');
            commentInput.querySelector('textarea').value = '';
            btn.closest('.review-comments').style.display = 'none';
        });
    });
}

function addToCart(product, basePrice, milkType, sweetness, temperature) {
    const extraCharge = milkType.includes('milk') && !milkType.includes('whole') ? 1.00 : 0;
    const totalPrice = basePrice + extraCharge;
    
    if (cart[product]) {
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

// ==============================================
// Memory Gallery Video Functions
// ==============================================
function setupMemoryGallery() {
    const categories = [
        {
            title: 'Exploring',
            description: 'Discovering positive energy in coffee, good weather, and friendly moments around the world',
            images: Array.from({ length: 8 }, (_, i) => `exploring-${i + 1}`),
            quotes: [
                "Every cup of coffee is a moment of possibility.",
                "Find beauty in the simple moments.",
                "Life is better with friends and coffee.",
                "Embrace the warmth of each new day.",
                "Let your spirit shine as bright as morning coffee.",
                "Adventure awaits with every new discovery.",
                "Cherish the journey, not just the destination.",
                "Every moment is a chance to explore something new."
            ]
        },
        {
            title: 'Creating',
            description: 'Transforming real-world inspiration into digital artistry',
            images: Array.from({ length: 9 }, (_, i) => `creating-${i + 1}`),
            quotes: [
                "Where imagination meets reality.",
                "Crafting dreams into digital reality.",
                "Every pixel tells a story.",
                "Innovation starts with inspiration.",
                "Art is the bridge between vision and reality.",
                "Design is intelligence made visible.",
                "Creativity takes courage.",
                "Make it simple but significant.",
                "The details make the design."
            ]
        },
        {
            title: 'Sharing',
            description: 'Spreading joy through handwritten messages and shared moments',
            images: Array.from({ length: 7 }, (_, i) => `sharing-${i + 1}`),
            quotes: [
                "Share happiness, one cup at a time.",
                "Words of kindness, written with love.",
                "Making memories, one message at a time.",
                "Connecting hearts through coffee.",
                "Every cup tells a story of connection.",
                "Joy multiplies when it's shared.",
                "Together is a beautiful place to be."
            ]
        }
    ];

    const memoryGallery = document.querySelector('.memory-gallery');
    if (!memoryGallery) return;

    // Clear existing content
    memoryGallery.innerHTML = '';

    // Create categories
    categories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'memory-category';

        // Category info
        const categoryInfo = document.createElement('div');
        categoryInfo.className = 'category-info';

        const categoryTitle = document.createElement('h2');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category.title;

        const categoryDescription = document.createElement('p');
        categoryDescription.className = 'category-description';
        categoryDescription.textContent = category.description;

        categoryInfo.appendChild(categoryTitle);
        categoryInfo.appendChild(categoryDescription);

        // Slideshow container
        const slideshowContainer = document.createElement('div');
        slideshowContainer.className = 'slideshow-container';

        const slides = document.createElement('div');
        slides.className = `slides ${category.title.toLowerCase()}-slides`;

        // Create slides
        category.images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            if (index === 0) slide.classList.add('active');

            const img = document.createElement('img');
            // Try different image formats with error handling
            img.onerror = function() {
                // If one format fails, try another
                const currentSrc = this.src;
                if (currentSrc.endsWith('.JPG')) {
                    this.src = currentSrc.replace('.JPG', '.jpg');
                } else if (currentSrc.endsWith('.jpg')) {
                    this.src = currentSrc.replace('.jpg', '.png');
                } else if (currentSrc.endsWith('.png')) {
                    this.src = currentSrc.replace('.png', '.jpeg');
                } else if (currentSrc.endsWith('.jpeg')) {
                    // If all formats fail, use a placeholder
                    this.src = 'medias/placeholder.jpg';
                    console.warn(`Could not load image: ${image}`);
                }
            };
            
            // Initial source attempt
            img.src = `medias/${image}.JPG`;
            img.alt = `${category.title} moment ${index + 1}`;

            const slideContent = document.createElement('div');
            slideContent.className = 'slide-content';

            const quote = document.createElement('p');
            quote.className = 'quote';
            quote.textContent = category.quotes[index];

            slideContent.appendChild(quote);
            slide.appendChild(img);
            slide.appendChild(slideContent);
            slides.appendChild(slide);
        });

        const slideshowNav = document.createElement('div');
        slideshowNav.className = 'slideshow-nav';

        const prevButton = document.createElement('button');
        prevButton.className = 'prev';
        prevButton.innerHTML = '‹';
        prevButton.setAttribute('aria-label', 'Previous slide');

        const nextButton = document.createElement('button');
        nextButton.className = 'next';
        nextButton.innerHTML = '›';
        nextButton.setAttribute('aria-label', 'Next slide');

        slideshowNav.appendChild(prevButton);
        slideshowNav.appendChild(nextButton);

        slideshowContainer.appendChild(slides);
        slideshowContainer.appendChild(slideshowNav);

        categorySection.appendChild(categoryInfo);
        categorySection.appendChild(slideshowContainer);

        memoryGallery.appendChild(categorySection);
    });

    // Initialize slideshows
    setupSlideshows();
}

// ==============================================
// Memory Page Slideshow
// ==============================================
function setupSlideshows() {
    const slideshowContainers = document.querySelectorAll('.slideshow-container');
    
    slideshowContainers.forEach(container => {
        const slides = container.querySelector('.slides');
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        let currentSlide = 0;
        const autoplayDuration = 7000; // Increased to 7 seconds for better user experience
        
        // Get the total number of slides for this specific slideshow
        const slideElements = container.querySelectorAll('.slide');
        const totalSlides = slideElements.length;
        
        // Create indicator dots
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'slide-indicators';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'slide-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoplay();
            });
            indicatorsContainer.appendChild(dot);
        }
        
        container.appendChild(indicatorsContainer);
        
        // Mark first slide as active
        slideElements[0].classList.add('active');
        
        // Function to move to a specific slide
        function goToSlide(slideIndex) {
            // Remove active class from all slides
            slideElements.forEach(slide => slide.classList.remove('active'));
            
            // Update dots
            const dots = container.querySelectorAll('.slide-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === slideIndex);
            });
            
            // Add active class to current slide
            slideElements[slideIndex].classList.add('active');
            
            currentSlide = slideIndex;
            const offset = -currentSlide * 100; // 100% per slide
            slides.style.transform = `translateX(${offset}%)`;
        }

        // Function to go to next slide
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }

        // Function to go to previous slide
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(currentSlide);
        }

        // Setup click handlers
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
        
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });

        // Setup autoplay
        let autoplayInterval;
        
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, autoplayDuration);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        // Reset autoplay with consistent interval
        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        // Start autoplay initially
        startAutoplay();

        // Pause autoplay on hover
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);

        // Handle keyboard navigation
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoplay();
            }
        });

        // Handle touch events
        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        }

        // Improve accessibility
        if (prevBtn) {
            prevBtn.setAttribute('tabindex', '0');
            prevBtn.setAttribute('aria-label', 'Previous slide');
        }
        if (nextBtn) {
            nextBtn.setAttribute('tabindex', '0');
            nextBtn.setAttribute('aria-label', 'Next slide');
        }
        
        // Make slides keyboard navigable
        slideElements.forEach((slide, index) => {
            slide.setAttribute('tabindex', '0');
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${totalSlides}`);
            
            slide.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    // Toggle slide info visibility on Enter/Space
                    const content = slide.querySelector('.slide-content');
                    if (content) {
                        content.style.opacity = content.style.opacity === '1' ? '0' : '1';
                        content.style.transform = content.style.opacity === '1' ? 'translateY(0)' : 'translateY(20px)';
                    }
                }
            });
        });
    });
}

// ==============================================
// Memory Page Video Banner Controls
// ==============================================
function setupMemoryVideoControls() {
    const videoBanner = document.querySelector('.video-banner');
    if (!videoBanner) return;
    
    const video = document.getElementById('memory-banner-video');
    const overlay = document.querySelector('.video-overlay');
    
    // Create video controls
    const videoControls = document.createElement('div');
    videoControls.className = 'video-controls';
    
    // Play/pause button
    const playPauseBtn = document.createElement('button');
    playPauseBtn.className = 'video-control-btn';
    playPauseBtn.innerHTML = '<span class="material-symbols-outlined">pause</span>';
    playPauseBtn.setAttribute('aria-label', 'Pause video');
    
    // Mute/unmute button - Set initial state to reflect video's muted attribute
    const muteBtn = document.createElement('button');
    muteBtn.className = 'video-control-btn';
    
    // Function to update mute button state
    function updateMuteButtonState() {
        if (video.muted) {
            muteBtn.innerHTML = '<span class="material-symbols-outlined">volume_off</span>';
            muteBtn.setAttribute('aria-label', 'Unmute video');
        } else {
            muteBtn.innerHTML = '<span class="material-symbols-outlined">volume_up</span>';
            muteBtn.setAttribute('aria-label', 'Mute video');
        }
    }
    
    // Set initial state
    updateMuteButtonState();
    
    // Add buttons to controls
    videoControls.appendChild(playPauseBtn);
    videoControls.appendChild(muteBtn);
    
    // Add controls to banner
    videoBanner.appendChild(videoControls);
    
    // Create scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    
    const scrollIcon = document.createElement('div');
    scrollIcon.className = 'scroll-icon';
    
    const scrollText = document.createElement('div');
    scrollText.className = 'scroll-text';
    scrollText.textContent = 'Scroll to explore';
    
    scrollIndicator.appendChild(scrollIcon);
    scrollIndicator.appendChild(scrollText);
    
    videoBanner.appendChild(scrollIndicator);
    
    // Function to update play/pause button state based on video state
    function updatePlayPauseButtonState() {
        if (video.paused) {
            playPauseBtn.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
            playPauseBtn.setAttribute('aria-label', 'Play video');
        } else {
            playPauseBtn.innerHTML = '<span class="material-symbols-outlined">pause</span>';
            playPauseBtn.setAttribute('aria-label', 'Pause video');
        }
    }
    
    // Set up event listeners
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            updatePlayPauseButtonState();
        } else {
            video.pause();
            updatePlayPauseButtonState();
        }
    });
    
    // Listen for play and pause events directly from the video element
    video.addEventListener('play', updatePlayPauseButtonState);
    video.addEventListener('pause', updatePlayPauseButtonState);
    
    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        updateMuteButtonState();
    });
    
    // Listen for volumechange event to update mute button
    video.addEventListener('volumechange', updateMuteButtonState);
    
    // Hide controls and scroll indicator when scrolling down
    window.addEventListener('scroll', () => {
        if (window.scrollY > videoBanner.offsetHeight / 2) {
            videoControls.style.opacity = '0';
            scrollIndicator.style.opacity = '0';
        } else {
            videoControls.style.opacity = '';
            scrollIndicator.style.opacity = '';
        }
    });
    
    // Handle video playback based on visibility
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && !video.paused) {
                video.pause();
                // Button state will be updated by the pause event listener
            } else if (entry.isIntersecting && video.paused && entry.intersectionRatio > 0.5) {
                video.play().then(() => {
                    // Successfully started playing
                    updatePlayPauseButtonState();
                }).catch(() => {
                    // Autoplay prevented
                    updatePlayPauseButtonState();
                });
            }
        });
    }, { threshold: [0.25, 0.5, 0.75] });
    
    observer.observe(videoBanner);
}

// ==============================================
// Memory Page Sub-Navigation
// ==============================================
function setupMemorySubNav() {
    const subNavLinks = document.querySelectorAll('.memory-nav .sub-nav-link');
    const memoryCategories = document.querySelectorAll('.memory-category');
    
    if (!subNavLinks.length || !memoryCategories.length) return;
    
    // Add IDs to categories for navigation
    memoryCategories.forEach((category, index) => {
        const titleText = category.querySelector('.category-title').textContent.toLowerCase();
        category.id = titleText;
    });
    
    // Handle navigation clicks
    subNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            subNavLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get target section from href
            const targetId = link.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Scroll to the target with smooth behavior
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the target section briefly
                targetElement.classList.add('highlight');
                setTimeout(() => {
                    targetElement.classList.remove('highlight');
                }, 1500);
            }
        });
    });
    
    // Handle scroll spy for sub-nav
    function updateActiveLink() {
        let foundActive = false;
        
        // Check each section in reverse to find the one that's most in view
        [...memoryCategories].reverse().forEach(section => {
            if (foundActive) return;
            
            const rect = section.getBoundingClientRect();
            const isVisible = (
                rect.top <= 200 && // Consider section "active" when it's near the top
                rect.bottom >= 200
            );
            
            if (isVisible) {
                foundActive = true;
                const id = section.id;
                
                // Update active nav link
                subNavLinks.forEach(link => {
                    const linkTarget = link.getAttribute('href').slice(1);
                    if (linkTarget === id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveLink);
}

// ==============================================
// Memory Comment Form
// ==============================================
function setupMemoryCommentForm() {
    const commentForm = document.getElementById('memory-comment-form');
    if (!commentForm) return;
    
    const stars = document.querySelectorAll('.rating-input .star');
    const ratingInput = document.getElementById('rating');
    
    // Handle star rating
    stars.forEach(star => {
        // Hover effect
        star.addEventListener('mouseenter', () => {
            const value = parseInt(star.getAttribute('data-value'));
            
            // Update the appearance of stars on hover
            stars.forEach(s => {
                const starValue = parseInt(s.getAttribute('data-value'));
                if (starValue <= value) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        // Click to select rating
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            ratingInput.value = value;
            
            // Update the appearance of stars permanently
            stars.forEach(s => {
                const starValue = parseInt(s.getAttribute('data-value'));
                if (starValue <= value) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        });
    });
    
    // Reset star appearance when mouse leaves the rating container
    const ratingContainer = document.querySelector('.rating-input');
    ratingContainer.addEventListener('mouseleave', () => {
        const value = parseInt(ratingInput.value);
        
        stars.forEach(s => {
            const starValue = parseInt(s.getAttribute('data-value'));
            s.classList.remove('active');
            
            // Keep selected stars highlighted
            if (starValue <= value) {
                s.classList.add('selected');
            } else {
                s.classList.remove('selected');
            }
        });
    });
    
    // Form submission
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(commentForm);
        const commentData = {
            name: formData.get('name'),
            email: formData.get('email'),
            comment: formData.get('comment'),
            rating: formData.get('rating')
        };
        
        // Validate form data
        if (commentData.rating === "0") {
            alert("Please rate your experience");
            return;
        }
        
        // In a real application, you would send this data to a server
        // For demonstration, we'll add the comment to the display
        addNewComment(commentData);
        
        // Reset form
        commentForm.reset();
        stars.forEach(s => s.classList.remove('selected', 'active'));
        ratingInput.value = "0";
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for sharing your memory!';
        commentForm.appendChild(successMessage);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    });
}

// Helper function to add a new comment to the display
function addNewComment(commentData) {
    const commentsDisplay = document.querySelector('.comment-cards');
    if (!commentsDisplay) return;
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create new comment card
    const newComment = document.createElement('div');
    newComment.className = 'comment-card';
    newComment.innerHTML = `
        <div class="comment-header">
            <h4>${commentData.name}</h4>
            <div class="star-rating">
                ${generateStarRating(parseInt(commentData.rating))}
            </div>
        </div>
        <p class="comment-date">${formattedDate}</p>
        <p class="comment-text">${commentData.comment}</p>
    `;
    
    // Add animation class
    newComment.classList.add('new-comment');
    
    // Add to beginning of comments
    commentsDisplay.insertBefore(newComment, commentsDisplay.firstChild);
    
    // Remove animation class after animation completes
    setTimeout(() => {
        newComment.classList.remove('new-comment');
    }, 1000);
}

// ==============================================
// Document Ready Event Handler
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
    // Initialize music player
    initYouTubeAPI();
    updateTrackInfo();

    // Add music player event listeners
    document.querySelector('#play-pause')?.addEventListener('click', togglePlay);
    document.querySelector('#next-track')?.addEventListener('click', playNext);
    document.querySelector('#prev-track')?.addEventListener('click', playPrevious);

    // Initialize cart
    loadCart();
    updateCartCount();
    updateCartDropdown();

    // Setup cart event listeners
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    cartIcon?.addEventListener('click', toggleCartDropdown);
    cartCount?.addEventListener('click', toggleCartDropdown);

    // Setup navigation
    setupNavigation("#navigation-arrow-menu", "menu.html");
    setupNavigation("#navigation-arrow-explore", "memory.html");
    setupNavigation("#navigation-arrow-about", "about.html");
    setupNavigation("#left-arrow-memories", "memory.html");
    setupNavigation("#right-arrow-about", "about.html");
    setupNavigation("#left-arrow-menu", "menu.html");
    setupNavigation("#right-arrow-memories", "memory.html");

    // Setup theme
    applyTheme();
    document.querySelector('#logo-word-mark-home')?.addEventListener("click", toggleTheme);
    document.querySelector('#logo-word-mark-menu')?.addEventListener("click", toggleTheme);
    document.querySelector('#logo-word-mark-memory')?.addEventListener("click", toggleTheme);
    document.querySelector('#logo-word-mark-about')?.addEventListener("click", toggleTheme);
    document.querySelector('#logo-mark-home')?.addEventListener("click", toggleTheme);
    document.querySelector('#logo-mark-about')?.addEventListener("click", toggleTheme);

    // Setup mobile menu
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const header = document.querySelector("header");
    const mainContent = document.querySelector('main');
    const closeMenuBtn = document.getElementById("close-menu-btn");

    if (hamburgerBtn && header && mainContent) {
        hamburgerBtn.addEventListener("click", () => {
            header.classList.toggle("show-mobile-menu");
            mainContent.classList.toggle('content-blur');
            cartIcon?.classList.toggle('content-blur');
            cartCount?.classList.toggle('content-blur');
            document.querySelector('#logo-mark-about')?.classList.toggle('content-blur');
        });
    }

    if (closeMenuBtn && hamburgerBtn) {
        closeMenuBtn.addEventListener("click", () => {
            hamburgerBtn.click();
        });
    }

    // Setup Memory Page if on memory page
    if (document.querySelector('.memory-gallery')) {
        setupMemoryGallery();
        setupMemoryVideoControls();
        setupMemorySubNav();
        setupMemoryCommentForm();
    }

    // Initialize checkout if on checkout page
    if (window.location.pathname.includes('checkout.html')) {
        loadCheckoutSummary();
    }

    // Load product data if on menu page
    if (document.getElementById('menu-coffee')) {
        loadProductData();
    }

    // Initialize like counts
    const likeCounts = {};
    
    // Initialize comments
    const comments = {};

    // Handle like button clicks
    document.querySelectorAll('.like-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const countElement = btn.querySelector('.like-count');
            likeCounts[index] = (likeCounts[index] || 0) + 1;
            countElement.textContent = likeCounts[index];
            
            // Add animation effect
            btn.querySelector('.material-symbols-outlined').style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.querySelector('.material-symbols-outlined').style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Comment Modal Functionality
    const modal = document.getElementById('comment-modal');
    const closeModal = document.querySelector('.close-modal');
    let currentMemoryIndex = 0;

    // Close modal when clicking the close button or outside the modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Handle comment button clicks
    document.querySelectorAll('.comment-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            currentMemoryIndex = index;
            modal.classList.add('active');
            displayComments(index);
        });
    });

    // Handle comment submission
    const submitComment = document.querySelector('.submit-comment');
    const commentTextarea = document.querySelector('.comment-form textarea');

    submitComment.addEventListener('click', () => {
        const comment = commentTextarea.value.trim();
        if (comment) {
            if (!comments[currentMemoryIndex]) {
                comments[currentMemoryIndex] = [];
            }
            comments[currentMemoryIndex].push({
                text: comment,
                timestamp: new Date().toLocaleString()
            });
            
            // Update comment count
            const countElement = document.querySelectorAll('.comment-count')[currentMemoryIndex];
            countElement.textContent = comments[currentMemoryIndex].length;
            
            // Clear textarea and refresh comments display
            commentTextarea.value = '';
            displayComments(currentMemoryIndex);
        }
    });

    // Function to display comments for a specific memory
    function displayComments(index) {
        const commentsList = document.querySelector('.comments-list');
        commentsList.innerHTML = '';
        
        if (comments[index] && comments[index].length > 0) {
            comments[index].forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <p class="comment-text">${comment.text}</p>
                    <small class="comment-timestamp">${comment.timestamp}</small>
                `;
                commentsList.appendChild(commentElement);
            });
        } else {
            commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
        }
    }

    // Handle image hover transitions
    document.querySelectorAll('.memory-images').forEach(container => {
        const images = container.querySelectorAll('.detail-image');
        let currentIndex = 0;

        if (images.length > 1) {
            setInterval(() => {
                images[currentIndex].style.opacity = '0';
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].style.opacity = '1';
            }, 2000);
        }
    });

    // Initialize slideshows if on memory page
    if (document.querySelector('.slideshow-container')) {
        setupSlideshows();
    }
});

// Product data
let products = {};

async function loadProductData() {
    try {
        const response = await fetch('data/menu-data.json');  // Remove leading slash for relative path
        const data = await response.json();
        products = data.products;
        fetchProducts();
    } catch (error) {
        console.error('Error loading product data:', error);
        // Fallback to hardcoded data if JSON fetch fails
        products = {
            'Americano 701': {
                price: 4.00,
                images: ['medias/americano-1.jpeg', 'medias/americano-2.jpeg', 'medias/americano-3.jpeg', 'medias/americano-4.jpeg']
            },
            'Cold Brew 701': {
                price: 5.00,
                images: ['medias/coldbrew-1.jpeg', 'medias/coldbrew-2.jpeg']
            },
            'Latte 701': {
                price: 6.00,
                images: ['medias/latte-1.jpeg', 'medias/latte-2.jpeg', 'medias/latte-3.jpeg', 'medias/latte-4.jpeg']
            },
            'Special 701': {
                price: 7.00,
                images: ['medias/special-1.jpeg', 'medias/special-2.jpeg', 'medias/special-3.jpeg', 'medias/special-4.jpeg', 'medias/special-5.jpeg', 'medias/special-6.jpeg', 'medias/special-7.jpeg']
            }
        };
        fetchProducts();
    }
}

function fetchProducts() {
    const menuContainer = document.getElementById('menu-coffee');
    if (!menuContainer) return;

    // Clear existing content
    menuContainer.innerHTML = '';

    // Create a container for the carousel and its navigation
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'menu-carousel-container';
    menuContainer.appendChild(carouselContainer);

    // Create the products container
    const productsContainer = document.createElement('div');
    productsContainer.className = 'menu-products-container';
    carouselContainer.appendChild(productsContainer);

    // Add navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'menu-nav-btn prev';
    prevBtn.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
    prevBtn.setAttribute('aria-label', 'Previous product');
    carouselContainer.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'menu-nav-btn next';
    nextBtn.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
    nextBtn.setAttribute('aria-label', 'Next product');
    carouselContainer.appendChild(nextBtn);

    // Add products
    Object.entries(products).forEach(([name, details]) => {
        const averageRating = getAverageRating(name);
        const reviews = productReviews[name] || [];
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-container">
                <img src="${details.images[0]}" alt="${name}" class="product-image">
                <div class="image-hover-text">Click to see details</div>
            </div>
            <div class="product-info">
                <h2>${name}</h2>
                <h2>$${details.price.toFixed(2)}</h2>
                <div class="product-rating">
                    ${generateStarRating(averageRating)}
                    <span class="rating-count">(${reviews.length} reviews)</span>
                </div>
                <div class="product-customization">
                    <div class="option-group">
                        <label>Milk Type:</label>
                        <select class="custom-select milk-select">
                            ${name === 'Special 701' ? 
                                '<option value="stay_active">Stay Active</option>' :
                                `<option value="none">No Milk</option>
                                <option value="whole_milk" ${name === 'Latte 701' ? 'selected' : ''}>Whole Milk</option>
                                <option value="oat_milk">Oat Milk (+$1)</option>
                                <option value="almond_milk">Almond Milk (+$1)</option>
                                <option value="soy_milk">Soy Milk (+$1)</option>`
                            }
                        </select>
                    </div>
                    <div class="option-group">
                        <label>Sweetness:</label>
                        <select class="custom-select sweetness-select">
                            ${name === 'Special 701' ?
                                '<option value="be_well">Be Well</option>' :
                                `<option value="none">No Sugar</option>
                                <option value="light_sugar">Light Sugar</option>
                                <option value="normal_sugar">Normal Sugar</option>
                                <option value="extra_sugar">Extra Sugar</option>`
                            }
                        </select>
                    </div>
                    <div class="option-group">
                        <label>Temperature:</label>
                        <select class="custom-select temperature-select">
                            ${name === 'Cold Brew 701' ? '<option value="iced">Iced</option>' :
                              name === 'Special 701' ? '<option value="be_loved">Be Loved</option>' :
                              `<option value="hot">Hot</option>
                               <option value="warm">Warm</option>
                               <option value="iced">Iced</option>`
                            }
                        </select>
                    </div>
                </div>
                <button id="cart-coffee" class="material-symbols-outlined">shopping_cart</button>
            </div>
        `;

        // Add click event to show modal
        card.querySelector('.product-image-container').addEventListener('click', () => {
            showProductModal(name, details.price, details.images);
        });

        // Add to cart functionality
        card.querySelector('#cart-coffee').addEventListener('click', (e) => {
            e.stopPropagation();
            const milk = card.querySelector('.milk-select').value;
            const sweetness = card.querySelector('.sweetness-select').value;
            const temperature = card.querySelector('.temperature-select').value;
            
            addToCart(name, details.price, milk, sweetness, temperature);
        });

        productsContainer.appendChild(card);
    });

    // Setup navigation buttons
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        productsContainer.scrollBy({
            left: -400,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        productsContainer.scrollBy({
            left: 400,
            behavior: 'smooth'
        });
    });
}

