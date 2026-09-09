# Landing Page UI Fix

## Root cause

The public `home/home.html` page imported `shared/security-client.js` only to hydrate announcement images. That shared module contained an unfinished `browserSaveElectionSchedule()` function, which made the file invalid as a browser ES module. Because `home/js/home.js` depended on it, the landing page module never initialized. This stopped the carousel, event calendar, scroll controls, and the fixed campus background from working.

## Changes

- Repaired `shared/security-client.js` so it parses correctly and the browser election schedule adapter writes to `elections/{electionId}` plus `election_config/current`.
- Removed the public landing page's dependency on the large security/election adapter.
- Added a small landing-only hydrator for public `firestore-media://` announcement images.
- Changed landing initialization to run on `DOMContentLoaded` instead of waiting for the full window load.
- Added a CSS fallback so the campus hero background is visible even before JavaScript finishes initializing.
- Fixed the existing ES-module grammar error in `usc-admin/admin-dashboard/js/admin-users.js`.
- Added `tests/landing-ui.test.mjs` and strengthened syntax verification.

## Verification

The following pass after the fix:

- Browser ES-module syntax check
- Landing UI regression tests
- Static project tests
- School login tests
- Student complaint tracklist tests
- Browser/Spark backend sweep

The repository still contains the pre-existing complaint cooldown test mismatch (`SUBMISSION_COOLDOWN_MS = 0` while the old stress test expects 20 seconds). That is separate from this landing UI fix.
