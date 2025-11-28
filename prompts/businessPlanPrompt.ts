
import { AssetData, ProjectInfo } from '../types';

export const GENERATE_BUSINESS_PLAN_PROMPT = (asset: AssetData, project: ProjectInfo) => `
Act as a senior investment banker and real estate strategist.
Write a comprehensive, institutional-grade Business Plan for the following Tokenization Project.

--- PROJECT CONTEXT (STEP 1) ---
Project Name: ${project.projectName}
Goal: ${project.projectGoal}
Raise Target: $${project.targetRaiseAmount}
Vision/Description: ${project.description}

--- ASSET DATA (STEP 2) ---
Category: ${asset.category}
Asset Name: ${asset.assetName}
Valuation: $${asset.valuation}
Location: ${asset.address || 'Global'}
Key Financials:
- NOI/Revenue: ${asset.financials.noi || asset.financials.revenue || 'N/A'}
- Debt: ${asset.financials.existingDebt || 0}
- Occupancy: ${asset.financials.occupancyRate || 'N/A'}%

--- INSTRUCTIONS ---
Generate the response in Markdown format.
Use the following strict Table of Contents (Indices):

1. **Executive Summary**
   - The Opportunity
   - The Solution (Tokenization Strategy)

2. **Market Analysis**
   - Industry Trends for ${asset.category}
   - Target Audience

3. **The Asset**
   - Technical Specifications
   - Valuation Methodology

4. **Financial Projections**
   - Revenue Model
   - 5-Year Outlook based on current Valuation of $${asset.valuation}

5. **Exit Strategy**
   - Liquidity Events
   - Token Holder Returns

Write in a professional, persuasive tone suitable for institutional investors.
`;
