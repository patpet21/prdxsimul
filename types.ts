
// Data Models

export type TokenizationCategory = 'Real Estate' | 'Business' | 'Art' | 'Debt' | 'Funds' | 'Other';

// --- DATABASE SCHEMA MIRROR (public.properties) ---

export interface PropertyDatabaseSchema {
  // Basic Info
  slug?: string;
  title: string;
  description: string;
  long_description?: string;
  
  // Location
  location: string; // Display string
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  neighborhood?: string;
  coordinates?: { lat: number, lng: number }; // geography(Point)

  // Media
  image_url: string;
  brochure_url?: string;
  video_url?: string;
  virtual_tour_url?: string;

  // Parties
  sponsor?: string;
  developer?: string;
  property_manager?: string;
  legal_counsel?: string;
  website?: string;

  // Timeline
  completion_date?: string;
  expected_start_date?: string;
  expected_end_date?: string;
  project_duration_months?: number;

  // Valuation & Financials
  total_value: number;
  raise_amount?: number;
  total_costs?: number;
  gross_profit?: number;
  soft_cap?: number;
  hard_cap?: number;

  // Token Economics
  token_price: number;
  total_tokens: number;
  available_tokens: number;
  tokens_for_operators?: number;
  tokens_for_investors?: number;
  min_invest_tokens: number;

  // Returns & Yields
  annual_yield: number;
  roi_target?: number;
  annualized_roi?: number;
  expected_income_min?: number;
  expected_income_max?: number;
  gross_income_year?: number;
  gross_income_month?: number;

  // Property Metrics
  occupancy_rate?: number;
  appreciation_rate?: number;
  leverage_ratio?: number;
  loan_interest_rate?: number;

  // Classification
  property_type: string; // e.g. 'Residenziale'
  asset_type?: string;
  category: TokenizationCategory;
  risk_score?: number; // 1.0 to 5.0

  // Property Details (The Specific Indices)
  construction_year?: number;
  total_units?: number;
  bedrooms?: number;
  bathrooms?: number; // numeric(3,1)
  interior_size_sqm?: number;
  exterior_size_sqm?: number;
  heating_type?: string;
  building_class?: string;
  renovated_status?: string;

  // Income Structure
  payout_type?: string;
  distribution_frequency?: string;
  rent_type?: string;
  rent_subsidy?: boolean;
  income_start_date?: string;

  // Fees
  platform_fees?: number;
  mediator_fees?: number;
  management_fee_percentage?: number;

  // Investment Structure
  investor_share_percentage?: number;
  lockup_months?: number;
  sponsor_commitment_eur?: number;
  exit_strategy?: string;

  // Status
  status: 'draft' | 'review' | 'active' | 'funding' | 'funded' | 'completed' | 'cancelled';
  visibility: 'private' | 'public' | 'whitelist';
  featured: boolean;
  is_user_created: boolean;
  wizard_data?: any; // jsonb
}

// --- WIZARD STATE TYPES ---

export interface ProjectInfo {
  projectName: string;
  projectGoal: 'Liquidity' | 'Capital Raise' | 'Community' | 'Exit' | 'DeFi Collateral';
  assetClass: TokenizationCategory; 
  targetRaiseAmount: number;
  description: string; 
  website?: string;
}

export interface EntityDetails {
  companyName: string;
  isNameAvailable?: boolean;
  registrationState?: string; 
  directors: string[]; 
  shareholders: string[]; 
  shareCapital: number;
  registeredAddress: string;
  formationAgent?: string; 
  taxId?: string; 
  fiscalYearEnd?: string;
  governanceType?: 'Member-Managed' | 'Manager-Managed' | 'Board';
}

export interface JurisdictionData {
  country: string;
  region: string;
  spvType: string;
  regulatoryRegime: string;
  entityDetails: EntityDetails;
}

export interface ComplianceData {
  kycProvider: string;
  accreditationRequired: boolean;
  amlCheckEnabled: boolean;
  jurisdictionRestrictions: string[]; 
  regFramework: 'Reg D' | 'Reg S' | 'Reg A+' | 'MiCA' | 'None';
  retentionPolicy: string; 
  whitelistingMode: 'Pre-Trade' | 'Post-Trade';
}

export interface TokenAllocation {
  founders: number; 
  investors: number; 
  treasury: number; 
  advisors: number; 
}

export interface DistributionData {
  targetInvestorType: 'Retail' | 'Accredited' | 'Institutional' | 'Mixed';
  minInvestment: number;
  maxInvestment: number;
  marketingChannels: string[]; 
  launchDate?: string;
}

export interface AiRiskReport {
  score: number; 
  level: 'Low' | 'Medium' | 'High';
  warnings: string[];
  opportunities: string[];
  legalRoadmap: string[];
}

export interface TokenizationState {
  projectInfo: ProjectInfo; 
  jurisdiction: JurisdictionData;
  property: PropertyDatabaseSchema; 
  compliance: ComplianceData;
  tokenAllocation: TokenAllocation; 
  distribution: DistributionData;
  riskReport?: AiRiskReport;
}

// Re-export Project for compatibility with existing UI components
export interface Project extends PropertyDatabaseSchema {
  id: string;
  // Helpers for UI
  progress: number;
  imageColor: string;
  lastUpdated: string;
  imageUrl: string; // Alias for image_url
  
  // Backward compatibility mappings
  valuation: number; // maps to total_value
  targetRaise: number; // maps to raise_amount
  apy: number; // maps to annual_yield
  minTicket: number; // maps to min_invest_tokens * token_price
  irr?: number; // legacy
  yearFounded?: number; // legacy
}

export interface UserRole {
  user_id: string;
  role: 'admin' | 'issuer' | 'investor' | 'user';
  kyc_status: 'pending' | 'verified' | 'rejected';
  accreditation_status: 'none' | 'pending' | 'accredited';
  updated_at: string;
}

// Strictly matched to the new public.profiles SQL
export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  country: string | null;
  kyc_verified: boolean | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SecondaryListing {
  id: string;
  projectId: string;
  projectTitle: string;
  projectSymbol: string;
  category: TokenizationCategory;
  amount: number;
  pricePerToken: number;
  navPerToken: number; 
  seller: string;
  postedTime: string;
}

export type DashboardTab = 'OVERVIEW' | 'ASSETS' | 'WALLET' | 'TRADING' | 'DOCS' | 'SETTINGS';

export interface StepProps {
  data: TokenizationState;
  updateData: (section: keyof TokenizationState, payload: Partial<any>) => void;
  onValidationChange: (isValid: boolean) => void;
}

// Helper Interfaces for AI & Mock Services

export interface AssetData {
  category: TokenizationCategory;
  assetName: string;
  valuation: number;
  assetType?: string;
  industry?: string;
  sqft?: number;
  address?: string;
  description?: string;
  currency?: string;
  financials: {
    noi?: number;
    revenue?: number;
    ebitda?: number;
    occupancyRate?: number;
    existingDebt?: number;
    appraisalValue?: number;
  };
  images?: string[];
  generatedBusinessPlan?: string;
}

export interface TokenomicsData {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: number;
  pricePerToken: number;
  vestingSchedule: string;
  educationalNote?: string;
  allocation: {
    founders: number;
    investors: number;
    treasury: number;
    advisors: number;
  };
}

export interface QuizData {
  topic: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

// SQL: public.investments
export interface Investment {
  id: string;
  user_id: string;
  property_id: string;
  tokens_owned: number;
  investment_amount: number;
  avg_purchase_price: number;
  roi_realized?: number;
  total_dividends_received?: number;
  days_held?: number;
  purchase_date: string;
}

// SQL: public.orders
export interface Order {
  id: string;
  user_id: string;
  property_id: string;
  tier_id?: string;
  tokens: number;
  unit_price_cents: number;
  gross_amount_cents: number;
  fees_cents?: number;
  net_amount_cents?: number;
  currency?: string;
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled';
  payment_method?: string;
  tx_type?: 'buy' | 'sell'; // Virtual field for UI logic
  created_at: string;
  paid_at?: string;
}

// SQL: public.transactions
export interface Transaction {
  id: string;
  user_id: string;
  property_id: string;
  order_id: string;
  tx_type: 'buy' | 'sell' | 'dividend' | 'fee' | 'refund';
  tokens: number;
  amount_cents: number;
  currency: string;
  blockchain_tx_hash?: string;
  occurred_at: string;
}