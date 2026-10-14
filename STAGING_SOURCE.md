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

No visible review banner, content revision, redesign, timetable change or image alteration is included. Donation and other external destinations remain real external services; this is a visual staging surface, not a payment sandbox.
