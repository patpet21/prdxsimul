
import React from 'react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  // Map category to aesthetic gradients if no image
  const gradients: Record<string, string> = {
    'Real Estate': 'from-blue-600 via-indigo-600 to-indigo-800',
    'Business': 'from-emerald-500 via-teal-600 to-cyan-700',
    'Art': 'from-rose-500 via-pink-600 to-purple-700',
    'Debt': 'from-amber-500 via-orange-600 to-red-700',
    'Funds': 'from-slate-600 via-slate-700 to-slate-900',
    'Other': 'from-violet-500 via-purple-600 to-fuchsia-700'
  };

  const gradientClass = gradients[project.category] || gradients['Other'];
  
  // Progress calculation
  const target = project.targetRaise || project.valuation * 0.4; // fallback
  const raised = target * (project.progress / 100);

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Cover Image */}
      <div className="h-48 relative overflow-hidden bg-slate-100">
        {project.imageUrl ? (
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradientClass} relative`}>
                <div className="absolute inset-0 bg-white/10 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl opacity-50">
                    {project.title.charAt(0)}
                </div>
            </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
             <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20
               ${project.status === 'active' || project.status === 'funded' ? 'bg-emerald-500/90 text-white' : 
                 project.status === 'funding' ? 'bg-amber-500/90 text-white' : 'bg-slate-800/80 text-white'}`}>
               {project.status === 'active' ? 'Live' : project.status === 'funding' ? 'Deploying' : project.status}
             </span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 rounded-md bg-white/90 backdrop-blur text-slate-800 text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${project.category === 'Real Estate' ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
                {project.category}
            </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 font-display leading-tight group-hover:text-brand-600 transition-colors mb-1 truncate">
                {project.title}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {project.location || 'Global • Digital Asset'}
            </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Valuation</p>
                <p className="text-sm font-bold text-slate-800">${(project.valuation / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Exp. Yield (APY)</p>
                <p className="text-sm font-bold text-emerald-600">{project.apy || 'N/A'}%</p>
            </div>
        </div>

        <div className="mt-auto space-y-3">
            <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                    <span>Raised: ${(raised/1000).toFixed(0)}k</span>
                    <span>Goal: ${(target/1000).toFixed(0)}k</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                    className={`h-full rounded-full transition-all duration-1000 bg-brand-600`} 
                    style={{ width: `${project.progress}%` }}
                    ></div>
                </div>
            </div>
            
            <button className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                View Investment Details
            </button>
        </div>
      </div>
    </div>
  );
};
