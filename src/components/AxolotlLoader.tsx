import React from 'react';
import { motion } from 'motion/react';
import { CamryMascot } from './CamryMascot';

interface AxolotlLoaderProps {
  message?: string;
  subtext?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  inline?: boolean;
}

export const AxolotlLoader: React.FC<AxolotlLoaderProps> = ({
  message = "Camry NPU fetching data...",
  subtext = "Air-gapped local vector index query",
  size = 'md',
  className = '',
  inline = false
}) => {
  if (inline) {
    return (
      <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0066FF]/5 border border-[#0066FF]/15 ${className}`}>
        <CamryMascot size={22} mood="active" animated={true} />
        <span className="text-xs font-mono font-semibold text-[#0066FF] animate-pulse">
          {message}
        </span>
      </div>
    );
  }

  const mascotSize = size === 'sm' ? 44 : size === 'lg' ? 72 : 56;

  return (
    <div className={`w-full py-8 sm:py-12 px-4 flex flex-col items-center justify-center text-center ${className}`}>
      {/* Animated Axolotl Mascot Floating in Shimmer Orb */}
      <div className="relative mb-4">
        {/* Soft pulsing glow behind mascot */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-[#0066FF]/20 blur-xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        <CamryMascot 
          size={mascotSize} 
          mood="thinking" 
          variant="full" 
          animated={true}
          className="relative z-10 shadow-lg shadow-[#0066FF]/20 rounded-2xl" 
        />
      </div>

      {/* Loading Title */}
      <motion.h4 
        className="font-bricolage font-bold text-sm sm:text-base text-camry-blackout"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {message}
      </motion.h4>

      {/* Loading Shimmer Bar */}
      <div className="w-48 sm:w-64 h-1.5 bg-zinc-200 rounded-full overflow-hidden my-3 relative">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#0066FF] via-[#3385FF] to-[#0066FF] rounded-full"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {subtext && (
        <p className="text-xs text-camry-graphite/60 font-martian tracking-tight">
          {subtext}
        </p>
      )}
    </div>
  );
};
