# Feature Specification: Smart Timer Module

**Feature Branch**: `002-smart-timer-module`  
**Created**: 2025-12-20
**Status**: Draft  
**Input**: User description: "Smart Timer Module from tm-assistant-prd.md"

## Clarifications

### Session 2025-12-20
- Q: How will the system log timer events for debugging and analytics without collecting PII? → A: Log anonymized timer events
- Q: What should happen if a timer is left running for an exceptionally long time (e.g., over an hour)? → A: Stop timer and warn.
- Q: What is the expected number of speakers (and therefore timer sessions) in a typical meeting? → A: Typical RoleCopilot meetings have 10-15 speakers.
- Q: How should the system handle invalid user input for custom timer presets (e.g., yellow time before green time)? → A: Reject input and provide specific feedback.
- Q: Should a history of past timer sessions be explicitly out of scope for this feature? → A: History is explicitly out of scope.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Accurate Speech Timing (Priority: P1)

As a meeting Timer, I want to accurately track and signal speaking times for different speech types without constantly looking at a timer, so that I can remain engaged with the speaker and the audience.

**Why this priority**: This is the core functionality of the Timer role in RoleCopilot. Failure to perform this task accurately disrupts the meeting flow and provides incorrect feedback to speakers.

**Independent Test**: The timer can be set for a standard speech, started, and will correctly signal green, yellow, and red at the appropriate times. The final logged time is accurate.

**Acceptance Scenarios**:

1. **Given** I have selected the "Standard Speech (5-7 mins)" preset, **When** I start the timer, **Then** the background turns green at 5 minutes, yellow at 6 minutes, and red at 7 minutes.
2. **Given** the timer is running, **When** a color change threshold is reached, **Then** the device vibrates once.
3. **Given** the timer is running, **When** I press the "Stop" button, **Then** the timer stops and the elapsed time is recorded.
4. **Given** a time has been recorded, **When** I enter a speaker's name, **Then** the recorded time is associated with that speaker.
5. **Given** I need to time a non-standard event, **When** I select the "Custom Input" option, **Then** I can manually enter the green, yellow, and red time thresholds.

### Edge Cases

- What happens if the user accidentally closes the browser tab or the app crashes? The system should discard the current timer state and prompt the user to start a new session upon recovery.
- How does the system handle a timer that is left running for an exceptionally long time (e.g., over an hour)? The system MUST automatically stop the timer after a predefined maximum duration (e.g., 2 hours) and provide a visual warning to the user.
- What happens if the user's device does not support haptic feedback? The visual cues should still function correctly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide pre-defined timer presets for standard RoleCopilot speeches, as defined in the official Timer Script:
    - `Table Topics`: Green @ 1:00, Yellow @ 1:30, Red @ 2:00.
    - `Ice Breaker`: Green @ 4:00, Yellow @ 5:00, Red @ 6:00.
    - `Standard Speech (5-7 min)`: Green @ 5:00, Yellow @ 6:00, Red @ 7:00.
    - `Evaluation (2-3 min)`: Green @ 2:00, Yellow @ 2:30, Red @ 3:00.
- **FR-002**: System MUST allow users to define a custom timer with manual thresholds for green, yellow, and red signals.
- **FR-003**: System MUST change the entire viewport background color to signal green, yellow, and red time milestones.
- **FR-004**: System MUST provide haptic feedback (vibration) on the device when a time milestone is reached, if the device supports it.
- **FR-005**: System MUST allow the user to start, stop, and reset the timer.
- **FR-006**: System MUST automatically log the final duration when the timer is stopped.
- **FR-007**: System MUST allow the user to associate a logged time with a specific speaker's name.
- **FR-008**: The timer interface MUST be designed for low-attention interaction, with large, easily tappable controls.
- **FR-009**: The UI MUST have a dark mode default to avoid distracting the audience.
- **FR-010**: Core timer functionality MUST be available offline.
- **FR-011**: System MUST log anonymized timer events (e.g., "timer_started", "timer_stopped", "preset_used") without any user-identifiable information for analytics and debugging.
- **FR-012**: System MUST automatically stop any running timer after a predefined maximum duration (e.g., 2 hours) and provide a visual warning to the user.
- **FR-013**: System MUST reject invalid custom timer presets (e.g., yellow time before green time) and provide specific, actionable feedback to the user.
- **FR-014**: System MUST automatically determine and display if a logged time is "within time" based on the selected preset's grace period (30 seconds for speeches/evaluations, 15 seconds for Table Topics).
- **FR-015**: System SHOULD provide a "Timer's Report" view that mimics the structure of the Timer Log PDF, grouping logged times by speech type.
- **FR-016**: System SHOULD display the official Timer's script on the timer page for easy reference.

### Key Entities *(include if feature involves data)*

- **Timer Preset**: Represents a pre-defined set of time milestones.
    - `name`: string (e.g., "Standard Speech")
    - `type`: 'Speech', 'Evaluation', or 'Table Topics'
    - `greenTime`: number (seconds)
    - `yellowTime`: number (seconds)
    - `redTime`: number (seconds)
    - `gracePeriod`: { under: number, over: number } (seconds)
- **Timer Session**: Represents a single timed event.
    - `speakerName`: string | null
    - `duration`: number (seconds)
    - `presetName`: string
    - `timeRequirement`: string (e.g., "5-7 min")
    - `isWithinTime`: boolean

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of users can start, stop, and log a speech time without errors on their first attempt.
- **SC-002**: The time taken to select a preset and start the timer is less than 5 seconds.
- **SC-003**: The time taken to stop the timer, assign a speaker, and save the log is less than 10 seconds.
- **SC-004**: The generated timer signals (visual and haptic) are accurate to within 1 second of the configured time.
- **SC-005**: In a user survey, at least 80% of users report feeling "more present" or "less distracted" while using the Smart Timer compared to a manual stopwatch.

## Assumptions

- Haptic feedback is a progressive enhancement and may not be available on all devices. The core functionality of visual signals will always be present.
- The application is intended for use in a single browser tab at a time. The behavior of running multiple timers in different tabs is undefined.
- Typical RoleCopilot meetings have 10-15 speakers, implying a similar number of timer sessions per meeting.

## Out of Scope

- Retention or display of a history of past timer sessions.
