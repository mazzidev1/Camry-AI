import React, { useState } from 'react';
import { useAppContext, AVAILABLE_MODELS, Model } from '../store/AppContext';
import { CustomSelect } from '../components/CustomSelect';
import { Box, ChevronDown, Download, Heart, Columns, X, Cpu, Scale, Check as CheckIcon, ShieldCheck, Zap, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Detailed technical specifications dictionary for model comparisons
const MODEL_SPECS: Record<string, {
  architecture: string;
  quantization: string;
  contextWindow: string;
  recommendedVram: string;
  npuLatency: string;
  license: string;
  powerDraw: string;
  kvCacheType: string;
}> = {
  'gpt-oss-120b': {
    architecture: 'Dense Transformer (MoE)',
    quantization: 'Q4_K_M (4-bit)',
    contextWindow: '128,000 tokens',
    recommendedVram: '64.0 GB VRAM',
    npuLatency: '14.2 ms / token',
    license: 'Apache 2.0 (Open Source)',
    powerDraw: '185 Watts',
    kvCacheType: 'FlashAttention-3 FP8'
  },
  'Qwen3-30B-Thinking-2507': {
    architecture: 'CoT Reasoning Transformer',
    quantization: 'Q8_0 (8-bit High Precision)',
    contextWindow: '64,000 tokens',
    recommendedVram: '24.0 GB VRAM',
    npuLatency: '8.4 ms / token',
    license: 'Qwen Community License',
    powerDraw: '110 Watts',
    kvCacheType: 'PagedAttention v2'
  },
  'Qwen3-Coder-30B': {
    architecture: 'Code-Specialized Transformer',
    quantization: 'Q5_K_S (5-bit)',
    contextWindow: '32,000 tokens',
    recommendedVram: '22.0 GB VRAM',
    npuLatency: '7.8 ms / token',
    license: 'Apache 2.0 (Open Source)',
    powerDraw: '105 Watts',
    kvCacheType: 'PagedAttention v2'
  },
  'Qwen3-30B-Instruct-2507': {
    architecture: 'Instruction-Tuned Transformer',
    quantization: 'Q4_K_M (4-bit)',
    contextWindow: '32,000 tokens',
    recommendedVram: '20.0 GB VRAM',
    npuLatency: '7.2 ms / token',
    license: 'Qwen Community License',
    powerDraw: '100 Watts',
    kvCacheType: 'Standard FP16 Cache'
  },
  'gpt-oss-20b': {
    architecture: 'Compact Dense Transformer',
    quantization: 'Q8_0 (8-bit)',
    contextWindow: '16,000 tokens',
    recommendedVram: '14.0 GB VRAM',
    npuLatency: '5.1 ms / token',
    license: 'Apache 2.0 (Open Source)',
    powerDraw: '65 Watts',
    kvCacheType: 'Standard FP16 Cache'
  },
  'Image-Creating Realistic': {
    architecture: 'Latent Diffusion Backbone',
    quantization: 'FP16 Half-Precision',
    contextWindow: '77 Clip Tokens',
    recommendedVram: '12.0 GB VRAM',
    npuLatency: '1.4 s / image',
    license: 'OpenRAIL-M Permissive',
    powerDraw: '140 Watts',
    kvCacheType: 'Cross-Attention Buffer'
  },
  'Z-Image-Turbo': {
    architecture: 'Flow-Matching Distilled Diffusion',
    quantization: 'INT8 Tensor Cores',
    contextWindow: '77 Clip Tokens',
    recommendedVram: '10.0 GB VRAM',
    npuLatency: '0.6 s / image',
    license: 'Apache 2.0 (Open Source)',
    powerDraw: '120 Watts',
    kvCacheType: 'Cross-Attention Buffer'
  },
  'Qwen3-8B': {
    architecture: 'Lightweight Edge Transformer',
    quantization: 'Q4_K_M (4-bit Ultra Fast)',
    contextWindow: '32,000 tokens',
    recommendedVram: '6.0 GB VRAM',
    npuLatency: '3.2 ms / token',
    license: 'Apache 2.0 (Open Source)',
    powerDraw: '35 Watts',
    kvCacheType: 'Compressed INT4 Cache'
  }
};

export const ModelStore: React.FC = () => {
  const { installedModels, installModel, loadedModel, showToast } = useAppContext();
  const [tab, setTab] = useState<'all' | 'owned'>('all');
  const [paramLimit, setParamLimit] = useState(128); // 0 to 128
  
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [typeFilter, setTypeFilter] = useState('All Types');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [trendSort, setTrendSort] = useState('Trend');
  const [showTrendDropdown, setShowTrendDropdown] = useState(false);

  // Model Comparison Feature State
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [modelAId, setModelAId] = useState<string>('gpt-oss-120b');
  const [modelBId, setModelBId] = useState<string>('Qwen3-30B-Thinking-2507');

  const openCompareWithModel = (id: string) => {
    if (id !== modelAId) {
      setModelBId(id);
    } else {
      setModelBId(AVAILABLE_MODELS.find(m => m.id !== id)?.id || 'gpt-oss-20b');
    }
    setIsCompareOpen(true);
    showToast('Loaded side-by-side model technical comparison', 'info', 'MODEL COMPARISON');
  };

  const handleDownload = (id: string) => {
    setDownloading(id);
    setDownloadProgress(0);
    
    let currentProgress = 0;
    // Simulate download
    const interval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setDownloadProgress(100);
        installModel(id);
        setDownloading(null);
        showToast(`Model artifact ${id} downloaded & verified on local storage`, 'task_complete', 'MODEL INSTALLED');
      } else {
        setDownloadProgress(currentProgress);
      }
    }, 200);
  };

  let filteredModels = AVAILABLE_MODELS.filter(m => {
    if (tab === 'owned' && !installedModels.includes(m.id)) return false;
    const paramsVal = parseInt(m.params.replace('B', ''));
    if (paramsVal > paramLimit) return false;
    if (typeFilter !== 'All Types' && m.type !== typeFilter) return false;
    return true;
  });

  filteredModels.sort((a, b) => {
    if (trendSort === 'Downloads') return b.downloads - a.downloads;
    if (trendSort === 'Likes') return b.likes - a.likes;
    return 0;
  });

  const modelA = AVAILABLE_MODELS.find(m => m.id === modelAId) || AVAILABLE_MODELS[0];
  const modelB = AVAILABLE_MODELS.find(m => m.id === modelBId) || AVAILABLE_MODELS[1];

  const specA = MODEL_SPECS[modelA.id] || MODEL_SPECS['gpt-oss-120b'];
  const specB = MODEL_SPECS[modelB.id] || MODEL_SPECS['Qwen3-30B-Thinking-2507'];

  return (
    <div className="flex-1 h-full flex flex-col bg-camry-paper overflow-hidden relative">
      {/* Header */}
      <div className="p-4 sm:p-8 pb-4 border-b border-black/5 bg-camry-paper/50 z-10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Box className="text-camry-blackout" size={24} />
            <h1 className="text-xl sm:text-2xl font-bricolage text-camry-blackout">Model Store</h1>
          </div>

          <button 
            onClick={() => setIsCompareOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-camry-blackout text-white rounded-lg text-xs font-martian hover:bg-camry-graphite transition-all shadow-sm w-fit"
          >
            <Columns size={15} className="text-camry-carrier" />
            <span>Compare Models</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-camry-graphite/5 p-1 rounded-lg">
              <button 
                onClick={() => setTab('all')}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${tab === 'all' ? 'bg-white shadow-sm text-camry-blackout' : 'text-camry-graphite/60'}`}
              >
                All
              </button>
              <button 
                onClick={() => setTab('owned')}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${tab === 'owned' ? 'bg-white shadow-sm text-camry-blackout' : 'text-camry-graphite/60'}`}
              >
                Owned
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-martian text-[10px] sm:text-xs text-camry-graphite/60">PARAMS:</span>
              <input 
                type="range" 
                min="0" 
                max="128" 
                value={paramLimit}
                onChange={(e) => setParamLimit(parseInt(e.target.value))}
                className="w-24 sm:w-32 accent-camry-blackout"
              />
              <span className="font-martian text-[10px] sm:text-xs w-16 sm:w-20">{paramLimit}B MAX</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 relative">
            <div className="relative">
              <button 
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="flex items-center justify-between min-w-[110px] sm:min-w-[120px] px-2.5 py-1.5 bg-white border border-black/5 rounded-md text-xs font-medium text-camry-graphite hover:bg-camry-graphite/5"
              >
                {typeFilter} <ChevronDown size={14} />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-black/10 rounded-md shadow-lg py-1 z-20">
                  {['All Types', 'Text Generation', 'Text-to-Image'].map(t => (
                    <button 
                      key={t}
                      onClick={() => { setTypeFilter(t); setShowTypeDropdown(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-camry-graphite hover:bg-camry-graphite/5"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowTrendDropdown(!showTrendDropdown)}
                className="flex items-center justify-between min-w-[90px] sm:min-w-[100px] px-2.5 py-1.5 bg-white border border-black/5 rounded-md text-xs font-medium text-camry-graphite hover:bg-camry-graphite/5"
              >
                {trendSort} <ChevronDown size={14} />
              </button>
              {showTrendDropdown && (
                <div className="absolute top-full right-0 mt-1 w-full bg-white border border-black/10 rounded-md shadow-lg py-1 z-20">
                  {['Trend', 'Downloads', 'Likes'].map(t => (
                    <button 
                      key={t}
                      onClick={() => { setTrendSort(t); setShowTrendDropdown(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-camry-graphite hover:bg-camry-graphite/5"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-4">
        <div className="space-y-3 max-w-4xl mx-auto">
          <AnimatePresence>
            {filteredModels.map(m => {
              const isOwned = installedModels.includes(m.id);
              const isDownloading = downloading === m.id;
              
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={m.id} 
                  className="bg-white border border-black/5 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-camry-graphite/5 flex items-center justify-center flex-shrink-0">
                      <Box size={20} className="text-camry-graphite/70" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h3 className="font-martian font-semibold text-camry-blackout text-xs sm:text-sm mb-0.5 truncate">{m.name}</h3>
                      <div className="font-martian text-[10px] text-camry-graphite/50 flex flex-wrap items-center gap-1.5">
                        <span>{m.type}</span>
                        <span>•</span>
                        <span>{m.params}</span>
                        <span>•</span>
                        <span>{m.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5">
                    <div className="flex items-center gap-3 text-camry-graphite/40 font-martian text-xs">
                      <div className="flex items-center gap-1"><Download size={13} /> {m.downloads}</div>
                      <div className="flex items-center gap-1"><Heart size={13} /> {m.likes}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openCompareWithModel(m.id)}
                        className="px-2 py-1.5 border border-black/10 rounded text-xs font-martian hover:bg-camry-graphite/5 text-camry-graphite transition-colors flex items-center gap-1"
                        title="Compare specs with another model"
                      >
                        <Columns size={12} />
                        <span className="hidden xs:inline">Compare</span>
                      </button>

                      <div className="w-24 sm:w-28 flex justify-end">
                        {isDownloading ? (
                          <div className="w-full text-right">
                            <div className="font-martian text-[9px] text-camry-graphite/60 mb-0.5">DOWNLOADING...</div>
                            <div className="w-full h-1 bg-camry-graphite/10 rounded-full overflow-hidden">
                              <div className="h-full bg-camry-carrier transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
                            </div>
                          </div>
                        ) : isOwned ? (
                          <span className="font-martian text-xs text-camry-graphite/50 flex items-center gap-1">
                            <CheckIcon size={14} /> {loadedModel === m.id ? 'LOADED' : 'OWNED'}
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleDownload(m.id)}
                            className="bg-camry-blackout text-white px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium hover:bg-camry-graphite transition-colors"
                          >
                            Try
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {filteredModels.length === 0 && (
              <div className="text-center py-12 text-camry-graphite/50 font-martian text-sm">
                NO MODELS MATCH CRITERIA
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Side-by-Side Model Technical Comparison Modal / Drawer */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-camry-paper/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-black/10 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-black/10 flex items-center justify-between bg-camry-paper/50">
                <div className="flex items-center gap-3">
                  <Columns className="text-camry-carrier flex-shrink-0" size={20} />
                  <div>
                    <h2 className="font-bricolage text-base sm:text-xl text-camry-blackout">Model Technical Comparison</h2>
                    <p className="font-martian text-[10px] sm:text-xs text-camry-graphite/60">Side-by-side hardware & spec analysis</p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsCompareOpen(false)}
                  className="p-1.5 sm:p-2 text-camry-graphite/60 hover:text-black hover:bg-black/5 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Model Selectors */}
              <div className="p-4 sm:p-6 pb-3 sm:pb-4 bg-camry-graphite/5 border-b border-black/5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <div>
                  <label className="block font-martian text-[10px] text-camry-graphite/60 uppercase tracking-widest mb-1">Model A</label>
                  <CustomSelect
                    fullWidth
                    value={modelAId}
                    onChange={(val) => setModelAId(val)}
                    options={AVAILABLE_MODELS.map(m => ({
                      value: m.id,
                      label: m.name,
                      description: `${m.params} • ${m.size}`
                    }))}
                    buttonClassName="bg-white border-black/10 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-martian text-[10px] text-camry-graphite/60 uppercase tracking-widest mb-1">Model B</label>
                  <CustomSelect
                    fullWidth
                    value={modelBId}
                    onChange={(val) => setModelBId(val)}
                    options={AVAILABLE_MODELS.map(m => ({
                      value: m.id,
                      label: m.name,
                      description: `${m.params} • ${m.size}`
                    }))}
                    buttonClassName="bg-white border-black/10 rounded-lg"
                  />
                </div>
              </div>

              {/* Specs Comparison Table in Martian Mono */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 font-martian text-xs">
                <SpecComparisonRow 
                  label="Model Identifier" 
                  valueA={modelA.name} 
                  valueB={modelB.name} 
                  highlight
                />
                <SpecComparisonRow 
                  label="Category / Type" 
                  valueA={modelA.type} 
                  valueB={modelB.type} 
                />
                <SpecComparisonRow 
                  label="Parameter Count" 
                  valueA={modelA.params} 
                  valueB={modelB.params} 
                  highlight
                />
                <SpecComparisonRow 
                  label="Architecture" 
                  valueA={specA.architecture} 
                  valueB={specB.architecture} 
                />
                <SpecComparisonRow 
                  label="Quantization Format" 
                  valueA={specA.quantization} 
                  valueB={specB.quantization} 
                />
                <SpecComparisonRow 
                  label="Context Window" 
                  valueA={specA.contextWindow} 
                  valueB={specB.contextWindow} 
                  highlight
                />
                <SpecComparisonRow 
                  label="Recommended VRAM" 
                  valueA={specA.recommendedVram} 
                  valueB={specB.recommendedVram} 
                />
                <SpecComparisonRow 
                  label="NPU Inference Latency" 
                  valueA={specA.npuLatency} 
                  valueB={specB.npuLatency} 
                  highlight
                />
                <SpecComparisonRow 
                  label="On-Prem Power Draw" 
                  valueA={specA.powerDraw} 
                  valueB={specB.powerDraw} 
                />
                <SpecComparisonRow 
                  label="KV Cache Manager" 
                  valueA={specA.kvCacheType} 
                  valueB={specB.kvCacheType} 
                />
                <SpecComparisonRow 
                  label="Storage Size" 
                  valueA={modelA.size} 
                  valueB={modelB.size} 
                />
                <SpecComparisonRow 
                  label="Software License" 
                  valueA={specA.license} 
                  valueB={specB.license} 
                />
                <SpecComparisonRow 
                  label="Community Downloads" 
                  valueA={`${modelA.downloads} verified runs`} 
                  valueB={`${modelB.downloads} verified runs`} 
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-black/10 bg-camry-paper/50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsCompareOpen(false)}
                  className="px-4 py-2 bg-camry-blackout text-white text-xs font-martian rounded-lg hover:bg-camry-graphite transition-colors"
                >
                  Close Comparison
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Extracted Helper Component for Spec Row
const SpecComparisonRow = ({ label, valueA, valueB, highlight = false }: { label: string, valueA: string, valueB: string, highlight?: boolean }) => {
  return (
    <div className={`p-3 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-2 ${
      highlight ? 'bg-camry-carrier/5 border-camry-carrier/20' : 'bg-white border-black/5'
    }`}>
      <div className="w-full md:w-1/3 font-martian text-[11px] font-medium text-camry-graphite/60 uppercase tracking-wider">
        {label}
      </div>
      <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
        <div className="font-martian text-xs text-camry-blackout font-medium bg-black/5 p-2 rounded border border-black/5 truncate">
          {valueA}
        </div>
        <div className="font-martian text-xs text-camry-blackout font-medium bg-black/5 p-2 rounded border border-black/5 truncate">
          {valueB}
        </div>
      </div>
    </div>
  );
};

// Extracted Check icon component to avoid missing import
const Check = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>
);
