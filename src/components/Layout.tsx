import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Sidebar } from './Sidebar';
import { GlobalHeader } from './GlobalHeader';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, Zap, BellRing } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnboarded, toastData, isMobileMenuOpen, setIsMobileMenuOpen } = useAppContext();

  const getToastBadge = () => {
    if (!toastData) return null;
    switch (toastData.type) {
      case 'warning':
        return {
          icon: <AlertTriangle size={18} className="text-amber-400 flex-shrink-0" />,
          bgColor: 'bg-amber-950/90 border-amber-500/30 text-amber-100',
          dotColor: 'bg-amber-400',
          label: toastData.title || 'THRESHOLD WARNING'
        };
      case 'task_complete':
        return {
          icon: <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />,
          bgColor: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100',
          dotColor: 'bg-emerald-400',
          label: toastData.title || 'AGENT TASK COMPLETE'
        };
      case 'success':
        return {
          icon: <Zap size={18} className="text-camry-carrier flex-shrink-0" />,
          bgColor: 'bg-camry-blackout border-camry-carrier/30 text-white',
          dotColor: 'bg-camry-carrier',
          label: toastData.title || 'SYSTEM EVENT'
        };
      default:
        return {
          icon: <BellRing size={18} className="text-camry-carrier flex-shrink-0" />,
          bgColor: 'bg-camry-blackout border-white/10 text-camry-paper',
          dotColor: 'bg-camry-carrier',
          label: toastData.title || 'CAMRY SIGNAL'
        };
    }
  };

  const toastStyle = getToastBadge();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 bg-camry-blackout">
      <div className="w-full h-screen bg-camry-blackout overflow-hidden flex relative">
        
        {/* Desktop Nav Rail */}
        {isOnboarded && (
          <div className="hidden md:flex flex-shrink-0 h-full">
            <Sidebar />
          </div>
        )}

        {/* Mobile Slide-Over Navigation Drawer */}
        <AnimatePresence>
          {isOnboarded && isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
              />
              {/* Sliding Sidebar Drawer */}
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 z-50 md:hidden w-[260px] max-w-[85vw] h-full"
              >
                <Sidebar />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Main Content Area */}
        <div className="flex-1 bg-camry-paper relative overflow-hidden flex flex-col">
          {isOnboarded && <GlobalHeader />}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            {children}
          </div>
        </div>
        
        {/* Global Toast Notification Component */}
        <AnimatePresence>
          {toastData && toastStyle && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl shadow-2xl font-martian z-50 flex items-center gap-3.5 border backdrop-blur-md max-w-md w-auto ${toastStyle.bgColor}`}
            >
              {toastStyle.icon}
              <div className="flex flex-col min-w-0 pr-1">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase opacity-80 mb-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${toastStyle.dotColor} animate-pulse`} />
                  <span>{toastStyle.label}</span>
                </div>
                <span className="text-xs font-familjen font-medium text-white/90 truncate">{toastData.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
