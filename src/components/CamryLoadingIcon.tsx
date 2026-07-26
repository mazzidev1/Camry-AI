import React from 'react';
import { motion } from 'motion/react';

interface CamryLoadingIconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const CamryLoadingIcon: React.FC<CamryLoadingIconProps> = ({
  size = 22,
  className = '',
  color = '#0B0C0E'
}) => {
  const blueColor = '#9BD1FF';

  return (
    <div 
      style={{ width: size, height: (size * 24) / 38 }} 
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={size}
        height={(size * 24) / 38}
        viewBox="0 0 38 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Dots */}
        <motion.circle 
          cx="3" cy="7.5" r="2.5" fill={color}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: 0 }}
        />
        <motion.circle 
          cx="3" cy="16.5" r="2.5" fill={blueColor}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.2, 0.85] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
        />

        {/* Center 3 Pill Bars */}
        <motion.rect 
          x="9" y="2" width="18" height="5" rx="2.5" fill={color}
          animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.92, 1.05, 0.92] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: 0.1 }}
        />
        <motion.rect 
          x="9" y="9.5" width="18" height="5" rx="2.5" fill={color}
          animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.92, 1.05, 0.92] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: 0.3 }}
        />
        <motion.rect 
          x="9" y="17" width="18" height="5" rx="2.5" fill={color}
          animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.92, 1.05, 0.92] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: 0.5 }}
        />

        {/* Right Dots */}
        <motion.circle 
          cx="32" cy="4.5" r="2.5" fill={color}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
        />
        <motion.circle 
          cx="32" cy="19.5" r="2.5" fill={color}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: 0.6 }}
        />
      </svg>
    </div>
  );
};
