# Officer Election Saved Schedule Update

The Officer Election Management module was redesigned around a saved-schedule workflow.

## Schedule workflow
- Saved schedule fields are displayed as locked/read-only information on the main Election page.
- `Edit Schedule` opens a dedicated schedule preview/editor dialog.
- The editor can create a replacement schedule while preserving an auditable schedule version history.
- Officers can delete the active schedule pointer when they need to start over. Candidate, voter, turnout, and other election records are preserved.
- `Create New Schedule` opens the same preview workflow for a new/replacement schedule.
- Finalized, published-result, and archived elections remain protected from schedule deletion.

## RBAC change
- Election scheduling no longer has its own `elections.schedule` checkbox in the System Administrator permission editor.
- Schedule management is now included with `elections.view` / assigned Election Management access.
- This means the Vice President, as the default Election manager, can manage the election schedule directly without requesting a separate schedule permission from the System Administrator.
- Voter roster management, candidate review, and results/finalization remain separate permissions.

## Layout change
- Saved Election Schedule + Schedule Management are displayed side by side on wide screens.
- Candidate Application Review is below the schedule workspace.
- Secure Election Lifecycle and Turnout & Result Snapshot are below Candidate Application Review.
- Added an edit-preview modal and responsive styles similar to the supplied reference layout.

## Security/data changes
- Browser and Cloud Function schedule saves now require `elections.view` instead of `elections.schedule`.
- The old rule that locked normal schedule editing after candidate registration started was removed.
- Schedule replacements increment `scheduleVersion` and remain audited.
- Added `deleteElectionSchedule` for both browser/Spark and Cloud Function runtimes.
- Firestore Rules allow Election-assigned officers to update/delete the active schedule pointer while preserving finalized/archive protections.
