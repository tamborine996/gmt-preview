# GMT acceptance staging

- Production-derived source commit: `9a40dcf287987e15717e5b63930a031d569c339b`
- Rebuilt: 2026-08-23
- Public URL: <https://tamborine996.github.io/gmt-preview/>

## Permitted staging-only differences

1. Production `CNAME` omitted; `.nojekyll` retained for GitHub Pages.
2. `noindex`, `nofollow`, `noarchive`, and `robots.txt` prevent intended indexing.
3. Google Analytics collection disabled on staging.
4. Contact forms receive a hidden acceptance-staging `site_version` marker.
5. Asset cache markers use the `staging6` suffix.

Visible site content and website assets are otherwise derived from the source commit above.
