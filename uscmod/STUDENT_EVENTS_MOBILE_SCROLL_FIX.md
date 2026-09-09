# Student Events Mobile Scroll Fix

The Events page now uses one continuous vertical document scroll on screens up to 820px wide.

## Fixed

- Removed the nested vertical scroll behavior from **Upcoming Events** on mobile.
- Upcoming event cards and the calendar now expand the page naturally instead of being clipped inside a fixed panel.
- Mouse wheel, Chrome device-mode drag, touch swipe, and trackpad gestures can continue through the full Events page.
- Decorative highlight/upcoming background layers no longer intercept drag gestures.
- The footer remains reachable below the full event list and calendar.

## Files changed

- `dashboard/css/student-pages.css`
- `dashboard/events.html`
- `tests/student-events-mobile-scroll.test.mjs`
