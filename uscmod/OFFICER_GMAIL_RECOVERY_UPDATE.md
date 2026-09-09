# Officer Personal Gmail, Notifications & Password Recovery

The Officer Profile now supports the same verified personal Gmail workflow as the Student Profile.

## Officer profile behavior

Officers can open **Profile → Recovery & Email Alerts** and:

- add a personal `@gmail.com` address;
- receive a confirmation email proving ownership of that Gmail;
- enable or disable complaint activity alerts;
- enable or disable election updates;
- enable or disable announcements, Events, and Programs alerts;
- enable or disable password recovery;
- remove the connected Gmail at any time.

The officer's institutional/school login is not replaced. The personal Gmail is used only for enabled notifications and recovery.

## Password recovery

The existing **Forgot password?** link on the main login page now works for either an eligible Student or Officer account that has a verified Gmail with **Password recovery** enabled.

Recovery still generates the password-reset link through Firebase Authentication. Supabase/Resend only delivers that secure link to the verified personal Gmail.

## Supabase update required

Run `supabase/email-service.sql` again in **Supabase Dashboard → SQL Editor**. It safely adds the `account_role` column if the email table already exists.

Then redeploy both Edge Functions:

```powershell
npx.cmd supabase functions deploy usc-email --no-verify-jwt --use-api
npx.cmd supabase functions deploy usc-email-worker --no-verify-jwt --use-api
```

If using the Supabase Dashboard editor instead, replace the deployed code for:

- `usc-email`
- `usc-email-worker`
- shared `_shared/usc-email-common.ts` used by both functions

and deploy the updates. Keep JWT verification disabled because these functions already use Firebase ID tokens / the worker secret for authorization.

## Officer email notifications

For officers, the worker sends enabled notifications for:

- new or updated complaint activity;
- election opening/results activity;
- newly published announcements;
- newly published university Events;
- newly published external Programs.

The worker sends officers back to the Officer Dashboard and students back to the Student Dashboard.
