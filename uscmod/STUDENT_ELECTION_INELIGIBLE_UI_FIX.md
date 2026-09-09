# Student Election Ineligible UI Fix

Simplified the Election module for students who are not eligible to vote.

## New behavior
- The election header and schedule remain visible.
- The entire Election Actions / Election Details area is hidden for ineligible students.
- Only one message is shown: `You are not eligible to vote in this election.`
- The student remains logged into the USC portal.
- Eligible students still receive the normal election actions and details.

## Updated files
- `dashboard/js/election.js`
- `dashboard/css/student-pages.css`
- `dashboard/election.html`
- `tests/student-election-ineligible-clean-ui.test.mjs`
