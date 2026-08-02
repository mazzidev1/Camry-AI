import React from 'react';
import { motion } from 'motion/react';
import { CamryMascot } from './CamryMascot';

interface CamryOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  interactive?: boolean;
  useMascot?: boolean;
}

export const CamryOrb: React.FC<CamryOrbProps> = ({
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
      <rect x="36" y="16" width="32" height="12" rx="3" fill="#FFFFFF" />
      <circle cx="78" cy="22" r="6" fill="#FFFFFF" />
      <rect x="16" y="34" width="14" height="14" rx="3" fill="#F59E0B" />
      <circle cx="43" cy="41" r="6" fill="#FFFFFF" />
      <rect x="16" y="52" width="14" height="14" rx="3" fill="#FFFFFF" />
      <rect x="36" y="52" width="14" height="14" rx="3" fill="#8B5CF6" />
      <rect x="36" y="70" width="32" height="12" rx="3" fill="#FFFFFF" />
      <circle cx="78" cy="76" r="6" fill="#FFFFFF" />
    </svg>
  );

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer Ambient Blue Glow Effect */}
      <motion.div
        className={`absolute rounded-full bg-[#0066FF] opacity-40 blur-2xl ${outerDimensions}`}
        animate={interactive ? {
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.7, 0.35],
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
          background: 'radial-gradient(circle at 35% 30%, #3385FF 0%, #0066FF 60%, #0040A8 100%)',
          boxShadow: '0 20px 45px -10px rgba(0, 102, 255, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.6)'
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
        
        {/* Centerpiece: Mascot or Original NPU Mark */}
        {useMascot ? (
          <CamryMascot 
            size={pixelSizes * 1.3} 
            variant="full" 
            animated={interactive} 
            className="w-full h-full drop-shadow-lg z-10" 
          />
        ) : (
          OriginalNpuCenter
        )}
      </motion.div>
    </div>
  );
};
