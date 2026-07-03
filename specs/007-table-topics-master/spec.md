# Feature Specification: Table Topics Master

**Feature Branch**: `007-table-topics-master`
**Created**: 2026-06-18
**Status**: Draft
**Input**: User description: "Table Topics Master role — facilitates impromptu speaking. Needs: intro script, meeting theme field, topics list, speaker log (speaker name + assigned topic, 2 min each)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Log Speakers and Topics (Priority: P1)

As the Table Topics Master, I want to record which speaker is assigned to which topic so that I can track who has spoken and provide an accurate session log.

**Why this priority**: The speaker/topic log is the core deliverable of the role.

**Independent Test**: Add a theme, add topics, assign speakers to topics, verify the log shows all pairings.

**Acceptance Scenarios**:

1. **Given** I am on the Table Topics Master screen, **When** I enter a speaker name and select a topic, **Then** a log entry is created pairing that speaker to that topic.
2. **Given** I have logged multiple speakers, **When** I view the log, **Then** I see all speaker/topic pairs in the order they spoke.
3. **Given** a log entry was added by mistake, **When** I remove it, **Then** it is deleted from the log.

---

### User Story 2 - Meeting Setup (Priority: P2)

As the Table Topics Master, I want to set the meeting theme and prepare my topics list before the meeting starts so that I am ready when called upon.

**Why this priority**: The theme and topics are the raw material for the session; they need to be set up before speakers are called.

**Independent Test**: Enter a theme and add several topics. Verify they appear in the setup panel and are available when logging speakers.

**Acceptance Scenarios**:

1. **Given** I open the Table Topics Master screen, **When** I enter a meeting theme, **Then** the theme is saved and shown throughout the session.
2. **Given** I have set a theme, **When** I add topics to the list, **Then** each topic appears as an option when assigning speakers.
3. **Given** I added a topic by mistake, **When** I remove it, **Then** it is deleted from the topics list.

---

### User Story 3 - Script Display (Priority: P3)

As the Table Topics Master, I want to read my intro script when called upon so I don't have to memorize it.

**Why this priority**: Supporting role; the core log works without it.

**Independent Test**: Toggle the script panel and verify the full Toastmasters intro text is displayed.

**Acceptance Scenarios**:

1. **Given** I am on the Table Topics Master screen, **When** I expand the script panel, **Then** the standard Topicsmaster intro speech is displayed.
2. **Given** the script is visible, **When** I collapse it, **Then** it hides without affecting the rest of the UI.

---

### Edge Cases

- What if no theme is set? Theme field should be optional; log should still work.
- What if a topic is assigned to multiple speakers? Allow it — same topic can be reused.
- What if a speaker name is blank? Prevent submission with an empty name.
- Session persists across page refreshes via localStorage; clear button resets.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow the user to enter a meeting theme (optional, free text).
- **FR-002**: System MUST allow the user to add and remove topics from a list.
- **FR-003**: System MUST allow the user to log a speaker by entering a name and selecting a topic from the list.
- **FR-004**: System MUST display all logged speaker/topic pairs in chronological order.
- **FR-005**: System MUST allow individual log entries to be removed.
- **FR-006**: System MUST display the standard Topicsmaster intro script in a collapsible panel.
- **FR-007**: System MUST persist session state (theme, topics, log) in localStorage across page refreshes.
- **FR-008**: System MUST provide a reset button to clear all session state.
- **FR-009**: Speaker name field MUST reject empty submissions.

### Key Entities

- **Topic**: `{ id: string; text: string }`
- **TopicLogEntry**: `{ id: string; speakerName: string; topic: Topic; timestamp: Date }`
- **TopicsMasterSession**: `{ date: Date; theme: string; topics: Topic[]; log: TopicLogEntry[] }`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can set up theme + topics in under 60 seconds before the meeting starts.
- **SC-002**: Logging a speaker takes 2 interactions or fewer (name + topic select + submit).
- **SC-003**: Full session log is available for copy/review at end of meeting.
