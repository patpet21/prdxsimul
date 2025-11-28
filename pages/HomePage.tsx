import React from 'react';
import { Button } from '../components/ui/Button';
import { TopNavigation } from '../components/ui/TopNavigation';
import Footer from '../components/ui/Footer';

interface HomePageProps {
  onStartSimulation: () => void;
  onLogin: () => void;
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartSimulation, onLogin, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col overflow-x-hidden">
      
      <TopNavigation 
        onNavigate={onNavigate} 
        onLogin={onLogin} 
        onStartSimulation={onStartSimulation}
        activePage="HOME" 
      />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center relative pt-8 md:pt-16 pb-20 px-4 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 md:-mr-40 md:-mt-40 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-gradient-to-br from-brand-500/10 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 md:-ml-40 md:-mb-40 w-[200px] md:w-[600px] h-[200px] md:h-[600px] bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-2 md:px-6 relative z-10 text-center w-full">
          <div className="inline-flex items-center gap-2 mb-6 md:mb-8 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white border border-slate-200 shadow-sm text-[10px] md:text-xs font-semibold text-slate-600 hover:border-brand-300 transition-colors cursor-default mx-auto max-w-full truncate">
             <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-500 animate-pulse shrink-0"></span>
             v2.0 Now Live: Automated MiCA Compliance
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.1] mb-6 md:mb-8">
            Tokenize Assets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
              Without The Headache.
            </span>
          </h1>
          
          <p className="text-base md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed font-light px-2">
            The all-in-one platform to structure SPVs, issue regulated tokens, and manage investors. 
            <strong className="text-slate-900 font-semibold block md:inline mt-1 md:mt-0"> Zero coding required.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Button 
                onClick={onStartSimulation} 
                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl h-auto shadow-xl shadow-brand-600/30 active:scale-95 transition-all"
            >
              Start Free Simulation
            </Button>
            <Button 
                onClick={onLogin}
                variant="outline" 
                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl h-auto bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all"
            >
              Access Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* --- SECTION 1: THE FUTURE (Dark Mode) --- */}
      <section className="bg-slate-900 text-white py-20 md:py-28 relative overflow-hidden">
         <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
         <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
         
         <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-bold font-display mb-6 tracking-tight">
                  The Future of Real Estate is <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Liquid & Digital.</span>
               </h2>
               <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                  We transform illiquid assets into Security Tokens tradable globally. 
                  A complete suite uniting Legal, Tech, and Finance in one institutional hub.
               </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20 border-b border-slate-800 pb-12">
               {[
                 { label: 'Real Estate Market', value: '€16T+' },
                 { label: 'Management Costs', value: '-40%', color: 'text-emerald-400' },
                 { label: 'Trading Liquidity', value: '24/7' },
                 { label: 'Settlement Time', value: 'T+0', color: 'text-brand-400' },
               ].map((stat, i) => (
                  <div key={i} className="text-center p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
                     <div className={`text-3xl md:text-5xl font-bold font-display mb-2 ${stat.color || 'text-white'}`}>{stat.value}</div>
                     <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
                  </div>
               ))}
            </div>

            {/* 3 Core Benefits Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
               {/* Card 1 */}
               <div className="group p-8 rounded-3xl bg-slate-800 border border-slate-700 hover:border-brand-500 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-900/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <svg className="w-32 h-32 text-brand-500 transform rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center mb-6 text-brand-400 group-hover:scale-110 transition-transform">
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold font-display mb-4">Fractionalization & Liquidity</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                     Break down entry barriers. Divide a €10M asset into 10 million tokens of €1, making it accessible to a global audience of retail and institutional investors.
                  </p>
               </div>

               {/* Card 2 */}
               <div className="group p-8 rounded-3xl bg-slate-800 border border-slate-700 hover:border-emerald-500 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <svg className="w-32 h-32 text-emerald-500 transform -rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold font-display mb-4">Automated Compliance</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                     The Smart Contract embeds regulatory rules (KYC/AML, Reg D/S). The token "knows" who can buy it, automatically blocking unauthorized transactions.
                  </p>
               </div>

               {/* Card 3 */}
               <div className="group p-8 rounded-3xl bg-slate-800 border border-slate-700 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <svg className="w-32 h-32 text-purple-500 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold font-display mb-4">Operational Efficiency</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                     Automatic distribution of dividends (rent) directly to investor wallets via stablecoins. No banking intermediaries, reduced costs, and total transparency.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* --- SECTION 2: THE PROCESS (Detailed Flow) --- */}
      <section className="py-24 md:py-32 px-4 max-w-7xl mx-auto">
         <div className="text-center mb-16">
             <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3 block">PropertyDEX Engine</span>
             <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-6">The Tokenization Process</h2>
             <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                We act as the Central Hub, coordinating the entire digital asset lifecycle. 
                Here is how the magic happens, step by step.
             </p>
         </div>

         <div className="grid grid-cols-1 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -z-10"></div>

            {/* STEP 1 */}
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start group">
               <div className="lg:w-1/2 flex justify-end">
                   <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:border-brand-500 transition-all duration-300 w-full max-w-xl group-hover:translate-x-2">
                       <div className="flex justify-between items-start mb-6">
                           <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
                               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                           </div>
                           <span className="text-6xl font-display font-bold text-slate-100 group-hover:text-brand-50 transition-colors">01</span>
                       </div>
                       <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">Asset & Due Diligence</h3>
                       <p className="text-slate-600 mb-6 font-medium">Deal Origination</p>
                       <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                           Deep analysis of the property. We verify ownership, evaluate historical yield, and structure the financial business plan.
                       </p>
                       <div className="grid grid-cols-2 gap-4 text-xs">
                           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                               <span className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Input</span>
                               <span className="font-mono text-slate-700">Land Registry / Notarial Deed</span>
                           </div>
                           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                               <span className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Output</span>
                               <span className="font-mono text-slate-700">Feasibility Report, ESG Analysis</span>
                           </div>
                       </div>
                   </div>
               </div>
               <div className="hidden lg:flex w-12 h-12 bg-white border-4 border-brand-500 rounded-full z-10 items-center justify-center mt-8">
                   <div className="w-3 h-3 bg-brand-500 rounded-full"></div>
               </div>
               <div className="lg:w-1/2"></div>
            </div>

            {/* STEP 2 */}
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start group">
               <div className="lg:w-1/2"></div>
               <div className="hidden lg:flex w-12 h-12 bg-white border-4 border-indigo-500 rounded-full z-10 items-center justify-center mt-8">
                   <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
               </div>
               <div className="lg:w-1/2 flex justify-start">
                   <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:border-indigo-500 transition-all duration-300 w-full max-w-xl group-hover:-translate-x-2">
                       <div className="flex justify-between items-start mb-6">
                           <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                           </div>
                           <span className="text-6xl font-display font-bold text-slate-100 group-hover:text-indigo-50 transition-colors">02</span>
                       </div>
                       <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">SPV & Compliance</h3>
                       <p className="text-slate-600 mb-6 font-medium">Legal Structuring</p>
                       <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                           Creation of the legal vehicle (SPV) that will hold the property. Definition of investor rights (equity vs debt) respecting local regulations.
                       </p>
                       <div className="grid grid-cols-2 gap-4 text-xs">
                           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                               <span className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Input</span>
                               <span className="font-mono text-slate-700">Feasibility Report</span>
                           </div>
                           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                               <span className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Output</span>
                               <span className="font-mono text-slate-700">SPV Incorporation (SRL/LLC), Offering Memo</span>
                           </div>
                       </div>
                   </div>
               </div>
            </div>

            {/* STEP 3 */}
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start group">
               <div className="lg:w-1/2 flex justify-end">
                   <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:border-purple-500 transition-all duration-300 w-full max-w-xl group-hover:translate-x-2">
                       <div className="flex justify-between items-start mb-6">
                           <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                           </div>
                           <span className="text-6xl font-display font-bold text-slate-100 group-hover:text-purple-50 transition-colors">03</span>
                       </div>
                       <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">Smart Contract Minting</h3>
                       <p className="text-slate-600 mb-6 font-medium">Tech Deployment</p>
                       <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                           Transforming corporate shares into programmable tokens (ERC-1400/3643). Configuring on-chain compliance rules (Whitelisting).
                       </p>
                       <div className="grid grid-cols-2 gap-4 text-xs">
                           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                               <span className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Input</span>
                               <span className="font-mono text-slate-700">Cap Table & Bylaws</span>
                           </div>
                           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                               <span className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Output</span>
                               <span className="font-mono text-slate-700">Security Token, Audit Report</span>
                           </div>
                       </div>
                   </div>
               </div>
               <div className="hidden lg:flex w-12 h-12 bg-white border-4 border-purple-500 rounded-full z-10 items-center justify-center mt-8">
                   <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
               </div>
               <div className="lg:w-1/2"></div>
            </div>

            {/* STEP 4 */}
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start group">
               <div className="lg:w-1/2"></div>
               <div className="hidden lg:flex w-12 h-12 bg-white border-4 border-emerald-500 rounded-full z-10 items-center justify-center mt-8">
                   <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
               </div>
               <div className="lg:w-1/2 flex justify-start">
                   <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:border-emerald-500 transition-all duration-300 w-full max-w-xl group-hover:-translate-x-2">
                       <div className="flex justify-between items-start mb-6">
                           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           </div>
                           <span className="text-6xl font-display font-bold text-slate-100 group-hover:text-emerald-50 transition-colors">04</span>
                       </div>
                       <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">Distribution & Sale</h3>
                       <p className="text-slate-600 mb-6 font-medium">Primary Offering</p>
                       <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                           Launch of the offering on the marketplace. Accredited investors pass KYC and purchase shares using fiat or stable crypto.
                       </p>
                       <div className="grid grid-cols-2 gap-4 text-xs">
                           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                               <span className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Input</span>
                               <span className="font-mono text-slate-700">Security Token Offering</span>
                           </div>
                           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                               <span className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Output</span>
                               <span className="font-mono text-slate-700">Capital Raised, Automated KYC</span>
                           </div>
                       </div>
                   </div>
               </div>
            </div>

            {/* STEP 5 */}
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start group">
               <div className="lg:w-1/2 flex justify-end">
                   <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:border-amber-500 transition-all duration-300 w-full max-w-xl group-hover:translate-x-2">
                       <div className="flex justify-between items-start mb-6">
                           <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                           </div>
                           <span className="text-6xl font-display font-bold text-slate-100 group-hover:text-amber-50 transition-colors">05</span>
                       </div>
                       <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">Lifecycle & Dividends</h3>
                       <p className="text-slate-600 mb-6 font-medium">Asset Management</p>
                       <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                           Post-sale management. Automatic distribution of rental income to holders and enabling secondary market trading for liquidity.
                       </p>
                       <div className="grid grid-cols-2 gap-4 text-xs">
                           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                               <span className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Input</span>
                               <span className="font-mono text-slate-700">Rental Income</span>
                           </div>
                           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                               <span className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Output</span>
                               <span className="font-mono text-slate-700">Automated Yield, P2P Trading</span>
                           </div>
                       </div>
                   </div>
               </div>
               <div className="hidden lg:flex w-12 h-12 bg-white border-4 border-amber-500 rounded-full z-10 items-center justify-center mt-8">
                   <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
               </div>
               <div className="lg:w-1/2"></div>
            </div>

         </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
          <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 font-display">Ready to tokenize your first asset?</h2>
              <div className="flex justify-center gap-4">
                 <Button onClick={onStartSimulation} className="px-8 py-4 text-lg shadow-xl shadow-brand-500/20">Start Free Simulation</Button>
              </div>
          </div>
      </section>

      <Footer />
    </div>
  );
};