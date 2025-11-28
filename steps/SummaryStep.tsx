
import React, { useEffect, useState } from 'react';
import { StepProps, AiRiskReport } from '../types';
import { generateRiskReport } from '../services/mockAiService';
import { Button } from '../components/ui/Button';

export const SummaryStep: React.FC<StepProps> = ({ data, onValidationChange }) => {
  const [report, setReport] = useState<AiRiskReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'LEGAL' | 'ASSET' | 'FINANCE'>('SUMMARY');

  useEffect(() => {
    onValidationChange(true);
    // Pass the full data state, generateRiskReport will extract properties
    generateRiskReport(data).then(res => {
        setReport(res);
        setLoading(false);
    });
  }, [data, onValidationChange]);

  if (loading) return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Generating Pre-Deployment Audit...</p>
      </div>
  );

  const { projectInfo, jurisdiction, property, compliance, tokenAllocation, distribution } = data;

  // Helper to format currency
  const fmt = (num?: number) => num ? `€${num.toLocaleString()}` : '-';
  const fmtPct = (num?: number) => num ? `${num}%` : '-';

  return (
    <div className="space-y-8 animate-fadeIn pb-8">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-3xl font-bold font-display text-slate-900">Final Audit Report</h2>
            <p className="text-slate-500 text-sm mt-1">Review the complete deal structure before blockchain deployment.</p>
         </div>
         <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-mono text-slate-500 border border-slate-200">
            ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
         </span>
      </div>

      {/* 1. Risk Scorecard */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
         <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" className="text-slate-700" fill="none" />
                 <circle cx="64" cy="64" r="60" stroke={report?.score! > 80 ? '#10b981' : '#f59e0b'} strokeWidth="8" 
                    strokeDasharray={377} strokeDashoffset={377 - (377 * (report?.score || 0)) / 100}
                    className="transition-all duration-1000 ease-out" fill="none" 
                 />
               </svg>
               <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold font-display">{report?.score}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
               </div>
            </div>
            
            <div className="flex-1 space-y-4 w-full text-center md:text-left">
               <div>
                 <h3 className="text-xl font-bold mb-1">Readiness Level: <span className={report?.level === 'Low' ? 'text-green-400' : 'text-amber-400'}>{report?.level} Risk</span></h3>
                 <p className="text-slate-400 text-sm">
                    {report?.level === 'Low' 
                        ? "Project is structurally sound and compliant for mainnet deployment." 
                        : "Review warnings below before proceeding to deployment."}
                 </p>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                     <span className="text-[10px] text-slate-400 uppercase block tracking-wider">Total Value</span>
                     <span className="font-mono font-bold text-white">{fmt(property.total_value)}</span>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                     <span className="text-[10px] text-slate-400 uppercase block tracking-wider">Target Raise</span>
                     <span className="font-mono font-bold text-emerald-400">{fmt(property.raise_amount)}</span>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                     <span className="text-[10px] text-slate-400 uppercase block tracking-wider">Framework</span>
                     <span className="font-mono font-bold text-white">{compliance.regFramework || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                     <span className="text-[10px] text-slate-400 uppercase block tracking-wider">SPV Type</span>
                     <span className="font-mono font-bold text-white">{jurisdiction.spvType || 'N/A'}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 2. Interactive Deal Memo (The Super Card) */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 shrink-0">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Deal Memo Sections</div>
              <div className="space-y-1">
                  {[
                      { id: 'SUMMARY', label: 'Executive Summary', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                      { id: 'LEGAL', label: 'Legal & Entity', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
                      { id: 'ASSET', label: 'Asset Specs', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                      { id: 'FINANCE', label: 'Financials & Token', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
                  ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                            activeTab === tab.id 
                            ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200' 
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                          {tab.label}
                      </button>
                  ))}
              </div>
              
              <div className="mt-8 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <h4 className="text-xs font-bold text-indigo-800 uppercase mb-2">Audit Check</h4>
                  <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-xs text-indigo-700">
                          <span className="text-green-500">✓</span> KYC Provider Set
                      </li>
                      <li className="flex items-center gap-2 text-xs text-indigo-700">
                          <span className="text-green-500">✓</span> Entity Validated
                      </li>
                      <li className="flex items-center gap-2 text-xs text-indigo-700">
                          <span className="text-green-500">✓</span> Tokenomics Logic
                      </li>
                  </ul>
              </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white p-8 overflow-y-auto">
              
              {/* TAB: EXECUTIVE SUMMARY */}
              {activeTab === 'SUMMARY' && (
                  <div className="space-y-8 animate-fadeIn">
                      <div>
                          <h3 className="text-xl font-bold text-slate-900 font-display mb-1">Executive Summary</h3>
                          <p className="text-slate-500 text-sm">Project overview and core value proposition.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div>
                                  <label className="text-xs font-bold text-slate-400 uppercase">Project Name</label>
                                  <div className="text-lg font-bold text-slate-900">{projectInfo.projectName}</div>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-400 uppercase">Primary Goal</label>
                                  <div className="flex items-center gap-2">
                                      <span className="px-2 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">{projectInfo.projectGoal}</span>
                                  </div>
                              </div>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                              <p className="text-sm text-slate-700 leading-relaxed mt-1">{projectInfo.description}</p>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="border border-slate-200 rounded-xl p-5">
                              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-brand-500"></span> Distribution Strategy
                              </h4>
                              <div className="space-y-3">
                                  <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Target Audience</span>
                                      <span className="font-medium text-slate-900">{distribution.targetInvestorType}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Min. Ticket</span>
                                      <span className="font-medium text-slate-900">${distribution.minInvestment.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Channels</span>
                                      <span className="font-medium text-slate-900 text-right">{distribution.marketingChannels.length > 0 ? distribution.marketingChannels.join(', ') : 'None selected'}</span>
                                  </div>
                              </div>
                          </div>

                          <div className="border border-slate-200 rounded-xl p-5">
                              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Compliance Check
                              </h4>
                              <div className="space-y-3">
                                  <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Framework</span>
                                      <span className="font-medium text-slate-900">{compliance.regFramework}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">KYC Provider</span>
                                      <span className="font-medium text-slate-900">{compliance.kycProvider}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Accreditation</span>
                                      <span className={`font-medium ${compliance.accreditationRequired ? 'text-green-600' : 'text-slate-900'}`}>
                                          {compliance.accreditationRequired ? 'Enforced' : 'Not Required'}
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* TAB: LEGAL & ENTITY */}
              {activeTab === 'LEGAL' && (
                  <div className="space-y-8 animate-fadeIn">
                      <div>
                          <h3 className="text-xl font-bold text-slate-900 font-display mb-1">Legal Entity Structure</h3>
                          <p className="text-slate-500 text-sm">SPV details and jurisdictional configuration.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-6 opacity-5">
                              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 relative z-10">
                              <div>
                                  <label className="text-xs font-bold text-slate-400 uppercase">Domicile</label>
                                  <div className="flex items-center gap-2 mt-1">
                                      <span className="text-2xl">{jurisdiction.country === 'US' ? '🇺🇸' : jurisdiction.country === 'UK' ? '🇬🇧' : jurisdiction.country === 'DE' ? '🇩🇪' : jurisdiction.country === 'IT' ? '🇮🇹' : jurisdiction.country === 'UAE' ? '🇦🇪' : '🌍'}</span>
                                      <div>
                                          <div className="font-bold text-slate-900">{jurisdiction.country}</div>
                                          <div className="text-xs text-slate-500">{jurisdiction.entityDetails.registrationState || 'National'}</div>
                                      </div>
                                  </div>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-400 uppercase">Structure Type</label>
                                  <div className="text-lg font-bold text-slate-900 mt-1">{jurisdiction.spvType}</div>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-400 uppercase">Registered Name</label>
                                  <div className="font-mono text-slate-700 mt-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg inline-block">
                                      {jurisdiction.entityDetails.companyName || 'Pending Formation'}
                                  </div>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-400 uppercase">Share Capital</label>
                                  <div className="text-lg font-bold text-slate-900 mt-1">{fmt(jurisdiction.entityDetails.shareCapital)}</div>
                              </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="border border-slate-200 rounded-xl p-5">
                              <h4 className="text-sm font-bold text-slate-800 mb-4">Board & Governance</h4>
                              <ul className="space-y-2">
                                  {jurisdiction.entityDetails.directors?.map((dir, i) => (
                                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                                          <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                                              {dir.charAt(0)}
                                          </div>
                                          {dir} <span className="text-xs text-slate-400 ml-auto">Director</span>
                                      </li>
                                  ))}
                                  {(!jurisdiction.entityDetails.directors || jurisdiction.entityDetails.directors.length === 0) && (
                                      <li className="text-sm text-slate-400 italic">No directors listed.</li>
                                  )}
                              </ul>
                          </div>
                          
                          <div className="border border-slate-200 rounded-xl p-5">
                              <h4 className="text-sm font-bold text-slate-800 mb-4">Formation Details</h4>
                              <div className="space-y-3">
                                  <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Agent</span>
                                      <span className="font-medium text-slate-900">{jurisdiction.entityDetails.formationAgent || 'TBD'}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Governance</span>
                                      <span className="font-medium text-slate-900">{jurisdiction.entityDetails.governanceType || 'Standard'}</span>
                                  </div>
                                  <div className="mt-2 pt-2 border-t border-slate-100">
                                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Registered Address</span>
                                      <span className="text-xs text-slate-600 leading-tight block">{jurisdiction.entityDetails.registeredAddress || 'Pending'}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* TAB: ASSET SPECS */}
              {activeTab === 'ASSET' && (
                  <div className="space-y-8 animate-fadeIn">
                      <div>
                          <h3 className="text-xl font-bold text-slate-900 font-display mb-1">Asset Specifications</h3>
                          <p className="text-slate-500 text-sm">Physical and operational details of the underlying asset.</p>
                      </div>

                      <div className="flex gap-6 items-start">
                          {property.image_url && (
                              <div className="w-32 h-32 rounded-xl border border-slate-200 overflow-hidden shrink-0 shadow-sm hidden md:block">
                                  <img src={property.image_url} alt="Asset" className="w-full h-full object-cover" />
                              </div>
                          )}
                          <div className="flex-1 bg-slate-50 p-6 rounded-xl border border-slate-200">
                              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                  <div>
                                      <label className="text-xs font-bold text-slate-400 uppercase">Title</label>
                                      <div className="font-bold text-slate-900">{property.title}</div>
                                  </div>
                                  <div>
                                      <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                                      <div className="font-bold text-slate-900">{property.category} / {property.property_type}</div>
                                  </div>
                                  <div>
                                      <label className="text-xs font-bold text-slate-400 uppercase">Location</label>
                                      <div className="font-medium text-slate-700">{property.location || property.city}</div>
                                  </div>
                                  <div>
                                      <label className="text-xs font-bold text-slate-400 uppercase">Total Valuation</label>
                                      <div className="font-mono font-bold text-emerald-600">{fmt(property.total_value)}</div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="border border-slate-200 rounded-xl p-5">
                              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                  Physical Metrics
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <span className="text-xs text-slate-500 block">Construction Year</span>
                                      <span className="font-medium text-slate-900">{property.construction_year || '-'}</span>
                                  </div>
                                  <div>
                                      <span className="text-xs text-slate-500 block">Renovation</span>
                                      <span className="font-medium text-slate-900">{property.renovated_status || '-'}</span>
                                  </div>
                                  <div>
                                      <span className="text-xs text-slate-500 block">Interior Size</span>
                                      <span className="font-medium text-slate-900">{property.interior_size_sqm ? `${property.interior_size_sqm} sqm` : '-'}</span>
                                  </div>
                                  <div>
                                      <span className="text-xs text-slate-500 block">Total Units</span>
                                      <span className="font-medium text-slate-900">{property.total_units}</span>
                                  </div>
                              </div>
                          </div>

                          <div className="border border-slate-200 rounded-xl p-5">
                              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  Timeline & Parties
                              </h4>
                              <div className="space-y-3">
                                  <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Sponsor</span>
                                      <span className="font-medium text-slate-900">{property.sponsor || 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Completion Date</span>
                                      <span className="font-medium text-slate-900">{property.completion_date || 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Occupancy</span>
                                      <span className="font-bold text-emerald-600">{fmtPct(property.occupancy_rate)}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* TAB: FINANCIALS & TOKEN */}
              {activeTab === 'FINANCE' && (
                  <div className="space-y-8 animate-fadeIn">
                      <div>
                          <h3 className="text-xl font-bold text-slate-900 font-display mb-1">Financials & Tokenomics</h3>
                          <p className="text-slate-500 text-sm">Capital stack, fees, yields, and token configuration.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Capital Stack Targets</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                  <span className="block text-xs text-slate-500 mb-1">Soft Cap</span>
                                  <span className="text-lg font-bold text-slate-800">{fmt(property.soft_cap)}</span>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm border-b-4 border-brand-500">
                                  <span className="block text-xs text-brand-600 font-bold mb-1">Target Raise</span>
                                  <span className="text-xl font-bold text-slate-900">{fmt(property.raise_amount)}</span>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                  <span className="block text-xs text-slate-500 mb-1">Hard Cap</span>
                                  <span className="text-lg font-bold text-slate-800">{fmt(property.hard_cap)}</span>
                              </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="border border-slate-200 rounded-xl p-5">
                              <h4 className="text-sm font-bold text-slate-800 mb-4">Token Configuration</h4>
                              <ul className="space-y-3 text-sm">
                                  <li className="flex justify-between border-b border-slate-50 pb-2">
                                      <span className="text-slate-500">Price per Token</span>
                                      <span className="font-mono font-bold text-slate-900">{fmt(property.token_price)}</span>
                                  </li>
                                  <li className="flex justify-between border-b border-slate-50 pb-2">
                                      <span className="text-slate-500">Total Supply</span>
                                      <span className="font-mono font-bold text-slate-900">{property.total_tokens?.toLocaleString()}</span>
                                  </li>
                                  <li className="flex justify-between border-b border-slate-50 pb-2">
                                      <span className="text-slate-500">Min. Ticket</span>
                                      <span className="font-mono font-bold text-slate-900">{property.min_invest_tokens} Tokens</span>
                                  </li>
                                  <li className="flex justify-between pt-1">
                                      <span className="text-slate-500">Lock-up</span>
                                      <span className="font-bold text-amber-600">{property.lockup_months} Months</span>
                                  </li>
                              </ul>
                          </div>

                          <div className="border border-slate-200 rounded-xl p-5">
                              <h4 className="text-sm font-bold text-slate-800 mb-4">Yields & Fees</h4>
                              <ul className="space-y-3 text-sm">
                                  <li className="flex justify-between">
                                      <span className="text-slate-500">Est. Annual Yield</span>
                                      <span className="font-bold text-emerald-600">{fmtPct(property.annual_yield)}</span>
                                  </li>
                                  <li className="flex justify-between">
                                      <span className="text-slate-500">Target IRR</span>
                                      <span className="font-bold text-emerald-600">{fmtPct(property.roi_target)}</span>
                                  </li>
                                  <li className="flex justify-between">
                                      <span className="text-slate-500">Platform Fee</span>
                                      <span className="font-medium text-slate-900">{fmt(property.platform_fees)}</span>
                                  </li>
                                  <li className="flex justify-between">
                                      <span className="text-slate-500">Management Fee</span>
                                      <span className="font-medium text-slate-900">{fmtPct(property.management_fee_percentage)}</span>
                                  </li>
                              </ul>
                          </div>
                      </div>
                      
                      {/* Allocation Mini Bar */}
                      <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Token Allocation</h4>
                          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                              <div className="bg-brand-500 h-full" style={{ width: `${tokenAllocation.investors}%` }} title="Investors"></div>
                              <div className="bg-indigo-500 h-full" style={{ width: `${tokenAllocation.founders}%` }} title="Founders"></div>
                              <div className="bg-slate-400 h-full" style={{ width: `${tokenAllocation.treasury}%` }} title="Treasury"></div>
                              <div className="bg-amber-500 h-full" style={{ width: `${tokenAllocation.advisors}%` }} title="Advisors"></div>
                          </div>
                          <div className="flex gap-4 mt-2 text-[10px] text-slate-500">
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-500"></span> Public {tokenAllocation.investors}%</span>
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Team {tokenAllocation.founders}%</span>
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Treasury {tokenAllocation.treasury}%</span>
                          </div>
                      </div>
                  </div>
              )}

          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Roadmap */}
         <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-brand-500"></span>
               Legal & Tech Roadmap
            </h3>
            <div className="space-y-4">
               {report?.legalRoadmap?.map((step, i) => (
                  <div key={i} className="flex gap-3">
                     <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-slate-300 rounded-full mt-2"></div>
                        {i !== (report?.legalRoadmap.length || 0) - 1 && <div className="w-px h-full bg-slate-200 my-1"></div>}
                     </div>
                     <p className="text-sm text-slate-600 py-1">{step}</p>
                  </div>
               ))}
               {(!report?.legalRoadmap || report.legalRoadmap.length === 0) && <p className="text-sm text-slate-400">Roadmap generation pending.</p>}
            </div>
         </div>

         {/* Warnings */}
         <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-amber-500"></span>
               Critical Attention Points
            </h3>
            <ul className="space-y-3">
               {report?.warnings?.map((warn, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-900 bg-amber-50 p-2 rounded">
                     <span className="text-amber-500 font-bold">!</span> {warn}
                  </li>
               ))}
               {(!report?.warnings || report.warnings.length === 0) && <li className="text-slate-400 italic">No critical warnings found.</li>}
            </ul>
         </div>
      </div>
    </div>
  );
};
