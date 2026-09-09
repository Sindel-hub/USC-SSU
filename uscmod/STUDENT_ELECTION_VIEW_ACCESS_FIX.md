# Student Election View Access Fix

Fixed the Student Election module so voter ineligibility no longer logs a valid student out of the USC portal.

## New behavior
- Active approved school-provisioned students may open the Election module even when their voter-roster record is not eligible.
- Election schedule, candidates, turnout, and published results remain viewable when available.
- Candidate registration and voting are disabled unless the student's current election eligibility is confirmed.
- Legacy/direct voting routes redirect back to the Election module instead of clearing the session and signing the student out.
- The Election page displays a clear view-only eligibility notice when actions are unavailable.

## Files changed
- `shared/auth-guard.js`
- `dashboard/js/election.js`
- `dashboard/election.html`
- `dashboard/css/student-pages.css`
- `tests/student-election-view-access.test.mjs`
