# Data Model: Ahh Counter

This document outlines the data model for the "Ahh Counter" feature, derived from the feature specification.

## Entities

### Speaker

Represents a person speaking at the meeting.

-   **Attributes**:
    -   `name`: `string` (e.g., "John Doe")

### Session

Represents a single meeting's tracking data. This entity holds the overall state of an Ahh Counter session.

-   **Attributes**:
    -   `date`: `datetime` (Timestamp for when the session started)
    -   `speakers`: `list<Speaker>` (A list of speakers participating in the session)
    -   `logEntries`: `list<AhCounterLogEntry>` (A chronological list of all recorded filler word events for the session)

### AhCounterLogEntry

Represents a single instance of a filler word being used by a speaker during a session.

-   **Attributes**:
    -   `id`: `string` (Unique identifier for the log entry, e.g., UUID)
    -   `speaker`: `Speaker` (Link to the Speaker who used the filler word)
    -   `fillerWord`: `string` (The specific filler word or category, e.g., "Ah", "Um", "Repeats", "Other")
    -   `timestamp`: `datetime` (Timestamp for when the filler word was recorded)

## Relationships

-   A `Session` has many `Speaker`s.
-   A `Session` has many `AhCounterLogEntry`s.
-   Each `AhCounterLogEntry` belongs to one `Speaker`.
