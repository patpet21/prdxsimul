
export const ASSET_CLASS_LEARNING = {
  'Real Estate': {
    title: "Real Estate Tokenization",
    whyMatters: "The most common asset class. It converts illiquid property into liquid tokens.",
    legalImpact: "Requires an SPV (LLC/S.r.l.) to hold the deed. Tokens represent shares in that SPV.",
    valuationImpact: "Based on Net Operating Income (NOI) and Cap Rate. Market comparables are critical.",
    kpis: ["Net Operating Income (NOI)", "Occupancy Rate", "Cap Rate", "Appreciation Potential"],
    investorFocus: "Stability of cash flow, location quality, and property management track record.",
    warning: "Liquidity is not instant. Secondary markets require time to build volume."
  },
  'Business': {
    title: "Company Equity (Private Shares)",
    whyMatters: "Democratizes access to VC-style investing for startups or SMEs.",
    legalImpact: "Tokens are digital shares. Requires strict Cap Table management and often Shareholder Agreements.",
    valuationImpact: "Based on Revenue multiples, EBITDA, or Discounted Cash Flow (DCF).",
    kpis: ["Monthly Recurring Revenue (MRR)", "EBITDA Growth", "Burn Rate", "CAC/LTV"],
    investorFocus: "Scalability, exit strategy (IPO/Acquisition), and founder team experience.",
    warning: "High risk. Investors expect a clear path to exit or dividends, otherwise tokens become 'zombie' assets."
  },
  'Art': {
    title: "Art & Collectibles",
    whyMatters: "Fractionalizes high-value passion assets (paintings, cars, watches).",
    legalImpact: "Often uses a 'Club Deal' or specialized Trust structure. Provenance and insurance are legally required.",
    valuationImpact: "Highly subjective. Relies on recent appraisals, artist reputation, and rarity.",
    kpis: ["Artist Market Index", "Auction History", "Provenance/Authenticity", "Insurance Value"],
    investorFocus: "Rarity, historical appreciation, and physical storage security.",
    warning: "Zero cash flow yield. Returns rely entirely on selling the asset later at a higher price."
  },
  'Debt': {
    title: "Debt Instruments",
    whyMatters: "Tokenizing loans or bonds to create fixed-income products for investors.",
    legalImpact: "Focus is on the Loan Agreement and Collateral. Tokens represent the right to receive interest.",
    valuationImpact: "Valuation is simpler: Principal + Interest - Default Risk.",
    kpis: ["Annual Percentage Yield (APY)", "Loan-to-Value (LTV)", "Default Rate", "Collateral Quality"],
    investorFocus: "Reliability of interest payments and the quality of the underlying collateral.",
    warning: "Regulatory classification is strict. Often treated as a clear security requiring full compliance."
  },
  'Funds': {
    title: "Investment Funds (LP Interests)",
    whyMatters: "Tokenizing the Limited Partner (LP) interest in a larger fund.",
    legalImpact: "Complex GP/LP structure. Strict accreditation rules usually apply (Reg D).",
    valuationImpact: "Net Asset Value (NAV) of the underlying portfolio.",
    kpis: ["Net Asset Value (NAV)", "Internal Rate of Return (IRR)", "Management Fees", "AUM Growth"],
    investorFocus: "Fund manager's track record (Alpha) and diversification strategy.",
    warning: "Heavy reporting requirements. NAV must be updated frequently on-chain."
  },
  'Other': {
    title: "Custom Asset Class",
    whyMatters: "Any other income-generating asset (Intellectual Property, Carbon Credits, etc).",
    legalImpact: "Requires a bespoke legal opinion to define what 'ownership' means.",
    valuationImpact: "Custom methodology required based on cashflow generation.",
    kpis: ["Revenue Generation", "Utility Value", "Market Demand", "Scarcity"],
    investorFocus: "Uniqueness of the asset and legal enforceability of ownership rights.",
    warning: "Novelty risk. Regulators may look closer at undefined asset classes."
  }
};
