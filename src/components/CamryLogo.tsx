import React from 'react';

interface CamryLogoProps {
  variant?: 'light' | 'dark' | 'carrier';
  layout?: 'horizontal' | 'stacked' | 'markOnly';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CamryLogo: React.FC<CamryLogoProps> = ({
  variant = 'light',
  layout = 'horizontal',
  size = 'md',
  className = ''
}) => {
  // Colors based on PDF & Brand specification:
  // Blackout: #0B0C0E
  // Paper: #EDEBE4
  // Carrier Blue: #9BD1FF
  
  const getMarkColor = () => {
    if (variant === 'dark') return '#0B0C0E';
    if (variant === 'carrier') return '#9BD1FF';
    return '#EDEBE4'; // light
  };

  const getBlueDotColor = () => {
    return '#9BD1FF'; // Camry Carrier Blue
  };

  const getTextColor = () => {
    if (variant === 'dark') return 'text-camry-blackout';
    if (variant === 'carrier') return 'text-camry-carrier';
    return 'text-camry-paper';
  };

  const dimensions = {
    sm: { width: 26, height: 18, text: 'text-base', gap: 'gap-2' },
    md: { width: 34, height: 24, text: 'text-xl', gap: 'gap-2.5' },
    lg: { width: 48, height: 34, text: 'text-3xl', gap: 'gap-3.5' }
  }[size];

  const markColor = getMarkColor();
  const blueDotColor = getBlueDotColor();

  // Camry Logo Mark matching the exact brand icon:
  // - Left: 2 dots (top markColor, bottom carrier blue #9BD1FF)
  // - Center: 3 rounded horizontal pill bars
  // - Right: 2 dots (top & bottom markColor)
  const MarkSVG = (
    <svg 
      width={dimensions.width} 
      height={dimensions.height} 
      viewBox="0 0 38 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Left Dots */}
      <circle cx="3" cy="7.5" r="2.5" fill={markColor} />
      <circle cx="3" cy="16.5" r="2.5" fill={blueDotColor} />

      {/* Center 3 Pill Bars */}
      <rect x="9" y="2" width="18" height="5" rx="2.5" fill={markColor} />
      <rect x="9" y="9.5" width="18" height="5" rx="2.5" fill={markColor} />
      <rect x="9" y="17" width="18" height="5" rx="2.5" fill={markColor} />

      {/* Right Dots */}
      <circle cx="32" cy="4.5" r="2.5" fill={markColor} />
      <circle cx="32" cy="19.5" r="2.5" fill={markColor} />
    </svg>
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
