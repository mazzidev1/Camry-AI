import React from 'react';
import { motion } from 'motion/react';

export interface CamryMascotProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  variant?: 'full' | 'face' | 'circle';
  animated?: boolean;
  className?: string;
  mood?: 'happy' | 'thinking' | 'active' | 'sleeping' | 'blink' | 'wink' | 'searching' | 'celebrate';
  interactive?: boolean;
}

/**
 * Camry Official Axolotl Mascot Component
 * Features the signature white axolotl face with feathery branched gills
 * on the vibrant electric brand blue background (#0066FF).
 * Includes entry animations, subtle hover tilt, and mood variants.
 */
export const CamryMascot: React.FC<CamryMascotProps> = ({
  size = 'md',
  variant = 'full',
  animated = true,
  className = '',
  mood = 'happy',
  interactive = true
}) => {
  const getPixelSize = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'xs': return 20;
      case 'sm': return 32;
      case 'md': return 44;
      case 'lg': return 64;
      case 'xl': return 96;
      case '2xl': return 140;
      default: return 44;
    }
  };

  const px = getPixelSize();

  const gillVariants = {
    idle: {
      rotate: [0, 4, -3, 0],
      scale: [1, 1.05, 0.97, 1],
    },
    thinking: {
      rotate: [-2, 6, -2],
      scale: [0.98, 1.08, 0.98]
    },
    active: {
      rotate: [-5, 5, -5],
      scale: [1, 1.1, 1]
    }
  };

  const currentGillState = mood === 'thinking' ? 'thinking' : mood === 'active' || mood === 'celebrate' ? 'active' : 'idle';

  return (
    <motion.div 
      className={`inline-flex items-center justify-center shrink-0 cursor-pointer ${className}`}
      initial={{ scale: 0.88, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={interactive ? { scale: 1.08, rotate: 2 } : undefined}
      whileTap={interactive ? { scale: 0.94 } : undefined}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
    >
      <motion.svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible select-none shrink-0"
        animate={animated ? {
          y: mood === 'active' || mood === 'celebrate' ? [-3, 3, -3] : [-2, 2, -2],
          rotate: mood === 'thinking' ? [-2, 2, -2] : 0
        } : {}}
        transition={{ duration: mood === 'active' ? 1.8 : 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Background squircle (Brand Blue #0066FF) if full variant */}
        {variant === 'full' && (
          <rect x="0" y="0" width="100" height="100" rx="22" fill="#0066FF" />
        )}
        {variant === 'circle' && (
          <circle cx="50" cy="50" r="50" fill="#0066FF" />
        )}

        {/* Celebrating confetti sparkles */}
        {mood === 'celebrate' && (
          <>
            <motion.circle cx="15" cy="18" r="3" fill="#F59E0B" animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} />
            <motion.circle cx="85" cy="18" r="3.5" fill="#10B981" animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} />
            <motion.rect x="80" y="75" width="4" height="4" rx="1" fill="#8B5CF6" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} />
            <motion.rect x="12" y="70" width="5" height="5" rx="1" fill="#F59E0B" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }} />
          </>
        )}

        {/* Searching question mark or magnifying glow */}
        {mood === 'searching' && (
          <motion.circle cx="50" cy="50" r="46" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="6 4" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} style={{ transformOrigin: '50px 50px' }} />
        )}

        {/* Main White Axolotl Head & Gills Group */}
        <g id="axolotl-body">
          {/* LEFT GILLS (3 branching frills) */}
          <motion.path
            d="M 32 38 
               C 28 32, 20 28, 22 22 
               C 24 20, 26 23, 27 26 
               C 27 22, 30 18, 33 21 
               C 35 23, 33 28, 32 32 
               C 36 28, 41 26, 42 30 
               C 42 32, 38 36, 34 38 Z"
            fill="#FFFFFF"
            animate={animated ? currentGillState : ''}
            variants={gillVariants}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '32px 38px' }}
          />
          <motion.path
            d="M 28 49 
               C 20 46, 14 40, 15 35 
               C 16 33, 19 36, 20 39 
               C 19 34, 23 31, 25 35 
               C 26 37, 24 42, 23 45 
               C 27 42, 32 42, 31 46 
               C 30 48, 26 50, 28 51 Z"
            fill="#FFFFFF"
            animate={animated ? currentGillState : ''}
            variants={gillVariants}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            style={{ transformOrigin: '28px 49px' }}
          />
          <motion.path
            d="M 29 60 
               C 22 60, 16 62, 16 67 
               C 17 69, 20 67, 22 64 
               C 21 69, 24 71, 26 68 
               C 27 66, 26 62, 27 60 
               C 30 63, 33 66, 32 68 
               C 30 70, 27 68, 29 61 Z"
            fill="#FFFFFF"
            animate={animated ? currentGillState : ''}
            variants={gillVariants}
            transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            style={{ transformOrigin: '29px 60px' }}
          />

          {/* RIGHT GILLS (3 branching frills) */}
          <motion.path
            d="M 68 38 
               C 72 32, 80 28, 78 22 
               C 76 20, 74 23, 73 26 
               C 73 22, 70 18, 67 21 
               C 65 23, 67 28, 68 32 
               C 64 28, 59 26, 58 30 
               C 58 32, 62 36, 66 38 Z"
            fill="#FFFFFF"
            animate={animated ? currentGillState : ''}
            variants={gillVariants}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
            style={{ transformOrigin: '68px 38px' }}
          />
          <motion.path
            d="M 72 49 
               C 80 46, 86 40, 85 35 
               C 84 33, 81 36, 80 39 
               C 81 34, 77 31, 75 35 
               C 74 37, 76 42, 77 45 
               C 73 42, 68 42, 69 46 
               C 70 48, 74 50, 72 51 Z"
            fill="#FFFFFF"
            animate={animated ? currentGillState : ''}
            variants={gillVariants}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            style={{ transformOrigin: '72px 49px' }}
          />
          <motion.path
            d="M 71 60 
               C 78 60, 84 62, 84 67 
               C 83 69, 80 67, 78 64 
               C 79 69, 76 71, 74 68 
               C 73 66, 74 62, 73 60 
               C 70 63, 67 66, 68 68 
               C 70 70, 73 68, 71 61 Z"
            fill="#FFFFFF"
            animate={animated ? currentGillState : ''}
            variants={gillVariants}
            transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{ transformOrigin: '71px 60px' }}
          />

          {/* MAIN HEAD (Smooth round axolotl head) */}
          <ellipse cx="50" cy="54" rx="27" ry="20" fill="#FFFFFF" />

          {/* EYES */}
          {(mood === 'happy' || mood === 'celebrate') && (
            <>
              {/* Left Eye: u */}
              <path
                d="M 33 50 C 33 60, 44 60, 44 50"
                stroke="#0066FF"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Eye: u */}
              <path
                d="M 56 50 C 56 60, 67 60, 67 50"
                stroke="#0066FF"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {mood === 'thinking' && (
            <>
              {/* Curious eyes: dot and circle */}
              <circle cx="38.5" cy="52" r="3.5" fill="#0066FF" />
              <circle cx="61.5" cy="50" r="4.5" fill="#0066FF" />
              {/* Thinking spark above right eye */}
              <motion.circle 
                cx="70" cy="38" r="2.5" fill="#F59E0B" 
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
            </>
          )}

          {mood === 'active' && (
            <>
              {/* Active eyes: wide happy glowing arcs */}
              <circle cx="38" cy="51" r="4" fill="#0066FF" />
              <circle cx="62" cy="51" r="4" fill="#0066FF" />
              <circle cx="40" cy="49" r="1.5" fill="#FFFFFF" />
              <circle cx="64" cy="49" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {mood === 'sleeping' && (
            <>
              {/* Closed relaxed eyes: u u */}
              <path d="M 34 53 Q 38.5 57 43 53" stroke="#0066FF" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 57 53 Q 61.5 57 66 53" stroke="#0066FF" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Floating Zzz */}
              <motion.text
                x="68"
                y="34"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="bold"
                fontFamily="sans-serif"
                animate={{ opacity: [0, 1, 0], y: [34, 26, 20] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
              >
                z
              </motion.text>
            </>
          )}

          {mood === 'searching' && (
            <>
              {/* Big curious eyes looking around */}
              <motion.g
                animate={{ x: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <circle cx="38" cy="51" r="4.5" fill="#0066FF" />
                <circle cx="62" cy="51" r="4.5" fill="#0066FF" />
                <circle cx="39.5" cy="49.5" r="1.5" fill="#FFFFFF" />
                <circle cx="63.5" cy="49.5" r="1.5" fill="#FFFFFF" />
              </motion.g>
            </>
          )}

          {mood === 'wink' && (
            <>
              <path d="M 33 50 C 33 60, 44 60, 44 50" stroke="#0066FF" strokeWidth="4" strokeLinecap="round" fill="none" />
              <line x1="56" y1="54" x2="67" y2="54" stroke="#0066FF" strokeWidth="4" strokeLinecap="round" />
            </>
          )}

          {/* HAPPY SMILE (Electric blue curve ◡) */}
          <path
            d={mood === 'thinking' ? "M 46 64 C 48 66, 52 66, 54 64" : "M 46 64 C 46 68, 54 68, 54 64"}
            stroke="#0066FF"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </motion.svg>
    </motion.div>
  );
};
