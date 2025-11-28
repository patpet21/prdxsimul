
import React from 'react';

interface AllocationChartProps {
  allocation: {
    founders: number;
    investors: number;
    treasury: number;
    advisors: number;
  };
}

export const AllocationChart: React.FC<AllocationChartProps> = ({ allocation }) => {
  // Simple SVG Donut Chart Logic
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  
  const segments = [
    { key: 'investors', label: 'Public Sale', value: allocation.investors, color: '#0ea5e9' }, // brand-500
    { key: 'founders', label: 'Team & Founders', value: allocation.founders, color: '#6366f1' }, // indigo-500
    { key: 'treasury', label: 'Reserve / Treasury', value: allocation.treasury, color: '#94a3b8' }, // slate-400
    { key: 'advisors', label: 'Partners & Advisors', value: allocation.advisors, color: '#f59e0b' }, // amber-500
  ];

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64">
        <svg viewBox="0 0 200 200" className="transform -rotate-90 w-full h-full drop-shadow-xl">
          {segments.map((seg, i) => {
            const strokeDasharray = `${(seg.value / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += seg.value;

            return (
              <circle
                key={seg.key}
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth="20"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out hover:stroke-width-24 cursor-pointer"
              />
            );
          })}
          {/* Inner Text */}
          <text x="50%" y="50%" textAnchor="middle" dy="0.3em" transform="rotate(90 100 100)" className="font-bold text-3xl fill-slate-700 font-display">
            100%
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></div>
              <span className="text-xs font-bold text-slate-600 uppercase">{seg.label}</span>
            </div>
            <span className="font-mono font-bold text-slate-900">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
