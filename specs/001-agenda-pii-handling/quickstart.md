# Quickstart: Agenda PII Handling (Text-to-JSON)

This guide provides the basic steps to set up and run the RoleCopilot application to test the "Agenda PII Handling" feature with the new text-based workflow.

## Prerequisites

- Node.js (version 20.x or later)
- npm or yarn

## 1. Installation

Clone the repository and install the dependencies.

```bash
git clone <repository-url>
cd rolecopilot-dev
npm install
```

## 2. Environment Variables

The application requires an environment variable for connecting to the Gemini AI service. Create a `.env.local` file in the root of the project and add your API key.

```text
# .env.local
GEMINI_API_KEY="your-gemini-api-key-here"
```

**Note**: The `.env.local` file is ignored by Git and should not be committed.

## 3. Running the Application

Start the Next.js development server.

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 4. How to Test the Feature

1.  Navigate to the main page of the application.
2.  You should see a text area for pasting the agenda content.
3.  Copy the text from your meeting agenda and paste it into the text area.
4.  Click the "Process Agenda" button.
5.  The application will process the text, and a list of extracted roles and their assigned members will be displayed on the screen.
6.  Verify that the displayed information is correct. The system should have correctly identified names, sanitized them before the AI call, and re-inserted them into the final display.
7.  Close the browser tab and reopen it. The data should be gone, demonstrating that it was held only in memory for the session.