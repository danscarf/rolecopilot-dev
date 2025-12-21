# Feature Specification: Agenda PII Handling

**Feature Branch**: `002-agenda-pii-handling`
**Created**: 2025-12-20
**Status**: Draft
**Input**: User description: "We need to account for security and privacy. For example, one of th main requirements is that we will be use the weekly meeting agenda pdf which specifies key meeting roles such as who is the toasmaster, who is speaking, who is the tabletopics master, by partial name. We to not want to store that PII anywhere if we can avoid it and we do not want the information sent to an llm provider to be used for training"

## Clarifications

### Session 2025-12-20
- Q: How should the system log its PII handling actions for monitoring and auditing, without logging the PII itself? → A: Log anonymized events
- Q: Are there any specific data protection regulations (like GDPR or CCPA) that the system must adhere to? → A: No specific regulations initially.
- Q: What is the expected behavior if the external LLM API call fails? → A: Gracefully inform user and revert to manual.
- Q: What is the expected average and maximum size of the agenda PDFs, and the number of roles/members listed? → A: Typical toastmasters agendas are around 720 words.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Agenda Processing (Priority: P1)

As a system administrator, I want to ensure that when the application processes a meeting agenda PDF, any Personally Identifiable Information (PII) is handled securely, not stored unnecessarily, and not shared with third-party AI services for training purposes, so that we protect member privacy and comply with data protection principles.

**Why this priority**: Protecting member privacy is a critical non-functional requirement. Mishandling of PII could lead to a loss of trust and potential legal issues.

**Independent Test**: An agenda PDF containing names is processed by the system. A check of the system's data stores (local and remote) and network traffic confirms that the names are not persisted and not sent to any external LLM for training.

**Acceptance Scenarios**:

1. **Given** a user uploads a meeting agenda PDF containing member names, **When** the system processes the agenda to identify roles, **Then** the extracted names are only held in memory for the duration of the session.
2. **Given** the system processes an agenda, **When** data is sent to an external Large Language Model (LLM) for analysis (e.g., for summarizing roles), **Then** any fields containing names or other PII are stripped or anonymized before being sent.
3. **Given** a user session ends, **When** the application is closed, **Then** all in-memory data derived from the agenda PDF is cleared.
4. **Given** an agenda is processed, **Then** no part of the original PDF or the extracted PII is written to a permanent log file or database.

### Edge Cases

- What if the PDF is password-protected or encrypted? The system should gracefully fail and inform the user that it cannot process the file.
- What if the PDF format is unusual or does not follow a standard structure? The system should attempt to extract the information, and if it fails, it should notify the user and allow for manual entry of roles.
- How does the system differentiate between a partial name (e.g., "Dan S.") and a full name if both appear in the PDF?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST be able to accept a PDF file of a meeting agenda as input.
- **FR-002**: System MUST parse the PDF to extract key meeting roles and the names of the members assigned to them.
- **FR-003**: System MUST NOT store the extracted names or any other PII from the agenda in any persistent storage (database, log files, etc.).
- **FR-004**: System MUST NOT send any PII extracted from the agenda to any third-party service, including LLM providers, in a way that allows the data to be used for training or stored.
- **FR-005**: If an LLM is used for processing, the API calls must be configured to opt out of any data sharing or training programs.
- **FR-006**: All PII must be cleared from the application's memory at the end of each user session.
- **FR-007**: System MUST log anonymized events related to PII handling (e.g., "PII field 'name' stripped from LLM request") to provide an audit trail without logging the PII itself.
- **FR-008**: When encountering both a partial name (e.g., "Dan S.") and a full name (e.g., "Dan Scarf") for the same role, the system MUST prioritize and use the full name.
- **FR-009**: If an external LLM API call fails, the system MUST gracefully inform the user about the failure and provide an option to proceed with manual entry of roles.

### Key Entities *(include if feature involves data)*

- **Meeting Role**: Represents a role in the meeting (e.g., Toastmaster, Speaker, Evaluator).
- **Assigned Member**: Represents the person assigned to a role, containing a temporary, in-memory representation of their name.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of PII extracted from uploaded agendas is cleared from memory upon session termination.
- **SC-002**: A third-party security audit of network traffic confirms that zero PII is transmitted to external LLM providers for training purposes.
- **SC-003**: The time to process an agenda PDF and extract roles is less than 15 seconds.
- **SC-004**: In the event of a parsing failure, the system informs the user within 5 seconds.

## Assumptions

- The uploaded agenda PDF is text-based and not a scanned image.
- The structure of the agenda PDF is reasonably consistent from week to week.
- The primary goal of the LLM interaction is to extract role information, not to analyze the content of speeches or evaluations.
- Typical Toastmasters meeting agendas are around 720 words.