# Admin Queue Metrics UI Fix V2

Fixed the narrow Registration Queue metrics panel where labels wrapped one character per line.

- Status chips now sit in a dedicated top row with the icon.
- Labels and counts receive the full card width below that row.
- Explicit `word-break: normal` and `overflow-wrap: normal` rules prevent character-by-character wrapping.
- Existing metric IDs and JavaScript behavior are unchanged.
- CSS cache version bumped to `queue-metrics-3`.
