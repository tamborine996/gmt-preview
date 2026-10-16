/* Coming up (16 Oct 2026): upcoming events and time-limited requests from data/coming-up.json.
   Each item shows from show_from until the day before hide_from (London). Current items appear in two places:
   - the homepage strip, at the foot of the prayer banner (.prayer-banner .container): one item at a time;
     an item with a poster opens it in a lightbox, with its details;
   - coming-up.html (#coming-up-root): each item's full post, at #<id>.
   The strip says when in words relative to today ("This Sunday · 6–8pm", "On now", "Open until …") from
   starts / ends / time. The homepage poster slot is separate: the weekly class posters, "Every week".
   Review aids: ?today=YYYY-MM-DD shows the site as on that date; ?all=1 treats every item as current;
   ?strip=gold|tag|green picks the strip's colouring (gold is the default). */
(() => {
    'use strict';

    const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

    function londonToday() {
        const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
        const v = Object.fromEntries(parts.map(p => [p.type, p.value]));
        return `${v.year}-${v.month}-${v.day}`;
    }

    const params = new URLSearchParams(window.location.search);
    const requested = params.get('today');
    const today = /^\d{4}-\d{2}-\d{2}$/.test(requested || '') ? requested : londonToday();
    const isCurrent = item => params.get('all') === '1' || ((!item.show_from || today >= item.show_from) && (!item.hide_from || today < item.hide_from));
    const postUrl = item => `coming-up.html#${encodeURIComponent(item.id)}`;
    const keepToday = url => (requested ? url.replace('#', `?today=${today}#`) : url);

    // The strip's colouring: gold (a solid gold band along the foot of the prayer banner), tag (a solid gold
    // "Coming up" label on the green) or green (gold lettering on the green).
    const TONES = ['gold', 'tag', 'green'];
    const stripTone = TONES.includes(params.get('strip')) ? params.get('strip') : 'gold';

    // ---------- When, in words ----------
    const DAY_MS = 86400000;
    const utc = iso => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
    const daysFromToday = iso => Math.round((utc(iso) - utc(today)) / DAY_MS);
    const format = options => iso => new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...options }).format(utc(iso));
    const weekday = format({ weekday: 'long' });
    const longDay = format({ weekday: 'long', day: 'numeric', month: 'long' }); // Sunday 11 October
    const capitalise = text => text.charAt(0).toUpperCase() + text.slice(1);

    // "today", "tomorrow", "this Sunday" within the coming week, otherwise "Sunday 11 October".
    function dayInWords(iso) {
        const days = daysFromToday(iso);
        if (days === 0) return 'today';
        if (days === 1) return 'tomorrow';
        if (days > 1 && days < 7) return `this ${weekday(iso)}`;
        return longDay(iso);
    }

    // The strip's short line. One day: starts. A run of days: starts and ends. A deadline (questionnaire,
    // appeal): ends only. Anything else uses the full when.
    function whenInWords(item) {
        const time = item.time ? ` · ${item.time}` : '';
        if (item.starts && !item.ends) return capitalise(dayInWords(item.starts)) + time;
        if (item.starts && today < item.starts) return `Starts ${dayInWords(item.starts)}${time}`;
        if (item.starts) return `On now${time}`;
        if (item.ends) return daysFromToday(item.ends) < 7 ? `Closes ${dayInWords(item.ends)}` : `Open until ${longDay(item.ends)}`;
        return item.when;
    }

    // ---------- Homepage strip ----------
    // Several items fade from one to the next every ROTATE_MS; the strip keeps the height of its longest item so
    // the page never jumps. Rotation stops while the pointer or keyboard is on the strip, can be paused, and never
    // starts for visitors who ask for less motion.
    const ROTATE_MS = 6000;
    const ARROW = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    const PAUSE_ICON = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
    const PLAY_ICON = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';

    function renderStrip(items) {
        const container = document.querySelector('.prayer-banner .container');
        if (!container || !items.length) return;
        const many = items.length > 1;
        const slides = items.map((item, i) => `
                    <a class="cu-item${i === 0 ? ' is-active' : ''}" href="${escape(keepToday(postUrl(item)))}" data-id="${escape(item.id)}"${many ? ` aria-label="${escape(`${i + 1} of ${items.length}: ${item.title}, ${whenInWords(item)}. See details.`)}"` : ''}>
                        <span class="cu-title">${escape(item.title)}</span>
                        <span class="cu-when">${escape(whenInWords(item))}</span>
                        <span class="cu-more"><span class="cu-more-text">See details</span>${ARROW}</span>
                    </a>`).join('');
        const controls = many ? `
                <div class="cu-controls">
                    ${items.map((item, i) => `<button type="button" class="cu-dot" data-index="${i}" aria-label="Show ${escape(item.title)}" aria-pressed="${i === 0}"></button>`).join('')}
                    <button type="button" class="cu-pause" aria-label="Pause">${PAUSE_ICON}</button>
                </div>` : '';
        container.insertAdjacentHTML('beforeend', `
            <section class="prayer-coming-up strip-${stripTone}${many ? ' is-rotating' : ''}" aria-label="Coming up"${many ? ' aria-roledescription="carousel"' : ''}>
                <span class="cu-eyebrow" aria-hidden="true">Coming up</span>
                <div class="cu-stack" aria-live="${many ? 'off' : 'polite'}">${slides}
                </div>${controls}
            </section>`);
        const strip = container.lastElementChild;
        container.closest('.prayer-banner').classList.toggle('has-gold-strip', stripTone === 'gold');
        // The hero sizes its poster to the first screen; let it re-measure now the strip is in place.
        window.dispatchEvent(new Event('resize'));

        const openPoster = posterLightbox(items);
        strip.addEventListener('click', event => {
            const link = event.target.closest('.cu-item');
            if (link && openPoster && openPoster(link.dataset.id)) event.preventDefault();
        });
        if (!many) return;

        const links = [...strip.querySelectorAll('.cu-item')];
        const dots = [...strip.querySelectorAll('.cu-dot')];
        const pause = strip.querySelector('.cu-pause');
        const stack = strip.querySelector('.cu-stack');
        let index = 0;
        let timer = 0;
        let holding = false; // pointer or keyboard focus is on the strip
        let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const show = next => {
            index = (next + links.length) % links.length;
            links.forEach((link, i) => link.classList.toggle('is-active', i === index));
            dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
        };
        const stop = () => { window.clearInterval(timer); timer = 0; };
        const run = () => { stop(); if (!paused && !holding && !document.hidden) timer = window.setInterval(() => show(index + 1), ROTATE_MS); };
        const setPaused = value => {
            paused = value;
            pause.innerHTML = value ? PLAY_ICON : PAUSE_ICON;
            pause.setAttribute('aria-label', value ? 'Play' : 'Pause');
            stack.setAttribute('aria-live', value ? 'polite' : 'off');
            run();
        };
        dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.index)); run(); }));
        pause.addEventListener('click', () => setPaused(!paused));
        strip.addEventListener('mouseenter', () => { holding = true; stop(); });
        strip.addEventListener('mouseleave', () => { holding = strip.contains(document.activeElement); run(); });
        strip.addEventListener('focusin', () => { holding = true; stop(); });
        strip.addEventListener('focusout', event => { if (!strip.contains(event.relatedTarget)) { holding = false; run(); } });
        document.addEventListener('visibilitychange', run);
        setPaused(paused);
    }

    // The poster lightbox (GLightbox, already on the homepage): each current item with a poster, in file order,
    // with its details beside it. Returns open(id), which reports whether that item had a poster to show; an item
    // without one goes to its post instead.
    function posterLightbox(items) {
        const posters = items.filter(item => item.poster && item.poster.url);
        if (typeof window.GLightbox !== 'function' || !posters.length) return null;
        const details = item => {
            const action = item.button ? `<a class="btn btn-primary" href="${escape(item.button.url)}"${/^https?:/.test(item.button.url) ? ' target="_blank" rel="noopener"' : ''}>${escape(item.button.label)}</a>` : '';
            return `<span class="cu-lb-when">${escape(whenInWords(item))}</span>`
                + (item.place ? `<span class="cu-lb-place">${escape(item.place)}</span>` : '')
                + (item.text && item.text[0] ? `<span class="cu-lb-text">${escape(item.text[0])}</span>` : '')
                + `<span class="cu-lb-actions">${action}<a class="cu-lb-more" href="${escape(keepToday(postUrl(item)))}">Full details</a></span>`;
        };
        let box = null;
        return id => {
            const at = posters.findIndex(item => item.id === id);
            if (at < 0) return false;
            if (!box) {
                box = window.GLightbox({
                    elements: posters.map(item => ({
                        href: item.poster.url,
                        type: 'image',
                        alt: item.poster.alt,
                        title: `<span class="cu-lb-kind">${escape(item.kind)}</span>${escape(item.title)}`,
                        description: details(item),
                        descPosition: 'right',
                    })),
                    loop: posters.length > 1,
                    moreLength: 0,
                    zoomable: false,
                    draggable: posters.length > 1,
                });
                box.on('open', () => (box.modal || document.getElementById('glightbox-body'))?.classList.add('cu-lightbox'));
            }
            box.openAt(at);
            return true;
        };
    }

    // ---------- coming-up.html ----------
    function renderPage(items) {
        const root = document.getElementById('coming-up-root');
        if (!root) return;
        if (!items.length) {
            root.innerHTML = `
                <div class="coming-up-empty">
                    <h2>Nothing coming up just now</h2>
                    <p>Our classes and gatherings continue every week.</p>
                    <a class="btn btn-outline" href="what-we-offer.html">Everything we offer</a>
                </div>`;
            return;
        }
        root.innerHTML = items.map(item => `
            <article class="coming-up-post" id="${escape(item.id)}" tabindex="-1" aria-labelledby="${escape(item.id)}-title">
                ${item.poster && item.poster.url ? `<a class="coming-up-poster" href="${escape(item.poster.url)}" target="_blank" rel="noopener">
                    <img src="${escape(item.poster.url)}" alt="${escape(item.poster.alt)}">
                </a>` : ''}
                <div class="coming-up-body">
                    <p class="coming-up-kind">${escape(item.kind)}</p>
                    <h2 id="${escape(item.id)}-title">${escape(item.title)}</h2>
                    <p class="coming-up-when">${escape(item.when)}</p>
                    ${item.place ? `<p class="coming-up-place">${escape(item.place)}</p>` : ''}
                    ${(item.text || []).map(p => `<p>${escape(p)}</p>`).join('')}
                    ${(item.details || []).length ? `<dl class="coming-up-details">${item.details.map(d => `<div><dt>${escape(d.label)}</dt><dd>${escape(d.value)}</dd></div>`).join('')}</dl>` : ''}
                    ${item.button ? `<a class="btn btn-primary" href="${escape(item.button.url)}"${/^https?:/.test(item.button.url) ? ' target="_blank" rel="noopener"' : ''}>${escape(item.button.label)}</a>` : ''}
                </div>
            </article>`).join('');
        // Land on the item named in the address (#id), below the fixed header, once the posters above it have
        // loaded (they change the page height); at most 1.5s.
        const target = window.location.hash && document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        if (!target) return;
        const posters = [...root.querySelectorAll('.coming-up-poster img')].map(img => (img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })));
        Promise.race([Promise.all(posters), new Promise(r => setTimeout(r, 1500))]).then(() => {
            target.scrollIntoView({ block: 'start' });
            target.focus({ preventScroll: true });
        });
    }

    fetch('data/coming-up.json', { cache: 'no-store' })
        .then(response => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
        .then(data => (data.items || []).filter(isCurrent))
        .catch(() => [])
        .then(items => {
            renderStrip(items);
            renderPage(items);
        });
})();
