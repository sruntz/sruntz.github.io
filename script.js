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

    let portfolioSwiperInstance = null;

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
            setTimeout(() => { if (preloader.parentNode) preloader.remove(); if (callback) callback(); }, 700);
        } else if (callback) {
            callback();
        }
    }

    function showContent() {
        if (contentWrapper) {
            contentWrapper.classList.add('visible');
            handleScroll();
            updateActiveNavLink();
            initScrollAnimations();
        }
    }

    function initPortfolioSwiper() {
        const swiperContainer = document.querySelector('.portfolio-swiper');
        if (!swiperContainer || typeof Swiper === 'undefined') {
            console.error("Swiper not ready or container missing.");
            return;
        }

        // Basic non-looped swiper
        portfolioSwiperInstance = new Swiper(swiperContainer, {
            loop: false,
            initialSlide: 0,
            slidesPerView: 1,
            spaceBetween: 30,
            grabCursor: true,
            centeredSlides: false,
            breakpoints: {
                768: { slidesPerView: 1.8, spaceBetween: 40 },
                1024: { slidesPerView: 2.2, spaceBetween: 50 }
            },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            observer: true,
            observeParents: true,
            observeSlideChildren: true
        });

        // Manual loop logic for next/prev
        const totalSlides = portfolioSwiperInstance.slides.length;
        const nextBtn = document.querySelector('.swiper-button-next');
        const prevBtn = document.querySelector('.swiper-button-prev');

        nextBtn.addEventListener('click', () => {
            const lastSlideIndex = totalSlides - 1;
            if (portfolioSwiperInstance.activeIndex === lastSlideIndex) {
                portfolioSwiperInstance.slideTo(0);
            } else {
                portfolioSwiperInstance.slideNext();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (portfolioSwiperInstance.activeIndex === 0) {
                portfolioSwiperInstance.slideTo(totalSlides - 1);
            } else {
                portfolioSwiperInstance.slidePrev();
            }
        });
    }

    function updateActiveNavLink() {
        let currentSectionId = '';
        const headerHeight = header ? header.offsetHeight : 0;
        const scrollPosition = window.scrollY + headerHeight + 60;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        mainNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        const isNearBottom = (window.innerHeight + Math.ceil(window.scrollY)) >= document.body.offsetHeight - 50;
        if (isNearBottom && document.getElementById('contact')) {
            mainNavLinks.forEach(link => link.classList.remove('active'));
            const contactLink = document.querySelector('.main-nav a[href="#contact"]');
            if (contactLink) contactLink.classList.add('active');
        } else if (window.scrollY < sections[0].offsetTop - headerHeight - 60) {
            mainNavLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.main-nav a[href="#hero"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }

    function handleScroll() {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
        updateActiveNavLink();
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 50);
    });

    function initScrollAnimations() {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        elementsToAnimate.forEach(el => {
            if (!el.closest('.swiper-slide')) {
                observer.observe(el);
            }
        });
    }

    if (menuToggle && mobileNavOverlay) {
        menuToggle.addEventListener('click', () => {
            const isActive = mobileNavOverlay.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    if (mobileNavLinks.length > 0) {
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    const hasPreloaderShown = sessionStorage.getItem(PRELOADER_SESSION_KEY);

    if (!hasPreloaderShown && preloader) {
        animateKeywords(() => {
            hidePreloader(() => {
                showContent();
                sessionStorage.setItem(PRELOADER_SESSION_KEY, 'true');
            });
        });
    } else {
        if (preloader) preloader.remove();
        if (contentWrapper) {
            contentWrapper.classList.add('no-transition', 'visible');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => contentWrapper.classList.remove('no-transition'));
            });
            handleScroll();
            updateActiveNavLink();
            initScrollAnimations();
        }
    }

    initBackgroundParticles();

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Swiper initialized only after full page load
    window.addEventListener('load', () => {
        initPortfolioSwiper();
    });
});
