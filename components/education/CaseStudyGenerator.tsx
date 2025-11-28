
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { generateCaseStudy, CaseStudy } from '../../services/mockAiService';

export const CaseStudyGenerator: React.FC = () => {
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [study, setStudy] = useState<CaseStudy | null>(null);

  const handleGenerate = async () => {
    if (!industry) return;
    setLoading(true);
    // Simulate thinking time
    await new Promise(r => setTimeout(r, 1000));
    const result = await generateCaseStudy(industry);
    setStudy(result);
    setLoading(false);
  };

  const suggestions = ["Luxury Real Estate", "Green Energy", "Private Equity", "Fine Art", "Whiskey Casks"];

  return (
    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Input Section */}
            <div className="space-y-8">
                <div>
                    <div className="inline-flex items-center gap-2 mb-4 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 shadow-lg backdrop-blur-md">
                        <span className="text-lg">🤖</span> AI Case Study
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold font-display mb-4 leading-tight">
                        Learn from <br/> Real Examples.
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                        Not sure how tokenization applies to your specific industry? 
                        Ask our AI to retrieve a relevant case study from its database.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-50 group-hover:opacity-100 transition duration-200 blur"></div>
                        <div className="relative flex">
                            <input 
                                type="text" 
                                placeholder="e.g. Ski Resorts in Alps" 
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                className="w-full bg-slate-900 border border-slate-700 rounded-l-xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:bg-slate-800 transition-colors text-lg"
                            />
                            <button 
                                onClick={handleGenerate} 
                                disabled={loading || !industry}
                                className="bg-white text-slate-900 font-bold px-8 rounded-r-xl hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? '...' : 'Generate'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wide mr-2 pt-1.5">Popular:</span>
                        {suggestions.map(s => (
                            <button 
                                key={s} 
                                onClick={() => setIndustry(s)}
                                className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-full transition-all text-slate-300 hover:text-white"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Result Section */}
            <div className="bg-slate-800/50 rounded-2xl p-1 border border-white/10 min-h-[350px] relative backdrop-blur-sm">
                <div className="h-full bg-slate-900/50 rounded-xl p-6 md:p-8 flex items-center justify-center relative overflow-hidden">
                    {loading ? (
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                            <p className="text-blue-400 font-bold animate-pulse text-lg">Consulting Archives...</p>
                            <p className="text-slate-500 text-sm mt-2">Analyzing {industry} trends...</p>
                        </div>
                    ) : study ? (
                        <div className="w-full animate-fadeIn text-left h-full flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                                    <div>
                                        <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">Case Study Report</div>
                                        <h4 className="text-2xl md:text-3xl font-bold font-display text-white mb-1">{study.title}</h4>
                                        <p className="text-sm text-slate-400 flex items-center gap-2">
                                            <span>📍 {study.location}</span>
                                            <span className="text-slate-600">•</span>
                                            <span>📅 {study.year}</span>
                                        </p>
                                    </div>
                                    <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-lg font-bold border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                        {study.assetValue}
                                    </div>
                                </div>
                                
                                <div className="space-y-4 mb-8">
                                    <p className="text-slate-300 leading-relaxed text-base font-light">
                                        {study.summary}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50 hover:border-amber-500/30 transition-colors group">
                                    <span className="block text-xs font-bold text-amber-500 uppercase mb-2 group-hover:text-amber-400">🏆 Success Factor</span>
                                    <p className="text-xs text-slate-300 leading-relaxed">{study.successFactor}</p>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-colors group">
                                    <span className="block text-xs font-bold text-blue-500 uppercase mb-2 group-hover:text-blue-400">🔑 Key Takeaway</span>
                                    <p className="text-xs text-slate-300 leading-relaxed">{study.keyTakeaway}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-600">
                            <div className="text-6xl mb-4 opacity-30 grayscale">📂</div>
                            <p className="text-lg font-medium">No Data Loaded</p>
                            <p className="text-sm opacity-60">Enter an industry to view a case study.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
