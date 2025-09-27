// Modern Navbar JavaScript
class ModernNavbar {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.mobileMenuBtn = null;
    this.navLinks = document.querySelector('.nav-links');
    this.menuIcon = null;
    this.isMenuOpen = false;
    
    this.init();
  }

  init() {
    this.createMobileMenuButton();
    this.setupEventListeners();
    this.setActiveLink();
    this.handleScroll();
  }

  createMobileMenuButton() {
    // Create mobile menu button if it doesn't exist
    this.mobileMenuBtn = document.createElement('button');
    this.mobileMenuBtn.className = 'mobile-menu-btn';
    this.mobileMenuBtn.setAttribute('aria-label', 'Toggle mobile menu');
    this.mobileMenuBtn.setAttribute('aria-expanded', 'false');

    this.menuIcon = document.createElement('i');
    this.menuIcon.className = 'fas fa-bars';
    this.mobileMenuBtn.appendChild(this.menuIcon);

    // Insert mobile menu button before nav-links
    const navContainer = document.querySelector('.nav-container');
    navContainer.insertBefore(this.mobileMenuBtn, this.navLinks);
  }

  setupEventListeners() {
    // Mobile menu toggle
    this.mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMobileMenu();
    });

    // Close mobile menu when clicking on nav links
    this.navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.navbar.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
        this.mobileMenuBtn.focus();
      }
    });

    // Navbar scroll effects
    window.addEventListener('scroll', this.throttle(() => {
      this.handleScroll();
    }, 10));

    // Handle window resize
    window.addEventListener('resize', this.throttle(() => {
      this.handleResize();
    }, 100));

    // Smooth scroll for anchor links
    this.setupSmoothScroll();
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMenuOpen = true;
    this.navLinks.classList.add('mobile-active');
    this.menuIcon.className = 'fas fa-times';
    this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';

    // Focus management for accessibility
    const firstLink = this.navLinks.querySelector('a');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.navLinks.classList.remove('mobile-active');
    this.menuIcon.className = 'fas fa-bars';
    this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  handleScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }

    // Hide mobile menu on scroll
    if (this.isMenuOpen && scrollY > 100) {
      this.closeMobileMenu();
    }
  }

  handleResize() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }

  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = this.navLinks.querySelectorAll('a');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const linkPage = link.getAttribute('href').split('/').pop().split('#')[0] || 'index.html';
      
      if (linkPage === currentPage || 
          (currentPage === '' && linkPage === 'index.html') ||
          (currentPage === 'index.html' && linkPage === '')) {
        link.classList.add('active');
      }
    });
  }

  setupSmoothScroll() {
    const links = this.navLinks.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          // Close mobile menu if open
          if (this.isMenuOpen) {
            this.closeMobileMenu();
          }
          
          // Smooth scroll to target
          const headerOffset = this.navbar.offsetHeight + 20;
          const elementPosition = targetElement.offsetTop;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          history.replaceState(null, null, targetId);
        }
      });
    });
  }

  // Utility function for throttling
  throttle(func, wait) {
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

  // Public method to manually set active link
  setActiveByHref(href) {
    const navLinks = this.navLinks.querySelectorAll('a');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === href) {
        link.classList.add('active');
      }
    });
  }

  // Public method to add navigation item
  addNavItem(text, href, position = -1) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = text;
    a.href = href;
    li.appendChild(a);

    if (position === -1) {
      this.navLinks.appendChild(li);
    } else {
      const children = Array.from(this.navLinks.children);
      if (position < children.length) {
        this.navLinks.insertBefore(li, children[position]);
      } else {
        this.navLinks.appendChild(li);
      }
    }

    return li;
  }

  // Public method to remove navigation item
  removeNavItem(href) {
    const link = this.navLinks.querySelector(`a[href="${href}"]`);
    if (link && link.parentElement) {
      link.parentElement.remove();
    }
  }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.modernNavbar = new ModernNavbar();
});

// Additional utility functions for navbar enhancement
const NavbarUtils = {
  // Highlight current section while scrolling
  highlightCurrentSection() {
    const sections = document.querySelectorAll('[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.6,
      rootMargin: '-100px 0px -100px 0px'
    });

    sections.forEach(section => observer.observe(section));
  },

  // Add breadcrumb navigation
  addBreadcrumb(items) {
    const navbar = document.querySelector('.navbar');
    const existing = navbar.querySelector('.breadcrumb');
    if (existing) existing.remove();

    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.innerHTML = items.map((item, index) => {
      if (index === items.length - 1) {
        return `<span class="breadcrumb-current">${item.text}</span>`;
      }
      return `<a href="${item.href}" class="breadcrumb-link">${item.text}</a>`;
    }).join(' <span class="breadcrumb-separator">/</span> ');

    navbar.appendChild(breadcrumb);
  },

  // Add notification badge to nav item
  addNotificationBadge(href, count) {
    const link = document.querySelector(`.nav-links a[href="${href}"]`);
    if (link) {
      let badge = link.querySelector('.nav-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'nav-badge';
        link.appendChild(badge);
      }
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }
};

// Auto-initialize additional features if needed
document.addEventListener('DOMContentLoaded', () => {
  // Uncomment to enable section highlighting
  // NavbarUtils.highlightCurrentSection();
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModernNavbar, NavbarUtils };
}