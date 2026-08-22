import React from 'react';

interface KamryLogoProps {
  variant?: 'light' | 'dark' | 'carrier';
  layout?: 'horizontal' | 'stacked' | 'markOnly';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  useMascot?: boolean;
}

export const KamryLogo: React.FC<KamryLogoProps> = ({
  variant = 'light',
  layout = 'horizontal',
  size = 'md',
  className = '',
  useMascot = false
}) => {
  const getTextColor = () => {
    if (variant === 'dark') return 'text-[#121418]';
    if (variant === 'carrier') return 'text-kamry-brand';
    return 'text-white';
  };

  const markFill = variant === 'dark' ? '#121418' : variant === 'carrier' ? 'var(--color-kamry-brand)' : '#FFFFFF';

  const dimensions = {
    sm: { px: 22, text: 'text-base', gap: 'gap-2' },
    md: { px: 28, text: 'text-xl', gap: 'gap-2.5' },
    lg: { px: 40, text: 'text-3xl', gap: 'gap-3' }
  }[size];

  const OriginalMark = (
    <svg 
      width={dimensions.px} 
      height={dimensions.px} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 select-none animate-fade-in"
    >
      {/* Vertical Spine of the "K" */}
      <rect x="20" y="16" width="14" height="14" rx="4" fill={markFill} />
      <rect x="20" y="34" width="14" height="14" rx="4" fill="#F59E0B" />
      <rect x="20" y="52" width="14" height="14" rx="4" fill="var(--color-kamry-brand)" />
      <rect x="20" y="70" width="14" height="14" rx="4" fill={markFill} />

      {/* Diagonal Upper Branch of the "K" */}
      <rect x="38" y="34" width="14" height="14" rx="4" fill={markFill} />
      <rect x="56" y="16" width="14" height="14" rx="4" fill={markFill} />
      <circle cx="80" cy="23" r="6" fill="var(--color-kamry-brand)" />

      {/* Diagonal Lower Branch of the "K" */}
      <rect x="38" y="52" width="14" height="14" rx="4" fill="#9CA3AF" />
      <rect x="56" y="70" width="14" height="14" rx="4" fill={markFill} />
      <circle cx="80" cy="77" r="6" fill={markFill} />

      {/* Core Junction Nodes */}
      <circle cx="45" cy="41" r="5" fill={markFill} opacity="0.8" />
      <circle cx="45" cy="59" r="5" fill="var(--color-kamry-brand)" opacity="0.8" />
    </svg>
  );

  const Mark = OriginalMark;

  if (layout === 'markOnly') {
    return <div className={`inline-flex items-center ${className}`}>{Mark}</div>;
  }

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {Mark}
        <div className="flex items-center gap-1 mt-2">
          <span className={`font-display font-extrabold lowercase tracking-tight ${dimensions.text} ${getTextColor()}`}>
            kamry
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-kamry-brand/10 text-kamry-brand font-semibold border border-kamry-brand/20">
            OS
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${dimensions.gap} ${className}`}>
      {Mark}
      <div className="flex items-baseline gap-1.5">
        <span className={`font-display font-extrabold lowercase tracking-tight ${dimensions.text} ${getTextColor()}`}>
          kamry
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-kamry-brand text-white font-bold shadow-sm shadow-kamry-brand/30">
          OS
        </span>
      </div>
    </div>
  );
};
