document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
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
    const contentWrapper = document.getElementById('content-wrapper'); // Wrapper for main/footer

    const PRELOADER_SESSION_KEY = 'preloaderShown';

    // --- Config: Background Particles ---
    const pageParticlesOptions = {
        // Configuration remains the same as previous step
        interactivity: { events: { onHover: { enable: false }, onClick: { enable: false }, resize: true, }, },
        particles: { color: { value: "#a020f0" }, links: { color: "#c879ff", distance: 160, enable: true, opacity: 0.15, width: 1, }, collisions: { enable: false }, move: { direction: "none", enable: true, outModes: { default: "out" }, random: true, speed: 0.8, straight: false, }, number: { density: { enable: true, area: 1000, }, value: 50, }, opacity: { value: 0.3 }, shape: { type: "circle" }, size: { value: { min: 1, max: 2 } }, },
        detectRetina: true, fullScreen: { enable: false }
    };

    // --- Initialize Background tsParticles ---
    function initBackgroundParticles() {
        if (document.getElementById(pageParticlesContainerId) && typeof tsParticles !== 'undefined') {
            tsParticles.load(pageParticlesContainerId, pageParticlesOptions)
                .then(container => { console.log("Background tsParticles loaded"); })
                .catch(error => { console.error("Error loading background tsParticles:", error); });
        } else {
            console.error("Page particles container or tsParticles library not found.");
        }
    }

    // --- Preloader Animation Sequence ---
    function animateKeywords(callback) {
        let delay = 500; // Initial delay after base text fades (defined in CSS)
        const interval = 400; // Delay between each keyword animation

        preloaderKeywords.forEach((keyword, index) => {
            setTimeout(() => {
                keyword.classList.add('visible');
                // If it's the last keyword, set a timeout for the callback
                if (index === preloaderKeywords.length - 1) {
                    setTimeout(callback, interval + 500); // Add extra pause after last word
                }
            }, delay + (index * interval));
        });
    }

    // --- Show/Hide Functions ---
    function hidePreloader(callback) {
        if (preloader) {
            preloader.classList.add('hidden');
            // Use transitionend for cleaner removal
            preloader.addEventListener('transitionend', () => {
                if (preloader.classList.contains('hidden')) {
                    preloader.remove();
                }
                if (callback) callback(); // Call next step after transition
            }, { once: true });
             // Fallback if transitionend doesn't fire
             setTimeout(() => {
                 if(preloader && preloader.parentNode) { // Check if still in DOM
                     preloader.remove();
                 }
                  if (callback) callback();
             }, 600); // Slightly longer than CSS transition
        } else {
             if (callback) callback(); // Proceed if no preloader found
        }
    }

    function showContent() {
        if (contentWrapper) {
            contentWrapper.classList.add('visible');
            contentWrapper.classList.remove('content-hidden'); // Remove display blocking class if used
        }
        // Initialize scroll-based functionalities after content is shown
        handleScroll();
        updateActiveNavLink();
        initScrollAnimations(); // Initialize IntersectionObserver here
    }

    // --- Preloader Logic ---
    const hasPreloaderShown = sessionStorage.getItem(PRELOADER_SESSION_KEY);

    if (!hasPreloaderShown) {
        // First visit this session: Animate Preloader
        console.log("First visit this session. Showing preloader animation.");
        if (preloaderKeywords.length > 0) {
             // Start keyword animation, then hide preloader, then show content
            animateKeywords(() => {
                 hidePreloader(() => {
                     showContent();
                     sessionStorage.setItem(PRELOADER_SESSION_KEY, 'true'); // Mark as shown
                 });
            });
        } else {
            // Fallback if keywords aren't found
            console.log("Preloader keywords not found, hiding immediately.");
             hidePreloader(() => {
                 showContent();
                 sessionStorage.setItem(PRELOADER_SESSION_KEY, 'true');
             });
        }
    } else {
        // Subsequent visit: Hide preloader instantly, show content
        console.log("Preloader already shown this session.");
        if (preloader) {
             preloader.style.display = 'none'; // Hide immediately
             preloader.remove(); // Remove from DOM
        }
        showContent(); // Show content immediately
    }

    // --- Initialize Background Particles (Runs always) ---
    initBackgroundParticles();

    // --- Update Copyright Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Active Navigation Link Highlighting ---
    // Function definition remains the same
    function updateActiveNavLink() {
         let currentSectionId = '';
        const headerHeight = header ? header.offsetHeight : 0;
        const scrollPosition = window.scrollY + headerHeight + 60;

        sections.forEach(section => {
            if (!section) return;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });

        mainNavLinks.forEach(link => {
            if (!link) return;
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Edge cases refinement
        if (sections.length > 0 && window.scrollY < sections[0].offsetTop - headerHeight - 60) {
             mainNavLinks.forEach(link => link && link.classList.remove('active'));
             const homeLink = document.querySelector('.main-nav a[href="#hero"]');
             if (homeLink) homeLink.classList.add('active');
        } else if ((window.innerHeight + Math.ceil(window.scrollY)) >= document.body.offsetHeight - 2) {
            mainNavLinks.forEach(link => link && link.classList.remove('active'));
            const contactLink = document.querySelector('.main-nav a[href="#contact"]');
            if (contactLink) contactLink.classList.add('active');
        } else if (!currentSectionId && window.scrollY < 100) {
             mainNavLinks.forEach(link => link && link.classList.remove('active'));
             const homeLink = document.querySelector('.main-nav a[href="#hero"]');
             if (homeLink) homeLink.classList.add('active');
        }
    };


    // --- Header Scroll Effect ---
    // Function definition remains the same
    function handleScroll() {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        updateActiveNavLink();
    };


    // --- Scroll Event Listener (Throttled) ---
    // Logic remains the same
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 50);
    });


    // --- Intersection Observer for Animations ---
    // Initialize separately, called by showContent
    function initScrollAnimations() {
        const observerOptions = {
            root: null, rootMargin: '0px', threshold: 0.15
        };
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        if (elementsToAnimate.length > 0) {
            elementsToAnimate.forEach(el => observer.observe(el));
        }
    }


    // --- Mobile Menu Toggle ---
    // Logic remains the same
    if (menuToggle && mobileNavOverlay) {
       menuToggle.addEventListener('click', () => {
           const isActive = mobileNavOverlay.classList.toggle('active');
           menuToggle.classList.toggle('active');
           menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
           document.body.style.overflow = isActive ? 'hidden' : '';
       });
    }


    // --- Close Mobile Menu on Link Click ---
    // Logic remains the same
    if (mobileNavLinks.length > 0) {
       mobileNavLinks.forEach(link => {
           link.addEventListener('click', () => {
               if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
               if (menuToggle) {
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
               }
               document.body.style.overflow = '';
           });
       });
    }

    // --- Initial Calls (if content shown immediately) ---
    // Note: handleScroll & updateActiveNavLink are now called within showContent

}); // End of DOMContentLoaded