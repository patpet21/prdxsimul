
import { AssetData, ProjectInfo, JurisdictionData } from '../types';

export const GENERATE_TOKEN_CONFIG_PROMPT = (
  asset: AssetData, 
  project: ProjectInfo
) => `
Act as a Chief Financial Officer (CFO) for a Digital Asset Issuer.
Context:
- Asset: ${asset.category} (${asset.assetType || 'General'})
- Valuation: €${asset.valuation}
- Goal: ${project.projectGoal}

Task: Design the optimal Token Structure.
1. Determine a **Token Price** (e.g., €10-€100 for Retail, €1000+ for Whales).
2. Calculate **Supply** based on Valuation.
3. Suggest **Capital Targets** (Soft Cap = break even, Hard Cap = valuation).
4. Suggest **Allocation** % (Investors, Founders, Treasury, Advisors).

Return strictly JSON:
{
  "token_price": number,
  "total_tokens": number,
  "soft_cap": number,
  "hard_cap": number,
  "allocation": {
    "investors": number,
    "founders": number,
    "treasury": number,
    "advisors": number
  },
  "strategy_reasoning": "string (Explain WHY this price point fits this asset type. Max 2 sentences.)"
}
`;

export const ESTIMATE_YIELDS_FEES_PROMPT = (
  asset: AssetData,
  jurisdiction: JurisdictionData
) => `
Act as a Real Estate Financial Underwriter.
Context:
- Asset: ${asset.assetName} (${asset.category})
- Location: ${asset.address || jurisdiction.country}

Task: Estimate realistic market rates for this asset class.
1. **APY**: Annual Yield % (Net to investor).
2. **IRR**: Internal Rate of Return (Exit scenario).
3. **Fees**: Standard Platform/Broker fees and Annual Mgmt Fee.
4. **Lock-up**: Recommended liquidity lock-up in months.

Return strictly JSON:
{
  "annual_yield": number,
  "roi_target": number,
  "platform_fees": number (fixed amount estimate),
  "management_fee_percentage": number,
  "lockup_months": number,
  "explanation": "string (Brief market justification for these yields)"
}
`;

export const GENERATE_DEEP_STRATEGY_PROMPT = (
  asset: AssetData,
  project: ProjectInfo
) => `
Act as a Senior Investment Banker and Marketing Strategist.
Create a "Deep Strategy Memo" for the tokenization of: "${project.projectName}".

Context:
- Asset Value: €${asset.valuation}
- Type: ${asset.category}

Generate 4 high-impact strategic pillars:
1. **The Pitch**: A 1-sentence "Killer Hook" to sell this token.
2. **Investor Persona**: Who is the ideal buyer? (e.g., "The Yield Hunter", "The Crypto Native").
3. **Liquidity Narrative**: Explain how tokenization unlocks value here vs traditional ownership.
4. **The "Why Now"**: Why is this specific moment right for this asset?

Return strictly JSON:
{
  "elevator_pitch": "string",
  "investor_persona": {
    "title": "string",
    "description": "string"
  },
  "liquidity_thesis": "string",
  "market_timing": "string"
}
`;
