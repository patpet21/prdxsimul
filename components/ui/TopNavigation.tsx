
import React, { useState } from 'react';
import { Button } from './Button';

interface TopNavigationProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
  onStartSimulation: () => void;
  activePage?: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ onNavigate, onLogin, onStartSimulation, activePage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { id: 'MARKETPLACE', label: 'Marketplace' },
    { id: 'TRADING', label: 'Trading' },
    { id: 'SOLUTIONS', label: 'Solutions' },
    { id: 'EDUCATION', label: 'Education' },
    { id: 'PRICING', label: 'Pricing' },
  ];

  return (
    <>
      <nav className="h-20 md:h-24 w-full bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('HOME')}>
          <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-brand-500/20">P</div>
          <span className="text-lg md:text-xl font-bold font-display text-slate-900 tracking-tight">PropertyDEX</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button 
              key={link.id}
              onClick={() => onNavigate(link.id)} 
              className={`transition-colors hover:text-brand-600 ${activePage === link.id ? 'text-brand-600 font-bold' : ''}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2 md:gap-4">
          <button 
            onClick={onLogin}
            className="text-slate-600 font-bold text-sm hover:text-slate-900 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Log in
          </button>
          <Button onClick={onStartSimulation} className="text-xs md:text-sm px-4 md:px-6 py-2 md:py-2.5 shadow-lg shadow-brand-500/20">
            Launch Sim
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
            {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
        </button>
      </nav>

      {/* Mobile Sidebar / Drawer */}
      <div className={`fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMenu}></div>
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col p-6 pt-24 space-y-6">
              <div className="space-y-4">
                  {navLinks.map((link) => (
                    <button 
                      key={link.id}
                      onClick={() => { onNavigate(link.id); toggleMenu(); }} 
                      className={`block w-full text-left text-lg font-bold py-2 border-b border-slate-100 ${activePage === link.id ? 'text-brand-600' : 'text-slate-800 hover:text-brand-600'}`}
                    >
                      {link.label}
                    </button>
                  ))}
              </div>
              
              <div className="mt-auto space-y-3 pt-6 border-t border-slate-100">
                  <Button onClick={() => { onStartSimulation(); toggleMenu(); }} className="w-full py-3 text-lg shadow-xl shadow-brand-500/20">
                      Start Simulation
                  </Button>
                  <Button onClick={() => { onLogin(); toggleMenu(); }} variant="outline" className="w-full py-3 text-lg">
                      Log in to Dashboard
                  </Button>
              </div>
          </div>
      </div>
    </>
  );
};
