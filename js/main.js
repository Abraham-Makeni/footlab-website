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

// Hero keyboard controls and hover pause
if (heroSlides.length > 0) {
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      nextHeroSlide();
      resetHeroSlider();
    } else if (event.key === "ArrowLeft") {
      prevHeroSlide();
      resetHeroSlider();
    }
  });

  const heroSection = document.querySelector(".hero-slider");
  if (heroSection) {
    heroSection.addEventListener("mouseenter", () => clearInterval(heroInterval));
    heroSection.addEventListener("mouseleave", () => startHeroSlider());
  }
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const successMessage = document.createElement("div");
    successMessage.className = "form-success";
    successMessage.textContent = "Great news! Your booking inquiry was sent. We’ll contact you within 2 hours.";
    successMessage.style.cssText = "margin-top: 1rem; padding: 0.85rem 1rem; background: rgba(40, 222, 123, 0.18); border: 1px solid rgba(40, 222, 123, 0.4); border-radius: 12px; color: #d5ffe1;";

    const existing = form.querySelector(".form-success");
    if (existing) existing.remove();

    form.appendChild(successMessage);
    form.reset();

    // simulate backend booking webhook for success and response
    const payload = new FormData(form);
    const submission = {
      name: payload.get('name'),
      phone: payload.get('phone'),
      message: payload.get('message'),
      timestamp: new Date().toISOString(),
    };

    const apiUrl = '/api/bookings';
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(`http ${res.status}`);
      })
      .then((data) => {
        console.log('real backend booking response', data);
      })
      .catch((err) => {
        console.warn('backend endpoint unavailable; using simulated response', err);
        setTimeout(() => {
          console.log('fallback booking response:', {
            status: 'ok',
            bookingId: 'FB-' + Math.floor(Math.random() * 900000 + 100000),
            bookingData: submission,
          });
        }, 700);
      });
  });
}

const galleryRedirect = document.getElementById('galleryRedirect');
if (galleryRedirect) {
  galleryRedirect.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      document.querySelector('#name')?.focus();
    }, 500);
  });
}

const goalAnimation = document.getElementById('goalAnimation');
const bookPrompt = document.getElementById('bookPrompt');
const bookPromptButton = document.getElementById('bookPromptButton');
const dismissPrompt = document.getElementById('dismissPrompt');

function fireGoalAnimation() {
  if (!goalAnimation) return;
  goalAnimation.classList.remove('active');
  void goalAnimation.offsetWidth;
  goalAnimation.classList.add('active');
}

window.addEventListener('load', () => {
  fireGoalAnimation();

  setTimeout(() => {
    if (bookPrompt) bookPrompt.style.opacity = '1';
  }, 450);

  if (bookPromptButton) {
    bookPromptButton.addEventListener('click', () => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelector('#name')?.focus();
      if (bookPrompt) bookPrompt.style.display = 'none';
      fireGoalAnimation();

      // dynamically build urgency countdown text start
      let countdown = 18;
      const interval = setInterval(() => {
        if (countdown <= 0) {
          clearInterval(interval);
          return;
        }
        countdown -= 1;
      }, 1000);
    });
  }
});


