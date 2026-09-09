# Admin Report Status UI Polish

Updated the Audit & Reports `Report status` panel to match the polished System Administrator dashboard design.

## Improvements
- Added icon-based metric cards.
- Separated labels, counts, and status badges so they no longer run together.
- Added semantic accents for role, suspension, and verification activity.
- Improved spacing, hierarchy, hover treatment, and responsive behavior.
- Preserved all existing metric IDs and JavaScript bindings.
- Added CSS cache-busting and regression tests.

## Updated files
- `usc-admin/admin-dashboard/audit.html`
- `usc-admin/admin-dashboard/css/admin-dashboard.css`
- `tests/admin-report-status-ui.test.mjs`
