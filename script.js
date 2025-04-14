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
    const contentWrapper = document.getElementById('content-wrapper');
    const PRELOADER_SESSION_KEY = 'preloaderShown';

    let portfolioSwiperInstance = null; // Variable to hold the Swiper instance

    // --- Config: Background Particles ---
    const pageParticlesOptions = {
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
        } else { console.warn("Page particles container or tsParticles library not found."); }
    }

    // --- Preloader Animation Sequence ---
    function animateKeywords(callback) {
        if (!preloaderKeywords || preloaderKeywords.length === 0) { if(callback) callback(); return; }
        let delay = 300; const interval = 450;
        preloaderKeywords.forEach((keyword, index) => {
            setTimeout(() => {
                keyword.classList.add('visible');
                if (index === preloaderKeywords.length - 1) {
                    const lastKeywordTransitionDuration = 500; const finalPause = 600;
                    setTimeout(callback, lastKeywordTransitionDuration + finalPause);
                }
            }, delay + (index * interval));
        });
    }

    // --- Show/Hide Functions ---
    function hidePreloader(callback) {
        let callbackCalled = false;
        function runCallback() { if (!callbackCalled) { callbackCalled = true; if (callback) callback(); } }
        if (preloader) {
            preloader.classList.add('hidden');
            preloader.addEventListener('transitionend', () => { if (preloader && preloader.parentNode) { preloader.remove(); } runCallback(); }, { once: true });
             setTimeout(() => { if(preloader && preloader.parentNode) { preloader.remove(); } runCallback(); }, 700); // Fallback
        } else { runCallback(); }
    }

    // --- Content Visibility and Initializations ---
    function showContent() {
        console.log("showContent called");
        if (contentWrapper) {
            contentWrapper.classList.add('visible');
            console.log("Content wrapper class 'visible' added.");

            // Initialize other functions that depend on content being visible
            handleScroll();
            updateActiveNavLink();
            initScrollAnimations();
            initPortfolioSwiper(); // Initialize Swiper *after* wrapper is visible
        } else {
            console.error("Content wrapper not found!");
        }
    }

    // --- Portfolio Swiper Initialization ---
    function initPortfolioSwiper() {
        if (portfolioSwiperInstance) {
             console.warn("Portfolio Swiper already initialized. Skipping.");
             return;
        }

        const swiperContainer = document.querySelector('.portfolio-swiper');

        if (typeof Swiper !== 'undefined' && swiperContainer) {
             console.log("Attempting to initialize Portfolio Swiper...");
             try {
                 portfolioSwiperInstance = new Swiper(swiperContainer, {
                     initialSlide: 0,
                     slidesPerView: 1,
                     spaceBetween: 30,
                     loop: true,
                     grabCursor: true,
                     centeredSlides: true,
                     breakpoints: {
                         768: { slidesPerView: 1.8, spaceBetween: 40 },
                         1024: { slidesPerView: 2.2, spaceBetween: 50 }
                     },
                     pagination: { el: '.swiper-pagination', clickable: true },
                     navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                     observer: true, // Re-init on container changes
                     observeParents: true, // Re-init on parent changes
                     observeSlideChildren: true, // Re-init on slide children changes (like image load)
                 });

                 console.log("Portfolio Swiper instance created.");

                 // Force update shortly after initialization to ensure correct layout calculation
                 setTimeout(() => {
                     if (portfolioSwiperInstance && !portfolioSwiperInstance.destroyed) {
                         console.log("Updating Swiper state after short delay...");
                         portfolioSwiperInstance.update(); // Recalculate size, position etc.
                         portfolioSwiperInstance.slideToLoop(0, 0); // Go to logical slide 0 *instantly*
                         console.log("Swiper updated and snapped to initial slide after delay.");
                     } else {
                         console.log("Swiper instance not available or destroyed during timeout.");
                     }
                 }, 100); // 100ms delay - gives browser a tick to settle rendering

             } catch (error) {
                 console.error("Swiper initialization failed:", error);
                 portfolioSwiperInstance = null;
             }
         } else {
             if (typeof Swiper === 'undefined') console.error("Swiper library not loaded.");
             if (!swiperContainer) console.error("Portfolio Swiper container (.portfolio-swiper) not found.");
         }
    }

    // --- Preloader Logic ---
    const hasPreloaderShown = sessionStorage.getItem(PRELOADER_SESSION_KEY);

    if (!hasPreloaderShown && preloader) {
        console.log("First visit. Showing preloader animation.");
        if (contentWrapper) { /* Content starts hidden via CSS */ }
        animateKeywords(() => {
             hidePreloader(() => {
                 showContent(); // This will call initPortfolioSwiper
                 sessionStorage.setItem(PRELOADER_SESSION_KEY, 'true');
             });
        });
    } else {
        // Subsequent visit or no preloader
        if (hasPreloaderShown) console.log("Preloader already shown in this session.");
        else if (!preloader) console.log("Preloader element not found, skipping animation.");

        if (preloader) preloader.remove();

        // Make content visible immediately and initialize scripts
        if (contentWrapper) {
             contentWrapper.classList.add('no-transition');
             contentWrapper.classList.add('visible');
             requestAnimationFrame(() => { // Use rAF to ensure styles apply before removing class
                 requestAnimationFrame(() => {
                     contentWrapper.classList.remove('no-transition');
                 });
             });
             // Directly initialize everything since content is visible
             handleScroll();
             updateActiveNavLink();
             initScrollAnimations();
             initPortfolioSwiper(); // Initialize Swiper immediately
        } else {
            console.error("Content wrapper not found on subsequent load path!");
            // Attempt to initialize swiper anyway, though it might fail if container isn't ready
            initPortfolioSwiper();
        }
    }

    // --- Initialize Background Particles (Runs always) ---
    initBackgroundParticles();

    // --- Update Copyright Year ---
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }

    // --- Active Navigation Link Highlighting ---
    function updateActiveNavLink() {
        let currentSectionId = ''; const headerHeight = header ? header.offsetHeight : 0;
        // Add a buffer to the scroll position for earlier activation
        const scrollPosition = window.scrollY + headerHeight + 60;
        sections.forEach(section => {
            if (!section) return;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            // Check if the scroll position is within the section bounds
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });

        mainNavLinks.forEach(link => {
            if (!link) return;
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            // Match the link href with the current section ID
            if (linkHref === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Explicitly handle edge cases: top of page and bottom of page
        const isNearBottom = (window.innerHeight + Math.ceil(window.scrollY)) >= document.body.offsetHeight - 50; // 50px buffer

        if (isNearBottom && document.getElementById('contact')) { // If near bottom and contact section exists
             mainNavLinks.forEach(link => link && link.classList.remove('active'));
             const contactLink = document.querySelector('.main-nav a[href="#contact"]');
             if (contactLink) contactLink.classList.add('active');
        } else if (window.scrollY < sections[0].offsetTop - headerHeight - 60 ) { // Very top of page
             mainNavLinks.forEach(link => link && link.classList.remove('active'));
             const homeLink = document.querySelector('.main-nav a[href="#hero"]');
             if (homeLink) homeLink.classList.add('active');
        } else if (!currentSectionId && window.scrollY < 100 ) { // Fallback for top when no section matches yet
             mainNavLinks.forEach(link => link && link.classList.remove('active'));
             const homeLink = document.querySelector('.main-nav a[href="#hero"]');
             if (homeLink) homeLink.classList.add('active');
        }
    };


    // --- Header Scroll Effect ---
    function handleScroll() {
        if (header) { if (window.scrollY > 50) { header.classList.add('scrolled'); } else { header.classList.remove('scrolled'); } }
        updateActiveNavLink(); // Update nav link on scroll
    };

    // --- Scroll Event Listener (Throttled) ---
    let scrollTimeout; window.addEventListener('scroll', () => { clearTimeout(scrollTimeout); scrollTimeout = setTimeout(handleScroll, 50); });

    // --- Intersection Observer for Animations ---
    function initScrollAnimations() {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const observerCallback = (entries, observer) => {
             entries.forEach(entry => {
                 if (entry.isIntersecting) {
                     entry.target.classList.add('is-visible');
                     observer.unobserve(entry.target); // Stop observing once visible
                 }
             });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        if (elementsToAnimate.length > 0) {
             elementsToAnimate.forEach(el => {
                 // IMPORTANT: Do not animate slides with this observer, Swiper handles slide visibility
                 if (!el.closest('.swiper-slide')) {
                     observer.observe(el);
                 }
             });
        }
    }

    // --- Mobile Menu Toggle ---
    if (menuToggle && mobileNavOverlay) {
         menuToggle.addEventListener('click', () => {
             const isActive = mobileNavOverlay.classList.toggle('active');
             menuToggle.classList.toggle('active');
             menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
             // Prevent body scroll when mobile menu is open
             document.body.style.overflow = isActive ? 'hidden' : '';
         });
    }

    // --- Close Mobile Menu on Link Click ---
    if (mobileNavLinks.length > 0) {
         mobileNavLinks.forEach(link => {
             link.addEventListener('click', () => {
                 if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
                 if (menuToggle) {
                     menuToggle.classList.remove('active');
                     menuToggle.setAttribute('aria-expanded', 'false');
                 }
                 document.body.style.overflow = ''; // Restore body scroll
             });
         });
    }

    // Initial call to set things up based on initial scroll position (if any)
    handleScroll();

}); // End DOMContentLoaded