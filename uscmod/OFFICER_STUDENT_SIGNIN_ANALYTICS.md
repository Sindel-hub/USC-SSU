# Officer Student Sign-in Analytics

The officer dashboard now includes an inline **Student Sign-in Analytics** feature.

## Behavior
- Student logins create/update one private aggregate record in `student_signin_stats/{uid}`.
- The aggregate records the student's trusted College / Campus, program, total sign-in count, first sign-in time, and latest sign-in time.
- Only student accounts create their own aggregate record.
- Officers and System Administrators can read the aggregate collection for dashboard analytics.
- Tapping the analytics card does not navigate to another module. It expands a large analytics panel directly on the officer dashboard.

## Dashboard analytics
- Donut distribution by College / Department.
- Unique students who have signed in.
- Total sign-in sessions.
- Students active today.
- Number of departments represented.
- Detailed department rows with student count, sign-in sessions, share percentage, and latest activity.

## Important deployment note
Deploy the included `firestore.rules` before testing the live analytics. Existing students are now backfilled as baseline analytics records when the System Administrator opens the Admin Dashboard. Older accounts with a stored historical login timestamp are restored as signed-in activity; accounts without trustworthy prior login history appear under Known accounts with 0 tracked sign-ins until their next login.
