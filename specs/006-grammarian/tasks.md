# Tasks: Grammarian

This document breaks down the implementation of the "Grammarian" feature into actionable tasks.

## Phase 1: Foundational Setup
- [ ] T001 Create `app/grammarian/` directory and a basic `page.tsx` for the feature.
- [ ] T002 Create `app/_components/grammarian/` directory for the feature's components.
- [ ] T003 Implement the `GrammarianProvider` in `app/_providers/GrammarianProvider.tsx` to manage state.
- [ ] T004 Create a reusable `SpeakerList` component (or adapt the one from Ahh Counter) in `app/_components/shared/SpeakerList.tsx`.

## Phase 2: User Story 1 - Record Language Observations
**Goal**: Allow the user to record observations about speaker language usage.
**Independent Test**: User can add a speaker, select them, and record an improper usage and an outstanding phrase.

- [ ] T005 [US1] Create the `ImproperUsage` component in `app/_components/grammarian/ImproperUsage.tsx` for logging improper uses.
- [ ] T006 [US1] Create the `OutstandingLanguage` component in `app/_components/grammarian/OutstandingLanguage.tsx` for logging notable quotes.
- [ ] T007 [US1] Integrate the `SpeakerList`, `ImproperUsage`, and `OutstandingLanguage` components into the main `app/grammarian/page.tsx`.

## Phase 3: User Story 2 - Manage Word of the Day
**Goal**: Allow the user to set and track the Word of the Day.
**Independent Test**: User can set the WOTD and mark speakers who have used it.

- [ ] T008 [US2] Create the `WordOfTheDay` component in `app/_components/grammarian/WordOfTheDay.tsx` to set and display the WOTD.
- [ ] T009 [US2] Implement the UI for tracking WOTD usage by speaker.
- [ ] T010 [US2] Integrate the `WordOfTheDay` component and WOTD usage tracking into `app/grammarian/page.tsx`.

## Phase 4: User Story 3 - Generate Comprehensive Report
**Goal**: Display a summary report of all observations.
**Independent Test**: After logging observations, the user can see a report with all the collected data.

- [ ] T011 [US3] Create the `GrammarianReport` component in `app/_components/grammarian/GrammarianReport.tsx`.
- [ ] T012 [US3] Integrate the `GrammarianReport` component into `app/grammarian/page.tsx`.

## Phase 5: User Story 4 - Access Role Script
**Goal**: Provide the official Grammarian script in a collapsible panel.
**Independent Test**: User can expand and collapse the script panel.

- [ ] T013 [US4] Create the `GrammarianScript` component in `app/_components/grammarian/GrammarianScript.tsx`.
- [ ] T014 [US4] Implement the collapsible panel logic for the script in `app/grammarian/page.tsx`.

## Phase 6: Polish
- [ ] T015 Review and refine the UI for all new components.
- [ ] T016 Add comments to any complex code sections.
- [ ] T017 Add a link to the "Grammarian" page in the main navigation bar (`Navbar.tsx`).

## Dependencies

- **US1 & US2** are prerequisites for **US3**.
- **US4** is independent.

## Implementation Strategy

The feature will be built incrementally, following the user story phases.
