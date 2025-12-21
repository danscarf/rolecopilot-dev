# Feature Specification: Agenda PII Handling

**Feature Branch**: `001-agenda-pii-handling`
**Created**: 2025-12-20
**Status**: Draft
**Input**: User description: "We need to account for security and privacy. For example, one of th main requirements is that we will be use the weekly meeting agenda, which is often copy-pasted as unstructured text, which specifies key meeting roles such as who is the toasmaster, who is speaking, who is the tabletopics master, by partial name. We to not want to store that PII anywhere if we can avoid it and we do not want the information sent to an llm provider to be used for training"

## Clarifications

### Session 2025-12-21
- Q: The spec is centered on processing PDF files. What should be the primary input method for agenda data? → A: Pasted unstructured text or HTML
- Q: Once the unstructured text is received, what is the primary mechanism for converting it into structured data? → A: An external AI service (e.g., Gemini)
- Q: Regarding privacy, when should Personally Identifiable Information (PII) be sanitized or removed from the input text? → A: Sanitize PII **before** sending the text to the AI service.
- Q: The input mentions bypassing bot protection like Cloudflare. How should the system acquire the source text? → A: The user manually copies and pastes the text into the application.

### Session 2025-12-20
- Q: How should the system log its PII handling actions for monitoring and auditing, without logging the PII itself? → A: Log anonymized events
- Q: Are there any specific data protection regulations (like GDPR or CCPA) that the system must adhere to? → A: No specific regulations initially.
- Q: What is the expected behavior if the external LLM API call fails? → A: Gracefully inform user and revert to manual.
- Q: What is the expected average and maximum size of the agenda PDFs, and the number of roles/members listed? → A: Typical RoleCopilot meeting agendas are around 720 words.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Agenda Processing (Priority: P1)

As a system administrator, I want to ensure that when the application processes pasted agenda text, any Personally Identifiable Information (PII) is handled securely, not stored unnecessarily, and not shared with third-party AI services for training purposes, so that we protect member privacy and comply with data protection principles.

**Why this priority**: Protecting member privacy is a critical non-functional requirement. Mishandling of PII could lead to a loss of trust and potential legal issues.

**Independent Test**: Agenda text containing names is processed by the system. A check of the system's data stores (local and remote) and network traffic confirms that the names are not persisted and not sent to any external LLM for training.

**Acceptance Scenarios**:

1. **Given** a user pastes agenda text containing member names, **When** the system processes the agenda to identify roles, **Then** the extracted names are only held in memory for the duration of the session.
2. **Given** the system processes an agenda, **When** data is sent to an external Large Language Model (LLM) for analysis (e.g., for summarizing roles), **Then** any fields containing names or other PII are stripped or anonymized before being sent.
3. **Given** a user session ends, **When** the application is closed, **Then** all in-memory data derived from the agenda text is cleared.
4. **Given** an agenda is processed, **Then** no part of the original text or the extracted PII is written to a permanent log file or database.

### Edge Cases

- What if the pasted text is empty or contains no relevant information? The system should inform the user that it could not find any roles.
- What if the text format is unusual or does not follow a standard structure? The system should attempt to extract the information, and if it fails, it should notify the user and allow for manual entry of roles.
- How does the system differentiate between a partial name (e.g., "Dan S.") and a full name if both appear in the text?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST be able to accept pasted unstructured text or HTML as input.
- **FR-002**: System MUST use an AI service to parse the unstructured text and extract key meeting roles and the names of the members assigned to them.
- **FR-003**: System MUST NOT store the extracted names or any other PII from the agenda in any persistent storage (database, log files, etc.).
- **FR-004**: System MUST NOT send any PII extracted from the agenda to any third-party service, including LLM providers, in a way that allows the data to be used for training or stored.
- **FR-005**: If an LLM is used for processing, the API calls must be configured to opt out of any data sharing or training programs.
- **FR-006**: All PII must be cleared from the application's memory at the end of each user session.
- **FR-007**: System MUST log anonymized events related to PII handling (e.g., "PII field 'name' stripped from LLM request") to provide an audit trail without logging the PII itself.
- **FR-008**: When encountering both a partial name (e.g., "Dan S.") and a full name (e.g., "Dan Scarf") for the same role, the system MUST prioritize and use the full name.
- **FR-009**: If an external LLM API call fails, the system MUST gracefully inform the user about the failure and provide an option to proceed with manual entry of roles.

### Security Requirements

-   **FR-010: LLM Endpoint Authentication**: All requests to the LLM endpoint MUST be authenticated to ensure that only authorized components of the system can access it.
-   **FR-011: Rate Limiting and Cost Control**: The system MUST implement rate limiting and other cost-control measures on the LLM endpoint to prevent financial abuse and ensure availability.
-   **FR-012: Input Validation and Sanitization**: All data sent to the LLM endpoint, including the pasted text and manual user inputs, MUST be strictly validated and sanitized to prevent prompt injection, jailbreaking attempts, and other malicious inputs.
-   **FR-013: Secure by Default**: The system's design and configuration MUST follow the principle of least privilege.
-   **FR-014: Dependency Management**: All third-party libraries and dependencies MUST be from trusted sources and be actively monitored for vulnerabilities.
-   **FR-015: Secure Error Handling**: Error messages returned to the user or logged by the system MUST NOT expose sensitive information about the system's internal workings or data.
-   **FR-016: Security Standards Review**: As part of the technical planning for this feature, a review of relevant security standards, such as the [NIST AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/itl/ai-risk-management-framework) and the [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/), MUST be conducted. The implementation plan MUST document which best practices are adopted and provide justification for any that are not.
-   **FR-017: Threat Modeling**: A threat model for the 'Agenda PII Handling' feature MUST be created during the planning phase to identify and mitigate potential security risks.

### Key Entities *(include if feature involves data)*

- **Meeting Role**: Represents a role in the meeting (e.g., Toastmaster, Speaker, Evaluator).
- **Assigned Member**: Represents the person assigned to a role, containing a temporary, in-memory representation of their name.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of PII extracted from pasted agendas is cleared from memory upon session termination.
- **SC-002**: A third-party security audit of network traffic confirms that zero PII is transmitted to external LLM providers for training purposes.
- **SC-003**: The time to process agenda text and extract roles is less than 15 seconds.
- **SC-004**: In the event of a parsing failure, the system informs the user within 5 seconds.

## Assumptions

- The pasted agenda text is reasonably structured.
- The structure of the agenda is reasonably consistent from week to week.
- The primary goal of the LLM interaction is to extract role information, not to analyze the content of speeches or evaluations.
- Typical Toastmasters meeting agendas are around 720 words.