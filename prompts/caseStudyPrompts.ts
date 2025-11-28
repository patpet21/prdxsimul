
export const GENERATE_CASE_STUDY_PROMPT = (industry: string) => `
Act as a Real Estate and Finance historian.
Generate a "Mini Case Study" of a tokenized asset project in the "${industry}" sector.
It can be a famous real-world example (like St. Regis Aspen, RealT, KKR) or a realistic hypothetical if no famous one exists for that specific niche.

Return strictly JSON with the following structure:
{
  "title": "string (Project Name)",
  "location": "string (City, Country)",
  "year": "string (Year of tokenization)",
  "assetValue": "string (e.g. '$18M')",
  "summary": "string (2 sentences explaining what was tokenized and why)",
  "keyTakeaway": "string (1 lesson learned from this project)",
  "successFactor": "string (Why did it succeed? e.g. 'Low minimum investment')"
}
`;
