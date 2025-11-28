
import React from 'react';
import { Button } from '../ui/Button';

interface TokenomicsAiPanelProps {
  title: string;
  description: string;
  onAction: () => void;
  isLoading: boolean;
  buttonText?: string;
  insight?: string;
  onCloseInsight?: () => void;
  icon?: string;
  color?: string;
}

export const TokenomicsAiPanel: React.FC<TokenomicsAiPanelProps> = ({ 
  title, 
  description, 
  onAction, 
  isLoading, 
  buttonText = "Run Analysis",
  insight,
  onCloseInsight,
  icon = "📊",
  color = "bg-blue-50 text-blue-600 border-blue-100"
}) => {
  return (
    <div className={`rounded-xl border border-dashed transition-all mb-6 ${insight ? 'bg-white border-brand-200' : 'bg-slate-50 border-slate-200'}`}>
      <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
           <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0 ${color}`}>
             {icon}
           </div>
           <div>
             <h4 className="font-bold text-slate-900 text-base">{title}</h4>
             <p className="text-sm text-slate-500 max-w-lg leading-relaxed">{description}</p>
           </div>
        </div>
        <Button 
          size="md" 
          onClick={onAction} 
          isLoading={isLoading}
          className="bg-slate-900 text-white shadow-lg whitespace-nowrap"
        >
          {buttonText}
        </Button>
      </div>

      {insight && (
        <div className="mx-5 mb-5 p-4 bg-brand-50 border-l-4 border-brand-500 rounded-r-lg relative animate-fadeIn">
           <div className="flex justify-between items-start">
               <div>
                   <h5 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">AI Strategy Insight</h5>
                   <p className="text-sm text-brand-900 font-medium leading-relaxed italic">"{insight}"</p>
               </div>
               {onCloseInsight && (
                   <button onClick={onCloseInsight} className="text-brand-400 hover:text-brand-600 ml-4">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
               )}
           </div>
        </div>
      )}
    </div>
  );
};
