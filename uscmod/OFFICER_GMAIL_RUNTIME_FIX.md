# Officer Gmail runtime fix

This patch fixes a backend eligibility bug where approved officer accounts could be rejected by the email service if they did not have student-only standing/enrollment fields.

Deployment after applying this patch:

1. Redeploy `usc-email`.
2. Redeploy `usc-email-worker` because both import `_shared/usc-email-common.ts`.
3. Keep JWT verification disabled for both functions.
4. Hard-refresh the portal and test the Officer Profile Gmail card.

The Gmail status card now also shows the actual backend error message to make remaining setup problems easier to diagnose.
