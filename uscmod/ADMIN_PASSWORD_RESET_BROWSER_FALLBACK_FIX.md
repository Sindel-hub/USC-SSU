# Admin Password Reset Browser Fallback Fix

The User Directory password-reset action no longer fails with the generic browser-configuration popup when the project is running in `USC_FREE_SPARK_MODE`.

- If `adminResetUserPassword` Cloud Function is deployed, the administrator receives a one-time temporary password.
- If that privileged backend is unavailable, the browser automatically sends a Firebase password reset link to the account's registered authentication email.
- The admin receives a clear success message rather than a misleading Firestore Rules error.
- `firebase.json` now declares the `functions` source so the privileged reset function can be deployed when the project is moved to a Functions-capable plan.
