
import React, { useState } from 'react';
import { ENTITY_LIBRARY, JURISDICTION_METADATA, EntityDefinition } from '../../content/jurisdictionContent';

// Helper to flatten all entities for easy searching
const getAllEntities = () => {
  const all: (EntityDefinition & { countryCode: string; countryFlag: string })[] = [];
  Object.keys(ENTITY_LIBRARY).forEach(countryCode => {
    const countryMeta = JURISDICTION_METADATA.find(m => m.code === countryCode);
    ENTITY_LIBRARY[countryCode].forEach(ent => {
      all.push({
        ...ent,
        countryCode,
        countryFlag: countryMeta?.flag || '🏳️'
      });
    });
  });
  return all;
};

export const StructureComparator: React.FC = () => {
  const allEntities = getAllEntities();
  const [selectedIds, setSelectedIds] = useState<string[]>(['US-LLC', 'UK-LTD']); // Default comparison

  // Helper to construct unique ID since IDs might overlap across countries (though usually distinct)
  const getUniqueId = (e: any) => `${e.countryCode}-${e.id}`;

  const handleToggle = (uniqueId: string) => {
    if (selectedIds.includes(uniqueId)) {
      setSelectedIds(prev => prev.filter(id => id !== uniqueId));
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds(prev => [...prev, uniqueId]);
      }
    }
  };

  const selectedEntities = allEntities.filter(e => selectedIds.includes(getUniqueId(e)));

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mt-12 relative">
      {/* Header */}
      <div className="bg-slate-900 p-8 text-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
               ⚖️
             </div>
             <h3 className="text-2xl font-bold font-display">Structure Showdown</h3>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Not sure which vehicle to drive? Compare legal structures side-by-side to find the right balance of cost, speed, and protection.
          </p>
        </div>
      </div>

      {/* Selector Area */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 md:p-6">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Select Structures to Compare ({selectedIds.length}/3)
        </h4>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {allEntities.map((ent) => {
            const uid = getUniqueId(ent);
            const isSelected = selectedIds.includes(uid);
            const isDisabled = !isSelected && selectedIds.length >= 3;

            return (
              <button
                key={uid}
                onClick={() => handleToggle(uid)}
                disabled={isDisabled}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-bold border transition-all
                  ${isSelected 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                    : isDisabled
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }
                `}
              >
                <span>{ent.countryFlag}</span>
                {ent.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] grid grid-cols-[200px_repeat(3,1fr)] divide-x divide-slate-100">
          
          {/* Labels Column */}
          <div className="bg-white py-6">
             <div className="h-24 px-6 flex items-center text-sm font-bold text-slate-400 uppercase tracking-wider">Entity</div>
             <div className="h-16 px-6 flex items-center text-sm font-semibold text-slate-600 bg-slate-50/50">Setup Time</div>
             <div className="h-16 px-6 flex items-center text-sm font-semibold text-slate-600">Min Capital</div>
             <div className="h-24 px-6 flex items-center text-sm font-semibold text-slate-600 bg-slate-50/50">Tax Impact</div>
             <div className="h-24 px-6 flex items-center text-sm font-semibold text-slate-600">Best For</div>
             <div className="h-16 px-6 flex items-center text-sm font-semibold text-slate-600 bg-slate-50/50">Access</div>
          </div>

          {/* Entity Columns */}
          {selectedEntities.map((ent, idx) => (
             <div key={idx} className="bg-white py-6 relative group hover:bg-slate-50/30 transition-colors">
                {/* Header Cell */}
                <div className="h-24 px-6 flex flex-col justify-center border-b border-slate-50">
                    <div className="text-3xl mb-2">{ent.countryFlag}</div>
                    <h3 className="font-bold text-slate-900 text-lg leading-none mb-1">{ent.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded w-fit font-bold uppercase tracking-wider ${ent.badgeColor}`}>
                      {ent.badge}
                    </span>
                </div>

                {/* Setup Time */}
                <div className="h-16 px-6 flex items-center bg-slate-50/50 border-b border-white">
                   <div className="flex items-center gap-2 font-mono font-bold text-slate-700">
                     <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     {ent.setupTime}
                   </div>
                </div>

                {/* Capital */}
                <div className="h-16 px-6 flex items-center border-b border-slate-50">
                   <div className="flex items-center gap-2 font-mono font-bold text-slate-700">
                     <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     {ent.minCapitalLabel}
                   </div>
                </div>

                {/* Tax */}
                <div className="h-24 px-6 flex items-center bg-slate-50/50 border-b border-white">
                   <p className="text-xs text-slate-600 font-medium leading-relaxed">
                     <span className="block font-bold text-slate-900 mb-1">{ent.taxPreview}</span>
                     {ent.fiscalImplications.substring(0, 60)}...
                   </p>
                </div>

                 {/* Best For */}
                 <div className="h-24 px-6 flex items-center border-b border-slate-50">
                   <p className="text-sm text-indigo-600 font-bold leading-tight">
                     {ent.bestFor}
                   </p>
                </div>

                {/* Access */}
                <div className="h-16 px-6 flex items-center bg-slate-50/50">
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600">
                     {ent.investorAccess}
                   </span>
                </div>

             </div>
          ))}

          {/* Empty State Fillers if < 3 selected */}
          {Array.from({ length: 3 - selectedEntities.length }).map((_, i) => (
             <div key={`empty-${i}`} className="bg-slate-50/20 py-6 flex flex-col items-center justify-center opacity-40">
                <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-300 mb-2">
                   <span className="text-2xl">+</span>
                </div>
                <span className="text-sm font-medium text-slate-400">Add Structure</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};
