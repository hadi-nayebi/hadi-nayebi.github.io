/* ============================================
   MINIMAL INTERACTIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Highlight active navigation link
  highlightActiveNav();

  // Add smooth scroll behavior (already in CSS, but this is a fallback)
  setupSmoothScroll();
});

/* ============================================
   ACTIVE NAVIGATION HIGHLIGHTING
   ============================================ */

function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav a');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */

function setupSmoothScroll() {
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
}

/* ============================================
   OPTIONAL: Add subtle parallax effect to hero
   ============================================ */

// Uncomment to enable parallax on scroll
// window.addEventListener('scroll', () => {
//   const scrolled = window.pageYOffset;
//   const hero = document.querySelector('.hero');
//   if (hero) {
//     hero.style.transform = `translateY(${scrolled * 0.5}px)`;
//   }
// });
