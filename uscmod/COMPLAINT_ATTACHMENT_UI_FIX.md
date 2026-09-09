# Complaint Attachment UI Fix

Fixed the student complaint attachment preview layout after selecting an image.

## Root cause
The generic complaint form selector `.complaint-form.redesigned .field label` had higher CSS specificity than `.upload-zone-label`, forcing the upload label to `display: block`. After an image was selected, the preview, icon, instructions, file name, and file limits flowed inline and overlapped.

## Changes
- Reasserted the upload component layout with a higher-specificity selector.
- Split the attachment control into a dedicated preview area and text area.
- The selected image now replaces the placeholder icon instead of appearing beside it.
- Added contained thumbnail sizing, file-name chip, hover/focus styling, and responsive stacking for smaller screens.
- Added cache-busting query parameters for the complaint CSS and JS.
- Added a regression test for the attachment layout.
