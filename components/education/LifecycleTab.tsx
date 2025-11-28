
import React from 'react';
import { CaseStudyGenerator } from './CaseStudyGenerator';

export const LifecycleTab: React.FC = () => {
  return (
    <div className="space-y-12 animate-fadeIn">
      
      {/* 1. Lifecycle Visualization */}
      <div className="space-y-6">
         <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 font-display mb-3">Asset Lifecycle</h2>
            <p className="text-slate-500 text-lg">
                From the moment a deal is originated to the final exit. Here is how a digital asset lives and breathes on the blockchain.
            </p>
         </div>

         <div className="relative">
             {/* Timeline Line */}
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-brand-200 to-slate-200 -translate-y-1/2 rounded-full -z-10"></div>
             
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {[
                     { 
                         step: "01", 
                         title: "Origination & SPV", 
                         desc: "Setup Legal Wrapper", 
                         details: "Valuation, Due Diligence, Incorporation of the SPV.",
                         color: "bg-slate-900 text-white" 
                     },
                     { 
                         step: "02", 
                         title: "Tokenization", 
                         desc: "Minting & Compliance", 
                         details: "Smart Contracts deployed. KYC/AML rules embedded.",
                         color: "bg-brand-600 text-white" 
                     },
                     { 
                         step: "03", 
                         title: "Distribution", 
                         desc: "Primary Sale (STO)", 
                         details: "Investors buy tokens. Capital is released to the issuer.",
                         color: "bg-indigo-600 text-white" 
                     },
                     { 
                         step: "04", 
                         title: "Management", 
                         desc: "Secondary & Yield", 
                         details: "Auto-dividends, voting, and P2P trading.",
                         color: "bg-emerald-600 text-white" 
                     },
                 ].map((stage, i) => (
                     <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mb-4 ${stage.color} shadow-lg`}>
                             {stage.step}
                         </div>
                         <h3 className="font-bold text-lg text-slate-900 mb-1">{stage.title}</h3>
                         <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-3">{stage.desc}</p>
                         <p className="text-sm text-slate-500 leading-relaxed">{stage.details}</p>
                     </div>
                 ))}
             </div>
         </div>
      </div>

      {/* 2. AI Case Study Generator */}
      <CaseStudyGenerator />

      {/* 3. Famous Examples Grid (Static) */}
      <div>
         <h3 className="text-xl font-bold text-slate-900 font-display mb-6 px-2">Famous Tokenization Success Stories</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
                 {
                     title: "St. Regis Aspen",
                     tag: "Real Estate",
                     amount: "$18M Raised",
                     desc: "One of the first high-profile trophy assets tokenized. Investors bought 'Aspen Coins' representing equity in the luxury resort.",
                     logo: "🏨"
                 },
                 {
                     title: "RealT",
                     tag: "Residential",
                     amount: "$50M+ TVL",
                     desc: "A platform tokenizing hundreds of single-family homes in the US. Investors get daily rent payouts.",
                     logo: "🏠"
                 },
                 {
                     title: "KKR Health Care Fund",
                     tag: "Private Equity",
                     amount: "Institutional",
                     desc: "KKR tokenized a portion of its Health Care Strategic Growth Fund on Avalanche, opening PE to wider access.",
                     logo: "🏥"
                 }
             ].map((ex, i) => (
                 <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:bg-white hover:border-brand-200 transition-colors group">
                     <div className="flex justify-between items-start mb-4">
                         <div className="text-4xl">{ex.logo}</div>
                         <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-slate-200 shadow-sm">{ex.amount}</span>
                     </div>
                     <h4 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-brand-600 transition-colors">{ex.title}</h4>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">{ex.tag}</span>
                     <p className="text-sm text-slate-600 leading-relaxed">{ex.desc}</p>
                 </div>
             ))}
         </div>
      </div>

    </div>
  );
};
