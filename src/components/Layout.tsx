import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Sidebar } from './Sidebar';
import { AnimatePresence, motion } from 'motion/react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnboarded, toastMessage } = useAppContext();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 bg-camry-blackout">
      <div className="w-full h-screen bg-camry-blackout overflow-hidden flex relative">
        
        {/* Nav Rail */}
        {isOnboarded && <Sidebar />}
        
        {/* Main Content Area */}
        <div className="flex-1 bg-camry-paper relative overflow-hidden flex flex-col">
          {children}
        </div>
        
        {/* Global Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-camry-blackout text-camry-paper px-4 py-2.5 rounded-lg shadow-xl font-martian text-xs z-50 tracking-wider flex items-center gap-3 border border-white/10"
            >
              <div className="w-2 h-2 bg-camry-carrier rounded-full shadow-[0_0_8px_rgba(155,209,255,0.6)] animate-pulse" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
