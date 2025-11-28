
import React from 'react';
import { JurisdictionMatchmaker } from './JurisdictionMatchmaker';
import { SpvExplainer } from './SpvExplainer';
import { JurisdictionComparator } from './JurisdictionComparator';
import { GeneralRequirementsChecklist } from './GeneralRequirementsChecklist';
import { StructureComparator } from './StructureComparator';

export const LegalTab: React.FC = () => {
  return (
    <div className="space-y-12 animate-fadeIn">
      
      {/* Hero Section: The Core Message */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 bg-white/10 text-white/90 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">
            <span className="text-lg">⚖️</span> The Reality Check
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white font-display leading-tight mb-6">
            "This isn't improvised crypto.<br/>
            It is <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-brand-400">Regulated Finance</span>."
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Unlike a meme-coin, a Security Token represents real ownership in a legal entity. 
            It requires a bridge between the blockchain and the court of law.
          </p>
        </div>
      </div>

      {/* NEW: AI JURISDICTION MATCHMAKER */}
      <JurisdictionMatchmaker />

      {/* NEW: SIDE-BY-SIDE COMPARATOR */}
      <StructureComparator />

      {/* NEW: AI HELPER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <SpvExplainer />
         <JurisdictionComparator />
      </div>

      {/* NEW: AI HELPER 3 (Full Width) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
             <GeneralRequirementsChecklist />
          </div>
          <div className="md:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
               </div>
               
               <h3 className="text-2xl font-bold text-slate-900 font-display mb-4 flex items-center gap-3">
                 <span className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">🏢</span>
                 The SPV (Legal Wrapper)
               </h3>
               <p className="text-slate-600 mb-6 leading-relaxed">
                 Think of an SPV (Special Purpose Vehicle) as a dedicated <strong>"Vault"</strong> for your asset. It is a company created for one specific purpose: to hold the asset and nothing else.
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg">
                     <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">1</div>
                     <div>
                       <span className="block font-bold text-slate-800 text-sm">Legal Protection</span>
                       <span className="text-xs text-slate-500">Asset is safe from parent bankruptcy.</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg">
                     <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">2</div>
                     <div>
                       <span className="block font-bold text-slate-800 text-sm">Governance</span>
                       <span className="text-xs text-slate-500">Defines voting and payout rights.</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg">
                     <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">3</div>
                     <div>
                       <span className="block font-bold text-slate-800 text-sm">Tax Clarity</span>
                       <span className="text-xs text-slate-500">Pass-through taxation structures.</span>
                     </div>
                  </div>
               </div>
          </div>
      </div>

      {/* Section 2: Compliance & The Offering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Compliance Card */}
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                 <span className="text-amber-500">🛡️</span> What is Compliance?
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                 In crypto, "Code is Law". In Tokenization, <strong>"Law is Law"</strong>. We enforce rules via code:
              </p>
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="block font-bold text-slate-700 text-xs uppercase mb-1">KYC</span>
                    <span className="text-xs text-slate-500 leading-snug">"Know Your Customer". Verifying ID passports.</span>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="block font-bold text-slate-700 text-xs uppercase mb-1">AML</span>
                    <span className="text-xs text-slate-500 leading-snug">"Anti-Money Laundering". Checking source of funds.</span>
                 </div>
              </div>
           </div>

           {/* Offering Card */}
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                 <span className="text-brand-500">📜</span> The STO (The Offering)
              </h3>
              <p className="text-sm text-slate-600 mb-2">
                 A Security Token Offering (STO) is like a digital IPO. The rules change based on <strong>where</strong> your investors are.
              </p>
              <div className="text-xs bg-brand-50 text-brand-700 p-3 rounded-lg mt-4">
                 <strong>Example:</strong> In the US, you might use <em>Reg D</em> to raise unlimited money from rich investors, but <em>Reg A+</em> to raise from the general public.
              </div>
           </div>
      </div>

      {/* Section 3: Investor Types Comparison */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
         <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 font-display">Who Can Invest?</h3>
            <p className="text-slate-500">The most common distinction in finance.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 relative">
            {/* Divider */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200"></div>

            {/* Retail */}
            <div className="p-4">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">👤</div>
                  <div>
                     <h4 className="font-bold text-slate-900">Retail Investors</h4>
                     <p className="text-xs text-slate-400 uppercase tracking-wider">The General Public</p>
                  </div>
               </div>
               <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2"><span className="text-red-500">✖</span> Restricted access to high-risk deals.</li>
                  <li className="flex gap-2"><span className="text-blue-500">●</span> Strict limits on how much they can invest.</li>
                  <li className="flex gap-2"><span className="text-blue-500">●</span> Requires heavy paperwork (Prospectus) to target.</li>
               </ul>
            </div>

            {/* Accredited */}
            <div className="p-4">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl">🎩</div>
                  <div>
                     <h4 className="font-bold text-slate-900">Accredited Investors</h4>
                     <p className="text-xs text-slate-400 uppercase tracking-wider">HNWI & Institutions</p>
                  </div>
               </div>
               <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2"><span className="text-green-500">✓</span> Access to private, high-yield deals.</li>
                  <li className="flex gap-2"><span className="text-green-500">✓</span> Higher or unlimited investment caps.</li>
                  <li className="flex gap-2"><span className="text-purple-500">●</span> Less regulatory burden for the issuer.</li>
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
};
