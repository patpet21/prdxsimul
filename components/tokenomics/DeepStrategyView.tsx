
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { AssetData, ProjectInfo } from '../../types';
import { generateDeepStrategy } from '../../services/mockAiService';

interface DeepStrategyViewProps {
  asset: AssetData;
  project: ProjectInfo;
}

export const DeepStrategyView: React.FC<DeepStrategyViewProps> = ({ asset, project }) => {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<{
    elevator_pitch: string;
    investor_persona: { title: string, description: string };
    liquidity_thesis: string;
    market_timing: string;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateDeepStrategy(asset, project);
    setStrategy(result);
    setLoading(false);
  };

  if (!strategy && !loading) {
    return (
      <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10">
                <span className="text-4xl">🧠</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 font-display">Deep Strategy Engine</h3>
            <p className="text-slate-400 max-w-lg mx-auto mb-10 text-lg">
                Go beyond simple numbers. Generate a compelling narrative, investor personas, and a "Why Now" thesis to master your pitch.
            </p>
            <Button onClick={handleGenerate} className="px-10 py-4 text-lg shadow-xl shadow-brand-500/20 bg-white text-slate-900 hover:bg-brand-50">
                Generate Educational Strategy
            </Button>
        </div>
      </div>
    );
  }

  if (loading) {
      return (
          <div className="bg-white rounded-3xl p-16 border border-slate-200 flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative mb-6">
                  <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-brand-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-slate-900 font-bold text-lg animate-pulse">Consulting Investment Bankers...</p>
              <p className="text-slate-500 mt-2 text-sm">Analyzing Market Trends for {asset.category}...</p>
          </div>
      )
  }

  return (
    <div className="space-y-8 animate-fadeIn">
       
       {/* 1. The Killer Hook */}
       <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-20">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
           </div>
           <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                   <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">The Elevator Pitch</span>
               </div>
               <h2 className="text-2xl md:text-3xl font-display font-bold leading-relaxed">
                   "{strategy?.elevator_pitch}"
               </h2>
           </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* 2. Investor Persona */}
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
               <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                   🎯
               </div>
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ideal Investor Profile</h4>
               <h3 className="text-xl font-bold text-slate-900 mb-2">{strategy?.investor_persona.title}</h3>
               <p className="text-slate-600 leading-relaxed text-sm">
                   {strategy?.investor_persona.description}
               </p>
           </div>

           {/* 3. The "Why Now" */}
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
               <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                   ⏳
               </div>
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Market Timing Thesis</h4>
               <h3 className="text-xl font-bold text-slate-900 mb-2">Why Launch Now?</h3>
               <p className="text-slate-600 leading-relaxed text-sm">
                   {strategy?.market_timing}
               </p>
           </div>
       </div>

       {/* 4. Liquidity Simulation Visual */}
       <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 text-white relative">
           <div className="flex items-center gap-4 mb-6">
               <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
               </div>
               <div>
                   <h3 className="text-lg font-bold">Liquidity Value Add</h3>
                   <p className="text-xs text-slate-400 uppercase tracking-wider">Traditional vs Tokenized</p>
               </div>
           </div>
           
           <p className="text-slate-300 mb-6 text-sm leading-relaxed border-l-2 border-emerald-500 pl-4">
               {strategy?.liquidity_thesis}
           </p>

           {/* Mock Chart */}
           <div className="bg-slate-800/50 rounded-xl p-4 flex items-end justify-between h-32 gap-4">
               <div className="w-full bg-slate-700 rounded-t-lg h-[40%] relative group">
                   <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">Illiquid</span>
               </div>
               <div className="w-full bg-slate-600 rounded-t-lg h-[50%] relative group">
                   <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">REIT</span>
               </div>
               <div className="w-full bg-emerald-500 rounded-t-lg h-[90%] relative group shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                   <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-emerald-400 font-bold">Tokenized</span>
               </div>
           </div>
           <div className="flex justify-between text-xs text-slate-500 mt-2 px-2">
               <span>Private Deal</span>
               <span>Public REIT</span>
               <span>Security Token</span>
           </div>
       </div>
    </div>
  );
};
