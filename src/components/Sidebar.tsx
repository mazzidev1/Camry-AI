import React from 'react';
import { useAppContext, AVAILABLE_AGENTS } from '../store/AppContext';
import { MessageSquare, Grid, Box, BarChart2, PanelLeftClose, Battery, BatteryCharging, BatteryLow, Zap, Layers, FileText, Sparkles } from 'lucide-react';
import { CamryLogo } from './CamryLogo';
import { Tooltip } from './Tooltip';
import { AnimatedIcon, IconAnimationType } from './AnimatedIcon';

export const Sidebar: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    installedAgents, 
    setActiveAgent,
    activeAgent,
    batteryLevel,
    isCharging,
    setIsMobileMenuOpen,
    showToast,
    startTour,
    themeMode
  } = useAppContext();

  const handleNav = (screen: any, agentId: string | null = null) => {
    setActiveAgent(agentId);
    setCurrentScreen(screen);
    setIsMobileMenuOpen(false);
  };

  const isLight = themeMode === 'light';

  // Color logic for battery based on theme and level
  const getBatteryColorClass = () => {
    if (isLight) {
      if (batteryLevel > 50) return 'text-emerald-700 bg-emerald-100 border-emerald-300';
      if (batteryLevel > 20) return 'text-amber-700 bg-amber-100 border-amber-300';
      return 'text-red-700 bg-red-100 border-red-300 animate-pulse';
    } else {
      if (batteryLevel > 50) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      if (batteryLevel > 20) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      return 'text-red-400 bg-red-500/10 border-red-500/30 animate-pulse';
    }
  };

  return (
    <div className={`w-[240px] flex-shrink-0 flex flex-col h-full border-r border-t-0 border-b-0 border-l-0 pt-4 pb-4 transition-all duration-300 camry-glass rounded-none ${
      isLight 
        ? 'text-zinc-800/80 border-[#E2DDD5]' 
        : 'text-white/60 border-white/10'
    }`}>
      
      {/* Top Header: Brand Identity & Collapse Icon aligned horizontally at the top */}
      <div className={`flex items-center justify-between px-4 mb-6 pb-4 border-b ${
        isLight ? 'border-[#E2DDD5]' : 'border-white/10'
      }`}>
        <CamryLogo variant={isLight ? 'dark' : 'light'} size="md" />
        <Tooltip content="Toggle Nav Rail" position="right">
          <button 
            onClick={() => showToast("Collapse not available in preview")} 
            className={`transition-colors p-1.5 rounded-lg cursor-pointer ${
              isLight 
                ? 'text-[#18181B]/40 hover:text-[#18181B] hover:bg-black/5' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <AnimatedIcon type="rotate">
              <PanelLeftClose size={16} />
            </AnimatedIcon>
          </button>
        </Tooltip>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-6 scrollbar-none">
        
        {/* Main Navigation */}
        <div className="space-y-1">
          <NavItem 
            icon={<MessageSquare size={18} />} 
            label="Chat" 
            tooltip="Chat & Local AI Workspace"
            animation="bounce"
            isActive={currentScreen === 'chat' && !activeAgent}
            isLight={isLight}
            onClick={() => handleNav('chat', null)}
          />
          <NavItem 
            icon={<Layers size={18} />} 
            label="Knowledge Base" 
            tooltip="Knowledge Base & Vector Index"
            animation="scale"
            isActive={currentScreen === 'knowledgeBase'}
            isLight={isLight}
            onClick={() => handleNav('knowledgeBase')}
          />
          <NavItem 
            icon={<FileText size={18} />} 
            label="Library" 
            tooltip="Artifacts & Saved Documents"
            animation="wiggle"
            isActive={currentScreen === 'library'}
            isLight={isLight}
            onClick={() => handleNav('library')}
          />
        </div>

        {/* Getting Started Tour Button */}
        <div className="px-1">
          <Tooltip content="Launch Guided Tour overlay of Camry OS features" position="right" className="w-full">
            <button
              onClick={() => startTour()}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm group border ${
                isLight 
                  ? 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100' 
                  : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'
              }`}
            >
              <AnimatedIcon type="spin" className={`${isLight ? 'text-amber-600' : 'text-amber-400'} group-hover:scale-110 transition-transform`}>
                <Sparkles size={16} />
              </AnimatedIcon>
              <span className="truncate">Getting Started Tour</span>
            </button>
          </Tooltip>
        </div>

        {/* My Agents */}
        <div className="space-y-2 pt-1">
          <div className={`px-3 text-[10px] tracking-wider font-mono font-semibold uppercase ${
            isLight ? 'text-zinc-400' : 'text-white/40'
          }`}>
            MY AGENTS
          </div>
          {installedAgents.length > 0 ? (
            <div className="space-y-1">
              {installedAgents.map(agentId => {
                const agent = AVAILABLE_AGENTS.find(a => a.id === agentId);
                if (!agent) return null;
                const isActive = currentScreen === 'chat' && activeAgent === agentId;
                return (
                  <Tooltip key={agentId} content={`Launch ${agent.name}`} position="right" className="w-full">
                    <button
                      onClick={() => handleNav('chat', agentId)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group border ${
                        isActive 
                          ? isLight
                            ? 'bg-sky-500/10 text-sky-600 font-semibold border-sky-500/20'
                            : 'bg-sky-500/20 text-sky-300 font-semibold border-sky-400/30'
                          : isLight
                            ? 'hover:bg-zinc-100 hover:text-black border-transparent'
                            : 'hover:bg-white/5 hover:text-white border-transparent'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-150 ${
                        isActive 
                          ? isLight ? 'bg-sky-600' : 'bg-sky-300' 
                          : isLight ? 'bg-zinc-300' : 'bg-white/30'
                      }`} />
                      <span className="truncate">{agent.name}</span>
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          ) : (
            <div className={`px-3 py-2 text-xs border border-dashed rounded-xl mx-3 font-mono text-[11px] ${
              isLight ? 'text-zinc-400 border-[#E2DDD5]' : 'text-white/30 border-white/10'
            }`}>
              No agents installed
            </div>
          )}
        </div>
      </div>

      {/* Lower Nav */}
      <div className="px-3 space-y-1 mt-auto pb-4">
        <NavItem 
          icon={<Grid size={18} />} 
          label="Agent Store" 
          tooltip="Browse & Install Agent Workflows"
          animation="wiggle"
          isActive={currentScreen === 'agentStore'}
          isLight={isLight}
          onClick={() => handleNav('agentStore')}
        />
        <NavItem 
          icon={<Box size={18} />} 
          label="Model Store" 
          tooltip="Manage Local LLM Weights & NPU"
          animation="pulse"
          isActive={currentScreen === 'modelStore'}
          isLight={isLight}
          onClick={() => handleNav('modelStore')}
        />
        <NavItem 
          icon={<BarChart2 size={18} />} 
          label="Dashboard" 
          tooltip="NPU Telemetry & Analytics"
          animation="lift"
          isActive={currentScreen === 'dashboard'}
          isLight={isLight}
          onClick={() => handleNav('dashboard')}
        />
      </div>

      {/* Profile, Status & Battery Rail Component */}
      <div className="px-3 space-y-3">
        {/* Persistent Battery Indicator */}
        <Tooltip content="On-Premises Power & Hardware Status" position="right" className="w-full">
          <div className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${getBatteryColorClass()}`}>
            <div className="flex items-center gap-2 font-mono text-[10px] font-semibold">
              <AnimatedIcon type="bounce">
                {isCharging ? (
                  <BatteryCharging size={16} />
                ) : batteryLevel <= 20 ? (
                  <BatteryLow size={16} />
                ) : (
                  <Battery size={16} />
                )}
              </AnimatedIcon>
              <span>{batteryLevel}% PWR</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[8px] opacity-80 uppercase tracking-widest font-bold">
              {isCharging && <Zap size={10} className="fill-current" />}
              <span>{batteryLevel <= 20 ? 'LOW POWER' : 'ON-PREM'}</span>
            </div>
          </div>
        </Tooltip>

        <Tooltip content="Device Settings, Access & AI Metrics" position="right" className="w-full">
          <button 
            onClick={() => handleNav('settings')}
            className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer group border ${
              currentScreen === 'settings' 
                ? isLight
                  ? 'bg-sky-500/10 border-sky-500/20'
                  : 'bg-sky-500/20 border border-sky-400/30'
                : 'border-transparent'
            } ${isLight ? 'hover:bg-zinc-100' : 'hover:bg-white/5'}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border group-hover:scale-105 transition-transform ${
              isLight 
                ? 'bg-[#EFECE6] border-[#E2DDD5] text-zinc-800' 
                : 'bg-zinc-800 border-white/10 text-white'
            }`}>
              D
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className={`text-xs font-semibold truncate ${
                currentScreen === 'settings' 
                  ? 'text-sky-500' 
                  : isLight ? 'text-zinc-800' : 'text-white'
              }`}>digitalix</div>
              <div className={`text-[10px] font-mono truncate ${isLight ? 'text-zinc-400' : 'text-white/40'}`}>alex@nuvious.com</div>
            </div>
          </button>
        </Tooltip>

        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border ${
          isLight ? 'bg-zinc-100 border-[#E2DDD5]' : 'bg-white/5 border-white/10'
        }`}>
          <div className={`w-2 h-2 rounded-full ${currentScreen === 'dashboard' ? 'bg-[#27C93F]' : 'bg-sky-400'} shadow-[0_0_8px_rgba(56,189,248,0.5)] animate-pulse`} />
          <span className={`font-mono text-[9px] tracking-wider font-bold ${isLight ? 'text-zinc-500' : 'text-white/70'}`}>CAMRY ONLINE</span>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ 
  icon, 
  label, 
  tooltip,
  animation = 'scale',
  isActive, 
  isLight,
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  tooltip: string,
  animation?: IconAnimationType,
  isActive: boolean, 
  isLight: boolean,
  onClick: () => void 
}) => {
  return (
    <Tooltip content={tooltip} position="right" className="w-full">
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer group border ${
          isActive 
            ? isLight
              ? 'bg-sky-500/10 text-sky-600 font-semibold border-sky-500/20'
              : 'bg-sky-500/20 text-sky-300 font-semibold border-sky-400/30' 
            : isLight
              ? 'hover:bg-zinc-100 hover:text-black border-transparent text-zinc-700'
              : 'hover:bg-white/10 hover:text-white border-transparent text-white/70'
        }`}
      >
        <AnimatedIcon type={animation} className={isActive ? isLight ? 'text-sky-600' : 'text-sky-300' : isLight ? 'text-zinc-400 group-hover:text-black' : 'text-white/60 group-hover:text-white'}>
          {icon}
        </AnimatedIcon>
        <span className="font-medium">{label}</span>
      </button>
    </Tooltip>
  );
};
