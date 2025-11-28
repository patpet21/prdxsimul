
import React from 'react';

interface VestingVisualizerProps {
  schedule: string;
}

export const VestingVisualizer: React.FC<VestingVisualizerProps> = ({ schedule }) => {
  const isCliff = schedule.toLowerCase().includes('cliff');
  const years = 4; // Mock timeline length

  return (
    <div className="bg-slate-900 rounded-xl p-6 text-white overflow-hidden relative">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Lock-up & Vesting Simulation
      </h4>
      
      <div className="relative h-24 mt-2">
        {/* Baseline */}
        <div className="absolute bottom-0 w-full h-px bg-slate-700"></div>
        
        {/* Graph Line */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
           <path 
             d={isCliff 
                ? "M0,96 L50,96 L50,60 L200,10" // Cliff shape
                : "M0,96 L200,10" // Linear shape
             }
             fill="none" 
             stroke="#10b981" 
             strokeWidth="3"
             strokeDasharray="4 2"
             className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
           />
           {isCliff && <circle cx="50" cy="60" r="4" fill="#10b981" />}
        </svg>

        {/* Labels */}
        <div className="flex justify-between text-[10px] text-slate-500 mt-24 pt-2">
           <span>TGE (Day 0)</span>
           <span>Year 1</span>
           <span>Year 2</span>
           <span>Year 3</span>
           <span>Year 4</span>
        </div>
      </div>

      <div className="mt-6 text-xs text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
         <strong className="text-emerald-400 block mb-1">Educational Note:</strong>
         {isCliff 
           ? "A 'Cliff' ensures founders/investors cannot sell immediately. This aligns long-term incentives and protects retail holders from early dumping."
           : "Linear vesting releases tokens gradually every block or month. It provides a smoother supply curve but less initial protection than a cliff."
         }
      </div>
    </div>
  );
};
