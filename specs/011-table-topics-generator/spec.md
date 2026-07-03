# Feature Specification: Table Topics Question Generator

**Feature Branch**: `011-table-topics-generator`
**Created**: 2026-07-03
**Status**: Draft
**Input**: User description: "Enhance the table topics module to auto-generate table topics based on the word of the day and the meeting theme. There should be a choice as to whether to generate easy questions or hard questions, and there should also be a way to regenerate an already generated question in case I don't like the one that was auto generated."

**Scope note**: This enhances the existing Table Topics Master module (`app/topics-master`, spec [007-table-topics-master](../007-table-topics-master/spec.md)), which already provides a session theme, a manually managed topic list, and a speaker log. The generator adds AI-generated topics into that same topic list, so generated questions flow through the existing assign-to-speaker/log workflow unchanged.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate a Question Set (Priority: P1)

As the Table Topics Master, I want to auto-generate a set of table topics questions based on the meeting theme and the Word of the Day, so I can prepare engaging, on-theme prompts in seconds instead of writing them by hand.

**Why this priority**: This is the core feature — generation from theme + WOTD with a difficulty choice.

**Independent Test**: On the Topics Master page, set a theme, confirm the WOTD is pre-filled from the Grammarian session (when set), pick a difficulty and count, generate, and verify the questions are added to the existing topic list as distinct, open-ended prompts.

**Acceptance Scenarios**:

1. **Given** I am on the Topics Master page, **When** I use the session theme (the module's existing theme field) and/or a Word of the Day, choose a difficulty (Easy or Hard) and a question count (1–10, default 5), and click Generate, **Then** that many questions are added to the topic list, each open-ended and answerable in a 1–2 minute impromptu response.
2. **Given** a Word of the Day is set in the current Grammarian session, **When** I open the Topics Master page, **Then** the generator's WOTD field is pre-filled from it (and remains editable).
3. **Given** I provide neither a theme nor a WOTD, **When** I generate, **Then** I receive general-purpose table topics questions (generation MUST NOT require either input).
4. **Given** I chose Easy, **Then** questions are concrete and grounded in personal experience (e.g., "Tell us about a time..."); **Given** I chose Hard, **Then** questions are abstract, hypothetical, or require defending a position.

---

### User Story 2 - Regenerate an Individual Question (Priority: P2)

As the Table Topics Master, when I don't like one generated question I want to regenerate just that one, keeping the rest of the set intact.

**Why this priority**: Explicitly requested; without it, one bad question forces regenerating (and re-reviewing) the whole set.

**Independent Test**: Generate a set of 5, regenerate question #3, and verify only #3 changed and the replacement differs from all current questions.

**Acceptance Scenarios**:

1. **Given** a generated set, **When** I click the regenerate control on one question, **Then** only that question is replaced; all others are untouched.
2. **Given** I regenerate the same slot repeatedly, **Then** each replacement differs from every question currently in the set (no dupes, no bouncing back to the rejected text).
3. **Given** a regeneration is in flight, **Then** that question shows a loading state while the rest of the set remains usable.

---

### User Story 3 - Generated Questions in the Meeting Workflow (Priority: P3)

As the Table Topics Master, I want generated questions to behave exactly like manually added topics — assignable to speakers via the existing log, editable, and marked once used — so the generator plugs into how I already run the segment.

**Why this priority**: The module already has an assign-and-log workflow; the generator must feed it, not duplicate it.

**Independent Test**: Generate a set, log a speaker against one generated question via the existing workflow, refresh the page, and verify the set and the log entry persisted.

**Acceptance Scenarios**:

1. **Given** a generated set, **When** I log a speaker against a generated question using the existing speaker log, **Then** it works identically to a manually added topic, and the question is visually marked as used.
2. **Given** a generated question isn't quite right, **When** I edit it inline, **Then** my edited text replaces the generated text and persists.
3. **Given** generated and manually added topics coexist, **Then** both appear in the same list and are managed the same way (remove, assign, log).

### Edge Cases

- AI generation failure: show a clear error and allow retry; an individual regeneration failure MUST NOT disturb the rest of the set.
- Content safety: generated questions MUST be club-appropriate, respectful, and internationally friendly (aligned with Toastmasters voice/tone); no politics-baiting, offensive, or overly personal prompts.
- Rapid repeated regeneration: debounce/disable the control while a request is in flight to avoid duplicate spend.
- This feature consumes AI credits: like Practice Mode ([010-practice-mode](../010-practice-mode/spec.md)), it requires login, and generation endpoints MUST validate the session server-side. (Note: main currently has no auth requirement on any page — see merged PR #8 — so the auth story for AI features needs to be settled before implementation.)
- Global reset ([008-global-reset](../008-global-reset/spec.md)): clears the Topics Master session including generated questions.
- Changing difficulty or theme after generating does not silently regenerate — the user explicitly clicks Generate (which appends or replaces per an explicit choice, with a confirm before discarding unused questions).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The generator MUST live inside the existing Table Topics Master module (`app/topics-master`) as a generation section alongside the current manual topic entry; generated questions are added to the module's existing topic list.
- **FR-002**: Generation inputs MUST include: the session theme (reusing the module's existing theme field; optional), Word of the Day (pre-filled from the current Grammarian session when set; editable; optional), question count (1–10, default 5), and difficulty (Easy | Hard) applied to the batch.
- **FR-003**: The system MUST generate questions via AI that are open-ended, suitable for 1–2 minute impromptu answers, club-appropriate, and — when provided — woven around the theme and/or encouraging use of the Word of the Day.
- **FR-004**: Each question MUST have an individual regenerate control that replaces only that question; the replacement MUST differ from all questions currently in the set.
- **FR-005**: Difficulty definitions: Easy = concrete, personal-experience prompts accessible to new members and guests; Hard = abstract, hypothetical, or position-defending prompts for experienced members.
- **FR-006**: Users MUST be able to edit any generated question inline.
- **FR-007**: Generated questions MUST work with the module's existing speaker log (assign a speaker to a question); questions with a log entry are visually marked as used.
- **FR-008**: The generation endpoint MUST validate an authenticated session server-side (AI credits are spent server-side), consistent with the access policy adopted for Practice Mode (spec 010).
- **FR-009**: Generated questions (including edits and used state) MUST persist within the existing `topics-master-session` storage and MUST be cleared by the module's session reset and the global reset (spec 008).

### Key Entities

- **Topic** (existing, extended): id, text — extended with optional generation metadata: source (`manual` | `generated`), difficulty (`easy` | `hard`), edited (boolean).
- **GenerationRequest** (transient): theme, wordOfTheDay, count, difficulty — inputs sent to the generation endpoint; not persisted beyond the session.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A batch of 5 questions generates in under 10 seconds; a single regeneration completes in under 5 seconds.
- **SC-002**: Regenerating one question changes only that question, and the replacement differs from every other question in the set, in 100% of attempts.
- **SC-003**: A Table Topics Master can go from opening the page to a usable set of 5 on-theme questions in under 60 seconds.
- **SC-004**: In review of sample outputs, at least 90% of generated questions are usable without manual editing (open-ended, on-theme, club-appropriate).
