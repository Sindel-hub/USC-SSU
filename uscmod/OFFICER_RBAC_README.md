# USC Officer Role-Based Access Control (RBAC)

## Purpose

USC Officer access is controlled by the officer's **USC Office Position** plus optional System Administrator overrides.

`USC Officer -> Office Position -> RBAC Permission Set -> Read-only Modules + Authorized Actions`

Every authenticated USC officer may open the officer modules for transparency and coordination. RBAC now determines **what the officer may change**, not whether the module can be opened at all.

## Read-only model

If a module is not assigned to an officer, the officer can still open it and view its information. Management controls are disabled; the module remains clean without a full-page read-only banner.

Examples:
- A Secretary can open Elections and Complaints in read-only mode, but cannot change schedules, approve candidates, classify complaints, send feedback, or update complaint status unless those permissions are explicitly assigned.
- A Treasurer can view Bulletin Board and Events, but cannot create/delete announcements or events unless management permission is assigned.
- A Department Representative can be assigned Complaint review while classification, feedback, and status actions remain separately restricted.

The Officer Dashboard remains the common summary surface, and module links are never blocked solely because the module is unassigned.

## Default position-access matrix

These are the default **management/action** permissions. Modules outside the assigned set remain viewable in read-only mode.

| USC Office Position | Default managed/authorized scope |
| --- | --- |
| President | Dashboard, **Complaints (full management)**, Bulletin Board, Events, Organizational Chart, Reports. Elections are read-only by default. |
| Vice President | Dashboard, **Elections (full management)**, Bulletin Board, Events, Organizational Chart, Reports. Complaints are read-only by default. |
| Secretary | Dashboard, Bulletin Board, Events, Organizational Chart, Reports |
| Treasurer | Dashboard, Organizational Chart, Reports |
| Auditor | Dashboard, Organizational Chart, Reports |
| Public Relations Officer (PRO) | Dashboard, Bulletin Board, Events, Organizational Chart |
| Business Manager | Dashboard, Events, Organizational Chart, Reports |
| Sgt. at Arms | Dashboard, Events, Organizational Chart |
| Department Representative | Dashboard, Complaints (View + Review only), Organizational Chart |


### Primary ownership for sensitive modules

To ensure Elections and Complaints always have a clear operational owner:

- **Vice President → Election Management**: schedule management is included with Election access; voter roster, candidate review, and results/finalization are enabled by default. Complaint Management stays read-only unless the System Administrator grants complaint permissions.
- **President → Complaint Management**: review, classification, USC feedback, status changes, and complaint reporting are enabled by default. Election Management stays read-only unless the System Administrator grants election permissions.

This is a default capstone policy, not a hard-coded institutional rule. The System Administrator can still override either officer's permission set.

## Function-level restrictions

Viewing a module does not grant sensitive actions.

- **Election:** assigning the Election module also grants schedule management. Voter roster, candidate review, and results/finalization remain separately permissioned.
- **Complaints:** review, classification, feedback, status changes, and reports are separately permissioned.
- **Bulletin Board:** viewing is available to officers; create/edit/delete actions require `bulletin.manage`.
- **Events:** viewing is available to officers; create/edit/delete actions require `events.manage`.
- **Organizational Chart:** remains view-oriented.

## System Administrator workflow

1. Open **System Administrator -> User Directory**.
2. Select a USC Officer account.
3. Confirm/edit the officer's **Office Position**.
4. Review the **Officer role-based access** permission checkboxes.
5. Grant only the management/functions that office is authorized to perform.
6. Use **Apply to same office** to copy a permission set to officers with the same position.
7. Unchecked modules/functions remain visible but read-only where applicable.

The former **Dashboard only** quick preset is now labeled **Read-only portal** because the officer can still browse unassigned modules without modification rights.

## Enforcement layers

RBAC is enforced at multiple layers:
- Read-only navigation indicators
- Compact read-only indicators on navigation/actions
- Disabled form/action controls
- Browser/Spark secure operation checks
- Firestore Security Rules for privileged writes
- Cloud Functions permission checks

Authentication still fails closed: an unauthenticated or invalid account never sees officer content while verification is pending.

## Firestore read/write behavior

The included rules permit the officer reads required by the read-only experience while keeping privileged writes permission-gated. Sensitive election ballot/tally protections remain unchanged.

## Deployment requirement

Deploy the included Firestore rules so the database read-only behavior and write permissions match the UI:

`firebase deploy --only firestore:rules,firestore:indexes`
