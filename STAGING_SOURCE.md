# GMT acceptance staging

- Production source: `0750fcc490121fc404c2313b7e100fbb0bb5ddc2`
- Rebuilt: 2026-10-14
- Public staging: https://tamborine996.github.io/gmt-preview/
- Previous staging: `5c86517aa491e9138b70d38f5830869fa7aed681`
- Rollback tag: `archive/before-live-parity-20261014`

## Exact permitted differences from production

1. Omit production CNAME; add .nojekyll for project Pages.
2. Add robots noindex/nofollow/noarchive metadata and disallow crawling. This is not authentication.
3. Disable production Google Analytics collection before its loader.
4. Add a hidden site_version marker to forms; form destinations and visible fields remain unchanged.
5. Append a staging cache marker to relative CSS/JavaScript URLs.
6. Add this provenance file and staging-provenance.json.

No visible review banner, content revision, redesign, timetable change or image alteration is included in the baseline. Donation and other external destinations remain real external services; this is a visual staging surface, not a payment sandbox.

## Staged for review on top of the baseline

### 2026-10-16 — two-column homepage hero (`staging-20261016-hero1`)
- Homepage hero only: compact welcome above a square carousel on ivory; exterior photograph on a diagonal with a gold edge. Phones: carousel, then photograph, then welcome.
- Files: `index.html` (hero section, Swiper arrow selectors, two includes), new `css/hero-two-column.css`, new `js/hero-two-column.js`, new `images/hero/ghousia-masjid-clear-cleaned-{800,1280,1399}.webp`.
- All welcome copy and carousel slides are unchanged.
- Source prototype and evidence: `Mosque admin/design-reviews/two-column-hero-prototype-20261016/` (README, screenshots, verification.json).
- **Photo status: review only, not for production.** It is an AI-edited image of the frontage with the real sign composited from a contributor's January 2024 photograph. Before production: (1) replace the sign pixels with a mosque-owned front-on photograph; (2) committee/Imam approval of an AI-edited image.
- To remove: revert the staging commit that adds this section.

### 2026-10-16 — rest of the homepage (`staging-20261016-home2`)
- **Recent news:** one lead story plus two compact stories, replacing the carousel. New optional post fields in `data/facebook-news-preview.json`:
  - `home_until`: the post leaves the homepage after this date.
  - `action_until`: the call to action is hidden after this date, on the homepage and News.
  - `home_image`: an editorial image for the homepage.

  The summer-retreat and questionnaire posts end 31 Aug 2026; they stay on News without buttons.
- **What we offer:** a weekly schedule plus Janazah / Nikah / Counselling links, from new `data/weekly-schedule.json` (wording from `what-we-offer.html` and the approved posters).
- **Donate:** interior photo beside an emerald appeal panel, with a Gift Aid band. The photo is the mosque's own Mawlid 2026 congregation photo. Copy, Hibabox link and Gift Aid wording are unchanged.
- **Media:** newest video featured, three more as compact rows; titles split into speaker and description; live Instagram alongside.
- **Visit us:** both buildings with directions, beside the existing map.
- **Shared:** one section-heading style; footer in deep emerald.
- The homepage's inline `<style>` block (120 rules for the retired news carousel and donation layout) is removed. Computed styles of every element are identical before and after (desktop and phone).
- Files:
  - `index.html` (built by `build-staging-home.cjs` from the prototype).
  - `news.html`: `actionHasEnded` check only.
  - `js/youtube.js`: video card markup; titles now escaped. Also used by the unlinked `home-news-preview*.html` and `logo-preview.html`.
  - New `js/home-week.js`, `data/weekly-schedule.json`, `css/home-{sections,news,week,media,visit,donate}.css`, `css/footer-refresh.css`, `images/donate/ghousia-masjid-mawlid-2026-congregation-{800,1280}.webp`.
- Evidence: `Mosque admin/release-evidence/staging-home2-20261016/local/` and the prototype README.
- To remove: revert the staging commit that adds this section.

### 2026-10-16 — every visitor-facing page (`staging-20261016-site3`)
- **Inner pages in the homepage's style:** compact left-aligned page header, the shared section heading, square cards with a gold rule, emerald calls to action, emerald footer.
  - News opens on a short index; `#post-N` links still open one story.
  - Prayer Times shows today and tomorrow, then the month as an HTML table in the printed timetable's columns.
  - Contact puts quick routes first; arriving from a Janazah link shows the urgent line and preselects Janazah.
  - Resources and Privacy are restyled; their wording is unchanged.
- **What We Offer rebuilt:**
  - Three groups (Services, Educational programmes, Gatherings). Prayer is removed; it lives on Prayer Times and in the strip on every page.
  - One pattern per item: icon, "At a glance" strip (when, where, who, next step), then the approved description. The Janazah urgent call comes first.
  - Sticky index beside the content on desktop, marking the item being read.
  - New icon set `images/icons/offer-icons.svg`: objects from the masjid's own practice, with no people, no rings, and the Qur'an always on a stand. Janazah is a sidr branch in an arch; Milad-un-Nabi is the Na'layn Sharif. The Milad-un-Nabi card carries the Mawlid 2026 photograph.
  - Class times come from `data/weekly-schedule.json`.
- **Homepage:** the visit heading is now "Find us" (no district name), and the carousel gains a pause/play control.
- **Site-wide:**
  - One house voice: sentence case, British English, Jum'a / Jama'at / masjid, one time format, and "16 October 2026" in the prayer strip.
  - Accessibility: skip link, Escape closes the menu, question state announced to screen readers.
  - The standard is `Mosque admin/WEBSITE-STYLE-GUIDE.md`.
- **Data:** `data/prayer-times-2026.json` adds the 25 October clock-change note.
- **Wording:** approved wording is unchanged. New short labels on What We Offer await a glance from the Imam.
- **Build:** `build-staging.cjs` in `Mosque admin/design-reviews/two-column-hero-prototype-20261016/`.
  - It applies only the permitted differences above.
  - Changed files carry `?v=20261016-site3&review=staging-20261016-site3`.
  - The homepage's retired inline styles are dropped (computed styles identical).
- To remove: revert the staging commit that adds this section.

### 2026-10-16 — donation photo reframed (commit 73ca015)
- Same Mawlid 2026 congregation photo with the bottom fifth trimmed (`images/donate/ghousia-masjid-mawlid-2026-congregation-hall-{800,1280}.webp`): the decorated hall reads and the front row drops out. Only `index.html` (three lines) and the two images change.

### 2026-10-16 — privacy: cookie choice, maps on request, new policy (`staging-20261016-privacy4`)
- **Cookie choice:** a slim bar in the house style (vanilla-cookieconsent 3.0.1). Google Analytics tags are `type="text/plain" data-category="analytics"` and run only after "Allow analytics"; Google signals and ad personalisation are off; withdrawing consent deletes the `_ga` cookies. "Cookie settings" sits in every footer. Staging still disables analytics entirely (`ga-disable`).
- **Maps** (Home, Contact) load only after "Show map". **Videos** play in YouTube's privacy-enhanced mode, with the player from jsDelivr.
- **Privacy policy** rewritten to match what the site does (Formspree, Google, GitHub, Hibabox, Behold, cookies table, legal reasons, retention, rights).
- **Also gated:** `nikah-certificate.html`, `about.html`, `events.html`, `media.html`. **Removed:** the unlinked review pages `home-news-preview.html`, `home-news-preview-v2.html`, `logo-preview.html`, which loaded analytics without consent.
- **Checks:** `consent-checks.cjs` 23/23 (no Google requests or cookies before a choice, including the homepage with its Instagram feed); `a11y-checks.cjs` 23/23.
- **For the user to confirm:** the retention periods in the policy.


### 2026-10-16 — Coming up strip; phones show the photo first (`staging-20261016-comingup1`)
- **Coming up** replaces the event spotlight and its ribbon. `data/coming-up.json` lists upcoming events and time-limited requests, each shown from `show_from` until the day before `hide_from`.
  - **Homepage:** current items appear in a strip at the foot of the prayer banner, one at a time.
  - **Rotation:** several items fade every 6 seconds, with dots and a pause button. Rotation stops on hover or focus, and never runs for reduced motion.
  - **Wording:** the strip says when in words relative to today ("This Sunday · 6–8pm", "On now", "Open until …").
  - **Poster:** tapping an item opens its poster in a lightbox (GLightbox), with its details and button.
  - **Full posts:** `coming-up.html`.
- **Poster slot:** always the weekly class posters, labelled "Every week".
- **Colouring under review:** gold band (default), gold label, or green.
- **Review links** show a small switcher (`js/review-switcher.js`, removed by the live build):
  - `?today=2026-07-25` shows two events (the Youth Summer Retreat and the questionnaire);
  - `?strip=tag` / `?strip=green` change the colouring;
  - `?all=1` treats every item as current.
- **Nothing current today:** no item is current on 16 October, so the plain homepage shows no strip.
- **Phones:** the photograph, then the welcome, then the poster slot. The poster keeps its full size there.
- **Checks:** `a11y-checks.cjs` 23/23; `consent-checks.cjs` 23/23; `strip-shots.cjs` confirms rotation, the hover pause, a steady strip height, and the lightbox.
- **Before production:** the retreat poster artwork's address line says "Plumstead" and needs re-exporting.

### 2026-10-16 — no poster carousel, slimmer strip, timetable pop-up, simpler Prayer Times (`staging-20261016-home5`)
- **Homepage:** the poster carousel is gone on laptops and phones; the weekly section follows the welcome.
  - The approved Tajweed Circle and Dars-e-Quran posters are a "See poster" button on their rows in the weekly section (`data/weekly-schedule.json` `poster`).
  - Swiper is no longer loaded.
- **Coming up strip:** slimmer, about 80px on phones (was 100–120px) and 42px on laptops.
  - "Coming up" sits as a block on the left; one dot per item; the pause button is a plain symbol apart from the dots.
  - No arrow and no pop-up: each item links straight to its post on `coming-up.html`.
- **Full Timetable** (prayer banner, every redesigned page): opens this month's published timetable in a picture viewer, with "Download PDF" and "Prayer Times page".
  - The viewer is `js/viewer.js` + `css/viewer.css`. GLightbox 3.3.1 loads from jsDelivr only when first needed.
  - `data/timetables.json` lists the months. The Prayer Times page's printable timetable now reads the same list (it was code inside the page).
- **Prayer Times:** the Today/Tomorrow cards are removed (today is in the prayer banner).
  - The month table highlights only today, with "Today" in the day column. Fridays are no longer shaded (the printed PDF keeps its shading).
  - On phones the table starts at today, with "Show 1–15 October" for the earlier days.
- **Checks:** `a11y-checks.cjs` 27/27 (new checks for the viewer, the strip and the table); `consent-checks.cjs` 23/23.

- **Follow-up (`staging-20261016-home6`):** the Full Timetable pop-up always shows the real month (a review link with `?today=` had opened July); a pinch-zoomed picture stays inside its own area on phones.

- **Follow-up (`staging-20261016-home7`):** the homepage asks for the Coming up list in its head and runs the strip right after the prayer banner, so on most connections the strip is there when the page appears. On slow connections it slides open (0.3s) instead of jumping in.

- **Fix (`staging-20261016-home8`):** home7 put the strip's script between the prayer banner and the hero, which brought back the hero's top margin (an 86px empty band on phones, 96px on laptops). The script now sits inside the prayer banner, and the hero's top margin is always 0. `a11y-checks.cjs` now fails on any empty band between sections (9 pages, phone and laptop).
