import React from 'react';
import { motion } from 'motion/react';

interface CamryLogoProps {
  variant?: 'light' | 'dark' | 'carrier';
  layout?: 'horizontal' | 'stacked' | 'markOnly';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export const CamryLogo: React.FC<CamryLogoProps> = ({
  variant = 'light',
  layout = 'horizontal',
  size = 'md',
  className = '',
  animated = true
}) => {
  const getNeutralColor = () => {
    if (variant === 'dark') return '#171A1F';
    if (variant === 'carrier') return '#1D4ED8';
    return '#E5E7EB'; // light / paper background contrast
  };

  const getTextColor = () => {
    if (variant === 'dark') return 'text-camry-blackout';
    if (variant === 'carrier') return 'text-blue-700';
    return 'text-camry-paper';
  };

  const dimensions = {
    sm: { width: 22, height: 22, text: 'text-base', gap: 'gap-2' },
    md: { width: 30, height: 30, text: 'text-xl', gap: 'gap-2.5' },
    lg: { width: 42, height: 42, text: 'text-3xl', gap: 'gap-3.5' }
  }[size];

  const neutralColor = getNeutralColor();

  const orangeColor = '#F59E0B';
  const blueColor = '#3B82F6';
  const purpleColor = '#A855F7';

  const MarkSVG = (
    <motion.svg 
      width={dimensions.width} 
      height={dimensions.height} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 cursor-pointer overflow-visible"
      whileHover={animated ? "hover" : undefined}
      initial="initial"
      animate={animated ? "animate" : "initial"}
    >
      {/* Row 1: Top Bar & Top Right Circle */}
      <motion.rect 
        x="36" y="16" width="32" height="12" rx="3" 
        fill={neutralColor}
        variants={{
          animate: {
            opacity: [0.8, 1, 0.8],
            scaleX: [1, 1.05, 1]
          },
          hover: { scaleX: 1.1, opacity: 1 }
        }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.1 }}
        style={{ transformOrigin: "36px 22px" }}
      />
      <motion.circle 
        cx="78" cy="22" r="6" 
        fill={neutralColor}
        variants={{
          animate: {
            scale: [1, 1.18, 1],
            opacity: [0.7, 1, 0.7]
          },
          hover: { scale: 1.25, opacity: 1 }
        }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.3 }}
        style={{ transformOrigin: "78px 22px" }}
      />

      {/* Row 2: Orange Square & Center Circle */}
      <motion.rect 
        x="16" y="34" width="14" height="14" rx="3" 
        fill={orangeColor}
        variants={{
          animate: {
            scale: [1, 1.12, 1],
            rotate: [0, 3, 0]
          },
          hover: { scale: 1.25, rotate: -6 }
        }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0 }}
        style={{ transformOrigin: "23px 41px" }}
      />
      <motion.circle 
        cx="43" cy="41" r="6" 
        fill={neutralColor}
        variants={{
          animate: {
            scale: [1, 1.15, 1],
            opacity: [0.75, 1, 0.75]
          },
          hover: { scale: 1.22, opacity: 1 }
        }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: 0.4 }}
        style={{ transformOrigin: "43px 41px" }}
      />

      {/* Row 3: Blue Square & Purple Square */}
      <motion.rect 
        x="16" y="52" width="14" height="14" rx="3" 
        fill={blueColor}
        variants={{
          animate: {
            scale: [1, 1.12, 1],
            rotate: [0, -3, 0]
          },
          hover: { scale: 1.25, rotate: 6 }
        }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.2 }}
        style={{ transformOrigin: "23px 59px" }}
      />
      <motion.rect 
        x="36" y="52" width="14" height="14" rx="3" 
        fill={purpleColor}
        variants={{
          animate: {
            scale: [1, 1.14, 1],
            opacity: [0.85, 1, 0.85]
          },
          hover: { scale: 1.25 }
        }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.35 }}
        style={{ transformOrigin: "43px 59px" }}
      />

      {/* Row 4: Bottom Bar & Bottom Right Circle */}
      <motion.rect 
        x="36" y="70" width="32" height="12" rx="3" 
        fill={neutralColor}
        variants={{
          animate: {
            opacity: [0.8, 1, 0.8],
            scaleX: [1, 1.05, 1]
          },
          hover: { scaleX: 1.1, opacity: 1 }
        }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.5 }}
        style={{ transformOrigin: "36px 76px" }}
      />
      <motion.circle 
        cx="78" cy="76" r="6" 
        fill={neutralColor}
        variants={{
          animate: {
            scale: [1, 1.18, 1],
            opacity: [0.7, 1, 0.7]
          },
          hover: { scale: 1.25, opacity: 1 }
        }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.6 }}
        style={{ transformOrigin: "78px 76px" }}
      />
    </motion.svg>
  );

  if (layout === 'markOnly') {
    return <div className={`inline-flex items-center ${className}`}>{MarkSVG}</div>;
  }

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {MarkSVG}
        <span className={`font-bricolage font-bold lowercase tracking-tight mt-1.5 ${dimensions.text} ${getTextColor()}`}>
          camry
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${dimensions.gap} ${className}`}>
      {MarkSVG}
      <span className={`font-bricolage font-bold lowercase tracking-tight ${dimensions.text} ${getTextColor()}`}>
        camry
      </span>
    </div>
  );
};
