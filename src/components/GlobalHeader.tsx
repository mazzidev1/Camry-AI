import React, { useState, useRef, useEffect } from 'react';
import { useAppContext, AVAILABLE_MODELS } from '../store/AppContext';
import { Search, Bot, Cpu, ArrowRight, Check, Sparkles, X, Activity, Menu, Sun, Moon, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomSelect } from './CustomSelect';
import { CamryOrb } from './CamryOrb';
import { CamryLogo } from './CamryLogo';
import { AgentLogo } from './AgentLogo';

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
    currentRole,
    setCurrentRole,
    themeMode,
    toggleThemeMode,
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
    chat: 'Chat',
    knowledgeBase: 'Knowledge Base',
    library: 'Library',
    team: 'Team & Access Control',
    modelStore: 'Model Hub',
    agentStore: 'Agent Store',
    dashboard: 'System Dashboard',
    settings: 'Settings'
  };

  const isLight = themeMode === 'light';

  return (
    <header className={`h-14 px-3 sm:px-6 flex items-center justify-between z-30 flex-shrink-0 relative transition-all duration-300 border-b border-t-0 border-l-0 border-r-0 camry-glass rounded-none ${
      isLight 
        ? 'text-[#18181B] border-[#E2DDD5]' 
        : 'text-white border-[#2E2E38]'
    }`}>
      {/* Left: Mobile Menu Toggle & Camry OS Logo */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-1.5 rounded-lg transition-colors flex-shrink-0 ${
            isLight ? 'hover:bg-black/5 text-[#18181B]' : 'hover:bg-white/10 text-white'
          }`}
          title="Toggle Navigation Menu"
        >
          <Menu size={18} />
        </button>

        {/* Brand Header Status Pill */}
        <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer" onClick={() => setCurrentScreen('chat')}>
          <CamryLogo variant={isLight ? 'dark' : 'light'} size="sm" useMascot={false} layout="markOnly" />
        </div>
      </div>

      {/* Middle: Global Search Bar */}
      <div ref={containerRef} className="relative flex-1 max-w-[140px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[340px] xl:max-w-[380px] mx-1.5 sm:mx-4 min-w-0">
        <div className="relative flex items-center">
          <Search size={14} className={`absolute left-3 pointer-events-none shrink-0 ${
            isLight ? 'text-zinc-400' : 'text-zinc-500'
          }`} />
          <input 
            type="text"
            value={searchQuery}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Search agents, models, documents..."
            className={`w-full pl-9 pr-8 py-1.5 rounded-xl text-xs font-sans transition-all focus:outline-none border truncate ${
              isLight 
                ? 'bg-[#F5F3EF] border-[#E2DDD5] text-[#18181B] placeholder:text-zinc-400 focus:bg-white focus:border-zinc-400' 
                : 'bg-[#0C0C0E] border-[#2E2E38] text-white placeholder:text-zinc-500 focus:bg-[#16161A] focus:border-zinc-500'
            }`}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className={`absolute right-2.5 ${isLight ? 'text-zinc-400 hover:text-black' : 'text-zinc-500 hover:text-white'}`}
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
              className={`absolute top-full left-0 right-0 mt-1.5 border rounded-2xl shadow-2xl p-2 z-50 max-h-96 overflow-y-auto ${
                isLight ? 'bg-white border-[#E2DDD5] text-[#18181B]' : 'bg-[#16161A] border-[#2E2E38] text-white'
              }`}
            >
              {/* Agents Section */}
              <div className="px-2 py-1 font-mono text-[10px] text-zinc-400 tracking-wider flex items-center justify-between">
                <span>AGENTS ({matchingAgents.length})</span>
                <Bot size={12} />
              </div>

              {matchingAgents.length === 0 ? (
                <div className="px-3 py-2 text-xs text-zinc-400 italic font-sans">No matching agents</div>
              ) : (
                matchingAgents.map(agent => {
                  const isInstalled = installedAgents.includes(agent.id);
                  const isActive = activeAgent === agent.id;

                  return (
                    <div 
                      key={agent.id}
                      onClick={() => handleSelectAgent(agent.id)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors group ${
                        isLight ? 'hover:bg-zinc-100' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <AgentLogo agentId={agent.id} name={agent.name} size={28} className="shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">{agent.name}</div>
                          <div className="text-[10px] text-zinc-400 truncate">{agent.description}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                          isLight 
                            ? 'bg-zinc-100 text-zinc-800 border-zinc-200' 
                            : 'bg-white/10 text-white border-white/10'
                        }`}>
                          {isActive ? 'Active' : isInstalled ? 'Launch' : 'Get'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Models Section */}
              <div className="mt-3 px-2 py-1 font-mono text-[10px] text-zinc-400 tracking-wider flex items-center justify-between border-t border-white/10 pt-2">
                <span>MODELS ({matchingModels.length})</span>
                <Cpu size={12} />
              </div>

              {matchingModels.length === 0 ? (
                <div className="px-3 py-2 text-xs text-zinc-400 italic font-sans">No matching models</div>
              ) : (
                matchingModels.map(model => {
                  const isInstalled = installedModels.includes(model.id);
                  const isLoaded = loadedModel === model.id;

                  return (
                    <div 
                      key={model.id}
                      onClick={() => handleSelectModel(model.id)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors group ${
                        isLight ? 'hover:bg-zinc-100' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isLight ? 'bg-zinc-100 text-zinc-700' : 'bg-white/10 text-white'
                        }`}>
                          <Cpu size={14} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">{model.name}</div>
                          <div className="text-[10px] text-zinc-400">{model.params} • {model.size}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                          isLoaded ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white'
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

      {/* Right side: Personalize Theme Switcher */}
      <div className="flex items-center gap-2.5">
        {/* Personalize Surface Toggle Switch (PDF Component 2.1) */}
        <button
          onClick={toggleThemeMode}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition-all cursor-pointer ${
            isLight 
              ? 'bg-[#EFECE6] hover:bg-[#E2DDD5] border-[#E2DDD5] text-[#18181B]' 
              : 'bg-[#202026] hover:bg-[#2E2E38] border-[#2E2E38] text-white'
          }`}
          title="Toggle surface set (Daylight / Dark)"
        >
          <span className="text-[10px] text-zinc-400 uppercase font-semibold hidden xl:inline">Personalize</span>
          {isLight ? (
            <div className="flex items-center gap-1 text-amber-600 font-medium text-[11px]">
              <Sun size={13} />
              <span>Daylight</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-zinc-200 font-medium text-[11px]">
              <Moon size={13} />
              <span>Dark</span>
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
