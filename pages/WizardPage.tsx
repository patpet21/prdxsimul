
import React from 'react';
import { TokenizationState } from '../types';
import { Button } from '../components/ui/Button';
import { 
  ProjectInitiationStep,
  JurisdictionStep, 
  AssetStep, 
  ComplianceStep, 
  TokenomicsStep, 
  DistributionStep, 
  SummaryStep 
} from '../steps';

const WIZARD_STEPS = [
  { title: "Initiation", component: ProjectInitiationStep, desc: "Vision & Goals" },
  { title: "Jurisdiction", component: JurisdictionStep, desc: "Legal Entity & Region" },
  { title: "Asset Details", component: AssetStep, desc: "Valuation & Specs" },
  { title: "Compliance", component: ComplianceStep, desc: "KYC/AML Rules" },
  { title: "Tokenomics", component: TokenomicsStep, desc: "Supply & Price" },
  { title: "Distribution", component: DistributionStep, desc: "Investor Targeting" },
  { title: "Summary", component: SummaryStep, desc: "Review & Deploy" }
];

interface WizardPageProps {
  currentStep: number;
  data: TokenizationState;
  isStepValid: boolean;
  onNext: () => void;
  onBack: () => void;
  updateData: (section: keyof TokenizationState, payload: any) => void;
  setIsStepValid: (valid: boolean) => void;
  onCancel: () => void;
}

export const WizardPage: React.FC<WizardPageProps> = ({ 
  currentStep, 
  data, 
  isStepValid, 
  onNext, 
  onBack, 
  updateData, 
  setIsStepValid,
  onCancel
}) => {
  const CurrentStepComponent = WIZARD_STEPS[currentStep].component;
  const progressPercent = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 h-screen sticky top-0 flex-col z-20 shadow-xl shadow-slate-200/50">
        <div className="p-8 pb-4 border-b border-slate-100 shrink-0">
           <div className="flex items-center gap-2.5 mb-1 cursor-pointer" onClick={onCancel}>
             <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/20">P</div>
             <span className="font-bold font-display text-slate-900 text-xl tracking-tight">PropertyDEX</span>
           </div>
           <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-4 pl-1">Simulator Workflow</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
            {WIZARD_STEPS.map((step, idx) => {
                const isActive = idx === currentStep;
                const isCompleted = idx < currentStep;
                return (
                <div 
                    key={idx} 
                    className={`
                        relative pl-4 py-3 rounded-xl transition-all duration-300 group cursor-default
                        ${isActive ? 'bg-brand-50/50' : 'hover:bg-slate-50'}
                    `}
                >
                    {/* Connecting Line */}
                    {idx !== WIZARD_STEPS.length - 1 && (
                        <div className={`absolute left-[27px] top-[40px] bottom-[-20px] w-0.5 z-0 ${isCompleted ? 'bg-brand-200' : 'bg-slate-100'}`}></div>
                    )}
                    
                    <div className="flex items-center gap-3 relative z-10">
                        <div className={`
                            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                            ${isActive 
                                ? 'bg-brand-600 border-brand-600 text-white shadow-md scale-110' 
                                : isCompleted 
                                    ? 'bg-green-500 border-green-500 text-white' 
                                    : 'bg-white border-slate-200 text-slate-300'
                            }
                        `}>
                            {isCompleted ? '✓' : idx + 1}
                        </div>
                        <div>
                            <h4 className={`text-sm font-bold transition-colors ${isActive ? 'text-brand-900' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                                {step.title}
                            </h4>
                            <p className="text-[10px] font-medium text-slate-400 hidden group-hover:block transition-opacity">{step.desc}</p>
                        </div>
                    </div>
                </div>
                );
            })}
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0">
           <button onClick={onCancel} className="w-full text-slate-500 text-xs font-bold uppercase tracking-wider hover:text-red-600 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-red-50 transition-colors">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
             Exit Simulation
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-[100dvh] lg:h-screen overflow-hidden relative">
        
        {/* MOBILE HEADER */}
        <header className="lg:hidden bg-white border-b border-slate-200 flex flex-col shrink-0 sticky top-0 z-30 shadow-sm">
           <div className="h-14 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
                <div>
                    <h1 className="font-bold text-slate-900 text-sm leading-tight">{WIZARD_STEPS[currentStep].title}</h1>
                    <p className="text-xs text-slate-500 leading-tight">Step {currentStep + 1} of {WIZARD_STEPS.length}</p>
                </div>
              </div>
              <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>
           <div className="h-1 bg-slate-100 w-full">
              <div 
                className="h-full bg-brand-600 transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
           </div>
        </header>

        {/* CONTENT SCROLLABLE */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 w-full scroll-smooth">
           <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 pb-32 lg:pb-24">
              
              {/* Card Container for Desktop Polish */}
              <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden min-h-[600px] relative">
                  
                  {/* Decorative Header Background */}
                  <div className="h-2 bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 w-full"></div>

                  <div className="p-6 md:p-10 lg:p-12">
                    <CurrentStepComponent 
                        data={data} 
                        updateData={updateData} 
                        onValidationChange={setIsStepValid} 
                    />
                  </div>
              </div>
           </div>
        </div>

        {/* STICKY FOOTER */}
        <footer className="fixed lg:absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-md lg:bg-white border-t border-slate-200 px-4 md:px-12 py-4 flex items-center justify-between flex-shrink-0 z-40 lg:z-10 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] lg:shadow-none safe-area-bottom">
           <Button variant="ghost" onClick={onBack} disabled={currentStep === 0} className="text-slate-500 hover:text-slate-900 font-medium text-sm">
             ← Back
           </Button>
           
           <div className="flex items-center gap-4">
              <div className={`hidden md:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full ${isStepValid ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                 <span className={`w-1.5 h-1.5 rounded-full ${isStepValid ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                 {isStepValid ? 'Ready to proceed' : 'Complete required fields'}
              </div>
              <Button 
                onClick={onNext} 
                className={`
                    px-8 md:px-10 h-12 md:h-12 rounded-xl shadow-lg shadow-brand-500/30 whitespace-nowrap text-sm md:text-base font-bold transition-all transform active:scale-95
                    ${!isStepValid ? 'opacity-90 grayscale-[0.2]' : 'hover:scale-105'}
                `}
              >
                {currentStep === WIZARD_STEPS.length - 1 ? 'Deploy Asset 🚀' : 'Next Step →'}
              </Button>
           </div>
        </footer>
      </main>
    </div>
  );
};
