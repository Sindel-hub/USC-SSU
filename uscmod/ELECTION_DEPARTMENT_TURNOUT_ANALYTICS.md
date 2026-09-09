# Election Department Voting Participation Analytics

Added aggregate department participation analytics to the Officer Election Management module.

## Officer UI
- Election Status now includes **Department Voting Participation**.
- Each department/college shows:
  - students who voted
  - share of all department-attributed ballots
  - a ranked horizontal participation bar
- The panel returns aggregate counts only. It does not expose voter names, Student IDs, receipts, or candidate choices.

## Data flow
- Cloud Functions: `getElectionDepartmentTurnout` aggregates `voterStatus` records securely for the active election, including existing votes.
- Free/Spark browser mode: new ballots increment `turnout/public.departmentVotes` so the same analytics work without Cloud Functions.
- The anonymous ballot document remains identity-free.
- Firestore turnout update rules constrain the student's aggregate increment to their own verified college/department field.

## Updated files
- `usc-admin/elections/elections.html`
- `usc-admin/elections/css/elections.css`
- `usc-admin/elections/js/elections.js`
- `functions/index.js`
- `shared/security-client.js`
- `firestore.rules`
- `tests/election-department-turnout-analytics.test.mjs`
