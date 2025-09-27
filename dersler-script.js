// Loading animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('loaded');
    }
  });
}, observerOptions);

document.querySelectorAll('.loading-animation').forEach(el => {
  observer.observe(el);
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = 'none';
  }
});

// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const courseCards = document.querySelectorAll('.course-card');
const searchInput = document.getElementById('searchInput');

// Filter by category
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    const filterValue = button.getAttribute('data-filter');
    
    courseCards.forEach(card => {
      if (filterValue === 'all') {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 100);
      } else {
        const categories = card.getAttribute('data-category').split(' ');
        if (categories.includes(filterValue)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      }
    });
  });
});

// Search functionality
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  
  courseCards.forEach(card => {
    const searchData = card.getAttribute('data-search').toLowerCase();
    const courseTitle = card.querySelector('.course-title').textContent.toLowerCase();
    
    if (searchData.includes(searchTerm) || courseTitle.includes(searchTerm)) {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
  
  // Reset filter buttons when searching
  if (searchTerm) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
  }
});

// Stagger animation for course cards
courseCards.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
});

// Course card interactions
courseCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(-5px) scale(1)';
  });
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Add initial animations
  setTimeout(() => {
    document.querySelectorAll('.course-card').forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 500);
  
  // Initialize course card styles
  courseCards.forEach(card => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });
});

// Smooth scrolling for anchor links
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

// Course action button interactions
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    
    if (this.classList.contains('primary')) {
      // Simulate course enrollment
      const courseName = this.closest('.course-card').querySelector('.course-title').textContent;
      alert(`${courseName} dersine kayıt işlemi başlatıldı! Yakında size ulaşacağız.`);
    } else if (this.classList.contains('secondary')) {
      // Show course details
      const courseName = this.closest('.course-card').querySelector('.course-title').textContent;
      alert(`${courseName} ders detayları yakında detaylı sayfada gösterilecek.`);
    }
  });
});

// Add ripple effect to buttons
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
}

// Add ripple effect to action buttons
document.querySelectorAll('.action-btn, .filter-btn').forEach(btn => {
  btn.addEventListener('click', createRipple);
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms linear;
    background-color: rgba(255, 255, 255, 0.6);
    pointer-events: none;
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .action-btn, .filter-btn {
    position: relative;
    overflow: hidden;
  }
`;
document.head.appendChild(style);