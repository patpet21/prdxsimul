
import React, { useEffect, useState } from 'react';
import { StepProps } from '../types';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { BusinessPlanGenerator } from '../components/BusinessPlanGenerator';
import { AssetAiPanel } from '../components/asset/AssetAiPanel';
import { analyzeAssetFinancials, autoFillAssetGeneral, getAssetAdvice, estimateAssetSpecs } from '../services/mockAiService';

const getEnv = (key: string, fallback: string) => {
  try {
    // @ts-ignore
    return (import.meta.env && import.meta.env[key]) ? import.meta.env[key] : fallback;
  } catch (e) {
    return fallback;
  }
};

const CLOUDINARY_CLOUD_NAME = getEnv('VITE_CLOUDINARY_CLOUD_NAME', 'dqwnfho9b');
const CLOUDINARY_PRESET = getEnv('VITE_CLOUDINARY_UPLOAD_PRESET', 'realestate-wizard');
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const AssetStep: React.FC<StepProps> = ({ data, updateData, onValidationChange }) => {
  const { property, projectInfo, jurisdiction } = data;
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'SPECS' | 'PARTIES' | 'MEDIA' | 'PLAN'>('DETAILS');
  const [isUploading, setIsUploading] = useState(false);
  
  // AI States
  const [isAutoFillingGeneral, setIsAutoFillingGeneral] = useState(false);
  const [isAutoFillingSpecs, setIsAutoFillingSpecs] = useState(false);
  const [isAdvising, setIsAdvising] = useState(false);
  const [adviceResult, setAdviceResult] = useState<{ title: string, items: string[] } | null>(null);

  useEffect(() => {
    // Validation using new schema fields
    const hasBasic = Boolean(property.title && property.total_value > 0);
    const hasLocation = Boolean(property.location);
    onValidationChange(hasBasic && hasLocation);
  }, [property, onValidationChange]);

  const updateProp = (field: string, val: any) => updateData('property', { [field]: val });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);

    try {
        const res = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.secure_url) {
            updateProp('image_url', data.secure_url);
        } else {
            console.error("Cloudinary error:", data);
            alert("Upload failed. Please check console for details.");
        }
    } catch (err) {
        console.error("Upload failed", err);
        alert("Image upload failed. Check your network or Cloudinary configuration.");
    } finally {
        setIsUploading(false);
    }
  };

  // --- AI HANDLERS ---

  const handleAutoFillGeneral = async () => {
      setIsAutoFillingGeneral(true);
      const result = await autoFillAssetGeneral(projectInfo, property.category);
      if (result) {
          if(result.assetName) updateProp('title', result.assetName);
          if(result.valuation) updateProp('total_value', result.valuation);
          if(result.assetType) updateProp('asset_type', result.assetType);
          if(result.sqft) updateProp('interior_size_sqm', result.sqft);
          if(result.address) updateProp('address', result.address);
          if(result.description && !property.description) updateProp('description', result.description);
      }
      setIsAutoFillingGeneral(false);
  };

  const handleAutoFillSpecs = async () => {
      setIsAutoFillingSpecs(true);
      const result = await estimateAssetSpecs(property.category, property.asset_type || 'General', property.total_value);
      if (result) {
          updateProp('construction_year', result.construction_year);
          updateProp('total_units', result.total_units);
          updateProp('interior_size_sqm', result.interior_size_sqm);
          updateProp('building_class', result.building_class);
      }
      setIsAutoFillingSpecs(false);
  };

  const handleGetAdvice = async () => {
      if (!property.asset_type || !property.location) return;
      setIsAdvising(true);
      const result = await getAssetAdvice(property.category, property.asset_type, property.location);
      if (result) {
          setAdviceResult({
              title: `Strategic Tips for ${property.asset_type}`,
              items: [
                  `Valuation: ${result.valuationTip}`,
                  `Risk: ${result.riskWarning}`,
                  `Renovation: ${result.renovationAdvice}`
              ]
          });
      }
      setIsAdvising(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold font-display text-slate-900">2. Asset Details & Specs</h2>
           <p className="text-slate-600">Define the physical characteristics, location, and key partners.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-1 mb-6">
          {[
              { id: 'DETAILS', label: 'General & Timeline' },
              { id: 'SPECS', label: 'Physical Specs' },
              { id: 'PARTIES', label: 'Parties & Team' },
              { id: 'MEDIA', label: 'Media' },
              { id: 'PLAN', label: 'Business Plan' }
          ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                  {tab.label}
              </button>
          ))}
      </div>

      {/* --- TAB 1: DETAILS (General + Location + Timeline) --- */}
      {activeTab === 'DETAILS' && (
        <div className="space-y-8 animate-slideUp">
           
           <AssetAiPanel 
              title="Auto-Fill General Info"
              description="Extract details from your Project Vision to populate this form."
              buttonText="✨ Auto-Fill"
              variant="autofill"
              isLoading={isAutoFillingGeneral}
              onAction={handleAutoFillGeneral}
           />

           {/* Section A: General Info */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
                <h3 className="font-bold text-slate-800 text-lg mb-6">Identification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        id="title" label="Asset Title / Name" 
                        value={property.title} onChange={e => updateProp('title', e.target.value)}
                        className="md:col-span-2"
                        placeholder="e.g. Progetto Como – Residenza Lago Luxury"
                    />
                    
                    <Select 
                        id="ptype" label="Property Type"
                        options={[
                            {value: 'Residenziale', label: 'Residential (Residenziale)'},
                            {value: 'Commerciale', label: 'Commercial (Commerciale)'},
                            {value: 'Industriale', label: 'Industrial (Industriale)'},
                            {value: 'Terreno', label: 'Land (Terreno)'},
                            {value: 'Turistico', label: 'Tourism/Hotel (Turistico)'}
                        ]}
                        value={property.property_type || ''} onChange={e => updateProp('property_type', e.target.value)}
                    />

                    <Input 
                        id="atype" label="Asset Sub-Type" 
                        value={property.asset_type || ''} onChange={e => updateProp('asset_type', e.target.value)}
                        placeholder="e.g. Luxury Apartment, Warehouse..."
                    />

                    <Input 
                        id="val" label="Total Asset Value (EUR)" type="number"
                        value={property.total_value || ''} onChange={e => updateProp('total_value', parseFloat(e.target.value))}
                    />

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Short Description</label>
                        <textarea 
                            className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-500 outline-none h-24"
                            placeholder="Briefly describe the investment highlights..."
                            value={property.description || ''}
                            onChange={e => updateProp('description', e.target.value)}
                        />
                    </div>
                </div>
           </div>

           {/* Section B: Timeline */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
                <h3 className="font-bold text-slate-900 text-lg mb-6">Timeline & Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input 
                        id="start_date" label="Expected Start Date" type="date"
                        value={property.expected_start_date || ''} onChange={e => updateProp('expected_start_date', e.target.value)}
                    />
                    <Input 
                        id="end_date" label="Expected End Date" type="date"
                        value={property.expected_end_date || ''} onChange={e => updateProp('expected_end_date', e.target.value)}
                    />
                    <Input 
                        id="comp_date" label="Est. Completion Date" type="date"
                        value={property.completion_date || ''} onChange={e => updateProp('completion_date', e.target.value)}
                    />
                </div>
           </div>

           {/* Section C: Location */}
           <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative">
                <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Location Data
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        id="addr" label="Street Address" className="md:col-span-2"
                        value={property.address || ''} onChange={e => updateProp('address', e.target.value)}
                    />
                    <Input 
                        id="city" label="City"
                        value={property.city || ''} onChange={e => updateProp('city', e.target.value)}
                    />
                    <Input 
                        id="region" label="Region / State"
                        value={property.region || ''} onChange={e => updateProp('region', e.target.value)}
                    />
                    <Input 
                        id="country" label="Country"
                        value={property.country || ''} onChange={e => updateProp('country', e.target.value)}
                    />
                    <Input 
                        id="neighborhood" label="Neighborhood / District"
                        value={property.neighborhood || ''} onChange={e => updateProp('neighborhood', e.target.value)}
                    />
                    <Input 
                        id="loc_display" label="Display Location (Public)"
                        value={property.location || ''} onChange={e => updateProp('location', e.target.value)}
                        placeholder="e.g. Como, Lombardia"
                    />
                </div>
           </div>
        </div>
      )}

      {/* --- TAB 2: PHYSICAL SPECS --- */}
      {activeTab === 'SPECS' && (
          <div className="animate-slideUp space-y-6">
              
              <AssetAiPanel 
                  title="Estimate Specs with AI"
                  description="Let AI guess the specs based on asset type and value."
                  buttonText="✨ Auto-Fill Specs"
                  variant="autofill"
                  isLoading={isAutoFillingSpecs}
                  onAction={handleAutoFillSpecs}
              />

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-lg mb-6">Building Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input 
                          id="year" label="Construction Year" type="number"
                          value={property.construction_year || ''} onChange={e => updateProp('construction_year', parseInt(e.target.value))}
                      />
                      <Select 
                          id="renovated" label="Renovation Status"
                          options={[{value: 'New', label: 'New Construction'}, {value: 'Recently Renovated', label: 'Recently Renovated'}, {value: 'Needs Renovation', label: 'Needs Renovation'}, {value: 'Good', label: 'Good Condition'}]}
                          value={property.renovated_status || ''} onChange={e => updateProp('renovated_status', e.target.value)}
                      />
                      <Input 
                          id="class" label="Building Class / Energy"
                          value={property.building_class || ''} onChange={e => updateProp('building_class', e.target.value)}
                          placeholder="e.g. A+"
                      />
                  </div>
              </div>

              {/* NEW: Financial Metrics Indices */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-lg mb-6">Performance Indices</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <Input 
                          id="occupancy" label="Occupancy Rate (%)" type="number" step="0.1"
                          value={property.occupancy_rate || ''} onChange={e => updateProp('occupancy_rate', parseFloat(e.target.value))}
                      />
                      <Input 
                          id="appreciation" label="Appreciation Rate (%)" type="number" step="0.1"
                          value={property.appreciation_rate || ''} onChange={e => updateProp('appreciation_rate', parseFloat(e.target.value))}
                      />
                      <Input 
                          id="leverage" label="Leverage Ratio (LTV %)" type="number" step="0.1"
                          value={property.leverage_ratio || ''} onChange={e => updateProp('leverage_ratio', parseFloat(e.target.value))}
                      />
                      <Input 
                          id="interest" label="Loan Interest (%)" type="number" step="0.1"
                          value={property.loan_interest_rate || ''} onChange={e => updateProp('loan_interest_rate', parseFloat(e.target.value))}
                      />
                  </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-lg mb-6">Unit Configuration</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <Input 
                          id="units" label="Total Units" type="number"
                          value={property.total_units || ''} onChange={e => updateProp('total_units', parseInt(e.target.value))}
                      />
                      <Input 
                          id="beds" label="Bedrooms" type="number"
                          value={property.bedrooms || ''} onChange={e => updateProp('bedrooms', parseInt(e.target.value))}
                      />
                      <Input 
                          id="baths" label="Bathrooms" type="number"
                          value={property.bathrooms || ''} onChange={e => updateProp('bathrooms', parseFloat(e.target.value))}
                      />
                      <Input 
                          id="heat" label="Heating Type"
                          value={property.heating_type || ''} onChange={e => updateProp('heating_type', e.target.value)}
                          placeholder="Autonomous / Central"
                      />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <Input 
                          id="int_sqm" label="Interior Size (sqm)" type="number"
                          value={property.interior_size_sqm || ''} onChange={e => updateProp('interior_size_sqm', parseFloat(e.target.value))}
                      />
                      <Input 
                          id="ext_sqm" label="Exterior Size (sqm)" type="number"
                          value={property.exterior_size_sqm || ''} onChange={e => updateProp('exterior_size_sqm', parseFloat(e.target.value))}
                      />
                  </div>
              </div>

              <AssetAiPanel 
                  title="Strategic Advice"
                  description="Ask AI for valuation drivers and risk factors in this location."
                  buttonText="Get Advice"
                  variant="advice"
                  isLoading={isAdvising}
                  onAction={handleGetAdvice}
                  result={adviceResult}
              />
          </div>
      )}

      {/* --- TAB 3: PARTIES --- */}
      {activeTab === 'PARTIES' && (
          <div className="animate-slideUp space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-lg mb-6">Project Team</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                          id="sponsor" label="Sponsor / Issuer"
                          value={property.sponsor || ''} onChange={e => updateProp('sponsor', e.target.value)}
                          placeholder="Company leading the project"
                      />
                      <Input 
                          id="dev" label="Developer"
                          value={property.developer || ''} onChange={e => updateProp('developer', e.target.value)}
                          placeholder="Construction company"
                      />
                      <Input 
                          id="pm" label="Property Manager"
                          value={property.property_manager || ''} onChange={e => updateProp('property_manager', e.target.value)}
                          placeholder="Operator managing tenants"
                      />
                      <Input 
                          id="legal" label="Legal Counsel"
                          value={property.legal_counsel || ''} onChange={e => updateProp('legal_counsel', e.target.value)}
                          placeholder="Law firm"
                      />
                      <Input 
                          id="web" label="Project Website" className="md:col-span-2"
                          value={property.website || ''} onChange={e => updateProp('website', e.target.value)}
                      />
                  </div>
              </div>
          </div>
      )}

      {/* --- TAB 4: MEDIA --- */}
      {activeTab === 'MEDIA' && (
           <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-slideUp">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Primary Cover Image
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-all">
                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <svg className="animate-spin h-8 w-8 text-brand-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-sm font-bold text-brand-600">Uploading...</span>
                            </div>
                        ) : (
                            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <span className="text-sm font-bold text-slate-600">Click to Upload Cover</span>
                                <span className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP max 10MB</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                            </label>
                        )}
                    </div>

                    {property.image_url && (
                        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group aspect-video">
                            <img src={property.image_url} alt="Cover" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => updateProp('image_url', '')} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm">Remove</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <Input 
                        id="vid" label="Video URL (YouTube/Vimeo)"
                        value={property.video_url || ''} onChange={e => updateProp('video_url', e.target.value)}
                    />
                </div>
           </div>
      )}

      {/* --- TAB 5: BUSINESS PLAN --- */}
      {activeTab === 'PLAN' && (
          <div className="animate-slideUp space-y-6">
              <BusinessPlanGenerator 
                asset={{ 
                    category: property.category, 
                    assetName: property.title, 
                    valuation: property.total_value, 
                    address: property.address || property.location,
                    financials: { 
                        noi: property.gross_profit || 0,
                        occupancyRate: property.occupancy_rate || 0 
                    },
                    // FIX: Pass the long_description so the generator knows it exists
                    generatedBusinessPlan: property.long_description
                } as any}
                projectInfo={projectInfo}
                onUpdate={(plan) => updateProp('long_description', plan)}
              />
              
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4">External Documentation</h3>
                  <Input 
                    id="bpLink" 
                    label="Link to Brochure / Deck (URL)" 
                    placeholder="https://docsend.com/view/..."
                    value={property.brochure_url || ''}
                    onChange={e => updateProp('brochure_url', e.target.value)}
                  />
                  <div className="mt-4">
                    <Input 
                        id="tourLink" 
                        label="Virtual Tour URL (Matterport)" 
                        placeholder="https://my.matterport.com/..."
                        value={property.virtual_tour_url || ''}
                        onChange={e => updateProp('virtual_tour_url', e.target.value)}
                    />
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
