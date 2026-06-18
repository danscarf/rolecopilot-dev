# Feature Specification: Grammarian

**Feature Branch**: `006-grammarian`
**Created**: 2026-01-13
**Status**: Draft
**Input**: User description: "Grammarian Script and Log
When introduced by the Toastmaster, please state the following:
“Mr./Madam Toastmaster, fellow Toastmasters, and guests. As Grammarian, it is my responsibility to pay close
attention to all speakers, listening carefully to their language usage. I’ll take note of any improper language, as well
as any outstanding words, quotes, sayings, or thoughts. As Grammarian, it is also my duty to introduce the Word of
the Day.
•
For today’s meeting, the Word is ______________________________, which means _____________________
•
__________________________________________________________________________________________.
[Display the Word of the Day at the front of the room.]
An example of using the word is: _______________________________________________________________
•
•
__________________________________________________________________________________________.
Each speaker is encouraged to use the Word of the Day.
I will give the Grammarian’s report when called upon during the meeting and also report on the usage of the
Word of the Day.
Thank you, Mr./Madam Toastmaster.”
Grammarian Log Date: _____________ Word of the Day: _______________________
List those who used the word of the day:
Item 675C Rev. 09/2019
Improper Grammatical Uses/Suggestions for Improvements:
Name Improper Use Suggestions
List Quotes, Thoughts, Words, or Sayings that you Liked
Name What did they say?"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record Language Observations (Priority: P1)

As the Grammarian, I want to record observations about speaker language usage during a meeting so that I can provide a comprehensive report.

**Why this priority**: This is the core function of the Grammarian role, focusing on both positive and negative language usage.

**Independent Test**: Can be tested by adding speakers, recording various observations (improper use, outstanding language), and verifying these observations appear correctly in a preliminary log.

**Acceptance Scenarios**:

1.  **Given** I am on the Grammarian screen and a speaker uses improper language, **When** I select the speaker and input the improper usage and a suggestion, **Then** a new observation is logged with these details.
2.  **Given** I am on the Grammarian screen and a speaker uses an outstanding word or phrase, **When** I select the speaker and input the phrase, **Then** a new observation is logged with these details.
3.  **Given** I have recorded multiple observations for a speaker, **When** I view the session's raw log, **Then** I see all recorded observations associated with that speaker.

---

### User Story 2 - Manage Word of the Day (Priority: P2)

As the Grammarian, I want to set and track the "Word of the Day" so that I can encourage its use and report on it.

**Why this priority**: The Word of the Day is a central element of the Grammarian's duties, promoting vocabulary growth.

**Independent Test**: Can be tested by setting the WOTD, marking speakers as having used it, and verifying these usages are recorded.

**Acceptance Scenarios**:

1.  **Given** I am on the Grammarian screen, **When** I start a new meeting, **Then** I can input and set the Word of the Day, its meaning, and an example sentence.
2.  **Given** the Word of the Day is set and a speaker uses it, **When** I select the speaker, **Then** they are marked as having used the Word of the Day.
3.  **Given** a speaker has used the Word of the Day, **When** I view the session's raw log, **Then** I see their usage recorded.

---

### User Story 3 - Generate Comprehensive Report (Priority: P3)

As the Grammarian, I want to view a summary report of all my observations and Word of the Day usage so that I can present it to the meeting.

**Why this priority**: This is the final output of the Grammarian's role, crucial for the meeting's educational aspect.

**Independent Test**: Can be tested by ensuring all recorded improper uses, outstanding language, and WOTD usages are correctly aggregated and displayed in a clear report format.

**Acceptance Scenarios**:

1.  **Given** I have recorded improper uses, outstanding language, and WOTD usages for multiple speakers, **When** I request the Grammarian's report, **Then** the report displays all improper uses with suggestions, all outstanding language, and a list of speakers who used the WOTD.
2.  **Given** the session log is empty, **When** I request the report, **Then** the report indicates no observations were made.

---

### User Story 4 - Access Role Script (Priority: P4)

As the Grammarian, I want to easily access my official role script in a collapsible panel so I can introduce my role correctly at the start of the meeting.

**Why this priority**: Provides the Grammarian with necessary information to perform their role correctly, improving confidence and efficiency.

**Independent Test**: Can be tested by navigating to the Grammarian page, expanding the script panel, and verifying the script is visible and accessible.

**Acceptance Scenarios**:

1.  **Given** I am on the Grammarian page, **When** I click on the script panel header, **Then** the full text of the Grammarian introduction is revealed.
2.  **Given** I am on the Grammarian page and the script panel is open, **When** I click on the script panel header again, **Then** the full text is hidden.

### Edge Cases

- What happens if the Grammarian needs to correct an entry (e.g., delete an improper usage, unmark WOTD usage)? Yes, provide an 'undo last action' similar to the Ahh Counter.
- What happens if the Word of the Day or its meaning needs to be changed after being set? Yes, allow editing of the WOTD, meaning, and example at any time during the session.
- How are speakers added or removed during the meeting for observation? (Assuming similar speaker management as Ahh Counter).
- How is a new meeting or session initiated, clearing previous data? (Assuming a "Start New Session" action).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow the Grammarian to add and manage a list of speakers for the session.
- **FR-002**: The system MUST provide an interface for recording improper grammatical uses, including the speaker's name, the improper usage, and a suggestion for improvement.
- **FR-003**: The system MUST provide an interface for recording outstanding language (words, quotes, sayings, thoughts), including the speaker's name and the specific language used.
- **FR-004**: The system MUST allow the Grammarian to set a Word of the Day (WOTD), its meaning, and an example of its use for the current session.
- **FR-005**: The system MUST provide an interface for tracking which speakers used the Word of the Day.
- **FR-006**: The system MUST generate a comprehensive report at the end of the session, summarizing:
    *   Improper grammatical uses with suggestions.
    *   Outstanding language observations.
    *   A list of speakers who used the Word of the Day.
- **FR-007**: The system MUST display the official Grammarian introduction script within a collapsible panel.

### Key Entities *(include if feature involves data)*

-   **Speaker**: Represents a person speaking at the meeting.
    -   Attributes: `id` (string), `name` (string)
-   **WordOfTheDay**: Represents the chosen word for the meeting.
    -   Attributes: `word` (string), `meaning` (string), `example` (string)
-   **ImproperUsageEntry**: Represents an instance of improper language use.
    -   Attributes: `id` (string), `speaker` (link to Speaker), `improperUse` (string), `suggestion` (string), `timestamp` (datetime)
-   **OutstandingLanguageEntry**: Represents an instance of outstanding language (e.g., strong words, quotes, thoughts).
    -   Attributes: `id` (string), `speaker` (link to Speaker), `phrase` (string), `timestamp` (datetime)
-   **WotdUsageEntry**: Represents a speaker's use of the Word of the Day.
    -   Attributes: `id` (string), `speaker` (link to Speaker), `usedAt` (datetime)
-   **GrammarianSession**: Represents the overall state of the Grammarian's activities for a meeting.
    -   Attributes: `id` (string), `date` (datetime), `wordOfTheDay` (link to WordOfTheDay), `speakers` (list of Speaker objects), `improperUsages` (list of ImproperUsageEntry objects), `outstandingLanguage` (list of OutstandingLanguageEntry objects), `wotdUsages` (list of WotdUsageEntry objects)


## Success Criteria *(mandatory)*

### Measurable Outcomes

-   **SC-001**: The Grammarian can successfully record observations for at least 10 speakers and generate a report in a single session without data loss.
-   **SC-002**: The time to record an observation (improper use, outstanding language, or WOTD usage) MUST be less than 5 seconds.
-   **SC-003**: The final report MUST be generated and displayed in under 5 seconds after the user requests it.
-   **SC-004**: 90% of users must be able to successfully track a meeting and generate a report without needing to consult help documentation.