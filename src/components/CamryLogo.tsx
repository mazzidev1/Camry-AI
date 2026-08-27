import React from 'react';

interface CamryLogoProps {
  variant?: 'light' | 'dark' | 'carrier';
  layout?: 'horizontal' | 'stacked' | 'markOnly';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  useMascot?: boolean;
}

export const CamryLogo: React.FC<CamryLogoProps> = ({
  variant = 'light',
  layout = 'horizontal',
  size = 'md',
  className = '',
  useMascot = false
}) => {
  const getTextColor = () => {
    if (variant === 'dark') return 'text-[#121418]';
    if (variant === 'carrier') return 'text-camry-brand';
    return 'text-white';
  };

  const markFill = variant === 'dark' ? '#121418' : variant === 'carrier' ? 'var(--color-camry-brand)' : '#FFFFFF';

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
      className="shrink-0 select-none"
    >
      <rect x="36" y="16" width="32" height="12" rx="3" fill={markFill} />
      <circle cx="78" cy="22" r="6" fill={markFill} />
      <rect x="16" y="34" width="14" height="14" rx="3" fill="#D1D5DB" />
      <circle cx="43" cy="41" r="6" fill={markFill} />
      <rect x="16" y="52" width="14" height="14" rx="3" fill="var(--color-camry-brand)" />
      <rect x="36" y="52" width="14" height="14" rx="3" fill="#9CA3AF" />
      <rect x="36" y="70" width="32" height="12" rx="3" fill={markFill} />
      <circle cx="78" cy="76" r="6" fill={markFill} />
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
            camry
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-camry-brand/10 text-camry-brand font-semibold border border-camry-brand/20">
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
          camry
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-camry-brand text-white font-bold shadow-sm shadow-camry-brand/30">
          OS
        </span>
      </div>
    </div>
  );
};
