document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const preloaderKeywords = document.querySelectorAll('#preloader .preloader-keyword');
    const pageParticlesContainerId = 'page-particles';
    const header = document.querySelector('.site-header');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mainNavLinks = document.querySelectorAll('.main-nav .nav-link');
    const sections = document.querySelectorAll('.section');
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const currentYearSpan = document.getElementById('current-year');
    const contentWrapper = document.getElementById('content-wrapper');
    const PRELOADER_SESSION_KEY = 'preloaderShown';

    // Removed portfolioSwiperInstance variable

    const pageParticlesOptions = {
        interactivity: { events: { onHover: { enable: false }, onClick: { enable: false }, resize: true } },
        particles: {
            color: { value: "#a020f0" },
            links: { color: "#c879ff", distance: 160, enable: true, opacity: 0.15, width: 1 },
            collisions: { enable: false },
            move: { direction: "none", enable: true, outModes: { default: "out" }, random: true, speed: 0.8, straight: false },
            number: { density: { enable: true, area: 1000 }, value: 50 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 2 } }
        },
        detectRetina: true,
        fullScreen: { enable: false }
    };

    function initBackgroundParticles() {
        if (document.getElementById(pageParticlesContainerId) && typeof tsParticles !== 'undefined') {
            tsParticles.load(pageParticlesContainerId, pageParticlesOptions)
                .then(() => console.log("Background tsParticles loaded"))
                .catch(error => console.error("Error loading background tsParticles:", error));
        }
    }

    function animateKeywords(callback) {
        if (!preloaderKeywords || preloaderKeywords.length === 0) { if (callback) callback(); return; }
        const delay = 300;
        const interval = 450;
        preloaderKeywords.forEach((keyword, index) => {
            setTimeout(() => {
                keyword.classList.add('visible');
                if (index === preloaderKeywords.length - 1) {
                    setTimeout(callback, 1100);
                }
            }, delay + (index * interval));
        });
    }

    function hidePreloader(callback) {
        if (preloader) {
            preloader.classList.add('hidden');
            preloader.addEventListener('transitionend', () => {
                preloader.remove();
                if (callback) callback();
            }, { once: true });
            setTimeout(() => { if (preloader && preloader.parentNode) preloader.remove(); if (callback) callback(); }, 700); // Increased timeout slightly for safety
        } else if (callback) {
            callback();
        }
    }


    function showContent() {
        if (contentWrapper) {
            contentWrapper.classList.add('visible');
            handleScroll(); // Update nav state immediately
            updateActiveNavLink(); // Update nav state immediately
            initScrollAnimations(); // Start observing for animations
        }
    }

    // Removed initPortfolioSwiper function

    function updateActiveNavLink() {
        let currentSectionId = '';
        const headerHeight = header ? header.offsetHeight : 0;
        const scrollPosition = window.scrollY + headerHeight + 60; // Offset for activation point

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            // Check if the scroll position is within the section boundaries
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // If no section is currently active (e.g., very top or very bottom not quite hitting a section), check edge cases
        if (!currentSectionId) {
            // Check if near the top (Hero section)
             if (window.scrollY < sections[0].offsetTop + sections[0].offsetHeight - headerHeight - 60) {
                 currentSectionId = 'hero';
             } else {
                 // Check if near the bottom (Contact section)
                 const isNearBottom = (window.innerHeight + Math.ceil(window.scrollY)) >= document.body.offsetHeight - 50;
                 if (isNearBottom && document.getElementById('contact')) {
                    currentSectionId = 'contact';
                 }
             }
        }


        mainNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }


    function handleScroll() {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
        updateActiveNavLink(); // Update active link on scroll
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 50); // Debounce scroll event
    });

    function initScrollAnimations() {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 }; // Trigger when 15% visible
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        elementsToAnimate.forEach(el => {
            // The check !el.closest('.swiper-slide') is no longer needed
            observer.observe(el);
        });
    }

    // Mobile Menu Toggle Logic
    if (menuToggle && mobileNavOverlay) {
        menuToggle.addEventListener('click', () => {
            const isActive = mobileNavOverlay.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = isActive ? 'hidden' : ''; // Prevent body scroll when mobile nav is open
        });
    }

    // Mobile Menu Link Click Logic
    if (mobileNavLinks.length > 0) {
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = ''; // Restore body scroll
            });
        });
    }

    // Preloader Logic
    const hasPreloaderShown = sessionStorage.getItem(PRELOADER_SESSION_KEY);

    if (!hasPreloaderShown && preloader) {
        // Preloader hasn't been shown this session, run animation
        animateKeywords(() => {
            hidePreloader(() => {
                showContent();
                sessionStorage.setItem(PRELOADER_SESSION_KEY, 'true'); // Mark as shown
            });
        });
    } else {
        // Preloader has been shown or doesn't exist, show content immediately
        if (preloader) preloader.remove(); // Remove preloader instantly
        if (contentWrapper) {
            // Apply classes to show content instantly without fade-in transition
            contentWrapper.classList.add('no-transition', 'visible');
            // Use requestAnimationFrame to remove 'no-transition' after the browser has rendered the 'visible' state
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                     contentWrapper.classList.remove('no-transition');
                 });
            });
            handleScroll(); // Initialize header state and nav links
            updateActiveNavLink(); // Initialize nav links
            initScrollAnimations(); // Initialize scroll animations
        }
    }

    // Initialize Background Particles
    initBackgroundParticles();

    // Set Current Year in Footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Removed window.addEventListener('load', ...) for Swiper

});