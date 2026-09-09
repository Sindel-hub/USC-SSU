# Officer / Student Account Creation RBAC Fix

## Problem
Officer creation failed with `DEFAULT_OFFICER_PERMISSIONS is not defined` after RBAC was added.

## Root cause
`shared/browser-provisioning.js` used `DEFAULT_OFFICER_PERMISSIONS` inside `provisionOfficerAccount()` but did not import it from `shared/officer-permissions.js`.

## Fix
- Imported `DEFAULT_OFFICER_PERMISSIONS` in `shared/browser-provisioning.js`.
- Preserved the safe default for newly created officers: Dashboard + Organizational Chart only.
- Reviewed `provisionStudentAccount()` and confirmed it does not depend on officer-only RBAC constants.
- Added cache-busting to both officer and student registration pages/modules so the corrected shared module is loaded immediately.
- Added regression tests covering both account creation paths.
