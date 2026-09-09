# Student Events Natural Scroll Update

The Student Events module now behaves as a normal scrollable vertical page instead of a swipe/snap two-screen interface.

## Behavior
- Highlight section is first.
- Upcoming Events section is directly below it.
- Mouse wheel, trackpad, touchscreen, and scrollbar scrolling work normally.
- Swiping/scrolling does not automatically jump between sections.
- Tapping **Scroll down** smooth-scrolls precisely to the start of Upcoming Events and stops there.
- Tapping **Scroll up** is optional/manual and smooth-scrolls back to the Highlight section.
- Mobile falls back to normal page `scrollIntoView()` when the module itself is not the scroll container.

## Updated files
- `dashboard/events.html`
- `dashboard/css/student-pages.css`
- `dashboard/js/events.js`
- `tests/student-events-natural-scroll.test.mjs`
