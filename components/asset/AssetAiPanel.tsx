
import React from 'react';
import { Button } from '../ui/Button';

interface AssetAiPanelProps {
  title: string;
  description: string;
  onAction: () => void;
  isLoading: boolean;
  result?: {
    title: string;
    items: string[];
  } | null;
  buttonText?: string;
  variant?: 'advice' | 'autofill';
}

export const AssetAiPanel: React.FC<AssetAiPanelProps> = ({ 
  title, 
  description, 
  onAction, 
  isLoading, 
  result,
  buttonText = "Ask AI",
  variant = 'advice'
}) => {
  const isAutofill = variant === 'autofill';

  return (
    <div className={`rounded-xl border p-5 transition-all ${isAutofill ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-3">
           <div className={`p-2 rounded-lg text-lg ${isAutofill ? 'bg-white text-indigo-600 shadow-sm' : 'bg-brand-50 text-brand-600'}`}>
             {isAutofill ? '✨' : '🤖'}
           </div>
           <div>
             <h4 className={`font-bold text-sm ${isAutofill ? 'text-indigo-900' : 'text-slate-900'}`}>{title}</h4>
             <p className={`text-xs mt-1 ${isAutofill ? 'text-indigo-700' : 'text-slate-500'}`}>{description}</p>
           </div>
        </div>
        <Button 
          size="sm" 
          onClick={onAction} 
          isLoading={isLoading}
          className={isAutofill ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-900 text-white'}
        >
          {buttonText}
        </Button>
      </div>

      {result && (
        <div className="mt-4 pt-4 border-t border-slate-200/50 animate-fadeIn">
           <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{result.title}</h5>
           <ul className="space-y-2">
             {result.items.map((item, i) => (
               <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                 <span className="text-brand-500 font-bold">•</span>
                 {item}
               </li>
             ))}
           </ul>
        </div>
      )}
    </div>
  );
};
