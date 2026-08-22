import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';

interface KamryLoadingIconProps {
  size?: number;
  className?: string;
  color?: string;
  variant?: 'default' | 'spinner' | 'waveform' | 'pulse-grid' | 'mascot';
}

export const KamryLoadingIcon: React.FC<KamryLoadingIconProps> = ({
  size = 22,
  className = '',
  color = '#0EA5E9',
  variant = 'default'
}) => {
  const blueColor = '#0EA5E9';
  const orangeColor = '#F59E0B';
  const accentColor = '#06B6D4';

  if (variant === 'mascot') {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      >
        <Icon icon="line-md:loading-alt-loop" className="text-sky-500" width={size} height={size} />
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`relative inline-flex items-center justify-center ${className}`}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer ring */}
          <circle cx="16" cy="16" r="13" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2.5" />
          
          {/* Animated SVG path arc */}
          <motion.circle
            cx="16"
            cy="16"
            r="13"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="80"
            strokeDashoffset="60"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          />

          {/* Inner pulsating core */}
          <motion.circle
            cx="16"
            cy="16"
            r="4"
            fill={blueColor}
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            style={{ transformOrigin: "center" }}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'waveform') {
    return (
      <div 
        style={{ width: size * 1.5, height: size }} 
        className={`relative inline-flex items-center justify-center ${className}`}
      >
        <svg
          width={size * 1.5}
          height={size}
          viewBox="0 0 36 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.rect
              key={i}
              x={4 + i * 6.5}
              y="3"
              width="3.5"
              height="18"
              rx="1.75"
              fill={i === 2 ? blueColor : color}
              animate={{ 
                scaleY: [0.3, 1, 0.3],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1, 
                delay: i * 0.15,
                ease: "easeInOut"
              }}
              style={{ transformOrigin: "center" }}
            />
          ))}
        </svg>
      </div>
    );
  }

  if (variant === 'pulse-grid') {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`relative inline-flex items-center justify-center ${className}`}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <motion.rect
                key={`${row}-${col}`}
                x={3 + col * 7}
                y={3 + row * 7}
                width="4"
                height="4"
                rx="1"
                fill={row === 1 && col === 1 ? blueColor : color}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1.15, 0.8]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay: (row + col) * 0.15,
                  ease: "easeInOut"
                }}
                style={{ transformOrigin: "center" }}
              />
            ))
          )}
        </svg>
      </div>
    );
  }

  // Default Kamry NPU Geometric Brand Logo Loader
  return (
    <div 
      style={{ width: size, height: size }} 
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Vertical Spine of the "K" */}
        <motion.rect 
          x="20" y="16" width="14" height="14" rx="4" fill={color}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0, ease: "easeInOut" }}
          style={{ transformOrigin: "27px 23px" }}
        />
        <motion.rect 
          x="20" y="34" width="14" height="14" rx="4" fill={orangeColor}
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9], rotate: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.1, ease: "easeInOut" }}
          style={{ transformOrigin: "27px 41px" }}
        />
        <motion.rect 
          x="20" y="52" width="14" height="14" rx="4" fill={blueColor}
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9], rotate: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.2, ease: "easeInOut" }}
          style={{ transformOrigin: "27px 59px" }}
        />
        <motion.rect 
          x="20" y="70" width="14" height="14" rx="4" fill={color}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.3, ease: "easeInOut" }}
          style={{ transformOrigin: "27px 77px" }}
        />

        {/* Diagonal Upper Branch of the "K" */}
        <motion.rect 
          x="38" y="34" width="14" height="14" rx="4" fill={color}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.15, ease: "easeInOut" }}
          style={{ transformOrigin: "45px 41px" }}
        />
        <motion.rect 
          x="56" y="16" width="14" height="14" rx="4" fill={color}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.25, ease: "easeInOut" }}
          style={{ transformOrigin: "63px 23px" }}
        />
        <motion.circle 
          cx="80" cy="23" r="6" fill={blueColor}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.35, ease: "easeInOut" }}
          style={{ transformOrigin: "80px 23px" }}
        />

        {/* Diagonal Lower Branch of the "K" */}
        <motion.rect 
          x="38" y="52" width="14" height="14" rx="4" fill="#9CA3AF"
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.2, ease: "easeInOut" }}
          style={{ transformOrigin: "45px 59px" }}
        />
        <motion.rect 
          x="56" y="70" width="14" height="14" rx="4" fill={color}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.3, ease: "easeInOut" }}
          style={{ transformOrigin: "63px 77px" }}
        />
        <motion.circle 
          cx="80" cy="77" r="6" fill={color}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.4, ease: "easeInOut" }}
          style={{ transformOrigin: "80px 77px" }}
        />

        {/* Core Junction Nodes */}
        <motion.circle 
          cx="45" cy="41" r="5" fill={color} opacity="0.8"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.1, ease: "easeInOut" }}
          style={{ transformOrigin: "45px 41px" }}
        />
        <motion.circle 
          cx="45" cy="59" r="5" fill={blueColor} opacity="0.8"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.25, ease: "easeInOut" }}
          style={{ transformOrigin: "45px 59px" }}
        />
      </svg>
    </div>
  );
};
