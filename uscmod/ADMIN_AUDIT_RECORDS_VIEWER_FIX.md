# Admin Audit Records Viewer

The Access Change History no longer renders the entire Firestore log list directly on the Audit & Reports page.

## New behavior
- The page shows a compact Access Change History summary card.
- The summary shows the number of loaded records and the latest change timestamp.
- Clicking **View records** opens a large in-page dialog/card.
- The dialog contains the existing searchable audit records list.
- Search results update the visible-record count.
- The viewer closes with the X button, the Escape key, or by clicking the backdrop.
- The System Guardrails panel remains static in normal document flow.

## Updated files
- `usc-admin/admin-dashboard/audit.html`
- `usc-admin/admin-dashboard/css/admin-dashboard.css`
- `usc-admin/admin-dashboard/js/admin-audit.js`
- `tests/admin-audit-records-modal.test.mjs`
