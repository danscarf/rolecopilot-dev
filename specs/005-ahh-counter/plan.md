# Implementation Plan: Ahh Counter

**Branch**: `005-ahh-counter` | **Date**: 2026-01-12 | **Spec**: [./spec.md]
**Input**: Feature specification from `/Users/dan/src/github/danscarf/rolecopilot-dev/specs/005-ahh-counter/spec.md`

## Summary

This plan outlines the implementation of the "Ahh Counter" feature. The feature will provide a user interface for an "Ah-Counter" to log instances of filler words used by speakers during a meeting. The technical approach is to build this as a new client-side feature within the existing Next.js application, using React components and a context provider for state management, similar to the existing Timer module.

## Technical Context

**Language/Version**: Node.js 20.x, TypeScript 5.x
**Primary Dependencies**: React 19.2.3, Next.js 16.1.0, Tailwind CSS ^4
**Testing**: Jest, React Testing Library
**Target Platform**: Web (Modern Browsers)
**Project Type**: Web application
**Performance Goals**: Log a filler word in < 2 seconds. Generate summary report in < 3 seconds.
**Constraints**: All data is session-based and is not persisted to a database.
**Scale/Scope**: Single-user interface for tracking up to 10 speakers per session.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [X] **Specification-First**: A clear, reviewed specification exists for this feature.
- [ ] **UI-First Prototyping**: A formal UI prototype has not been created. This is a violation of the constitution. See Complexity Tracking for justification.
- [X] **Test-Driven Development**: The plan is to write tests before the implementation, following the TDD principle.
- [X] **Component-Based Architecture**: The proposed structure aligns with the existing component-based model of the application.
- [X] **Iterative Development**: The feature is broken down into user stories that can be implemented iteratively.

## Project Structure

### Documentation (this feature)

```text
specs/005-ahh-counter/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A for this feature)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── ahh-counter/
│   │   │   └── page.tsx
│   │   ├── _components/
│   │   │   └── ahh-counter/
│   │   │       ├── AhhCounterDisplay.tsx
│   │   │       ├── AhhCounterControls.tsx
│   │   │       ├── SpeakerList.tsx
│   │   │       ├── AhhCounterReport.tsx
│   │   │       └── AhhCounterScript.tsx
│   │   └── _providers/
│   │       └── AhhCounterProvider.tsx
└── tests/
    └── ahh-counter/
        ├── AhhCounterDisplay.test.tsx
        └── AhhCounterProvider.test.tsx
```

**Structure Decision**: The feature will be implemented within the existing Next.js application structure. A new route `/ahh-counter` will be created, along with associated components and a context provider for state management. This follows the established pattern of the Timer module.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| No UI Prototype | The user has guided the UI design by referencing existing components and interactions within the app ("do you see how the timer's role script is hidden..."). | Halting for a formal prototype would slow down the interactive development process. The user's directive provides sufficient UI guidance for this stage. |