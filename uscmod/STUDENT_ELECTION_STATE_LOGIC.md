# Student Election Landing State Logic

The Student Election module now uses this display priority:

1. If the current voter-roster record is configured and the student is not eligible, show **You are not eligible to vote in this election.**
2. If the student is eligible but candidate registration is not currently open, show **Election is not open.**
3. If the student is eligible and candidate registration is open, show the classic election landing screen with **Register as Candidate** (or **Already Registered** when an application exists).

Unconfigured/unavailable election eligibility also fails closed with **Election is not open.** rather than falsely labeling the student ineligible.
