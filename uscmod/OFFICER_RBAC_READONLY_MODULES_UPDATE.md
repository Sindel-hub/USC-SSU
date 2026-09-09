# Officer RBAC Read-only Modules Update

Changed the officer RBAC experience from module locking to a read-only model.

## New behavior
- All authenticated USC officers can open Officer Portal modules.
- Unassigned modules display a compact eye/read-only indicator instead of a lock.
- Opening an unassigned module keeps the page viewable without a large read-only banner; protected actions remain disabled.
- Officers can browse module records but cannot perform privileged actions without the required permission.
- Bulletin Board and Events forms/delete actions are now explicitly permission-scoped.
- Election lifecycle/result controls remain permission-scoped.
- Complaint classification, feedback, review, and status controls remain permission-scoped.
- Firestore rules allow officer reads needed by the read-only complaint/election views while preserving privileged-write restrictions.
- Authentication still uses the fail-closed loading state, so unauthenticated users never see officer content.
