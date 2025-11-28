import React from 'react';
import { Project } from '../types';
import { ProjectCard } from '../components/ui/ProjectCard';
import { TopNavigation } from '../components/ui/TopNavigation';
import Footer from '../components/ui/Footer';

interface ProjectsPageProps {
  projects: Project[];
  onBack: () => void;
  onLogin: () => void;
  onNavigate: (page: string) => void;
  onSelectProject?: (project: Project) => void; 
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, onBack, onLogin, onSelectProject, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-fadeIn flex flex-col">
      
      <TopNavigation 
        onNavigate={onNavigate} 
        onLogin={onLogin} 
        onStartSimulation={() => onNavigate('SIM_INTRO')} // Redirect to sim
        activePage="MARKETPLACE" 
      />

      <div className="max-w-7xl mx-auto p-6 md:p-12 flex-1 w-full">
        <div className="mb-10 text-center">
           <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">Live Network</span>
           <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-display mb-4">Tokenized Projects</h1>
           <p className="text-lg text-slate-500 max-w-2xl mx-auto">
             Explore real-world assets currently tokenized and trading on the PropertyDEX protocol.
           </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(p => (
                <div key={p.id} className="transform hover:-translate-y-1 transition-transform duration-300 h-full">
                    <ProjectCard 
                        project={p} 
                        onClick={() => onSelectProject && onSelectProject(p)} 
                    />
                </div>
            ))}
        </div>

        <div className="mt-16 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">Want to list your asset?</h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                    Start the simulation to structure your SPV and mint your security tokens in minutes.
                </p>
                <button onClick={onBack} className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-brand-50 transition-colors">
                    Start Simulation
                </button>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};