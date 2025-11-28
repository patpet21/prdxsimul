import React, { useState, useCallback, useEffect, ReactNode, Component, ErrorInfo } from 'react';
import { TokenizationState, Project, TokenizationCategory } from './types';
import { DeployView } from './components/DeployView';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { WizardPage } from './pages/WizardPage';
import { CategoryPage } from './pages/CategoryPage';
import { GenericPage } from './pages/GenericPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { supabase } from './lib/supabase';

// --- CONFIG & MOCK DATA ---

const INITIAL_PROJECTS: Project[] = [
  { id: '1', title: 'Skyline Tower A', category: 'Real Estate', valuation: 15000000, status: 'Live', progress: 100, imageColor: 'bg-indigo-500', lastUpdated: '2h ago' },
  { id: '2', title: 'TechFlow SaaS', category: 'Business', valuation: 5000000, status: 'Deploying', progress: 75, imageColor: 'bg-emerald-500', lastUpdated: '1d ago' },
  { id: '3', title: 'Warhol Collection', category: 'Art', valuation: 2500000, status: 'Draft', progress: 30, imageColor: 'bg-rose-500', lastUpdated: '3d ago' },
];

const INITIAL_STATE: TokenizationState = {
  projectInfo: {
    projectName: '',
    projectGoal: 'Capital Raise',
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
  asset: { 
    category: 'Real Estate', 
    assetName: '', 
    valuation: 0, 
    currency: 'USD',
    financials: {
      appraisalValue: 0
    },
    images: []
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
  tokenomics: { 
    tokenName: '', 
    tokenSymbol: '', 
    totalSupply: 0, 
    pricePerToken: 0, 
    hardCap: 0, 
    softCap: 0, 
    lockupPeriodMonths: 12,
    vestingSchedule: 'None',
    dividendPolicy: 'None',
    votingRights: false,
    allocation: {
      founders: 0,
      investors: 0,
      treasury: 0,
      advisors: 0
    }
  },
  distribution: { targetInvestorType: 'Accredited', minInvestment: 5000, maxInvestment: 0, marketingChannels: [] }
};

// Pure Routing State
type AppRoute = 
  | 'HOME'            // Landing Page (Public)
  | 'SOLUTIONS'       // Static Page
  | 'MARKETPLACE'     // Static Page (Now acts as Projects Viewer)
  | 'DEVELOPERS'      // Static Page
  | 'PRICING'         // Static Page
  | 'PROJECTS'        // New Public Projects Gallery
  | 'SIM_INTRO'       // Category Selection (Public - Standalone)
  | 'SIM_WIZARD'      // The actual steps (Public - Standalone)
  | 'SIM_DEPLOY'      // Blockchain Simulation (Public - Standalone)
  | 'SIM_AUTH'        // Gate before Dashboard (Private Transition)
  | 'DASHBOARD';      // Authenticated Area (Private)

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4 text-center">
          <div className="max-w-md bg-white p-8 rounded-xl shadow-xl border border-red-100">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h1 className="text-xl font-bold text-red-700 mb-2">Application Error</h1>
            <p className="text-slate-600 mb-6 text-sm">We encountered an unexpected issue. Please reload the simulator.</p>
            <details className="text-left text-xs text-red-400 bg-red-50 p-3 rounded mb-6 overflow-auto max-h-32">
                {this.state.error?.message}
            </details>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium w-full"
            >
              Reload Application
            </button>
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
  
  // Check for active session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // User is logged in
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && route === 'SIM_AUTH') {
        setRoute('DASHBOARD');
      }
    });

    return () => subscription.unsubscribe();
  }, [route]);

  // Data Manager
  const updateData = useCallback((section: keyof TokenizationState, payload: any) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], ...payload } }));
  }, []);

  // --- NAVIGATION ACTIONS ---

  // 1. Start Flow from Home
  const handleStartSimulation = () => {
    setData(INITIAL_STATE); // Reset state for new sim
    setRoute('SIM_INTRO');
  };

  const handleLogin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setRoute('DASHBOARD');
    } else {
      setRoute('SIM_AUTH'); 
    }
  };

  // 2. Category Selected -> Go to Wizard
  const handleCategorySelect = (category: TokenizationCategory) => {
    setData(prev => ({ ...prev, asset: { ...prev.asset, category } }));
    setCurrentStep(0);
    setRoute('SIM_WIZARD');
  };

  // 3. Wizard Navigation
  const handleWizardNext = () => {
    if (currentStep < 6) { // Now 6 steps (0-6)
      setCurrentStep(prev => prev + 1);
      setIsStepValid(false); 
    } else {
      setRoute('SIM_DEPLOY');
    }
  };

  const handleWizardBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setIsStepValid(true);
    } else {
      setRoute('SIM_INTRO');
    }
  };

  // 4. Simulation Completion
  const handleDeployComplete = () => {
    // Add new project to dashboard list locally
    const newProject: Project = {
      id: Math.random().toString(),
      title: data.projectInfo.projectName || data.asset.assetName || 'New Simulation',
      category: data.asset.category,
      valuation: data.asset.valuation || 1000000,
      status: 'Live',
      progress: 100,
      imageColor: 'bg-brand-500',
      lastUpdated: 'Just now'
    };
    setProjects(prev => [newProject, ...prev]);
    // Redirect to the Public Projects page instead of Auth
    setRoute('PROJECTS'); 
  };

  const handleAuthSuccess = () => {
    setRoute('DASHBOARD');
  };

  const handleDashboardCreateNew = () => {
    setData(INITIAL_STATE);
    setRoute('SIM_INTRO');
  }
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRoute('HOME');
  }

  // --- VIEW RENDERING ---

  switch (route) {
    case 'HOME':
      return <HomePage onStartSimulation={handleStartSimulation} onLogin={handleLogin} onNavigate={(p) => setRoute(p as AppRoute)} />;
    
    // Static Pages
    case 'SOLUTIONS':
      return <GenericPage title="Solutions" subtitle="Enterprise-grade infrastructure for Real Estate syndicators and Private Equity funds." onBack={() => setRoute('HOME')} onCta={handleStartSimulation} />;
    case 'MARKETPLACE':
       return <ProjectsPage projects={projects} onBack={() => setRoute('HOME')} onLogin={handleLogin} />;
    case 'PROJECTS':
       return <ProjectsPage projects={projects} onBack={() => setRoute('HOME')} onLogin={handleLogin} />;
    case 'DEVELOPERS':
       return <GenericPage title="Developer API" subtitle="Integrate our compliance and settlement layer directly into your application." onBack={() => setRoute('HOME')} onCta={handleStartSimulation} />;
    case 'PRICING':
       return <GenericPage title="Pricing" subtitle="Transparent pricing scaling with your Assets Under Management (AUM)." onBack={() => setRoute('HOME')} onCta={handleStartSimulation} />;

    case 'SIM_INTRO':
      return <CategoryPage onSelect={handleCategorySelect} onBack={() => setRoute('HOME')} />;

    case 'SIM_WIZARD':
      return (
        <WizardPage 
          currentStep={currentStep}
          data={data}
          isStepValid={isStepValid}
          onNext={handleWizardNext}
          onBack={handleWizardBack}
          updateData={updateData}
          setIsStepValid={setIsStepValid}
          onCancel={() => setRoute('HOME')}
        />
      );

    case 'SIM_DEPLOY':
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <DeployView onComplete={handleDeployComplete} />
        </div>
      );

    case 'SIM_AUTH':
      return <AuthModal onSuccess={handleAuthSuccess} />;

    case 'DASHBOARD':
      return (
        <DashboardPage 
          projects={projects} 
          onCreateNew={handleDashboardCreateNew} 
          onLogout={handleLogout}
        />
      );
    
    default:
      return <div>Error: Unknown Route</div>;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}