# Data Model: Agenda PII Handling

This document defines the in-memory data structures used by the Agenda PII Handling feature. These models are not persisted to any database, in compliance with the feature's security requirements.

## 1. `AssignedRole`

Represents a single role extracted from the meeting agenda, along with the member assigned to it. This is the primary data structure used to represent the processed agenda information.

**Fields**:

- `role` (`string`): The title of the meeting role.
  - **Example**: `"Toastmaster"`, `"Speaker 1"`, `"Table Topics Master"`
  - **Validation**: Must be a non-empty string.

- `assignee` (`string` | `null`): The name of the member assigned to the role. This data is considered PII and must only be held in memory for the duration of the user session.
  - **Example**: `"Dan S."`, `"Jane Doe"`
  - **Validation**: Can be a string or null if no assignee is found for a role.

- `id` (`string`): A unique identifier for the list item, generated on the client-side for stable rendering in React.
  - **Example**: `"c9e8e6e0-6a3c-4b3a-9e4a-7f1a9e9e9e9e"`
  - **Validation**: Must be a unique string (e.g., UUID).

**State Transitions**:

1.  **Initialization**: An array of `AssignedRole` objects is created by the `process-agenda` API route after receiving the structured JSON from the Gemini AI and re-inserting the PII.
2.  **Transmission**: The array is sent to the client as the API response.
3.  **Client-side Hydration**: The data is loaded into the client's React state (e.g., in a Context provider).
4.  **Termination**: The data is cleared from memory when the user session ends (e.g., component unmounts, tab is closed, or a "clear" action is dispatched).

**Example (JSON representation)**:

```json
[
  {
    "id": "1",
    "role": "Toastmaster",
    "assignee": "John Doe"
  },
  {
    "id": "2",
    "role": "Speaker 1",
    "assignee": "Jane Smith"
  },
  {
    "id": "3",
    "role": "General Evaluator",
    "assignee": null
  }
]
```