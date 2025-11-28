
import React from 'react';
import { TokenizationCategory } from '../types';

interface CategoryPageProps {
  onSelect: (category: TokenizationCategory) => void;
  onBack: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ onSelect, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-start md:items-center justify-center p-4 pt-10 md:pt-4 font-sans animate-fadeIn">
       <div className="max-w-6xl w-full">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-brand-600 font-bold tracking-widest uppercase text-[10px] md:text-xs mb-2 block">Phase 1: Initiation</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6 font-display">Select Asset Class</h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-lg leading-relaxed px-4">
              Our AI infrastructure adapts the legal framework, compliance rules, and valuation models based on your specific asset type.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 px-0 md:px-4">
             {[
               { 
                 id: 'Real Estate', 
                 icon: '🏢', 
                 title: 'Real Estate',
                 desc: 'Single family, commercial buildings, REITs, and land developments.', 
                 color: 'border-blue-200 shadow-blue-500/10' 
               },
               { 
                 id: 'Business', 
                 icon: '🚀', 
                 title: 'Companies (Equity)',
                 desc: 'Startups, SMEs, revenue-share models, and VC funds.', 
                 color: 'border-emerald-200 shadow-emerald-500/10' 
               },
               { 
                 id: 'Art', 
                 icon: '🎨', 
                 title: 'Art & Collectibles',
                 desc: 'Fine art, luxury watches, classic cars, and intellectual property.', 
                 color: 'border-purple-200 shadow-purple-500/10' 
               }
             ].map((cat) => (
               <button 
                 key={cat.id}
                 onClick={() => onSelect(cat.id as TokenizationCategory)}
                 className={`
                    relative bg-white p-6 md:p-10 rounded-2xl md:rounded-[2rem] border-2 shadow-sm transition-all duration-300 group 
                    active:scale-95 hover:-translate-y-2 hover:shadow-xl text-left flex flex-row md:flex-col items-center md:items-start
                    ${cat.color} hover:border-brand-300
                 `}
               >
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-2xl md:text-4xl md:mb-8 shrink-0 mr-4 md:mr-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-3 font-display">{cat.title}</h3>
                    <p className="text-xs md:text-base text-slate-500 leading-relaxed md:mb-8">{cat.desc}</p>
                  </div>
                  
                  <div className="hidden md:flex mt-auto items-center text-sm font-bold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    Select Framework <span className="ml-2">→</span>
                  </div>
                  {/* Mobile Only Arrow */}
                  <div className="md:hidden text-slate-300 ml-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
               </button>
             ))}
          </div>
          
          <div className="text-center mt-10 md:mt-16 pb-10 md:pb-0">
            <button onClick={onBack} className="text-slate-400 hover:text-slate-600 font-medium tracking-wide text-xs md:text-sm flex items-center justify-center gap-2 mx-auto transition-colors p-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Return to Home
            </button>
          </div>
       </div>
    </div>
  );
};
