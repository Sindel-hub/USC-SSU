# Bulletin Read More UI Fix

Improved the Student Bulletin Board announcement cards and Read More interaction.

## Changes
- Replaced the stretched full-width Read More bar with a compact pill action and arrow.
- Reserved consistent space for long titles and excerpts to prevent clipping.
- Added subtle card hover/image polish.
- Improved the full-announcement modal typography, spacing, metadata, and backdrop.
- Added responsive behavior so the CTA becomes full-width only on smaller screens.
- Added cache-busting to the bulletin page assets.
- Added regression tests in `tests/bulletin-read-more-ui.test.mjs`.

## Files changed
- `dashboard/js/bulletin.js`
- `dashboard/css/student-pages.css`
- `dashboard/css/dashboard.css`
- `dashboard/bulletin.html`
- `tests/bulletin-read-more-ui.test.mjs`
