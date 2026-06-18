# Implementation Plan: Grammarian

**Branch**: `006-grammarian` | **Date**: 2026-01-13 | **Spec**: [./spec.md]
**Input**: Feature specification from `/Users/dan/src/github/danscarf/rolecopilot-dev/specs/006-grammarian/spec.md`

## Summary

This plan outlines the implementation of the "Grammarian" feature. The feature will provide a user interface for a Grammarian to log observations about language usage, track the Word of the Day, and generate a report. The technical approach is to build this as a new client-side feature within the existing Next.js application, using React components and a context provider for state management, similar to the Ahh Counter feature.

## Technical Context

**Language/Version**: Node.js 20.x, TypeScript 5.x
**Primary Dependencies**: React 19.2.3, Next.js 16.1.0, Tailwind CSS ^4
**Storage**: In-memory state management using React's Context API. No database persistence for this feature.
**Testing**: Jest, React Testing Library
**Target Platform**: Web (Modern Browsers)
**Project Type**: Web application
**Performance Goals**: Record an observation in < 5 seconds. Generate summary report in < 5 seconds.
**Constraints**: All data is session-based and is not persisted to a database.
**Scale/Scope**: Single-user interface for tracking a meeting's language usage.

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
specs/006-grammarian/
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
│   │   ├── grammarian/
│   │   │   └── page.tsx
│   │   ├── _components/
│   │   │   └── grammarian/
│   │   │       ├── WordOfTheDay.tsx
│   │   │       ├── ImproperUsage.tsx
│   │   │       ├── OutstandingLanguage.tsx
│   │   │       ├── GrammarianReport.tsx
│   │   │       └── GrammarianScript.tsx
│   │   └── _providers/
│   │       └── GrammarianProvider.tsx
└── tests/
    └── grammarian/
        ├── GrammarianProvider.test.tsx
```

**Structure Decision**: The feature will be implemented within the existing Next.js application structure. A new route `/grammarian` will be created, along with associated components and a context provider for state management. This follows the established pattern of the Ahh Counter feature.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| No UI Prototype | The user is guiding the design process interactively. | Halting for a formal prototype would slow down the interactive development process. The user's iterative feedback serves as a proxy for a formal prototype at this stage. |