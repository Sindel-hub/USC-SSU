# Account Creation Floating Credential Card

Updated student and officer account creation so the generated login slip appears in a floating modal card instead of rendering inline at the bottom of the page.

## What changed
- Replaced the inline bottom slip section with a centered floating credential viewer.
- Added a darkened backdrop and close button.
- Added Escape-key and backdrop-click close support.
- Kept Print, Download, and dismiss actions inside the floating card.
- Updated Print to open the login slip in a separate printable window so the full page/modal is not printed.
- Applied the same behavior to both Student and Officer account creation.

## Files changed
- `usc-admin/student-registration/student-registration.html`
- `usc-admin/student-registration/officer-registration.html`
- `usc-admin/student-registration/css/student-registration.css`
- `usc-admin/student-registration/js/student-registration.js`
- `usc-admin/student-registration/js/officer-registration.js`
- `tests/student-officer-slip-modal.test.mjs`
