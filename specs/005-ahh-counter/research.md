# Research: Ahh Counter

This document outlines the research findings for the "Ahh Counter" feature, as part of the Phase 0 planning process.

## Dependency Versions

Based on the `package.json` file, the following versions of the primary dependencies have been confirmed:

- **React**: `19.2.3`
- **Next.js**: `16.1.0`
- **Tailwind CSS**: `^4`

## Testing Framework

### Finding

A review of the `package.json` file reveals that **no testing framework (e.g., Jest, React Testing Library) is currently installed or configured in this project.**

The `GEMINI.md` file mentions an `npm test` command, but this script is not present in `package.json`.

### Impact

This is a **critical issue** and a direct violation of the **"Test-Driven Development (NON-NEGOTIABLE)"** principle outlined in the project constitution. No feature development can proceed until a testing framework is in place.

### Decision

**A testing framework MUST be installed and configured before any implementation work on the Ahh Counter feature.**

- **Chosen Frameworks**: Jest and React Testing Library.
- **Rationale**: This is the industry-standard and recommended setup for testing Next.js applications. It provides a robust environment for unit, integration, and component testing.
- **Alternatives Considered**: 
    - **Cypress/Playwright**: These are excellent for end-to-end testing, but they are not a replacement for component-level testing with Jest and React Testing Library. They can be added later if needed.
    - **Vitest**: A modern alternative to Jest, but Jest has broader community support and is more established in the Next.js ecosystem.

The immediate next step is to set up this testing environment. The steps for this are outlined in `quickstart.md`.
