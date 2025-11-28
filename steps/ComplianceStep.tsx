
import React, { useEffect } from 'react';
import { StepProps } from '../types';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';

export const ComplianceStep: React.FC<StepProps> = ({ data, updateData, onValidationChange }) => {
  const { compliance, jurisdiction } = data;

  useEffect(() => {
    onValidationChange(Boolean(compliance.kycProvider && compliance.regFramework));
  }, [compliance, onValidationChange]);

  const handleChange = (field: string, val: any) => updateData('compliance', { [field]: val });
  const toggleRestriction = (code: string) => {
    const list = compliance.jurisdictionRestrictions.includes(code)
      ? compliance.jurisdictionRestrictions.filter(c => c !== code)
      : [...compliance.jurisdictionRestrictions, code];
    handleChange('jurisdictionRestrictions', list);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-display text-slate-900">3. Compliance & Regulations</h2>
        <p className="text-slate-600">Configure the rules engine to ensure your token remains compliant across borders.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Regulatory Framework</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Select
             id="framework" label="Primary Exemption / Regulation"
             value={compliance.regFramework || ''}
             onChange={e => handleChange('regFramework', e.target.value)}
             options={[
               { value: 'Reg D', label: 'US Reg D 506(c) (Accredited Only)' },
               { value: 'Reg S', label: 'US Reg S (Non-US Investors)' },
               { value: 'Reg A+', label: 'US Reg A+ (Mini IPO)' },
               { value: 'MiCA', label: 'EU MiCA (Crypto Assets)' },
             ]} 
           />
           <Select
             id="kyc" label="Identity Verification (KYC/AML) Partner"
             value={compliance.kycProvider}
             onChange={e => handleChange('kycProvider', e.target.value)}
             options={[
               { value: 'SumSub', label: 'SumSub (Global)' },
               { value: 'ParallelMarkets', label: 'Parallel Markets (US Accreditation)' },
               { value: 'Fractal', label: 'Fractal ID (Web3 Native)' },
             ]} 
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
           <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-brand-600 rounded" 
                  checked={compliance.accreditationRequired}
                  onChange={e => handleChange('accreditationRequired', e.target.checked)}
                />
                <div>
                  <span className="block font-bold text-slate-700 text-sm">Enforce Accreditation</span>
                  <span className="text-xs text-slate-500">Only allow verified high-net-worth individuals.</span>
                </div>
              </label>
           </div>
           
           <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-brand-600 rounded" 
                  checked={compliance.amlCheckEnabled}
                  onChange={e => handleChange('amlCheckEnabled', e.target.checked)}
                />
                <div>
                  <span className="block font-bold text-slate-700 text-sm">Daily AML Screening</span>
                  <span className="text-xs text-slate-500">Check token holders against OFAC/Sanctions lists.</span>
                </div>
              </label>
           </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
         <h3 className="font-bold text-slate-800 mb-4">Geo-Blocking & Sanctions</h3>
         <p className="text-sm text-slate-500 mb-4">Select jurisdictions to automatically block at the smart contract level.</p>
         
         <div className="flex flex-wrap gap-3">
            {[
              { code: 'KP', label: 'North Korea' },
              { code: 'IR', label: 'Iran' },
              { code: 'SY', label: 'Syria' },
              { code: 'RU', label: 'Russia' },
              { code: 'US', label: 'United States' }, // Common for Reg S only
              { code: 'CN', label: 'China' },
            ].map(c => {
               const isBlocked = compliance.jurisdictionRestrictions.includes(c.code);
               return (
                 <button 
                   key={c.code}
                   onClick={() => toggleRestriction(c.code)}
                   className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                     isBlocked 
                       ? 'bg-red-100 text-red-700 border-red-300' 
                       : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                   }`}
                 >
                   {isBlocked ? 'Blocked: ' : 'Allow: '} {c.label}
                 </button>
               );
            })}
         </div>
      </div>
    </div>
  );
};
