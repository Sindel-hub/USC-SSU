# Officer RBAC Loading UI Fix

Fixed a visual leak on the officer access-verification screen where the global
`Search modules` input/placeholder remained visible while RBAC was loading.

## Cause
Responsive officer styles force the search input to `visibility: visible !important`.
The old fail-closed rule only hid the top-level page with `visibility`, which a
child element could override.

## Fix
- The pending RBAC state now applies `opacity: 0` to the entire officer page subtree.
- The global toolbar/search input and placeholder also receive an explicit pending-state hide rule.
- The access loader remains the only visible UI until officer authentication/RBAC finishes.
- `officer-ui.css` was bumped to `rbac-ui-5` across all officer modules.
