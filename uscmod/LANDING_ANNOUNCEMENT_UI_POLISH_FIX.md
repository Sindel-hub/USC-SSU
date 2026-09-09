# Landing Announcement UI Polish Fix

Updated the landing-page announcement carousel so the text area under image-based announcements feels more polished and blended with the card.

## What changed
- Added a softer integrated announcement copy panel under image slides.
- Introduced a small `Announcement` badge and publish-date/meta row.
- Converted the title to a two-line clamp instead of a single hard line.
- Preserved the written announcement description while improving spacing, typography, shadows, and blending.
- Bumped landing-page asset versions to `v=6` to reduce stale browser cache issues.

## Files changed
- `home/css/home.css`
- `home/js/home.js`
- `home/home.html`
- `tests/landing-event-description-logo.test.mjs`
