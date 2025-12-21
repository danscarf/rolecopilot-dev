# Research: Agenda PII Handling (Text-to-JSON)

This document records the research and decisions made for the text-to-JSON implementation of the Agenda PII Handling feature.

## 1. Prompt Engineering for Gemini Text-to-JSON Conversion

**UNKNOWN**: What is the optimal prompt design for instructing a large language model like Gemini to reliably convert messy, unstructured text/HTML into a clean, predictable JSON array of assigned roles?

**RESEARCH**:
-   **Few-Shot Learning**: Providing 2-3 examples of input text and the desired JSON output within the prompt dramatically improves accuracy and consistency. This is more effective than just describing the output format.
-   **JSON Schema Enforcement**: Some models and APIs (like OpenAI's) have a "JSON mode" that forces the output to be valid JSON. For Gemini, while not a separate mode, you can explicitly ask for the output to conform to a specific JSON schema and even include the schema definition in the prompt.
-   **System Instructions vs. User Prompts**: The prompt should contain clear system-level instructions that define the AI's role and the output format, followed by the user-provided (and sanitized) text.
-   **Handling Variations**: The prompt should instruct the model on how to handle common variations, such as missing assignees (e.g., "If a role has no name assigned, use `null` for the `assignee` value").

**DECISION**: The prompt sent to the Gemini API will be structured as follows:
1.  **System Instruction**: A preamble defining the task, the desired JSON structure, and rules for handling missing data.
2.  **Examples (Few-Shot)**: One or two concise examples of sanitized input text and the corresponding JSON output.
3.  **User Input**: The sanitized, user-pasted text.

**EXAMPLE PROMPT FRAGMENT**:
```
"You are an expert agenda parser. Your task is to extract meeting roles and their assignees from the provided text and format the output as a valid JSON array of objects. Each object must have a 'role' (string) and an 'assignee' (string or null).

---
EXAMPLE 1
Input: 'Toastmaster: [PERSON_1], Speaker: [PERSON_2]'
Output: [{'role': 'Toastmaster', 'assignee': 'PERSON_1'}, {'role': 'Speaker', 'assignee': 'PERSON_2'}]
---
EXAMPLE 2
Input: 'General Evaluator: , Timer: [PERSON_3]'
Output: [{'role': 'General Evaluator', 'assignee': null}, {'role': 'Timer', 'assignee': 'PERSON_3'}]
---

Process the following text:
[SANITIZED_USER_TEXT_HERE]"
```

## 2. PII Sanitization and Tokenization Strategy

**UNKNOWN**: What is the best strategy for sanitizing PII (names) from the input text locally before sending it to the AI, while ensuring the AI can still understand the structure and the client can re-insert the names later?

**RESEARCH**:
-   **Simple Find-and-Replace**: Using a pre-defined list of member names to find and replace them with tokens (e.g., `[PERSON_1]`, `[PERSON_2]`). This is fast and simple but requires a known list of members.
-   **Named Entity Recognition (NER)**: More advanced, using a lightweight, client-side NLP library to identify person names automatically. This is more flexible but adds a dependency and complexity.
-   **Re-insertion Mapping**: The sanitization process must create a map between the placeholder tokens and the original names. For example: `{'[PERSON_1]': 'Dan S.', '[PERSON_2]': 'Jane D.'}`. This map is held in the Next.js API route's memory and used to re-hydrate the data after receiving the structured JSON from Gemini.

**DECISION**: Implement a find-and-replace tokenizer using a dynamic list of names.
1.  The client will first identify potential names in the text (e.g., by looking for words near roles or using a simple heuristic). Alternatively, the user could be asked to provide a list of attendees.
2.  This list of names will be sent to the Next.js API route along with the raw text.
3.  The API route will perform the find-and-replace to create the sanitized text and the token-to-name map.
4.  After the AI call, the route will use the map to replace the tokens in the final JSON before sending it to the client.

**RATIONALE**: This approach avoids adding a heavy client-side NER library and provides a reliable way to map sanitized data back to the original PII without ever exposing it to the third-party AI. It keeps the core PII-handling logic secure on the server-side within the API route.

## 3. Using `@google/generative-ai` in Next.js

**UNKNOWN**: What are the best practices for using the `@google/generative-ai` package within a Next.js App Router API route?

**RESEARCH**:
-   **Initialization**: The `GoogleGenerativeAI` class should be initialized once and can be reused. It's best to do this outside the handler function in the `route.ts` file to take advantage of the serverless function's execution context for potential reuse across invocations.
-   **API Key Management**: The API key must be stored as a server-side environment variable in `.env.local` (e.g., `GEMINI_API_KEY=...`) and accessed via `process.env.GEMINI_API_KEY`. It must not be exposed to the client.
-   **Error Handling**: The API calls can fail due to network issues, invalid input, or safety blocks. The code must be wrapped in a `try...catch` block to handle these errors gracefully and return a meaningful error message to the client, as required by the spec (FR-009).
-   **Streaming**: For long responses, streaming can improve perceived performance. For this use case, where the output is a relatively small JSON object, a standard non-streaming `generateContent` call is simpler and sufficient.

**DECISION**: The `app/(api)/process-agenda/route.ts` file will:
1.  Initialize a single `GoogleGenerativeAI` instance at the module level.
2.  Read the API key from `process.env`.
3.  Use the non-streaming `model.generateContent()` method inside a `try...catch` block.
4.  Construct the prompt as detailed in section 1 of this research.