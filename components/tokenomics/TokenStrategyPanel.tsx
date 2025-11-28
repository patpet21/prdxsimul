
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { AssetData, ProjectInfo, JurisdictionData } from '../../types';
import { generateTokenStrategy } from '../../services/mockAiService';

interface TokenStrategyPanelProps {
  asset: AssetData;
  project: ProjectInfo;
  jurisdiction: JurisdictionData;
}

export const TokenStrategyPanel: React.FC<TokenStrategyPanelProps> = ({ asset, project, jurisdiction }) => {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<{
    whyTokenize: string[];
    taxStrategy: string;
    marketPositioning: string;
    educationalNote: string;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateTokenStrategy(asset, project, jurisdiction);
    setStrategy(result);
    setLoading(false);
  };

  if (!strategy && !loading) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">Unlock Strategic Insights</h3>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
            Our AI will analyze your {asset.category} asset in {jurisdiction.country} to generate a bespoke tax and marketing strategy.
        </p>
        <Button onClick={handleGenerate} className="px-8 py-3 shadow-xl shadow-indigo-500/20">
            Generate Education Strategy
        </Button>
      </div>
    );
  }

  if (loading) {
      return (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium animate-pulse">Consulting Global Database...</p>
          </div>
      )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
       {/* Educational Note */}
       <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
           <div className="relative z-10">
               <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Why Tokenize?</h4>
               <ul className="space-y-3">
                   {strategy?.whyTokenize.map((reason, i) => (
                       <li key={i} className="flex items-start gap-3">
                           <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 mt-0.5">✓</div>
                           <span className="text-slate-200 text-sm leading-relaxed">{reason}</span>
                       </li>
                   ))}
               </ul>
           </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Tax Strategy */}
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>
               </div>
               <h4 className="font-bold text-slate-900 mb-2">Tax Efficiency</h4>
               <p className="text-sm text-slate-600 leading-relaxed">
                   {strategy?.taxStrategy}
               </p>
           </div>

           {/* Market Positioning */}
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mb-4">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
               </div>
               <h4 className="font-bold text-slate-900 mb-2">Market Positioning</h4>
               <p className="text-sm text-slate-600 leading-relaxed">
                   {strategy?.marketPositioning}
               </p>
           </div>
       </div>

       {/* Did You Know? */}
       <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-4 items-center">
           <span className="text-2xl">💡</span>
           <p className="text-sm text-indigo-800 font-medium">
               {strategy?.educationalNote}
           </p>
       </div>
    </div>
  );
};
