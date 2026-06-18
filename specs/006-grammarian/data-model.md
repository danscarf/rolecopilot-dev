# Data Model: Grammarian

This document outlines the data model for the "Grammarian" feature, derived from the feature specification.

## Entities

### Speaker

Represents a person speaking at the meeting.

-   **Attributes**:
    -   `id`: `string` (Unique identifier for the speaker)
    -   `name`: `string` (e.g., "John Doe")

### WordOfTheDay

Represents the chosen word for the meeting.

-   **Attributes**:
    -   `word`: `string` (e.g., "Ephemeral")
    -   `meaning`: `string` (e.g., "Lasting for a very short time")
    -   `example`: `string` (e.g., "The beauty of the cherry blossoms is ephemeral.")

### ImproperUsageEntry

Represents an instance of improper language use.

-   **Attributes**:
    -   `id`: `string` (Unique identifier for the entry)
    -   `speaker`: `Speaker` (Link to the Speaker who made the error)
    -   `improperUse`: `string` (The incorrect phrase or word)
    -   `suggestion`: `string` (The suggested correction)
    -   `timestamp`: `datetime` (When the observation was recorded)

### OutstandingLanguageEntry

Represents an instance of outstanding language.

-   **Attributes**:
    -   `id`: `string` (Unique identifier for the entry)
    -   `speaker`: `Speaker` (Link to the Speaker)
    -   `phrase`: `string` (The notable word, quote, or phrase)
    -   `timestamp`: `datetime` (When the observation was recorded)

### WotdUsageEntry

Represents a speaker's use of the Word of the Day.

-   **Attributes**:
    -   `id`: `string` (Unique identifier for the entry)
    -   `speaker`: `Speaker` (Link to the Speaker who used the word)
    -   `usedAt`: `datetime` (Timestamp of the usage)

### GrammarianSession

Represents the overall state of the Grammarian's activities for a meeting.

-   **Attributes**:
    -   `id`: `string` (Unique identifier for the session)
    -   `date`: `datetime` (Start date/time of the session)
    -   `wordOfTheDay`: `WordOfTheDay` (The session's Word of the Day)
    -   `speakers`: `list<Speaker>` (List of speakers in the session)
    -   `improperUsages`: `list<ImproperUsageEntry>` (List of recorded improper usages)
    -   `outstandingLanguage`: `list<OutstandingLanguageEntry>` (List of recorded outstanding language)
    -   `wotdUsages`: `list<WotdUsageEntry>` (List of recorded Word of the Day usages)

## Relationships

-   A `GrammarianSession` has one `WordOfTheDay`.
-   A `GrammarianSession` has many `Speaker`s.
-   A `GrammarianSession` has many `ImproperUsageEntry`s, `OutstandingLanguageEntry`s, and `WotdUsageEntry`s.
-   Each `ImproperUsageEntry`, `OutstandingLanguageEntry`, and `WotdUsageEntry` belongs to one `Speaker`.
