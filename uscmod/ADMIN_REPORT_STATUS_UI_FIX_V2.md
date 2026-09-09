# Admin Report Status UI Fix V2

The Audit & Reports "Report status" cards were still breaking in narrow layouts because the icon, label, count, and badge competed for the same horizontal space.

## Fix
- Moved the icon and status badge into a dedicated top row.
- Gave the label its own full-width line.
- Placed the large count below the label.
- Prevented character-by-character word wrapping.
- Kept the 2x2 card grid where space allows and switches to one column on very narrow screens.
- Bumped the Admin Dashboard CSS cache version to `admin-report-status-3`.

## Updated files
- `usc-admin/admin-dashboard/audit.html`
- `usc-admin/admin-dashboard/css/admin-dashboard.css`
- `tests/admin-report-status-ui-v2.test.mjs`
