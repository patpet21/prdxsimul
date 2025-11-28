
import React, { useEffect, useState, useRef } from 'react';
import { StepProps } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AiSuggestionBox } from '../components/AiSuggestionBox';
import { analyzeJurisdiction, getRegionRecommendations, getSpvRecommendation, generateEntityDetails, AiResponse } from '../services/mockAiService';
import { ENTITY_LIBRARY, JURISDICTION_METADATA, JurisdictionMeta, EntityDefinition } from '../content/jurisdictionContent';

// --- GLOSSARY & TOOLTIPS ---

const TOOLTIP_DEFINITIONS: Record<string, string> = {
  "pass-through taxation": "Profits are not taxed at the entity level. Instead, they 'pass through' to owners' personal tax returns, avoiding double taxation.",
  "charging order protection": "A legal safeguard where personal creditors of a member cannot seize the member's assets or voting rights in the LLC, only their financial distributions.",
  "psc register": "Person with Significant Control Register. A mandatory public record in the UK disclosing who actually owns or controls >25% of the company.",
  "qsbs": "Qualified Small Business Stock. A US tax benefit (Section 1202) that may allow founders/investors to exclude up to 100% of capital gains from federal taxes.",
  "tax transparency": "The entity is ignored for tax purposes (transparent), so partners are taxed directly on their share of income, similar to pass-through.",
  "public notary": "In civil law systems (Italy, Germany), a public official who must witness and authenticate the founding deed. This adds cost and time but ensures legal certainty.",
  "common law": "Legal system (US, UK, UAE-DIFC) based on judicial precedents. Generally more flexible for business contracts than Civil Law.",
  "double taxation": "Income is taxed twice: once at the corporate level (Corporate Tax) and again when distributed to shareholders (Dividend Tax).",
  "operating agreement": "A private document governing the internal operations of an LLC and the rights of its members. Critical for preventing disputes.",
  "registered agent": "A designated third party responsible for receiving official government and legal correspondence (service of process) for your entity.",
  "audit report": "An official examination of the entity's setup formation expenses, required for certain German (AG) and Italian (SpA) structures.",
  "1031 exchange": "A US tax provision allowing investors to defer capital gains taxes when swapping one investment property for another (like-kind exchange).",
  "orphan entity": "An entity structure (like a Foundation) that has no shareholders or owners, often used to hold assets independently for DAOs or securitization.",
  "separate legal personality": "The entity exists legally distinct from its owners, meaning it can own property, sue, and be sued in its own name.",
  "series llc": "A unique form of LLC that allows for unlimited 'series' (cells) within one parent. Each series has separate assets and liability protection.",
  "segregated liability": "Assets of one series cannot be seized to pay the debts of another series within the same company. Critical for multi-asset tokenization.",
  "offshore": "A company registered in a jurisdiction where it conducts no substantial business, often used for tax optimization, confidentiality, or holding assets.",
  "cooperative": "An autonomous association of persons united voluntarily to meet common economic, social, and cultural needs via a jointly-owned enterprise."
};

const Tooltip: React.FC<{ term: string, definition: string }> = ({ term, definition }) => {
  return (
    <span className="relative group cursor-help inline-block border-b border-dotted border-brand-400 text-brand-900 font-medium">
      {term}
      {/* Tooltip Popup */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none z-50 text-left leading-relaxed hidden md:block">
        <div className="font-bold text-brand-400 mb-1 border-b border-slate-700 pb-1 uppercase tracking-wider text-[10px]">Definition</div>
        {definition}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
      </div>
    </span>
  );
};

const RichText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  // Split text by glossary terms (case-insensitive)
  const terms = Object.keys(TOOLTIP_DEFINITIONS);
  if (terms.length === 0) return <>{text}</>;

  const regex = new RegExp(`\\b(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        if (TOOLTIP_DEFINITIONS[lowerPart]) {
          return <Tooltip key={i} term={part} definition={TOOLTIP_DEFINITIONS[lowerPart]} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

const CountrySelectionCard: React.FC<{ 
    meta: JurisdictionMeta, 
    isActive: boolean, 
    onClick: () => void 
}> = ({ meta, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`
            relative p-4 rounded-xl border-2 transition-all duration-300 group text-left h-full flex flex-col items-center md:items-start justify-center md:justify-start active:scale-95
            ${isActive 
                ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 transform scale-105 z-10' 
                : 'bg-white border-slate-100 hover:border-brand-400 hover:shadow-lg'
            }
        `}
    >
        <div className="flex items-center justify-between w-full mb-2 md:mb-3">
            <span className="text-2xl md:text-3xl shadow-sm rounded-full bg-slate-50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-slate-100 mx-auto md:mx-0">
                {meta.flag}
            </span>
            {isActive && (
                <div className="bg-brand-500 rounded-full p-1 absolute top-3 right-3 md:relative md:top-auto md:right-auto">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
            )}
        </div>
        <h3 className={`font-bold font-display text-sm md:text-lg mb-1 text-center md:text-left ${isActive ? 'text-white' : 'text-slate-900'}`}>
            {meta.name}
        </h3>
        <p className={`text-[10px] md:text-xs font-semibold uppercase tracking-wider text-center md:text-left ${isActive ? 'text-brand-400' : 'text-brand-600'}`}>
            {meta.tagline}
        </p>
    </button>
);

const JurisdictionGuide: React.FC<{ meta: JurisdictionMeta }> = ({ meta }) => (
    <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg animate-fadeIn border border-white/10">
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold font-display flex items-center gap-2">
                        <span>{meta.flag}</span>
                        <span>Why Choose {meta.name}?</span>
                    </h3>
                    <div className="px-3 py-1.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider border border-white/20 backdrop-blur-md shadow-sm">
                        {meta.regimeHint}
                    </div>
                </div>
                <p className="text-brand-50 text-sm leading-relaxed mb-6 border-b border-white/10 pb-6 opacity-90">
                    {meta.guide.intro}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                        <p className="text-[10px] font-bold text-brand-200 uppercase mb-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            Critical Requirement
                        </p>
                        <p className="text-xs font-medium leading-relaxed text-white">{meta.guide.keyRequirement}</p>
                    </div>

                    {meta.guide.popularAssetTypes && (
                        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 relative overflow-hidden backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-400/20 rounded-full -mr-4 -mt-4 blur-xl"></div>
                            <p className="text-[10px] font-bold text-brand-200 uppercase mb-3 flex items-center gap-1 relative z-10">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                Regulated Asset Focus
                            </p>
                            <div className="flex flex-wrap gap-2 relative z-10">
                                {meta.guide.popularAssetTypes.map((type, i) => (
                                    <span key={i} className="px-2.5 py-1 bg-brand-500/40 rounded-lg text-[10px] font-bold uppercase tracking-wide border border-brand-400/30 text-white shadow-sm hover:bg-brand-500/60 transition-colors cursor-default">
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="md:w-1/3 bg-slate-900/40 rounded-xl p-5 backdrop-blur-md border border-white/10 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-white/50 uppercase mb-3 tracking-widest text-center">Best Suited For</p>
                <p className="text-sm font-bold text-white text-center leading-relaxed">{meta.guide.bestFor}</p>
            </div>
        </div>
    </div>
);

export const JurisdictionStep: React.FC<StepProps> = ({ data, updateData, onValidationChange }) => {
  const { jurisdiction, property, projectInfo } = data;
  const { entityDetails } = jurisdiction;
  const detailsRef = useRef<HTMLDivElement>(null);
  
  const [aiContent, setAiContent] = useState<AiResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeEntityDef, setActiveEntityDef] = useState<EntityDefinition | null>(null);
  
  // Region suggestions state
  const [recommendedRegions, setRecommendedRegions] = useState<string[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);

  // SPV Recommendation State
  const [spvRecommendation, setSpvRecommendation] = useState<{ recommendedSpvId: string, reasoning: string } | null>(null);
  const [isSpvRecLoading, setIsSpvRecLoading] = useState(false);

  // Auto Fill State
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  // 1. When Country Changes -> Fetch recommended regions
  useEffect(() => {
    if (jurisdiction.country) {
        setIsLoadingRegions(true);
        // Clear previous selection if country changes
        updateData('jurisdiction', { 
            entityDetails: { ...jurisdiction.entityDetails, registrationState: '' },
            spvType: ''
        });
        setSpvRecommendation(null);
        
        getRegionRecommendations(jurisdiction.country, property.category)
            .then(regions => {
                setRecommendedRegions(Array.isArray(regions) ? regions : []);
                setIsLoadingRegions(false);
            });
    }
  }, [jurisdiction.country, property.category]);

  // 2. When Region is Selected -> Fetch SPV Recommendation
  useEffect(() => {
      if (jurisdiction.country && entityDetails.registrationState) {
          setIsSpvRecLoading(true);
          getSpvRecommendation(jurisdiction.country, entityDetails.registrationState, property.category, projectInfo)
            .then(rec => {
                setSpvRecommendation(rec);
                setIsSpvRecLoading(false);
            });
      }
  }, [jurisdiction.country, entityDetails.registrationState, property.category, projectInfo]);

  // 3. Sync active definition when spvType changes
  useEffect(() => {
    if (jurisdiction.country && jurisdiction.spvType) {
      const def = ENTITY_LIBRARY[jurisdiction.country]?.find(e => e.id === jurisdiction.spvType);
      setActiveEntityDef(def || null);
      
      if (def) {
          setTimeout(() => {
              detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
      }

      if (def && !entityDetails.governanceType) {
        updateData('jurisdiction', { 
            entityDetails: { ...entityDetails, governanceType: def.governanceOptions[0] } 
        });
      }
    }
  }, [jurisdiction.country, jurisdiction.spvType]);

  // 4. Validation
  useEffect(() => {
    const hasDirectors = entityDetails?.directors?.length > 0;
    const hasName = Boolean(entityDetails?.companyName);
    const hasAgent = Boolean(entityDetails?.formationAgent);
    const isChecked = Boolean(entityDetails?.isNameAvailable);
    
    // NEW: Validation now requires a specific region/state to be selected
    const hasRegion = Boolean(entityDetails?.registrationState);
    
    let isCapitalValid = true;
    if (activeEntityDef && activeEntityDef.minCapital > 0) {
        isCapitalValid = (entityDetails.shareCapital || 0) >= activeEntityDef.minCapital;
    }
    
    onValidationChange(hasName && hasDirectors && hasAgent && isChecked && isCapitalValid && hasRegion);
  }, [jurisdiction, entityDetails, activeEntityDef, onValidationChange]);

  const handleRunAnalysis = async () => {
    if (!jurisdiction.country || !jurisdiction.spvType) return;
    
    setIsAiLoading(true);
    const result = await analyzeJurisdiction(
      jurisdiction.country, 
      jurisdiction.spvType, 
      property.category, 
      entityDetails,
      projectInfo
    );
    setAiContent(result);
    setIsAiLoading(false);
  };

  const handleAutoFill = async () => {
      if (!jurisdiction.country || !jurisdiction.spvType) return;
      setIsAutoFilling(true);
      
      const generatedDetails = await generateEntityDetails(
          jurisdiction.country, 
          entityDetails.registrationState || jurisdiction.country, 
          jurisdiction.spvType, 
          property.title || projectInfo.projectName || "Project"
      );

      if (generatedDetails) {
          updateData('jurisdiction', { entityDetails: { ...entityDetails, ...generatedDetails, isNameAvailable: true }});
      }
      setIsAutoFilling(false);
  };

  // Automatic Analysis Trigger (when SPV + Region is set)
  useEffect(() => {
    if (jurisdiction.country && jurisdiction.spvType) {
        setAiContent(null);
        handleRunAnalysis();
    }
  }, [jurisdiction.country, jurisdiction.spvType, entityDetails.registrationState]);

  const selectedCountryMeta = JURISDICTION_METADATA.find(m => m.code === jurisdiction.country);

  return (
    <div className="space-y-6 md:space-y-10 animate-fadeIn pb-24">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-display tracking-tight">
          Jurisdiction & Structure
        </h2>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl">
          Configure the legal wrapper for your {property.category} assets. Hover over highlighted terms for definitions.
        </p>
      </div>

      {/* 1. Country Selection Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">1. Select Country</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {JURISDICTION_METADATA.map(meta => (
                <CountrySelectionCard 
                    key={meta.code}
                    meta={meta}
                    isActive={jurisdiction.country === meta.code}
                    onClick={() => updateData('jurisdiction', { country: meta.code, spvType: '' })}
                />
            ))}
        </div>
      </div>

      {selectedCountryMeta && (
          <JurisdictionGuide meta={selectedCountryMeta} />
      )}

      {/* 2. Region / Domicile Selection (NEW SECTION) */}
      {jurisdiction.country && (
          <div className="animate-slideUp space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                  2. Select Domicile / State
                  {isLoadingRegions && <span className="text-brand-500 text-[10px] animate-pulse">AI finding best locations...</span>}
              </h3>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="mb-4">
                      <p className="text-sm text-slate-600 mb-3">
                          Where exactly should the entity be registered?
                          <span className="text-xs text-slate-400 block mt-1">AI Recommendation based on {property.category} in {selectedCountryMeta?.name}:</span>
                      </p>
                      
                      <div className="flex flex-wrap gap-3 mb-4">
                          {(recommendedRegions || []).map(region => (
                              <button
                                key={region}
                                onClick={() => updateData('jurisdiction', { entityDetails: { ...entityDetails, registrationState: region }})}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                                    entityDetails.registrationState === region 
                                    ? 'bg-indigo-100 text-indigo-700 border-indigo-300 ring-2 ring-indigo-500/20' 
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                }`}
                              >
                                {region}
                              </button>
                          ))}
                          
                          {(!recommendedRegions || recommendedRegions.length === 0) && !isLoadingRegions && (
                              <span className="text-xs text-slate-400 italic">Select a country to see recommendations.</span>
                          )}
                      </div>
                  </div>

                  <div className="relative">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Or type custom location</label>
                      <input 
                          type="text" 
                          placeholder="e.g. New York, Sicily, Berlin..."
                          value={entityDetails.registrationState || ''}
                          onChange={(e) => updateData('jurisdiction', { entityDetails: { ...entityDetails, registrationState: e.target.value }})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                  </div>
              </div>
          </div>
      )}

      {/* 2.5 AI SPV Recommendation Panel */}
      {jurisdiction.country && entityDetails.registrationState && (
          <div className="animate-slideUp mt-4 mb-4">
              {isSpvRecLoading ? (
                  <div className="p-4 bg-brand-50 border border-brand-100 rounded-xl flex items-center gap-3 animate-pulse">
                      <div className="w-5 h-5 bg-brand-200 rounded-full"></div>
                      <div className="text-brand-700 text-sm font-medium">Analyzing local laws for best structure...</div>
                  </div>
              ) : spvRecommendation ? (
                  <div className="p-5 bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-100 rounded-xl shadow-sm relative overflow-hidden">
                      <div className="flex items-start gap-4 relative z-10">
                          <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          </div>
                          <div>
                              <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-1">AI Recommendation</h4>
                              <p className="text-indigo-800 text-sm font-medium">
                                  Based on <strong>{entityDetails.registrationState}</strong>, we recommend: <span className="underline decoration-indigo-400 decoration-2 underline-offset-2">{spvRecommendation.recommendedSpvId || 'Standard LLC'}</span>
                              </p>
                              <p className="text-indigo-600/80 text-xs mt-1 leading-relaxed max-w-2xl">
                                  {spvRecommendation.reasoning}
                              </p>
                          </div>
                      </div>
                  </div>
              ) : null}
          </div>
      )}

      {/* 3. Entity Grid */}
      {jurisdiction.country && (
        <div className="animate-slideUp space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">3. Select Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {(ENTITY_LIBRARY[jurisdiction.country] || []).map(ent => (
              <div 
                key={ent.id}
                onClick={() => updateData('jurisdiction', { spvType: ent.id })}
                className={`
                    cursor-pointer p-4 md:p-6 rounded-2xl relative transition-all duration-300 group
                    ${jurisdiction.spvType === ent.id 
                        ? 'bg-white ring-2 ring-brand-500 shadow-xl shadow-brand-500/10 transform scale-[1.02] z-10' 
                        : 'bg-white border border-slate-200 hover:border-brand-300 hover:shadow-lg hover:z-20'
                    }
                `}
              >
                <div className="flex justify-between items-start mb-4">
                   <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${ent.badgeColor}`}>
                      {ent.badge}
                   </span>
                   {jurisdiction.spvType === ent.id && (
                       <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center text-white">
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                       </div>
                   )}
                </div>
                
                <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-2 font-display">{ent.name}</h4>
                <div className="text-sm text-slate-500 leading-relaxed mb-4 min-h-[60px]">
                  <RichText text={ent.desc} />
                </div>

                {/* New Educational Fields Display */}
                <div className="mb-4 space-y-2">
                    <div className="flex items-start gap-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 uppercase font-bold text-[10px] shrink-0 mt-0.5">Best For:</span>
                        <span className="text-slate-700 font-medium">{ent.bestFor}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 uppercase font-bold text-[10px] shrink-0 mt-0.5">Access:</span>
                        <span className="text-slate-700 font-medium">{ent.investorAccess}</span>
                    </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {ent.setupTime}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 0-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {ent.minCapitalLabel}
                    </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. The "Entity Architect" Console */}
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${jurisdiction.spvType && activeEntityDef ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0'}`}
        ref={detailsRef}
      >
        {activeEntityDef && (
            <div className="bg-slate-900 rounded-xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative -mx-4 md:mx-0">
                {/* Decorative Elements */}
                <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-3xl rounded-full pointer-events-none"></div>
                <div className="hidden md:block absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>

                {/* Console Header */}
                <div className="relative border-b border-slate-700 bg-slate-900/50 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                             <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Architect Mode Active</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white font-display">Configure {activeEntityDef.name}</h3>
                        <p className="text-slate-400 text-sm mt-1">
                            Setup for <strong>{entityDetails.registrationState || 'Selected Region'}</strong>, {jurisdiction.country}.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                        <Button 
                            onClick={handleAutoFill} 
                            disabled={isAutoFilling}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white border-0 shadow-lg shadow-emerald-900/20"
                        >
                            {isAutoFilling ? 'AI Generating...' : '✨ Auto-Fill with AI'}
                        </Button>
                        <div className="flex gap-4">
                            <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Base Capital</div>
                                <div className="text-white font-mono font-bold">{activeEntityDef.minCapitalLabel}</div>
                            </div>
                            <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Est. Timeline</div>
                                <div className="text-white font-mono font-bold">{activeEntityDef.setupTime}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Console Body */}
                <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
                    
                    {/* Left Panel: Requirements Visualization */}
                    <div className="lg:col-span-4 bg-slate-800/30 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-700 space-y-8">
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Formation Prerequisites</h4>
                            <ul className="space-y-3">
                                {(activeEntityDef.requirements || []).map((req, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300 group">
                                        <div className="w-6 h-6 rounded-lg bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center shrink-0">
                                            <span className="text-indigo-400 text-[10px] font-bold">{i+1}</span>
                                        </div>
                                        <span className="leading-tight"><RichText text={req} /></span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Required Documentation</h4>
                            <ul className="space-y-3">
                                {(activeEntityDef.docsRequired || []).map((doc, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300 group">
                                        <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-brand-500 transition-colors shrink-0">
                                            <svg className="w-3 h-3 text-slate-400 group-hover:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <RichText text={doc} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Key Features</h4>
                            <div className="flex flex-wrap gap-2">
                                {(activeEntityDef.features || []).map((feat, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                                        <RichText text={feat} />
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* NEW: Dedicated Fiscal Implications Card */}
                        <div className="p-5 rounded-xl bg-gradient-to-b from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                            <h5 className="text-amber-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Fiscal & Tax Analysis
                            </h5>
                            <p className="text-sm text-amber-100 leading-relaxed font-medium mb-2">
                                {activeEntityDef.taxPreview}
                            </p>
                            <p className="text-xs text-slate-400 leading-relaxed border-t border-amber-500/20 pt-2 mt-2">
                                <RichText text={activeEntityDef.fiscalImplications} />
                            </p>
                        </div>
                    </div>

                    {/* Right Panel: Interactive Form */}
                    <div className="lg:col-span-8 p-6 md:p-8 bg-slate-900">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Name Input with Availability Check */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Entity Name</label>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <input 
                                            type="text" 
                                            value={entityDetails.companyName}
                                            onChange={e => updateData('jurisdiction', { entityDetails: { ...entityDetails, companyName: e.target.value }})}
                                            placeholder={`${property.title || projectInfo?.projectName || 'Project'} ${jurisdiction.spvType}`}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                        />
                                        {entityDetails.isNameAvailable && (
                                            <div className="absolute right-3 top-3 text-green-400">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <Button 
                                        onClick={() => updateData('jurisdiction', { entityDetails: { ...entityDetails, isNameAvailable: true }})}
                                        disabled={!entityDetails.companyName}
                                        className={`whitespace-nowrap ${entityDetails.isNameAvailable ? 'bg-green-600 hover:bg-green-700 text-white border-none' : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'}`}
                                    >
                                        {entityDetails.isNameAvailable ? 'Available ✓' : 'Check Availability'}
                                    </Button>
                                </div>
                            </div>

                            {/* Governance Selector */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Governance Model</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(activeEntityDef.governanceOptions || []).map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => updateData('jurisdiction', { entityDetails: { ...entityDetails, governanceType: opt }})}
                                            className={`
                                                p-4 rounded-xl border text-left transition-all relative overflow-hidden
                                                ${entityDetails.governanceType === opt 
                                                    ? 'bg-brand-600/20 border-brand-500 text-white' 
                                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-700/50'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3 relative z-10">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${entityDetails.governanceType === opt ? 'border-brand-400' : 'border-slate-500'}`}>
                                                    {entityDetails.governanceType === opt && <div className="w-2 h-2 rounded-full bg-brand-400"></div>}
                                                </div>
                                                <span className="font-medium text-sm">{opt}</span>
                                            </div>
                                            {entityDetails.governanceType === opt && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 to-transparent pointer-events-none"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Registered Agent */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">
                                    {jurisdiction.country === 'IT' || jurisdiction.country === 'DE' ? "Public Notary (Notaio/Notar)" : "Formation Agent"}
                                </label>
                                <input 
                                    type="text"
                                    value={entityDetails.formationAgent || ''}
                                    onChange={e => updateData('jurisdiction', { entityDetails: { ...entityDetails, formationAgent: e.target.value }})}
                                    placeholder={jurisdiction.country === 'IT' ? "Notaio Mario Rossi" : "e.g., CT Corporation"}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Share Capital */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">
                                    Share Capital ({jurisdiction.country === 'IT' || jurisdiction.country === 'DE' ? '€' : jurisdiction.country === 'UK' ? '£' : '$'})
                                </label>
                                <input 
                                    type="number"
                                    value={entityDetails.shareCapital || ''}
                                    onChange={e => updateData('jurisdiction', { entityDetails: { ...entityDetails, shareCapital: parseFloat(e.target.value) }})}
                                    placeholder={activeEntityDef.minCapital.toString()}
                                    className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 outline-none ${
                                        (entityDetails.shareCapital || 0) < activeEntityDef.minCapital 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-slate-700 focus:ring-brand-500'
                                    }`}
                                />
                                {(entityDetails.shareCapital || 0) < activeEntityDef.minCapital && (
                                    <p className="text-xs text-red-400">Minimum capital required: {activeEntityDef.minCapitalLabel}</p>
                                )}
                            </div>

                            {/* Registered Address */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Registered Address ({entityDetails.registrationState || 'Local'})</label>
                                <input 
                                    type="text"
                                    value={entityDetails.registeredAddress || ''}
                                    onChange={e => updateData('jurisdiction', { entityDetails: { ...entityDetails, registeredAddress: e.target.value }})}
                                    placeholder="123 Legal Avenue, Floor 4..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Directors / Managers */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Directors / Managers</label>
                                <div className="bg-slate-800 rounded-lg p-2 border border-slate-700 flex flex-wrap gap-2 min-h-[50px]">
                                    {(entityDetails.directors || []).map((d, i) => (
                                        <span key={i} className="bg-slate-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-2 border border-slate-600">
                                            {d}
                                            <button onClick={() => {
                                                const n = [...(entityDetails.directors || [])]; n.splice(i, 1);
                                                updateData('jurisdiction', { entityDetails: { ...entityDetails, directors: n }});
                                            }} className="text-slate-400 hover:text-red-400">×</button>
                                        </span>
                                    ))}
                                    <input 
                                        type="text"
                                        id="newDirInput"
                                        placeholder="Add Name + Enter"
                                        className="bg-transparent text-white placeholder-slate-500 outline-none flex-1 min-w-[150px] px-2 h-8"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                const val = (e.target as HTMLInputElement).value;
                                                if(val) {
                                                    updateData('jurisdiction', { entityDetails: { ...entityDetails, directors: [...(entityDetails.directors || []), val] }});
                                                    (e.target as HTMLInputElement).value = '';
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      <AiSuggestionBox 
        isLoading={isAiLoading}
        onAsk={handleRunAnalysis}
        content={aiContent}
        contextNote={
            aiContent 
            ? "Review the educational guidance for your configuration above." 
            : jurisdiction.spvType 
                ? `AI is ready to analyze the educational aspects of ${jurisdiction.spvType} in ${entityDetails.registrationState || jurisdiction.country}.`
                : "Select a country and structure to see expert analysis."
        }
      />
    </div>
  );
};
