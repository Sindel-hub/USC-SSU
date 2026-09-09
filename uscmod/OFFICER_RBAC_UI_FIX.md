# Officer RBAC UI Fix

Fixed the officer dashboard layout regression introduced by the RBAC decorator.

## Root cause
Restricted anchors were first decorated as locked links and then processed again as generic RBAC scopes. That second pass injected a full read-only notice directly inside navigation links and dashboard links, causing the sidebar and summary cards to stretch and overlap.

## Fix
- Restricted anchors are now handled only by the compact link decorator.
- Full read-only notices are reserved for actual management/content scopes.
- Sidebar locked links use a small lock badge and readable text.
- Dashboard heading/action links use a compact lock icon without changing card height.
- Added defensive CSS so stale/cached scripts cannot display full RBAC notes inside links.
- Cache-busted shared officer RBAC CSS/JS.
- Added `tests/officer-rbac-ui.test.mjs`.

The actual RBAC permissions and enforcement behavior remain unchanged.
