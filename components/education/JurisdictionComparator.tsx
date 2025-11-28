
import React, { useState } from 'react';
import { getJurisdictionSummary } from '../../services/mockAiService';

export const JurisdictionComparator: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const regions = [
    { id: 'USA', label: '🇺🇸 USA', color: 'hover:bg-blue-50 hover:border-blue-200' },
    { id: 'UAE', label: '🇦🇪 UAE', color: 'hover:bg-emerald-50 hover:border-emerald-200' },
    { id: 'Europe (EU)', label: '🇪🇺 Europe', color: 'hover:bg-indigo-50 hover:border-indigo-200' },
    { id: 'Thailand', label: '🇹🇭 Thailand', color: 'hover:bg-amber-50 hover:border-amber-200' },
    { id: 'India', label: '🇮🇳 India', color: 'hover:bg-orange-50 hover:border-orange-200' },
    { id: 'Switzerland', label: '🇨🇭 Switzerland', color: 'hover:bg-red-50 hover:border-red-200' },
  ];

  const handleCompare = async (region: string) => {
    if (selectedRegion === region && summary) return; // avoid re-fetch
    setSelectedRegion(region);
    setLoading(true);
    setSummary('');

    const result = await getJurisdictionSummary(region);
    setSummary(result);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xl shadow-sm">
            🌍
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">AI Help: "Differenze tra paesi"</h3>
            <p className="text-sm text-slate-500">Risposte semplici in 3 frasi.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {regions.map((r) => (
            <button
                key={r.id}
                onClick={() => handleCompare(r.id)}
                className={`
                    px-4 py-3 rounded-xl border font-bold text-sm transition-all text-left
                    ${selectedRegion === r.id 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : `bg-white text-slate-600 border-slate-200 ${r.color}`
                    }
                `}
            >
                {r.label}
            </button>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-6 min-h-[100px] relative border border-slate-100 flex items-center">
        {loading ? (
             <div className="w-full flex items-center gap-3 justify-center text-slate-500">
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Consulting Legal Database...</span>
             </div>
        ) : summary ? (
            <div className="animate-slideUp w-full">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Snapshot: {selectedRegion}</span>
                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-400">3 Sentences</span>
                </div>
                <p className="text-slate-800 text-base leading-relaxed font-medium">
                    {summary}
                </p>
            </div>
        ) : (
            <div className="text-center w-full text-slate-400 text-sm">
                Select a country to see a quick 3-sentence summary.
            </div>
        )}
      </div>
    </div>
  );
};
