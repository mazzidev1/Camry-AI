import React from 'react';
import { useAppContext, AVAILABLE_AGENTS } from '../store/AppContext';
import { MessageSquare, Grid, Box, BarChart2, PanelLeftClose, Battery, BatteryCharging, BatteryLow, Zap } from 'lucide-react';
import { CamryLogo } from './CamryLogo';

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
    showToast
  } = useAppContext();

  const handleNav = (screen: any, agentId: string | null = null) => {
    setActiveAgent(agentId);
    setCurrentScreen(screen);
    setIsMobileMenuOpen(false);
  };

  // Color logic for battery
  const getBatteryColorClass = () => {
    if (batteryLevel > 50) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (batteryLevel > 20) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/30 animate-pulse';
  };

  return (
    <div className="w-[240px] flex-shrink-0 flex flex-col h-full bg-camry-blackout text-white/60 font-familjen pt-4 pb-4">
      
      {/* Top Header: Brand Identity & Collapse Icon aligned horizontally at the top */}
      <div className="flex items-center justify-between px-4 mb-6 pb-4 border-b border-white/10">
        <CamryLogo variant="light" size="md" />
        <button 
          onClick={() => showToast("Collapse not available in preview")} 
          className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          title="Toggle sidebar"
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-6">
        
        {/* Chat Nav */}
        <div className="space-y-1">
          <NavItem 
            icon={<MessageSquare size={18} />} 
            label="Chat" 
            isActive={currentScreen === 'chat' && !activeAgent}
            onClick={() => handleNav('chat', null)}
          />
        </div>

        {/* My Agents */}
        <div className="space-y-2 pt-2">
          <div className="px-3 text-[10px] tracking-wider text-white/40 font-martian font-medium">MY AGENTS</div>
          {installedAgents.length > 0 ? (
            <div className="space-y-1">
              {installedAgents.map(agentId => {
                const agent = AVAILABLE_AGENTS.find(a => a.id === agentId);
                if (!agent) return null;
                const isActive = currentScreen === 'chat' && activeAgent === agentId;
                return (
                  <button
                    key={agentId}
                    onClick={() => handleNav('chat', agentId)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                      ${isActive 
                        ? 'bg-camry-carrier/10 text-camry-carrier font-medium' 
                        : 'hover:bg-white/5 hover:text-white/90'
                      }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-camry-carrier' : 'bg-transparent'}`} />
                    <span className="truncate">{agent.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-3 py-2 text-xs text-white/30 border border-dashed border-white/10 rounded-lg mx-3">
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
          isActive={currentScreen === 'agentStore'}
          onClick={() => handleNav('agentStore')}
        />
        <NavItem 
          icon={<Box size={18} />} 
          label="Model Store" 
          isActive={currentScreen === 'modelStore'}
          onClick={() => handleNav('modelStore')}
        />
        <NavItem 
          icon={<BarChart2 size={18} />} 
          label="Dashboard" 
          isActive={currentScreen === 'dashboard'}
          onClick={() => handleNav('dashboard')}
        />
      </div>

      {/* Profile, Status & Battery Rail Component */}
      <div className="px-3 space-y-3">
        {/* Persistent Battery Indicator */}
        <div className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${getBatteryColorClass()}`}>
          <div className="flex items-center gap-2 font-martian text-[11px] font-semibold">
            {isCharging ? (
              <BatteryCharging size={16} />
            ) : batteryLevel <= 20 ? (
              <BatteryLow size={16} />
            ) : (
              <Battery size={16} />
            )}
            <span>{batteryLevel}% PWR</span>
          </div>
          <div className="flex items-center gap-1 font-martian text-[9px] opacity-80 uppercase tracking-widest">
            {isCharging && <Zap size={10} className="fill-current" />}
            <span>{batteryLevel <= 20 ? 'LOW POWER' : 'ON-PREM'}</span>
          </div>
        </div>

        <button 
          onClick={() => handleNav('settings')}
          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all
            ${currentScreen === 'settings' 
              ? 'bg-camry-carrier/10' 
              : 'hover:bg-white/5'
            }`}
        >
          <div className="w-8 h-8 rounded bg-camry-graphite flex items-center justify-center text-white font-medium border border-white/10">
            D
          </div>
          <div className="text-left flex-1">
            <div className={`text-sm font-medium ${currentScreen === 'settings' ? 'text-camry-carrier' : 'text-white'}`}>digitalix</div>
            <div className="text-[10px] text-white/40 font-martian">alex@nuvious.com</div>
          </div>
        </button>

        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/5 border border-white/10">
          <div className={`w-2 h-2 rounded-full ${currentScreen === 'dashboard' ? 'bg-[#27C93F]' : 'bg-camry-carrier'} shadow-[0_0_8px_rgba(155,209,255,0.4)] animate-pulse`} />
          <span className="font-martian text-[10px] text-white/70 tracking-wider">CAMRY ONLINE</span>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 active:scale-[0.98]
        ${isActive 
          ? 'bg-camry-carrier/10 text-camry-carrier font-medium border border-camry-carrier/20' 
          : 'hover:bg-white/10 hover:text-white hover:translate-x-0.5 border border-transparent'
        }`}
    >
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      <span>{label}</span>
    </button>
  );
};
