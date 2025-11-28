
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { AssetData, ProjectInfo } from '../types';
import { generateBusinessPlan } from '../services/mockAiService';

interface BusinessPlanGeneratorProps {
  asset: AssetData;
  projectInfo: ProjectInfo;
  onUpdate: (plan: string) => void;
}

export const BusinessPlanGenerator: React.FC<BusinessPlanGeneratorProps> = ({ asset, projectInfo, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const plan = await generateBusinessPlan(asset, projectInfo);
    onUpdate(plan);
    setIsGenerating(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </span>
            Business Plan & Strategy
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            This document will be embedded in the Smart Contract and visible to investors.
          </p>
        </div>
        
        <Button 
          onClick={handleGenerate} 
          isLoading={isGenerating}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200"
        >
          {isGenerating ? 'AI Writing Plan...' : '✨ Generate with AI'}
        </Button>
      </div>

      <div className="relative">
        {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                <p className="text-indigo-600 font-medium animate-pulse">Analyzing Step 1 & 2 Data...</p>
            </div>
        )}
        
        {asset.generatedBusinessPlan ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400 uppercase tracking-wider font-bold px-1">
                  <span>Markdown Editor</span>
                  <span>{asset.generatedBusinessPlan.length} chars</span>
              </div>
              <textarea 
                  className="w-full h-[600px] p-6 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed font-mono resize-y"
                  value={asset.generatedBusinessPlan}
                  onChange={e => onUpdate(e.target.value)}
              />
            </div>
        ) : (
            <div className="h-64 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                <span className="font-medium">No plan generated yet.</span>
                <span className="text-xs mt-1">Click "Generate with AI" to create a plan based on your Project Info.</span>
            </div>
        )}
      </div>
      
      <div className="mt-4 bg-yellow-50 border border-yellow-100 p-4 rounded-lg flex items-start gap-3">
          <div className="text-yellow-600 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
              <h4 className="text-xs font-bold text-yellow-800 uppercase mb-1">Editor Tip</h4>
              <p className="text-xs text-yellow-700 leading-relaxed">
                  You can manually link an external PDF (e.g., DocSend) below if you prefer not to use the on-chain text format.
              </p>
          </div>
      </div>
    </div>
  );
};