/* ═══════════════════════════════════════════════════════════
   VEDA JEWEL — Core JavaScript
   Luxury interactions: scroll reveals, parallax, navigation
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initParallax();
  initTestimonialCarousel();
  initTabs();
  initLightbox();
  initSmoothScroll();
  initCounters();
  initLeadNudge();
});


/* ─── Navigation ────────────────────────────────────────── */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (!navbar) return;

  // Scroll behavior — transparent to solid
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile menu toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }
}


/* ─── Scroll Reveal ─────────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
  
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop observing for performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}


/* ─── Parallax ──────────────────────────────────────────── */
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  
  if (!parallaxElements.length) return;
  
  // Use requestAnimationFrame for smooth performance
  let ticking = false;
  
  function updateParallax() {
    const scrollY = window.pageYOffset;
    
    parallaxElements.forEach(el => {
      const container = el.parentElement;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Only animate when visible
      if (rect.bottom > 0 && rect.top < windowHeight) {
        const speed = parseFloat(el.dataset.speed) || 0.3;
        const yPos = -(rect.top * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    });
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}


/* ─── Testimonial Carousel ──────────────────────────────── */
function initTestimonialCarousel() {
  const carousels = document.querySelectorAll('.testimonial-carousel');
  
  carousels.forEach(carousel => {
    const slides = carousel.querySelector('.testimonial-slides');
    const dots = carousel.querySelectorAll('.testimonial-dot');
    const slideElements = carousel.querySelectorAll('.testimonial-slide');
    
    if (!slides || !slideElements.length) return;
    
    let currentSlide = 0;
    const totalSlides = slideElements.length;
    
    function goToSlide(index) {
      currentSlide = index;
      slides.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }
    
    // Dot click
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
    });
    
    // Auto-advance
    let autoplay = setInterval(() => {
      goToSlide((currentSlide + 1) % totalSlides);
    }, 6000);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
    carousel.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => {
        goToSlide((currentSlide + 1) % totalSlides);
      }, 6000);
    });
  });
}


/* ─── Tabs ──────────────────────────────────────────────── */
function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tabs]');
  
  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('.tab');
    const contents = container.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const targetContent = container.querySelector(`#${target}`);
        if (targetContent) targetContent.classList.add('active');
      });
    });
  });
}


/* ─── Lightbox ──────────────────────────────────────────── */
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;
  
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  
  // Open lightbox on gallery item click
  document.querySelectorAll('.gallery-item[data-lightbox]').forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img')?.src;
      if (imgSrc && lightboxImg) {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.classList.add('no-scroll');
      }
    });
  });
  
  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
  
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}


/* ─── Smooth Scroll ─────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}


/* ─── Counter Animation ─────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  
  if (!counters.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter);
        const duration = parseInt(el.dataset.duration) || 2000;
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        
        animateCounter(el, target, duration, prefix, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(el => observer.observe(el));
}

function animateCounter(element, target, duration, prefix, suffix) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    
    element.textContent = prefix + current.toLocaleString() + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}


/* ─── Image Lazy Loading ────────────────────────────────── */
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

/* ─── Concierge Lead Nudge ──────────────────────────────── */
function initLeadNudge() {
  const nudge = document.getElementById('concierge-nudge');
  if (!nudge) return;
  
  // Wait 5 seconds
  setTimeout(() => {
    // If user has not closed it already
    if (!localStorage.getItem('veda-nudge-closed')) {
      nudge.classList.add('visible');
    }
  }, 5000);

  // Close handler
  const closeBtn = nudge.querySelector('.nudge-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      nudge.classList.remove('visible');
      localStorage.setItem('veda-nudge-closed', 'true');
    });
  }
}
