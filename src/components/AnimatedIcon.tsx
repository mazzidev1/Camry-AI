import React from 'react';
import { motion, TargetAndTransition } from 'motion/react';

export type IconAnimationType = 'scale' | 'rotate' | 'bounce' | 'pulse' | 'wiggle' | 'spin' | 'lift';

interface AnimatedIconProps {
  children: React.ReactNode;
  type?: IconAnimationType;
  className?: string;
  isHovered?: boolean;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  children,
  type = 'scale',
  className = '',
  isHovered
}) => {
  const animations: Record<IconAnimationType, TargetAndTransition> = {
    scale: { scale: 1.22 },
    rotate: { rotate: 18, scale: 1.12 },
    bounce: { y: -3, scale: 1.12 },
    pulse: { scale: [1, 1.25, 1.1] },
    wiggle: { rotate: [-8, 8, -5, 5, 0], scale: 1.15 },
    spin: { rotate: 180 },
    lift: { y: -2, scale: 1.15 }
  };

  const selectedAnimation = animations[type] || animations.scale;
  const hasKeyframes = Object.values(selectedAnimation).some(val => Array.isArray(val));

  return (
    <motion.span
      className={`inline-flex items-center justify-center flex-shrink-0 transition-colors ${className}`}
      whileHover={isHovered === undefined ? selectedAnimation : undefined}
      animate={isHovered ? selectedAnimation : undefined}
      transition={hasKeyframes ? { duration: 0.4, ease: "easeInOut" } : { type: 'spring', stiffness: 420, damping: 18 }}
    >
      {children}
    </motion.span>
  );
};
