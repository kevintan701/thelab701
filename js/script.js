// JavaScript for Kevin's Final Project - THE.LAB.701 website

const header = document.querySelector("header");
const hamburgerBtn = document.querySelector("#hamburger-btn");
const closeMenuBtn = document.querySelector("#close-menu-btn");
const gotoMenuBtn = document.querySelector("#navigation-arrow-menu");
const gotoExploreBtn = document.querySelector("#navigation-arrow-explore");
const gotoAboutBtn = document.querySelector("#navigation-arrow-about");
const gotoMemoryArrowLeft = document.querySelector("#left-arrow-memories");
const gotoAboutArrowRight = document.querySelector("#right-arrow-about");
const gotoMenuArrowLeft = document.querySelector("#left-arrow-menu");
const gotoMemoryArrowRight = document.querySelector("#right-arrow-memories");

// Toggle mobile menu on hamburger button click
hamburgerBtn.addEventListener("click", () => header.classList.toggle("show-mobile-menu"));

// Close mobile menu on close button click
closeMenuBtn.addEventListener("click", () => hamburgerBtn.click());

// Go to menu page on arrow click
gotoMenuBtn.addEventListener("click", () => window.location.href = "menu.html");

// Go to explore page on arrow click
gotoExploreBtn.addEventListener("click", () => window.location.href = "memory.html");

// Go to about page on arrow click
gotoAboutBtn.addEventListener("click", () => window.location.href = "about.html");

// Go to memories page on arrow click
gotoMemoryArrowLeft.addEventListener("click", () => window.location.href = "memory.html");

// Go to about page on arrow click
gotoAboutArrowRight.addEventListener("click", () => window.location.href = "about.html");

// Go to menu page on arrow click
gotoMenuArrowLeft.addEventListener("click", () => window.location.href = "menu.html");

// Go to memories page on arrow click
gotoMemoryArrowRight.addEventListener("click", () => window.location.href = "memory.html");

