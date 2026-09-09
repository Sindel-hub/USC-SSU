# Admin Queue Metrics UI Fix

Polished the System Administrator Registration Queue metric cards.

## Fixed
- Prevented labels, counts, and status badges from overlapping.
- Added consistent icon-based metric cards.
- Improved count hierarchy and badge sizing.
- Added responsive layouts for narrow admin panels, tablets, and phones.
- Preserved the existing metric IDs and Firestore/JavaScript logic.
- Added CSS cache-busting and regression tests.

## Updated files
- `usc-admin/admin-dashboard/queue.html`
- `usc-admin/admin-dashboard/css/admin-dashboard.css`
- `tests/admin-queue-metrics-ui.test.mjs`
