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

    const pageParticlesOptions = {
        interactivity: { events: { onHover: { enable: false }, onClick: { enable: false }, resize: true, }, },
        particles: { color: { value: "#a020f0" }, links: { color: "#c879ff", distance: 160, enable: true, opacity: 0.15, width: 1, }, collisions: { enable: false }, move: { direction: "none", enable: true, outModes: { default: "out" }, random: true, speed: 0.8, straight: false, }, number: { density: { enable: true, area: 1000, }, value: 50, }, opacity: { value: 0.3 }, shape: { type: "circle" }, size: { value: { min: 1, max: 2 } }, },
        detectRetina: true, fullScreen: { enable: false }
    };

    function initBackgroundParticles() {
        if (document.getElementById(pageParticlesContainerId) && typeof tsParticles !== 'undefined') {
            tsParticles.load(pageParticlesContainerId, pageParticlesOptions)
                .then(container => { console.log("Background tsParticles loaded"); })
                .catch(error => { console.error("Error loading background tsParticles:", error); });
        } else { console.error("Page particles container or tsParticles library not found."); }
    }

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

    function hidePreloader(callback) {
        let callbackCalled = false;
        function runCallback() { if (!callbackCalled) { callbackCalled = true; if (callback) callback(); } }
        if (preloader) {
            preloader.classList.add('hidden');
            preloader.addEventListener('transitionend', () => { if (preloader && preloader.parentNode) { preloader.remove(); } runCallback(); }, { once: true });
             setTimeout(() => { if(preloader && preloader.parentNode) { preloader.remove(); } runCallback(); }, 700);
        } else { runCallback(); }
    }

    function showContent() {
        if (contentWrapper) { contentWrapper.classList.add('visible'); }
        handleScroll(); updateActiveNavLink(); initScrollAnimations(); initPortfolioSwiper();
    }

    function initPortfolioSwiper() {
        if (typeof Swiper !== 'undefined') {
            const swiper = new Swiper('.portfolio-swiper', {
                slidesPerView: 1, spaceBetween: 30, loop: true, grabCursor: true, centeredSlides: true,
                 breakpoints: { 768: { slidesPerView: 1.8, spaceBetween: 40 }, 1024: { slidesPerView: 2.2, spaceBetween: 50 } },
                pagination: { el: '.swiper-pagination', clickable: true, },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev', },
            });
             console.log("Portfolio Swiper initialized.");
        } else { console.error("Swiper library not loaded."); }
    }

    const hasPreloaderShown = sessionStorage.getItem(PRELOADER_SESSION_KEY);
    if (!hasPreloaderShown) {
        console.log("First visit. Showing preloader animation.");
        if (contentWrapper) contentWrapper.style.opacity = 0; // Ensure hidden
        animateKeywords(() => {
            hidePreloader(() => {
                showContent();
                sessionStorage.setItem(PRELOADER_SESSION_KEY, 'true');
            });
        });
    } else {
        console.log("Preloader already shown.");
        if (preloader) { preloader.style.display = 'none'; preloader.remove(); }
        if (contentWrapper) { contentWrapper.style.transition = 'none'; }
        showContent();
    }

    initBackgroundParticles();

    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }

    function updateActiveNavLink() {
        let currentSectionId = ''; const headerHeight = header ? header.offsetHeight : 0;
        const scrollPosition = window.scrollY + headerHeight + 60;
        sections.forEach(section => {
            if (!section) return; const sectionTop = section.offsetTop; const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) { currentSectionId = sectionId; }
        });
        mainNavLinks.forEach(link => {
            if (!link) return; link.classList.remove('active'); const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentSectionId}`) { link.classList.add('active'); }
        });
        if (sections.length > 0 && window.scrollY < sections[0].offsetTop - headerHeight - 60) {
             mainNavLinks.forEach(link => link && link.classList.remove('active')); const homeLink = document.querySelector('.main-nav a[href="#hero"]'); if (homeLink) homeLink.classList.add('active');
        } else if ((window.innerHeight + Math.ceil(window.scrollY)) >= document.body.offsetHeight - 2) {
            mainNavLinks.forEach(link => link && link.classList.remove('active')); const contactLink = document.querySelector('.main-nav a[href="#contact"]'); if (contactLink) contactLink.classList.add('active');
        } else if (!currentSectionId && window.scrollY < 100) {
             mainNavLinks.forEach(link => link && link.classList.remove('active')); const homeLink = document.querySelector('.main-nav a[href="#hero"]'); if (homeLink) homeLink.classList.add('active');
        }
    };

    function handleScroll() {
        if (header) { if (window.scrollY > 50) { header.classList.add('scrolled'); } else { header.classList.remove('scrolled'); } }
        updateActiveNavLink();
    };

    let scrollTimeout; window.addEventListener('scroll', () => { clearTimeout(scrollTimeout); scrollTimeout = setTimeout(handleScroll, 50); });

    function initScrollAnimations() {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const observerCallback = (entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        if (elementsToAnimate.length > 0) { elementsToAnimate.forEach(el => { if (!el.closest('.portfolio-swiper')) { observer.observe(el); } }); }
    }

    if (menuToggle && mobileNavOverlay) { menuToggle.addEventListener('click', () => { const isActive = mobileNavOverlay.classList.toggle('active'); menuToggle.classList.toggle('active'); menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false'); document.body.style.overflow = isActive ? 'hidden' : ''; }); }

    if (mobileNavLinks.length > 0) { mobileNavLinks.forEach(link => { link.addEventListener('click', () => { if (mobileNavOverlay) mobileNavOverlay.classList.remove('active'); if (menuToggle) { menuToggle.classList.remove('active'); menuToggle.setAttribute('aria-expanded', 'false'); } document.body.style.overflow = ''; }); }); }

}); // End