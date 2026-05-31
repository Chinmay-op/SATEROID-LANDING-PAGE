/* ============================================================
   SATEROID — Global Technology & Consulting Group
   JavaScript — Interactive Components
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavigation();
  initMegaMenu();
  initMobileMenu();
  initHeroAnimation();
  initCounterAnimation();
  initTabSystem();
  initTestimonialCarousel();
  initCookieBanner();
  initScrollIndicator();
  initTrustBarScroll();
});

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   STICKY NAVIGATION — Shadow on scroll
   ============================================================ */
function initNavigation() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 80) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ============================================================
   MEGA MENU — Hover with delay
   ============================================================ */
function initMegaMenu() {
  const trigger = document.querySelector('.nav-item-mega');
  const menu = document.querySelector('.mega-menu');
  if (!trigger || !menu) return;

  let openTimeout, closeTimeout;

  trigger.addEventListener('mouseenter', () => {
    clearTimeout(closeTimeout);
    openTimeout = setTimeout(() => {
      menu.classList.add('active');
    }, 150);
  });

  trigger.addEventListener('mouseleave', () => {
    clearTimeout(openTimeout);
    closeTimeout = setTimeout(() => {
      menu.classList.remove('active');
    }, 200);
  });

  menu.addEventListener('mouseenter', () => {
    clearTimeout(closeTimeout);
  });

  menu.addEventListener('mouseleave', () => {
    closeTimeout = setTimeout(() => {
      menu.classList.remove('active');
    }, 200);
  });
}

/* ============================================================
   MOBILE MENU — Drawer
   ============================================================ */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  if (!toggle || !drawer || !overlay) return;

  function openMenu() {
    toggle.classList.add('active');
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('active');
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (drawer.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ============================================================
   HERO ANIMATION — Staggered entrance
   ============================================================ */
function initHeroAnimation() {
  const label = document.querySelector('.hero-label');
  const lines = document.querySelectorAll('.hero h1 .line');
  const subtitles = document.querySelectorAll('.hero-subtitle');
  const ctaGroup = document.querySelector('.hero-cta-group');
  const trust = document.querySelector('.hero-trust');
  const visual = document.querySelector('.hero-visual');

  const delays = [0, 100, 200, 300];

  if (label) {
    setTimeout(() => label.classList.add('animate'), delays[0]);
  }

  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add('animate'), delays[1] + (i * 100));
  });

  const lastLineDelay = delays[1] + (lines.length * 100) + 100;
  subtitles.forEach((sub, i) => {
    setTimeout(() => sub.classList.add('animate'), lastLineDelay + (i * 120));
  });

  if (ctaGroup) {
    setTimeout(() => ctaGroup.classList.add('animate'), 550);
  }

  if (trust) {
    setTimeout(() => trust.classList.add('animate'), 700);
  }

  if (visual) {
    setTimeout(() => visual.classList.add('animate'), 0);
  }
}

/* ============================================================
   COUNTER ANIMATION — Statistics
   ============================================================ */
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('[data-count]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = el.dataset.count;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const startTime = performance.now();

  // Parse the numeric value
  const numericTarget = parseFloat(target.replace(/,/g, ''));
  const isDecimal = target.includes('.');
  const decimalPlaces = isDecimal ? target.split('.')[1].length : 0;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function formatNumber(num) {
    if (isDecimal) {
      return num.toFixed(decimalPlaces);
    }
    return Math.round(num).toLocaleString('en-US');
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const currentValue = numericTarget * easedProgress;

    el.textContent = prefix + formatNumber(currentValue) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ============================================================
   TAB SYSTEM — Industry Solutions
   ============================================================ */
function initTabSystem() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (!tabBtns.length || !tabPanels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;

      // Update buttons
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panels with transition
      tabPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
          panel.setAttribute('aria-hidden', 'false');
        } else {
          panel.classList.remove('active');
          panel.setAttribute('aria-hidden', 'true');
        }
      });
    });
  });

  // Keyboard navigation
  const tabBar = document.querySelector('[role="tablist"]');
  if (tabBar) {
    tabBar.addEventListener('keydown', (e) => {
      const tabs = Array.from(tabBtns);
      const currentIndex = tabs.indexOf(document.activeElement);
      let newIndex;

      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else {
        return;
      }

      e.preventDefault();
      tabs[newIndex].focus();
      tabs[newIndex].click();
    });
  }
}

/* ============================================================
   TESTIMONIAL CAROUSEL
   ============================================================ */
function initTestimonialCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  const carousel = document.querySelector('.testimonial-carousel');
  if (!slides.length) return;

  let currentSlide = 0;
  let autoAdvance;
  let isPaused = false;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  function startAutoAdvance() {
    autoAdvance = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, 7000);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    clearInterval(autoAdvance);
    startAutoAdvance();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    clearInterval(autoAdvance);
    startAutoAdvance();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      clearInterval(autoAdvance);
      startAutoAdvance();
    });
  });

  // Pause on hover
  if (carousel) {
    carousel.addEventListener('mouseenter', () => { isPaused = true; });
    carousel.addEventListener('mouseleave', () => { isPaused = false; });
  }

  startAutoAdvance();
}

/* ============================================================
   COOKIE CONSENT BANNER
   ============================================================ */
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;

  // Check if already accepted
  if (localStorage.getItem('sateroid-cookie-consent') === 'accepted') {
    banner.remove();
    return;
  }

  // Show after 1.5 seconds
  setTimeout(() => {
    banner.classList.add('visible');
  }, 1500);

  const acceptBtn = banner.querySelector('.btn--cookie-accept');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('sateroid-cookie-consent', 'accepted');
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 400);
    });
  }
}

/* ============================================================
   SCROLL INDICATOR — Hero bottom arrow
   ============================================================ */
function initScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  if (!indicator) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      indicator.classList.add('hidden');
    } else {
      indicator.classList.remove('hidden');
    }
  }, { passive: true });
}

/* ============================================================
   TRUST BAR — Mobile infinite scroll clone
   ============================================================ */
function initTrustBarScroll() {
  const track = document.querySelector('.trust-bar-scroll-track');
  if (!track) return;

  // Clone children for infinite scroll
  const items = track.innerHTML;
  track.innerHTML = items + items;
}
