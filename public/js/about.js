// Parallax Effect
document.addEventListener('scroll', () => {
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        const scrolled = window.pageYOffset;
        parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Reveal Sections on Scroll
const revealSections = () => {
    const sections = document.querySelectorAll('.reveal-section');
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < windowHeight - revealPoint) {
            section.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);

// Animate Statistics
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // Animation duration in milliseconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateNumber = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.round(current);
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        };

        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateNumber();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(stat);
    });
};

// Timeline Animation
const animateTimeline = () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = item.classList.contains('left') ? 
            'translateX(-50px)' : 'translateX(50px)';
        item.style.transition = 'all 0.5s ease';
        observer.observe(item);
    });
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    revealSections();
    animateStats();
    animateTimeline();

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