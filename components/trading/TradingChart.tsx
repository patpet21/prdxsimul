
import React, { useState, useEffect, useRef } from 'react';

interface TradingChartProps {
  assetName: string;
  basePrice: number;
  volatility?: number; // 0.0 to 1.0
  trend?: 'up' | 'down' | 'flat';
  timeRange: '1D' | '1W' | '1M' | '1Y';
  onTimeRangeChange: (range: '1D' | '1W' | '1M' | '1Y') => void;
}

export const TradingChart: React.FC<TradingChartProps> = ({ 
  assetName, 
  basePrice, 
  volatility = 0.05, 
  trend = 'up',
  timeRange,
  onTimeRangeChange
}) => {
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [hoverPrice, setHoverPrice] = useState<number | null>(null);
  const [activeX, setActiveX] = useState<number | null>(null);
  
  // Flash effect state
  const [priceColor, setPriceColor] = useState<'white' | 'green' | 'red'>('white');
  const prevPriceRef = useRef<number>(basePrice);

  // 1. Generate Initial Historical Data
  useEffect(() => {
    const generateHistory = () => {
        const points: number[] = [];
        const count = 150; // Number of data points to render
        
        // Adjust volatility based on time range for realism
        // 1D = Low vol (intraday), 1Y = High vol (macro)
        const rangeVol = timeRange === '1D' ? 0.005 : timeRange === '1W' ? 0.02 : timeRange === '1M' ? 0.05 : 0.15;
        
        // Generate backwards from current price to create history
        const history: number[] = [basePrice];
        for (let i = 0; i < count; i++) {
            const last = history[0];
            // Random walk
            const change = (Math.random() - 0.5) * (basePrice * rangeVol);
            // Inverse trend factor (since we are building backwards)
            const trendFactor = trend === 'up' ? -0.0005 : trend === 'down' ? 0.0005 : 0;
            
            history.unshift(last + change + (basePrice * trendFactor));
        }
        return history;
    };

    setDataPoints(generateHistory());
    prevPriceRef.current = basePrice;
  }, [assetName, basePrice, timeRange, trend]);

  // 2. Simulate Real-time Updates (Live Ticker)
  useEffect(() => {
    // Faster updates for '1D' view to feel "live", slower for longer ranges
    const intervalTime = timeRange === '1D' ? 2500 : 5000; 

    const interval = setInterval(() => {
        setDataPoints(prev => {
            if (prev.length === 0) return prev;
            
            const lastPrice = prev[prev.length - 1];
            
            // Micro-volatility for live ticks varies by range
            const tickVol = timeRange === '1D' ? 0.002 : 0.005; 
            const move = (Math.random() - 0.5) * (basePrice * tickVol);
            
            // Add slight drift based on trend
            const drift = trend === 'up' ? (basePrice * 0.0002) : trend === 'down' ? -(basePrice * 0.0002) : 0;
            
            const newPrice = lastPrice + move + drift;
            
            // Trigger Flash
            if (newPrice > lastPrice) setPriceColor('green');
            else if (newPrice < lastPrice) setPriceColor('red');
            setTimeout(() => setPriceColor('white'), 600);

            prevPriceRef.current = lastPrice;

            // Shift window: Remove oldest, add new
            return [...prev.slice(1), newPrice];
        });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [timeRange, basePrice, trend]);

  // Safe guards for empty data
  if (dataPoints.length === 0) return null;

  // Calculate Chart Metrics
  const startPrice = dataPoints[0];
  const endPrice = dataPoints[dataPoints.length - 1];
  const currentDisplayPrice = hoverPrice || endPrice;
  
  const minPrice = Math.min(...dataPoints) * 0.999;
  const maxPrice = Math.max(...dataPoints) * 1.001;
  const isPositive = endPrice >= startPrice;
  const color = isPositive ? '#10b981' : '#ef4444'; // Emerald vs Red

  // SVG Dimensions
  const height = 300;
  const width = 800;

  // Generate SVG Path
  const points = dataPoints.map((price, index) => {
    const x = (index / (dataPoints.length - 1)) * width;
    // Invert Y axis (0 is top)
    const y = height - ((price - minPrice) / (maxPrice - minPrice)) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPath = `${points} ${width},${height} 0,${height}`;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
            <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-xl font-display">{assetName}</h3>
                <span className="text-slate-500 text-xs font-mono bg-slate-800 px-2 py-0.5 rounded">TOKEN</span>
            </div>
            <div className="flex items-end gap-3 mt-1">
                <span 
                    className={`text-3xl font-mono font-bold transition-colors duration-300 ${
                        hoverPrice ? 'text-white opacity-90' : 
                        priceColor === 'green' ? 'text-emerald-400' : 
                        priceColor === 'red' ? 'text-red-400' : 'text-white'
                    }`}
                >
                    ${currentDisplayPrice.toFixed(2)}
                </span>
                <span className={`text-sm font-bold mb-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{((endPrice - startPrice) / startPrice * 100).toFixed(2)}%
                </span>
                {/* Live Indicator */}
                {!hoverPrice && (
                    <span className="flex h-2 w-2 relative mb-2 ml-1">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPositive ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    </span>
                )}
            </div>
        </div>
        
        <div className="flex bg-slate-800 rounded-lg p-1">
            {(['1D', '1W', '1M', '1Y'] as const).map(range => (
                <button
                    key={range}
                    onClick={() => onTimeRangeChange(range)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${timeRange === range ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    {range}
                </button>
            ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[300px] w-full cursor-crosshair group">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* Gradient Defs */}
            <defs>
                <linearGradient id={`chartGradient-${isPositive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            
            {/* Grid Lines */}
            <line x1="0" y1={height/4} x2={width} y2={height/4} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1={3*height/4} x2={width} y2={3*height/4} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

            {/* Area */}
            <path d={`M0,${height} ${areaPath}`} fill={`url(#chartGradient-${isPositive ? 'up' : 'down'})`} />
            
            {/* Line */}
            <polyline 
                points={points} 
                fill="none" 
                stroke={color} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="transition-all duration-300 ease-out"
            />

            {/* Active Crosshair */}
            {activeX !== null && (
                <g>
                    <line 
                        x1={activeX} y1={0} x2={activeX} y2={height} 
                        stroke="#475569" strokeWidth="1" strokeDasharray="4 4"
                    />
                    <circle 
                        cx={activeX} 
                        cy={height - ((hoverPrice! - minPrice) / (maxPrice - minPrice)) * height} 
                        r="4" 
                        fill="white" 
                        stroke={color} 
                        strokeWidth="2" 
                    />
                </g>
            )}
        </svg>
        
        {/* Simple Hover Effect (Overlay) */}
        <div 
            className="absolute inset-0 z-20"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                // Clamp X
                const clampedX = Math.max(0, Math.min(x, rect.width));
                const ratio = clampedX / rect.width;
                const index = Math.min(Math.floor(ratio * (dataPoints.length - 1)), dataPoints.length - 1);
                
                // Map screen X back to SVG coordinate space for the line
                setActiveX(ratio * width);
                setHoverPrice(dataPoints[index]);
            }}
            onMouseLeave={() => {
                setHoverPrice(null);
                setActiveX(null);
            }}
        ></div>
      </div>
    </div>
  );
};
