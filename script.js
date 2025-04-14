function initPortfolioSwiper() {
    const swiperContainer = document.querySelector('.portfolio-swiper');

    if (!swiperContainer || typeof Swiper === 'undefined') {
        console.error("Swiper not ready or container missing.");
        return;
    }

    // Wait for all images inside Swiper to load
    const images = swiperContainer.querySelectorAll('img');
    let loadedCount = 0;
    const totalImages = images.length;

    const checkReady = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
            requestAnimationFrame(() => {
                portfolioSwiperInstance = new Swiper(swiperContainer, {
                    loop: true,
                    centeredSlides: true,
                    slidesPerView: 1,
                    spaceBetween: 30,
                    grabCursor: true,
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
            });
        }
    };

    if (totalImages === 0) {
        checkReady(); // No images, just go
    } else {
        images.forEach(img => {
            if (img.complete) {
                checkReady();
            } else {
                img.addEventListener('load', checkReady);
                img.addEventListener('error', checkReady);
            }
        });
    }
}
