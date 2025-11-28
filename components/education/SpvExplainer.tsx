
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { getSpvExplanation } from '../../services/mockAiService';

export const SpvExplainer: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const personas = [
    { id: 'Beginner', icon: '👶', label: 'Complete Beginner' },
    { id: 'Real Estate Agent', icon: '🏠', label: 'Real Estate Agent' },
    { id: 'Crypto Native', icon: '₿', label: 'Crypto Trader' },
    { id: 'Founder', icon: '🚀', label: 'Startup Founder' },
  ];

  const handleExplain = async (persona: string) => {
    setSelectedPersona(persona);
    setLoading(true);
    setExplanation(''); // clear previous
    
    const result = await getSpvExplanation(persona);
    setExplanation(result);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xl shadow-sm">
            💡
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">AI Help: "Cos’è uno SPV?"</h3>
            <p className="text-sm text-slate-500">Spiegazione dinamica in base al tuo profilo.</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Chi sei?</p>
        <div className="flex flex-wrap gap-3">
            {personas.map((p) => (
                <button
                    key={p.id}
                    onClick={() => handleExplain(p.id)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium
                        ${selectedPersona === p.id 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                        }
                    `}
                >
                    <span>{p.icon}</span>
                    {p.label}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 min-h-[120px] relative border border-slate-100">
        {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 rounded-xl">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-2"></div>
                <span className="text-xs text-indigo-500 font-bold animate-pulse">Generating Explanation...</span>
            </div>
        ) : explanation ? (
            <div className="animate-fadeIn">
                <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">
                    Explanation for {selectedPersona}
                </div>
                <p className="text-slate-800 text-lg leading-relaxed font-medium">
                    "{explanation}"
                </p>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <span className="text-2xl mb-2 opacity-50">💭</span>
                <span className="text-sm">Select a persona above to generate an explanation.</span>
            </div>
        )}
      </div>
    </div>
  );
};
