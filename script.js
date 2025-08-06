// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById('loadingScreen');
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const themeToggle = document.getElementById('themeToggle');
const resumeBtn = document.getElementById('resumeBtn');
const backToTop = document.getElementById('backToTop');
const ctaBtn = document.getElementById('ctaBtn');
const scrollBtn = document.getElementById('scrollBtn');

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 1500);
});

// ===== SMOKE TRAIL CURSOR =====
let mouseX = 0;
let mouseY = 0;
let isMoving = false;
let lastMoveTime = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  isMoving = true;
  lastMoveTime = Date.now();
  
  // Update cursor position
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  
  // Update follower position with slight delay
  cursorFollower.style.left = (mouseX - 10) + 'px';
  cursorFollower.style.top = (mouseY - 10) + 'px';
  
  // Create smoke particles
  if (isMoving && Date.now() - lastMoveTime < 100) {
    createSmokeParticle(mouseX, mouseY);
  }
});

// Create smoke particle
function createSmokeParticle(x, y) {
  const particle = document.createElement('div');
  particle.className = 'smoke-particle';
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  
  // Random offset for natural look
  const offsetX = (Math.random() - 0.5) * 20;
  const offsetY = (Math.random() - 0.5) * 20;
  particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  
  document.body.appendChild(particle);
  
  // Remove particle after animation
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, 1500);
}

// Hide cursor on mobile
if (window.innerWidth <= 768) {
  cursor.style.display = 'none';
  cursorFollower.style.display = 'none';
}

// ===== NAVIGATION =====
// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
mobileMenuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
  });
});

// ===== THEME TOGGLE =====
let currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  
  // Update theme toggle icon
  const icon = themeToggle.querySelector('i');
  icon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== SCROLL TO SECTIONS =====
scrollBtn.addEventListener('click', () => {
  const aboutSection = document.getElementById('about');
  aboutSection.scrollIntoView({ behavior: 'smooth' });
});

ctaBtn.addEventListener('click', () => {
  const contactSection = document.getElementById('contact');
  contactSection.scrollIntoView({ behavior: 'smooth' });
});

// ===== BACK TO TOP =====
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ===== RESUME DOWNLOAD =====
resumeBtn.addEventListener('click', () => {
  // Create a temporary link to download the resume
  const link = document.createElement('a');
  link.href = 'data:application/pdf;base64,' + resume;
  link.download = 'Hoji_Akbar_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-card, .skill-category, .project-card, .cert-item').forEach(el => {
  observer.observe(el);
});

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }
  
  updateCounter();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        animateCounter(stat, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .certification-stats').forEach(el => {
  statsObserver.observe(el);
});

// ===== PARALLAX EFFECTS =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.float-element');
  
  parallaxElements.forEach(element => {
    const speed = element.getAttribute('data-speed') || 0.5;
    const yPos = -(scrolled * speed);
    element.style.transform = `translateY(${yPos}px)`;
  });
});

// ===== PROJECT CARDS HOVER EFFECTS =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-10px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) scale(1)';
  });
});

// ===== SKILL ITEMS HOVER EFFECTS =====
document.querySelectorAll('.skill-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'translateY(-5px) scale(1.05)';
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'translateY(0) scale(1)';
  });
});

// ===== ACTIVE NAVIGATION LINK =====
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===== TYPING ANIMATION =====
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// ===== FLOATING ELEMENTS ANIMATION =====
function animateFloatingElements() {
  const elements = document.querySelectorAll('.float-element');
  elements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.5}s`;
  });
}

// ===== SCROLL TRIGGERED ANIMATIONS =====
const scrollAnimations = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.about-card, .skill-category, .project-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  scrollAnimations.observe(el);
});

// ===== MOBILE MENU ANIMATION =====
mobileMenuToggle.addEventListener('click', () => {
  const spans = mobileMenuToggle.querySelectorAll('span');
  spans.forEach((span, index) => {
    if (mobileMenuToggle.classList.contains('active')) {
      if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
      if (index === 1) span.style.opacity = '0';
      if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      span.style.transform = 'none';
      span.style.opacity = '1';
    }
  });
});

// ===== FORM VALIDATION (if forms are added later) =====
function validateForm(form) {
  const inputs = form.querySelectorAll('input, textarea');
  let isValid = true;
  
  inputs.forEach(input => {
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  });
  
  return isValid;
}

// ===== LAZY LOADING FOR IMAGES =====
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
  updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    navMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
  }
});

// ===== TOUCH GESTURES FOR MOBILE =====
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartY - touchEndY;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe up - could trigger scroll down
      console.log('Swipe up detected');
    } else {
      // Swipe down - could trigger scroll up
      console.log('Swipe down detected');
    }
  }
}

// ===== PRELOAD CRITICAL RESOURCES =====
function preloadCriticalResources() {
  const criticalImages = [
    'img/dollar.jpg',
    'img/about.png',
    'img/SKILLS.png'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

// ===== ANALYTICS (placeholder) =====
function trackEvent(eventName, data = {}) {
  // Placeholder for analytics tracking
  console.log('Event tracked:', eventName, data);
}

// Track important interactions
document.querySelectorAll('.btn, .nav-link, .project-link').forEach(element => {
  element.addEventListener('click', () => {
    trackEvent('click', {
      element: element.tagName,
      text: element.textContent.trim()
    });
  });
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  animateFloatingElements();
  preloadCriticalResources();
  
  // Set initial theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Update theme toggle icon
  const icon = themeToggle.querySelector('i');
  icon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  
  console.log('Ultimate website initialized successfully! 🚀');
});

// ===== EXPORT FOR MODULE USE (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    animateCounter,
    typeWriter,
    validateForm,
    trackEvent
  };
} 