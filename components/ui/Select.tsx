
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', id, ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">
        {label}
      </label>
      <div className="relative">
        <select
            id={id}
            className={`
                w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all duration-200 appearance-none
                ${error 
                    ? 'border-red-300 focus:ring-4 focus:ring-red-100' 
                    : 'border-slate-200 shadow-sm hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-50'
                }
                text-slate-800 font-medium
            `}
            {...props}
        >
            <option value="" disabled>Select an option</option>
            {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
            ))}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      {error && <span className="text-xs text-red-500 font-medium ml-1">{error}</span>}
    </div>
  );
};
