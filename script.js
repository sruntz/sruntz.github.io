document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variables ---
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

    // --- NEW Portfolio Slider Variables ---
    const portfolioNavContainer = document.querySelector('.portfolio-nav-inner');
    const portfolioDisplayImg = document.getElementById('portfolio-display-img');
    const portfolioDisplayTitle = document.getElementById('portfolio-display-title');
    const portfolioDisplayTags = document.getElementById('portfolio-display-tags');
    const portfolioDisplayGoal = document.getElementById('portfolio-display-goal');
    const portfolioDisplayLink = document.getElementById('portfolio-display-link');
    const portfolioSliderContainer = document.querySelector('.portfolio-slider-container'); // For hover pause
    const portfolioMainDisplay = document.querySelector('.portfolio-main-display'); // Reference to hide if no projects

    let currentProjectIndex = 0;
    let autoPlayInterval = null;
    const AUTOPLAY_DELAY = 6000; // 6 seconds delay

    // --- Portfolio Project Data ---
    // IMPORTANT: Update image paths! Use full paths or create specific thumbnails.
    // Suggestion: Create smaller thumbnail versions (e.g., project1preview_thumb.jpg) for thumbSrc
    const portfolioProjects = [
        {
            thumbSrc: 'images/project1preview.jpg', // Consider: 'images/project1preview_thumb.jpg'
            thumbAlt: 'Thumbnail for VoIP Blog Post',
            imageSrc: 'images/project1preview.jpg',
            altText: 'Portfolio Project 1 Preview - VoIP Blog Post',
            title: 'SEO Blog Post: "Unlocking Growth with VoIP"',
            tags: ['SEO', 'B2B', 'Tech'],
            goal: 'Target small businesses researching VoIP solutions, aiming for relevant keyword ranking.',
            link: 'seo-blog.html'
        },
        {
            thumbSrc: 'images/project2preview.jpg', // Consider: 'images/project2preview_thumb.jpg'
            thumbAlt: 'Thumbnail for Skincare Website Copy',
            imageSrc: 'images/project2preview.jpg',
            altText: 'Portfolio Project 2 Preview - Skincare Website Copy',
            title: 'Website Copy: Skincare Brand',
            tags: ['E-commerce', 'Copywriting', 'Brand Voice'],
            goal: 'Write engaging, benefit-driven product descriptions focused on conversion and brand voice.',
            link: 'website-copy.html'
        },
        {
            thumbSrc: 'images/project3preview.jpg', // Consider: 'images/project3preview_thumb.jpg'
            thumbAlt: 'Thumbnail for Trading Platform User Guide',
            imageSrc: 'images/project3preview.jpg',
            altText: 'Portfolio Project 3 Preview - Trading Platform User Guide',
            title: 'User Guide: Trading Platform Feature',
            tags: ['Technical', 'User Guide', 'Finance'],
            goal: 'Clearly explain a complex "Advanced Chart Analysis" feature for end-users.',
            link: 'tech-file.html'
        },
        {
            thumbSrc: 'images/project4preview.jpg', // Consider: 'images/project4preview_thumb.jpg'
            thumbAlt: 'Thumbnail for Contact Centre Script',
            imageSrc: 'images/project4preview.jpg',
            altText: 'Portfolio Project 4 Preview - Contact Centre Script',
            title: 'Contact Centre Script: Passport Queries',
            tags: ['Scripting', 'User-Centric', 'Gov Comms'],
            goal: 'Develop a user-centric script for agents handling passport application status inquiries efficiently.',
            link: 'gov-script.html'
        },
        // --- ADD MORE PROJECTS HERE following the same structure ---
        /*
        {
            thumbSrc: 'images/project5preview_thumb.jpg',
            thumbAlt: 'Thumbnail for Project 5',
            imageSrc: 'images/project5preview.jpg',
            altText: 'Portfolio Project 5 Preview - Some Description',
            title: 'Project 5: Email Campaign',
            tags: ['Email Marketing', 'B2C', 'Automation'],
            goal: 'Goal for project 5 goes here.',
            link: 'project5-detail.html' // Link to the project detail page
        },
        */
    ];

    // --- Particle Background ---
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
        fullScreen: { enable: false } // Important: set to false for page background
    };

    function initBackgroundParticles() {
        if (document.getElementById(pageParticlesContainerId) && typeof tsParticles !== 'undefined') {
            tsParticles.load(pageParticlesContainerId, pageParticlesOptions)
                .then(() => console.log("Background tsParticles loaded"))
                .catch(error => console.error("Error loading background tsParticles:", error));
        }
    }

    // --- Preloader Functions ---
    function animateKeywords(callback) {
        if (!preloaderKeywords || preloaderKeywords.length === 0) { if (callback) callback(); return; }
        const delay = 300;
        const interval = 450;
        preloaderKeywords.forEach((keyword, index) => {
            setTimeout(() => {
                keyword.classList.add('visible');
                if (index === preloaderKeywords.length - 1) {
                    setTimeout(callback, 1100); // Wait after last keyword
                }
            }, delay + (index * interval));
        });
    }

    function hidePreloader(callback) {
        if (preloader) {
            preloader.classList.add('hidden');
            preloader.addEventListener('transitionend', () => {
                if (preloader && preloader.parentNode) preloader.remove(); // Ensure removal
                if (callback) callback();
            }, { once: true });
            // Safety timeout if transitionend doesn't fire
            setTimeout(() => { if (preloader && preloader.parentNode) { preloader.remove(); if (callback) callback(); } }, 700);
        } else if (callback) {
            callback(); // Execute callback immediately if preloader doesn't exist
        }
    }

    function showContent() {
        if (contentWrapper) {
            contentWrapper.classList.add('visible');
            handleScroll(); // Update nav state immediately
            updateActiveNavLink(); // Update nav state immediately
            initScrollAnimations(); // Start observing for scroll animations
            initPortfolioSlider(); // Initialize the portfolio slider AFTER content is shown
        }
    }

    // --- Portfolio Slider Functions ---
    function renderPortfolioNav() {
        if (!portfolioNavContainer) return;
        portfolioNavContainer.innerHTML = ''; // Clear existing nav items

        portfolioProjects.forEach((project, index) => {
            const navItem = document.createElement('div');
            navItem.classList.add('portfolio-nav-item');
            navItem.setAttribute('data-project-index', index);

            const img = document.createElement('img');
            img.src = project.thumbSrc; // Use the thumbnail source
            img.alt = project.thumbAlt;
            img.loading = 'lazy';

            const title = document.createElement('h4');
            title.textContent = project.title;

            navItem.appendChild(img);
            navItem.appendChild(title);

            // Click event listener for manual navigation
            navItem.addEventListener('click', () => {
                stopAutoPlay(); // Stop autoplay on user interaction
                showProject(index); // Update the main display

                // Scroll the CLICKED item into view within its container ONLY on click
                if (navItem.scrollIntoView) {
                   navItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                // Optional: Restart autoplay after click if desired (currently doesn't)
                // setTimeout(startAutoPlay, AUTOPLAY_DELAY * 3);
            });

            portfolioNavContainer.appendChild(navItem);
        });
    }

    function showProject(index) {
        if (index < 0 || index >= portfolioProjects.length) {
            console.error("Invalid project index:", index);
            return; // Exit if index is out of bounds
        }

        currentProjectIndex = index; // Update the current index tracker
        const project = portfolioProjects[index];

        // Update main display elements safely
        if (portfolioDisplayImg) {
            portfolioDisplayImg.classList.add('loading'); // Add class for potential transition
             // Update image source after a slight delay for fade effect
             setTimeout(() => {
                portfolioDisplayImg.src = project.imageSrc;
                portfolioDisplayImg.alt = project.altText;
                // Remove loading class once image is actually loaded
                portfolioDisplayImg.onload = () => {
                    if (portfolioDisplayImg) portfolioDisplayImg.classList.remove('loading');
                };
                // Fallback in case onload doesn't fire (e.g., cached image)
                setTimeout(() => { if (portfolioDisplayImg) portfolioDisplayImg.classList.remove('loading'); }, 50);
             }, 150); // Adjust timing based on CSS transition duration
        }
        if (portfolioDisplayTitle) portfolioDisplayTitle.textContent = project.title;
        if (portfolioDisplayGoal) portfolioDisplayGoal.innerHTML = `<strong>Goal:</strong> ${project.goal}`; // Use innerHTML for the <strong> tag
        if (portfolioDisplayLink) portfolioDisplayLink.href = project.link;

        // Update tags
        if (portfolioDisplayTags) {
            portfolioDisplayTags.innerHTML = ''; // Clear previous tags
            project.tags.forEach(tagText => {
                const tagElement = document.createElement('span');
                tagElement.textContent = tagText;
                portfolioDisplayTags.appendChild(tagElement);
            });
        }

        // Update active class in the navigation thumbnails
        const navItems = portfolioNavContainer?.querySelectorAll('.portfolio-nav-item');
        navItems?.forEach((item, i) => {
            item.classList.toggle('active', i === index); // Add 'active' if index matches, remove otherwise
            // *** scrollIntoView was intentionally REMOVED from here ***
        });
    }

    function nextProject() {
        // Calculate the index of the next project, looping back to 0 if at the end
        const nextIndex = (currentProjectIndex + 1) % portfolioProjects.length;
        console.log(`Autoplaying to project index: ${nextIndex}`); // Debugging log
        showProject(nextIndex);
    }

    function startAutoPlay() {
        // Stop any previous interval *before* checking length and starting a new one
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = null; // Explicitly clear the ID

        if (portfolioProjects.length > 1) {
             console.log("Attempting to start autoplay interval..."); // Debugging log
             autoPlayInterval = setInterval(nextProject, AUTOPLAY_DELAY);
        } else {
             console.log("Autoplay not started: Not enough projects."); // Debugging log
        }
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            console.log("Stopping autoplay interval..."); // Debugging log
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    function initPortfolioSlider() {
        // Check if the main container and project data exist
        if (portfolioNavContainer && portfolioProjects.length > 0) {
            console.log("Initializing portfolio slider..."); // Debugging log
            renderPortfolioNav(); // Build the thumbnail navigation
            showProject(0); // Display the first project initially (without page scroll)
            startAutoPlay(); // Attempt to begin automatic cycling

             // Add event listeners to pause/resume autoplay on hover
             if (portfolioSliderContainer) {
                 portfolioSliderContainer.addEventListener('mouseenter', stopAutoPlay);
                 portfolioSliderContainer.addEventListener('mouseleave', startAutoPlay);
             }
        } else if (portfolioNavContainer) {
             // Optional: Handle the case where there are no projects defined
             console.log("No projects found to initialize slider."); // Debugging log
             portfolioNavContainer.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">No projects added yet.</p>';
             if(portfolioMainDisplay) portfolioMainDisplay.style.display = 'none'; // Hide the main display area
        }
    }

    // --- Navigation & Scroll Handling ---
    function updateActiveNavLink() {
        let currentSectionId = '';
        const headerHeight = header ? header.offsetHeight : 0;
        const scrollPosition = window.scrollY + headerHeight + 60; // Offset for better activation timing

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Edge cases for top and bottom of the page
        if (!currentSectionId) {
             if (window.scrollY < sections[0].offsetTop + sections[0].offsetHeight - headerHeight - 60) {
                 currentSectionId = 'hero'; // Default to hero if near top
             } else {
                 const isNearBottom = (window.innerHeight + Math.ceil(window.scrollY)) >= document.body.offsetHeight - 50;
                 if (isNearBottom && document.getElementById('contact')) {
                    currentSectionId = 'contact'; // Default to contact if near bottom
                 }
             }
        }

        // Apply active class to the correct main navigation link
        mainNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    function handleScroll() {
        // Add 'scrolled' class to header for styling changes on scroll
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
        updateActiveNavLink(); // Update active nav link on scroll
    }

    // Debounced scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 50); // Adjust debounce delay if needed
    });

    // --- Scroll Animations ---
    function initScrollAnimations() {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 }; // Trigger when 15% visible
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible'); // Add class to trigger animation
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        elementsToAnimate.forEach(el => {
            observer.observe(el); // Observe each element designated for animation
        });
    }

    // --- Mobile Menu Logic ---
    if (menuToggle && mobileNavOverlay) {
        menuToggle.addEventListener('click', () => {
            const isActive = mobileNavOverlay.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            // Prevent body scroll when mobile nav is open
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    // Close mobile menu when a link is clicked
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

    // --- Initialization Logic ---

    // Preloader Handling
    const hasPreloaderShown = sessionStorage.getItem(PRELOADER_SESSION_KEY);

    if (!hasPreloaderShown && preloader) {
        // First visit this session: Show preloader animation
        animateKeywords(() => {
            hidePreloader(() => {
                showContent(); // Shows content and initializes slider
                sessionStorage.setItem(PRELOADER_SESSION_KEY, 'true'); // Mark as shown
            });
        });
    } else {
        // Preloader already shown or doesn't exist: Show content immediately
        if (preloader) preloader.remove(); // Remove preloader instantly
        if (contentWrapper) {
            // Apply classes for instant visibility without fade-in
            contentWrapper.classList.add('no-transition', 'visible');
            // Remove the 'no-transition' class shortly after render
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                     if (contentWrapper) contentWrapper.classList.remove('no-transition');
                 });
            });
            handleScroll(); // Initialize header state and nav links
            updateActiveNavLink(); // Initialize nav links
            initScrollAnimations(); // Initialize scroll animations
            initPortfolioSlider(); // Initialize the portfolio slider immediately
        }
    }

    // Initialize Background Particles
    initBackgroundParticles();

    // Set Current Year in Footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

});
