
export const EXPLAIN_SPV_PROMPT = (persona: string) => `
Act as a legal educator in Asset Tokenization.
Explain what a Special Purpose Vehicle (SPV) is to a user who identifies as: "${persona}".

Context: The SPV is used to hold a real-world asset (like a building) so it can be tokenized on the blockchain.

Constraints:
1. Use analogies suitable for this persona.
2. Keep it under 60 words.
3. Be clear and engaging.
`;

export const JURISDICTION_SUMMARY_PROMPT = (region: string) => `
Act as an international securities lawyer.
Provide a summary of the regulatory environment for Asset Tokenization in: "${region}".

Constraints:
1. STRICTLY limited to exactly 3 sentences.
2. Sentence 1: The main regulatory framework or sentiment.
3. Sentence 2: The key advantage or "Pro".
4. Sentence 3: The key challenge or "Con".
5. Do not use bullet points. Returns a single paragraph.
`;

export const GENERAL_REQUIREMENTS_PROMPT = (assetType: string) => `
Act as a project manager for an Asset Tokenization firm.
Create a simple, high-level checklist of "What is generally needed" to tokenize a "${assetType}".

Constraints:
1. Return exactly 3 bullet points.
2. Keep each point extremely concise (under 10 words).
3. Cover: Asset ownership proof, Legal Entity, and Tech/Compliance.
4. Return strictly a JSON array of strings. Example: ["Proof of Title", "Incorporated SPV", "Digital Wallet"]
`;
