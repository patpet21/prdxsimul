
import React, { useEffect, useState } from 'react';
import { StepProps } from '../types';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { AllocationChart } from '../components/tokenomics/AllocationChart';
import { TokenomicsAiPanel } from '../components/tokenomics/TokenomicsAiPanel';
import { DeepStrategyView } from '../components/tokenomics/DeepStrategyView';
import { generateTokenConfig, estimateYieldsAndFees } from '../services/mockAiService';

export const TokenomicsStep: React.FC<StepProps> = ({ data, updateData, onValidationChange }) => {
  const { property, tokenAllocation, projectInfo, jurisdiction } = data;
  const [activeTab, setActiveTab] = useState<'ECONOMICS' | 'FEES_RETURNS' | 'STRATEGY'>('ECONOMICS');
  
  // AI Loading States
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const [configInsight, setConfigInsight] = useState<string | null>(null);
  
  const [isYieldLoading, setIsYieldLoading] = useState(false);
  const [yieldInsight, setYieldInsight] = useState<string | null>(null);

  useEffect(() => {
    const hasEconomics = Boolean(property.token_price > 0 && property.total_tokens > 0);
    const hasYield = property.annual_yield !== undefined;
    onValidationChange(hasEconomics && hasYield);
  }, [property, onValidationChange]);

  const updateProp = (field: string, val: any) => updateData('property', { [field]: val });
  
  const updateAlloc = (key: string, val: number) => {
    updateData('tokenAllocation', { ...tokenAllocation, [key]: val });
  };

  // --- AI ACTIONS ---

  const handleAiConfig = async () => {
      setIsConfigLoading(true);
      const assetData = { category: property.category, assetType: property.asset_type, valuation: property.total_value };
      const config = await generateTokenConfig(assetData as any, projectInfo);
      
      if (config) {
          if (config.token_price) updateProp('token_price', config.token_price);
          if (config.total_tokens) {
              updateProp('total_tokens', config.total_tokens);
              updateProp('available_tokens', config.total_tokens); // Default to full availability
          }
          if (config.soft_cap) updateProp('soft_cap', config.soft_cap);
          if (config.hard_cap) updateProp('hard_cap', config.hard_cap);
          if (config.allocation) {
              updateData('tokenAllocation', config.allocation);
          }
          if (config.strategy_reasoning) {
              setConfigInsight(config.strategy_reasoning);
          }
      }
      setIsConfigLoading(false);
  };

  const handleAiYields = async () => {
      setIsYieldLoading(true);
      const assetData = { assetName: property.title, category: property.category, address: property.location };
      const result = await estimateYieldsAndFees(assetData as any, jurisdiction);
      
      if (result) {
          if (result.annual_yield) updateProp('annual_yield', result.annual_yield);
          if (result.roi_target) updateProp('roi_target', result.roi_target);
          if (result.platform_fees) updateProp('platform_fees', result.platform_fees);
          if (result.management_fee_percentage) updateProp('management_fee_percentage', result.management_fee_percentage);
          if (result.lockup_months) updateProp('lockup_months', result.lockup_months);
          if (result.explanation) setYieldInsight(result.explanation);
      }
      setIsYieldLoading(false);
  };

  const totalRaise = (property.total_tokens || 0) * (property.token_price || 0);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold font-display text-slate-900">4. Financials & Tokenomics</h2>
            <p className="text-slate-600">Configure the capital stack, fees, and projected returns.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setActiveTab('ECONOMICS')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'ECONOMICS' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Token Config</button>
            <button onClick={() => setActiveTab('FEES_RETURNS')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'FEES_RETURNS' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Yields & Fees</button>
            <button onClick={() => setActiveTab('STRATEGY')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'STRATEGY' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}>Strategy AI</button>
        </div>
      </div>

      {/* --- TAB 1: ECONOMICS --- */}
      {activeTab === 'ECONOMICS' && (
        <div className="animate-slideUp space-y-8">
            
            <TokenomicsAiPanel 
                title="AI Token Structurer"
                description="Let AI calculate the optimal supply, price point, and allocation based on your Asset Valuation."
                buttonText="Generate Structure"
                isLoading={isConfigLoading}
                onAction={handleAiConfig}
                insight={configInsight || undefined}
                onCloseInsight={() => setConfigInsight(null)}
                icon="🏗️"
                color="bg-indigo-50 text-indigo-600 border-indigo-100"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration */}
                <div className="lg:col-span-7 space-y-6">
                    
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6">Supply & Pricing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input 
                                id="price" label="Token Price (€)" type="number" 
                                value={property.token_price || ''} onChange={e => updateProp('token_price', parseFloat(e.target.value))} 
                            />
                            <Input 
                                id="supply" label="Total Tokens" type="number" 
                                value={property.total_tokens || ''} onChange={e => updateProp('total_tokens', parseFloat(e.target.value))} 
                            />
                            <Input 
                                id="avail" label="Tokens for Sale" type="number" 
                                value={property.available_tokens || ''} onChange={e => updateProp('available_tokens', parseFloat(e.target.value))} 
                            />
                            <Input 
                                id="min" label="Min Investment (Tokens)" type="number" 
                                value={property.min_invest_tokens || ''} onChange={e => updateProp('min_invest_tokens', parseFloat(e.target.value))} 
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6">Capital Targets</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input 
                                id="soft" label="Soft Cap (€)" type="number" 
                                value={property.soft_cap || ''} onChange={e => updateProp('soft_cap', parseFloat(e.target.value))} 
                            />
                            <Input 
                                id="hard" label="Hard Cap (€)" type="number" 
                                value={property.hard_cap || ''} onChange={e => updateProp('hard_cap', parseFloat(e.target.value))} 
                            />
                            <Input 
                                id="raise" label="Target Raise (€)" type="number" 
                                value={property.raise_amount || ''} onChange={e => updateProp('raise_amount', parseFloat(e.target.value))} 
                            />
                            <Input 
                                id="costs" label="Total Costs (€)" type="number" 
                                value={property.total_costs || ''} onChange={e => updateProp('total_costs', parseFloat(e.target.value))} 
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6">Allocation</h3>
                        <div className="space-y-4">
                            {[
                                { key: 'investors', label: 'Investors', color: 'bg-brand-500' },
                                { key: 'founders', label: 'Sponsor/Owner', color: 'bg-indigo-500' },
                                { key: 'treasury', label: 'Treasury', color: 'bg-slate-400' },
                                { key: 'advisors', label: 'Advisors', color: 'bg-amber-500' },
                            ].map(item => (
                                <div key={item.key}>
                                    <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                                        <span className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${item.color}`}></span>{item.label}</span>
                                        <span>{(tokenAllocation as any)?.[item.key] || 0}%</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="100" 
                                        value={(tokenAllocation as any)?.[item.key] || 0}
                                        onChange={e => updateAlloc(item.key, parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Visuals */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
                        <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-4">
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Cap</h3>
                                <div className="text-3xl font-mono font-bold text-emerald-400 mt-1">€{totalRaise.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="space-y-3 font-mono text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Asset Value</span>
                                <span className="text-slate-300">€{property.total_value?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">LTV / Coverage</span>
                                <span className="text-emerald-400">{(property.total_value && totalRaise) ? (property.total_value / totalRaise * 100).toFixed(1) : 0}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 w-full text-left">Cap Table</h3>
                        <AllocationChart allocation={tokenAllocation} />
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- TAB 2: FEES & RETURNS --- */}
      {activeTab === 'FEES_RETURNS' && (
          <div className="animate-slideUp space-y-8">
              
              <TokenomicsAiPanel 
                title="AI Underwriter"
                description="Estimate market-standard Yields (APY) and Fee structures for this region."
                buttonText="Estimate Financials"
                isLoading={isYieldLoading}
                onAction={handleAiYields}
                insight={yieldInsight || undefined}
                onCloseInsight={() => setYieldInsight(null)}
                icon="📈"
                color="bg-emerald-50 text-emerald-600 border-emerald-100"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Returns Section */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">ROI</span>
                          Projected Returns
                      </h3>
                      <div className="space-y-6">
                          <Input 
                              id="yield" label="Annual Yield (APY) %" type="number" step="0.1"
                              value={property.annual_yield || ''} onChange={e => updateProp('annual_yield', parseFloat(e.target.value))} 
                          />
                          <Input 
                              id="gross_profit" label="Gross Profit (€)" type="number"
                              value={property.gross_profit || ''} onChange={e => updateProp('gross_profit', parseFloat(e.target.value))} 
                          />
                          <Input 
                              id="irr" label="Target IRR %" type="number" step="0.1"
                              value={property.roi_target || ''} onChange={e => updateProp('roi_target', parseFloat(e.target.value))} 
                          />
                          <div className="grid grid-cols-2 gap-4">
                              <Input 
                                  id="inc_min" label="Min Income (€)" type="number"
                                  value={property.expected_income_min || ''} onChange={e => updateProp('expected_income_min', parseFloat(e.target.value))} 
                              />
                              <Input 
                                  id="inc_max" label="Max Income (€)" type="number"
                                  value={property.expected_income_max || ''} onChange={e => updateProp('expected_income_max', parseFloat(e.target.value))} 
                              />
                          </div>
                      </div>
                  </div>

                  {/* Fees Section */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">%</span>
                          Fee Structure
                      </h3>
                      <div className="space-y-6">
                          <Input 
                              id="plat_fee" label="Platform Listing Fee (€)" type="number"
                              value={property.platform_fees || ''} onChange={e => updateProp('platform_fees', parseFloat(e.target.value))} 
                          />
                          <Input 
                              id="med_fee" label="Mediator / Broker Fee (€)" type="number"
                              value={property.mediator_fees || ''} onChange={e => updateProp('mediator_fees', parseFloat(e.target.value))} 
                          />
                          <Input 
                              id="mgmt_fee" label="Annual Mgmt Fee (%)" type="number" step="0.1"
                              value={property.management_fee_percentage || ''} onChange={e => updateProp('management_fee_percentage', parseFloat(e.target.value))} 
                          />
                          <Input 
                              id="lockup" label="Lock-up Period (Months)" type="number"
                              value={property.lockup_months || ''} onChange={e => updateProp('lockup_months', parseFloat(e.target.value))} 
                          />
                      </div>
                  </div>
              </div>

              {/* Sponsor & Income Structure */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-lg mb-6">Sponsor & Income Distribution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                          <Input 
                              id="sponsor_commit" label="Sponsor Commitment (EUR)" type="number"
                              value={property.sponsor_commitment_eur || ''} onChange={e => updateProp('sponsor_commitment_eur', parseFloat(e.target.value))}
                              placeholder="Amount invested by sponsor"
                          />
                          <Input 
                              id="investor_share" label="Investor Share (%)" type="number" step="0.1"
                              value={property.investor_share_percentage || ''} onChange={e => updateProp('investor_share_percentage', parseFloat(e.target.value))}
                              placeholder="% of equity for investors"
                          />
                          <Input 
                              id="income_start" label="Income Start Date" type="date"
                              value={property.income_start_date || ''} onChange={e => updateProp('income_start_date', e.target.value)}
                          />
                      </div>
                      <div className="space-y-6">
                          <Select 
                              id="payout" label="Payout Type"
                              options={[{value:'Quarterly Rent', label:'Quarterly Rent'}, {value:'Monthly Rent', label:'Monthly Rent'}, {value:'Annual Dividend', label:'Annual Dividend'}, {value:'Appreciation Only', label:'Appreciation Only'}]}
                              value={property.payout_type || ''} onChange={e => updateProp('payout_type', e.target.value)}
                          />
                          <Select 
                              id="rent_type" label="Rent Type"
                              options={[{value:'Long Term', label:'Long Term'}, {value:'Short Term', label:'Short Term / Airbnb'}, {value:'Commercial', label:'Commercial Lease'}]}
                              value={property.rent_type || ''} onChange={e => updateProp('rent_type', e.target.value)}
                          />
                          <div className="flex items-center gap-3 pt-4">
                              <input 
                                  type="checkbox" 
                                  id="subsidy"
                                  checked={property.rent_subsidy || false} 
                                  onChange={e => updateProp('rent_subsidy', e.target.checked)}
                                  className="w-5 h-5 text-brand-600 rounded"
                              />
                              <label htmlFor="subsidy" className="text-sm font-bold text-slate-700">Has Rent Subsidy / Guarantee?</label>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'STRATEGY' && (
        <div className="animate-slideUp">
            <DeepStrategyView 
                asset={{ category: property.category, assetName: property.title, valuation: property.total_value, assetType: property.asset_type } as any}
                project={projectInfo}
            />
        </div>
      )}
    </div>
  );
};
