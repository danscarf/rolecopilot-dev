<!--
Sync Impact Report

- Version change: None -> 1.0.0
- Added sections:
  - Core Principles
  - Technology Stack
  - Development Workflow
  - Governance
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Confirm the ratification date. Using 2025-12-20 as a placeholder.
-->
# RoleCopilot Constitution

## Core Principles

### I. Specification-First
Every feature MUST begin with a clear specification. This ensures that all stakeholders have a shared understanding of the goals and requirements before implementation begins. The specification MUST include user stories, acceptance criteria, and success metrics.

### II. UI-First Prototyping
As a user-facing application, the user interface is critical. A UI prototype MUST be created and approved before significant backend development. This allows for early feedback and iteration on the user experience.

### III. Test-Driven Development (NON-NEGOTIABLE)
All new functionality MUST be developed using a Test-Driven Development (TDD) approach. Tests MUST be written before the implementation, and the implementation is complete only when all tests pass. This ensures code quality, maintainability, and correctness.

### IV. Component-Based Architecture
The application MUST be built using a component-based architecture. Components SHOULD be reusable, self-contained, and independently testable. This promotes a modular and scalable codebase.

### V. Iterative Development
The project will be developed iteratively. Each iteration SHOULD deliver a small, valuable increment of functionality. This allows for continuous feedback and reduces the risk of building the wrong product.

## Technology Stack

The following technologies are approved for this project:
- **Frontend**: React, Next.js
- **Styling**: Tailwind CSS

Any deviation from this stack requires a formal exception request and approval.

## Development Workflow

The development workflow is as follows:
1.  **Specification**: Create a detailed specification for the feature.
2.  **Prototyping**: Build a UI prototype based on the specification.
3.  **Implementation**: Implement the feature using Test-Driven Development.
4.  **Review**: All code MUST be peer-reviewed before being merged.
5.  **Deployment**: Once approved, the feature is deployed.

## Governance

This constitution is the supreme governing document for this project. All development practices and decisions MUST comply with the principles outlined herein. Amendments to this constitution require a formal proposal, review, and approval process. All pull requests and reviews MUST verify compliance with this constitution.

**Version**: 1.0.0 | **Ratified**: 2025-12-20 | **Last Amended**: 2025-12-20
