import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Sidebar } from './Sidebar';
import { GlobalHeader } from './GlobalHeader';
import { MessageSquare, Grid, Box, BarChart2, Settings } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    isOnboarded, 
    currentScreen, 
    setCurrentScreen, 
    setActiveAgent 
  } = useAppContext();

  const navTabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'agentStore', label: 'Agents', icon: Grid },
    { id: 'modelStore', label: 'Models', icon: Box },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleMobileNav = (screenId: string) => {
    if (screenId === 'chat') {
      setActiveAgent(null);
    }
    setCurrentScreen(screenId as any);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 bg-camry-blackout">
      <div className="w-full h-screen bg-camry-blackout overflow-hidden flex relative">
        
        {/* Desktop Nav Rail */}
        {isOnboarded && (
          <div className="hidden md:flex flex-shrink-0 h-full">
            <Sidebar />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 bg-camry-paper relative overflow-hidden flex flex-col pb-14 md:pb-0">
          {isOnboarded && <GlobalHeader />}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            {children}
          </div>
        </div>

        {/* Bottom-Anchored Mobile Tab Bar for Small Screens */}
        {isOnboarded && (
          <nav className="fixed md:hidden bottom-0 left-0 right-0 z-50 bg-camry-blackout/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentScreen === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleMobileNav(tab.id)}
                  className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all min-w-[52px] ${
                    isActive
                      ? 'text-camry-carrier bg-camry-carrier/10 font-semibold'
                      : 'text-white/60 hover:text-white/90'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-camry-carrier scale-105' : ''} />
                  <span className="text-[10px] font-martian tracking-tight mt-1">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}

      </div>
    </div>
  );
};

