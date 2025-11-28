
import React, { useEffect, useState } from 'react';
import { StepProps, TokenizationCategory } from '../types';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { ASSET_CLASS_LEARNING } from '../content/projectVisionContent';
import { improveProjectDescription } from '../services/mockAiService';

export const ProjectInitiationStep: React.FC<StepProps> = ({ data, updateData, onValidationChange }) => {
  const { projectInfo, property } = data;
  const [isImproving, setIsImproving] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    // Validate that critical fields are present
    const isValid = Boolean(
      projectInfo.projectName && 
      projectInfo.projectGoal && 
      projectInfo.description && 
      projectInfo.description.length > 20
    );
    onValidationChange(isValid);
  }, [projectInfo, onValidationChange]);

  const handleChange = (field: string, val: any) => {
    updateData('projectInfo', { [field]: val });
  };

  const handleAssetClassChange = (val: TokenizationCategory) => {
    updateData('projectInfo', { assetClass: val });
    updateData('property', { category: val });
  };

  const handleImproveDescription = async () => {
    if (!projectInfo.description || projectInfo.description.length < 5) return;
    setIsImproving(true);
    setSuggestion(null);
    const improved = await improveProjectDescription(projectInfo, currentAssetClass as TokenizationCategory);
    if (improved) {
      setSuggestion(improved);
    }
    setIsImproving(false);
  };

  const applySuggestion = () => {
    if (suggestion) {
        handleChange('description', suggestion);
        setSuggestion(null);
    }
  };

  // Complexity Score Logic
  const getComplexityScore = (): { score: 'Low' | 'Medium' | 'High'; color: string; bg: string } => {
    const cat = currentAssetClass;
    const amount = projectInfo.targetRaiseAmount || 0;
    
    if (cat === 'Funds' || cat === 'Business') return { score: 'High', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' };
    if (amount > 5000000) return { score: 'High', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' };
    if (amount > 1000000 || cat === 'Debt') return { score: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' };
    
    return { score: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' };
  };

  const currentAssetClass = projectInfo.assetClass || property.category || 'Real Estate';
  const learningData = ASSET_CLASS_LEARNING[currentAssetClass as keyof typeof ASSET_CLASS_LEARNING] || ASSET_CLASS_LEARNING['Other'];
  const complexity = getComplexityScore();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-100 pb-6">
        <h2 className="text-3xl font-bold font-display text-slate-900">Project Vision</h2>
        <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
           Start by defining the "DNA" of your project. Our AI uses this to tailor legal structures and valuation models in later steps.
        </p>
      </div>

      {/* Asset Selection Card */}
      <div className="bg-indigo-50/40 rounded-2xl p-6 border border-indigo-100/50">
           <div className="flex flex-col md:flex-row gap-6 mb-8">
               <div className="flex-1">
                   <Select 
                     id="assetClass"
                     label="Primary Asset Class"
                     value={currentAssetClass}
                     onChange={(e) => handleAssetClassChange(e.target.value as TokenizationCategory)}
                     options={[
                       { value: 'Real Estate', label: 'Real Estate' },
                       { value: 'Business', label: 'Company Equity / Business' },
                       { value: 'Art', label: 'Art & Collectibles' },
                       { value: 'Debt', label: 'Debt Instruments' },
                       { value: 'Funds', label: 'Investment Funds' },
                       { value: 'Other', label: 'Other / Custom' },
                     ]}
                     className="bg-white shadow-sm"
                   />
               </div>
               
               <div className="md:w-1/3">
                  <label className="text-xs uppercase tracking-wider font-bold text-slate-400 ml-1 mb-2 block">Tokenization Complexity</label>
                  <div className={`flex items-center justify-between p-3.5 rounded-xl border ${complexity.bg}`}>
                      <span className={`font-bold text-sm uppercase ${complexity.color}`}>Level: {complexity.score}</span>
                      <div className={`w-2 h-2 rounded-full ${complexity.score === 'Low' ? 'bg-emerald-500' : complexity.score === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse`}></div>
                  </div>
               </div>
           </div>

           {/* Micro-Learning Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {/* KPI Card */}
               <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-100 group h-full">
                   <div className="flex items-center gap-2 mb-3">
                       <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg">📊</div>
                       <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wide">Key KPIs</h4>
                   </div>
                   <ul className="space-y-2">
                       {learningData.kpis?.map((kpi: string, i: number) => (
                           <li key={i} className="text-xs text-slate-500 font-medium flex items-center gap-2">
                               <span className="w-1 h-1 rounded-full bg-blue-400"></span> {kpi}
                           </li>
                       ))}
                   </ul>
               </div>

               {/* Investor Focus Card */}
               <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-purple-100 group h-full">
                   <div className="flex items-center gap-2 mb-3">
                       <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-lg">👀</div>
                       <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wide">Investor Focus</h4>
                   </div>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">
                       {learningData.investorFocus}
                   </p>
               </div>

               {/* Warning Card */}
               <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-amber-100 group h-full relative overflow-hidden">
                   <div className="absolute -top-6 -right-6 w-16 h-16 bg-amber-50 rounded-full"></div>
                   <div className="flex items-center gap-2 mb-3 relative z-10">
                       <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-lg">⚠️</div>
                       <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wide">Risk Watch</h4>
                   </div>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium relative z-10">
                       {learningData.warning}
                   </p>
               </div>
           </div>
      </div>

      {/* Main Form Fields */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Input 
            id="pname" 
            label="Project Name" 
            placeholder="e.g. Green Valley Resort or BioTech Series A"
            value={projectInfo.projectName} 
            onChange={e => handleChange('projectName', e.target.value)} 
            className="md:col-span-1"
          />
          
          <Select 
            id="pgoal" 
            label="Primary Goal"
            value={projectInfo.projectGoal}
            onChange={e => handleChange('projectGoal', e.target.value)}
            options={[
              { value: 'Capital Raise', label: 'Raise Capital (Equity/Debt)' },
              { value: 'Liquidity', label: 'Liquidity for Existing Owners' },
              { value: 'Community', label: 'Community Ownership / DAO' },
              { value: 'Exit', label: 'Exit Strategy / Sale' },
              { value: 'DeFi Collateral', label: 'Use as DeFi Collateral' },
            ]}
          />

           <Input 
            id="target" 
            label="Target Raise Amount ($)" 
            type="number"
            placeholder="5000000"
            value={projectInfo.targetRaiseAmount || ''} 
            onChange={e => handleChange('targetRaiseAmount', parseFloat(e.target.value))} 
          />
           <Input 
            id="web" 
            label="Website (Optional)" 
            placeholder="https://..."
            value={projectInfo.website || ''} 
            onChange={e => handleChange('website', e.target.value)} 
          />
        </div>

        {/* Description Section */}
        <div>
          <div className="flex justify-between items-end mb-3">
              <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">
                Project Description & Strategy
                <span className="ml-2 text-[10px] font-normal text-slate-400 lowercase">(min 20 chars)</span>
              </label>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleImproveDescription}
                isLoading={isImproving}
                disabled={!projectInfo.description || projectInfo.description.length < 10}
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-100 h-8 text-xs"
              >
                 ✨ Improve with AI
              </Button>
          </div>
          <div className="relative group">
              <textarea 
                className="w-full h-40 p-5 text-slate-700 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all leading-relaxed shadow-sm hover:border-slate-300 resize-none"
                placeholder="Describe the asset, the business model, and why investors should care. The more detail, the better the AI analysis."
                value={projectInfo.description}
                onChange={e => handleChange('description', e.target.value)}
              />
              {isImproving && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 transition-all">
                      <div className="flex items-center gap-3 text-indigo-600 font-bold animate-pulse">
                          <span className="text-2xl">✨</span> 
                          <span>Rewriting for institutional clarity...</span>
                      </div>
                  </div>
              )}
          </div>

          {/* New Suggestion UI */}
          {suggestion && (
            <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4 animate-fadeIn relative shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600 shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-indigo-900 mb-1">AI Suggestion</h4>
                        <p className="text-sm text-indigo-800/80 mb-3">We improved your description to sound more professional for institutional investors.</p>
                        <div className="bg-white p-3 rounded-lg border border-indigo-100 text-sm text-slate-700 leading-relaxed mb-4 shadow-sm">
                            {suggestion}
                        </div>
                        <div className="flex gap-3">
                            <Button size="sm" onClick={applySuggestion} className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200">
                                Use This Version
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setSuggestion(null)} className="text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                                Dismiss
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </div>

        {/* AI Tip Footer */}
        <div className="bg-brand-50/50 border border-brand-100 rounded-xl p-5 flex items-start gap-4 shadow-sm">
           <div className="mt-0.5 text-brand-600 bg-brand-100 p-1.5 rounded-lg">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <p className="text-sm text-brand-900 leading-relaxed font-medium opacity-90">
             <strong>AI Strategy Tip:</strong> Your choice of <strong>Asset Class</strong> and <strong>Description</strong> heavily influences the AI's recommendations for legal structures (SPVs) and compliance frameworks in the next steps. Be precise!
           </p>
        </div>

      </div>
    </div>
  );
};
