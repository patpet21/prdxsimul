
import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { StatsCard } from '../components/StatsCard';
import { ProjectCard } from '../components/ui/ProjectCard';
import { DashboardTab, Project, UserProfile, Investment } from '../types';
import { supabase } from '../lib/supabase';
import { SecondaryMarketPage } from './SecondaryMarketPage';

interface DashboardPageProps {
  projects: Project[];
  onCreateNew: () => void;
  onLogout: () => void;
  onGoHome: () => void;
  onGoToTrading: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ projects, onCreateNew, onLogout, onGoHome, onGoToTrading }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('OVERVIEW');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  // Fetch real user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            // Get Profile
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (profile) setUserProfile(profile);

            // Get Investments
            const { data: userInvestments } = await supabase.from('investments').select('*').eq('user_id', session.user.id);
            if (userInvestments) {
                setInvestments(userInvestments);
                // Calculate Total Value Locked (Sum of investment_amount)
                // In a real app, this would multiply tokens_owned * current market price
                // For now, we sum the cost basis
                const total = userInvestments.reduce((sum: number, inv: any) => sum + (inv.investment_amount || 0), 0);
                setTotalValue(total);
            }
        }
    };
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans transition-all">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={onLogout} 
        onGoHome={onGoHome}
        onGoToTrading={onGoToTrading}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Top Header */}
      <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 lg:pl-72 transition-all">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg md:text-xl font-bold text-slate-800 font-display truncate">
            {activeTab === 'OVERVIEW' && 'Overview'}
            {activeTab === 'ASSETS' && 'My Assets'}
            {activeTab === 'TRADING' && 'Market Terminal'}
            {activeTab === 'WALLET' && 'Wallet'}
            {activeTab === 'DOCS' && 'Documents'}
            {activeTab === 'SETTINGS' && 'Settings'}
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
           <button className="p-2 text-slate-400 hover:text-slate-600 relative">
             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
           </button>
           <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                 <div className="text-sm font-bold text-slate-900">{userProfile?.full_name || 'Investor'}</div>
                 <div className="text-xs text-slate-500 capitalize">{userProfile?.country || 'Global'}</div>
              </div>
              <img 
                src={userProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.email || 'User'}`} 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 border border-slate-200" 
                alt="Avatar" 
              />
           </div>
        </div>
      </header>

      <main className={`p-4 md:p-8 max-w-7xl mx-auto lg:pl-72 transition-all ${activeTab === 'TRADING' ? 'h-[calc(100vh-80px)] overflow-hidden p-0 max-w-none' : ''}`}>
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 md:space-y-8 animate-fadeIn">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatsCard 
                  title="Total Value Locked" 
                  value={`$${totalValue.toLocaleString()}`} 
                  trend="+12%" 
                  trendUp={true} 
                  icon={<svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  colorClass="bg-brand-50"
                />
                <StatsCard 
                  title="Active Investments" 
                  value={String(investments.length)} 
                  icon={<svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                  colorClass="bg-purple-50"
                />
                <StatsCard 
                  title="Verified Status" 
                  value="Tier 2" 
                  trend="KYC OK" 
                  trendUp={true} 
                  icon={<svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                  colorClass="bg-emerald-50"
                />
                <StatsCard 
                  title="Compliance Score" 
                  value="98/100" 
                  icon={<svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  colorClass="bg-amber-50"
                />
             </div>

             {/* Projects Section */}
             <div>
                <div className="flex justify-between items-center mb-4 md:mb-6">
                   <h2 className="text-lg font-bold text-slate-800">Available Deals</h2>
                   <button onClick={() => setActiveTab('ASSETS')} className="text-sm text-brand-600 font-medium hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {projects.slice(0, 3).map(p => (
                      <ProjectCard key={p.id} project={p} onClick={() => {}} />
                   ))}
                   <button 
                    onClick={onCreateNew}
                    className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-brand-400 hover:text-brand-500 hover:bg-white transition-all group min-h-[200px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-brand-50 transition-colors shadow-sm">
                      <span className="text-2xl font-light">+</span>
                    </div>
                    <span className="font-medium text-sm">Issue New Asset</span>
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* TAB: ASSETS */}
        {activeTab === 'ASSETS' && (
           <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div className="flex flex-wrap gap-2">
                    {['All', 'Invested', 'My Issues'].map(filter => (
                       <button key={filter} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-600">
                          {filter}
                       </button>
                    ))}
                 </div>
                 <button onClick={onCreateNew} className="w-full sm:w-auto bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 shadow-lg shadow-brand-200">
                    + New Asset
                 </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Only show projects user has invested in or created? For now show all mock projects */}
                 {projects.map(p => (
                    <ProjectCard key={p.id} project={p} onClick={() => {}} />
                 ))}
              </div>
           </div>
        )}

        {/* TAB: TRADING (Embedded) */}
        {activeTab === 'TRADING' && (
            <div className="h-full animate-fadeIn">
                <SecondaryMarketPage 
                    listings={[]} 
                    onBack={() => setActiveTab('OVERVIEW')} 
                    onLogin={() => {}} 
                    onNavigate={() => {}}
                    isEmbedded={true}
                />
            </div>
        )}

        {/* TAB: WALLET */}
        {activeTab === 'WALLET' && (
           <div className="flex flex-col items-center justify-center py-12 md:py-20 animate-fadeIn bg-white rounded-2xl border border-slate-200 border-dashed m-2">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <svg className="w-8 h-8 md:w-10 md:h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Wallet Integration</h3>
              <p className="text-slate-500 max-w-md text-center mb-6 px-4 text-sm md:text-base">Connect your institutional custody wallet (Fireblocks, Coinbase Prime) or Web3 wallet (Metamask) to manage liquidity.</p>
              <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800">Connect Wallet</button>
           </div>
        )}

         {/* TAB: DOCS */}
         {activeTab === 'DOCS' && (
           <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                 <table className="w-full text-left text-sm min-w-[600px]">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                       <tr>
                          <th className="px-6 py-4">Document Name</th>
                          <th className="px-6 py-4">Associated Asset</th>
                          <th className="px-6 py-4">Date Uploaded</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {[
                          { name: 'Certificate of Incorporation.pdf', asset: 'Skyline Tower A', date: 'Oct 24, 2023', status: 'Verified' },
                          { name: 'Operating Agreement (Series LLC).pdf', asset: 'Warhol Collection', date: 'Oct 22, 2023', status: 'Pending' },
                          { name: 'Reg D 506(c) Filing.pdf', asset: 'TechFlow SaaS', date: 'Sep 15, 2023', status: 'Verified' },
                       ].map((doc, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                             <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                                <span className="truncate max-w-[150px]">{doc.name}</span>
                             </td>
                             <td className="px-6 py-4 text-slate-600">{doc.asset}</td>
                             <td className="px-6 py-4 text-slate-500">{doc.date}</td>
                             <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                   {doc.status}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <button className="text-brand-600 hover:text-brand-800 font-medium">Download</button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

      </main>
    </div>
  );
};
