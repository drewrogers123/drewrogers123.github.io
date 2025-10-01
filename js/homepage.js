// Homepage JavaScript - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    // Utility: Debounce function for performance
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

    // ===== NAVIGATION =====
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu) {
                    navMenu.classList.remove('active');
                    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });

    // ===== NAVBAR SCROLL EFFECTS =====
    
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    const handleNavbarScroll = () => {
        const currentScrollY = window.scrollY;

        // Add scrolled class
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll (optional)
        if (currentScrollY > lastScrollY && currentScrollY > 500) {
            navbar.classList.add('navbar-hidden');
        } else {
            navbar.classList.remove('navbar-hidden');
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', debounce(handleNavbarScroll, 10));

    // ===== ACTIVE NAVIGATION HIGHLIGHTING =====
    
    const updateActiveNav = debounce(() => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 50);

    window.addEventListener('scroll', updateActiveNav);

    // ===== SCROLL ANIMATIONS =====
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Project cards animation
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Animate other elements
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===== SCROLL TO TOP BUTTON =====
    
    const scrollTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollTopBtn) {
        const toggleScrollTopBtn = debounce(() => {
            if (window.pageYOffset > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, 100);

        window.addEventListener('scroll', toggleScrollTopBtn);

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== LAZY LOADING IMAGES =====
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ===== CONTACT FORM VALIDATION =====
    
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Submit form (replace with your actual submission logic)
            submitForm(data);
        });
    }
    
    // Email validation function
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Form submission handler
    function submitForm(formData) {
        // Show loading state
        const submitBtn = document.querySelector('#contact-form button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
        
        // Here you would typically make an API call to your backend
        // For now, we'll simulate a successful submission
        setTimeout(() => {
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }, 1500);
        
        // Example of how you would make a real API call:
        /*
        fetch('your-api-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Failed to send message. Please try again.', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
        */
    }
    
    // Notification function - For demonstration purposes only
    // Note: This is a frontend-only implementation for UI demonstration.
    // In a production environment, you would want to connect this to a backend service
    // to actually send and store the contact form submissions.
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
            
            // Add some basic styles if not already in CSS
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .notification {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        padding: 15px 25px;
                        border-radius: 4px;
                        color: white;
                        font-weight: 500;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        z-index: 1000;
                        transform: translateY(100px);
                        opacity: 0;
                        transition: all 0.3s ease;
                    }
                    .notification.show {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    .notification.success { background-color: #10b981; }
                    .notification.error { background-color: #ef4444; }
                    .notification.info { background-color: #3b82f6; }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Set message and type
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function submitForm(data) {
        // Replace with your actual form submission
        console.log('Form submitted:', data);
        showNotification('Message sent successfully!', 'success');
        if (contactForm) contactForm.reset();
    }

    // ===== NOTIFICATION SYSTEM =====
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ===== PROJECT LINKS TRACKING =====
    
    const projectLinks = document.querySelectorAll('.project-links a');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Analytics tracking
            const projectName = this.closest('.project-card')?.querySelector('h3')?.textContent || 'Unknown';
            const linkType = this.textContent.toLowerCase().includes('demo') ? 'demo' : 'github';
            
            console.log('Project link clicked:', {
                project: projectName,
                type: linkType,
                url: this.href
            });
            
            // Add your analytics code here (Google Analytics, etc.)
        });
    });

    // ===== TYPING EFFECT (Optional) =====
    
    const typingElement = document.querySelector('.typing-text');
    
    if (typingElement) {
        const texts = typingElement.dataset.texts?.split('|') || ['Web Developer', 'Designer', 'Creator'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    // ===== TAB FUNCTIONALITY (for research page) =====
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                const activeContent = document.getElementById(tabName);
                if (activeContent) {
                    activeContent.classList.add('active');
                    
                    // Scroll to tabs container smoothly
                    const tabsContainer = document.querySelector('.tabs-container');
                    if (tabsContainer) {
                        const offset = tabsContainer.offsetTop - 70;
                        window.scrollTo({
                            top: offset,
                            behavior: 'smooth'
                        });
                    }
                }
                
                // Update URL hash without jumping
                history.pushState(null, null, `#${tabName}`);
                
                // Re-observe animated elements in the new tab
                const newAnimateElements = activeContent.querySelectorAll('.animate-on-scroll');
                newAnimateElements.forEach(el => {
                    if (!el.classList.contains('animated')) {
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(30px)';
                        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        observer.observe(el);
                    }
                });
            });
        });

        // Check for hash in URL on load
        const hash = window.location.hash.substring(1);
        if (hash) {
            const tabButton = document.querySelector(`[data-tab="${hash}"]`);
            if (tabButton) {
                // Small delay to ensure page is loaded
                setTimeout(() => tabButton.click(), 100);
            }
        }
    }

    // ===== INITIALIZE =====
    
    // Set initial active nav on load
    updateActiveNav();
    
    // Log initialization
    console.log('Homepage initialized successfully');
});