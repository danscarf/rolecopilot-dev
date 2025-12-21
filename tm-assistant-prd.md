# Product Requirements Document: RoleCopilot Digital Companion

**Project Name:** RoleCopilot (Working Title)
**Version:** 0.1.0
**Status:** Draft
**Last Updated:** 2025-12-18

## 1. Executive Summary
**Problem:** The administrative burden of RoleCopilot meeting roles (Timer, Ah-Counter, Grammarian) creates high friction for members. Physical note-taking and manual calculation distract users from the primary goal of the meeting: active listening and public speaking practice.

**Solution:** A web application that acts as a "Heads-Up Display" (HUD). It minimizes cognitive load through large-touch interfaces, haptic feedback, and automated report generation, allowing the user to maintain eye contact with the speaker.

**Success Metrics:**
* Reduction in time spent compiling end-of-meeting reports (Target: <10 seconds).
* User error reduction in timing sequences.
* Qualitative feedback: Users report feeling "more present" during speeches.

## 2. Design Principles
* **Low-Attention Interaction:** UI elements must be large and distinguishable by peripheral vision or touch to prevent "heads-down" usage.
* **Dark Mode Default:** Interface must not emit excessive light that distracts the room during speeches.
* **Offline Capability:** Core functionality must persist and operate without an active internet connection.
* **Ephemeral Data:** Data is session-based by default to prioritize privacy and reduce storage complexity.

## 3. Functional Requirements

### 3.1 Module: Smart Timer
**User Story:** As a Timer, I want to signal speaking times accurately without constantly checking my watch, so I can listen to the speech.

* **FR-3.1.1: Time Presets**
    * System must provide standard RoleCopilot presets:
        * Icebreaker (4-6 mins)
        * Standard Speech (5-7 mins)
        * Table Topics (1-2 mins)
        * Evaluation (2-3 mins)
        * Custom Input
* **FR-3.1.2: Visual Signaling**
    * The entire viewport background must change color at threshold milestones (Green, Yellow, Red).
    * Colors must meet WCAG accessibility standards for contrast (or provide text labels).
* **FR-3.1.3: Haptic Feedback**
    * Device must vibrate at color change events (subject to device browser capabilities).
* **FR-3.1.4: Session Logging**
    * System must auto-log the duration upon "Stop."
    * User must be able to assign a specific Speaker Name to the log entry.

### 3.2 Module: Ah-Counter (The "Clicker")
**User Story:** As an Ah-Counter, I want to track filler words by touch, so I do not have to look away from the speaker.

* **FR-3.2.1: Interaction Grid**
    * Interface shall display a 2x3 or 2x2 grid of large tap targets.
    * Categories: "Ah/Um", "So", "Like", "Double Clutch", "Long Pause".
* **FR-3.2.2: Multi-Speaker Support**
    * User must be able to switch active "Sessions" (Speakers) quickly without losing previous data.
* **FR-3.2.3: Report Generation**
    * System must aggregate counts into a natural language script.
    * *Example Output:* "Speaker A used 'Um' 3 times. Speaker B had 0 filler words."

### 3.3 Module: Grammarian
**User Story:** As a Grammarian, I want to quickly capture notable quotes and word usage without struggling to format a written list.

* **FR-3.3.1: Quick Capture Input**
    * Persistent text input field fixed to the bottom of the viewport.
* **FR-3.3.2: Tagging Taxonomy**
    * Captured text must be taggable as "Commendation" (Good Usage) or "Recommendation" (Needs Improvement).
* **FR-3.3.3: Word of the Day (WOTD) Tracker**
    * Dedicated increment counter for WOTD usage.
* **FR-3.3.4: List Sorting**
    * Report view must group entries by Speaker and by Tag (Commendations vs. Recommendations).

## 4. Technical Constraints & Architecture

### 4.1 Web Architecture
* **Framework:** Next.js (App Router) with Tailwind CSS.
* **State Management:** Local state management for session persistence (prevent data loss on screen rotation or accidental refresh).
* **Storage:** `localStorage` for temporary session data.
* **PDF Processing:** Browser-side parsing using a library like PDF.js.

### 4.2 Backend
* **Service Layer:** Next.js Route Handlers (API routes) will be used as the primary service layer. This keeps the application self-contained but allows for future expansion to an external backend if needed.

### 4.3 Deployment
* **Target:** The application should be "Vercel-ready" and also support standalone builds using Docker for flexible hosting options.

### 4.4 Non-Functional Requirements
* **Performance:** App Time-to-Interactive (TTI) must be under 1.5 seconds.
* **Responsiveness:** Layout must adapt to standard desktop and mobile viewports (375px width min).
* **Privacy:** No PII (Personally Identifiable Information) or audio recordings shall be sent to any external server. All processing is client-side. The strict PII handling requirements outlined in the 'Agenda PII Handling' feature spec MUST be followed.
* **Security:** The application must be designed to protect against common web vulnerabilities, and all interactions with external services (like LLMs) must be secured to prevent abuse and financial exploitation.

## 5. Future Scope (Post-MVP)
* **v1.1:** Export reports to PDF/Email.
* **v1.2:** Historical tracking for club officers (requires authentication).
* **v1.3:** Integration with club management software (e.g., EasySpeak, FreeToastHost) via API.