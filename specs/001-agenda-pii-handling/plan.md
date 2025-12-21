# Implementation Plan: Agenda PII Handling (Text-to-JSON)

**Branch**: `001-agenda-pii-handling` | **Date**: 2025-12-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-agenda-pii-handling/spec.md`

## Summary

The primary requirement is to process user-pasted, unstructured text/HTML by sanitizing Personally Identifiable Information (PII) locally, using the Gemini AI to convert the sanitized text into structured JSON, and then displaying the resulting roles to the user. This approach replaces the previous PDF-parsing workflow.

## Technical Context

**Note**: This feature is designed for an anonymous user experience and does not include user authentication. User authentication is planned as a separate, future feature.

**Language/Version**: Node.js 20.x, TypeScript 5.x
**Primary Dependencies**: Next.js, React, Tailwind CSS, **@google/generative-ai** - **NEEDS CLARIFICATION**: on optimal API usage patterns and prompt design for this specific text-to-JSON task.
**Storage**: N/A for persistent PII. React state and context for in-memory session data.
**Testing**: Jest, React Testing Library, Playwright for end-to-end tests.
**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari).
**Project Type**: Web application.
**Performance Goals**: Process input text and display extracted roles in under 15 seconds.
**Constraints**: All PII (e.g., names) MUST be sanitized from the text *before* it is sent to the Gemini API.
**Scale/Scope**: Per-user sessions for processing a single block of text at a time.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Specification-First**: A detailed specification exists and was updated on 2025-12-21.
- [ ] **UI-First Prototyping**: A UI prototype for the text input and role display is required.
- [x] **Test-Driven Development**: The plan includes writing unit tests for the PII sanitizer and integration tests for the API flow.
- [x] **Component-Based Architecture**: The Next.js and React framework enforces a component-based model.
- [x] **Iterative Development**: The feature will be built in stages: text input, local PII sanitization, Gemini API call, and role display.

## Project Structure

### Documentation (this feature)

```text
specs/001-agenda-pii-handling/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Next.js App Router Structure
app/
├── (api)/
│   └── process-agenda/
│       └── route.ts         # API route for sanitizing and calling Gemini
├── _components/
│   ├── ui/                  # Reusable UI elements (buttons, inputs, text area)
│   ├── agenda/              # Agenda-specific components
│   │   ├── AgendaInput.tsx    # Text area for pasting content
│   │   └── RoleDisplay.tsx    # Component to display structured roles
│   └── layout/              # Layout components
├── _lib/
│   ├── gemini.ts            # Logic for preparing prompts and calling the Gemini API
│   └── pii.ts               # Local PII sanitizer logic (e.g., tokenizing names)
├── _hooks/                  # Custom React hooks
├── _providers/              # React context providers for session data
└── page.tsx                 # Main application page with the input form
```

**Structure Decision**: The selected structure is the standard Next.js App Router layout. This provides a clear separation of concerns between API logic (`app/(api)`), UI components (`app/_components`), and business logic (`app/_lib`), aligning with our Component-Based Architecture principle. The PII sanitization and AI interaction logic are properly isolated in the `_lib` directory.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
|           |            |                                     |
