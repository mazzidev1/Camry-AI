import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CamryMascot } from './CamryMascot';
import { Activity, Cpu, Sparkles } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export type AxolotlState = 'idle' | 'thinking' | 'active';

interface AxolotlStatusBadgeProps {
  initialState?: AxolotlState;
  showSelector?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onStateChange?: (state: AxolotlState) => void;
}

export const AxolotlStatusBadge: React.FC<AxolotlStatusBadgeProps> = ({
  initialState = 'idle',
  showSelector = true,
  size = 'md',
  className = '',
  onStateChange
}) => {
  const { themeMode } = useAppContext();
  const isLight = themeMode === 'light';
  const [status, setStatus] = useState<AxolotlState>(initialState);

  const handleStateChange = (nextState: AxolotlState) => {
    setStatus(nextState);
    if (onStateChange) onStateChange(nextState);
  };

  const statusConfig = {
    idle: {
      label: 'NPU Idle',
      badgeBg: 'bg-zinc-600 text-white shadow-xs',
      dotColor: 'bg-slate-400',
      description: 'Zero background load • Air-gapped standby',
      mascotMood: 'sleeping' as const,
      icon: Cpu
    },
    thinking: {
      label: 'Analyzing & Reasoning...',
      badgeBg: 'bg-amber-500 text-white shadow-xs',
      dotColor: 'bg-amber-500 animate-ping',
      description: 'Local embeddings & RAG pipeline active',
      mascotMood: 'thinking' as const,
      icon: Sparkles
    },
    active: {
      label: 'Local NPU Inference 100%',
      badgeBg: 'bg-emerald-600 text-white shadow-xs',
      dotColor: 'bg-emerald-500 animate-pulse',
      description: 'Streaming at ~1,480 tokens/sec',
      mascotMood: 'active' as const,
      icon: Activity
    }
  }[status];

  const IconComp = statusConfig.icon;

  return (
    <div className={`inline-flex flex-col gap-2 p-3 sm:p-4 rounded-xl border transition-colors ${
      isLight ? 'border-black/10 bg-white text-camry-blackout shadow-xs' : 'border-white/10 bg-[#1C1C22] text-white shadow-lg'
    } ${className}`}>
      <div className="flex items-center justify-between gap-3">
        {/* Mascot + Status Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <CamryMascot 
              size={size === 'sm' ? 32 : size === 'lg' ? 48 : 40} 
              mood={statusConfig.mascotMood}
              variant="full"
              animated={true}
            />
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${isLight ? 'border-white' : 'border-[#1C1C22]'} ${statusConfig.dotColor}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${statusConfig.badgeBg}`}>
                <IconComp size={12} className="shrink-0" />
                {statusConfig.label}
              </span>
            </div>
            <p className={`text-xs font-familjen mt-1 ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>
              {statusConfig.description}
            </p>
          </div>
        </div>

        {/* State Toggle Buttons */}
        {showSelector && (
          <div className={`flex items-center p-1 rounded-lg border gap-1 self-start sm:self-center ${
            isLight ? 'bg-zinc-100 border-black/5' : 'bg-[#26262E] border-white/10'
          }`}>
            {(['idle', 'thinking', 'active'] as AxolotlState[]).map((s) => (
              <button
                key={s}
                onClick={() => handleStateChange(s)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-martian font-bold transition-all cursor-pointer capitalize ${
                  status === s 
                    ? (isLight ? 'bg-white text-[#0066FF] shadow-xs font-black' : 'bg-[#0066FF] text-white shadow-xs font-black')
                    : (isLight ? 'text-camry-graphite/60 hover:text-camry-blackout' : 'text-zinc-400 hover:text-white')
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
