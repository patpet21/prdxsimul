
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { checkTokenizability, TokenizabilityReport } from '../../services/mockAiService';

interface TokenizabilityCheckerProps {
  selectedCategory?: string;
}

export const TokenizabilityChecker: React.FC<TokenizabilityCheckerProps> = ({ selectedCategory }) => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<TokenizabilityReport | null>(null);

  const handleAnalyze = async () => {
    if (!description || description.length < 5) return;
    setIsAnalyzing(true);
    // Simulate a slightly longer "thinking" time for effect
    await new Promise(r => setTimeout(r, 800));
    const result = await checkTokenizability(description, selectedCategory);
    setReport(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mt-10 transition-all hover:shadow-2xl duration-500">
      {/* Header */}
      <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-lg shadow-inner">
                        🤖
                    </span>
                    <h3 className="text-xl font-bold font-display tracking-tight">AI Asset-Fit Analysis</h3>
                </div>
                <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                    Not sure if your asset is ready for the blockchain? Describe it below. 
                    Our AI will evaluate valuation, legal feasibility, and cashflow potential instantly.
                </p>
            </div>
            {selectedCategory && (
                <div className="hidden md:block text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Context</div>
                    <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold border border-white/10 inline-block">
                        {selectedCategory}
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="p-6 md:p-10 bg-slate-50/50">
        {!report ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-4 focus-within:ring-brand-500/10 focus-within:border-brand-500 transition-all">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Asset Description {selectedCategory ? `(Focus on: ${selectedCategory})` : ''}
              </label>
              <textarea 
                className="w-full h-32 p-0 bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 text-lg leading-relaxed resize-none"
                placeholder="e.g. I own a boutique hotel in Rome worth €5M with 80% occupancy. I want to raise €500k for renovations in exchange for a revenue share..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    AI Model Ready
                </div>
                <Button 
                    onClick={handleAnalyze} 
                    isLoading={isAnalyzing}
                    disabled={!description || description.length < 10}
                    className="px-8 py-3 text-base shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transform hover:-translate-y-0.5 transition-all"
                >
                    Generate Report
                </Button>
            </div>
          </div>
        ) : (
          <div className="animate-slideUp space-y-8">
            {/* Report Header */}
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-between border-b border-slate-200 pb-8">
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-3">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${report.isTokenizable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {report.isTokenizable ? 'Tokenizable Asset' : 'Not Suitable'}
                        <span className={`w-2 h-2 rounded-full ${report.isTokenizable ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                 </div>
                 
                 <h4 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-2 font-display">
                   {report.mainVerdict}
                 </h4>
                 <p className="text-slate-500">Based on your description of <span className="font-semibold text-slate-700">"{description.substring(0, 40)}..."</span></p>
              </div>

              {/* Confidence Score */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center min-w-[140px]">
                <div className="relative w-20 h-20 mb-2">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                        <circle cx="40" cy="40" r="36" stroke={report.confidenceScore > 75 ? '#10b981' : '#f59e0b'} strokeWidth="8" 
                            strokeDasharray={226} 
                            strokeDashoffset={226 - (226 * report.confidenceScore) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out" fill="none" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-700">
                        {report.confidenceScore}%
                    </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confidence</span>
              </div>
            </div>

            {/* Analysis Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left Col: Points */}
               <div className="lg:col-span-2">
                  <h5 className="font-bold text-slate-900 mb-5 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <span className="w-1.5 h-6 bg-brand-500 rounded-full"></span> 
                    Feasibility Analysis
                  </h5>
                  <div className="space-y-4">
                    {report.analysisPoints.map((point, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm transition-all hover:border-brand-200">
                        <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {i+1}
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium pt-1.5">{point}</p>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Right Col: Structure & Next Steps */}
               <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                     <h5 className="font-bold text-indigo-100 mb-1 text-[10px] uppercase tracking-widest">Recommended Structure</h5>
                     <p className="text-xl font-bold font-display mb-4">{report.recommendedStructure}</p>
                     <div className="h-px bg-white/20 w-full mb-4"></div>
                     <h5 className="font-bold text-indigo-100 mb-2 text-[10px] uppercase tracking-widest">Next Action</h5>
                     <p className="text-sm text-indigo-50 leading-relaxed opacity-90">{report.nextSteps}</p>
                  </div>
               </div>
            </div>

            <div className="pt-8 flex justify-center">
               <button 
                 onClick={() => { setReport(null); setDescription(''); }}
                 className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors px-4 py-2 rounded-lg hover:bg-slate-100"
               >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                 Analyze Another Asset
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
