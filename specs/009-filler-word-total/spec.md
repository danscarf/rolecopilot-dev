# Feature Specification: Ahh Counter Cumulative Filler-Word Total

**Feature Branch**: `009-filler-word-total`
**Created**: 2026-07-03
**Status**: Draft
**Input**: User description: "Add to the ahh counter feature a cumulative count of all the filler words that continuously updates, allowing the ahh counter to report on the total count of all the filler words for the meeting. The counter's values should be reduced when a row is deleted, and of course reset when the global reset happens."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Live Meeting-Wide Total (Priority: P1)

As the Ah-Counter, I want a continuously updating total of all filler words across all speakers, so I can see at a glance how the meeting is trending and quote the meeting-wide number in my report.

**Why this priority**: This is the core ask — a single running number for the whole meeting, always current.

**Independent Test**: Log filler words for two different speakers and watch the total increment on each log; verify the total equals the number of log entries.

**Acceptance Scenarios**:

1. **Given** I am on the Ahh Counter page with no entries, **When** the page loads, **Then** the meeting total displays 0.
2. **Given** filler words have been logged for any speakers, **When** I log another filler word, **Then** the meeting total increments immediately (same interaction, no refresh).
3. **Given** entries exist, **When** I use "Undo" to remove the last entry, **Then** the meeting total decrements accordingly.

---

### User Story 2 - Total in the Report (Priority: P2)

As the Ah-Counter, when I deliver my report I want the meeting-wide total included alongside the per-speaker breakdown, so I can report the overall count for the meeting.

**Why this priority**: The report is the deliverable of the role; the total must appear there, not just as a live widget.

**Independent Test**: Log entries for multiple speakers, view the report, and verify a grand-total row/summary equals the sum of all per-speaker totals.

**Acceptance Scenarios**:

1. **Given** entries exist for multiple speakers, **When** I view the report, **Then** it shows a meeting-wide grand total, and per-filler-word column totals across all speakers.
2. **Given** the log is empty, **When** I view the report, **Then** the empty state is shown (no misleading zero-total table).

---

### User Story 3 - Remove Individual Entries (Priority: P3)

As the Ah-Counter, I want to delete a specific logged entry (not just the most recent one), so that mistaken taps recorded earlier in the meeting can be corrected — and the totals must shrink to match.

**Why this priority**: The feature statement requires totals to reduce "when a row is deleted." Today only "undo last" exists; per-entry deletion is needed for corrections discovered later.

**Independent Test**: Log several entries, delete one from the middle of the list, and verify both the per-speaker counts and the meeting total decrease by exactly one.

**Acceptance Scenarios**:

1. **Given** multiple entries are logged, **When** I delete a specific entry, **Then** that entry is removed and the speaker's count, the per-word counts, and the meeting total all update immediately.
2. **Given** I delete all entries one by one, **When** the last is removed, **Then** the meeting total reads 0 and the report shows its empty state.

### Edge Cases

- The total MUST be derived from the log entries (a computed sum), never stored as an independent counter — this makes drift between the total and the entries impossible.
- Global reset ([008-global-reset](../008-global-reset/spec.md)) clears the session; the total MUST return to 0.
- Speakers with zero entries appear in the report with zero counts (existing behavior) and contribute nothing to the total.
- Rapid logging (multiple taps per second) MUST NOT produce a total that disagrees with the entry count.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Ahh Counter page MUST display a prominent meeting-wide total of all logged filler words across all speakers, updating immediately whenever an entry is added or removed.
- **FR-002**: The total MUST always equal the count of log entries in the session (derived value, single source of truth).
- **FR-003**: The report MUST include the meeting-wide grand total and per-filler-word totals across all speakers, in addition to the existing per-speaker rows.
- **FR-004**: Removing any entry — via the existing "undo last" or via per-entry deletion — MUST reduce the affected speaker's counts and the meeting total accordingly.
- **FR-005**: The system MUST provide a way to delete an individual logged entry (e.g., a recent-entries list with a per-entry delete control, mirroring the Timer report pattern).
- **FR-006**: The total and all counts MUST reset to zero when the session data is cleared (session reset or global reset per spec 008).

### Key Entities

No new entities. The total is computed from the existing `AhCounterLogEntry` list in `AhhCounterSession`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After any sequence of 100 mixed add/undo/delete operations, the displayed total exactly equals the number of remaining log entries (zero drift).
- **SC-002**: The total visibly updates within the same interaction (perceived as instant; no refresh or navigation needed).
- **SC-003**: The report's grand total equals the sum of its per-speaker totals in 100% of cases.
