# Student Complaint Tracklist Fix

## Problem
A complaint could be committed to Firestore successfully while the Student Tracklist page failed to start its complaint listener. The tracklist module loaded shared modules that eagerly imported the legacy Supabase client from `esm.sh`, so a failure to load that third-party module could stop `tracklist.js` before `onSnapshot()` was registered. Complaint ownership/listeners also relied on the cached session UID instead of treating Firebase Authentication as the canonical UID.

## Fix
- `dashboard/js/tracklist.js`
  - Uses `auth.currentUser.uid` as the canonical student UID, with the session UID only as a fallback.
  - Loads the election participation context directly from Firestore so complaint tracking does not depend on `shared/security-client.js`.
  - Logs and displays complaint-listener failures instead of silently showing an empty list.
- `complaint/js/complaints.js`
  - Writes `studentUid` from the authenticated Firebase user.
- `dashboard/js/dashboard.js` and `dashboard/js/notifications.js`
  - Use the authenticated UID for complaint queries.
- `shared/complaint-attachments.js` and `shared/security-client.js`
  - Lazy-load the legacy Supabase client only when a legacy Supabase file operation is actually requested. Firestore complaint records can now load without that external module.
  - Correctly treats complaints with no attachment as having no attachment.
- `tests/complaint-tracklist.test.mjs`
  - Adds regression checks for the complaint-to-tracklist ownership/data flow and the removal of the eager legacy Supabase dependency.

## Verification
The following checks pass after the fix:
- JavaScript syntax test
- Static project test
- Complaint tracklist regression test
- Browser/Spark capstone mode test
- Browser backend sweep test
