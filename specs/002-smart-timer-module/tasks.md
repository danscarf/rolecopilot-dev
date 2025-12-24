# Implementation Tasks: Smart Timer Module

This document outlines the development tasks required to implement the "Smart Timer Module" feature.

## Phase 1: Foundational Timer Logic & State

1.  **T018**: [x] Create a new React context (`app/_providers/TimerProvider.tsx`) to manage the timer's state, including `isRunning`, `elapsedTime`, current color signal, selected preset, and a list of logged times.
2.  **T019**: [x] Implement the core timer engine within the `TimerProvider` using `setInterval` or a similar mechanism to handle starting, stopping, resetting, and updating the elapsed time.
3.  **T020**: [x] Define the preset data structure and create a small library file (`app/_lib/presets.ts`) to store the pre-defined timer presets, including `type` and `gracePeriod` for each.
4.  **T021**: [x] Create a haptic feedback service (`app/_lib/haptics.ts`) that safely checks for device support and triggers vibration on time milestones.

## Phase 2: UI Components

5.  **T022**: [x] Create the main timer display component (`app/_components/timer/TimerDisplay.tsx`). This will be the full-screen view that changes color based on the timer state and shows the current time.
6.  **T023**: [x] Create the timer controls component (`app/_components/timer/TimerControls.tsx`) with large, easily tappable "Start", "Stop", and "Reset" buttons.
7.  **T024**: [x] Create a preset selector component (`app/_components/timer/PresetSelector.tsx`) to allow users to select from pre-defined presets or a "Custom" option.
8.  **T025**: [x] Create a custom input component (`app/_components/timer/CustomInput.tsx`) that appears when the "Custom" preset is selected, including input validation for time thresholds.
9.  **T026**: [x] Create a log entry component (`app/_components/timer/LogEntry.tsx`) to display the list of logged times, allow users to associate a speaker name with a time, and show the "within time" status.
10. **T033**: [x] Create a "Timer's Report" component (`app/_components/timer/TimerReport.tsx`) that displays the logged times grouped by speech type.
11. **T034**: [x] Create a "Timer Script" component (`app/_components/timer/TimerScript.tsx`) that displays the official Timer's script for easy reference.

## Phase 3: Integration & Page Creation

12. **T027**: [x] Create a new page route for the timer feature at `app/timer/page.tsx`.
13. **T028**: [x] Integrate all the new timer components into `app/timer/page.tsx` and wrap them with the `TimerProvider` to provide shared state.
14. **T029**: [x] Add a navigation link from the main home page (`app/page.tsx`) to the new `/timer` page.

## Phase 4: Advanced Features & Polish

15. **T030**: [x] Implement offline support for the `/timer` page and its core assets using a service worker or other appropriate caching strategy to fulfill `FR-010`.
16. **T031**: [x] Create a simple, anonymized logging service (`app/_lib/analytics.ts`) to send events like "timer_started" and "preset_used" as per `FR-011`.
17. **T032**: [x] Implement the maximum duration auto-stop feature within the `TimerProvider` to stop the timer after 2 hours (`FR-012`).
