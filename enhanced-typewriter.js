// Enhanced typewriter animation for quadrant headings and other elements
class TypewriterAnimation {
  constructor(element, options = {}) {
    this.element = element;
    this.text = element.textContent;
    this.options = {
      speed: 80, // typing speed in ms
      delay: 0, // initial delay before starting
      ...options
    };
    this.isAnimating = false;
    
    // Store original text and clear element
    element.textContent = '';
    
    // Set up intersection observer for scroll-triggered animations
    this.setupIntersectionObserver();
  }
  
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isAnimating) {
          // Small delay to make it more natural
          setTimeout(() => this.startAnimation(), this.options.delay);
        }
      });
    }, {
      threshold: 0.6 // Start animation when 60% of element is visible
    });
    
    observer.observe(this.element);
  }
  
  startAnimation() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.element.textContent = '';
    let i = 0;
    
    const typeNextChar = () => {
      if (i < this.text.length) {
        this.element.textContent += this.text[i];
        i++;
        setTimeout(typeNextChar, this.options.speed);
      } else {
        this.isAnimating = false;
      }
    };
    
    typeNextChar();
  }
}

// Initialize typewriter animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Apply typewriter effect to quadrant headings with staggered delays
  const quadrantHeadings = document.querySelectorAll('.quadrant-content h3');
  quadrantHeadings.forEach((heading, index) => {
    new TypewriterAnimation(heading, {
      speed: 70, // Slightly faster for headings
      delay: index * 200 // Stagger the animations
    });
  });
  
  // Also apply to paragraph descriptions with longer delay
  const quadrantDescriptions = document.querySelectorAll('.quadrant-content p');
  quadrantDescriptions.forEach((paragraph, index) => {
    new TypewriterAnimation(paragraph, {
      speed: 60, // Faster for longer text
      delay: (index * 200) + 800 // Start after headings
    });
  });
});