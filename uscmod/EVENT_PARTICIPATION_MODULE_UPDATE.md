# Event Participation Module Update

This update turns the Events module from a display-only event feed into a student participation workflow.

## What officers can configure

When creating an event, an authorized Events officer can now set:

- Event date
- Start and end time
- Event category
- Venue and description
- Participant access
- Reminder toggle
- Participation instructions
- Registration method:
  - `Register inside USC Portal`
  - `External registration link`
  - `No registration required`
- Registration deadline for portal/external registration
- External URL when external registration is selected

## Student experience

Students still see the existing Event Highlights and Upcoming Events calendar, but each event now has a real participation action.

Selecting **View details & participate** opens an Event Participation dialog showing:

- Full event description
- Date and time
- Venue
- Registration deadline
- Registration type
- Participation instructions
- Registration status

### Portal registration

For events configured as `internal`:

1. The student logs into their normal student account.
2. They open Events and select the event.
3. They click **Register for this event**.
4. The portal records one registration at:
   `events/{eventId}/registrations/{studentUid}`
5. The student immediately sees **You are registered**.
6. They can cancel before the registration deadline.
7. After the deadline, new registrations and cancellations are blocked by Firestore Security Rules.

No administrator approval is required for each registration.

### External registration

For events configured as `external`, the student sees an **Open registration form** button. The external site opens in a new tab. Website registration records are not created for external registrations because the external provider is the source of truth.

### No-registration events

For events configured as `none`, students see the event details and participation instructions with a clear **No registration required** status.

## Officer participant view

Internal events show a **Participants (N)** button in the officer Events module.

It lists students who registered through the portal, including:

- Name
- Student ID
- School email
- College
- Year level

The officer dashboard's fourth summary card now counts **Website Registrations** instead of the old unused Confirmed Attendance field.

## Notifications

The existing in-app Event Reminder now:

- respects the officer's `reminderEnabled` setting;
- shows a registration deadline hint for internal/external events.

## Firestore security

The new nested collection is protected by `firestore.rules`.

Students can:

- read only their own event registration;
- create only their own registration;
- register only for published events using `registrationMode == "internal"`;
- register only before `registrationDeadline`;
- submit their own Student ID from their protected user profile;
- cancel only their own registration and only before the deadline.

Authorized Events officers can read/delete portal registrations.

Students still cannot edit the parent event document.

## Deployment

After uploading this version:

1. Deploy the updated Firestore rules:
   `firebase deploy --only firestore:rules`
2. Deploy the website to Vercel.
3. Hard-refresh the browser with `Ctrl + Shift + R`.
4. Create a **new event** in the officer Events module and choose a registration method.

Older event documents without `registrationMode` remain compatible and appear as **No registration required** until replaced/updated.

## Main files changed

- `dashboard/events.html`
- `dashboard/js/events.js`
- `dashboard/js/notifications.js`
- `dashboard/css/student-pages.css`
- `usc-admin/events/events.html`
- `usc-admin/events/js/events.js`
- `usc-admin/events/css/events.css`
- `firestore.rules`
- `tests/event-participation.test.mjs`
- `tests/event-participation.rules.test.mjs`
- `package.json`

## Validation

The new static participation tests pass and the project-wide JavaScript syntax test passes.
