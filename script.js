// JavaScript functionality for Homework Tracker

document.addEventListener('DOMContentLoaded', function() {
  initializeAnimations();
  initializeTaskManagement();
  initializeCalendarInteractions();
});

function initializeAnimations() {
  // Add entrance animations to elements
  const elements = document.querySelectorAll('.container, .calendar-section, .task-item');
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    setTimeout(() => {
      element.style.transition = 'all 0.5s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
}

function initializeTaskManagement() {
  // Task completion animation
  document.querySelectorAll('.task-item').forEach(task => {
    task.addEventListener('click', function() {
      if (!this.classList.contains('completing')) {
        this.classList.add('completing');
        this.style.transform = 'scale(0.95)';
        this.style.opacity = '0.8';
        setTimeout(() => {
          this.classList.remove('completing');
          this.style.transform = '';
          this.style.opacity = '';
        }, 200);
      }
    });
  });

  // Priority indicator animations
  document.querySelectorAll('.task-indicator').forEach(indicator => {
    indicator.addEventListener('mouseover', function() {
      this.style.transform = 'scale(1.2)';
    });
    indicator.addEventListener('mouseout', function() {
      this.style.transform = 'scale(1)';
    });
  });
}

function initializeCalendarInteractions() {
  // Calendar cell hover effects
  document.querySelectorAll('.calendar-table td').forEach(cell => {
    cell.addEventListener('mouseover', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    });
    
    cell.addEventListener('mouseout', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });

  // Task tooltip positioning
  document.querySelectorAll('.calendar-day').forEach(day => {
    const tooltip = day.querySelector('.task-tooltip');
    if (tooltip) {
      day.addEventListener('mouseover', () => {
        // Ensure tooltip stays within viewport
        const rect = tooltip.getBoundingClientRect();
        if (rect.top < 0) {
          tooltip.style.top = '120%';
          tooltip.style.bottom = 'auto';
        }
        if (rect.left < 0) {
          tooltip.style.left = '0';
          tooltip.style.transform = 'none';
        }
        if (rect.right > window.innerWidth) {
          tooltip.style.left = 'auto';
          tooltip.style.right = '0';
          tooltip.style.transform = 'none';
        }
      });
    }
  });
}

// Form validation and submission
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    const inputs = this.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('invalid');
        
        // Add shake animation
        input.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
          input.style.animation = '';
        }, 500);
      } else {
        input.classList.remove('invalid');
      }
    });

    if (!isValid) {
      e.preventDefault();
    }
  });
});

// Add shake animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Responsive navigation
const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', function() {
    const nav = document.querySelector('.main-nav');
    nav.classList.toggle('active');
    
    // Add slide animation
    if (nav.classList.contains('active')) {
      nav.style.maxHeight = nav.scrollHeight + 'px';
    } else {
      nav.style.maxHeight = '0';
    }
  });
}

// Dynamic task counter
function updateTaskCounter() {
  const taskCount = document.querySelectorAll('.task-item').length;
  const counter = document.querySelector('.task-counter');
  if (counter) {
    counter.textContent = taskCount;
    counter.style.animation = 'pulse 0.5s ease';
  }
}

// Add task counter animation
const counterStyle = document.createElement('style');
counterStyle.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(counterStyle);

// Initialize tooltips
document.querySelectorAll('[data-tooltip]').forEach(element => {
  const tooltip = element.getAttribute('data-tooltip');
  const tooltipEl = document.createElement('div');
  tooltipEl.className = 'tooltip';
  tooltipEl.textContent = tooltip;
  
  element.addEventListener('mouseover', () => {
    document.body.appendChild(tooltipEl);
    const rect = element.getBoundingClientRect();
    tooltipEl.style.top = rect.bottom + 5 + 'px';
    tooltipEl.style.left = rect.left + (rect.width / 2) - (tooltipEl.offsetWidth / 2) + 'px';
    tooltipEl.style.opacity = '1';
  });
  
  element.addEventListener('mouseout', () => {
    tooltipEl.remove();
  });
}); 