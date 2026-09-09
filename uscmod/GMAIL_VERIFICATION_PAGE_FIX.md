# Gmail Verification Page Fix

## Why this update exists

Supabase hosted Edge Functions can be unsuitable for directly presenting an HTML confirmation page from a public GET link. The previous verification email opened `usc-email?action=verify&token=...`, which could cause the browser to display the HTML source as text instead of rendering the page.

This update moves browser-facing Gmail verification and password-recovery pages into the normal web application and keeps Supabase Edge Functions as JSON-only backend endpoints.

## New flow

### Gmail verification

1. Student or Officer saves a personal Gmail in Profile.
2. `usc-email` sends a verification message.
3. The email link now opens:
   `https://usc-ssu.vercel.app/email/verify-gmail.html?token=...`
4. The portal page removes the token from the visible address bar and keeps it only for the current tab.
5. The user presses **Confirm my Gmail**.
6. The page sends a JSON POST to `usc-email` with `action: "verify"`.
7. Supabase validates the one-time token, marks the Gmail verified, and returns JSON.
8. The portal shows the success/error state normally.

A GET request to the old Supabase verification URL now redirects to the new portal verification page, so older unused verification links remain usable after the updated function is deployed.

### Password recovery

The Forgot Password action now opens:
`/email/recover-password.html`

That page submits a JSON recovery request to `usc-email`, avoiding the same Edge Function HTML-rendering issue.

## Important deployment order

1. Deploy the updated website to Vercel first so `/email/verify-gmail.html` and `/email/recover-password.html` exist.
2. Redeploy the updated `usc-email` Edge Function.
3. Keep `Verify JWT` disabled for `usc-email` because the project validates Firebase sessions and one-time verification tokens inside the function.
4. Hard refresh the portal.
5. In Officer/Student Profile, save the Gmail again to generate a fresh verification email.

CLI deployment:

```powershell
npx.cmd supabase functions deploy usc-email --no-verify-jwt --use-api
```

The worker did not need a logic change for this redirect, but redeploy it too if `_shared` changed in the same project version:

```powershell
npx.cmd supabase functions deploy usc-email-worker --no-verify-jwt --use-api
```

## API key behavior

The public `usc-email` invocation no longer sends the browser publishable key. This project already configures:

```toml
[functions.usc-email]
verify_jwt = false
```

Security is enforced per action:
- profile settings actions validate a Firebase ID token (`x-firebase-token`),
- Gmail verification requires the random one-time verification token,
- password recovery deliberately returns a generic response to avoid account enumeration.

The Supabase service-role/secret key remains server-side only inside the Edge Function environment.
