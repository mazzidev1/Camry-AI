import React, { useState, useRef, useEffect } from 'react';
import { useAppContext, AVAILABLE_MODELS } from '../store/AppContext';
import { Search, Bot, Cpu, ArrowRight, Check, Sparkles, X, Activity, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GlobalHeader: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    allAgents, 
    installedAgents, 
    activeAgent, 
    setActiveAgent,
    installedModels,
    loadedModel,
    setLoadedModel,
    installModel,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    showToast
  } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching agents & models
  const matchingAgents = searchQuery.trim() ? allAgents.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.category && a.category.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  const matchingModels = searchQuery.trim() ? AVAILABLE_MODELS.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.type.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const handleSelectAgent = (agentId: string) => {
    setActiveAgent(agentId);
    setCurrentScreen('chat');
    setSearchQuery('');
    setIsOpen(false);
    showToast(`Switched active agent`);
  };

  const handleSelectModel = (modelId: string) => {
    if (installedModels.includes(modelId)) {
      setLoadedModel(modelId);
      showToast(`Loaded model ${modelId} to NPU`);
    } else {
      installModel(modelId);
      setLoadedModel(modelId);
      showToast(`Installed & loaded ${modelId}`);
    }
    setSearchQuery('');
    setIsOpen(false);
  };

  const screenTitles: Record<string, string> = {
    chat: 'Chat & Inference',
    modelStore: 'Model Hub',
    agentStore: 'Agent Store',
    dashboard: 'System Dashboard',
    settings: 'Device Settings'
  };

  return (
    <header className="h-14 bg-white border-b border-black/5 px-3 sm:px-6 flex items-center justify-between z-30 flex-shrink-0 relative">
      {/* Left: Mobile Menu Toggle & Screen Context Indicator */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 text-camry-blackout hover:bg-black/5 rounded-lg transition-colors flex-shrink-0"
          title="Toggle Navigation Menu"
        >
          <Menu size={18} />
        </button>

        <span className="font-bricolage font-semibold text-camry-blackout text-xs sm:text-sm tracking-tight truncate">
          {screenTitles[currentScreen] || 'Camry OS'}
        </span>
      </div>

      {/* Middle: Global Search Bar */}
      <div ref={containerRef} className="relative w-36 sm:w-64 md:w-80 lg:w-96">
        <div className="relative flex items-center">
          <Search size={14} className="absolute left-3 text-camry-graphite/40 pointer-events-none" />
          <input 
            type="text"
            value={searchQuery}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Search agents, models, settings... (e.g. Legal, Qwen)"
            className="w-full pl-9 pr-8 py-1.5 bg-camry-paper/60 border border-black/10 rounded-lg text-xs font-familjen text-camry-blackout placeholder:text-camry-graphite/40 focus:outline-none focus:border-camry-deep-carrier focus:bg-white transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-camry-graphite/40 hover:text-black"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown Popover */}
        <AnimatePresence>
          {isOpen && searchQuery.trim().length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-black/10 rounded-xl shadow-2xl p-2 z-50 max-h-96 overflow-y-auto"
            >
              {/* Agents Section */}
              <div className="px-2 py-1 font-martian text-[10px] text-camry-graphite/50 tracking-wider flex items-center justify-between">
                <span>AGENTS ({matchingAgents.length})</span>
                <Bot size={12} />
              </div>

              {matchingAgents.length === 0 ? (
                <div className="px-3 py-2 text-xs text-camry-graphite/50 italic font-familjen">No matching agents</div>
              ) : (
                matchingAgents.map(agent => {
                  const isInstalled = installedAgents.includes(agent.id);
                  const isActive = activeAgent === agent.id;

                  return (
                    <div 
                      key={agent.id}
                      onClick={() => handleSelectAgent(agent.id)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-camry-graphite/5 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-camry-blackout/5 flex items-center justify-center text-camry-blackout group-hover:bg-camry-carrier/20">
                          <Bot size={14} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-camry-blackout truncate">{agent.name}</div>
                          <div className="text-[10px] text-camry-graphite/60 truncate">{agent.description}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {agent.status && (
                          <span className={`w-2 h-2 rounded-full ${
                            agent.status === 'active' ? 'bg-emerald-500 animate-pulse' :
                            agent.status === 'error' ? 'bg-red-500' : 'bg-amber-400'
                          }`} />
                        )}
                        <span className="font-martian text-[10px] bg-black/5 px-1.5 py-0.5 rounded text-camry-graphite">
                          {isActive ? 'Active' : isInstalled ? 'Launch' : 'Get'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Models Section */}
              <div className="mt-3 px-2 py-1 font-martian text-[10px] text-camry-graphite/50 tracking-wider flex items-center justify-between border-t border-black/5 pt-2">
                <span>MODELS ({matchingModels.length})</span>
                <Cpu size={12} />
              </div>

              {matchingModels.length === 0 ? (
                <div className="px-3 py-2 text-xs text-camry-graphite/50 italic font-familjen">No matching models</div>
              ) : (
                matchingModels.map(model => {
                  const isInstalled = installedModels.includes(model.id);
                  const isLoaded = loadedModel === model.id;

                  return (
                    <div 
                      key={model.id}
                      onClick={() => handleSelectModel(model.id)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-camry-graphite/5 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-camry-carrier/10 flex items-center justify-center text-camry-deep-carrier">
                          <Cpu size={14} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-camry-blackout truncate">{model.name}</div>
                          <div className="text-[10px] text-camry-graphite/60">{model.params} • {model.size}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className={`font-martian text-[10px] px-1.5 py-0.5 rounded ${
                          isLoaded ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          isInstalled ? 'bg-black/5 text-camry-blackout' : 'bg-camry-carrier/20 text-camry-deep-carrier'
                        }`}>
                          {isLoaded ? 'Loaded' : isInstalled ? 'Load NPU' : 'Install'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
