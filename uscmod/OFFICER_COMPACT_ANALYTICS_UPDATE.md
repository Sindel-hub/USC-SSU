# Officer Dashboard Compact Analytics Update

The Officer Dashboard analytics area is now space-efficient and module-driven.

## Main dashboard behavior
- Events, Programs, Complaints, and Election analytics are represented by compact icon launchers.
- Each launcher keeps a live headline metric visible.
- Hovering or keyboard focusing a launcher shows the module name.
- Clicking/tapping a launcher opens a floating analytics card with the full analytics for that module.
- The floating card closes through the close button, backdrop, or Escape key.
- Focus is returned to the launcher after the card closes.
- Mobile layouts use a two-column launcher grid and a responsive full-width analytics card.

## Analytics remain separated
- Event registrations use `events/{eventId}/registrations/{studentUid}`.
- Program registrations use `programs/{programId}/registrations/{studentUid}`.
- Complaint and election analytics keep their existing independent data flows.

No Firestore schema, permission, registration, or RBAC behavior was changed by this UI update.
