import React, { useState, useEffect, useRef } from 'react';
import { BarChart2, ChevronLeft, ChevronRight, RefreshCw, Loader2, Cpu, HardDrive, Terminal, Play, Pause, Trash2, Download, Activity, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

interface HardwareMetric {
  time: string;
  cpu: number;
  memory: number;
  npu: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  category: 'HW' | 'INF' | 'SYS' | 'WARN';
  message: string;
}

export const Dashboard: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'NPU' | 'SOC' | 'RAM'>('NPU');
  const [tick, setTick] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('4:30 PM today');

  // Hardware "Breathing" Telemetry State
  const [npuValue, setNpuValue] = useState<number>(34.8);
  const [socValue, setSocValue] = useState<number>(27.4);
  const [ramValue, setRamValue] = useState<number>(56.2);

  // Real-time Hardware Performance Chart State
  const [metricsHistory, setMetricsHistory] = useState<HardwareMetric[]>([
    { time: '12:50:00', cpu: 22, memory: 52, npu: 30 },
    { time: '12:50:05', cpu: 28, memory: 54, npu: 35 },
    { time: '12:50:10', cpu: 31, memory: 53, npu: 28 },
    { time: '12:50:15', cpu: 25, memory: 55, npu: 42 },
    { time: '12:50:20', cpu: 45, memory: 58, npu: 65 },
    { time: '12:50:25', cpu: 38, memory: 57, npu: 50 },
    { time: '12:50:30', cpu: 30, memory: 56, npu: 34 },
    { time: '12:50:35', cpu: 27, memory: 56, npu: 30 },
    { time: '12:50:40', cpu: 32, memory: 57, npu: 38 },
    { time: '12:50:45', cpu: 29, memory: 58, npu: 31 },
  ]);

  // Dedicated Hardware "Breathing" Effect with Irregular Random Intervals
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const updateBreathingHardware = () => {
      // Small organic micro-fluctuations
      const deltaNpu = (Math.random() * 4 - 1.8);
      const deltaSoc = (Math.random() * 3 - 1.4);
      const deltaRam = (Math.random() * 2 - 0.9);

      setNpuValue(prev => {
        const next = Math.min(96, Math.max(12, Number((prev + deltaNpu).toFixed(1))));
        if (next > 84) {
          showToast(`NPU Tensor Load exceeded 84% (${next}% TOPS)`, 'warning', 'METRIC THRESHOLD EXCEEDED');
        }
        return next;
      });

      setSocValue(prev => Math.min(92, Math.max(10, Number((prev + deltaSoc).toFixed(1)))));
      
      setRamValue(prev => {
        const next = Math.min(94, Math.max(25, Number((prev + deltaRam).toFixed(1))));
        if (next > 88) {
          showToast(`Unified RAM allocation threshold warning (${next}% used)`, 'warning', 'VRAM THRESHOLD ALERT');
        }
        return next;
      });

      // Schedule next update at irregular interval (simulate hardware oscillation breathing)
      const irregularInterval = Math.floor(Math.random() * 1800 + 800);
      timerId = setTimeout(updateBreathingHardware, irregularInterval);
    };

    timerId = setTimeout(updateBreathingHardware, 1200);

    return () => clearTimeout(timerId);
  }, []);

  // System Logs State
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '12:50:00', category: 'SYS', message: 'Camry OS NPU kernel initialized (32GB Unified VRAM allocated)' },
    { id: '2', timestamp: '12:50:08', category: 'HW', message: 'Core temperature 41°C — Thermal throttle disabled' },
    { id: '3', timestamp: '12:50:15', category: 'INF', message: 'Inference thread started for agent "meeting" (Latency: 14ms)' },
    { id: '4', timestamp: '12:50:22', category: 'HW', message: 'LPDDR5X Memory bandwidth test OK — 142 GB/s verified' },
    { id: '5', timestamp: '12:50:30', category: 'WARN', message: 'VRAM Usage reached 58% (18.5GB/32GB)' },
  ]);

  const [isLogsPaused, setIsLogsPaused] = useState(false);
  const [logFilter, setLogFilter] = useState<'ALL' | 'HW' | 'INF' | 'WARN'>('ALL');
  const logsScrollRef = useRef<HTMLDivElement>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTick(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 800));
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastUpdated(`${timeStr} today`);
    setIsRefreshing(false);
    showToast("Telemetry re-fetched from Camry device");
  };

  // Real-time hardware telemetry tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
      
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Generate new metric
      const newCpu = Math.min(95, Math.max(15, Math.floor(25 + Math.random() * 25 + (Math.sin(Date.now() / 3000) * 15))));
      const newMem = Math.min(90, Math.max(40, Math.floor(55 + (Math.cos(Date.now() / 4000) * 5))));
      const newNpu = Math.min(100, Math.max(10, Math.floor(30 + Math.random() * 30)));

      setMetricsHistory(prev => {
        const next = [...prev, { time: timeStr, cpu: newCpu, memory: newMem, npu: newNpu }];
        if (next.length > 20) return next.slice(next.length - 20);
        return next;
      });

      // Append log entry if not paused
      if (!isLogsPaused) {
        const categories: Array<'HW' | 'INF' | 'SYS' | 'WARN'> = ['HW', 'INF', 'SYS', 'HW'];
        const sampleMessages = [
          'NPU Tensor Core 0-3 load balanced: 38.2 TOPS',
          'Agent health check OK — 0 exceptions in last 60s',
          'VRAM KV Cache compaction completed (Saved 240MB)',
          'CPU Core 0-7 frequency stabilized at 3.8GHz',
          'Network Interface wlan0: 0 packet loss',
          'Unified Memory Bus speed verified: 142 GB/s',
        ];

        const cat = categories[Math.floor(Math.random() * categories.length)];
        const msg = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

        setLogs(prev => {
          const newEntry: LogEntry = {
            id: Date.now().toString(),
            timestamp: timeStr,
            category: cat,
            message: msg
          };
          const next = [...prev, newEntry];
          if (next.length > 50) return next.slice(next.length - 50);
          return next;
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLogsPaused]);

  // Auto-scroll logs
  useEffect(() => {
    if (logsScrollRef.current && !isLogsPaused) {
      logsScrollRef.current.scrollTop = logsScrollRef.current.scrollHeight;
    }
  }, [logs, isLogsPaused]);

  const latestMetric = metricsHistory[metricsHistory.length - 1] || { cpu: 28, memory: 56, npu: 35 };

  const filteredLogs = logs.filter(l => {
    if (logFilter === 'ALL') return true;
    return l.category === logFilter;
  });

  const getStatTab = (id: 'NPU' | 'SOC' | 'RAM', value: string) => {
    const isActive = activeTab === id;
    return (
      <button 
        onClick={() => setActiveTab(id)}
        className={`flex-1 text-left p-2.5 sm:p-4 rounded-xl border transition-all ${
          isActive 
            ? 'bg-white border-camry-carrier shadow-sm' 
            : 'bg-camry-graphite/5 border-transparent hover:bg-camry-graphite/10'
        }`}
      >
        <div className="font-martian text-[10px] sm:text-xs text-camry-graphite/60 mb-0.5 sm:mb-1">{id}</div>
        <div className={`font-martian text-xl sm:text-3xl md:text-4xl tracking-tight ${isActive ? 'text-camry-carrier' : 'text-camry-blackout'}`}>
          {value}<span className="text-xs sm:text-lg text-camry-graphite/40 ml-0.5 sm:ml-1">%</span>
        </div>
      </button>
    );
  };

  // Generate SVG path string from metrics data
  const createSvgPath = (key: 'cpu' | 'memory' | 'npu') => {
    if (metricsHistory.length < 2) return '';
    const width = 600;
    const height = 140;

    const points = metricsHistory.map((m, idx) => {
      const x = (idx / (metricsHistory.length - 1)) * width;
      const y = height - (m[key] / 100) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const createSvgArea = (key: 'cpu' | 'memory' | 'npu') => {
    if (metricsHistory.length < 2) return '';
    const width = 600;
    const height = 140;
    const linePath = createSvgPath(key);
    return `${linePath} L ${width},${height} L 0,${height} Z`;
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-camry-paper overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-8 pb-4 flex-shrink-0 flex justify-between items-center gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <BarChart2 className="text-camry-blackout flex-shrink-0" size={22} />
          <h1 className="text-xl sm:text-2xl font-bricolage text-camry-blackout">Dashboard</h1>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-white border border-black/10 rounded-lg text-xs font-martian text-camry-graphite hover:bg-camry-graphite/5 transition-all shadow-sm disabled:opacity-60 flex-shrink-0"
        >
          {isRefreshing ? (
            <>
              <Loader2 size={14} className="animate-spin text-camry-deep-carrier" />
              <span className="hidden xs:inline">Fetching...</span>
            </>
          ) : (
            <>
              <RefreshCw size={14} className="text-camry-blackout" />
              <span className="hidden xs:inline">Refresh State</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8">
        <div className="max-w-4xl space-y-4 sm:space-y-6">
          
          {isRefreshing ? (
            /* TELEMETRY LOADING SKELETONS */
            <div className="space-y-4 sm:space-y-6">
              {/* Skeleton Stat Tabs */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-3 sm:p-4 bg-white border border-black/10 rounded-xl space-y-2 animate-pulse">
                    <div className="h-3 bg-black/10 rounded w-12" />
                    <div className="h-8 bg-black/10 rounded w-20" />
                  </div>
                ))}
              </div>

              {/* Skeleton Performance Card */}
              <div className="bg-white border border-black/10 rounded-xl p-4 sm:p-6 shadow-sm space-y-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-black/10 rounded w-48" />
                  <div className="h-4 bg-black/10 rounded w-24" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 bg-zinc-100 rounded-xl space-y-2">
                      <div className="h-3 bg-black/10 rounded w-16" />
                      <div className="h-6 bg-black/10 rounded w-24" />
                      <div className="h-3 bg-black/10 rounded w-32" />
                    </div>
                  ))}
                </div>

                <div className="h-36 sm:h-40 bg-zinc-200 rounded-lg" />
              </div>

              {/* Skeleton System Logs */}
              <div className="bg-white border border-black/10 rounded-xl p-4 sm:p-6 shadow-sm space-y-3 animate-pulse">
                <div className="h-5 bg-black/10 rounded w-32" />
                <div className="h-48 bg-zinc-100 rounded-lg p-4 space-y-2">
                  <div className="h-4 bg-black/10 rounded w-full" />
                  <div className="h-4 bg-black/10 rounded w-4/5" />
                  <div className="h-4 bg-black/10 rounded w-5/6" />
                  <div className="h-4 bg-black/10 rounded w-2/3" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Telemetry Tabs with Live Breathing Hardware Values */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {getStatTab('NPU', npuValue.toFixed(1))}
                {getStatTab('SOC', socValue.toFixed(1))}
                {getStatTab('RAM', ramValue.toFixed(1))}
              </div>

              {/* REAL-TIME HARDWARE PERFORMANCE METRICS CHART */}
              <div className="bg-white border border-black/10 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Cpu size={18} className="text-camry-blackout flex-shrink-0" />
                    <h3 className="font-bricolage text-base sm:text-lg text-camry-blackout leading-tight">Real-Time Hardware Performance Metrics</h3>
                  </div>
                  <div className="flex items-center gap-2 font-martian text-[10px] text-camry-graphite/60 bg-black/5 px-2.5 py-1 rounded-md w-fit">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>LIVE TELEMETRY</span>
                  </div>
                </div>

                {/* Metrics Key Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div className="p-3.5 sm:p-4 bg-zinc-50/80 border border-black/10 rounded-xl hover:border-black/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-martian text-[10px] text-camry-graphite/70 font-bold uppercase tracking-wider">CPU Usage</span>
                      <span className="w-2 h-2 rounded-full bg-zinc-400" />
                    </div>
                    <div className="font-martian text-xl sm:text-2xl text-camry-blackout font-bold">{latestMetric.cpu}%</div>
                    <div className="font-familjen text-xs text-camry-graphite/60 mt-0.5">8 Cores @ 3.8GHz</div>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-zinc-50/80 border border-black/10 rounded-xl hover:border-black/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-martian text-[10px] text-camry-graphite/70 font-bold uppercase tracking-wider">Memory (RAM/VRAM)</span>
                      <span className="w-2 h-2 rounded-full bg-zinc-400" />
                    </div>
                    <div className="font-martian text-xl sm:text-2xl text-camry-blackout font-bold">{latestMetric.memory}%</div>
                    <div className="font-familjen text-xs text-camry-graphite/60 mt-0.5">{((latestMetric.memory / 100) * 32).toFixed(1)} GB / 32 GB Used</div>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-zinc-50/80 border border-black/10 rounded-xl hover:border-black/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-martian text-[10px] text-camry-graphite/70 font-bold uppercase tracking-wider">NPU TOPS Load</span>
                      <span className="w-2 h-2 rounded-full bg-zinc-400" />
                    </div>
                    <div className="font-martian text-xl sm:text-2xl text-camry-blackout font-bold">{latestMetric.npu}%</div>
                    <div className="font-familjen text-xs text-camry-graphite/60 mt-0.5">{((latestMetric.npu / 100) * 40).toFixed(1)} TOPS Active</div>
                  </div>
                </div>

                {/* Real-time Hardware Chart (SVG Data Visualization) */}
                <div className="relative h-36 sm:h-40 bg-camry-blackout rounded-lg p-3 sm:p-4 overflow-hidden border border-white/10 flex flex-col justify-between">
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 140" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    <line x1="0" y1="35" x2="600" y2="35" stroke="#ffffff" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <line x1="0" y1="70" x2="600" y2="70" stroke="#ffffff" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <line x1="0" y1="105" x2="600" y2="105" stroke="#ffffff" strokeOpacity="0.1" strokeDasharray="4 4" />

                    {/* Memory Area & Line */}
                    <path d={createSvgArea('memory')} fill="url(#memGrad)" />
                    <path d={createSvgPath('memory')} fill="none" stroke="#10b981" strokeWidth="2.5" />

                    {/* CPU Area & Line */}
                    <path d={createSvgArea('cpu')} fill="url(#cpuGrad)" />
                    <path d={createSvgPath('cpu')} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

                    {/* NPU Line */}
                    <path d={createSvgPath('npu')} fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="3 3" />
                  </svg>

                  {/* Chart Legend */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between font-martian text-[10px] text-white/60 pt-2 z-10 border-t border-white/10 mt-2 gap-1.5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                        <span className="text-white">CPU %</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-sm" />
                        <span className="text-white">Memory %</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-sm" />
                        <span className="text-white">NPU %</span>
                      </div>
                    </div>
                    <span className="text-[9px] sm:text-[10px] opacity-80">Last updated: {metricsHistory[metricsHistory.length - 1]?.time}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SYSTEM LOGS COMPONENT */}
          <div className="bg-white border border-black/10 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-camry-blackout" />
                <h3 className="font-bricolage text-base sm:text-lg text-camry-blackout">System Logs</h3>
                <span className="font-martian text-[10px] bg-camry-blackout text-white px-2 py-0.5 rounded">
                  {filteredLogs.length} Events
                </span>
              </div>

              {/* Controls & Filter */}
              <div className="flex items-center gap-2">
                {/* Filter buttons */}
                <div className="flex items-center bg-black/5 p-1 rounded-lg font-martian text-[10px]">
                  {(['ALL', 'HW', 'INF', 'WARN'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setLogFilter(f)}
                      className={`px-2 py-1 rounded ${logFilter === f ? 'bg-white text-black shadow-sm font-bold' : 'text-camry-graphite/60 hover:text-black'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Pause/Resume button */}
                <button
                  onClick={() => setIsLogsPaused(!isLogsPaused)}
                  className="p-1.5 rounded-lg border border-black/10 hover:bg-black/5 text-camry-graphite text-xs font-martian flex items-center gap-1"
                  title={isLogsPaused ? "Resume streaming" : "Pause streaming"}
                >
                  {isLogsPaused ? <Play size={12} className="text-emerald-600" /> : <Pause size={12} className="text-amber-600" />}
                </button>

                {/* Clear Logs */}
                <button
                  onClick={() => {
                    setLogs([]);
                    showToast("System logs cleared");
                  }}
                  className="p-1.5 rounded-lg border border-black/10 hover:bg-red-50 text-red-600 text-xs transition-colors"
                  title="Clear log buffer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Live Log Terminal Output */}
            <div 
              ref={logsScrollRef}
              className="bg-camry-blackout rounded-lg p-3 sm:p-4 h-56 overflow-y-auto font-martian text-xs leading-relaxed text-camry-paper border border-white/10 space-y-1.5"
            >
              {filteredLogs.length === 0 ? (
                <div className="text-white/40 italic p-4 text-center">No system logs in this filter view.</div>
              ) : (
                filteredLogs.map(log => (
                  <div key={log.id} className="flex items-start gap-2 sm:gap-3 hover:bg-white/5 p-1 rounded transition-colors">
                    <span className="text-white/40 text-[10px] whitespace-nowrap pt-0.5">{log.timestamp}</span>
                    <span className={`px-1.5 py-0.2 text-[9px] rounded font-bold uppercase whitespace-nowrap ${
                      log.category === 'WARN' ? 'bg-red-900/80 text-red-200 border border-red-700' :
                      log.category === 'HW' ? 'bg-amber-950/80 text-amber-200 border border-amber-700' :
                      log.category === 'INF' ? 'bg-purple-900/80 text-purple-200 border border-purple-700' :
                      'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                    }`}>
                      [{log.category}]
                    </span>
                    <span className="text-white/90 text-[11px] sm:text-xs flex-1 break-words">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Device Strip */}
          <div className="bg-camry-graphite/5 border border-black/5 rounded-lg p-3 flex flex-wrap justify-between items-center gap-2 font-martian text-[10px] sm:text-xs text-camry-graphite/60">
            <span>CAMRY ONE</span>
            <span className="w-1 h-1 rounded-full bg-black/10 hidden sm:inline-block"></span>
            <span>256GB</span>
            <span className="w-1 h-1 rounded-full bg-black/10 hidden sm:inline-block"></span>
            <span>FW 1.0.3</span>
            <span className="w-1 h-1 rounded-full bg-black/10 hidden sm:inline-block"></span>
            <span>UPTIME 4d 12h</span>
            <span className="w-1 h-1 rounded-full bg-black/10 hidden sm:inline-block"></span>
            <span>65W</span>
          </div>

        </div>
      </div>
    </div>
  );
};

