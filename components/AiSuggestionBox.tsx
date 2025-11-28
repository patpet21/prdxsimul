
import React from 'react';
import { AiResponse } from '../services/mockAiService';

interface AiSuggestionBoxProps {
  content: AiResponse | null;
  isLoading: boolean;
  onAsk: () => void;
  title?: string;
  contextNote?: string;
}

export const AiSuggestionBox: React.FC<AiSuggestionBoxProps> = ({ content, isLoading, onAsk, title = "AI Legal Education", contextNote }) => {
  return (
    <div className="mt-8 relative overflow-hidden rounded-xl border border-indigo-100 shadow-lg bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-brand-50 px-6 py-4 flex justify-between items-center border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm text-brand-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{title}</h4>
            <p className="text-xs text-slate-500">Educational Guidance • Not Legal Advice</p>
          </div>
        </div>
        
        <button 
          onClick={onAsk}
          disabled={isLoading}
          className="text-xs font-bold uppercase tracking-wider text-brand-600 hover:text-brand-800 bg-white px-3 py-1.5 rounded-full border border-brand-200 shadow-sm hover:shadow transition-all disabled:opacity-50"
        >
          {isLoading ? 'Analyzing...' : 'Run Education Scan'}
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-slate-50 rounded-xl border border-slate-100"></div>
                <div className="h-24 bg-slate-50 rounded-xl border border-slate-100"></div>
                <div className="h-24 bg-slate-50 rounded-xl border border-slate-100"></div>
                <div className="h-24 bg-slate-50 rounded-xl border border-slate-100"></div>
            </div>
          </div>
        ) : content ? (
          <div className="animate-fadeIn">
            {/* If we have the new structured format */}
            {content.restrictions ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. Restrictions */}
                    <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 hover:border-red-200 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-red-700">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                             <h5 className="font-bold text-xs uppercase tracking-wider">Entity Restrictions</h5>
                        </div>
                        <p className="text-sm text-red-900 leading-relaxed font-medium">{content.restrictions}</p>
                    </div>

                    {/* 2. Minimum Docs */}
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                             <h5 className="font-bold text-xs uppercase tracking-wider">Required Docs</h5>
                        </div>
                        <ul className="text-sm text-blue-900 space-y-1">
                            {content.minDocs?.map((doc, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-blue-400"></span> {doc}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Geo Blocking */}
                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 hover:border-amber-200 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-amber-700">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <h5 className="font-bold text-xs uppercase tracking-wider">Geo-Blocking Hints</h5>
                        </div>
                        <p className="text-sm text-amber-900 leading-relaxed font-medium">{content.geoBlocking}</p>
                    </div>

                    {/* 4. Risk Note */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-slate-600">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <h5 className="font-bold text-xs uppercase tracking-wider">Educational Note</h5>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed italic">"{content.riskNote}"</p>
                    </div>
                </div>
            ) : (
                // Fallback to old format if necessary
                <div className="space-y-4">
                     <p className="text-sm text-slate-700">{content.text}</p>
                </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-slate-500 mb-2">
              {contextNote || "Configure the fields above, then ask our AI to valid structure, taxes, and risks."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
