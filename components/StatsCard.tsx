
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  colorClass: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, trendUp, icon, colorClass }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group hover:border-brand-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 font-display tracking-tight group-hover:text-brand-700 transition-colors">{value}</h3>
          
          {trend && (
            <div className={`flex items-center mt-3 text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
              <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}>
                {trendUp ? '↑' : '↓'} {trend}
              </span>
              <span className="ml-2 text-slate-400">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
