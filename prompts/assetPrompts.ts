
import { ProjectInfo, TokenizationCategory } from '../types';

export const AUTOFILL_ASSET_GENERAL_PROMPT = (info: ProjectInfo, category: TokenizationCategory) => `
Act as a real estate and business analyst. 
Based strictly on the user's project description, extract or estimate the asset details.

User Project Info:
- Name: ${info.projectName}
- Goal: ${info.projectGoal}
- Description: ${info.description}
- Category: ${category}

Task: Populate the following fields. If the user didn't specify a value (e.g. sqft), ESTIMATE a realistic number based on the context (e.g., if "small apartment", guess 800 sqft).

Return strictly JSON:
{
  "assetName": "string (refined title)",
  "valuation": number (estimated value in USD),
  "assetType": "string (Residential, Commercial, etc - only if Real Estate)",
  "industry": "string (only if Business)",
  "sqft": number (only if Real Estate),
  "address": "string (City, Country inferred)",
  "description": "string (a professional 2-sentence summary)"
}
`;

export const AUTOFILL_ASSET_FINANCIALS_PROMPT = (info: ProjectInfo, category: TokenizationCategory, valuation: number) => `
Act as a financial underwriter.
Based on the project "${info.projectName}" (${category}) with an estimated valuation of $${valuation}.

Generate REALISTIC financial projections/current stats.

Return strictly JSON:
{
  "noi": number (Net Operating Income - for Real Estate),
  "revenue": number (for Business),
  "ebitda": number (for Business),
  "occupancyRate": number (0-100, for Real Estate),
  "existingDebt": number (conservative estimate)
}
`;

export const GET_ASSET_ADVICE_PROMPT = (category: string, type: string, location: string) => `
Act as a Senior Asset Manager.
The user is tokenizing a ${category} asset (specifically: ${type}) located in ${location}.

Provide 3 strategic tips for this specific asset class in this location.
Focus on:
1. Valuation drivers (what makes it valuable?).
2. Typical risks for this area/type.
3. A recommendation for the "Renovation Status" (e.g., does the market prefer turnkey or fixer-upper?).

Return strictly JSON:
{
  "valuationTip": "string",
  "riskWarning": "string",
  "renovationAdvice": "string"
}
`;

export const ESTIMATE_ASSET_SPECS_PROMPT = (category: string, type: string, value: number) => `
Act as a Technical Architect.
Estimate the physical specifications for a ${category} project (${type}) valued around €${value}.

Return realistic averages for:
- Construction Year
- Total Units
- Interior Sqm
- Energy Class (EU standard A-G)

Return strictly JSON:
{
  "construction_year": number,
  "total_units": number,
  "interior_size_sqm": number,
  "building_class": "string"
}
`;
