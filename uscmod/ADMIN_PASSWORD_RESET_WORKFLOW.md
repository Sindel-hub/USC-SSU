# Admin Password Reset Workflow

## Behavior
- Students and USC officers who forget their school-issued password are directed to contact the System Administrator.
- The System Administrator opens **Admin > User Directory**, searches by Student ID or name, opens the account, and chooses **Reset password**.
- A trusted Cloud Function generates a new temporary password with Firebase Admin SDK and replaces the previous Firebase Authentication password.
- The old password is never shown or recoverable.
- Refresh tokens are revoked after the reset when possible.
- The temporary password is returned only in the callable response and displayed in a one-time floating credential card. It is not stored in Firestore.
- The admin can copy the temporary password or print a temporary-password slip.
- After signing in, the account owner can use **Profile > Change Password** to replace the temporary password.
- Password-reset activity is written to the audit trail without storing the generated password.

## Deployment requirement
The `adminResetUserPassword` callable uses Firebase Admin SDK and therefore requires the included Cloud Functions to be deployed. A normal browser cannot securely change another user's Firebase Authentication password.

## Updated areas
- `functions/index.js`
- `usc-admin/admin-dashboard/users.html`
- `usc-admin/admin-dashboard/js/admin-users.js`
- `usc-admin/admin-dashboard/css/admin-dashboard.css`
- `index/index.html`
- `index/js/index.js`
- `usc-admin/student-registration/student-registration.html`
- `usc-admin/student-registration/js/student-registration.js`
- `tests/admin-password-reset.test.mjs`
