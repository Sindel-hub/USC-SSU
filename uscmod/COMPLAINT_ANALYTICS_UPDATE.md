# Complaint Analytics Update

Added live analytics to the Officer Complaints Management module.

## Analytics included
- Unique students with Student Level complaints
- Unique students with Administrative Level complaints
- Unique students with Crisis Level complaints
- Complaint totals for each classification
- Total unique students who have complained
- Total complaint count
- Pending/unclassified complaint count
- Complaints-per-program breakdown with counts, percentages, ranking, and horizontal bars

The program breakdown uses the program/department value stored on the complaint at submission time (`studentDepartment` for existing records, with compatibility fallbacks for newer/alternate field names).

Analytics are calculated from the full Firestore `complaints` collection and update live. Existing inbox pagination remains unchanged.
