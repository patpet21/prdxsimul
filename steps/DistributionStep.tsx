
import React, { useEffect } from 'react';
import { StepProps } from '../types';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';

export const DistributionStep: React.FC<StepProps> = ({ data, updateData, onValidationChange }) => {
  const { distribution } = data;

  useEffect(() => {
    onValidationChange(Boolean(distribution.targetInvestorType && distribution.minInvestment > 0));
  }, [distribution, onValidationChange]);

  const handleChange = (field: string, val: any) => updateData('distribution', { [field]: val });

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-display text-slate-900">5. Distribution Strategy</h2>
        <p className="text-slate-600">How will you market the offering and onboard investors?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Investor Profile</h3>
            <Select
              id="investorType" label="Target Audience"
              value={distribution.targetInvestorType}
              onChange={e => handleChange('targetInvestorType', e.target.value)}
              options={[
                { value: 'Retail', label: 'Retail (Crowdfunding - Reg A+ / MiCA)' },
                { value: 'Accredited', label: 'Accredited / HNWIs (Reg D)' },
                { value: 'Institutional', label: 'Family Offices & Institutions' },
              ]}
            />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input 
                id="min" label="Min Ticket Size ($)" type="number"
                value={distribution.minInvestment || ''} onChange={e => handleChange('minInvestment', parseFloat(e.target.value))}
              />
              <Input 
                id="max" label="Max Ticket Size ($)" type="number" placeholder="No Limit"
                value={distribution.maxInvestment || ''} onChange={e => handleChange('maxInvestment', parseFloat(e.target.value))}
              />
            </div>
         </div>

         <div className="md:col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Marketing Channels</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               {['Direct Website', 'Launchpad Partner', 'Broker-Dealer', 'Crypto Exchanges', 'Private Network'].map(channel => {
                 const isActive = distribution.marketingChannels.includes(channel);
                 return (
                   <button
                     key={channel}
                     onClick={() => {
                        const newCh = isActive ? distribution.marketingChannels.filter(c => c !== channel) : [...distribution.marketingChannels, channel];
                        handleChange('marketingChannels', newCh);
                     }}
                     className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all text-left ${
                       isActive ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                     }`}
                   >
                     {isActive ? '✓ ' : '+ '} {channel}
                   </button>
                 )
               })}
            </div>
         </div>
      </div>
    </div>
  );
};
