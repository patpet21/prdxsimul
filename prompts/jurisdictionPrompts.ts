
import { TokenizationCategory, EntityDetails, ProjectInfo } from '../types';

export const GET_REGION_RECOMMENDATIONS_PROMPT = (country: string, category: TokenizationCategory) => `
Act as an expert legal consultant for Asset Tokenization.
The user has selected the country: "${country}" for a project in the "${category}" category.

Recommend the top 3-4 specific sub-jurisdictions (States, Cities, or Free Zones) **STRICTLY WITHIN** "${country}" that are best for forming an SPV.

CRITICAL RULES:
1. ONLY return regions/cities inside ${country}. Do NOT suggest US states if the country is Italy. Do NOT suggest UAE free zones if the country is UK.
2. If the country is the US, suggest States (e.g., Delaware, Wyoming).
3. If the country is Italy, suggest Cities or Provinces (e.g., Milan, Rome).
4. If the country is UAE, suggest Free Zones (e.g., ADGM, DIFC).

Return strictly a JSON array of strings. Example: ["Region 1", "Region 2", "Region 3"]
`;

export const RECOMMEND_SPV_PROMPT = (country: string, region: string, category: TokenizationCategory, projectInfo?: ProjectInfo) => `
Act as a senior legal structurer. 
User Context:
- Country: ${country}
- Domicile/Region: ${region || "General"}
- Asset Class: ${category}
- Project Goal: ${projectInfo?.projectGoal || "General Tokenization"}
- Description: ${projectInfo?.description || "N/A"}

Task: Recommend the single best legal entity structure (SPV) type for this specific combination.
Explain WHY in 2 sentences, focusing on how it achieves the user's specific goal (e.g. if Goal is 'Exit', focus on M&A ease; if 'Liquidity', focus on token transferability).

Return strictly a JSON object: { "recommendedSpvId": "string (e.g. 'LLC', 'S.r.l.')", "reasoning": "string" }
`;

export const GENERATE_ENTITY_DETAILS_PROMPT = (country: string, region: string, spvType: string, assetName: string) => `
Act as a corporate secretary. 
Generate realistic, mock incorporation details for a new company.

Context:
- Structure: ${spvType}
- Domicile: ${region}, ${country}
- Asset Name: ${assetName}

Generate:
1. A professional Company Name (compliant with local naming rules, e.g., ending in LLC, S.r.l., Ltd).
2. A realistic Share Capital amount (number).
3. A realistic Registered Address in that region.
4. 2 fictional Director names.
5. A fictional Formation Agent / Notary name.

Return strictly JSON matching this interface:
{
  "companyName": "string",
  "shareCapital": number,
  "registeredAddress": "string",
  "directors": ["string", "string"],
  "formationAgent": "string"
}
`;

export const ANALYZE_JURISDICTION_PROMPT = (
  country: string, 
  region: string,
  spvType: string, 
  category: TokenizationCategory, 
  entityDetails?: EntityDetails,
  projectInfo?: ProjectInfo
) => `
Act as a senior legal educator in Asset Tokenization.
Analyze the following structure setup and provide high-level EDUCATIONAL guidance (NOT legal advice).

- Structure: ${spvType} in ${region || country}
- Asset: ${category}
- Goal: ${projectInfo?.projectGoal}

Provide a structured educational output covering these 4 pillars:

1. **Restrictions**: What can this entity NOT do? (e.g., "Cannot solicit public retail investors without a prospectus").
2. **Minimum Docs**: What are the critical formation documents? (e.g., "Deed of Incorporation, Articles of Association").
3. **Geo-Blocking**: Who should likely be blocked? (e.g., "Block US investors if not Reg D compliant").
4. **Risk Note**: One educational warning about this setup.

Output strictly JSON with these keys:
{
  "restrictions": "string",
  "minDocs": ["string", "string"],
  "geoBlocking": "string",
  "riskNote": "string"
}
`;
