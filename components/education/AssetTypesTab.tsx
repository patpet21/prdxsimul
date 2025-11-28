
import React, { useState } from 'react';
import { TokenizabilityChecker } from './TokenizabilityChecker';

export const AssetTypesTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const assetCategories = [
    {
      title: "Real Estate",
      icon: "🏢",
      description: "The largest asset class, now fractionalized.",
      examples: ["Hotels & Resorts", "Multifamily Housing", "Developable Land", "Commercial Offices"],
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      title: "Companies / Equity",
      icon: "🚀",
      description: "Democratizing access to private equity.",
      examples: ["Pre-IPO Startups", "SME Equity", "Revenue-Share Models", "Dividend Stocks"],
      color: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      title: "Art & Collectibles",
      icon: "🎨",
      description: "Turning passion assets into liquid investments.",
      examples: ["Fine Art Masterpieces", "Classic Cars", "Luxury Watches", "Wine Collections"],
      color: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      title: "Debt Instruments",
      icon: "💳",
      description: "Fixed-income yields on the blockchain.",
      examples: ["Corporate Bonds", "Private Credit/Loans", "Fixed Yield Notes", "Invoice Factoring"],
      color: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      title: "Funds",
      icon: "💼",
      description: "Bundled assets for diversified exposure.",
      examples: ["LP Interests", "Multi-Asset SPVs", "Index Funds", "REITs"],
      color: "bg-slate-50 text-slate-700 border-slate-200"
    },
    {
      title: "Special Cases",
      icon: "✨",
      description: "Innovative economic models.",
      examples: ["Lease-to-Own Real Estate", "Co-working Token Economies", "Royalty Rights (Music)", "Carbon Credits"],
      color: "bg-pink-50 text-pink-700 border-pink-200"
    }
  ];

  return (
    <div className="space-y-12 animate-fadeIn">
      
      {/* Hero / Micro-callout */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-14 text-center relative overflow-hidden shadow-2xl group">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/20 blur-[100px] rounded-full -ml-20 -mt-20 group-hover:bg-brand-500/30 transition-colors duration-1000"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full -mr-20 -mb-20 group-hover:bg-indigo-500/30 transition-colors duration-1000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-8 bg-white/10 text-white/90 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-lg">
                <span className="text-lg">💎</span> The Golden Rule of Tokenization
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white font-display leading-tight mb-6 drop-shadow-lg">
                "If it has value <span className="text-brand-400 inline-block transform hover:translate-x-1 transition-transform">→</span> it can be tokenized.<br />
                If it generates cashflow <span className="text-emerald-400 inline-block transform hover:translate-x-1 transition-transform">→</span> it becomes investable."
            </h2>
        </div>
      </div>

      <div className="space-y-6">
          <div className="flex items-end justify-between px-2">
            <div>
                <h3 className="text-2xl font-bold text-slate-900 font-display">Select an Asset Class</h3>
                <p className="text-slate-500 mt-1">Click a card below to focus the AI analysis tool.</p>
            </div>
          </div>
          
          {/* Grid of Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assetCategories.map((cat, idx) => {
                const isSelected = selectedCategory === cat.title;
                return (
                    <button 
                        key={idx} 
                        onClick={() => setSelectedCategory(isSelected ? null : cat.title)}
                        className={`
                            text-left p-6 md:p-8 rounded-2xl border transition-all duration-300 group relative overflow-hidden flex flex-col h-full
                            ${isSelected 
                                ? 'ring-4 ring-brand-500/20 border-brand-500 bg-white shadow-2xl transform scale-[1.02] z-10' 
                                : `bg-white hover:shadow-xl hover:-translate-y-1 ${cat.color.replace('bg-', 'hover:bg-').replace('text-', 'hover:border-')}`
                            }
                        `}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${cat.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                {cat.icon}
                            </div>
                            {isSelected && (
                                <div className="bg-brand-500 text-white rounded-full p-1.5 shadow-md animate-scaleIn">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            )}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 font-display">{cat.title}</h3>
                        <p className="text-base text-slate-500 mb-8 min-h-[50px] leading-relaxed">{cat.description}</p>
                        
                        <div className={`mt-auto rounded-xl p-5 border transition-colors ${isSelected ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-100 group-hover:bg-white/50'}`}>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Popular Examples</span>
                            <ul className="space-y-2.5">
                                {cat.examples.map((ex, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                                        <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isSelected ? 'bg-brand-500' : 'bg-slate-300 group-hover:bg-brand-400'}`}></span>
                                        {ex}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </button>
                );
            })}
          </div>
      </div>

      {/* Interactive AI Checker */}
      <TokenizabilityChecker selectedCategory={selectedCategory || undefined} />

    </div>
  );
};
