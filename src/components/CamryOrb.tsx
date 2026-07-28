import React from 'react';
import { motion } from 'motion/react';

interface CamryOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  interactive?: boolean;
}

export const CamryOrb: React.FC<CamryOrbProps> = ({
  size = 'md',
  className = '',
  interactive = true
}) => {
  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36 md:w-44 md:h-44'
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer Ambient Glow Effect */}
      <motion.div
        className={`absolute rounded-full bg-gradient-to-r from-sky-500/30 via-blue-600/40 to-indigo-500/30 blur-2xl ${dimensions}`}
        animate={interactive ? {
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 3D Glass Sphere Body */}
      <motion.div
        className={`relative rounded-full shadow-2xl overflow-hidden ${dimensions}`}
        style={{
          background: 'radial-gradient(circle at 35% 30%, rgba(186, 230, 253, 0.95) 0%, rgba(56, 189, 248, 0.85) 25%, rgba(37, 99, 235, 0.95) 60%, rgba(15, 23, 42, 0.98) 100%)',
          boxShadow: '0 20px 40px -10px rgba(14, 165, 233, 0.4), inset 0 -12px 20px rgba(2, 132, 199, 0.6), inset 0 10px 18px rgba(255, 255, 255, 0.8)'
        }}
        animate={interactive ? {
          y: [-4, 4, -4],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Top Glare Light Reflection */}
        <div 
          className="absolute top-1 left-2 w-1/2 h-1/3 rounded-full bg-gradient-to-b from-white/90 to-transparent blur-[1px] transform -rotate-12 pointer-events-none" 
        />
        
        {/* Inner Caustic Highlight */}
        <div 
          className="absolute bottom-2 right-3 w-1/3 h-1/3 rounded-full bg-sky-300/60 blur-[3px] pointer-events-none" 
        />

        {/* Dynamic Inner Swirl Aura */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-60 mix-blend-overlay pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, transparent 70%)'
          }}
          animate={interactive ? {
            scale: [0.9, 1.1, 0.9],
            rotate: [0, 180, 360]
          } : {}}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </div>
  );
};
