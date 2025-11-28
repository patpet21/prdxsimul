
import { AssetData, ProjectInfo, JurisdictionData } from '../types';

export const GENERATE_TOKEN_STRATEGY_PROMPT = (
  asset: AssetData,
  project: ProjectInfo,
  jurisdiction: JurisdictionData
) => `
Act as a Senior Tokenization Consultant and Tax Strategist.

--- PROJECT CONTEXT ---
Project: ${project.projectName} (${project.projectGoal})
Asset: ${asset.category} (${asset.assetName})
Valuation: $${asset.valuation}
Jurisdiction: ${jurisdiction.country} - ${jurisdiction.spvType}

--- TASK ---
Provide a strategic educational report for the client.
1. **Why Tokenize?**: Explain 3 specific benefits of tokenizing THIS specific asset (e.g. liquidity for real estate, community for art).
2. **Tax Strategy**: Provide a high-level tax efficiency tip based on the ${jurisdiction.country} ${jurisdiction.spvType} structure.
3. **Market Positioning**: How should this token be marketed? (e.g. "Stable Yield" vs "High Growth").

--- OUTPUT FORMAT ---
Return strictly JSON:
{
  "whyTokenize": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "taxStrategy": "string (2-3 sentences on tax optimization)",
  "marketPositioning": "string (2-3 sentences on marketing angle)",
  "educationalNote": "string (A general educational fact about tokenomics)"
}
`;
