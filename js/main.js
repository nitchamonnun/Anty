/**
 * Nitchamon Chonsakorn (ณิชมน ชลสาคร) - Personal Portfolio
 * Main Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initTypingEffect();
  initNavbarScroll();
  initPortfolioFilter();
  initStatsCounter();
  initContactForm();
  initBackToTop();
});

/* ==========================================
   1. Dark / Light Mode Switcher with LocalStorage
   ========================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  if (!themeToggleBtn || !themeIcon) return;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('nichamon_portfolio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme, themeIcon);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nichamon_portfolio_theme', newTheme);
    updateThemeIcon(newTheme, themeIcon);
  });
}

function updateThemeIcon(theme, iconElement) {
  if (theme === 'dark') {
    iconElement.className = 'bi bi-sun-fill text-warning';
  } else {
    iconElement.className = 'bi bi-moon-stars-fill text-primary';
  }
}

/* ==========================================
   2. Dynamic Hero Typing Text Effect
   ========================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typingText');
  if (!typingElement) return;

  const roles = [
    'นักศึกษา วิทยาลัยอาชีวศึกษานครศรีธรรมราช',
    'Creative Frontend Developer',
    'UI/UX & Graphic Designer',
    'Digital Media & Web Specialist',
    'ผู้หลงใหลในเทคโนโลยี & ความคิดสร้างสรรค์'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================
   3. Navbar Scroll Behavior & Active Scrollspy
   ========================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-custom');
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Add shadow class when scrolled
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scrollspy active class detection
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Collapse mobile navbar on link click
  const navbarCollapse = document.getElementById('navbarNav');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992 && navbarCollapse?.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        bsCollapse?.hide();
      }
    });
  });
}

/* ==========================================
   4. Portfolio Project Filter Tabs
   ========================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (!filterBtns.length || !projectItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === itemCategory) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================
   5. Animated Stats Counter (Intersection Observer)
   ========================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 40));
          const duration = 1200;
          const intervalTime = duration / (target / step);

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              counter.textContent = target + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = current + suffix;
            }
          }, intervalTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsContainer = document.getElementById('statsSection');
  if (statsContainer) {
    observer.observe(statsContainer);
  }
}

/* ==========================================
   6. Contact Form Interactive Handler & Toast
   ========================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const toastElement = document.getElementById('contactToast');
  const toastMessage = document.getElementById('toastMessage');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      e.stopPropagation();
      contactForm.classList.add('was-validated');
      return;
    }

    const nameInput = document.getElementById('senderName')?.value || 'คุณผู้ติดต่อ';
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    // Button loading state
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> กำลังส่งข้อความ...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check2-circle me-2"></i> ส่งข้อความสำเร็จ!';

        // Show Bootstrap Toast
        if (toastElement) {
          if (toastMessage) {
            toastMessage.textContent = `ขอบคุณ ${nameInput} ทางเราได้รับข้อความเรียบร้อยแล้ว จะติดต่อกลับโดยเร็วที่สุดค่ะ!`;
          }
          const bsToast = new bootstrap.Toast(toastElement, { delay: 4500 });
          bsToast.show();
        }

        contactForm.reset();
        contactForm.classList.remove('was-validated');

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
        }, 3000);
      }, 1000);
    }
  });
}

/* ==========================================
   7. Back to Top Button
   ========================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================
   8. Project Details Modal Dynamic Populator
   ========================================== */
window.openProjectModal = function(title, category, desc, tagsString, imageSrc) {
  const modalTitle = document.getElementById('projectModalLabel');
  const modalCategory = document.getElementById('projectModalCategory');
  const modalDesc = document.getElementById('projectModalDesc');
  const modalTags = document.getElementById('projectModalTags');
  const modalImg = document.getElementById('projectModalImg');

  if (modalTitle) modalTitle.textContent = title;
  if (modalCategory) modalCategory.textContent = category;
  if (modalDesc) modalDesc.textContent = desc;
  if (modalImg) modalImg.src = imageSrc;

  if (modalTags && tagsString) {
    modalTags.innerHTML = '';
    const tags = tagsString.split(',');
    tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 me-1 mb-1';
      span.textContent = tag.trim();
      modalTags.appendChild(span);
    });
  }

  const projectModalElement = document.getElementById('projectDetailModal');
  if (projectModalElement) {
    const modal = new bootstrap.Modal(projectModalElement);
    modal.show();
  }
};
