# Feature Specification: Table Topics Question Generator

**Feature Branch**: `010-table-topics-generator`
**Created**: 2026-07-03
**Status**: Draft
**Input**: User description: "Enhance the table topics module to auto-generate table topics based on the word of the day and the meeting theme. There should be a choice as to whether to generate easy questions or hard questions, and there should also be a way to regenerate an already generated question in case I don't like the one that was auto generated."

**Scope note**: No dedicated Table Topics module exists today — "Table Topics" is currently only a Timer preset. This feature therefore introduces a minimal Table Topics Master page to host the generator (question list + session controls). If a fuller Table Topics module is specced later, this generator becomes a section of it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate a Question Set (Priority: P1)

As the Table Topics Master, I want to auto-generate a set of table topics questions based on the meeting theme and the Word of the Day, so I can prepare engaging, on-theme prompts in seconds instead of writing them by hand.

**Why this priority**: This is the core feature — generation from theme + WOTD with a difficulty choice.

**Independent Test**: Enter a theme, confirm the WOTD is pre-filled from the Grammarian session (when set), pick a difficulty and count, generate, and verify a list of distinct, open-ended questions appears.

**Acceptance Scenarios**:

1. **Given** I am on the Table Topics page, **When** I enter a meeting theme (free text) and/or a Word of the Day, choose a difficulty (Easy or Hard) and a question count (1–10, default 5), and click Generate, **Then** a list of that many questions is produced, each open-ended and answerable in a 1–2 minute impromptu response.
2. **Given** a Word of the Day is set in the current Grammarian session, **When** I open the Table Topics page, **Then** the WOTD field is pre-filled from it (and remains editable).
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

### User Story 3 - Use the Set During the Meeting (Priority: P3)

As the Table Topics Master, during the meeting I want to mark questions as asked (and optionally note who answered), so I can run the segment from this page without a paper list.

**Why this priority**: Makes the page useful live, not just for prep — but the generator is valuable standalone.

**Independent Test**: Generate a set, mark two questions as asked, refresh the page, and verify the set and its asked/unasked state persisted.

**Acceptance Scenarios**:

1. **Given** a generated set, **When** I mark a question as asked, **Then** it is visually distinguished (e.g., checked/dimmed) and the state persists across a page refresh.
2. **Given** a generated question isn't quite right, **When** I edit it inline, **Then** my edited text replaces the generated text and persists.

### Edge Cases

- AI generation failure: show a clear error and allow retry; an individual regeneration failure MUST NOT disturb the rest of the set.
- Content safety: generated questions MUST be club-appropriate, respectful, and internationally friendly (aligned with Toastmasters voice/tone); no politics-baiting, offensive, or overly personal prompts.
- Rapid repeated regeneration: debounce/disable the control while a request is in flight to avoid duplicate spend.
- This feature consumes AI credits: like Practice Mode ([009-practice-mode](../009-practice-mode/spec.md)), it requires login, and generation endpoints MUST validate the session server-side.
- Global reset ([007-global-reset](../007-global-reset/spec.md)): clears the stored question set.
- Changing difficulty or theme after generating does not silently regenerate — the user explicitly clicks Generate (which replaces the whole set, with a confirm if unasked edits exist).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a Table Topics page (new module) hosting the generator and the generated set, linked from the main navigation.
- **FR-002**: Generation inputs MUST include: meeting theme (optional free text), Word of the Day (pre-filled from the current Grammarian session when set; editable; optional), question count (1–10, default 5), and difficulty (Easy | Hard) applied to the batch.
- **FR-003**: The system MUST generate questions via AI that are open-ended, suitable for 1–2 minute impromptu answers, club-appropriate, and — when provided — woven around the theme and/or encouraging use of the Word of the Day.
- **FR-004**: Each question MUST have an individual regenerate control that replaces only that question; the replacement MUST differ from all questions currently in the set.
- **FR-005**: Difficulty definitions: Easy = concrete, personal-experience prompts accessible to new members and guests; Hard = abstract, hypothetical, or position-defending prompts for experienced members.
- **FR-006**: Users MUST be able to edit any generated question inline.
- **FR-007**: Users MUST be able to mark questions as asked; asked state is visually distinct.
- **FR-008**: The feature MUST require an authenticated session, and the generation endpoint MUST validate the session server-side (AI credits are spent server-side).
- **FR-009**: The generated set (including edits and asked state) MUST persist in browser storage for the session and MUST be cleared by the global reset (spec 007).

### Key Entities

- **TableTopicsSet**: theme, wordOfTheDay, difficulty, questions (ordered list), generatedAt.
- **TableTopicsQuestion**: id, text, difficulty, status (`unasked` | `asked`), edited (boolean).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A batch of 5 questions generates in under 10 seconds; a single regeneration completes in under 5 seconds.
- **SC-002**: Regenerating one question changes only that question, and the replacement differs from every other question in the set, in 100% of attempts.
- **SC-003**: A Table Topics Master can go from opening the page to a usable set of 5 on-theme questions in under 60 seconds.
- **SC-004**: In review of sample outputs, at least 90% of generated questions are usable without manual editing (open-ended, on-theme, club-appropriate).
