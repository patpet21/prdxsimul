import React, { useState, useCallback, useEffect, ReactNode, Component, ErrorInfo } from 'react';
import { TokenizationState, Project, TokenizationCategory, SecondaryListing } from './types';
import { DeployView } from './components/DeployView';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { WizardPage } from './pages/WizardPage';
import { CategoryPage } from './pages/CategoryPage';
import { GenericPage } from './pages/GenericPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { EducationPage } from './pages/EducationPage';
import { SecondaryMarketPage } from './pages/SecondaryMarketPage';
import { supabase } from './lib/supabase';

// --- CONFIG & MOCK DATA ---

const INITIAL_PROJECTS: Project[] = [
  // This mock data is used only as a fallback if DB is empty or connection fails
  { 
    id: '1', 
    title: 'Skyline Tower A', 
    category: 'Real Estate', 
    total_value: 15000000, 
    valuation: 15000000,
    status: 'active', 
    progress: 85, 
    imageColor: 'bg-indigo-500', 
    lastUpdated: '2h ago',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'A premium Grade-A office tower located in the heart of the financial district. Fully leased to AAA tenants with a 5-year WALT.',
    location: 'New York, NY',
    annual_yield: 8.2,
    apy: 8.2,
    min_invest_tokens: 10,
    minTicket: 500,
    raise_amount: 15000000,
    targetRaise: 15000000,
    irr: 14.5,
    gross_profit: 1200000,
    token_price: 50,
    total_tokens: 300000,
    available_tokens: 45000,
    occupancy_rate: 98,
    construction_year: 2018,
    total_units: 120,
    interior_size_sqm: 15000,
    asset_type: 'Commercial Office',
    property_type: 'Commercial',
    risk_score: 2.5,
    sponsor: 'Skyline Developers LLC',
    property_manager: 'JLL Management',
    payout_type: 'Quarterly Net Rent',
    distribution_frequency: 'Quarterly',
    lockup_months: 12,
    exit_strategy: 'Refinance in Year 5 or Asset Sale',
    visibility: 'public',
    featured: true,
    is_user_created: false
  }
];

const INITIAL_LISTINGS: SecondaryListing[] = [
  { id: '101', projectId: '1', projectTitle: 'Skyline Tower A', projectSymbol: 'SKYA', category: 'Real Estate', amount: 500, pricePerToken: 48.50, navPerToken: 50.00, seller: '0x71...8A9', postedTime: '2m ago' },
  { id: '102', projectId: '1', projectTitle: 'Skyline Tower A', projectSymbol: 'SKYA', category: 'Real Estate', amount: 2500, pricePerToken: 49.00, navPerToken: 50.00, seller: '0x3B...1C4', postedTime: '15m ago' },
];

const INITIAL_STATE: TokenizationState = {
  projectInfo: {
    projectName: '',
    projectGoal: 'Capital Raise',
    assetClass: 'Real Estate',
    targetRaiseAmount: 0,
    description: '',
    website: ''
  },
  jurisdiction: { 
    country: '', 
    region: '', 
    spvType: '', 
    regulatoryRegime: '',
    entityDetails: { companyName: '', directors: [], shareholders: [], shareCapital: 0, registeredAddress: '' }
  },
  property: {
    title: '',
    description: '',
    location: '',
    image_url: '',
    total_value: 0,
    token_price: 50,
    total_tokens: 0,
    available_tokens: 0,
    min_invest_tokens: 1,
    annual_yield: 0,
    gross_profit: 0,
    soft_cap: 0,
    hard_cap: 0,
    raise_amount: 0,
    total_costs: 0,
    property_type: 'Residenziale',
    category: 'Real Estate',
    status: 'draft',
    visibility: 'private',
    featured: false,
    is_user_created: true,
    risk_score: 3.0,
    occupancy_rate: 0,
    appreciation_rate: 0,
    leverage_ratio: 0,
    loan_interest_rate: 0,
    total_units: 1,
    bedrooms: 0,
    bathrooms: 0,
    interior_size_sqm: 0,
    exterior_size_sqm: 0,
    heating_type: '',
    building_class: '',
    renovated_status: '',
    platform_fees: 0,
    mediator_fees: 0,
    management_fee_percentage: 0,
    investor_share_percentage: 0,
    sponsor_commitment_eur: 0,
    rent_type: '',
    rent_subsidy: false,
    payout_type: '',
    distribution_frequency: 'Quarterly',
    lockup_months: 12,
    income_start_date: ''
  },
  compliance: { 
    kycProvider: '', 
    accreditationRequired: false, 
    amlCheckEnabled: true, 
    jurisdictionRestrictions: [],
    regFramework: 'None',
    retentionPolicy: '5 Years',
    whitelistingMode: 'Pre-Trade'
  },
  tokenAllocation: {
    founders: 0,
    investors: 0,
    treasury: 0,
    advisors: 0
  },
  distribution: { targetInvestorType: 'Accredited', minInvestment: 5000, maxInvestment: 0, marketingChannels: [] }
};

type AppRoute = 
  | 'HOME' | 'EDUCATION' | 'SOLUTIONS' | 'MARKETPLACE' | 'TRADING' 
  | 'DEVELOPERS' | 'PRICING' | 'PROJECTS' | 'PROJECT_DETAILS' 
  | 'SIM_INTRO' | 'SIM_WIZARD' | 'SIM_DEPLOY' | 'SIM_AUTH' | 'DASHBOARD';

interface ErrorBoundaryProps { children?: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): ErrorBoundaryState { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("App Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4 text-center">
          <div className="max-w-md bg-white p-8 rounded-xl shadow-xl border border-red-100">
            <h1 className="text-xl font-bold text-red-700 mb-2">Application Error</h1>
            <p className="text-slate-600 mb-6 text-sm">Please reload the application.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-lg">Reload</button>
          </div>
        </div>
      );
    }
    return (this.props as any).children;
  }
}

function AppContent() {
  const [route, setRoute] = useState<AppRoute>('HOME');
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<TokenizationState>(INITIAL_STATE);
  const [isStepValid, setIsStepValid] = useState(false);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [listings, setListings] = useState<SecondaryListing[]>(INITIAL_LISTINGS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // FETCH REAL PROJECTS FROM SUPABASE
  useEffect(() => {
    const fetchProjects = async () => {
      // Fetch public active or funding projects
      const { data: dbData, error } = await supabase
        .from('properties')
        .select('*')
        .or('visibility.eq.public,status.in.(active,funding,funded,completed)');

      if (!error && dbData && dbData.length > 0) {
        const mappedProjects: Project[] = dbData.map((p: any) => ({
          ...p,
          id: p.id,
          // Mapping fields for UI compatibility
          imageUrl: p.image_url,
          valuation: Number(p.total_value),
          targetRaise: Number(p.raise_amount),
          apy: Number(p.annual_yield),
          minTicket: (Number(p.min_invest_tokens) || 1) * Number(p.token_price),
          irr: Number(p.roi_target),
          progress: p.raise_amount 
            ? ((Number(p.raise_amount) - (Number(p.available_tokens) * Number(p.token_price))) / Number(p.raise_amount)) * 100 
            : 0,
          imageColor: 'bg-brand-500', // Fallback color
          lastUpdated: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : 'Recently'
        }));
        setProjects(mappedProjects);
      }
    };

    fetchProjects();

    // Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session && route === 'SIM_AUTH') {
        setRoute('DASHBOARD');
      }
    });
    return () => subscription.unsubscribe();
  }, [route]);

  const updateData = useCallback((section: keyof TokenizationState, payload: any) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], ...payload } }));
  }, []);

  // --- NAVIGATION ACTIONS ---
  const handleStartSimulation = () => { setData(INITIAL_STATE); setRoute('SIM_INTRO'); };
  const handleLogin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) setRoute('DASHBOARD');
    else setRoute('SIM_AUTH'); 
  };
  const handleCategorySelect = (category: TokenizationCategory) => {
    setData(prev => ({ ...prev, property: { ...prev.property, category } }));
    setCurrentStep(0);
    setRoute('SIM_WIZARD');
  };
  const handleWizardNext = () => {
    if (currentStep < 6) { setCurrentStep(prev => prev + 1); setIsStepValid(false); } 
    else { setRoute('SIM_DEPLOY'); }
  };
  const handleWizardBack = () => {
    if (currentStep > 0) { setCurrentStep(prev => prev - 1); setIsStepValid(true); } 
    else { setRoute('SIM_INTRO'); }
  };
  const handleDeployComplete = () => {
    const newProject: Project = {
      ...data.property,
      id: Math.random().toString(),
      title: data.projectInfo.projectName || data.property.title || 'New Tokenized Asset',
      status: 'active',
      progress: 0, 
      imageColor: 'bg-brand-500', 
      imageUrl: data.property.image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      lastUpdated: 'Just now',
      description: data.projectInfo.description,
      valuation: data.property.total_value,
      targetRaise: data.property.raise_amount || data.property.total_value,
      apy: data.property.annual_yield,
      minTicket: (data.property.min_invest_tokens || 1) * data.property.token_price,
    };
    setProjects(prev => [newProject, ...prev]);
    setRoute('PROJECTS'); 
  };
  const handleAuthSuccess = () => setRoute('DASHBOARD');
  const handleDashboardCreateNew = () => { setData(INITIAL_STATE); setRoute('SIM_INTRO'); }
  const handleLogout = async () => { await supabase.auth.signOut(); setRoute('HOME'); }
  const handleSelectProject = (project: Project) => { setSelectedProject(project); setRoute('PROJECT_DETAILS'); };
  
  const handleInvest = (amount: number) => {
    if (!selectedProject) return;
    alert(`Investment of $${amount} simulated for ${selectedProject.title}!`);
    const updatedProjects = projects.map(p => {
        if (p.id === selectedProject.id) {
            const tokensBought = amount / p.token_price;
            const newAvailable = Math.max(0, p.available_tokens - tokensBought);
            const newProgress = ((p.total_tokens - newAvailable) / p.total_tokens) * 100;
            return { ...p, progress: newProgress, available_tokens: newAvailable };
        }
        return p;
    });
    setProjects(updatedProjects);
    const updatedSelected = updatedProjects.find(p => p.id === selectedProject.id);
    if(updatedSelected) setSelectedProject(updatedSelected);
  };
  const handleListToken = (listing: SecondaryListing) => { setListings(prev => [listing, ...prev]); };

  // --- VIEW RENDERING ---
  switch (route) {
    case 'HOME': return <HomePage onStartSimulation={handleStartSimulation} onLogin={handleLogin} onNavigate={(p) => setRoute(p as AppRoute)} />;
    case 'EDUCATION': return <EducationPage onBack={() => setRoute('HOME')} onStartSimulation={handleStartSimulation} onLogin={handleLogin} onNavigate={(p) => setRoute(p as AppRoute)} />;
    case 'SOLUTIONS': return <GenericPage title="Solutions" subtitle="Enterprise-grade infrastructure." onBack={() => setRoute('HOME')} onCta={handleStartSimulation} onNavigate={(p) => setRoute(p as AppRoute)} onLogin={handleLogin} activePageId="SOLUTIONS" />;
    case 'MARKETPLACE':
    case 'PROJECTS': return <ProjectsPage projects={projects} onBack={() => setRoute('HOME')} onLogin={handleLogin} onSelectProject={handleSelectProject} onNavigate={(p) => setRoute(p as AppRoute)} />;
    case 'TRADING': return <SecondaryMarketPage listings={listings} onBack={() => setRoute('HOME')} onNavigate={(p) => setRoute(p as AppRoute)} onLogin={handleLogin} onListToken={handleListToken} isEmbedded={false} />;
    case 'PROJECT_DETAILS':
        if (!selectedProject) return <ProjectsPage projects={projects} onBack={() => setRoute('HOME')} onLogin={handleLogin} onSelectProject={handleSelectProject} onNavigate={(p) => setRoute(p as AppRoute)} />;
        return <ProjectDetailsPage project={selectedProject} onBack={() => setRoute('PROJECTS')} onInvest={handleInvest} />;
    case 'DEVELOPERS': return <GenericPage title="Developer API" subtitle="Integrate our compliance layer." onBack={() => setRoute('HOME')} onCta={handleStartSimulation} onNavigate={(p) => setRoute(p as AppRoute)} onLogin={handleLogin} activePageId="DEVELOPERS" />;
    case 'PRICING': return <GenericPage title="Pricing" subtitle="Transparent pricing." onBack={() => setRoute('HOME')} onCta={handleStartSimulation} onNavigate={(p) => setRoute(p as AppRoute)} onLogin={handleLogin} activePageId="PRICING" />;
    case 'SIM_INTRO': return <CategoryPage onSelect={handleCategorySelect} onBack={() => setRoute('HOME')} />;
    case 'SIM_WIZARD': return <WizardPage currentStep={currentStep} data={data} isStepValid={isStepValid} onNext={handleWizardNext} onBack={handleWizardBack} updateData={updateData} setIsStepValid={setIsStepValid} onCancel={() => setRoute('HOME')} />;
    case 'SIM_DEPLOY': return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><DeployView onComplete={handleDeployComplete} /></div>;
    case 'SIM_AUTH': return <AuthModal onSuccess={handleAuthSuccess} onBack={() => setRoute('HOME')} />;
    case 'DASHBOARD': return <DashboardPage projects={projects} onCreateNew={handleDashboardCreateNew} onLogout={handleLogout} onGoHome={() => setRoute('HOME')} onGoToTrading={() => setRoute('TRADING')} />;
    default: return <div>Error: Unknown Route</div>;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}