document.addEventListener('DOMContentLoaded', () => {

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once visible to improve performance
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove class if you want animation to re-trigger on scroll up
                // entry.target.classList.remove('is-visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));

    // --- Mobile Menu Toggle (Basic Example - Enhance as needed) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.style.display = mainNav.style.display === 'block' ? 'none' : 'block';
            // NOTE: This basic toggle is rudimentary. A real implementation
            // would likely involve adding/removing a class for better styling
            // and accessibility (e.g., managing aria-expanded attributes).
        });
    }

    // --- Optional: Add active class to nav links based on scroll position ---
    // This is more complex, involving tracking scroll position and section offsets.
    // Libraries can help, or implement manually if needed.

});