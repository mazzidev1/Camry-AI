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
  // Colors based on PDF specification:
  // Blackout: #0B0C0E
  // Paper: #EDEBE4
  // Carrier Blue: #9BD1FF
  
  const getMarkColor = () => {
    if (variant === 'dark') return '#0B0C0E';
    if (variant === 'carrier') return '#9BD1FF';
    return '#EDEBE4'; // light
  };

  const getTextColor = () => {
    if (variant === 'dark') return 'text-camry-blackout';
    if (variant === 'carrier') return 'text-camry-carrier';
    return 'text-camry-paper';
  };

  const dimensions = {
    sm: { svg: 18, text: 'text-base', gap: 'gap-2' },
    md: { svg: 24, text: 'text-xl', gap: 'gap-2.5' },
    lg: { svg: 36, text: 'text-3xl', gap: 'gap-3.5' }
  }[size];

  const markColor = getMarkColor();

  // "The Signal" - Morse C logo mark:
  // Row 1: square dot + dash
  // Row 2: square dot
  // Row 3: square dot + dash
  const MarkSVG = (
    <svg 
      width={dimensions.svg} 
      height={dimensions.svg} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Row 1 */}
      <rect x="2" y="3" width="6" height="6" rx="1" fill={markColor} />
      <rect x="11" y="3" width="18" height="6" rx="1" fill={markColor} />
      
      {/* Row 2 */}
      <rect x="2" y="13" width="6" height="6" rx="1" fill={markColor} />
      
      {/* Row 3 */}
      <rect x="2" y="23" width="6" height="6" rx="1" fill={markColor} />
      <rect x="11" y="23" width="18" height="6" rx="1" fill={markColor} />
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
