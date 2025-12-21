# Implementation Tasks: Agenda PII Handling (Text-to-JSON)

This document outlines the development tasks required to implement the "Agenda PII Handling" feature. The tasks are organized into phases, with each phase representing a logical step towards completion.

## Phase 1: Security Planning & Setup

This phase covers initial setup and critical security planning before any code is written.

- [ ] T001 Create a threat model document based on FR-017 in `specs/001-agenda-pii-handling/threat-model.md`
- [ ] T002 Set up the local environment: create `.env.local` from `.env.example` (if one exists) and run `npm install`

## Phase 2: Foundational Libraries

This phase focuses on creating the core, reusable logic for PII sanitization and AI interaction. These can be developed in parallel.

- [ ] T003 [P] Implement PII sanitization function in `app/_lib/pii.ts`. It must accept text and a list of attendee names, returning sanitized text and a token-to-name map.
- [ ] T004 [P] Implement the Gemini service in `app/_lib/gemini.ts`. This will initialize the client and export a function that takes sanitized prompt text and returns structured JSON.
- [ ] T005 [P] **[Security]** Update the PII sanitizer in `app/_lib/pii.ts` to use randomized, non-sequential tokens (e.g., `[PII_w3d8s2]` instead of `[PERSON_1]`) to mitigate in-memory pattern inference attacks.
- [ ] T006 [P] **[Security]** Harden the system prompt in `app/_lib/gemini.ts` with strong delimiters and explicit instructions for the model to disregard any instructions in the user-provided text, mitigating prompt injection attacks.

## Phase 3: User Story 1 - Secure Agenda Processing

This phase implements the core user-facing feature as defined in User Story 1.

**User Story Goal**: As a user, I want to paste agenda text, have it processed securely, and see the structured roles displayed.
**Independent Test Criteria**: A user can paste text, and the system displays the correct roles and assignees without PII being sent to the AI service.

- [ ] T007 [US1] Implement the API route in `app/(api)/process-agenda/route.ts`. This route will coordinate the PII sanitization and Gemini service calls.
- [ ] T008 [P] [US1] Create the state management context in `app/_providers/AgendaProvider.tsx` to handle loading states, errors, and role data.
- [ ] T009 [P] [US1] Create the input component `app/_components/agenda/AgendaInput.tsx` with a text area and a submission button.
- [ ] T010 [P] [US1] Create the display component `app/_components/agenda/RoleDisplay.tsx` to render the list of extracted roles.

## Phase 4: Integration & Polish

This final phase brings all the pieces together and refines the user experience.

- [ ] T011 [US1] Integrate `AgendaProvider`, `AgendaInput`, and `RoleDisplay` into the main page `app/page.tsx`.
- [ ] T012 [US1] Implement UI feedback for loading and error states within the components.
- [ ] T013 [P] [US1] Apply Tailwind CSS styling to all created components for a polished and responsive layout.

## Dependencies

-   **User Story 1 (US1)** is dependent on the completion of **Phase 2**.

## Parallel Execution

-   Tasks marked with `[P]` can be worked on in parallel.
-   Within **Phase 2**, the `pii.ts` and `gemini.ts` libraries are independent and can be developed simultaneously.
-   Within **Phase 3**, the API route (`T005`) can be developed in parallel with the UI state (`T006`) and components (`T007`, `T008`).

## Implementation Strategy

The implementation will follow an MVP-first approach, focusing on completing the end-to-end flow for User Story 1. The foundational libraries will be built first, followed by the API and UI, and then integrated for a fully functional feature.
