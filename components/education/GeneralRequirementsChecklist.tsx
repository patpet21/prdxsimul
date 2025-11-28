
import React, { useState } from 'react';
import { getGeneralRequirements } from '../../services/mockAiService';
import { Button } from '../ui/Button';

export const GeneralRequirementsChecklist: React.FC = () => {
  const [assetType, setAssetType] = useState('Real Estate');
  const [checklist, setChecklist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await getGeneralRequirements(assetType);
    setChecklist(result);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xl shadow-sm">
            ✅
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">AI Help: "What is Needed?"</h3>
            <p className="text-sm text-slate-500">Dynamic 3-step requirements list.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-slate-500 outline-none"
            placeholder="e.g. Real Estate, Startup, Art..."
          />
          <Button onClick={handleGenerate} isLoading={loading} className="whitespace-nowrap bg-slate-800 text-white text-sm">
             Generate
          </Button>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex-1 relative min-h-[150px]">
        {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 rounded-xl z-10">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mb-2"></div>
                <span className="text-xs text-slate-500 font-bold animate-pulse">Building Checklist...</span>
            </div>
        ) : checklist.length > 0 ? (
            <div className="animate-fadeIn">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Top 3 Requirements for {assetType}
                </div>
                <ul className="space-y-3">
                    {checklist.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                            <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">
                                {i+1}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
                <span className="text-2xl mb-2 opacity-30">📋</span>
                <span className="text-sm">Enter an asset type and click Generate to see requirements.</span>
            </div>
        )}
      </div>
    </div>
  );
};
