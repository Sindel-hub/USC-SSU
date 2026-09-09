# Landing Announcement Description Fix

The landing-page announcement carousel previously rendered only the uploaded image whenever an announcement had `imageUrl`, so the announcement's written `content` disappeared from the hero carousel.

The image slide now renders two regions:

- `announcement-poster-media` keeps the uploaded image fully visible with `object-fit: contain`.
- `announcement-poster-copy` displays the announcement title and written content in a compact caption below the image.

The earlier mistaken change that exposed descriptions inside the **Upcoming Events** cards has been undone. The smaller USC decorative seal adjustment remains in place so it does not cover the event cards.

Landing assets are cache-busted at `v=5`.
