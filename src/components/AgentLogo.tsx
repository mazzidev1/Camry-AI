import React from 'react';

type AgentLogoProps = {
  agentId?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
};

/**
 * Custom Unique Agent Logos
 * Pure graphic artwork squircles featuring domain-specific geometry,
 * glowing neural circuits, bento node grids, and iconographic emblems — without text initials.
 */
export const AgentLogo: React.FC<AgentLogoProps> = ({ 
  agentId = '', 
  name = '', 
  size = 'md', 
  className = '' 
}) => {
  // Size helper
  const getDimensions = () => {
    if (typeof size === 'number') return { width: size, height: size };
    switch (size) {
      case 'xs': return { width: 20, height: 20 };
      case 'sm': return { width: 32, height: 32 };
      case 'md': return { width: 44, height: 44 };
      case 'lg': return { width: 56, height: 56 };
      case 'xl': return { width: 72, height: 72 };
      default: return { width: 44, height: 44 };
    }
  };

  const { width, height } = getDimensions();
  const normalizedId = agentId.toLowerCase();

  // Render specific logo based on agent ID
  switch (normalizedId) {
    case 'legal':
      // 1. Legal Assistant: Deep Obsidian + Glowing Red Neural Circuit Web & Scales Emblem
      return (
        <div 
          style={{ width, height }} 
          className={`relative rounded-xl overflow-hidden shadow-md flex items-center justify-center select-none bg-[#0D0B12] border border-red-500/40 shrink-0 ${className}`}
        >
          {/* Neural Circuit Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" fill="none">
            <path d="M50 15 C 35 15, 20 25, 20 40 C 20 50, 30 55, 30 65 C 30 75, 40 85, 50 85" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="3 3" />
            <path d="M50 15 C 65 15, 80 25, 80 40 C 80 50, 70 55, 70 65 C 70 75, 60 85, 50 85" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="3 3" />
            <circle cx="20" cy="40" r="3.5" fill="#DC2626" />
            <circle cx="80" cy="40" r="3.5" fill="#DC2626" />
            <circle cx="30" cy="65" r="3.5" fill="#DC2626" />
            <circle cx="70" cy="65" r="3.5" fill="#DC2626" />
            <circle cx="50" cy="15" r="4" fill="#F87171" />
            <circle cx="50" cy="85" r="4" fill="#F87171" />
          </svg>

          {/* Radial Center Glow */}
          <div className="absolute inset-0 bg-radial from-red-600/30 via-transparent to-transparent pointer-events-none" />

          {/* Scales of Justice Graphic Emblem */}
          <svg className="relative z-10 w-3/5 h-3/5 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="3" x2="12" y2="21" stroke="#FCA5A5" />
            <path d="M5 7h14" stroke="#FCA5A5" />
            <path d="M5 7l-3 7a3 3 0 0 0 6 0L5 7" fill="rgba(239, 68, 68, 0.3)" />
            <path d="M19 7l-3 7a3 3 0 0 0 6 0L19 7" fill="rgba(239, 68, 68, 0.3)" />
            <line x1="8" y1="21" x2="16" y2="21" stroke="#FCA5A5" strokeWidth="2.5" />
          </svg>
        </div>
      );

    case 'contract':
      // 2. Contract Reviewer: Indigo/Purple Squircle + Geometric Paper Fold & Scanner Play Notch
      return (
        <div 
          style={{ width, height }} 
          className={`relative rounded-xl overflow-hidden shadow-md flex items-center justify-center select-none bg-gradient-to-br from-[#3730A3] via-[#4F46E5] to-[#6366F1] border border-indigo-300/40 shrink-0 ${className}`}
        >
          {/* Background Polygon Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 100 100" fill="none">
            <path d="M20 20 L80 20 L80 80 L20 80 Z" stroke="#C7D2FE" strokeWidth="2.5" strokeDasharray="4 4" />
            <path d="M20 50 L80 50" stroke="#A5B4FC" strokeWidth="2" />
          </svg>

          {/* Redline Alert Notch */}
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white shadow-[0_0_6px_rgba(244,63,94,0.9)]" />

          {/* Geometric Stylized Document & Play Triangle Emblem */}
          <svg className="relative z-10 w-3/5 h-3/5 drop-shadow-md" viewBox="0 0 24 24" fill="none">
            <path d="M6 3h8.5L20 8.5V20a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="#FFFFFF" strokeWidth="2" fill="rgba(255, 255, 255, 0.15)" />
            <path d="M14 3v6h6" stroke="#C7D2FE" strokeWidth="2" />
            <polygon points="10,12 16,15.5 10,19" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'medical':
      // 3. Medical Scribe: Sky Blue + Floating Pill Bars & Heartbeat Pulse Node Emblem
      return (
        <div 
          style={{ width, height }} 
          className={`relative rounded-xl overflow-hidden shadow-md flex items-center justify-center select-none bg-gradient-to-br from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] border border-sky-200/50 shrink-0 ${className}`}
        >
          {/* Diagonal Pill Bars */}
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" fill="none">
            <rect x="15" y="20" width="40" height="10" rx="5" transform="rotate(-35 35 25)" fill="#FFFFFF" />
            <rect x="40" y="45" width="45" height="10" rx="5" transform="rotate(-35 60 50)" fill="#FFFFFF" />
            <circle cx="80" cy="20" r="4" fill="#E0F2FE" />
          </svg>

          {/* Medical Cross + ECG Heartbeat Graphic */}
          <svg className="relative z-10 w-3/5 h-3/5 drop-shadow-md" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v16M4 12h16" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M3 12h4l2.5-5 4 10 3-6 2.5 1h4" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );

    case 'gov':
      // 4. Gov Document Processor: Emerald Green + Capitol Seal & Star Shield Emblem
      return (
        <div 
          style={{ width, height }} 
          className={`relative rounded-xl overflow-hidden shadow-md flex items-center justify-center select-none bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#10B981] border border-emerald-300/40 shrink-0 ${className}`}
        >
          {/* Security Ring Dot Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="#A7F3D0" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="28" stroke="#D1FAE5" strokeWidth="1.5" />
          </svg>

          {/* Capitol Dome / Security Pillar Emblem */}
          <svg className="relative z-10 w-3/5 h-3/5 drop-shadow" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M5 21V11M9 21V11M15 21V11M19 21V11M2 11h20M12 3L2 11h20L12 3z" fill="rgba(167, 243, 208, 0.2)" />
            <circle cx="12" cy="7" r="1.5" fill="#FDE047" stroke="none" />
          </svg>
        </div>
      );

    case 'industrial':
      // 5. Industrial Copilot: Neon Cyber Yellow + Gear & Microchip Core Emblem
      return (
        <div 
          style={{ width, height }} 
          className={`relative rounded-xl overflow-hidden shadow-md flex items-center justify-center select-none bg-[#FACC15] border border-amber-400 shrink-0 ${className}`}
        >
          {/* Black Pixel Circuit Grid */}
          <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 100 100" fill="none">
            <rect x="10" y="10" width="20" height="20" rx="4" fill="#000000" />
            <rect x="70" y="10" width="20" height="20" rx="4" fill="#000000" />
            <rect x="10" y="70" width="20" height="20" rx="4" fill="#000000" />
            <rect x="70" y="70" width="20" height="20" rx="4" fill="#000000" />
          </svg>

          {/* Industrial Gear NPU Emblem */}
          <svg className="relative z-10 w-3/5 h-3/5 drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="#000000" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </div>
      );

    case 'finance':
      // 6. Finance Analyst: Sapphire Slate + Candlestick Sparkline Growth Emblem
      return (
        <div 
          style={{ width, height }} 
          className={`relative rounded-xl overflow-hidden shadow-md flex items-center justify-center select-none bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] border border-emerald-400/40 shrink-0 ${className}`}
        >
          {/* Background Candlesticks */}
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" fill="none">
            <rect x="20" y="45" width="10" height="30" rx="2" fill="#34D399" />
            <rect x="50" y="20" width="10" height="50" rx="2" fill="#10B981" />
            <rect x="75" y="15" width="10" height="60" rx="2" fill="#6EE7B7" />
          </svg>

          {/* Growth Sparkline & Bento Diamond Node Emblem */}
          <svg className="relative z-10 w-3/5 h-3/5 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
            <circle cx="13.5" cy="15.5" r="1.5" fill="#6EE7B7" stroke="none" />
            <circle cx="8.5" cy="10.5" r="1.5" fill="#6EE7B7" stroke="none" />
          </svg>
        </div>
      );

    case 'meeting':
      // 7. Meeting Notetaker: Cosmic Violet + Soundwave Capsule & Ring Emblem
      return (
        <div 
          style={{ width, height }} 
          className={`relative rounded-xl overflow-hidden shadow-md flex items-center justify-center select-none bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#4C1D95] border border-purple-400/40 shrink-0 ${className}`}
        >
          {/* Concentric Audio Wave Rings */}
          <svg className="absolute inset-0 w-full h-full opacity-45" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="#C084FC" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="28" stroke="#A855F7" strokeWidth="1.5" />
          </svg>

          {/* Acoustic Microphone Sound Capsule Emblem */}
          <svg className="relative z-10 w-3/5 h-3/5 drop-shadow" viewBox="0 0 24 24" fill="none" stroke="#F0ABFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" fill="rgba(240, 171, 252, 0.25)" />
            <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
          </svg>
        </div>
      );

    case 'translator':
      // 8. Translator (Local): Sunset Crimson + Interlocking Dual Bubble Loop Emblem
      return (
        <div 
          style={{ width, height }} 
          className={`relative rounded-xl overflow-hidden shadow-md flex items-center justify-center select-none bg-gradient-to-br from-[#9F1239] via-[#E11D48] to-[#FB7185] border border-rose-300/40 shrink-0 ${className}`}
        >
          {/* Globe Arcs Background */}
          <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="36" stroke="#FFE4E6" strokeWidth="2.5" />
            <path d="M14 50 Q50 20 86 50" stroke="#FFF" strokeWidth="2" fill="none" />
            <path d="M14 50 Q50 80 86 50" stroke="#FFF" strokeWidth="2" fill="none" />
          </svg>

          {/* Interlocking Translation Arrows Emblem */}
          <svg className="relative z-10 w-3/5 h-3/5 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 3l4 4-4 4" />
            <path d="M20 7H9a4 4 0 00-4 4v1" />
            <path d="M8 21l-4-4 4-4" />
            <path d="M4 17h11a4 4 0 004-4v-1" />
          </svg>
        </div>
      );

    default: {
      // Dynamic fallback for custom created agents: unique abstract bento graphics
      const displayName = name || agentId || 'Agent';
      const charCodeSum = displayName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      const styles = [
        { 
          bg: 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700', 
          border: 'border-purple-300/40',
          svg: (
            <svg className="w-3/5 h-3/5 drop-shadow" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <rect x="3" y="3" width="8" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
              <rect x="13" y="3" width="8" height="8" rx="2" fill="rgba(255,255,255,0.5)" />
              <rect x="3" y="13" width="8" height="8" rx="2" fill="rgba(255,255,255,0.5)" />
              <rect x="13" y="13" width="8" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
            </svg>
          ) 
        },
        { 
          bg: 'bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700', 
          border: 'border-teal-300/40',
          svg: (
            <svg className="w-3/5 h-3/5 drop-shadow" viewBox="0 0 24 24" fill="none" stroke="#E0F2FE" strokeWidth="2">
              <circle cx="12" cy="12" r="8" fill="rgba(255,255,255,0.25)" />
              <path d="M12 2v20M2 12h20" />
            </svg>
          ) 
        },
        { 
          bg: 'bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600', 
          border: 'border-amber-300/40',
          svg: (
            <svg className="w-3/5 h-3/5 drop-shadow" viewBox="0 0 24 24" fill="none" stroke="#FEF3C7" strokeWidth="2">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="rgba(255,255,255,0.2)" />
              <circle cx="12" cy="12" r="3" fill="#FFF" />
            </svg>
          ) 
        },
        { 
          bg: 'bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700', 
          border: 'border-sky-300/40',
          svg: (
            <svg className="w-3/5 h-3/5 drop-shadow" viewBox="0 0 24 24" fill="none" stroke="#E0F2FE" strokeWidth="2">
              <path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z" fill="rgba(255,255,255,0.25)" />
            </svg>
          ) 
        },
      ];

      const activeStyle = styles[charCodeSum % styles.length];

      return (
        <div 
          style={{ width, height }} 
          className={`relative rounded-xl overflow-hidden shadow-md flex items-center justify-center select-none ${activeStyle.bg} ${activeStyle.border} border shrink-0 ${className}`}
        >
          {/* Background Grid Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="20" cy="20" r="5" fill="#FFF" />
            <circle cx="80" cy="20" r="5" fill="#FFF" />
            <circle cx="50" cy="50" r="6" fill="#FFF" />
            <circle cx="20" cy="80" r="5" fill="#FFF" />
            <circle cx="80" cy="80" r="5" fill="#FFF" />
          </svg>

          {/* Graphic Emblem */}
          <div className="relative z-10 flex items-center justify-center">
            {activeStyle.svg}
          </div>
        </div>
      );
    }
  }
};
