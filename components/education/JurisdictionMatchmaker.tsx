
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { getJurisdictionRecommendation, MatchmakerResult } from '../../services/mockAiService';
import { MatchmakerPreferences } from '../../prompts/matchmakerPrompts';

export const JurisdictionMatchmaker: React.FC = () => {
  const [step, setStep] = useState<'START' | 'QUESTIONS' | 'LOADING' | 'RESULT'>('START');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [preferences, setPreferences] = useState<MatchmakerPreferences>({
    investorType: '',
    priority: '',
    assetLocation: '',
    capitalSource: ''
  });
  const [result, setResult] = useState<MatchmakerResult | null>(null);

  const QUESTIONS = [
    {
      id: 'investorType',
      question: "Who are you raising money from?",
      icon: "👥",
      options: [
        "Retail (Crowdfunding/General Public)",
        "Accredited / High Net Worth Only",
        "Institutions & Family Offices"
      ]
    },
    {
      id: 'priority',
      question: "What is your main priority?",
      icon: "🎯",
      options: [
        "Speed & Low Cost",
        "Maximum Investor Safety & Trust",
        "Tax Efficiency",
        "Privacy & Asset Protection"
      ]
    },
    {
      id: 'assetLocation',
      question: "Where is the physical asset located?",
      icon: "🌍",
      options: [
        "Domestic (Same country as Issuer)",
        "International / Cross-Border",
        "Digital Only (No physical location)"
      ]
    },
    {
      id: 'capitalSource',
      question: "Do you want to accept Crypto (USDC/USDT)?",
      icon: "₿",
      options: [
        "Yes, Crypto is essential",
        "No, Fiat currency only",
        "Hybrid (Fiat + Crypto)"
      ]
    }
  ];

  const handleAnswer = (answer: string) => {
    const questionKey = QUESTIONS[currentQuestionIdx].id as keyof MatchmakerPreferences;
    
    const newPrefs = { ...preferences, [questionKey]: answer };
    setPreferences(newPrefs);

    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setStep('LOADING');
      // Simulate slight delay for effect
      setTimeout(() => {
        getJurisdictionRecommendation(newPrefs).then((res) => {
          setResult(res);
          setStep('RESULT');
        });
      }, 1500);
    }
  };

  const handleReset = () => {
    setStep('START');
    setCurrentQuestionIdx(0);
    setResult(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mt-12 relative transition-all hover:shadow-2xl">
       {/* Background Decor */}
       <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

      {step === 'START' && (
        <div className="p-10 md:p-16 text-center relative z-10">
           <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-xl shadow-indigo-200 transform rotate-3">
             ⚖️
           </div>
           <h3 className="text-3xl md:text-4xl font-bold text-slate-900 font-display mb-4">Jurisdiction Finder</h3>
           <p className="text-slate-500 max-w-lg mx-auto mb-10 text-lg leading-relaxed">
             Should you incorporate in Delaware, Dubai, or Switzerland?
             <br/>
             Our AI analyzes your goals to find the perfect regulatory home.
           </p>
           <Button onClick={() => setStep('QUESTIONS')} className="px-10 py-4 text-lg shadow-xl shadow-indigo-500/20 rounded-full">
             Start Matchmaker →
           </Button>
           <p className="text-xs text-slate-400 mt-6 uppercase tracking-wider font-semibold">Takes 30 seconds • AI Powered</p>
        </div>
      )}

      {step === 'QUESTIONS' && (
        <div className="p-8 md:p-12 relative z-10 animate-fadeIn min-h-[500px] flex flex-col">
           <div className="flex justify-between items-center mb-10">
             <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Step {currentQuestionIdx + 1} / {QUESTIONS.length}</span>
             </div>
             <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
           </div>
           
           <div className="flex-1">
               <div className="text-4xl mb-4">{QUESTIONS[currentQuestionIdx].icon}</div>
               <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 max-w-2xl leading-tight font-display">
                 {QUESTIONS[currentQuestionIdx].question}
               </h3>

               <div className="grid grid-cols-1 gap-4">
                 {QUESTIONS[currentQuestionIdx].options.map((opt, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleAnswer(opt)}
                     className="text-left px-6 py-5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 font-medium text-slate-700 hover:text-indigo-900 flex items-center gap-4 group shadow-sm hover:shadow-md"
                   >
                     <div className="w-6 h-6 rounded-full border border-slate-300 group-hover:border-indigo-500 flex items-center justify-center text-xs text-transparent group-hover:text-indigo-500 transition-colors bg-white">
                        <div className="w-3 h-3 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </div>
                     <span className="text-lg">{opt}</span>
                   </button>
                 ))}
               </div>
           </div>
           
           {/* Progress Bar */}
           <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIdx + 1) / QUESTIONS.length) * 100}%` }}
              ></div>
           </div>
        </div>
      )}

      {step === 'LOADING' && (
        <div className="p-16 flex flex-col items-center justify-center text-center min-h-[500px]">
           <div className="relative mb-8">
               <div className="w-20 h-20 border-4 border-indigo-100 rounded-full"></div>
               <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
           </div>
           <h4 className="text-2xl font-bold text-slate-900 animate-pulse font-display">Analyzing Global Regulations...</h4>
           <div className="space-y-2 mt-4 text-slate-500">
               <p>Checking Tax Treaties...</p>
               <p>Verifying Crypto Compliance...</p>
               <p>Matching Investor Protection Rules...</p>
           </div>
        </div>
      )}

      {step === 'RESULT' && result && (
        <div className="p-8 md:p-12 animate-slideUp relative z-10 bg-slate-50/50">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Recommendation</span>
              </div>
              <button onClick={handleReset} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Start Over</button>
           </div>

           <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-4 -mt-4"></div>
              
              <div className="relative z-10">
                  <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Top Recommendation</h5>
                  <h3 className="text-4xl md:text-5xl font-bold text-slate-900 font-display mb-1">
                    {result.jurisdiction}
                  </h3>
                  <p className="text-xl text-indigo-600 font-medium mb-6">{result.entityType}</p>
                  
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-6">
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {result.reasoning}
                      </p>
                  </div>
              </div>
           </div>
              
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h5 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <span className="text-amber-500 text-lg">⚠️</span> Compliance Note
                 </h5>
                 <p className="text-sm text-slate-600 leading-relaxed">
                   {result.complianceNote}
                 </p>
              </div>

              <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h5 className="font-bold text-green-700 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Pros
                 </h5>
                 <ul className="space-y-3">
                    {result.pros.map((pro, i) => (
                       <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          {pro}
                       </li>
                    ))}
                 </ul>
              </div>

              <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h5 className="font-bold text-red-700 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Cons
                 </h5>
                 <ul className="space-y-3">
                    {result.cons.map((con, i) => (
                       <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          {con}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
