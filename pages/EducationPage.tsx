import React, { useState } from 'react';
import { BasicsTab } from '../components/education/BasicsTab';
import { AssetTypesTab } from '../components/education/AssetTypesTab';
import { LegalTab } from '../components/education/LegalTab';
import { LifecycleTab } from '../components/education/LifecycleTab';
import { Button } from '../components/ui/Button';
import { TopNavigation } from '../components/ui/TopNavigation';
import Footer from '../components/ui/Footer';

interface EducationPageProps {
  onBack: () => void;
  onStartSimulation: () => void;
  onNavigate: (page: string) => void;
  onLogin: () => void;
}

export const EducationPage: React.FC<EducationPageProps> = ({ onBack, onStartSimulation, onNavigate, onLogin }) => {
  const [activeTab, setActiveTab] = useState(0);

  const TABS = [
    { id: 0, title: "Basics", label: "Tokenization 101" },
    { id: 1, title: "Assets", label: "What You Can Tokenize" },
    { id: 2, title: "Legal", label: "Legal Structure & Compliance" },
    { id: 3, title: "Lifecycle", label: "Lifecycle & Case Studies" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-fadeIn flex flex-col">
      
      <TopNavigation 
        onNavigate={onNavigate} 
        onLogin={onLogin} 
        onStartSimulation={onStartSimulation}
        activePage="EDUCATION" 
      />

      <main className="max-w-7xl mx-auto p-6 md:p-12 pb-24 flex-1 w-full">
        
        {/* Header */}
        <div className="mb-10 text-center">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-100">
                Knowledge Base
            </span>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-4">
              Education Center
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Master the fundamentals of Asset Tokenization, from legal structures to blockchain lifecycle, before you build your project.
            </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 md:gap-3 p-1 bg-slate-100/50 rounded-full border border-slate-200 no-scrollbar">
                {TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                    whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold transition-all
                    ${activeTab === tab.id 
                        ? 'bg-white text-slate-900 shadow-md shadow-slate-200 ring-1 ring-slate-200' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }
                    `}
                >
                    {tab.label}
                </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px] animate-slideUp">
            {activeTab === 0 && <BasicsTab />}
            {activeTab === 1 && <AssetTypesTab />}
            {activeTab === 2 && <LegalTab />}
            {activeTab === 3 && <LifecycleTab />}
        </div>

        {/* Footer CTA */}
        <div className="mt-20 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">Ready to apply what you learned?</h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                    Start the simulation to structure your SPV and mint your security tokens in minutes.
                </p>
                <Button onClick={onStartSimulation} className="px-8 py-3 text-lg shadow-xl shadow-brand-500/20">
                    Start Free Simulation
                </Button>
            </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};