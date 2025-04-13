document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const preloader = document.getElementById('preloader');
    const preloaderHeadline = document.getElementById('preloader-headline');
    const pageParticlesContainerId = 'page-particles'; // ID for background particles
    const header = document.querySelector('.site-header');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mainNavLinks = document.querySelectorAll('.main-nav .nav-link');
    const sections = document.querySelectorAll('.section');
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const currentYearSpan = document.getElementById('current-year');
    const mainContent = document.getElementById('main-content');

    // --- Config: Typing Effect ---
    const headlineText = "Crafting Clear, Compelling Content for the Digital Age.";
    const typingSpeed = 60; // Milliseconds per character

    // --- Config: Background Particles ---
    const pageParticlesOptions = {
        // fpsLimit: 60, // Use defaults or lower if needed
        interactivity: {
            events: { // No interactivity for background
                onHover: { enable: false },
                onClick: { enable: false },
                resize: true,
            },
        },
        particles: {
            color: { value: "#a020f0" }, // Neon Purple
            links: {
                color: "#c879ff", // Lighter Purple
                distance: 160,
                enable: true,
                opacity: 0.15, // Make links fainter for background
                width: 1,
            },
            collisions: { enable: false },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "out" },
                random: true,
                speed: 0.8, // Slower speed for background
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 1000, // Lower density for background
                },
                value: 50, // Fewer particles for background
            },
            opacity: { value: 0.3 }, // Lower opacity
            shape: { type: "circle" },
            size: { value: { min: 1, max: 2 } }, // Smaller particles
        },
        detectRetina: true,
        fullScreen: { enable: false } // MUST be false to attach to our container
    };

    // --- Initialize Background tsParticles ---
    if (document.getElementById(pageParticlesContainerId) && typeof tsParticles !== 'undefined') {
        tsParticles.load(pageParticlesContainerId, pageParticlesOptions)
            .then(container => {
                console.log("Background tsParticles loaded");
            })
            .catch(error => {
                console.error("Error loading background tsParticles:", error);
                 // Hide preloader if background particles fail, show content
                if(preloader) preloader.classList.add('hidden');
                if(mainContent) mainContent.style.opacity = 1;
            });
    } else {
         console.error("Page particles container or tsParticles library not found.");
         if(preloader) preloader.classList.add('hidden'); // Hide preloader if lib missing
         if(mainContent) mainContent.style.opacity = 1; // Show content immediately
    }


    // --- Typing Effect Function ---
    function typeEffect(element, text, speed, callback) {
        let i = 0;
        element.innerHTML = ""; // Clear initial content
        element.classList.remove('typing-done'); // Ensure cursor is visible

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.add('typing-done'); // Add class to hide cursor
                if (callback) callback(); // Execute callback when typing finishes
            }
        }
        type(); // Start typing
    }

    // --- Preloader Handling (Triggered after typing) ---
    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hidden');
            preloader.addEventListener('transitionend', () => {
                 if (preloader.classList.contains('hidden')) {
                     preloader.remove();
                 }
            }, { once: true });

            // Start main content fade-in CSS animation
            if (mainContent) {
                mainContent.style.animationPlayState = 'running';
            }
        }
    }

    // --- Start Typing Animation ---
    if (preloaderHeadline) {
        // Start typing, and when done, call hidePreloader
        typeEffect(preloaderHeadline, headlineText, typingSpeed, hidePreloader);
    } else {
        // If headline element isn't found, hide preloader immediately
        hidePreloader();
    }

    // --- Update Copyright Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Active Navigation Link Highlighting ---
    // Function remains the same as previous correct version
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
    // Function remains the same as previous correct version
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
    // Logic remains the same
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
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

    // --- Initial Calls on Load ---
    handleScroll();
    updateActiveNavLink();

}); // End of DOMContentLoaded