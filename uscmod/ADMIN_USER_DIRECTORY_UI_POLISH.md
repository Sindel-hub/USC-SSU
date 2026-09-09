# Admin User Directory UI Polish

Refined the System Administrator User Directory while preserving all existing account, bulk-action, Firestore, and Officer RBAC behavior.

## Improvements
- Reorganized the page into a clearer search/filter area, provisioning card, bulk actions card, account table, and focused user editor.
- Improved filter spacing and responsive behavior.
- Added identity initials to directory rows and a clearer selected-row state.
- Added a sticky directory table header for long account lists.
- Refined role/status/verification badges and table action styling.
- Improved the selected-user profile summary and account detail chips.
- Cleaned the RBAC editor surface and form controls.
- Improved mobile/tablet reflow without changing data bindings.

## Files changed
- `usc-admin/admin-dashboard/users.html`
- `usc-admin/admin-dashboard/css/admin-dashboard.css`
- `usc-admin/admin-dashboard/js/admin-users.js`
- `tests/admin-user-directory-ui-polish.test.mjs`
