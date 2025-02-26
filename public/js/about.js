// Parallax Effect
document.addEventListener('scroll', () => {
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        const scrolled = window.pageYOffset;
        parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Reveal Sections on Scroll with improved animation
const revealSections = () => {
    const sections = document.querySelectorAll('.reveal-section');
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < windowHeight - revealPoint) {
            section.classList.add('active');
            // Add a subtle scale effect for emotional impact
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            section.style.transform = 'scale(1)';
        }
    });
};

window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);

// Enhanced Statistics Animation with "real-time" effect
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const startValue = parseInt(stat.getAttribute('data-start') || '0');
        const duration = 3000; // Extended animation duration for more impact
        const range = target - startValue;
        const stepTime = duration / 60; // For 60fps
        let current = startValue;
        let startTime = null;

        // Set initial value
        stat.textContent = startValue.toLocaleString();
        
        // Add the real-time counter styling class
        stat.classList.add('live-counter');

        const updateNumber = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easeOutQuad for smoother animation
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            current = startValue + Math.floor(range * easeProgress);
            
            // Format with thousands separator
            stat.textContent = current.toLocaleString();
            
            // Add the pulsing effect on update
            stat.classList.add('pulse-update');
            setTimeout(() => {
                stat.classList.remove('pulse-update');
            }, 200);

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                // After reaching the target, add subtle random increments for "real-time" effect
                if (stat.getAttribute('data-realtime') === 'true') {
                    setInterval(() => {
                        const newValue = parseInt(stat.textContent.replace(/,/g, ''));
                        const increment = Math.floor(Math.random() * 3) + 1; // Random 1-3
                        const updatedValue = newValue + increment;
                        stat.textContent = updatedValue.toLocaleString();
                        
                        // Brief pulse animation on update
                        stat.classList.add('pulse-update');
                        setTimeout(() => {
                            stat.classList.remove('pulse-update');
                        }, 200);
                    }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds
                }
            }
        };

        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(updateNumber);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 }); // Lower threshold to start animation earlier

        observer.observe(stat);
    });
};

// Improved Timeline Animation
const animateTimeline = () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a slight delay for each item to create a cascade effect
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    entry.target.classList.add('timeline-active');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        const isEven = index % 2 === 0;
        item.style.transform = isEven ? 'translateX(-60px)' : 'translateX(60px)';
        item.style.transition = 'all 0.6s ease-out';
        observer.observe(item);
    });
};

// Add parallax quote effect
const animateQuotes = () => {
    const quotes = document.querySelectorAll('.quote-section blockquote, .quote-container');
    
    window.addEventListener('scroll', () => {
        quotes.forEach(quote => {
            const speed = 0.15;
            const rect = quote.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const screenCenter = window.innerHeight / 2;
            const distance = center - screenCenter;
            const translateY = distance * speed;
            
            quote.style.transform = `translateY(${-translateY}px)`;
            
            // Add opacity effect based on distance from center
            const opacity = 1 - Math.min(0.5, Math.abs(distance) / (window.innerHeight * 0.8));
            quote.style.opacity = Math.max(0.5, opacity);
        });
    });
};

// Add subtle image hover effects
const enhanceImages = () => {
    const images = document.querySelectorAll('.founder-image img');
    
    images.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.02)';
            img.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
            img.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    revealSections();
    animateStats();
    animateTimeline();
    animateQuotes();
    enhanceImages();

    // Team cards accessibility
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.querySelector('.card-front').style.transform = 
                    card.querySelector('.card-front').style.transform === 'rotateY(180deg)' ? 
                    'rotateY(0deg)' : 'rotateY(180deg)';
                card.querySelector('.card-back').style.transform = 
                    card.querySelector('.card-back').style.transform === 'rotateY(360deg)' ? 
                    'rotateY(180deg)' : 'rotateY(360deg)';
            }
        });
        
        // Add focus and blur handlers
        card.addEventListener('focus', () => {
            card.style.outline = '2px solid #000';
        });
        
        card.addEventListener('blur', () => {
            card.style.outline = 'none';
        });
    });
}); 