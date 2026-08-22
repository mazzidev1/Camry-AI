import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Sidebar } from './Sidebar';
import { GlobalHeader } from './GlobalHeader';
import { GuidedTourOverlay } from './GuidedTourOverlay';
import { KamryOrb } from './KamryOrb';
import { MessageSquare, Grid, Brain, BarChart2, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    isOnboarded, 
    currentScreen, 
    setCurrentScreen, 
    setActiveAgent,
    themeMode,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useAppContext();

  const navTabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'agentStore', label: 'Agents', icon: Grid },
    { id: 'modelStore', label: 'Models', icon: Brain },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleMobileNav = (screenId: string) => {
    if (screenId === 'chat') {
      setActiveAgent(null);
    }
    setCurrentScreen(screenId as any);
  };

  const isLight = themeMode === 'light';

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 transition-colors duration-200 kamry-radial-glow relative overflow-hidden">
      {/* 3-Layer Architecture: Layer 2: Ambient Light Source (Carrier Orbs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
        <KamryOrb 
          size="xl" 
          className="absolute top-[-10%] right-[15%] opacity-20 sm:opacity-30 lg:opacity-40 filter blur-3xl pointer-events-none scale-[2.5]" 
          interactive={true} 
        />
        <KamryOrb 
          size="lg" 
          className="absolute bottom-[5%] left-[-10%] opacity-15 sm:opacity-20 filter blur-3xl pointer-events-none scale-[2]" 
          interactive={true} 
        />
      </div>

      <div className="w-full h-screen overflow-hidden flex relative bg-transparent z-10">
        
        {/* Guided Tour Modal Overlay */}
        <GuidedTourOverlay />

        {/* Desktop Nav Rail */}
        {isOnboarded && (
          <div className="hidden md:flex flex-shrink-0 h-full">
            <Sidebar />
          </div>
        )}

        {/* Mobile Slide-Out Drawer Nav Rail */}
        <AnimatePresence>
          {isOnboarded && isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[280px] z-50 md:hidden shadow-2xl flex flex-col"
              >
                <div className="absolute top-3 right-3 z-50">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40"
                  >
                    <X size={18} />
                  </button>
                </div>
                <Sidebar />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col pb-14 md:pb-0 transition-colors duration-200 bg-transparent">
          {isOnboarded && <GlobalHeader />}
          <div className="flex-1 relative overflow-hidden flex flex-col bg-transparent">
            {children}
          </div>
        </div>

        {/* Bottom-Anchored Mobile Tab Bar for Small Screens */}
        {isOnboarded && (
          <nav className={`fixed md:hidden bottom-0 left-0 right-0 z-50 px-2 py-1.5 flex items-center justify-around shadow-2xl border-t transition-colors duration-200 ${
            isLight 
              ? 'bg-white/95 border-[#E2DDD5] text-[#18181B]' 
              : 'bg-[#16161A]/95 border-white/10 text-white'
          }`}>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentScreen === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleMobileNav(tab.id)}
                  className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all min-w-[56px] border ${
                    isActive
                      ? 'text-sky-500 bg-sky-500/10 border-sky-500/20 font-semibold'
                      : 'border-transparent text-zinc-500 hover:text-black'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-sky-500 scale-105' : ''} />
                  <span className="text-[10px] font-mono tracking-tight mt-1">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}

      </div>
    </div>
  );
};

