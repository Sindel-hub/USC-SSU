# Landing Event Description + USC Seal Fix

Updated: 2026-09-04

## Fixed

- Restored published event descriptions on the landing page event cards.
- Added compatibility fallbacks for older event documents that may use
  `eventDescription`, `details`, or `content` instead of `description`.
- Limited landing-page event descriptions to two lines on desktop (three on
  small mobile screens) so cards remain compact.
- Reduced and lowered the large decorative USC seal on desktop so it no longer
  covers the right-side Upcoming Events information.
- Preserved the existing centered seal layout on tablet/mobile.
- Bumped landing-page asset cache versions to `v=4`.
