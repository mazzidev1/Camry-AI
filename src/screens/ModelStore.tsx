import React, { useState } from 'react';
import { useAppContext, AVAILABLE_MODELS } from '../store/AppContext';
import { Box, ChevronDown, Download, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ModelStore: React.FC = () => {
  const { installedModels, installModel, loadedModel } = useAppContext();
  const [tab, setTab] = useState<'all' | 'owned'>('all');
  const [paramLimit, setParamLimit] = useState(128); // 0 to 128
  
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [typeFilter, setTypeFilter] = useState('All Types');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [trendSort, setTrendSort] = useState('Trend');
  const [showTrendDropdown, setShowTrendDropdown] = useState(false);

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

  return (
    <div className="flex-1 h-full flex flex-col bg-camry-paper overflow-hidden">
      {/* Header */}
      <div className="p-8 pb-4 border-b border-black/5 bg-camry-paper/50 z-10">
        <div className="flex items-center gap-3 mb-6">
          <Box className="text-camry-blackout" size={24} />
          <h1 className="text-2xl font-bricolage text-camry-blackout">Model Store</h1>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex bg-camry-graphite/5 p-1 rounded-lg">
              <button 
                onClick={() => setTab('all')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'all' ? 'bg-white shadow-sm text-camry-blackout' : 'text-camry-graphite/60'}`}
              >
                All
              </button>
              <button 
                onClick={() => setTab('owned')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'owned' ? 'bg-white shadow-sm text-camry-blackout' : 'text-camry-graphite/60'}`}
              >
                Owned
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-martian text-xs text-camry-graphite/60">PARAMS:</span>
              <input 
                type="range" 
                min="0" 
                max="128" 
                value={paramLimit}
                onChange={(e) => setParamLimit(parseInt(e.target.value))}
                className="w-32 accent-camry-blackout"
              />
              <span className="font-martian text-xs w-20">{paramLimit}B MAX</span>
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            <div className="relative">
              <button 
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="flex items-center justify-between min-w-[120px] px-3 py-1.5 bg-white border border-black/5 rounded-md text-xs font-medium text-camry-graphite hover:bg-camry-graphite/5"
              >
                {typeFilter} <ChevronDown size={14} />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-black/10 rounded-md shadow-lg py-1 z-20">
                  {['All Types', 'Text', 'Code', 'Multimodal'].map(t => (
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
                className="flex items-center justify-between min-w-[100px] px-3 py-1.5 bg-white border border-black/5 rounded-md text-xs font-medium text-camry-graphite hover:bg-camry-graphite/5"
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
      <div className="flex-1 overflow-y-auto p-8 pt-4">
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
                  className="bg-white border border-black/5 rounded-xl p-4 flex items-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-camry-graphite/5 flex items-center justify-center mr-4">
                    <Box size={20} className="text-camry-graphite/70" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-martian font-semibold text-camry-blackout text-sm mb-1">{m.name}</h3>
                    <div className="font-martian text-[10px] text-camry-graphite/50 flex items-center gap-2">
                      <span>{m.type}</span>
                      <span>/</span>
                      <span>{m.params}</span>
                      <span>/</span>
                      <span>{m.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mr-6 text-camry-graphite/40 font-martian text-xs">
                    <div className="flex items-center gap-1"><Download size={14} /> {m.downloads}</div>
                    <div className="flex items-center gap-1"><Heart size={14} /> {m.likes}</div>
                  </div>

                  <div className="w-32 flex justify-end">
                    {isDownloading ? (
                      <div className="w-full text-right">
                        <div className="font-martian text-[10px] text-camry-graphite/60 mb-1">DOWNLOADING...</div>
                        <div className="w-full h-1 bg-camry-graphite/10 rounded-full overflow-hidden">
                          <div className="h-full bg-camry-carrier transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
                        </div>
                      </div>
                    ) : isOwned ? (
                      <span className="font-martian text-xs text-camry-graphite/50 flex items-center gap-1">
                        <Check size={14} /> {loadedModel === m.id ? 'LOADED' : 'OWNED'}
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleDownload(m.id)}
                        className="bg-camry-blackout text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-camry-graphite transition-colors"
                      >
                        Try
                      </button>
                    )}
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
    </div>
  );
};

// Extracted Check icon component to avoid missing import
const Check = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>
);
