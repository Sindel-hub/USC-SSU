# Officer Dashboard Analytics Update

The main USC Officer Dashboard now includes a live **Student Participation & Operations Analytics** section.

## Event participation analytics

The dashboard summarizes registrations created through the USC Portal:

- Total portal event registrations
- Unique students who registered
- Number of currently open internal event registration forms
- Registration counts grouped by the student's program
- Top events by portal registration count

New student event registrations now save the student's administrator-controlled `program` field in addition to college and year level. Existing registrations without a program remain compatible and are grouped using their college or as an unspecified program.

External registration forms are intentionally not counted because the USC Portal cannot verify how many students submitted a third-party form.

## Complaint analytics

The dashboard summarizes:

- Total complaints
- Active complaints
- Resolved complaints
- Closed complaints
- Student Level classifications
- Administrative Level classifications
- Crisis Level classifications

The existing complaint cards and recent complaint queue remain unchanged.

## Election analytics

The dashboard summarizes:

- Election turnout percentage
- Ballots cast
- Eligible voters
- Votes recorded by department
- Current automatic election phase

The analytics uses the existing public election turnout document and never reads anonymous ballot selections.

## Officer visibility

All authenticated USC officers can read event registration records for dashboard analytics. Students can still read only their own registration. Students cannot edit another student's registration or event settings.

## Files changed

- `usc-admin/overview/overview.html`
- `usc-admin/overview/js/overview.js`
- `usc-admin/overview/css/overview.css`
- `dashboard/js/events.js`
- `usc-admin/events/js/events.js`
- `firestore.rules`
- `tests/event-participation.rules.test.mjs`
- `tests/officer-dashboard-analytics.test.mjs`

## Deployment

After updating the website, deploy the Firestore rules:

```powershell
firebase deploy --only firestore:rules
```

Then redeploy the website to Vercel and hard refresh the Officer Dashboard.

## Verification

Targeted static and JavaScript tests passed. A Firestore emulator test was attempted in the build environment but the emulator command exceeded the available execution window, so run your normal Firestore rules test locally if desired.
