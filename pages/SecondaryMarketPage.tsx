
import React, { useState, useEffect } from 'react';
import { SecondaryListing, Project, Investment, Order } from '../types';
import { TopNavigation } from '../components/ui/TopNavigation';
import { Button } from '../components/ui/Button';
import { TradingChart } from '../components/trading/TradingChart';
import Footer from '../components/ui/Footer';
import { supabase } from '../lib/supabase';

interface SecondaryMarketPageProps {
  listings: SecondaryListing[];
  onBack: () => void;
  onLogin: () => void;
  onNavigate: (page: string) => void;
  onListToken?: (listing: SecondaryListing) => void;
  isEmbedded?: boolean; // NEW: Controls whether to show full page layout or embedded view
}

export const SecondaryMarketPage: React.FC<SecondaryMarketPageProps> = ({ listings, onBack, onLogin, onNavigate, isEmbedded = false }) => {
  // Session & User Data
  const [userId, setUserId] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<number>(142050); // Simulating USDC balance
  
  // Market Data
  const [assets, setAssets] = useState<Project[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Project | null>(null);
  const [userHoldings, setUserHoldings] = useState<Investment | null>(null);
  
  // Order State
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // 1. Initial Load: Auth & Assets
  useEffect(() => {
    const init = async () => {
        // Get Session
        const { data: { session } } = await supabase.auth.getSession();
        setUserId(session?.user?.id || null);

        // Fetch Assets (Properties)
        // In a real app, we would fetch only active properties
        const mockAssets: Project[] = [
            { id: '1', title: 'Skyline Tower A', category: 'Real Estate', token_price: 50, total_tokens: 300000, annual_yield: 8.2, status: 'active', total_value: 15000000, image_url: '', description: '', location: 'New York, NY', available_tokens: 2000, min_invest_tokens: 1, raise_amount: 15000000, property_type: 'Office', risk_score: 2, featured: true, is_user_created: false } as Project,
            { id: '2', title: 'TechFlow SaaS', category: 'Business', token_price: 10, total_tokens: 500000, annual_yield: 0, status: 'active', total_value: 5000000, image_url: '', description: '', location: 'Austin, TX', available_tokens: 5000, min_invest_tokens: 1, raise_amount: 2000000, property_type: 'Equity', risk_score: 4, featured: false, is_user_created: false } as Project,
        ];
        
        // Try fetching real properties if they exist in DB
        const { data: realProps } = await supabase.from('properties').select('*');
        const displayAssets = (realProps && realProps.length > 0) ? realProps : mockAssets;

        setAssets(displayAssets);
        setSelectedAsset(displayAssets[0]);
        setPrice(displayAssets[0].token_price.toString());
    };
    init();
  }, []);

  // 2. Fetch User Holdings when Asset changes
  useEffect(() => {
      if (userId && selectedAsset) {
          // Check Investments table
          const checkHoldings = async () => {
              const { data } = await supabase.from('investments').select('*'); // Gets all in mock
              if (data) {
                  const holding = data.find((i: any) => i.user_id === userId && i.property_id === selectedAsset.id);
                  setUserHoldings(holding || null);
              }
          };
          checkHoldings();
      } else {
          setUserHoldings(null);
      }
  }, [userId, selectedAsset]);

  // 3. Fetch Recent Orders
  useEffect(() => {
      const fetchOrders = async () => {
          if(!userId) return;
          const { data } = await supabase.from('orders').select('*');
          if (data) {
              const myOrders = data
                .filter((o: any) => o.user_id === userId)
                .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              setRecentOrders(myOrders);
          }
      }
      fetchOrders();
  }, [userId, isSubmitting]);

  const handleOrderSubmit = async () => {
      if (!userId) {
          onLogin();
          return;
      }
      if (!selectedAsset || !amount || !price) return;

      setIsSubmitting(true);

      const numTokens = parseFloat(amount);
      const unitPrice = parseFloat(price);
      const totalCost = numTokens * unitPrice;

      // Validation
      if (orderSide === 'buy') {
          if (totalCost > userBalance) {
              alert("Insufficient USDC Balance");
              setIsSubmitting(false);
              return;
          }
      } else {
          if (!userHoldings || userHoldings.tokens_owned < numTokens) {
              alert(`Insufficient Tokens. You own ${userHoldings?.tokens_owned || 0}.`);
              setIsSubmitting(false);
              return;
          }
      }

      // Execute Order (Insert into DB)
      const orderPayload = {
          user_id: userId,
          property_id: selectedAsset.id,
          tokens: numTokens,
          unit_price_cents: Math.round(unitPrice * 100),
          gross_amount_cents: Math.round(totalCost * 100),
          status: 'paid', // Instant settlement for simulation
          tx_type: orderSide
      };

      const { error } = await supabase.from('orders').insert([orderPayload]);

      if (error) {
          alert("Order Failed: " + error.message);
      } else {
          if (orderSide === 'buy') {
              setUserBalance(prev => prev - totalCost);
          } else {
              setUserBalance(prev => prev + totalCost);
          }
          
          // Refetch holdings after short delay to allow mock DB to update
          setTimeout(() => {
              const checkHoldings = async () => {
                  const { data } = await supabase.from('investments').select('*');
                  if(data) {
                      const holding = data.find((i: any) => i.user_id === userId && i.property_id === selectedAsset.id);
                      setUserHoldings(holding || null);
                  }
              };
              checkHoldings();
          }, 500);
          
          alert(`${orderSide === 'buy' ? 'Buy' : 'Sell'} Order Executed!`);
          setAmount('');
      }

      setIsSubmitting(false);
  };

  return (
    <div className={`bg-slate-950 font-sans flex flex-col text-slate-300 selection:bg-brand-500/30 ${isEmbedded ? 'h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800' : 'min-h-screen'}`}>
      
      {/* Conditionally render Nav */}
      {!isEmbedded && (
        <TopNavigation 
            onNavigate={onNavigate} 
            onLogin={onLogin} 
            onStartSimulation={() => onNavigate('SIM_INTRO')}
            activePage="TRADING" 
        />
      )}

      {/* Professional Ticker */}
      <div className="bg-slate-900 border-b border-slate-800 h-10 flex items-center px-4 overflow-hidden text-xs font-mono shrink-0">
          <div className="flex gap-8 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
              {assets.map(a => (
                  <span key={a.id} className="flex items-center gap-2 text-slate-400">
                      <span className="font-bold text-white">{a.title.substring(0, 4).toUpperCase()}</span>
                      <span>${a.token_price.toFixed(2)}</span>
                      <span className="text-emerald-400">+{a.annual_yield}% YLD</span>
                  </span>
              ))}
              <span className="flex items-center gap-2 text-slate-400"><span className="font-bold text-white">BTC</span> <span>$64,230</span> <span className="text-red-400">-1.2%</span></span>
              <span className="flex items-center gap-2 text-slate-400"><span className="font-bold text-white">ETH</span> <span>$3,450</span> <span className="text-emerald-400">+0.5%</span></span>
          </div>
      </div>

      <main className={`flex-1 w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 ${isEmbedded ? 'p-4 overflow-y-auto' : 'p-6 max-w-[1600px]'}`}>
          
          {/* LEFT COL: Assets & Stats (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
              {/* Asset Selector */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col h-[400px]">
                  <div className="p-4 border-b border-slate-800 bg-slate-800/50">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Assets</h3>
                  </div>
                  <div className="overflow-y-auto flex-1 custom-scrollbar">
                      {assets.map(asset => (
                          <button 
                            key={asset.id}
                            onClick={() => { setSelectedAsset(asset); setPrice(asset.token_price.toString()); }}
                            className={`w-full p-4 flex items-center justify-between border-b border-slate-800/50 hover:bg-slate-800 transition-colors ${selectedAsset?.id === asset.id ? 'bg-slate-800 border-l-2 border-l-brand-500' : ''}`}
                          >
                              <div className="text-left">
                                  <div className="font-bold text-white text-sm truncate max-w-[120px]">{asset.title}</div>
                                  <div className="text-xs text-slate-500">{asset.property_type}</div>
                              </div>
                              <div className="text-right">
                                  <div className="text-white font-mono text-sm">${asset.token_price}</div>
                                  <div className="text-xs text-emerald-500">{asset.annual_yield}%</div>
                              </div>
                          </button>
                      ))}
                  </div>
              </div>

              {/* Portfolio Snapshot */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Your Portfolio</h3>
                  <div className="space-y-4">
                      <div>
                          <div className="text-slate-500 text-xs mb-1">Available Cash</div>
                          <div className="text-2xl font-mono text-white">${userBalance.toLocaleString()}</div>
                      </div>
                      <div className="pt-4 border-t border-slate-800">
                          <div className="text-slate-500 text-xs mb-1">Asset Holdings</div>
                          {selectedAsset && userHoldings ? (
                              <div className="flex justify-between items-center">
                                  <span className="text-white font-medium truncate max-w-[120px]">{selectedAsset.title}</span>
                                  <span className="text-brand-400 font-mono">{userHoldings.tokens_owned} Tokens</span>
                              </div>
                          ) : (
                              <span className="text-slate-600 text-sm italic">No position in selected asset</span>
                          )}
                      </div>
                  </div>
              </div>
          </div>

          {/* CENTER COL: Chart & Depth (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
              {selectedAsset && (
                  <TradingChart 
                    assetName={selectedAsset.title}
                    basePrice={selectedAsset.token_price}
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                    trend={selectedAsset.annual_yield > 5 ? 'up' : 'flat'}
                  />
              )}

              {/* Recent Trades / Open Orders Table */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden min-h-[250px]">
                  <div className="flex items-center gap-6 p-4 border-b border-slate-800">
                      <h3 className="text-sm font-bold text-white">Your Orders</h3>
                      <h3 className="text-sm font-bold text-slate-500 hover:text-white cursor-pointer">Market Trades</h3>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                          <thead className="bg-slate-800/50 text-slate-400">
                              <tr>
                                  <th className="px-4 py-2">Time</th>
                                  <th className="px-4 py-2">Type</th>
                                  <th className="px-4 py-2 text-right">Price</th>
                                  <th className="px-4 py-2 text-right">Qty</th>
                                  <th className="px-4 py-2 text-right">Value</th>
                                  <th className="px-4 py-2">Status</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                              {recentOrders.length > 0 ? recentOrders.map((o) => (
                                  <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                                      <td className="px-4 py-2 text-slate-500">{new Date(o.created_at).toLocaleTimeString()}</td>
                                      <td className={`px-4 py-2 font-bold uppercase ${(o as any).tx_type === 'buy' ? 'text-emerald-500' : 'text-red-500'}`}>{(o as any).tx_type || 'Limit'}</td>
                                      <td className="px-4 py-2 text-right font-mono">${(o.unit_price_cents / 100).toFixed(2)}</td>
                                      <td className="px-4 py-2 text-right font-mono">{o.tokens}</td>
                                      <td className="px-4 py-2 text-right font-mono text-slate-300">${(o.gross_amount_cents / 100).toFixed(2)}</td>
                                      <td className="px-4 py-2 capitalize text-amber-500">{o.status}</td>
                                  </tr>
                              )) : (
                                  <tr>
                                      <td colSpan={6} className="p-8 text-center text-slate-600">No orders placed yet.</td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>

          {/* RIGHT COL: Order Entry & Book (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
              
              {/* Order Entry */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                  <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
                      <button 
                        onClick={() => setOrderSide('buy')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${orderSide === 'buy' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                      >
                          Buy
                      </button>
                      <button 
                        onClick={() => setOrderSide('sell')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${orderSide === 'sell' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                      >
                          Sell
                      </button>
                  </div>

                  <div className="space-y-4">
                      <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Price (USDC)</label>
                          <div className="relative">
                              <input 
                                type="number" 
                                value={price} 
                                onChange={e => setPrice(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white font-mono focus:border-brand-500 outline-none transition-colors"
                              />
                          </div>
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Amount (Tokens)</label>
                          <div className="relative">
                              <input 
                                type="number" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white font-mono focus:border-brand-500 outline-none transition-colors"
                              />
                              <button onClick={() => setAmount('100')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 hover:text-white">Max</button>
                          </div>
                      </div>

                      <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                              <span>Total Value</span>
                              <span>Fees (0.1%)</span>
                          </div>
                          <div className="flex justify-between items-end">
                              <span className="text-xl font-bold text-white font-mono">
                                  ${(parseFloat(amount || '0') * parseFloat(price || '0')).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                              <span className="text-xs text-slate-500">$5.00</span>
                          </div>
                      </div>

                      <Button 
                        onClick={handleOrderSubmit}
                        isLoading={isSubmitting}
                        className={`w-full py-4 text-lg font-bold ${orderSide === 'buy' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-red-600 hover:bg-red-500 shadow-red-900/20'}`}
                      >
                          {userId ? (orderSide === 'buy' ? 'Place Buy Order' : 'Place Sell Order') : 'Login to Trade'}
                      </Button>
                  </div>
              </div>

              {/* Order Book */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col h-[350px]">
                  <div className="p-3 border-b border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Order Book</span>
                      <span className="text-[10px] text-slate-600 font-mono">Spread: 0.8%</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                      {/* Sells */}
                      {[
                          { p: 52.50, a: 120, total: 6300 },
                          { p: 51.20, a: 450, total: 23040 },
                          { p: 50.80, a: 50, total: 2540 },
                      ].map((row, i) => (
                          <div key={`s-${i}`} className="flex justify-between text-xs font-mono py-1 px-2 hover:bg-slate-800 cursor-pointer relative group">
                              <span className="text-red-400 relative z-10">{row.p.toFixed(2)}</span>
                              <span className="text-slate-400 relative z-10">{row.a}</span>
                              <span className="text-slate-600 relative z-10">${(row.total/1000).toFixed(1)}k</span>
                              <div className="absolute right-0 top-0 bottom-0 bg-red-500/10 transition-all group-hover:bg-red-500/20" style={{ width: `${Math.random() * 60 + 10}%` }}></div>
                          </div>
                      ))}
                      
                      <div className="py-2 my-1 border-y border-slate-800 text-center font-bold text-lg text-white font-mono">
                          ${parseFloat(price || '50').toFixed(2)}
                      </div>

                      {/* Buys */}
                      {[
                          { p: 49.50, a: 200, total: 9900 },
                          { p: 48.90, a: 1500, total: 73350 },
                          { p: 48.00, a: 300, total: 14400 },
                      ].map((row, i) => (
                          <div key={`b-${i}`} className="flex justify-between text-xs font-mono py-1 px-2 hover:bg-slate-800 cursor-pointer relative group">
                              <span className="text-emerald-400 relative z-10">{row.p.toFixed(2)}</span>
                              <span className="text-slate-400 relative z-10">{row.a}</span>
                              <span className="text-slate-600 relative z-10">${(row.total/1000).toFixed(1)}k</span>
                              <div className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 transition-all group-hover:bg-emerald-500/20" style={{ width: `${Math.random() * 60 + 10}%` }}></div>
                          </div>
                      ))}
                  </div>
              </div>

          </div>
      </main>

      {/* Conditionally render Footer */}
      {!isEmbedded && <Footer />}
    </div>
  );
};
