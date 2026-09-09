# Complaint Classification Permission Fix

## Symptom
When an authorized USC officer selected a complaint classification and clicked **Save Review**, Firestore returned:

`Missing or insufficient permissions.`

## Cause
The browser UI had already been updated to write the new root-level `classification` field and expanded complaint audit fields, but an existing Firebase project may still be running the previous deployed Firestore rules. Those older rules only allow complaint changes to `status`, `updatedAt`, and `thread`, so the new write is rejected even though the local source contains newer rules.

## Fix
The complaint review adapter now uses two safe paths:

1. It first attempts the current structured write with the root-level `classification` field.
2. If Firestore reports `permission-denied`, it automatically retries using the previous rule-compatible shape. The classification is preserved in an immutable USC review entry inside the complaint `thread`.

Student Tracklist, student dashboard notifications, and the USC complaint manager now resolve classification from either the root field or the latest trusted USC thread entry. Classification-only review entries are not displayed as USC feedback.

USC feedback uses the same compatibility behavior, so feedback can still be sent while retaining the assigned classification.

The updated `firestore.rules` file remains the recommended final deployed configuration, but existing installations no longer fail immediately just because their rules have not yet been republished.
