/* Two-column homepage hero (staged 16 Oct 2026): sizes the square carousel on desktop.
   Poster side = smallest of the column width (less the arrow overhang), the space left in the
   first screen, and the 440px cap used by programme-carousel.js. If even FLOOR cannot fit, the
   page has to scroll anyway, so the poster keeps its full size. Below 1024px the CSS sizes it. */
(() => {
    'use strict';

    const hero = document.querySelector('.hero-two-column');
    const frame = hero && hero.querySelector('.hero-carousel-frame');
    if (!hero || !frame) return;

    const desktop = window.matchMedia('(min-width: 1024px)');
    const CAP = 440;
    const FLOOR = 320;
    const ARROW_OVERHANG = 22;
    let pending = 0;

    function size() {
        pending = 0;
        if (!desktop.matches) {
            hero.style.removeProperty('--hero-poster');
            return;
        }
        const column = frame.parentElement.clientWidth;
        const bottomPadding = parseFloat(getComputedStyle(hero).paddingBottom) || 0;
        // Page coordinates keep the size stable if the page loads part-scrolled.
        const top = frame.getBoundingClientRect().top + window.scrollY;
        const available = window.innerHeight - top - bottomPadding;
        const widest = Math.min(column - ARROW_OVERHANG, CAP);
        const side = Math.round(available >= FLOOR ? Math.min(widest, available) : widest);
        const value = `${side}px`;
        if (hero.style.getPropertyValue('--hero-poster') !== value) {
            hero.style.setProperty('--hero-poster', value);
        }
    }

    function schedule() {
        if (!pending) pending = requestAnimationFrame(size);
    }

    window.addEventListener('resize', schedule, { passive: true });
    desktop.addEventListener('change', schedule);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    if ('ResizeObserver' in window) {
        // Prayer times, the event bar and web fonts can all settle after first paint.
        const observer = new ResizeObserver(schedule);
        for (const selector of ['.header', '.prayer-banner', '#event-notification-bar', '.hero-two-column .hero-welcome']) {
            const element = document.querySelector(selector);
            if (element) observer.observe(element);
        }
    }

    // Size synchronously so Swiper measures the final frame when it initialises.
    size();
})();
