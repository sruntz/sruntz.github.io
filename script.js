document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const preloader = document.getElementById('preloader');
    const header = document.querySelector('.site-header');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mainNavLinks = document.querySelectorAll('.main-nav .nav-link');
    const sections = document.querySelectorAll('.section'); // Sections for active link
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const currentYearSpan = document.getElementById('current-year');
    const mainContent = document.getElementById('main-content'); // To fade in main content

    // --- Preloader Handling ---
    if (preloader) {
        // Use window.onload to ensure everything including images is loaded
        window.onload = () => {
            preloader.classList.add('hidden');
            // Remove after transition
             preloader.addEventListener('transitionend', () => {
                if (preloader.classList.contains('hidden')) {
                   preloader.remove();
                }
             }, { once: true }); // Ensure listener runs only once

             // Start main content fade-in animation via CSS after preloader starts hiding
             if(mainContent) {
                mainContent.style.animationPlayState = 'running'; // Trigger CSS animation
             }
        };
        // Fallback if window.onload doesn't fire (e.g., infinite loading resources)
        setTimeout(() => {
            if (!preloader.classList.contains('hidden')) {
                 preloader.classList.add('hidden');
                  if(mainContent && mainContent.style.animationPlayState !== 'running') {
                     mainContent.style.animationPlayState = 'running';
                  }
            }
        }, 3000); // Hide after 3 seconds max
    } else {
         // If no preloader, run main content animation immediately
         if(mainContent) {
            mainContent.style.opacity = 1; // Make visible directly
            mainContent.style.animation = 'none'; // Disable fade-in animation
         }
    }


    // --- Update Copyright Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Active Navigation Link Highlighting ---
    function updateActiveNavLink() {
        let currentSectionId = '';
        const headerHeight = header ? header.offsetHeight : 0;
        const scrollPosition = window.scrollY + headerHeight + 60; // Adjusted offset

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
        } else if ((window.innerHeight + Math.ceil(window.scrollY)) >= document.body.offsetHeight - 2) { // More precise bottom check
            mainNavLinks.forEach(link => link && link.classList.remove('active'));
            const contactLink = document.querySelector('.main-nav a[href="#contact"]');
            if (contactLink) contactLink.classList.add('active');
        } else if (!currentSectionId && window.scrollY < 100) { // Explicitly activate Home if near top and no section matches
             mainNavLinks.forEach(link => link && link.classList.remove('active'));
             const homeLink = document.querySelector('.main-nav a[href="#hero"]');
             if (homeLink) homeLink.classList.add('active');
        }
    };

    // --- Header Scroll Effect ---
    function handleScroll() {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        updateActiveNavLink(); // Update nav link on scroll
    };

    // --- Scroll Event Listener (Throttled) ---
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 50); // Throttle calls
    });

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    if (elementsToAnimate.length > 0) {
        elementsToAnimate.forEach(el => observer.observe(el));
    }

    // --- Mobile Menu Toggle ---
    if (menuToggle && mobileNavOverlay) {
        menuToggle.addEventListener('click', () => {
            const isActive = mobileNavOverlay.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
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
                document.body.style.overflow = ''; // Restore scroll
            });
        });
    }

    // --- Initial Calls on Load ---
    handleScroll(); // Set initial header state
    updateActiveNavLink(); // Set initial active link

}); // End of DOMContentLoaded