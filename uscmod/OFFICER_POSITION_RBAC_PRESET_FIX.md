# Officer Position RBAC Preset Fix

Fixed the mismatch between the documented USC officer responsibilities and the actual stored RBAC defaults.

## Root cause

The previous RBAC build provisioned every new officer with only `dashboard.view` and `organization.view`. Therefore a Secretary was correctly labeled as Secretary but did not actually receive `bulletin.manage` or `events.manage`.

## Fix

- Added explicit permission presets for every USC officer position currently supported by Officer Registration.
- Secretary now receives Bulletin Board + Events + Organization + Reports + Dashboard by default.
- President/Vice President receive the full officer permission set by default.
- Added conservative defaults for Treasurer, Auditor, PRO, Business Manager, Sgt. at Arms, and Department Representative.
- Added `officerPermissionSource` so explicit System Administrator customizations override position defaults.
- Added compatibility repair for existing first-RBAC baseline accounts.
- Added automatic baseline synchronization when System Administrator -> User Directory is opened.
- Updated browser security, route guard, Firestore rules, and Cloud Functions to use the same position matrix.
- Added regression tests for every supported officer position.
