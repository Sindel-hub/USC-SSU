# Student Election Reference UI Update

Rebuilt the Student Dashboard Election module to match the supplied candidate-registration reference screens while preserving the existing election security and backend flow.

## Included
- Student Election landing hero with USC branding and legacy copy.
- "Already Registered" landing state for submitted candidacies.
- Four-step candidate registration wizard:
  1. Auto-filled personal information + eligibility check
  2. Position, party/affiliation, campaign photo
  3. Platform/advocacy, statement of intent, supporting documents
  4. Review & submit
- Right-side Election Details card during registration.
- Polished candidacy success modal.
- Existing ineligible-student hero-only state remains supported.
- Existing secure candidate photo/document upload and server-side application submission remain unchanged.

## Main files changed
- `dashboard/election.html`
- `dashboard/js/election.js`
- `dashboard/css/student-pages.css`
- `tests/student-election-reference-ui.test.mjs`
