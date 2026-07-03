# Feature Specification: Practice Mode

**Feature Branch**: `010-practice-mode`
**Created**: 2026-07-03
**Status**: Draft
**Input**: User description: "Add a 'practice mode' that people can use to practice their speaking. When in practice mode, a user practices a speech, and their performance is analyzed and scored after they're done. This will require AI credits, so the feature must be behind a sign-up/login session. Additional use case (VP of Public Relations): conduct short mock interviews at job fairs (one or two questions), analyze the candidate through the lens of the Toastmasters meeting roles (Ah-Counter, Grammarian, Timer), give them a report, and use it as a soft recruiting pitch — 'come join a meeting as a guest and see if it fits.'"

**Clarifications (2026-07-03)**:
- Results presentation: role-style panels on screen **and** a downloadable report.
- Capture: record audio in the browser and send the audio to AI for transcription + analysis (browser speech APIs strip disfluencies like "um/uh", which would defeat filler-word counting).
- Mock interview mode is in scope for v1, in this same spec.
- The downloadable report MUST respect and utilize Toastmasters branding assets and guidelines as documented in `02330-001-0001-brand-manual.pdf` (Brand Manual v2.0, Rev. 07/2026). A copy lives at the repo root but is intentionally not committed (`.gitignore` excludes `*.pdf`). To obtain it: direct download at <https://content.toastmasters.org/image/upload/02330-001-0001-brand-manual.pdf>, or — for the latest revision — log in and get it from the Toastmasters Brand Portal at <https://www.toastmasters.org/resources/brand-portal> (the canonical breadcrumb if the direct link goes stale).
- Access: login required; no per-user usage quotas in v1.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Practice a Speech and Get Analyzed (Priority: P1)

As a member, I want to record a practice speech and receive an automated analysis and score, so I can improve between meetings without needing other members to evaluate me.

**Why this priority**: This is the core loop of the feature — record, analyze, score. Everything else builds on it.

**Independent Test**: Sign in, start a practice session, record a short speech, stop, and receive on-screen results across all analysis dimensions plus an overall score.

**Acceptance Scenarios**:

1. **Given** I am signed in and on the Practice page, **When** I choose a speech type (reusing the existing timer presets, including Custom) and optionally set a Word of the Day, **Then** I can start recording with a clear recording indicator and elapsed-time display.
2. **Given** I am recording, **When** I stop, **Then** the audio is submitted for analysis and I see a progress state until results arrive.
3. **Given** analysis completes, **When** I view the results, **Then** I see role-style panels mirroring the meeting roles: Ah-Counter (filler-word total, breakdown by type, per-minute rate), Grammarian (improper usages with suggestions, outstanding words/phrases, Word of the Day usage if one was set), and Timer (duration, target range, within-time verdict using the preset's grace periods).
4. **Given** analysis completes, **Then** I also receive an overall score (0–100), speaking pace (words per minute), top strengths, and top improvement suggestions, phrased in the encouraging, constructive tone of a Toastmasters evaluation.
5. **Given** I am not signed in, **When** I navigate to the Practice page, **Then** I am redirected to login, consistent with the other pages.

---

### User Story 2 - Download a Branded Report (Priority: P2)

As a user who just completed a practice session, I want to download or print a summary report of my results, so I have a takeaway record — and, at a job fair, something to physically hand a candidate.

**Why this priority**: The report is the shareable artifact of the analysis and the vehicle for the recruiting use case; it must look professionally Toastmasters-branded.

**Independent Test**: Complete an analysis, download the report, and verify its content matches the on-screen results and its design complies with the brand checklist below.

**Acceptance Scenarios**:

1. **Given** results are displayed, **When** I choose "Download report", **Then** I receive a printable document containing the session date, speech type, all analysis dimensions, the overall score, and the strengths/improvement suggestions.
2. **Given** the report is rendered, **Then** it complies with the Toastmasters Brand Manual (`02330-001-0001-brand-manual.pdf` — see Clarifications for where to obtain it):
   - **Colors**: only the brand palette — Loyal Blue `#004165` and True Maroon `#772432` (headers/backgrounds), Cool Gray `#A9B2B1` (backgrounds), Happy Yellow `#F2DF74` (accents/highlights only), plus black/white; gradients only per the manual (e.g., Loyal Blue `#004165` → Blissful Blue `#006094`).
   - **Typography**: Gotham for headlines/subheads and Myriad Pro for body copy, or their manual-sanctioned free alternates (Montserrat and Source Sans 3; Arial/Segoe UI acceptable tertiary body fonts).
   - **Logo**: the official Toastmasters International logo, unmodified (full-color, grayscale, or white variant only), minimum size 72px digital / 0.75in print, clear space at least equal to the wordmark height, no copy/symbols/effects overlapping it, and no custom club logo or tagline.
   - **Voice/tone**: clear, respectful, friendly yet professional, positive — per the manual's voice-and-tone checklist.

---

### User Story 3 - Mock Interview Mode (Priority: P3)

As the VP of Public Relations at a job fair, I want a short mock-interview flow (one or two questions) that analyzes a candidate's answers through the Toastmasters role lenses and produces a branded report ending with a guest invitation, so the analysis doubles as a recruiting tool.

**Why this priority**: High-value outreach use case, but it layers question generation and a report variant on top of the US1 analysis engine — so it lands after US1/US2.

**Independent Test**: Switch to Interview mode, generate 2 questions, record an answer to each, and receive a combined branded report that includes the guest-invitation section.

**Acceptance Scenarios**:

1. **Given** I select Interview mode, **When** I start a session, **Then** the system generates 1–2 interview questions (optionally themed to a stated job field), displayed one at a time.
2. **Given** a question is displayed, **When** the candidate records an answer and stops, **Then** the flow advances to the next question or to analysis.
3. **Given** all answers are recorded, **When** analysis completes, **Then** results are presented per answer and combined, using the same dimensions as US1.
4. **Given** the interview report is generated, **Then** it includes a closing section inviting the candidate to visit a Toastmasters club **as a guest** (no membership pressure), with configurable club details (club name, meeting time/location, contact/link).
5. **Given** a job-fair setting, **Then** the full flow (setup → 2 questions → report in hand) is completable in under 10 minutes.

### Edge Cases

- Microphone permission denied: show clear guidance to enable it; never fail silently.
- Recording too short (< 15 seconds): warn that analysis will be unreliable and ask for confirmation before spending credits.
- Recording cap (default 10 minutes): auto-stop at the cap with a notice, to bound credit cost and upload size.
- Analysis failure (network, AI service error): keep the recorded audio locally and offer retry **without re-recording**.
- Navigating away or closing the tab mid-recording: recording is lost; warn before unload while recording.
- Noisy environments (job fairs!): results should carry a confidence caveat when transcription quality is poor.
- Non-English speech: out of scope for v1; the UI should state English-only.
- Privacy: audio is processed for analysis only and MUST NOT be retained after results are returned; the UI states this. In interview mode, the operator MUST be prompted to obtain the candidate's consent before recording (the candidate is a third party — consistent with the club's PII posture from spec 001).
- Auth reintroduction: the app currently has **no** login requirement on any page (removed in PR #8; localStorage-only). This feature's login requirement therefore means re-introducing authentication for Practice Mode specifically (Supabase auth from spec 003 still exists in the codebase). The analysis endpoints spend real credits and MUST validate a real authenticated session server-side — client-side route guards alone are insufficient.
- Global reset ([008-global-reset](../008-global-reset/spec.md)): clears any locally stored practice results.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Practice mode MUST require an authenticated session; unauthenticated visitors are redirected to login/signup. Server-side AI endpoints MUST independently validate the session before performing analysis.
- **FR-002**: The system MUST record audio in the browser with a visible recording state, elapsed time, and stop control.
- **FR-003**: Session setup MUST allow choosing a speech type/target duration (reusing existing timer presets including Custom) and optionally setting a Word of the Day for the session.
- **FR-004**: Recorded audio MUST be sent to the AI service server-side for transcription and analysis; AI credentials MUST never be exposed to the client.
- **FR-005**: Analysis MUST cover: filler words (total, by type, per-minute rate), improper grammatical usages with suggested corrections, outstanding words/phrases, Word of the Day usage (when set), duration vs. target with a within-time verdict (using preset grace periods), speaking pace (WPM), an overall 0–100 score, and top strengths and improvement suggestions.
- **FR-006**: Results MUST be displayed on screen as role-style panels consistent with the existing Ah-Counter, Grammarian, and Timer UIs.
- **FR-007**: Users MUST be able to download/print a summary report of the results.
- **FR-008**: The report MUST comply with the Toastmasters Brand Manual (`02330-001-0001-brand-manual.pdf`): brand color palette (Loyal Blue `#004165`, True Maroon `#772432`, Cool Gray `#A9B2B1`, Happy Yellow `#F2DF74` accent, black/white; sanctioned gradients only), brand typography (Gotham/Myriad Pro or free alternates Montserrat/Source Sans 3), unmodified official logo with required clear space and minimum size, and brand voice/tone. No custom club logos, themes, or taglines.
- **FR-009**: Interview mode MUST generate 1–2 interview questions (optionally informed by a stated job field), capture a recorded answer per question, and produce per-answer plus combined analysis.
- **FR-010**: The interview report MUST include a configurable Toastmasters guest-invitation section (club name, meeting details, contact/link) framed as "visit as a guest".
- **FR-011**: Audio MUST be used only for the requested analysis and MUST NOT be retained after results are returned; the UI must disclose this. Interview mode MUST present a consent prompt before recording a third party.
- **FR-012**: Recordings MUST be capped (configurable, default 10 minutes). On analysis failure, the audio MUST remain available locally for retry without re-recording.
- **FR-013**: Analysis progress MUST be visible (submitted → analyzing → results), with graceful, actionable error states.
- **FR-014**: Results persist for the current browser session only in v1 (the downloadable report is the durable record); no server-side history.

### Key Entities

- **PracticeSession**: mode (`speech` | `interview`), speech type/target preset, optional WordOfTheDay, recording metadata (duration), status.
- **AnalysisResult**: fillerWordCounts (by type + total + rate), improperUsages (list with suggestions), outstandingLanguage (list), wotdUsed (boolean, when set), durationSeconds, withinTime verdict, wordsPerMinute, overallScore, strengths (list), improvements (list), transcriptionConfidence.
- **InterviewQuestion**: id, text, optional jobField, order.
- **ClubProfile** (for the report footer): club name, meeting schedule/location, contact/link — configurable, used by the guest-invitation section.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Analysis of a 7-minute speech returns results in under 90 seconds after upload completes.
- **SC-002**: A complete mock interview (setup, 2 questions, report delivered) takes under 10 minutes end to end.
- **SC-003**: Filler-word counts are within ±10% of a human Ah-Counter's count on clear test recordings.
- **SC-004**: The downloaded report renders correctly for print on 1–2 pages and passes the brand checklist (palette, fonts, logo rules) on review.
- **SC-005**: 90% of first-time users complete a practice session without consulting help documentation.
- **SC-006**: No audio recordings are retained server-side after analysis completes (verifiable in the implementation review).
