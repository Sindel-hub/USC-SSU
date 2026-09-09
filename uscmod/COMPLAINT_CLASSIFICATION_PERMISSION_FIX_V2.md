# Complaint Classification Permission Fix V2

This revision fixes a remaining `Missing or insufficient permissions` failure when USC saves a complaint classification.

## Root cause
The earlier compatibility code still performed a fresh protected `getDoc()` on the selected complaint before reaching its fallback path. A denied/stale read could therefore stop the workflow before the original-rules-compatible write was attempted. In addition, the complaint update and audit log were previously grouped so an audit-log rule mismatch could roll back an otherwise valid complaint update.

## Changes
- USC passes the already-loaded complaint status/classification into `callSecure()`.
- The browser adapter no longer performs a second protected complaint read before saving a review or feedback.
- Current-rule writes update only the complaint first.
- Original-rule compatibility writes store classification in the complaint thread (`status`, `updatedAt`, `thread` only).
- Audit logging is best-effort and separate, so audit permissions cannot undo a successful complaint review.
- USC feedback uses the same current-rules/original-rules compatibility strategy.
- Added stronger cache-busting to the USC Complaints page and shared security adapter.
- If both write formats are genuinely denied, the UI now gives a specific account/rules message instead of the raw Firebase permission string.
