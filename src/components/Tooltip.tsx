import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  position = 'top', 
  children,
  delay = 150,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const t = setTimeout(() => setIsVisible(true), delay);
    setTimer(t);
  };

  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer);
    setIsVisible(false);
  };

  if (!content) return <>{children}</>;

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-camry-blackout border-x-transparent border-b-transparent border-t-4 border-x-4 border-b-0',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-camry-blackout border-x-transparent border-t-transparent border-b-4 border-x-4 border-t-0',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-camry-blackout border-y-transparent border-r-transparent border-l-4 border-y-4 border-r-0',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-camry-blackout border-y-transparent border-l-transparent border-r-4 border-y-4 border-l-0',
  };

  return (
    <div 
      className={`relative inline-flex items-center group ${className}`}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: position === 'top' ? 4 : position === 'bottom' ? -4 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className={`absolute ${positionClasses[position]} pointer-events-none px-2.5 py-1 bg-camry-blackout text-white text-[11px] font-martian font-semibold rounded-lg shadow-xl border border-white/15 whitespace-nowrap z-50`}
          >
            {content}
            <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
