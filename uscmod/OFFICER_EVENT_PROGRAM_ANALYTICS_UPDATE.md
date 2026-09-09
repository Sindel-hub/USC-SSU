# Officer Dashboard Event + Program Analytics Update

This update adds a dedicated Programs preview and separates participation analytics for Events and Programs on the Officer Dashboard.

## Dashboard analytics
- Event Participation counts only registrations whose records belong to Events.
- Program Participation counts only registrations whose records belong to Programs.
- Each analytics card shows portal registrations, unique students, open internal registration forms, academic-program breakdown, top activities, and recent registrants.
- Event and Program registrants are no longer combined in one dashboard count.

## Programs dashboard preview
The Officer Dashboard now has a Programs section after Events showing the next external program, host/partner, venue, registration mode, registration count, and upcoming program queue.

## Data sources
- `events/{eventId}/registrations/{studentUid}`
- `programs/{programId}/registrations/{studentUid}`

The shared Firestore `registrations` collection-group listener explicitly partitions documents using `eventId` versus `programId` (with parent collection fallback), so the analytics remain separate.
