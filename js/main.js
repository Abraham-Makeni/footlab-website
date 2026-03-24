const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navAnchors = document.querySelectorAll('.nav-links a, .footer-links a, .hero-actions a, .cta a, .pricing-card a');

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navAnchors.forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks && navLinks.classList.contains("show")) {
      navLinks.classList.remove("show");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

const heroSlides = document.querySelectorAll(".hero-slide");
const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");

let currentHeroIndex = 0;
let heroInterval;

function showHeroSlide(index) {
  heroSlides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
    slide.setAttribute("aria-hidden", i === index ? "false" : "true");
  });
}

function nextHeroSlide() {
  currentHeroIndex = (currentHeroIndex + 1) % heroSlides.length;
  showHeroSlide(currentHeroIndex);
}

function prevHeroSlide() {
  currentHeroIndex = (currentHeroIndex - 1 + heroSlides.length) % heroSlides.length;
  showHeroSlide(currentHeroIndex);
}

function startHeroSlider() {
  if (heroSlides.length > 1) {
    heroInterval = setInterval(nextHeroSlide, 5000);
  }
}

function resetHeroSlider() {
  clearInterval(heroInterval);
  startHeroSlider();
}

if (heroSlides.length > 0) {
  showHeroSlide(currentHeroIndex);
  startHeroSlider();

  if (heroNext) {
    heroNext.addEventListener("click", () => {
      nextHeroSlide();
      resetHeroSlider();
    });
  }

  if (heroPrev) {
    heroPrev.addEventListener("click", () => {
      prevHeroSlide();
      resetHeroSlider();
    });
  }
}

const galleryGrid = document.getElementById("galleryGrid");
const galleryToggle = document.getElementById("galleryToggle");

if (galleryGrid && galleryToggle) {
  galleryToggle.addEventListener("click", () => {
    const expanded = galleryGrid.classList.toggle("expanded");
    galleryToggle.textContent = expanded ? "Show Less" : "Show More";
    galleryToggle.setAttribute("aria-expanded", String(expanded));
  });
}

const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-links a");

function setActiveNav() {
  const offset = 140;
  let currentId = "home";

  sections.forEach((section) => {
    const top = section.offsetTop;
    if (window.scrollY >= top - offset) {
      currentId = section.id;
    }
  });

  navItems.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
  });
}

window.addEventListener("scroll", setActiveNav);
window.addEventListener("load", setActiveNav);
