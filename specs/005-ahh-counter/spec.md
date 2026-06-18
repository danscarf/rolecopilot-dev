# Feature Specification: Ahh Counter

**Feature Branch**: `005-ahh-counter`
**Created**: 2026-01-12
**Status**: Draft
**Input**: User description: "I want to work on a new spec -- that of the Ahh Counter. I have the Ahh counter module. I have a pdf that has the ahh counter script and log. Here is the raw copy/paste: Ah-Counter Script and Log When introduced by the Toastmaster, please state the following: “Greetings Mr./Madam Toastmaster, fellow Toastmasters, and guests. The purpose of the Ah-Counter is to note words and sounds that are used as a “crutch” or “pause filler” by anyone who speaks. During the meeting, I will listen for overused words, including and, well, but, so, and you know. I will also listen for filler sounds, including ah, um, and er . I will also note when a speaker repeats a word or phrase, such as “I, I” or “This means, this means.” At the end of the meeting, I will report the number of times that each speaker used these expressions. Thank you, Mr./Madam Toastmaster.” Ah-Counter Log During the meeting, use the following table to mark down the filler words and sounds used by each speaker and then reference it when giving your report. Name Ah Um Er Well So Like But Repeats Other Item 675A Rev. 09/2019"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Log a Filler Word Event (Priority: P1)

As the Ah-Counter, when a speaker uses a filler word, I want to tap a button to create a timestamped log entry for that specific word and speaker.

**Why this priority**: This is the fundamental data capture action. The entire feature depends on accurately logging individual events as they happen.

**Independent Test**: Can be tested by selecting a speaker, tapping a filler word button (e.g., "Um"), and verifying that a corresponding log entry is created.

**Acceptance Scenarios**:

1.  **Given** I have selected a speaker, **When** I tap the "Um" button, **Then** a new log entry is created with the speaker's name, the filler word "Um", and the current timestamp.
2.  **Given** a log entry has been created, **When** I view the raw log, **Then** I see the new entry in a list of events.

---

### User Story 2 - View Summary Report (Priority: P2)

As the Ah-Counter, I want to view a summary report that automatically aggregates the individual log entries to show total counts for each filler word per speaker.

**Why this priority**: This provides the final, aggregated data required for the Ah-Counter to deliver their report to the club.

**Independent Test**: Can be tested by logging several filler word events for different speakers and then viewing the report to ensure the totals are calculated correctly.

**Acceptance Scenarios**:

1.  **Given** I have logged 3 "Ah" events and 2 "So" events for "John Doe", **When** I view the summary report, **Then** I see "John Doe" has a count of 3 for "Ah" and 2 for "So".
2.  **Given** the log is empty, **When** I view the summary report, **Then** the report is empty or indicates no data has been logged.

---

### User Story 3 - View Role Script (Priority: P3)

As the Ah-Counter, I want to easily access the official script for my role in a collapsible panel so I can introduce it correctly at the start of the meeting.

**Why this priority**: Provides the user with the necessary information to perform their role correctly, improving user experience and confidence while saving screen space.

**Independent Test**: Can be tested by navigating to the Ah-Counter page, expanding the script panel, and verifying the script is visible.

**Acceptance Scenarios**:

1.  **Given** I am on the Ah-Counter page, **When** I click on the script panel header, **Then** the full text of the Ah-Counter introduction is revealed.
2.  **Given** I am on the Ah-Counter page and the script panel is open, **When** I click on the script panel header again, **Then** the full text of the Ah-Counter introduction is hidden.

### Edge Cases

- What happens if the user accidentally increments the wrong counter? Is there an undo or decrement option? Yes, a decrement button should be present next to each increment button.
- What happens if the app closes unexpectedly during a meeting? Is the data saved? No, the data is held in memory for the duration of the session and is not automatically saved.
- How are speakers added or removed during the meeting?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow the user to add, name, and remove speakers for the session.
- **FR-002**: For each speaker, the system MUST provide an interface with buttons for each filler word category ("Ah", "Um", "Er", "Well", "So", "Like", "But", "Repeats", "Other").
- **FR-003**: When a user taps a filler word button for a speaker, the system MUST create a timestamped `AhCounterLogEntry` in a session log.
- **FR-004**: The system MUST allow a user to undo the creation of the most recent log entry to correct mistakes.
- **FR-005**: The system MUST provide a summary report view that is automatically generated from the session log.
- **FR-006**: The summary report MUST aggregate the log entries to display the total count of each filler word for each speaker.
- **FR-007**: The system MUST display the official Ah-Counter introduction script within a collapsible panel.

### Key Entities *(include if feature involves data)*

-   **Speaker**: Represents a person speaking at the meeting.
    -   Attributes: `name` (string)
-   **Session**: Represents a single meeting's tracking data.
    -   Attributes: `date` (datetime), `speakers` (list of Speaker objects), `logEntries` (list of AhCounterLogEntry objects)
-   **AhCounterLogEntry**: Represents a single instance of a filler word being used.
    -   Attributes: `id` (string), `speaker` (link to Speaker), `fillerWord` (string), `timestamp` (datetime)


## Success Criteria *(mandatory)*

### Measurable Outcomes

-   **SC-001**: The Ah-Counter can successfully track and log filler words for at least 10 speakers in a single session without data loss.
-   **SC-002**: The time to log a single filler word usage (i.e., select speaker and increment a counter) MUST be less than 2 seconds.
-   **SC-003**: The final summary report MUST be generated and displayed in under 3 seconds after the user requests it.
-   **SC-004**: 95% of users must be able to successfully track a meeting and generate a report without needing to consult help documentation.