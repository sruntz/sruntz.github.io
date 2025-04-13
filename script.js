document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const preloader = document.getElementById('preloader');
    const preloaderKeywords = document.querySelectorAll('#preloader .preloader-keyword'); // Select new elements
    const pageParticlesContainerId = 'page-particles';
    const header = document.querySelector('.site-header');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mainNavLinks = document.querySelectorAll('.main-nav .nav-link');
    const sections = document.querySelectorAll('.section');
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const currentYearSpan = document.getElementById('current-year');
    const contentWrapper = document.getElementById('content-wrapper'); // Wrapper is crucial

    const PRELOADER_SESSION_KEY = 'preloaderShown';

    // --- Config: Background Particles ---
    const pageParticlesOptions = { /* Configuration remains the same */
        interactivity: { events: { onHover: { enable: false }, onClick: { enable: false }, resize: true, }, },
        particles: { color: { value: "#a020f0" }, links: { color: "#c879ff", distance: 160, enable: true, opacity: 0.15, width: 1, }, collisions: { enable: false }, move: { direction: "none", enable: true, outModes: { default: "out" }, random: true, speed: 0.8, straight: false, }, number: { density: { enable: true, area: 1000, }, value: 50, }, opacity: { value: 0.3 }, shape: { type: "circle" }, size: { value: { min: 1, max: 2 } }, },
        detectRetina: true, fullScreen: { enable: false }
    };

    // --- Initialize Background tsParticles ---
    function initBackgroundParticles() { /* Function remains the same */
        if (document.getElementById(pageParticlesContainerId) && typeof tsParticles !== 'undefined') {
            tsParticles.load(pageParticlesContainerId, pageParticlesOptions)
                .then(container => { console.log("Background tsParticles loaded"); })
                .catch(error => { console.error("Error loading background tsParticles:", error); });
        } else { console.error("Page particles container or tsParticles library not found."); }
    }

    // --- Preloader Animation Sequence (Keywords) ---
    function animateKeywords(callback) {
        if (!preloaderKeywords || preloaderKeywords.length === 0) {
             console.warn("No preloader keywords found to animate.");
             if(callback) callback(); // Proceed if no keywords
             return;
        }

        let delay = 300; // Start faster after page load
        const interval = 450; // Time between each word appearing

        preloaderKeywords.forEach((keyword, index) => {
            setTimeout(() => {
                keyword.classList.add('visible'); // Trigger CSS transition
                // If it's the last keyword, schedule the callback
                if (index === preloaderKeywords.length - 1) {
                    // Add a final pause *after* the last animation should finish
                    const lastKeywordTransitionDuration = 500; // Match CSS transition duration
                    const finalPause = 600; // Extra breathing room
                    setTimeout(callback, lastKeywordTransitionDuration + finalPause);
                }
            }, delay + (index * interval));
        });
    }

    // --- Show/Hide Functions ---
    function hidePreloader(callback) { /* Function remains the same */
        if (preloader) {
            preloader.classList.add('hidden');
            preloader.addEventListener('transitionend', () => {
                if (preloader && preloader.parentNode) { preloader.remove(); } // Check before removing
                if (callback) callback();
            }, { once: true });
            // Fallback timeout
             setTimeout(() => {
                 if(preloader && preloader.parentNode) { preloader.remove(); }
                 // Ensure callback runs even if transitionend fails
                 if (typeof window.preloaderCallbackCalled === 'undefined' || !window.preloaderCallbackCalled) {
                      window.preloaderCallbackCalled = true; // Prevent double calls
                      if (callback) callback();
                 }
             }, 700); // Match CSS transition (0.6s) + small buffer
        } else {
            if (callback) callback();
        }
    }

    function showContent() { /* Function remains the same */
        if (contentWrapper) {
            contentWrapper.classList.add('visible');
            // contentWrapper.classList.remove('content-hidden'); // Optional: If using display:none
        }
        handleScroll(); // Initial check for header style
        updateActiveNavLink(); // Initial nav link state
        initScrollAnimations(); // Start observing for scroll animations
    }

    // --- Preloader Logic (Using sessionStorage) ---
    const hasPreloaderShown = sessionStorage.getItem(PRELOADER_SESSION_KEY);

    if (!hasPreloaderShown) {
        // First visit: Animate Preloader
        console.log("First visit. Showing preloader animation.");
         // Ensure content wrapper is hidden initially ONLY if preloader runs
         if (contentWrapper) contentWrapper.classList.add('content-hidden'); // May not be needed if default opacity is 0

        // Start keyword animation, then hide preloader, then show content
        animateKeywords(() => {
            hidePreloader(() => {
                showContent();
                sessionStorage.setItem(PRELOADER_SESSION_KEY, 'true');
                delete window.preloaderCallbackCalled; // Reset fallback flag
            });
        });
    } else {
        // Subsequent visit: Hide preloader instantly, show content
        console.log("Preloader already shown.");
        if (preloader) {
            preloader.style.transition = 'none'; // Prevent fade-out animation
            preloader.classList.add('hidden');
            preloader.remove();
        }
         if (contentWrapper) contentWrapper.style.transition = 'none'; // Prevent fade-in delay/animation
        showContent(); // Show content immediately
    }

    // --- Initialize Background Particles (Runs always) ---
    initBackgroundParticles();

    // --- Update Copyright Year ---
    // Logic remains the same
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }

    // --- Active Navigation Link Highlighting ---
    // Function definition remains the same
    function updateActiveNavLink() { /* ... */
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
     }

    // --- Header Scroll Effect ---
    // Function definition remains the same
    function handleScroll() { /* ... */
         if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        updateActiveNavLink();
    }

    // --- Scroll Event Listener (Throttled) ---
    // Logic remains the same
    let scrollTimeout;
    window.addEventListener('scroll', () => { clearTimeout(scrollTimeout); scrollTimeout = setTimeout(handleScroll, 50); });

    // --- Intersection Observer for Animations ---
    // Function definition remains the same
    function initScrollAnimations() { /* ... */
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const observerCallback = (entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        if (elementsToAnimate.length > 0) { elementsToAnimate.forEach(el => observer.observe(el)); }
    }

    // --- Mobile Menu Toggle ---
    // Logic remains the same
    if (menuToggle && mobileNavOverlay) { /* ... */
         menuToggle.addEventListener('click', () => {
            const isActive = mobileNavOverlay.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    // --- Close Mobile Menu on Link Click ---
    // Logic remains the same
     if (mobileNavLinks.length > 0) { /* ... */
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
    // These are now called within showContent() or unconditionally if needed
    // handleScroll(); // Called by showContent if wrapper exists
    // updateActiveNavLink(); // Called by showContent if wrapper exists

}); // End of DOMContentLoaded