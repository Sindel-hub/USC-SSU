# Officer RBAC Fail-Closed Loading Fix

Officer modules now start in a fail-closed state while Firebase authentication and RBAC permissions are being resolved.

## Problem fixed
Previously, the full officer navigation rendered before `officer-rbac.js` finished decorating restricted links. During that short window an officer could see or click modules that were not assigned to their office.

## New behavior
1. Every officer page starts with `usc-officer-access-pending` on the root HTML element.
2. The officer application is non-visible and non-interactive while access is checked.
3. `auth-guard.js` verifies the signed-in account and the permission required for the current URL.
4. If the route is rejected, RBAC stays fail-closed while the guard redirects to the dashboard.
5. If the route is authorized, `officer-rbac.js` first decorates/locks every unauthorized module and action, then reveals the UI.
6. Live permission changes re-enter the pending state before links/actions are recalculated.

This removes the unauthorized-module flash without weakening the existing Firestore or route-level security checks.
