
import React, { useState } from 'react';
import { Project } from '../types';
import { Button } from '../components/ui/Button';

interface ProjectDetailsPageProps {
  project: Project;
  onBack: () => void;
  onInvest: (amount: number) => void;
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ project, onBack, onInvest }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FINANCIALS' | 'DOCUMENTS' | 'INVESTMENT'>('OVERVIEW');
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Use new DB fields
  const targetRaise = project.targetRaise || (project.valuation * 0.4);
  const raisedAmount = targetRaise * (project.progress / 100);
  const minTicket = project.minTicket || 500;
  const tokenPrice = project.token_price || 50; // Fixed from project.tokenPrice

  const handleBuy = () => {
    setIsProcessing(true);
    setTimeout(() => {
        onInvest(parseFloat(investmentAmount));
        setIsProcessing(false);
    }, 2000);
  };

  // Helper for metrics strip using new DB fields
  const indices = [
      { label: 'Target IRR', value: project.irr ? `${project.irr}%` : 'N/A' },
      { label: 'Est. APY', value: project.apy ? `${project.apy}%` : 'N/A' },
      { label: 'Risk Score', value: project.risk_score ? `${project.risk_score}/5` : 'N/A' },
      { label: 'Occupancy', value: project.occupancy_rate ? `${project.occupancy_rate}%` : 'N/A' }, // Fixed from project.occupancy
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-fadeIn pb-20">
      
      {/* Navbar Placeholder */}
      <nav className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
         <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Marketplace
         </button>
         <div className="flex items-center gap-3">
            <span className="hidden md:inline text-xs font-bold text-slate-400 uppercase tracking-wider">Account ID: 0x8A...3F12</span>
            <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner border border-slate-700">A</div>
         </div>
      </nav>

      {/* Hero Header */}
      <div className="relative h-[450px] bg-slate-900 group">
         {project.imageUrl ? (
             <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-700" />
         ) : (
             <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 opacity-90"></div>
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
         
         <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-8">
             <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-6">
                 <div>
                     <div className="flex flex-wrap gap-3 mb-4">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-white/20">
                            {project.category}
                        </span>
                        <span className={`px-3 py-1 text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-white/20 ${project.status === 'active' || project.status === 'funded' ? 'bg-emerald-500/90' : 'bg-amber-500/90'}`}>
                            {project.status === 'active' ? 'Live' : project.status === 'funding' ? 'Deploying' : project.status}
                        </span>
                        {project.asset_type && (
                            <span className="px-3 py-1 bg-indigo-500/80 backdrop-blur-md text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-white/20">
                                {project.asset_type}
                            </span>
                        )}
                     </div>
                     <h1 className="text-4xl md:text-6xl font-bold text-white font-display mb-3 drop-shadow-lg tracking-tight">
                         {project.title}
                     </h1>
                     <p className="text-slate-300 text-lg flex items-center gap-2 font-medium">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {project.location || 'Global Asset • Blockchain Registered'}
                     </p>
                 </div>
                 
                 {/* Key Hero Stats */}
                 <div className="flex gap-4 text-white text-right">
                     <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                         <span className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Asset Valuation</span>
                         <span className="block text-3xl font-display font-bold">${(project.valuation / 1000000).toFixed(1)}M</span>
                     </div>
                     <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                         <span className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Projected APY</span>
                         <span className="block text-3xl font-display font-bold text-emerald-400">{project.apy || 'N/A'}%</span>
                     </div>
                 </div>
             </div>
         </div>
      </div>

      {/* PERFORMANCE STRIP (NEW) */}
      <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-slate-100">
              {indices.map((idx, i) => (
                  <div key={i} className={`text-center ${i > 0 ? 'pl-6' : ''}`}>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{idx.label}</span>
                      <span className="block text-xl font-bold text-slate-900">{idx.value}</span>
                  </div>
              ))}
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Main Info */}
          <div className="lg:col-span-8 space-y-10">
              
              {/* Tabs */}
              <div className="border-b border-slate-200">
                  <nav className="flex gap-8 overflow-x-auto no-scrollbar">
                      {['OVERVIEW', 'FINANCIALS', 'DOCUMENTS', 'INVESTMENT'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                                activeTab === tab 
                                ? 'border-brand-600 text-brand-600' 
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                          >
                              {tab}
                          </button>
                      ))}
                  </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                  {activeTab === 'OVERVIEW' && (
                      <div className="space-y-8 animate-slideUp">
                          <div className="prose prose-slate max-w-none">
                              <h3 className="text-2xl font-bold text-slate-900 font-display">Investment Opportunity</h3>
                              <p className="text-slate-600 leading-relaxed text-lg">
                                  {project.description || "This asset represents a premium opportunity in the digital asset space. Fully compliant and structured via a dedicated SPV, it offers investors direct exposure to the underlying value and cash flows."}
                              </p>
                              
                              <h4 className="text-xl font-bold text-slate-900 mt-8 mb-4">Property Highlights</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {[
                                      "Prime Location with High Demand",
                                      "Professionally Managed SPV",
                                      project.payout_type || "Periodic Distributions",
                                      "Liquid Secondary Market Trading",
                                      "Full Legal Compliance (Reg D/S)",
                                      "Immutable Ownership on Blockchain"
                                  ].map((feat, i) => (
                                      <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">✓</div>
                                          <span className="text-slate-700 font-medium">{feat}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Asset DNA Card (NEW) */}
                          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                  Asset DNA & Specs
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                                  <div>
                                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Asset Class</span>
                                      <span className="text-slate-900 font-medium">{project.category}</span>
                                  </div>
                                  <div>
                                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Type</span>
                                      <span className="text-slate-900 font-medium">{project.asset_type || 'General'}</span>
                                  </div>
                                  <div>
                                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Year Built/Founded</span>
                                      <span className="text-slate-900 font-medium">{project.construction_year || project.yearFounded || 'N/A'}</span>
                                  </div>
                                  <div>
                                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Total Units</span>
                                      <span className="text-slate-900 font-medium">{project.total_units || 'N/A'}</span>
                                  </div>
                                  <div>
                                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Sq Ft / Size</span>
                                      <span className="text-slate-900 font-medium">{project.interior_size_sqm ? `${project.interior_size_sqm.toLocaleString()} sqm` : 'N/A'}</span>
                                  </div>
                                  <div>
                                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Exit Strategy</span>
                                      <span className="text-slate-900 font-medium">{project.exit_strategy || 'TBD'}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {activeTab === 'FINANCIALS' && (
                      <div className="space-y-8 animate-slideUp">
                          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                              <h3 className="text-lg font-bold text-slate-900 mb-6">Projected Returns (5 Year)</h3>
                              {/* Simple Bar Chart Visualization */}
                              <div className="flex items-end justify-between h-48 gap-2 md:gap-4">
                                  {[10, 25, 45, 60, 85].map((h, i) => (
                                      <div key={i} className="w-full flex flex-col justify-end group cursor-pointer">
                                          <div className="bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-all rounded-t-lg w-full relative" style={{ height: `${h}%` }}>
                                              <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg transition-all duration-1000" style={{ height: `${h * 0.7}%` }}></div>
                                          </div>
                                          <span className="text-center text-xs font-bold text-slate-400 mt-2">Year {i+1}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Capital Stack</h4>
                                  <div className="space-y-4">
                                      <div>
                                          <div className="flex justify-between text-sm mb-1">
                                              <span className="text-slate-600 font-medium">Senior Debt (Bank)</span>
                                              <span className="font-mono font-bold text-slate-900">{project.leverage_ratio || 40}%</span>
                                          </div>
                                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                              <div className="bg-slate-400 h-full" style={{ width: `${project.leverage_ratio || 40}%` }}></div>
                                          </div>
                                      </div>
                                      <div>
                                          <div className="flex justify-between text-sm mb-1">
                                              <span className="text-slate-600 font-medium">Tokenized Equity</span>
                                              <span className="font-mono font-bold text-slate-900">{100 - (project.leverage_ratio || 40)}%</span>
                                          </div>
                                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                              <div className="bg-brand-500 h-full" style={{ width: `${100 - (project.leverage_ratio || 40)}%` }}></div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Financial Summary</h4>
                                  <ul className="space-y-3 text-sm text-slate-600">
                                      <li className="flex justify-between"><span>Gross Profit (Yr 1)</span> <span className="font-bold text-slate-900">{project.gross_profit ? `$${project.gross_profit.toLocaleString()}` : 'N/A'}</span></li>
                                      <li className="flex justify-between"><span>Management Fee</span> <span className="font-bold text-slate-900">{project.management_fee_percentage || 1.5}%</span></li>
                                      <li className="flex justify-between"><span>Target IRR</span> <span className="font-bold text-slate-900">{project.irr || 'N/A'}%</span></li>
                                      <li className="flex justify-between border-t border-slate-200 pt-2"><span>Net Projected Yield</span> <span className="font-bold text-emerald-600">{project.apy}%</span></li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                  )}

                  {activeTab === 'DOCUMENTS' && (
                      <div className="space-y-4 animate-slideUp">
                          {[
                              { name: "Offering Memorandum (OM)", type: "PDF", size: "2.4 MB" },
                              { name: "Subscription Agreement", type: "PDF", size: "1.1 MB" },
                              { name: "SPV Operating Agreement", type: "PDF", size: "3.5 MB" },
                              { name: "Property Appraisal Report", type: "PDF", size: "8.2 MB" },
                              { name: "Smart Contract Audit", type: "PDF", size: "0.8 MB" }
                          ].map((doc, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow group cursor-pointer">
                                  <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{doc.name}</h4>
                                          <p className="text-xs text-slate-500">{doc.type} • {doc.size}</p>
                                      </div>
                                  </div>
                                  <button className="text-slate-400 hover:text-brand-600">
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                  </button>
                              </div>
                          ))}
                      </div>
                  )}

                  {activeTab === 'INVESTMENT' && (
                      <div className="space-y-8 animate-slideUp">
                          {/* Investment Terms Card */}
                          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                              <h3 className="text-xl font-bold text-slate-900 mb-6">Investment Terms</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                      <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">Minimum Ticket</span>
                                      <span className="text-2xl font-mono font-bold text-slate-900">${(minTicket).toLocaleString()}</span>
                                  </div>
                                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                      <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">Token Price</span>
                                      <span className="text-2xl font-mono font-bold text-slate-900">${tokenPrice}</span>
                                  </div>
                                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                      <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">Lock-up Period</span>
                                      <span className="text-lg font-bold text-slate-700">{project.lockup_months || 12} Months</span>
                                  </div>
                                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                      <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">Distribution Frequency</span>
                                      <span className="text-lg font-bold text-slate-700">{project.distribution_frequency || 'Quarterly'}</span>
                                  </div>
                              </div>
                          </div>

                          {/* Sponsor Card */}
                          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                              <h3 className="text-xl font-bold text-slate-900 mb-6">Sponsor Information</h3>
                              <div className="flex items-center gap-4 mb-6">
                                   <div className="w-16 h-16 bg-slate-200 rounded-full overflow-hidden shrink-0">
                                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Sponsor" className="w-full h-full object-cover"/>
                                   </div>
                                   <div>
                                      <h4 className="text-lg font-bold text-slate-900">{project.sponsor || 'Private Sponsor'}</h4>
                                      <p className="text-slate-500 text-sm">Experienced developer with track record of successful exits.</p>
                                   </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <button className="w-full py-3 px-4 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                      Email Sponsor
                                  </button>
                                  <button className="w-full py-3 px-4 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                      Visit Website
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>

          {/* RIGHT COLUMN: Investment Sidebar */}
          <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                  <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-emerald-500"></div>
                      
                      <div className="mb-6">
                          <div className="flex justify-between items-end mb-2">
                              <span className="text-sm font-bold text-slate-500">Funding Progress</span>
                              <span className="text-sm font-bold text-brand-600">{project.progress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                              <div className="bg-brand-600 h-full rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                              <span>${raisedAmount.toLocaleString()} pledged</span>
                              <span>${targetRaise.toLocaleString()} goal</span>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Invest Amount (USDC)</label>
                              <div className="relative">
                                  <input 
                                    type="number" 
                                    value={investmentAmount}
                                    onChange={(e) => setInvestmentAmount(e.target.value)}
                                    placeholder={`${minTicket}`}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-mono font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                  />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">USDC</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-2 text-right">Min: ${minTicket} • Balance: $142,050</p>
                          </div>

                          <div className="bg-indigo-50 rounded-xl p-4 flex justify-between items-center border border-indigo-100">
                              <span className="text-sm text-indigo-800 font-medium">Est. Tokens</span>
                              <span className="text-lg font-bold text-indigo-900">
                                  {investmentAmount ? (parseFloat(investmentAmount) / tokenPrice).toFixed(2) : '0.00'}
                              </span>
                          </div>

                          <Button 
                            onClick={handleBuy} 
                            isLoading={isProcessing}
                            disabled={!investmentAmount || parseFloat(investmentAmount) < minTicket}
                            className="w-full py-4 text-lg shadow-lg shadow-brand-500/30"
                          >
                              {isProcessing ? 'Processing on Chain...' : 'Invest Now'}
                          </Button>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                          <p className="text-xs text-slate-400 leading-relaxed">
                              By clicking invest, you agree to the Subscription Agreement and confirm you are an eligible investor under {project.category === 'Real Estate' ? 'Reg D 506(c)' : 'local regulations'}.
                          </p>
                      </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                      <h4 className="font-bold text-slate-900 mb-4">Project Team</h4>
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Sponsor" />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-slate-800">{project.sponsor || 'Sponsor'}</p>
                              <p className="text-xs text-slate-500">Sponsor • Verified</p>
                          </div>
                      </div>
                      <button className="w-full mt-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          Contact Sponsor
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
