
import { AssetData } from '../types';

export const ANALYZE_FINANCIALS_PROMPT = (data: AssetData) => `
Act as a financial analyst for ${data.category} investments.
Evaluate this asset:
- Name: ${data.assetName}
- Valuation: ${data.valuation}
- Revenue/NOI: ${data.financials.noi || data.financials.revenue || 0}
- Debt: ${data.financials.existingDebt || 0}

Provide a financial health check, risks related to valuation/debt, and recommendations for token pricing.
Output strictly JSON with keys: text (string), risks (string[]), recommendations (string[]).
`;

export const GENERATE_BUSINESS_PLAN_PROMPT = (data: AssetData) => `
Write a comprehensive Business Plan for a Real Estate/Asset Tokenization project.

Asset Details:
- Name: ${data.assetName}
- Type: ${data.category} (${data.assetType || data.industry || 'General'})
- Valuation: $${data.valuation}
- Location/Address: ${data.address || 'Global'}
- Description: ${data.description || 'N/A'}

Structure the response in Markdown with these sections:
1. Executive Summary
2. Investment Opportunity & Market Analysis
3. Financial Projections (Use Valuation: $${data.valuation})
4. Exit Strategy

Keep it professional, persuasive, and detailed (approx 300 words).
`;
