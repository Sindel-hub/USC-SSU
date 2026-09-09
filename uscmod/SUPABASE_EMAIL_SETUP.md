# SSU USC — Supabase Email Setup

This project no longer uses Google Apps Script for the student's Personal Gmail, password-recovery email, password-change security alert, or portal email notifications.

## New architecture

```text
Student / Officer portal (Firebase Auth + Firestore)
                    |
                    | Firebase ID token
                    v
          Supabase Edge Function
                    |
          Supabase Postgres tables
                    |
                    +---- Resend API ----> Student Gmail
                    |
                    +---- Firebase Admin REST ----> Firebase reset link

Supabase Cron ----> usc-email-worker ----> checks Firestore every 5 minutes
                                      ----> sends enabled notifications
```

Firebase Authentication is intentionally kept for the school account. Supabase is now the trusted email backend.

Important: Supabase does not provide a general-purpose production email sender for arbitrary custom portal notifications. The official Supabase Edge Function email example uses an email provider such as Resend. In this project, Supabase owns the backend/workflow and Resend is only the outbound mail transport.

---

## 1. Run the Supabase database setup

1. Open https://supabase.com/dashboard
2. Open your existing project: `svgfxatigtjdrwzibjbu`
3. Open **SQL Editor**.
4. Click **New query**.
5. Open this project file:

   `supabase/email-service.sql`

6. Copy the whole file into the SQL Editor.
7. Click **Run**.

This creates:

- `student_email_accounts`
- `email_delivery_log`

Both tables use Row Level Security and deny direct browser access. Only the trusted Edge Functions can read/write them.

---

## 2. Create a Resend account and sender

1. Open https://resend.com
2. Create a free account.
3. Go to **Domains**.
4. For real student delivery, add a domain that you own and add the SPF/DKIM DNS records Resend gives you.
5. After the domain is verified, go to **API Keys** and create an API key.
6. Copy the API key. You will store it only as a Supabase Edge Function secret.

Recommended sender after domain verification:

`SSU USC Portal <notifications@updates.yourdomain.com>`

For testing only, you can temporarily use:

`SSU USC Portal <onboarding@resend.dev>`

but Resend's test domain can send only to the email address associated with your Resend account. A verified custom domain is required before you can send to all students.

---

## 3. Create the Firebase service-account key

The Supabase backend needs a trusted Firebase credential only so it can:

- read the student's school profile from Firestore,
- look up the Firebase Authentication account by UID, and
- generate a Firebase password-reset link without sending it to the institutional email.

Do this:

1. Open Firebase Console.
2. Open project `universitystudentcouncil-856cc`.
3. Open **Project settings** (gear icon).
4. Open **Service accounts**.
5. Choose **Firebase Admin SDK**.
6. Click **Generate new private key**.
7. Download the JSON file.

**Do not put this JSON file in VS Code, GitHub, Vercel, or any browser JavaScript.** It is a server secret.

The Cloud Firestore API and Identity Toolkit API must also be enabled for this Firebase/Google Cloud project.

---

## 4. Add the Supabase Edge Function secrets

In Supabase Dashboard:

1. Open **Edge Functions**.
2. Open **Secrets** / **Manage secrets**.
3. Add these values:

| Secret | Value |
|---|---|
| `FIREBASE_PROJECT_ID` | `universitystudentcouncil-856cc` |
| `FIREBASE_WEB_API_KEY` | `AIzaSyAVu7wu_1JnWQFNmwWMQHly0JEXjXxnzjA` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Paste the **entire Firebase service-account JSON** here |
| `PORTAL_URL` | Your deployed Vercel root, e.g. `https://your-project.vercel.app` |
| `RESEND_API_KEY` | The Resend API key you created |
| `EMAIL_FROM` | e.g. `SSU USC Portal <notifications@updates.yourdomain.com>` |
| `EMAIL_WORKER_SECRET` | Create a long random value, at least 32 characters |

Do not add `/home/home.html`, `/index/index.html`, or another page to `PORTAL_URL`. Use only the website root.

Supabase provides its own `SUPABASE_URL` and server secret/service-role variables to Edge Functions automatically, so you do not manually put the secret key in the website.

---

## 5. Deploy the two Edge Functions

The easiest method from your VS Code terminal is to use the Supabase CLI through `npx`.

From the root of this project run:

```powershell
npx supabase login
```

A browser will open so you can authorize the CLI.

Then link this folder to your existing Supabase project:

```powershell
npx supabase link --project-ref svgfxatigtjdrwzibjbu
```

Deploy the student-facing email function:

```powershell
npx supabase functions deploy usc-email --no-verify-jwt
```

Deploy the scheduled notification worker:

```powershell
npx supabase functions deploy usc-email-worker --no-verify-jwt
```

The project already includes `supabase/config.toml` with JWT gateway verification disabled for these two functions because the functions perform their own Firebase-session or worker-secret verification.

The website automatically derives this URL from your existing Supabase project configuration:

`https://svgfxatigtjdrwzibjbu.supabase.co/functions/v1/usc-email`

You do not paste a service-role key or Firebase private key into the website.

---

## 6. Schedule notifications every 5 minutes

Verification and password-change alerts happen immediately.

Complaint/election/announcement/event notifications use `usc-email-worker`, so schedule it every 5 minutes.

1. Pick the same random value you used for `EMAIL_WORKER_SECRET`.
2. Open:

   `supabase/email-cron.sql`

3. Replace:

   `REPLACE_WITH_THE_SAME_EMAIL_WORKER_SECRET`

   with your real worker secret.
4. In Supabase Dashboard open **SQL Editor**.
5. Paste the edited SQL and click **Run**.

The cron job invokes the worker every 5 minutes and keeps the worker secret in Supabase Vault rather than in browser code.

---

## 7. Deploy the updated Firestore rules

The old Google Apps Script version used these Firestore collections:

- `email_requests`
- `email_accounts`
- `email_private`
- `public_config/email_service`

The new project does not use them. The updated Firestore rules remove client access to the old email paths.

Deploy the cleanup rules:

```powershell
firebase deploy --only firestore:rules
```

Old documents can be deleted later after you confirm the Supabase email system works. They are not needed by the new code.

---

## 8. Redeploy the website

Push the updated project to GitHub/Vercel as you normally do.

Then hard-refresh:

`Ctrl + Shift + R`

---

# Test the complete flow

## A. Connect Gmail

1. Sign in as a student.
2. Open **Student Profile**.
3. Find **Personal Gmail — Supabase email**.
4. Enter the student's Gmail.
5. Choose notification options.
6. Click **Save Gmail**.
7. Check Gmail.
8. Click **Confirm my Gmail**.
9. Reopen Student Profile.
10. It should display `Active Gmail: ...`.

There is no administrator approval.

## B. Change password while logged in

1. In Student Profile use **Change Password**.
2. Firebase Authentication changes the school-account password.
3. Supabase immediately sends a security alert to the verified personal Gmail.

The Student ID and institutional login email do not change.

## C. Forgot Password

1. Log out.
2. On the main login page click **Forgot password?**.
3. A Supabase recovery page opens.
4. Enter the same verified Personal Gmail.
5. Supabase finds the protected UID binding.
6. Supabase generates the Firebase password-reset link for the student's real Firebase account.
7. Supabase sends that reset link to the verified personal Gmail through Resend.
8. The student chooses a new Firebase password.

The personal Gmail does **not** become the normal login username.

## D. Notifications

Enable the desired checkboxes in Student Profile, then test:

- officer updates or responds to a complaint,
- election opens or results are published,
- a new announcement is published,
- a new event is published.

The scheduled Supabase worker checks for changes every 5 minutes. Private complaint feedback text is not copied into email; the student is told to open Tracklist in the portal.

---

# Remove the old Google Apps Script service

After the tests above pass:

1. Open the old Google Apps Script project.
2. Open **Triggers** and delete the old 5-minute email trigger.
3. Open **Deploy > Manage deployments** and archive/delete the old web-app deployment if you no longer need it.

The updated website does not read or call the Apps Script URL.

---

# Troubleshooting

### `Supabase email settings are unavailable`

Confirm `usc-email` is deployed and open Edge Functions > Logs.

### Verification email returns a Resend 403

You are probably using `onboarding@resend.dev` with a recipient other than your own Resend account email. Verify a custom domain and change `EMAIL_FROM` to an address at that domain.

### Firebase/Google API request failed 403

Confirm the service-account JSON belongs to `universitystudentcouncil-856cc`, and make sure Cloud Firestore API and Identity Toolkit API are enabled. The service account needs enough Firebase Authentication and Firestore IAM permissions.

### Forgot Password shows the generic success page but no email arrives

That response is intentionally generic for account privacy. Check:

- the Gmail was confirmed,
- **Allow password recovery through this Gmail** is enabled,
- Resend logs,
- Supabase Edge Function logs,
- `email_delivery_log` in Supabase.

### Notifications do not arrive

Check Supabase **Cron** job history and the `usc-email-worker` Edge Function logs. The worker must receive the same `x-worker-secret` that is stored as `EMAIL_WORKER_SECRET`.
