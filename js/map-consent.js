/* Maps on request (16 Oct 2026). Google Maps sets cookies as soon as it loads, so each map starts as something
   else (.map-consent, with data-map-src and data-map-title) and Google's map loads only when the visitor presses its
   [data-map-show] button. Since 18 Oct 2026 that something else is a street map picture of the masjid (.find-us-map),
   and Google's map takes the picture's height; without a picture, data-map-height (default 300). */
(() => {
    'use strict';

    document.querySelectorAll('.map-consent[data-map-src]').forEach(box => {
        const button = box.querySelector('[data-map-show]');
        if (!button) return;
        button.addEventListener('click', () => {
            const frame = document.createElement('iframe');
            frame.src = box.dataset.mapSrc;
            frame.title = box.dataset.mapTitle || 'Map';
            frame.width = '100%';
            const picture = box.querySelector('img');
            const height = (picture && picture.offsetHeight) || Number(box.dataset.mapHeight) || 300;
            frame.height = String(height);
            // Inline, so the pages' own map heights (home-visit.css) cannot make the card jump when it swaps.
            if (picture) { frame.style.height = height + 'px'; frame.style.minHeight = '0'; }
            frame.style.border = '0';
            frame.allowFullscreen = true;
            frame.referrerPolicy = 'no-referrer-when-downgrade';
            box.replaceChildren(frame);
            box.classList.add('is-loaded');
            frame.focus();
        });
    });
})();
