
export const GENERATE_QUIZ_PROMPT = (topic: string) => `
Act as an expert professor in Asset Tokenization and Blockchain Finance.
Create a short, interactive quiz to test the user's understanding of the following topic: "${topic}".

Generate 3 multiple-choice questions.
- Question 1: Fundamental concept.
- Question 2: Real-world application/benefit.
- Question 3: Distinguishing a key detail (e.g., Token vs Crypto).

Return strictly JSON in the following format:
{
  "topic": "${topic}",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": number (0-3),
      "explanation": "string (Short feedback on why this is correct)"
    }
  ]
}
`;
