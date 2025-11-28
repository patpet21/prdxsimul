
export interface EntityDefinition {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  desc: string;
  minCapital: number;
  minCapitalLabel: string;
  setupTime: string;
  taxPreview: string;
  fiscalImplications: string;
  governanceOptions: string[];
  requirements: string[];
  docsRequired: string[];
  features: string[];
  // New Educational Fields
  bestFor: string;
  investorAccess: string;
}

export interface JurisdictionMeta {
    code: string;
    name: string;
    flag: string;
    tagline: string;
    regimeHint: string; // New Regulatory Snapshot
    guide: {
        intro: string;
        keyRequirement: string;
        bestFor: string;
        popularAssetTypes: string[]; // Specific examples of assets favored by the regime
    }
}

export const JURISDICTION_METADATA: JurisdictionMeta[] = [
    { 
        code: 'US', name: 'United States', flag: '🇺🇸', tagline: 'Global Standard',
        regimeHint: 'SEC Framework (Reg D, Reg S)',
        guide: {
            intro: "The most popular choice for global investors due to flexible LLC laws and strong property rights.",
            keyRequirement: "You MUST appoint a 'Registered Agent' in the state of formation to receive legal mail.",
            bestFor: "Real Estate syndication, Venture Capital, and projects seeking US accredited investors.",
            popularAssetTypes: ["Real Estate (Reg D)", "Venture Funds (Reg D)", "LLC Interests", "Private Credit"]
        }
    },
    { 
        code: 'UK', name: 'United Kingdom', flag: '🇬🇧', tagline: 'Fintech Hub',
        regimeHint: 'FCA & Common Law',
        guide: {
            intro: "A top-tier jurisdiction for Fintech and strictly regulated securities. Offers rapid setup via Companies House.",
            keyRequirement: "You must maintain a 'PSC Register' (Persons with Significant Control) declaring owners >25%.",
            bestFor: "Fintech startups, REITs, and projects targeting UK/Commonwealth investors.",
            popularAssetTypes: ["Digital Securities", "Private Equity Shares", "Debt Instruments", "REITs"]
        }
    },
    { 
        code: 'DE', name: 'Germany', flag: '🇩🇪', tagline: 'High Trust',
        regimeHint: 'BaFin & eWpG',
        guide: {
            intro: "Offers the highest level of investor trust in the EU. Strict but highly respected legal framework.",
            keyRequirement: "Formation requires a physical meeting with a German Notary (Notar) to sign the deed.",
            bestFor: "Institutional-grade Real Estate and projects targeting conservative EU capital.",
            popularAssetTypes: ["eWpG Crypto Securities", "Bearer Bonds", "Real Estate Funds (KG)", "Green Bonds"]
        }
    },
    { 
        code: 'IT', name: 'Italy', flag: '🇮🇹', tagline: 'EU Market',
        regimeHint: 'CONSOB (Crowdfunding Reg)',
        guide: {
            intro: "Strategic access to the Eurozone market. Recent laws favor 'Innovative Startups' for equity crowdfunding.",
            keyRequirement: "Mandatory 'Notaio' (Public Notary) for incorporation and a PEC (Certified Email) address.",
            bestFor: "Luxury Real Estate, Art Tokenization, and EU-compliant equity raises.",
            popularAssetTypes: ["SME Equity (Crowdfunding)", "Participating Instruments", "Mini-Bonds", "Real Estate SPVs"]
        }
    },
    { 
        code: 'UAE', name: 'UAE', flag: '🇦🇪', tagline: 'Crypto Haven',
        regimeHint: 'VARA / ADGM / DIFC',
        guide: {
            intro: "The world's leading jurisdiction for Web3 and Digital Assets, specifically in ADGM and DIFC free zones.",
            keyRequirement: "You usually need a 'Corporate Service Provider' to act as your local company secretary.",
            bestFor: "DAOs, Web3 Native projects, and tax-efficient asset holding.",
            popularAssetTypes: ["Tokenized Real Estate", "Sukuk (Islamic Bonds)", "VC Fund Units", "DAO Tokens"]
        }
    },
];

export const ENTITY_LIBRARY: Record<string, EntityDefinition[]> = {
  US: [
    { 
      id: 'LLC', name: 'Standard LLC', badge: 'Most Popular', badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      desc: "The gold standard for holding assets in the US. Flexible management, pass-through taxation, and strong liability protection.",
      minCapital: 0, minCapitalLabel: "$0",
      setupTime: "2-4 Days",
      taxPreview: "Pass-through (0% Corp Tax)",
      fiscalImplications: "Profits are not taxed at the entity level but pass through to members. Members pay tax in their home jurisdiction.",
      governanceOptions: ['Member-Managed', 'Manager-Managed'],
      requirements: ["Registered Agent in State", "Operating Agreement", "EIN Number"],
      docsRequired: ["Certificate of Formation", "Operating Agreement", "SS-4 Form"],
      features: ["Low maintenance", "No annual meetings", "Charging order protection"],
      bestFor: "Single Asset Real Estate & Small Business",
      investorAccess: "Accredited (US) + Global Investors"
    },
    {
      id: 'Series LLC', name: 'Series LLC', badge: 'Scalable', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      desc: "A powerful structure allowing unlimited segregated 'cells' (series) under one parent. Each series has segregated liability.",
      minCapital: 0, minCapitalLabel: "$0",
      setupTime: "3-5 Days",
      taxPreview: "Pass-through per Series",
      fiscalImplications: "Each series is treated as a separate entity for tax purposes. Ideal for tokenizing multiple properties under one umbrella.",
      governanceOptions: ['Master Manager', 'Series Manager'],
      requirements: ["Registered Agent", "Master Operating Agreement"],
      docsRequired: ["Certificate of Formation", "Series Designation"],
      features: ["Segregated liability", "Scalable tokenization", "One filing fee"],
      bestFor: "Multi-Property Portfolios & Funds",
      investorAccess: "Accredited (US) + Global Investors"
    },
    { 
      id: 'C-Corp', name: 'C-Corporation', badge: 'VC Preference', badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      desc: "Mandatory for raising venture capital. Issues shares and allows for QSBS tax benefits on exit.",
      minCapital: 0, minCapitalLabel: "$0 (Par Value)",
      setupTime: "3-5 Days",
      taxPreview: "21% Federal + State",
      fiscalImplications: "Subject to Double Taxation: 21% Federal Corporate Tax on profits + tax on dividends distributed to shareholders.",
      governanceOptions: ['Board of Directors'],
      requirements: ["Board of Directors", "Shareholder Meeting", "Bylaws"],
      docsRequired: ["Certificate of Incorporation", "Bylaws", "Stock Purchase Agreements"],
      features: ["Issue unlimited shares", "Qualified Small Business Stock (QSBS)", "Perpetual existence"],
      bestFor: "High-Growth Tech Startups",
      investorAccess: "VCs & Institutional Investors"
    },
    {
      id: 'LP', name: 'Limited Partnership', badge: 'Fund Structure', badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      desc: "Ideal for investment funds. General Partner manages operations with unlimited liability; Limited Partners provide capital.",
      minCapital: 0, minCapitalLabel: "$0",
      setupTime: "3-5 Days",
      taxPreview: "Pass-through",
      fiscalImplications: "Strictly pass-through. LPs are passive investors and typically avoid US trade/business tax status.",
      governanceOptions: ['General Partner'],
      requirements: ["General Partner Entity", "Limited Partner Agreement"],
      docsRequired: ["Certificate of Limited Partnership", "LP Agreement"],
      features: ["Flow-through taxation", "Passive investors protected", "Flexible profit distribution"],
      bestFor: "Private Equity & Hedge Funds",
      investorAccess: "Passive Accredited Investors"
    },
    { 
      id: 'DAO LLC', name: 'DAO LLC', badge: 'Web3 Native', badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      desc: "A legally recognized LLC that is managed by smart contracts and token holders. (Available in select states like WY, TN, VT).",
      minCapital: 0, minCapitalLabel: "$0",
      setupTime: "5-7 Days",
      taxPreview: "Pass-through",
      fiscalImplications: "Default is pass-through (partnership) taxation. IRS treatment of 'algorithmically managed' entities is evolving.",
      governanceOptions: ['Algorithmically Managed', 'Member-Managed'],
      requirements: ["Public Address (Smart Contract)", "Registered Agent"],
      docsRequired: ["Articles of Organization", "Smart Contract Audit (Recommended)"],
      features: ["On-chain governance", "Member anonymity", "Direct token integration"],
      bestFor: "Decentralized Communities & Protocols",
      investorAccess: "Crypto-Native Investors"
    }
  ],
  UK: [
    { 
      id: 'LTD', name: 'Private Ltd Company', badge: 'Fastest Setup', badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
      desc: "Extremely fast setup via Companies House. Requires a PSC Register for transparency.",
      minCapital: 1, minCapitalLabel: "£1",
      setupTime: "24 Hours",
      taxPreview: "19-25% Corp Tax",
      fiscalImplications: "Subject to UK Corporation Tax. Dividends to non-residents typically have NO withholding tax.",
      governanceOptions: ['Board of Directors'],
      requirements: ["UK Registered Office", "At least 1 Director", "PSC Register"],
      docsRequired: ["Memorandum of Association", "Articles of Association"],
      features: ["Online incorporation", "Low maintenance", "Limited liability"],
      bestFor: "General Business & Fintech Apps",
      investorAccess: "Global Investors (No Withholding)"
    },
    {
      id: 'LLP', name: 'LLP', badge: 'Professional', badgeColor: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      desc: "Hybrid structure combining partnership flexibility with corporate liability protection. Offers Tax Transparency.",
      minCapital: 0, minCapitalLabel: "£0",
      setupTime: "24-48 Hours",
      taxPreview: "Tax Transparency",
      fiscalImplications: "The LLP itself pays no tax. Members are taxed on their share of profits in their country of residence.",
      governanceOptions: ['Designated Members'],
      requirements: ["Min 2 Designated Members", "Partnership Agreement"],
      docsRequired: ["Form LL IN01", "LLP Agreement"],
      features: ["Tax transparency", "Organizational flexibility", "Member protection"],
      bestFor: "Professional Services & Joint Ventures",
      investorAccess: "Partners & Active Investors"
    }
  ],
  DE: [
    {
        id: 'GmbH', name: 'GmbH', badge: 'German Standard', badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        desc: "Gesellschaft mit beschränkter Haftung. The most trusted German entity type, requiring a Public Notary.",
        minCapital: 25000, minCapitalLabel: "€25,000",
        setupTime: "2-4 Weeks",
        taxPreview: "~30% (Corp + Trade)",
        fiscalImplications: "Subject to Corporate Tax + Trade Tax. Total tax burden approx 30%. Dividends subject to 25% withholding tax.",
        governanceOptions: ['Managing Director (Geschäftsführer)'],
        requirements: ["Notarized Deed", "German Bank Account", "Commercial Register"],
        docsRequired: ["Gesellschaftervertrag", "Handelsregisteranmeldung"],
        features: ["High reputation", "Strict liability limits", "Customizable bylaws"],
        bestFor: "Operational Businesses & Real Estate",
        investorAccess: "EU Institutional Investors"
    },
    {
        id: 'KG', name: 'GmbH & Co. KG', badge: 'Real Estate Fund', badgeColor: 'bg-orange-50 text-orange-800 border-orange-200',
        desc: "Hybrid structure: A Limited Partnership (KG) where the General Partner is a GmbH.",
        minCapital: 25000, minCapitalLabel: "€25,000 (GmbH)",
        setupTime: "3-5 Weeks",
        taxPreview: "Transparent (Trade Tax applies)",
        fiscalImplications: "Transparent for Corporate Tax (partners taxed individually). Standard for DE Funds.",
        governanceOptions: ['GmbH as GP'],
        requirements: ["GmbH Formation", "KG Registration", "Notary"],
        docsRequired: ["GmbH Articles", "KG Agreement", "Commercial Register"],
        features: ["Limited liability for all", "Tax efficient", "Standard for DE Funds"],
        bestFor: "Closed-End Real Estate Funds",
        investorAccess: "Passive Investors"
    }
  ],
  IT: [
    { 
      id: 'S.r.l.', name: 'S.r.l. Ordinaria', badge: 'Standard', badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      desc: "The standard limited liability company in Italy. Secure but requires a Public Notary for formation.",
      minCapital: 10000, minCapitalLabel: "€10,000",
      setupTime: "10-15 Days",
      taxPreview: "24% IRES + 3.9% IRAP",
      fiscalImplications: "Flat IRES of 24% plus regional IRAP. Dividends taxed at 26% for individuals.",
      governanceOptions: ['Sole Director', 'Board of Directors'],
      requirements: ["Public Notary (Notaio)", "PEC Address", "Italian Tax ID"],
      docsRequired: ["Atto Costitutivo", "Statuto", "Chamber of Commerce Cert"],
      features: ["Full liability protection", "Flexible management", "Equity crowdfunding eligible"],
      bestFor: "SMEs & Commercial Real Estate",
      investorAccess: "Local & EU Investors"
    },
    {
        id: 'SpA', name: 'Società per Azioni', badge: 'Large Corp', badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
        desc: "Joint-stock company. Mandatory for banking/financial intermediaries. Requires Audit Report and Notary.",
        minCapital: 50000, minCapitalLabel: "€50,000",
        setupTime: "3-4 Weeks",
        taxPreview: "24% IRES + 3.9% IRAP",
        fiscalImplications: "Standard Corporate Tax. More rigorous fiscal auditing required.",
        governanceOptions: ['Board of Directors', 'Administrator'],
        requirements: ["Board of Auditors", "Public Notary"],
        docsRequired: ["Atto Costitutivo", "Statuto", "Audit Board Appt"],
        features: ["Share issuance", "Regulatory compliance", "Investor protection"],
        bestFor: "Large Scale Development & Banking",
        investorAccess: "Public Markets / Institutions"
    }
  ],
  UAE: [
    { 
      id: 'DIFC SPV', name: 'DIFC SPV', badge: 'Institutional', badgeColor: 'bg-yellow-100 text-amber-800 border-amber-200',
      desc: "Common Law framework in the Middle East. Premium jurisdiction for holding assets and IP.",
      minCapital: 100, minCapitalLabel: "$100",
      setupTime: "1-2 Weeks",
      taxPreview: "0% Corp Tax (Free Zone)",
      fiscalImplications: "0% Corporate Tax for 'Qualifying Free Zone Persons'. No withholding tax on dividends.",
      governanceOptions: ['Board of Directors', 'Corporate Director'],
      requirements: ["Corporate Service Provider", "Registered Office"],
      docsRequired: ["Articles of Association", "Resolution of Inc"],
      features: ["Common Law courts", "100% foreign ownership", "No currency restrictions"],
      bestFor: "Asset Holding & Family Offices",
      investorAccess: "Global & Gulf Investors"
    },
    { 
      id: 'ADGM SPV', name: 'ADGM SPV', badge: 'Crypto Friendly', badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      desc: "Leading jurisdiction for digital assets. Direct application of Common Law and very crypto-friendly regulator.",
      minCapital: 0, minCapitalLabel: "$0",
      setupTime: "1-2 Weeks",
      taxPreview: "0% Corp Tax",
      fiscalImplications: "0% Corporate Tax (subject to Free Zone rules). Extensive Double Tax Treaty network.",
      governanceOptions: ['Board of Directors'],
      requirements: ["ADGM Registered Agent", "Nexus in UAE"],
      docsRequired: ["Articles of Association", "Business Plan"],
      features: ["Digital asset regulation", "Smart contract recognition", "Asset protection"],
      bestFor: "Tokenization Projects & DAOs",
      investorAccess: "Crypto-Native & Global"
    }
  ]
};
