
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">
        {label}
      </label>
      <input
        id={id}
        className={`
            px-4 py-3 bg-white border rounded-xl outline-none transition-all duration-200
            ${error 
                ? 'border-red-300 focus:ring-4 focus:ring-red-100' 
                : 'border-slate-200 shadow-sm hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-50'
            }
            placeholder:text-slate-400 text-slate-800 font-medium
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium ml-1">{error}</span>}
    </div>
  );
};
