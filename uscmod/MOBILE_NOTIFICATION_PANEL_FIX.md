# Mobile Notification Panel Fix

The Student Dashboard notification panel has been reduced specifically for phones.

## Changes
- Reduced the mobile panel width with larger side margins.
- Limited the panel height so it no longer fills almost the entire screen.
- Reduced notification row spacing and icon sizes.
- Tightened notification typography and header padding.
- Preserved desktop notification styling.
- Added an extra compact rule for very narrow phones.
- Bumped `dashboard.css` to `v=3` to avoid stale browser cache.

## Files changed
- `dashboard/css/dashboard.css`
- `dashboard/dashboard.html`
- `tests/mobile-notification-panel.test.mjs`
