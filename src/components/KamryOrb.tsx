import React from 'react';
import { motion } from 'motion/react';

interface KamryOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  interactive?: boolean;
  useMascot?: boolean;
}

export const KamryOrb: React.FC<KamryOrbProps> = ({
  size = 'md',
  className = '',
  interactive = true,
  useMascot = false
}) => {
  const pixelSizes = {
    sm: 24,
    md: 40,
    lg: 64,
    xl: 96
  }[size];

  const outerDimensions = {
    sm: 'w-9 h-9',
    md: 'w-14 h-14',
    lg: 'w-22 h-22',
    xl: 'w-36 h-36 md:w-44 md:h-44'
  }[size];

  const OriginalNpuCenter = (
    <svg 
      width={pixelSizes} 
      height={pixelSizes} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="z-10 drop-shadow-md select-none shrink-0"
    >
      {/* Vertical Spine of the "K" */}
      <rect x="20" y="16" width="14" height="14" rx="4" fill="#FFFFFF" />
      <rect x="20" y="34" width="14" height="14" rx="4" fill="#F59E0B" />
      <rect x="20" y="52" width="14" height="14" rx="4" fill="var(--color-kamry-brand)" />
      <rect x="20" y="70" width="14" height="14" rx="4" fill="#FFFFFF" />

      {/* Diagonal Upper Branch of the "K" */}
      <rect x="38" y="34" width="14" height="14" rx="4" fill="#FFFFFF" />
      <rect x="56" y="16" width="14" height="14" rx="4" fill="#FFFFFF" />
      <circle cx="80" cy="23" r="6" fill="var(--color-kamry-brand)" />

      {/* Diagonal Lower Branch of the "K" */}
      <rect x="38" y="52" width="14" height="14" rx="4" fill="#9CA3AF" />
      <rect x="56" y="70" width="14" height="14" rx="4" fill="#FFFFFF" />
      <circle cx="80" cy="77" r="6" fill="#FFFFFF" />

      {/* Core Junction Nodes */}
      <circle cx="45" cy="41" r="5" fill="#FFFFFF" opacity="0.8" />
      <circle cx="45" cy="59" r="5" fill="var(--color-kamry-brand)" opacity="0.8" />
    </svg>
  );

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer Ambient Grayscale Glow Effect */}
      <motion.div
        className={`absolute rounded-full bg-zinc-400 dark:bg-zinc-600 opacity-20 dark:opacity-30 blur-2xl ${outerDimensions}`}
        animate={interactive ? {
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.4, 0.2],
        } : {}}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 3D Floating Glass Ring */}
      <motion.div
        className={`relative flex items-center justify-center p-1 rounded-3xl overflow-hidden shadow-2xl ${outerDimensions}`}
        style={{
          background: 'radial-gradient(circle at 35% 30%, #71717a 0%, #18181b 60%, #09090b 100%)',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4)'
        }}
        animate={interactive ? {
          y: [-4, 4, -4],
          rotate: [0, 2, -2, 0]
        } : {}}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Top Glare Light Reflection */}
        <div 
          className="absolute top-1 left-2 w-1/2 h-1/3 rounded-full bg-gradient-to-b from-white/70 to-transparent blur-[1px] transform -rotate-12 pointer-events-none z-20" 
        />
        
        {/* Centerpiece: Original NPU Mark */}
        {OriginalNpuCenter}
      </motion.div>
    </div>
  );
};
