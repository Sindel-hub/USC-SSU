# Admin Audit Viewer UI Fix

Refined the Audit & Reports access-change viewer.

## Improvements
- Simplified the Access Change History summary card into one balanced header.
- Improved summary spacing, metrics, and action area.
- Fixed the search icon/placeholder overlap caused by shared input styles.
- Gave the records viewer a dedicated scroll area.
- Reset the record list to the top whenever the viewer is opened.
- Prevented the first audit record from appearing clipped behind the toolbar.
- Improved audit record spacing and metadata alignment.
- Added responsive behavior for smaller screens.
- Bumped the Audit CSS cache version.

## Files changed
- `usc-admin/admin-dashboard/audit.html`
- `usc-admin/admin-dashboard/css/admin-dashboard.css`
- `usc-admin/admin-dashboard/js/admin-audit.js`
- `tests/admin-audit-records-viewer-ui-v2.test.mjs`
