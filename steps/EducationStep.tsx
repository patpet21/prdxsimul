
import React, { useState, useEffect } from 'react';
import { StepProps } from '../types';
import { BasicsTab } from '../components/education/BasicsTab';
import { AssetTypesTab } from '../components/education/AssetTypesTab';
import { LegalTab } from '../components/education/LegalTab';
import { LifecycleTab } from '../components/education/LifecycleTab';

export const EducationStep: React.FC<StepProps> = ({ onValidationChange }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Education is optional/exploratory, so we can always allow proceeding
  useEffect(() => {
    onValidationChange(true);
  }, [onValidationChange]);

  const TABS = [
    { id: 0, title: "Basics", label: "Tokenization 101" },
    { id: 1, title: "Assets", label: "What You Can Tokenize" },
    { id: 2, title: "Legal", label: "Legal Structure & Compliance" },
    { id: 3, title: "Lifecycle", label: "Lifecycle & Case Studies" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-24">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900">
          Education Center
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl">
          Before structuring your project, master the fundamentals. Select a module below.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 md:gap-4 no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold transition-all border
              ${activeTab === tab.id 
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 0 && <BasicsTab />}
        {activeTab === 1 && <AssetTypesTab />}
        {activeTab === 2 && <LegalTab />}
        {activeTab === 3 && <LifecycleTab />}
      </div>
    </div>
  );
};
