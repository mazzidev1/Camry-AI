import React from 'react';
import { useAppContext, AVAILABLE_AGENTS } from '../store/AppContext';
import { MessageSquare, Grid, Box, BarChart2, PanelLeftClose } from 'lucide-react';
import { CamryLogo } from './CamryLogo';

export const Sidebar: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    installedAgents, 
    setActiveAgent,
    activeAgent,
    showToast
  } = useAppContext();

  return (
    <div className="w-[240px] flex-shrink-0 flex flex-col h-full bg-camry-blackout text-white/60 font-familjen pt-4 pb-4">
      
      {/* Traffic Lights & Collapse */}
      <div className="flex items-center px-4 mb-6">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
        <button onClick={() => showToast("Collapse not available in preview")} className="ml-auto text-white/40 hover:text-white transition-colors">
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* Brand Identity / Logo Header */}
      <div className="px-4 mb-6 pb-4 border-b border-white/10">
        <CamryLogo variant="light" size="md" />
        <div className="font-martian text-[9px] text-white/40 tracking-widest uppercase mt-1">
          Signal, delivered.
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-6">
        
        {/* Chat Nav */}
        <div className="space-y-1">
          <NavItem 
            icon={<MessageSquare size={18} />} 
            label="Chat" 
            isActive={currentScreen === 'chat' && !activeAgent}
            onClick={() => {
              setActiveAgent(null);
              setCurrentScreen('chat');
            }}
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
                    onClick={() => {
                      setActiveAgent(agentId);
                      setCurrentScreen('chat');
                    }}
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
      <div className="px-3 space-y-1 mt-auto pb-6">
        <NavItem 
          icon={<Grid size={18} />} 
          label="Agent Store" 
          isActive={currentScreen === 'agentStore'}
          onClick={() => setCurrentScreen('agentStore')}
        />
        <NavItem 
          icon={<Box size={18} />} 
          label="Model Store" 
          isActive={currentScreen === 'modelStore'}
          onClick={() => setCurrentScreen('modelStore')}
        />
        <NavItem 
          icon={<BarChart2 size={18} />} 
          label="Dashboard" 
          isActive={currentScreen === 'dashboard'}
          onClick={() => setCurrentScreen('dashboard')}
        />
      </div>

      {/* Profile & Status */}
      <div className="px-3">
        <button 
          onClick={() => setCurrentScreen('settings')}
          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all mb-4
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
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
        ${isActive 
          ? 'bg-camry-carrier/10 text-camry-carrier font-medium' 
          : 'hover:bg-white/5 hover:text-white/90'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
