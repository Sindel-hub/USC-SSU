# Student + Officer Portal Settings Module

A shared Settings control is now loaded through `shared/profile-manager.js` on both student and officer dashboards.

## Essential settings included
- System / Light / Dark theme preference
- Reduced-motion accessibility preference
- High-contrast accessibility preference
- Show/hide notification badges
- Student shortcut to Personal Gmail / recovery preferences
- Edit Profile shortcut
- Change Password shortcut
- Restore default preferences
- Log Out

Preferences are stored locally in the browser under `uscPortalSettingsV1`, while account/security actions continue to use the existing Firebase profile/authentication workflow.

## Files
- `shared/settings-manager.js`
- `shared/settings-manager.css`
- `shared/profile-manager.js` (loads the shared settings module)
