document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('.site-header');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mainNavLinks = document.querySelectorAll('.main-nav .nav-link');
    const sections = document.querySelectorAll('.section'); // Target sections for active link highlighting
    const currentYearSpan = document.getElementById('current-year');

    // --- Update Copyright Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Header Scroll Effect ---
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveNavLink(); // Update active link on scroll
    };

    // Throttle scroll event listener for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 50); // Adjust timeout as needed
    });
    handleScroll(); // Initial check

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger a bit earlier
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once
            }
            // No 'else' needed if we unobserve
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));

    // --- Mobile Menu Toggle ---
    if (menuToggle && mobileNavOverlay) {
        menuToggle.addEventListener('click', () => {
            const isActive = mobileNavOverlay.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = isActive ? 'hidden' : ''; // Prevent body scroll when menu open
        });
    }

    // --- Close Mobile Menu on Link Click ---
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Restore body scroll
        });
    });

    // --- Active Navigation Link Highlighting ---
    const updateActiveNavLink = () => {
        let currentSectionId = '';
        const headerHeight = header.offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 50; // Offset for better accuracy

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        mainNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Handle edge case for top of page (Hero section)
        if (window.scrollY < sections[0].offsetTop + sections[0].offsetHeight - headerHeight - 50) {
             mainNavLinks.forEach(link => link.classList.remove('active'));
             const homeLink = document.querySelector('.main-nav a[href="#hero"]');
             if (homeLink) homeLink.classList.add('active');
        }
        // Handle edge case for bottom of page (Contact section)
        else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) { // Near bottom
            mainNavLinks.forEach(link => link.classList.remove('active'));
            const contactLink = document.querySelector('.main-nav a[href="#contact"]');
            if (contactLink) contactLink.classList.add('active');
        }
    };

    // Initial call and add listener (already handled by scroll listener setup)
    updateActiveNavLink();

});