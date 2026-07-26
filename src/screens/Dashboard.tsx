import React, { useState, useEffect } from 'react';
import { BarChart2, ChevronLeft, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const Dashboard: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'NPU' | 'SOC' | 'RAM'>('NPU');
  const [tick, setTick] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('4:30 PM today');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTick(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 800));
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastUpdated(`${timeStr} today`);
    setIsRefreshing(false);
    showToast("Telemetry re-fetched from Camry device");
  };

  // Simulate slight breathing in stats
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const updateTick = () => {
      setTick(prev => prev + 1);
      timeout = setTimeout(updateTick, Math.random() * 2000 + 1000); // Irregular interval
    };
    timeout = setTimeout(updateTick, 1500);
    return () => clearTimeout(timeout);
  }, []);

  const getStat = (base: number, variance: number, id: string) => {
    const noise = (Math.random() * 0.4 - 0.2);
    const val = base + (Math.sin(tick + id.length) * variance) + noise;
    return Math.max(0, val).toFixed(1);
  };

  const getStatTab = (id: 'NPU' | 'SOC' | 'RAM', value: string) => {
    const isActive = activeTab === id;
    return (
      <button 
        onClick={() => setActiveTab(id)}
        className={`flex-1 text-left p-4 rounded-xl border transition-all ${
          isActive 
            ? 'bg-white border-camry-carrier shadow-sm' 
            : 'bg-camry-graphite/5 border-transparent hover:bg-camry-graphite/10'
        }`}
      >
        <div className="font-martian text-xs text-camry-graphite/60 mb-1">{id}</div>
        <div className={`font-martian text-4xl tracking-tight ${isActive ? 'text-camry-carrier' : 'text-camry-blackout'}`}>
          {value}<span className="text-lg text-camry-graphite/40 ml-1">%</span>
        </div>
      </button>
    );
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-camry-paper overflow-hidden">
      {/* Header */}
      <div className="p-8 pb-6 flex-shrink-0 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BarChart2 className="text-camry-blackout" size={24} />
          <h1 className="text-2xl font-bricolage text-camry-blackout">Dashboard</h1>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black/10 rounded-lg text-xs font-martian text-camry-graphite hover:bg-camry-graphite/5 transition-all shadow-sm disabled:opacity-60"
        >
          {isRefreshing ? (
            <>
              <Loader2 size={14} className="animate-spin text-camry-deep-carrier" />
              <span>Fetching state...</span>
            </>
          ) : (
            <>
              <RefreshCw size={14} className="text-camry-blackout" />
              <span>Refresh State</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="max-w-4xl space-y-6">
          
          {/* Telemetry Tabs */}
          <div className="flex gap-4">
            {getStatTab('NPU', getStat(0, 0, 'NPU'))}
            {getStatTab('SOC', getStat(31.8, 1.5, 'SOC'))}
            {getStatTab('RAM', getStat(14.17, 0.5, 'RAM'))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            
            {/* Weekly Usage Highlight */}
            <div className="col-span-1 bg-camry-graphite rounded-xl p-6 flex flex-col justify-between shadow-md">
              <div>
                <div className="font-martian text-xs text-white/50 mb-2">Weekly Usage</div>
                <div className="font-martian text-5xl text-white tracking-tight">
                  0.5<span className="text-xl text-white/40 ml-1">K</span>
                </div>
                <div className="font-martian text-xs text-white/30 mt-1">tokens</div>
              </div>
              <div className="font-martian text-[10px] text-white/40 mt-8 flex items-center justify-between">
                <span>Updated at {lastUpdated}</span>
                {isRefreshing && <span className="w-2 h-2 rounded-full bg-camry-carrier animate-ping" />}
              </div>
            </div>

            {/* Chart Area */}
            <div className="col-span-2 bg-white border border-black/5 rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 text-camry-graphite/60 font-martian text-xs">
                  <button onClick={() => showToast("Historical data not available in preview")} className="hover:text-black"><ChevronLeft size={16} /></button>
                  <span>Mar 9 to Mar 15</span>
                  <button onClick={() => showToast("Future data not available")} className="hover:text-black"><ChevronRight size={16} /></button>
                </div>
                <div className="font-martian text-[10px] bg-camry-graphite/5 px-2 py-1 rounded text-camry-graphite/50">THIS WEEK</div>
              </div>

              {/* Chart Placeholder / implementation */}
              <div className="flex-1 relative min-h-[200px] border-b border-black/5">
                {/* Y-axis */}
                <div className="absolute left-0 top-2 bottom-2 flex flex-col justify-between text-[10px] font-martian text-camry-graphite/30">
                  <span className="-mt-1.5">0.5K</span>
                  <span className="-mt-1.5">0.38K</span>
                  <span className="-mt-1.5">0.25K</span>
                  <span className="-mt-1.5">0.13K</span>
                  <span className="-mt-1.5">0K</span>
                </div>
                
                {/* Grid lines */}
                <div className="absolute left-8 right-0 top-2 bottom-2 flex flex-col justify-between pointer-events-none">
                  {[0,1,2,3,4].map(i => <div key={i} className="border-t border-black/5 w-full"></div>)}
                </div>

                {/* Bars */}
                <div className="absolute left-8 right-0 top-2 bottom-2 flex items-end justify-around z-10 px-4">
                  {[30, 45, 20, 80, 60, 90, 40].map((h, i) => (
                    <div key={i} className="w-8 md:w-12 h-full flex flex-col justify-end group relative">
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-camry-graphite text-white font-martian text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                        <div className="flex gap-2 justify-between"><span>gpt-oss-120b</span><span>{(h * 0.6).toFixed(0)}</span></div>
                        <div className="flex gap-2 justify-between text-white/50"><span>Qwen3-Coder-30B</span><span>{(h * 0.4).toFixed(0)}</span></div>
                      </div>
                      
                      {/* Segments */}
                      <div className="w-full bg-camry-graphite/20 rounded-t-sm hover:opacity-90 transition-opacity" style={{ height: `${h * 0.4}%` }}></div>
                      <div className="w-full bg-camry-carrier/80 rounded-b-sm hover:opacity-90 transition-opacity" style={{ height: `${h * 0.6}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* X-axis labels */}
              <div className="flex justify-around ml-8 px-4 pt-3 font-martian text-[10px] text-camry-graphite/40">
                <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
              </div>

              {/* Legend */}
              <div className="flex gap-4 mt-6 font-martian text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-camry-carrier/80"></div>
                  <span className="text-camry-graphite/70">gpt-oss-120b</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-camry-graphite/20"></div>
                  <span className="text-camry-graphite/70">Qwen3-Coder-30B</span>
                </div>
              </div>

            </div>
          </div>

          {/* Device Strip */}
          <div className="mt-8 bg-camry-graphite/5 border border-black/5 rounded-lg p-3 flex justify-between items-center font-martian text-xs text-camry-graphite/60">
            <span>CAMRY ONE</span>
            <span className="w-1 h-1 rounded-full bg-black/10"></span>
            <span>256GB</span>
            <span className="w-1 h-1 rounded-full bg-black/10"></span>
            <span>FW 1.0.3</span>
            <span className="w-1 h-1 rounded-full bg-black/10"></span>
            <span>UPTIME 4d 12h</span>
            <span className="w-1 h-1 rounded-full bg-black/10"></span>
            <span>65W</span>
          </div>

        </div>
      </div>
    </div>
  );
};
