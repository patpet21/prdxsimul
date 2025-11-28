
import { ProjectInfo, TokenizationCategory } from '../types';

export const IMPROVE_DESCRIPTION_PROMPT = (info: ProjectInfo, category: TokenizationCategory) => `
Act as a Senior Investment Banker and Copywriter specializing in Asset Tokenization.

--- INPUT DATA ---
Project Name: ${info.projectName}
Asset Class: ${category}
Current Goal: ${info.projectGoal}
Current Description: "${info.description}"

--- TASK ---
Rewrite the project description to be more professional, persuasive, and clear for institutional and retail investors. 
Keep the original meaning but improve the flow, vocabulary, and structure.
Highlight the value proposition early.
Keep it under 80 words.

--- OUTPUT ---
Return ONLY the rewritten text. Do not add conversational filler.
`;
