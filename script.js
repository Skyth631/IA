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
  let currentTooltip = null;
  let tooltipTimeout = null;
  let isHoveringTooltip = false;

  // Calendar cell hover effects
  document.querySelectorAll('.calendar-table td').forEach(cell => {
    cell.addEventListener('mouseover', function() {
      // Clear any existing timeout
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }

      // Hide previous tooltip if it exists
      if (currentTooltip) {
        currentTooltip.remove();
      }

      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
      
      // Get tooltip content
      const tooltipContent = this.querySelector('.task-tooltip');
      if (tooltipContent) {
        // Create a new tooltip at the body level
        const tooltip = document.createElement('div');
        tooltip.className = 'task-tooltip';
        tooltip.innerHTML = tooltipContent.innerHTML;
        document.body.appendChild(tooltip);
        currentTooltip = tooltip;

        // Position tooltip
        const rect = this.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Calculate initial position
        let top = rect.bottom + scrollTop + 10;
        let left = rect.left + scrollLeft + (rect.width - tooltipRect.width) / 2;
        
        // Check if tooltip would go off screen
        if (left + tooltipRect.width > window.innerWidth) {
          left = window.innerWidth - tooltipRect.width - 10;
        }
        if (left < 0) {
          left = 10;
        }
        if (top + tooltipRect.height > window.innerHeight + scrollTop) {
          top = rect.top + scrollTop - tooltipRect.height - 10;
        }
        
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        
        // Show tooltip with a slight delay
        requestAnimationFrame(() => {
          tooltip.classList.add('show');
        });
      }
    });
    
    cell.addEventListener('mouseout', function(e) {
      // Check if we're moving to the tooltip
      if (currentTooltip && e.relatedTarget && currentTooltip.contains(e.relatedTarget)) {
        isHoveringTooltip = true;
        return;
      }

      this.style.transform = '';
      this.style.boxShadow = '';
      
      // Set a timeout to hide the tooltip
      tooltipTimeout = setTimeout(() => {
        if (currentTooltip && !isHoveringTooltip) {
          currentTooltip.classList.remove('show');
          setTimeout(() => {
            currentTooltip.remove();
            currentTooltip = null;
            isHoveringTooltip = false;
          }, 300);
        }
      }, 100);
    });
  });

  // Task tooltip interactions
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.task-tooltip')) {
      isHoveringTooltip = true;
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    }
  });

  document.addEventListener('mouseout', function(e) {
    if (e.target.closest('.task-tooltip')) {
      // Check if we're moving back to the calendar cell
      const cell = e.relatedTarget?.closest('.calendar-table td');
      if (cell) {
        isHoveringTooltip = false;
        return;
      }

      // Set a timeout to hide the tooltip
      tooltipTimeout = setTimeout(() => {
        if (currentTooltip) {
          currentTooltip.classList.remove('show');
          setTimeout(() => {
            currentTooltip.remove();
            currentTooltip = null;
            isHoveringTooltip = false;
          }, 300);
        }
      }, 100);
    }
  });

  // Update tooltip position on scroll
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (currentTooltip) {
      // Debounce scroll events
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        const cell = document.querySelector('.calendar-table td:hover');
        if (cell) {
          const rect = cell.getBoundingClientRect();
          const tooltipRect = currentTooltip.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
          
          let top = rect.bottom + scrollTop + 10;
          let left = rect.left + scrollLeft + (rect.width - tooltipRect.width) / 2;
          
          if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 10;
          }
          if (left < 0) {
            left = 10;
          }
          if (top + tooltipRect.height > window.innerHeight + scrollTop) {
            top = rect.top + scrollTop - tooltipRect.height - 10;
          }
          
          currentTooltip.style.top = `${top}px`;
          currentTooltip.style.left = `${left}px`;
        }
      }, 10);
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