/* Review aid for the Coming up strip (16 Oct 2026), for staging only: build-live.cjs removes this script.
   Shows only on a review link (one with ?today=, ?strip=, ?all= or ?examples=), as a small panel bottom right that
   switches the strip's colouring, the date the site pretends it is, whether every item counts as current, and the
   example notices (data/coming-up-examples.json). */
(() => {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    const KEYS = ['today', 'strip', 'all', 'examples'];
    if (!KEYS.some(key => params.has(key))) return;

    const ROWS = [
        ['strip', 'Strip colouring', [['gold', 'Gold band'], ['tag', 'Gold label'], ['green', 'Green']], 'gold'],
        ['today', 'Pretend today is', [['2026-07-25', 'Sat 25 Jul (two)'], ['2026-07-15', 'Wed 15 Jul'], ['2026-10-08', 'Thu 8 Oct (one)'], ['2026-10-11', 'Sun 11 Oct'], ['', 'Real today']], ''],
        ['all', 'Items', [['', 'Only what is current'], ['1', 'All three at once']], ''],
        ['examples', 'Example notices', [['', 'None'], ['notices', 'Notice + Help needed'], ['important', 'Important']], ''],
    ];

    const style = document.createElement('style');
    style.textContent = `
        #review-switcher { position: fixed; right: 12px; bottom: 12px; z-index: 9000; max-width: calc(100vw - 24px);
            padding: 10px 12px; border-radius: 8px; background: rgba(23, 23, 23, 0.92); color: #fff;
            font: 12px/1.3 system-ui, sans-serif; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); }
        #review-switcher[data-collapsed] .review-switcher-body { display: none; }
        #review-switcher .review-switcher-head { display: flex; justify-content: space-between; gap: 12px; font-weight: 700; }
        #review-switcher .review-switcher-row { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
        #review-switcher .review-switcher-row span { width: 100%; opacity: 0.7; }
        #review-switcher button { padding: 4px 8px; border: 1px solid rgba(255, 255, 255, 0.35); border-radius: 4px;
            background: transparent; color: #fff; font: inherit; cursor: pointer; }
        #review-switcher button[aria-pressed="true"] { background: #fff; color: #111; }
        #review-switcher .review-switcher-toggle { padding: 0 6px; border: 0; }`;
    document.head.appendChild(style);

    const go = (key, value) => {
        const next = new URLSearchParams(window.location.search);
        if (value) next.set(key, value); else next.delete(key);
        // The examples sit beside the October Gyarwee, so they show it as on Thursday 8 October.
        if (key === 'examples' && value) next.set('today', '2026-10-08');
        // Keep the panel on screen after "Real today" by holding a review key.
        if (!KEYS.some(k => next.has(k))) next.set('strip', 'gold');
        window.location.search = next.toString();
    };

    const panel = document.createElement('div');
    panel.id = 'review-switcher';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Review switcher');
    panel.innerHTML = `
        <div class="review-switcher-head">Review: Coming up <button type="button" class="review-switcher-toggle" aria-label="Hide or show the switcher">–</button></div>
        <div class="review-switcher-body">${ROWS.map(([key, label, options, fallback]) => `
            <div class="review-switcher-row"><span>${label}</span>${options.map(([value, text]) => `<button type="button" data-key="${key}" data-value="${value}" aria-pressed="${(params.get(key) || fallback) === value}">${text}</button>`).join('')}</div>`).join('')}
        </div>`;
    panel.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button) return;
        if (button.classList.contains('review-switcher-toggle')) {
            panel.toggleAttribute('data-collapsed');
            button.textContent = panel.hasAttribute('data-collapsed') ? '+' : '–';
            return;
        }
        go(button.dataset.key, button.dataset.value);
    });
    document.body.appendChild(panel);
})();
