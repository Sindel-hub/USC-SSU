# Complaint Classification and One-Way Review Workflow

The complaint module now uses a one-way student-to-USC review process.

## Workflow
1. The student submits the complaint once.
2. The complaint enters `Submitted` with no student-selected classification.
3. USC reviews the case and may move it to `Under Review` while assessment is ongoing.
4. USC assigns one classification level:
   - `Student Level`
   - `Administrative Level`
   - `Crisis Level`
5. A classification is required before the complaint can move to `In Progress`, `Resolved`, or `Closed`.
6. A classification is also required before USC can send official feedback.
7. USC feedback appears in the student's Tracklist. The student does not reply inside the complaint case thread.

Existing complaints without a classification remain compatible and display as `Pending Classification` until USC reviews them.

## Main files changed
- `complaint/complaint.html`
- `complaint/css/complaints.css`
- `usc-admin/complaints/complaints.html`
- `usc-admin/complaints/css/complaints.css`
- `usc-admin/complaints/js/complaints.js`
- `shared/security-client.js`
- `functions/index.js`
- `firestore.rules`
- `dashboard/tracklist.html`
- `dashboard/js/tracklist.js`
- `dashboard/js/dashboard.js`
- `dashboard/js/notifications.js`
- `dashboard/css/student-pages.css`
