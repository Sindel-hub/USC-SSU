# Programs Module Update

## Purpose

The USC portal now separates university-managed activities from opportunities conducted outside the university while keeping a single student-facing participation feed.

- **Officer Events** remains for activities and schedules that concern Samar State University and its campus community.
- **Officer Programs** is for external programs, partner activities, outreach, conferences, trainings, competitions, scholarships, internships, volunteer opportunities, and similar off-campus opportunities.
- Students do **not** receive a separate Programs menu item. Their existing Events page is now **Events / Programs** and combines published items from both officer modules.

## Officer Programs Module

Location:

`usc-admin/programs/programs.html`

Officers with `programs.manage` can:

- Publish an external program.
- Enter the host or partner organization.
- Set the program date, venue, start/end time, category, description, and audience.
- Upload a program background image.
- Choose portal registration, an external registration URL, or no registration.
- Set a registration deadline and participation instructions.
- Enable student reminders.
- View portal participants.
- Delete a published program.

Programs are stored in the Firestore `programs` collection. Internal portal registrations are stored under:

`programs/{programId}/registrations/{studentUid}`

## Student Events / Programs Module

The student Events page now listens to both:

- `events`
- `programs`

Published records are merged into one chronological feed. Each item is clearly identified as either a **University Event** or an **External Program**.

External programs display their host/partner organization as the source. Registration behavior is kept separate per collection, so program registrations are saved to the matching program document instead of the Events collection.

The Student Dashboard summary and notification feed also include published Programs.

## Access Control

A new officer permission is available:

`programs.manage`

The default presets grant it to the President, Secretary, Public Relations Officer, and Business Manager. A System Administrator can still assign or remove the permission using the existing custom officer permission controls.

Firestore rules independently protect the Programs collection and its registration records.

## Program Media

Program images use the media kind:

`program-media`

Browser Spark mode and the optional trusted upload backend both recognize this media type.

## Email Notifications

The Supabase email worker also includes published external programs when generating announcement/event/program email alerts for students who have the corresponding email preference enabled.

## Deployment

After replacing the project files:

1. Deploy the updated Firestore rules:

   `firebase.cmd deploy --only firestore:rules`

2. Redeploy the website to Vercel.

3. Hard refresh the site with `Ctrl + Shift + R`.

4. To include Programs in scheduled Gmail notifications, redeploy the Supabase email worker:

   `npx.cmd supabase functions deploy usc-email-worker --no-verify-jwt --use-api`

If the project later uses the trusted Cloud Function media-upload backend instead of browser Spark mode, deploy the updated backend function code as part of that environment as well.
