
export const GENERATE_RISK_REPORT_PROMPT = (state: any) => `
Generate a final "Pre-Deployment Audit Report" for a tokenization project.

Project Data:
- Jurisdiction: ${state.jurisdiction.country} - Region: ${state.jurisdiction.entityDetails.registrationState || 'Default'}
- Structure: ${state.jurisdiction.spvType}
- Asset: ${state.asset.category} valued at ${state.asset.valuation}
- Compliance: ${state.compliance.regFramework} (Accreditation: ${state.compliance.accreditationRequired})
- Tokenomics: $${state.tokenomics.pricePerToken} price, ${state.tokenomics.totalSupply} supply

Calculate a readiness score (0-100), assign a risk level, and list warnings, opportunities, and a roadmap.
Output strictly JSON with keys: score (number), level (Low/Medium/High), warnings (string[]), opportunities (string[]), legalRoadmap (string[]).
`;
