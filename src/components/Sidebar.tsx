import React from 'react';
import { useAppContext, AVAILABLE_AGENTS } from '../store/AppContext';
import { PanelLeft, PanelLeftClose, Battery, BatteryCharging, BatteryLow, GraduationCap, Settings } from 'lucide-react';
import { CamryLogo } from './CamryLogo';
import { Tooltip } from './Tooltip';
import { AnimatedIcon } from './AnimatedIcon';
import { FillIcon, FillIconType } from './SolidFillIcons';
import { AgentLogo } from './AgentLogo';

export const Sidebar: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    installedAgents, 
    setActiveAgent,
    activeAgent,
    batteryLevel,
    isCharging,
    powerStage,
    cyclePowerStage,
    setIsMobileMenuOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    startTour,
    themeMode,
    setSettingsView
  } = useAppContext();

  const handleNav = (screen: any, agentId: string | null = null) => {
    setActiveAgent(agentId);
    if (screen === 'dashboard') {
      setCurrentScreen('settings');
      setSettingsView('analytics');
    } else {
      setCurrentScreen(screen);
    }
    setIsMobileMenuOpen(false);
  };

  const isLight = themeMode === 'light';

  // Power stage configuration & dynamic color styling
  const getPowerStageDetails = () => {
    switch (powerStage) {
      case 'turbo':
        return {
          label: `FULL · 185W TURBO`,
          shortLabel: 'FULL PWR',
          colorClass: isLight 
            ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold' 
            : 'bg-emerald-950/90 text-emerald-300 border-emerald-600/80 font-bold',
          badgeClass: 'bg-emerald-600 text-white'
        };
      case 'performance':
        return {
          label: `HIGH · 110W PERF`,
          shortLabel: 'HIGH PWR',
          colorClass: isLight 
            ? 'bg-sky-100 text-sky-900 border-sky-400 font-bold' 
            : 'bg-sky-950/90 text-sky-300 border-sky-600/80 font-bold',
          badgeClass: 'bg-sky-600 text-white'
        };
      case 'balanced':
        return {
          label: `MEDIUM · 65W BALANCED`,
          shortLabel: 'MED PWR',
          colorClass: isLight 
            ? 'bg-amber-100 text-amber-950 border-amber-400 font-bold' 
            : 'bg-amber-950/90 text-amber-300 border-amber-600/80 font-bold',
          badgeClass: 'bg-amber-600 text-white'
        };
      case 'eco':
      default:
        return {
          label: `LOW · 35W ECO`,
          shortLabel: 'LOW PWR',
          colorClass: isLight 
            ? 'bg-rose-100 text-rose-950 border-rose-400 font-bold animate-pulse' 
            : 'bg-rose-950/90 text-rose-300 border-rose-600/80 font-bold animate-pulse',
          badgeClass: 'bg-rose-600 text-white'
        };
    }
  };

  const powerDetails = getPowerStageDetails();

  return (
    <div className={`${
      isSidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
    } flex-shrink-0 flex flex-col h-full border-r border-t-0 border-b-0 border-l-0 pt-4 pb-4 transition-all duration-300 camry-glass rounded-none ${
      isLight 
        ? 'text-zinc-800/80 border-[#E2DDD5]' 
        : 'text-white/60 border-white/10'
    }`}>
      
      {/* Top Header: Brand Identity & Collapse Icon aligned horizontally */}
      <div className={`flex ${
        isSidebarCollapsed ? 'flex-col items-center gap-4' : 'items-center justify-between px-4'
      } mb-6 pb-4 border-b ${
        isLight ? 'border-[#E2DDD5]' : 'border-white/10'
      }`}>
        {isSidebarCollapsed ? (
          <CamryLogo variant={isLight ? 'dark' : 'light'} size="sm" useMascot={false} layout="markOnly" />
        ) : (
          <CamryLogo variant={isLight ? 'dark' : 'light'} size="md" />
        )}
        <Tooltip content={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"} position="right">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            className={`transition-colors p-1.5 rounded-lg cursor-pointer ${
              isLight 
                ? 'text-[#18181B]/40 hover:text-[#18181B] hover:bg-black/5' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <AnimatedIcon type="rotate">
              {isSidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
            </AnimatedIcon>
          </button>
        </Tooltip>
      </div>

      <div className={`flex-1 overflow-y-auto space-y-6 scrollbar-none ${
        isSidebarCollapsed ? 'px-2' : 'px-3'
      }`}>
        
        {/* Main Navigation */}
        <div className={`space-y-1.5 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
          <NavItem 
            iconName="chat" 
            label="Chat" 
            tooltip="Chat & Local AI Workspace"
            isActive={currentScreen === 'chat' && !activeAgent}
            isLight={isLight}
            isCollapsed={isSidebarCollapsed}
            onClick={() => handleNav('chat', null)}
          />
          <NavItem 
            iconName="knowledge" 
            label="Knowledge Base" 
            tooltip="Knowledge Base & Vector Index"
            isActive={currentScreen === 'knowledgeBase'}
            isLight={isLight}
            isCollapsed={isSidebarCollapsed}
            onClick={() => handleNav('knowledgeBase')}
          />
          <NavItem 
            iconName="library" 
            label="Library" 
            tooltip="Generated Files & Documents Library"
            isActive={currentScreen === 'library'}
            isLight={isLight}
            isCollapsed={isSidebarCollapsed}
            onClick={() => handleNav('library')}
          />
          <NavItem 
            iconName="companyAgents" 
            label="Company AI Agents" 
            tooltip="Deploy & Manage Company AI Agents"
            isActive={currentScreen === 'companyAgents'}
            isLight={isLight}
            isCollapsed={isSidebarCollapsed}
            onClick={() => handleNav('companyAgents')}
          />

        </div>

        {/* Getting Started Tour Button */}
        <div className={isSidebarCollapsed ? "flex justify-center" : "px-1"}>
          <Tooltip content="Launch Guided Tour overlay of Camry OS features" position="right" className={isSidebarCollapsed ? "" : "w-full"}>
            <button
              onClick={() => startTour()}
              className={`flex items-center transition-all cursor-pointer shadow-sm group border ${
                isSidebarCollapsed 
                  ? 'w-10 h-10 justify-center p-0 rounded-xl' 
                  : 'w-full gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold'
              } ${
                isLight 
                  ? 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-sky-500/10 hover:text-sky-600 hover:border-sky-500/20' 
                  : 'bg-white/5 border-white/10 text-white/90 hover:bg-sky-500/15 hover:text-sky-400 hover:border-sky-500/20'
              }`}
            >
              <AnimatedIcon type="scale" className={`${isLight ? 'text-sky-500' : 'text-sky-400'} group-hover:scale-110 transition-transform`}>
                <GraduationCap size={16} />
              </AnimatedIcon>
              {!isSidebarCollapsed && <span className="truncate">Getting Started Tour</span>}
            </button>
          </Tooltip>
        </div>

        {/* My Agents */}
        <div className="space-y-2 pt-1">
          {!isSidebarCollapsed ? (
            <div className={`px-3 text-[10px] tracking-wider font-mono font-semibold uppercase ${
              isLight ? 'text-zinc-400' : 'text-white/40'
            }`}>
              MY AGENTS
            </div>
          ) : (
            <div className={`mx-auto w-8 border-b ${isLight ? 'border-zinc-200' : 'border-white/10'}`} />
          )}
          {installedAgents.length > 0 ? (
            <div className={`space-y-1.5 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
              {installedAgents.map(agentId => {
                const agent = AVAILABLE_AGENTS.find(a => a.id === agentId);
                if (!agent) return null;
                const isActive = currentScreen === 'chat' && activeAgent === agentId;
                return (
                  <Tooltip key={agentId} content={`Launch ${agent.name}`} position="right" className={isSidebarCollapsed ? "" : "w-full"}>
                    <button
                      onClick={() => handleNav('chat', agentId)}
                      className={`flex items-center transition-all cursor-pointer group border ${
                        isSidebarCollapsed 
                          ? 'w-10 h-10 justify-center p-0 rounded-xl' 
                          : 'w-full gap-2.5 px-2.5 py-1.5 rounded-xl text-xs'
                      } ${
                        isActive 
                          ? 'bg-sky-500 text-white font-semibold border-sky-600 shadow-md shadow-sky-500/25'
                          : isLight
                            ? 'hover:bg-sky-500/10 hover:text-sky-600 border-transparent text-zinc-700'
                            : 'hover:bg-sky-500/15 hover:text-sky-400 border-transparent text-white/70'
                      }`}
                    >
                      <AgentLogo agentId={agent.id} name={agent.name} size={20} className="shrink-0" />
                      {!isSidebarCollapsed && <span className="truncate">{agent.name}</span>}
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          ) : (
            !isSidebarCollapsed && (
              <div className={`px-3 py-2 text-xs border border-dashed rounded-xl mx-3 font-mono text-[11px] ${
                isLight ? 'text-zinc-400 border-[#E2DDD5]' : 'text-white/30 border-white/10'
              }`}>
                No agents installed
              </div>
            )
          )}
        </div>
      </div>

      {/* Lower Nav */}
      <div className={`space-y-1.5 mt-auto pb-4 flex flex-col items-center ${isSidebarCollapsed ? 'px-2' : 'px-3'}`}>
        <NavItem 
          iconName="agentStore" 
          label="Agent Store" 
          tooltip="Browse & Install Agent Workflows"
          isActive={currentScreen === 'agentStore'}
          isLight={isLight}
          isCollapsed={isSidebarCollapsed}
          onClick={() => handleNav('agentStore')}
        />
        <NavItem 
          iconName="modelStore" 
          label="Model Store" 
          tooltip="Manage Local LLM Weights & NPU"
          isActive={currentScreen === 'modelStore'}
          isLight={isLight}
          isCollapsed={isSidebarCollapsed}
          onClick={() => handleNav('modelStore')}
        />
      </div>

      {/* Profile, Status & Battery Rail Component */}
      <div className={`space-y-3 ${isSidebarCollapsed ? 'px-2' : 'px-3'}`}>
        {/* Persistent Power Indicator with Power Stage Color Shift */}
        <div className="flex justify-center">
          <Tooltip content={`Power Stage: ${powerDetails.label} · Click to toggle power stage`} position="right" className={isSidebarCollapsed ? "" : "w-full"}>
            <button 
              onClick={cyclePowerStage}
              className={`flex items-center transition-all cursor-pointer ${
                isSidebarCollapsed 
                  ? 'w-10 h-10 justify-center p-0 rounded-xl border' 
                  : 'w-full justify-between px-3 py-2 rounded-xl border'
              } ${powerDetails.colorClass}`}
            >
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold">
                <AnimatedIcon type="bounce">
                  {isCharging ? (
                    <BatteryCharging size={16} />
                  ) : powerStage === 'eco' ? (
                    <BatteryLow size={16} />
                  ) : (
                    <Battery size={16} />
                  )}
                </AnimatedIcon>
                {!isSidebarCollapsed && <span>{batteryLevel}% PWR</span>}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider font-extrabold">
                  <span>{powerDetails.shortLabel}</span>
                </div>
              )}
            </button>
          </Tooltip>
        </div>

        {/* Profile Settings Section - Fixed High-Contrast Typography & Colors */}
        <div className="flex justify-center">
          <Tooltip content="Device Settings, Access & AI Metrics" position="right" className={isSidebarCollapsed ? "" : "w-full"}>
            <button 
              onClick={() => handleNav('settings')}
              className={`flex items-center transition-all cursor-pointer group border ${
                isSidebarCollapsed 
                  ? 'w-10 h-10 justify-center p-0 rounded-xl' 
                  : 'w-full gap-3 px-3.5 py-2.5 rounded-xl'
              } ${
                currentScreen === 'settings' 
                  ? (isLight 
                      ? 'bg-zinc-900 text-white border-zinc-950 shadow-md' 
                      : 'bg-sky-600 text-white font-semibold border-sky-500 shadow-md shadow-sky-500/25')
                  : (isLight 
                      ? 'bg-zinc-100/90 hover:bg-zinc-200/90 border-zinc-300 text-zinc-900' 
                      : 'bg-zinc-900/90 hover:bg-zinc-800/90 border-zinc-700/80 text-white')
              }`}
            >
              <div className={`${isSidebarCollapsed ? '' : 'w-8 h-8 rounded-lg border'} flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform shrink-0 ${
                currentScreen === 'settings'
                  ? 'bg-white/20 text-white border-white/30'
                  : isLight 
                    ? 'bg-white border-zinc-300 text-zinc-900' 
                    : 'bg-zinc-800 border-zinc-700 text-white'
              }`}>
                <Settings size={16} />
              </div>
              
              {!isSidebarCollapsed && (
                <div className="text-left min-w-0 flex-1">
                  <div className={`text-xs font-bold truncate ${
                    currentScreen === 'settings' 
                      ? 'text-white'
                      : isLight ? 'text-zinc-900' : 'text-white'
                  }`}>digitalix</div>
                  <div className={`text-[10px] font-mono truncate font-medium ${
                    currentScreen === 'settings'
                      ? 'text-white/80'
                      : isLight ? 'text-zinc-600' : 'text-zinc-400'
                  }`}>alex@nuvious.com</div>
                </div>
              )}
            </button>
          </Tooltip>
        </div>

        {/* Status indicator bar */}
        <div className={`flex items-center justify-center rounded-xl border ${
          isSidebarCollapsed ? 'w-10 h-10 p-0' : 'gap-2 px-2.5 py-1.5'
        } ${
          isLight ? 'bg-zinc-100 border-[#E2DDD5]' : 'bg-white/5 border-white/10'
        }`}>
          <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)] animate-pulse shrink-0" />
          {!isSidebarCollapsed && (
            <span className={`font-mono text-[9px] tracking-wider font-bold ${isLight ? 'text-zinc-500' : 'text-white/70'}`}>CAMRY ONLINE</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const NavItem = ({ 
  iconName, 
  label, 
  tooltip,
  isActive, 
  isLight,
  isCollapsed = false,
  onClick 
}: { 
  iconName: FillIconType, 
  label: string, 
  tooltip: string,
  isActive: boolean, 
  isLight: boolean,
  isCollapsed?: boolean,
  onClick: () => void 
}) => {
  return (
    <Tooltip content={tooltip} position="right" className={isCollapsed ? "" : "w-full"}>
      <button
        onClick={onClick}
        className={`flex items-center rounded-xl text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer group border ${
          isCollapsed ? 'w-10 h-10 justify-center p-0' : 'w-full px-4 py-2 justify-between'
        } ${
          isActive 
            ? 'bg-sky-500 text-white font-semibold border-sky-600 shadow-md shadow-sky-500/25'
            : isLight
              ? 'hover:bg-sky-500/10 hover:text-sky-600 hover:border-sky-500/20 border-transparent text-zinc-700'
              : 'hover:bg-sky-500/15 hover:text-sky-400 hover:border-sky-500/30 border-transparent text-white/70'
        }`}
      >
        <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className={`transition-transform duration-200 group-hover:scale-110 ${
            isActive 
              ? 'text-white' 
              : isLight 
                ? 'text-zinc-400 group-hover:text-sky-600' 
                : 'text-zinc-400 group-hover:text-sky-400'
          }`}>
            <FillIcon name={iconName} size={18} />
          </div>
          {!isCollapsed && <span className="font-medium truncate">{label}</span>}
        </div>

        {/* Active state brand indicator dot */}
        {isActive && !isCollapsed && (
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            isLight ? 'bg-white' : 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]'
          }`} />
        )}
      </button>
    </Tooltip>
  );
};
