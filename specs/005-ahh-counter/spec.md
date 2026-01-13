# Feature Specification: Ahh Counter

**Feature Branch**: `005-ahh-counter`
**Created**: 2026-01-12
**Status**: Draft
**Input**: User description: "I want to work on a new spec -- that of the Ahh Counter. I have the Ahh counter module. I have a pdf that has the ahh counter script and log. Here is the raw copy/paste: Ah-Counter Script and Log When introduced by the Toastmaster, please state the following: “Greetings Mr./Madam Toastmaster, fellow Toastmasters, and guests. The purpose of the Ah-Counter is to note words and sounds that are used as a “crutch” or “pause filler” by anyone who speaks. During the meeting, I will listen for overused words, including and, well, but, so, and you know. I will also listen for filler sounds, including ah, um, and er . I will also note when a speaker repeats a word or phrase, such as “I, I” or “This means, this means.” At the end of the meeting, I will report the number of times that each speaker used these expressions. Thank you, Mr./Madam Toastmaster.” Ah-Counter Log During the meeting, use the following table to mark down the filler words and sounds used by each speaker and then reference it when giving your report. Name Ah Um Er Well So Like But Repeats Other Item 675A Rev. 09/2019"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Track Filler Words (Priority: P1)

As the Ah-Counter, I want to be able to track filler words for each speaker during a meeting so that I can provide an accurate report.

**Why this priority**: This is the core functionality of the Ahh Counter role. Without this, the role cannot be performed.

**Independent Test**: Can be tested by adding speakers, incrementing their filler word counts, and verifying the final report is accurate.

**Acceptance Scenarios**:

1.  **Given** I am on the Ah-Counter screen, **When** I add a new speaker, **Then** the speaker appears in my list with all filler counts at zero.
2.  **Given** a speaker is in my list, **When** the speaker uses a filler word (e.g., "ah"), **Then** I can tap the "ah" button for that speaker and their "ah" count increases by one.
3.  **Given** I have tracked filler words for multiple speakers, **When** the meeting ends, **Then** I can view a summary report showing each speaker and their total counts for each filler word.

---

### User Story 2 - View Role Script (Priority: P2)

As the Ah-Counter, I want to easily access the official script for my role in a collapsible panel so I can introduce it correctly at the start of the meeting.

**Why this priority**: Provides the user with the necessary information to perform their role correctly, improving user experience and confidence while saving screen space.

**Independent Test**: Can be tested by navigating to the Ah-Counter page, expanding the script panel, and verifying the script is visible.

**Acceptance Scenarios**:

1.  **Given** I am on the Ah-Counter page, **When** I click on the script panel header, **Then** the full text of the Ah-Counter introduction is revealed.
2.  **Given** I am on the Ah-Counter page and the script panel is open, **When** I click on the script panel header again, **Then** the full text of the Ah-Counter introduction is hidden.

---

### Edge Cases

- What happens if the user accidentally increments the wrong counter? Is there an undo or decrement option? Yes, a decrement button should be present next to each increment button.
- What happens if the app closes unexpectedly during a meeting? Is the data saved? No, the data is held in memory for the duration of the session and is not automatically saved.
- How are speakers added or removed during the meeting?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow the user to add, name, and remove speakers for the session.
- **FR-002**: The system MUST provide a dedicated interface for tracking filler word counts for each speaker.
- **FR-003**: The tracking interface MUST include counters for "Ah", "Um", "Er", "Well", "So", "Like", "But", "Repeats", and a generic "Other".
- **FR-004**: The user MUST be able to increment the count for each filler word category for each speaker with a single action (e.g., a tap).
- **FR-005**: The system MUST display the running total for each filler word category for every speaker in real-time.
- **FR-006**: The system MUST be able to generate a summary report displaying the final counts for all speakers.
- **FR-007**: The system MUST display the official Ah-Counter introduction script within a collapsible panel.
- **FR-008**: The user MUST be able to decrement the count for each filler word category for each speaker.

### Key Entities *(include if feature involves data)*

-   **Speaker**: Represents a person speaking at the meeting.
    -   Attributes: `name` (string)
-   **Session**: Represents a single meeting's tracking data.
    -   Attributes: `date` (datetime), `speakers` (list of Speaker objects)
-   **FillerCount**: Represents the counts of filler words for a speaker within a session.
    -   Attributes: `speaker` (link to Speaker), `ah_count` (integer), `um_count` (integer), `er_count` (integer), `well_count` (integer), `so_count` (integer), `like_count` (integer), `but_count` (integer), `repeats_count` (integer), `other_count` (integer)


## Success Criteria *(mandatory)*

### Measurable Outcomes

-   **SC-001**: The Ah-Counter can successfully track and log filler words for at least 10 speakers in a single session without data loss.
-   **SC-002**: The time to log a single filler word usage (i.e., select speaker and increment a counter) MUST be less than 2 seconds.
-   **SC-003**: The final summary report MUST be generated and displayed in under 3 seconds after the user requests it.
-   **SC-004**: 95% of users must be able to successfully track a meeting and generate a report without needing to consult help documentation.