
import React from 'react';
import { QuizModule } from './QuizModule';

export const BasicsTab: React.FC = () => {
  return (
    <div className="space-y-12 animate-fadeIn">
      
      {/* 1. Human Definition Hero */}
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            Concept 101
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-display mb-6">
            What is Tokenization? <span className="text-slate-400 font-normal block md:inline text-2xl md:text-4xl">(The Human Version)</span>
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            Imagine a skyscraper worth $10 million. In the past, only a billionaire could buy it. 
            <br/><br/>
            Tokenization is the process of slicing that building into 10 million digital pieces (tokens), each worth $1. 
            If you own a token, you own a legal share of the building and have the right to $1 worth of the rent collected.
          </p>

          <div className="mt-8 bg-slate-900 text-white p-6 rounded-xl inline-block max-w-2xl">
             <div className="flex items-start gap-4">
               <span className="text-2xl">💡</span>
               <div>
                 <h4 className="font-bold text-emerald-400 uppercase text-xs tracking-widest mb-1">The Core Formula</h4>
                 <p className="font-mono text-sm md:text-base">
                   Tokenization = Digital Property + Automated Rights + Global Access
                 </p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* 2. Visual: Fractionalization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
         <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-4">How "Digital Fractionalization" Works</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              We take a physical asset (Real Estate, Art, Company Equity) and wrap it in a legal company (SPV). 
              Then, instead of paper shares, we issue digital tokens on the blockchain representing those shares.
            </p>
            <ul className="space-y-3">
              {[
                "The asset stays safe in the real world.",
                "The SPV holds the legal title.",
                "The Token proves your ownership instantly."
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">{i+1}</div>
                  {item}
                </li>
              ))}
            </ul>
         </div>
         <div className="order-1 md:order-2 bg-slate-100 rounded-2xl p-8 flex items-center justify-center min-h-[300px] border border-slate-200">
            {/* Simple CSS Visualization of Splitting */}
            <div className="relative w-48 h-48">
               <div className="absolute inset-0 bg-white border-2 border-slate-300 rounded-xl shadow-sm flex items-center justify-center z-10">
                  <span className="text-4xl">🏢</span>
               </div>
               {/* Flying Tokens */}
               <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-6 w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg animate-bounce border-2 border-white">Token</div>
               <div className="absolute bottom-0 right-0 transform translate-x-12 translate-y-6 w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg animate-bounce delay-100 border-2 border-white">Token</div>
               <div className="absolute top-1/2 right-0 transform translate-x-20 -translate-y-1/2 w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg animate-bounce delay-75 border-2 border-white">Token</div>
            </div>
         </div>
      </div>

      {/* 3. Token vs Crypto */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
         <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-slate-900 font-display">Token vs. Cryptocurrency</h3>
            <p className="text-slate-500">They look the same, but legally, they are opposites.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-bold text-xl">₿</div>
                   <h4 className="font-bold text-slate-900">Cryptocurrency</h4>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                   <li>❌ No underlying asset (usually).</li>
                   <li>❌ Value based on pure supply/demand.</li>
                   <li>❌ Often anonymous and unregulated.</li>
                </ul>
            </div>
            <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-100 rounded-full blur-2xl -mr-5 -mt-5"></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                   <div className="w-10 h-10 bg-brand-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">T</div>
                   <h4 className="font-bold text-brand-900">Security Token</h4>
                </div>
                <ul className="space-y-2 text-sm text-brand-800 relative z-10">
                   <li>✅ Backed by real assets (Equity, Debt, Real Estate).</li>
                   <li>✅ Value based on asset performance.</li>
                   <li>✅ Fully regulated (KYC/AML) and legally compliant.</li>
                </ul>
            </div>
         </div>
      </div>

      {/* 4. Three Benefits */}
      <div>
         <h3 className="text-2xl font-bold text-slate-900 font-display mb-8 text-center">3 Immediate Benefits for Asset Owners</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
               { icon: "🌍", title: "Global Access", desc: "Access thousands of investors worldwide, not just the few in your local network." },
               { icon: "💧", title: "Higher Liquidity", desc: "Investors can sell their tokens 24/7 on secondary markets, reducing the 'illiquidity discount'." },
               { icon: "🔍", title: "Total Transparency", desc: "Every transaction, dividend, and document is recorded immutably on the blockchain." }
            ].map((b, i) => (
               <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 hover:border-indigo-300 transition-all hover:shadow-lg group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{b.icon}</div>
                  <h4 className="font-bold text-slate-900 mb-2">{b.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
               </div>
            ))}
         </div>
      </div>

      {/* 5. AI Quiz Section */}
      <div className="mt-16 pt-16 border-t border-slate-200">
         <QuizModule topic="Tokenization Basics" />
      </div>

    </div>
  );
};
