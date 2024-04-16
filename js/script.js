// JavaScript for Kevin's Final Project - THE.LAB.701 website

const header = document.querySelector("header");
const hamburgerBtn = document.querySelector("#hamburger-btn");
const closeMenuBtn = document.querySelector("#close-menu-btn");

// Toggle mobile menu on hamburger button click
hamburgerBtn.addEventListener("click", () => header.classList.toggle("show-mobile-menu"));

// Close mobile menu on close button click
closeMenuBtn.addEventListener("click", () => hamburgerBtn.click());

// ... existing code ...

// Function to apply parallax effect
// function applyParallax() {
//     const scrolled = window.scrollY;

//     // Select elements
//     const logoWordMark = document.getElementById('logo-word-mark');
//     const logoMark = document.getElementById('logo-mark');
//     const homeContent = document.getElementById('home-content');

//     // Apply styles based on scroll position
//     // Change the '0.5' to adjust the speed of the parallax effect
//     logoWordMark.style.transform = 'translateY(' + scrolled * 3 + 'px)';
//     logoMark.style.transform = 'translateY(' + scrolled * 3 + 'px)';
//     homeContent.style.transform = 'translateY(' + scrolled * 3 + 'px)';
// }

// // Event listener for scroll event
// window.addEventListener('scroll', applyParallax);
