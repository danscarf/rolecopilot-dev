# Feature Specification: Global Reset

**Feature Branch**: `007-global-reset`
**Created**: 2026-07-03
**Status**: Draft
**Input**: User description: "A global 'reset all' button that nukes all the data across all tabs once a user clicks through a secondary 'confirm' button, pop up or whatever is the best practice."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reset All Meeting Data (Priority: P1)

As a meeting host, after a meeting ends I want to clear all recorded data across every module in one action, so the next meeting starts from a clean slate without me visiting each page individually.

**Why this priority**: This is the entire feature. Today each module must be cleared separately (and some, like the Timer log, only via per-entry deletes), which is tedious between meetings.

**Independent Test**: Populate data in Timer, Ahh Counter, and Grammarian; trigger the global reset; confirm; verify every module shows its empty state.

**Acceptance Scenarios**:

1. **Given** data exists in one or more modules, **When** I activate the global "Reset All" control, **Then** I am shown a confirmation step that lists what will be deleted and warns the action cannot be undone.
2. **Given** the confirmation is displayed, **When** I confirm, **Then** all module data is cleared and every module displays its empty state without a manual page refresh.
3. **Given** the confirmation is displayed, **When** I cancel (or dismiss the dialog), **Then** no data is changed.
4. **Given** I have just reset, **When** I navigate to any module page, **Then** no residual data from before the reset is visible.

### Edge Cases

- Reset while a timer is running: the running timer MUST be stopped and reset to 00:00.
- Reset with no data present: the flow still completes successfully (confirmation may note there is nothing to clear, but must not error).
- Multiple browser tabs open on different modules: the tab where reset was confirmed reflects it immediately; other open tabs MUST NOT resurrect cleared data (e.g., by writing stale in-memory state back to storage). Live cross-tab refresh is a nice-to-have, not required.
- Reset MUST NOT sign the user out or clear authentication/session state — only meeting/module data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a globally accessible "Reset All" control reachable from any page (e.g., in the navigation bar or a menu within it).
- **FR-002**: Activating the control MUST present a secondary confirmation step (an in-app modal dialog is preferred over the browser-native `confirm()` for styling and accessibility) before any data is deleted. The confirm action MUST be visually distinct as destructive, and Cancel MUST be the default/safe action.
- **FR-003**: The confirmation MUST state that the action is irreversible and enumerate the scope: Timer logged sessions, Ahh Counter session (speakers and filler-word log), Grammarian session (speakers, Word of the Day, all observations), and processed Agenda results.
- **FR-004**: On confirm, the system MUST delete all module data, covering both persisted browser storage (`timer-logged-times`, `ahh-counter-session`, `grammarian-session`, and any keys added by future modules) and in-memory provider state (e.g., agenda results, running timer, selected speakers/presets).
- **FR-005**: All module UIs MUST reflect the cleared state immediately, with no manual refresh required.
- **FR-006**: The reset MUST NOT affect authentication state, user account data, or app settings unrelated to meeting data.
- **FR-007**: Future modules that persist meeting data MUST be included in the global reset (implementation should make the set of clearable stores easy to extend, e.g., a shared registry of storage keys/reset hooks).

### Key Entities

No new entities. This feature operates on existing session data owned by the Timer, Ahh Counter, Grammarian, and Agenda modules.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After a confirmed reset, 100% of module pages display their empty states and no module storage keys remain in browser storage.
- **SC-002**: The reset (confirm click → all UIs cleared) completes in under 1 second.
- **SC-003**: A user can complete the full reset flow from any page in under 10 seconds without consulting documentation.
- **SC-004**: Zero data loss reports from accidental resets attributable to a missing or unclear confirmation step (the destructive action always requires two deliberate clicks).
