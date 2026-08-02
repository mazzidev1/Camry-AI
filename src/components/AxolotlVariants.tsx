import React from 'react';
import { motion } from 'motion/react';
import { CamryMascot } from './CamryMascot';
import { CheckCircle2, SearchX, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

interface AxolotlVariantCardProps {
  variant: 'success' | 'empty' | 'idle';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const AxolotlVariantCard: React.FC<AxolotlVariantCardProps> = ({
  variant,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  const { themeMode } = useAppContext();
  const isLight = themeMode === 'light';

  const config = {
    success: {
      defaultTitle: 'Operation Completed!',
      defaultDesc: 'All local NPU tasks and document vector embeddings successfully processed.',
      mascotMood: 'celebrate' as const,
      badgeText: 'SUCCESS 100%',
      badgeBg: isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
      cardBg: isLight 
        ? 'bg-gradient-to-b from-emerald-50/40 via-white to-white border-emerald-200/60' 
        : 'bg-gradient-to-b from-emerald-950/20 via-[#1C1C22] to-[#1C1C22] border-emerald-500/20 text-white',
      icon: CheckCircle2,
      accentColor: '#10B981'
    },
    empty: {
      defaultTitle: 'No Records Found',
      defaultDesc: 'The Axolotl assistant searched your air-gapped knowledge base but found zero matching documents.',
      mascotMood: 'searching' as const,
      badgeText: 'SEARCH COMPLETE',
      badgeBg: isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-950/80 text-amber-300 border-amber-700/60',
      cardBg: isLight 
        ? 'bg-gradient-to-b from-amber-50/30 via-white to-white border-amber-200/60' 
        : 'bg-gradient-to-b from-amber-950/20 via-[#1C1C22] to-[#1C1C22] border-amber-500/20 text-white',
      icon: SearchX,
      accentColor: '#F59E0B'
    },
    idle: {
      defaultTitle: 'System in Air-Gapped Standby',
      defaultDesc: 'Zero external telemetry. All local hardware NPU inference channels are operating nominally.',
      mascotMood: 'sleeping' as const,
      badgeText: 'SECURE STANDBY',
      badgeBg: isLight ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-950/80 text-blue-300 border-blue-700/60',
      cardBg: isLight 
        ? 'bg-gradient-to-b from-blue-50/30 via-white to-white border-blue-200/60' 
        : 'bg-gradient-to-b from-blue-950/20 via-[#1C1C22] to-[#1C1C22] border-blue-500/20 text-white',
      icon: ShieldCheck,
      accentColor: '#0066FF'
    }
  }[variant];

  const IconComp = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 sm:p-8 rounded-2xl border shadow-sm text-center flex flex-col items-center max-w-md w-full mx-auto ${config.cardBg} ${className}`}
    >
      {/* Mascot Icon Container */}
      <div className={`relative mb-4 p-3 rounded-2xl shadow-md border ${
        isLight ? 'bg-white border-black/5' : 'bg-[#25252D] border-white/10'
      }`}>
        <CamryMascot size={64} mood={config.mascotMood} variant="full" animated={true} />
        <span className={`absolute -top-2 -right-2 p-1.5 rounded-full shadow-xs border ${
          isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#1C1C22] border-white/10 text-white'
        }`}>
          <IconComp size={16} style={{ color: config.accentColor }} />
        </span>
      </div>

      {/* Badge */}
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border mb-2 ${config.badgeBg}`}>
        {config.badgeText}
      </span>

      {/* Title & Description */}
      <h3 className={`font-bricolage font-bold text-lg mb-1 ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
        {title || config.defaultTitle}
      </h3>
      <p className={`text-xs font-familjen max-w-sm mb-5 leading-relaxed ${isLight ? 'text-camry-graphite/70' : 'text-zinc-400'}`}>
        {description || config.defaultDesc}
      </p>

      {/* Action Button */}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-martian font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <span>{actionText}</span>
          <ArrowRight size={14} />
        </button>
      )}
    </motion.div>
  );
};

export const AxolotlVariantGallery: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="font-martian text-xs text-camry-graphite/50 px-2 tracking-wider uppercase">
        AXOLOTL MASCOT NOTIFICATION & EMPTY STATE VARIANTS
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AxolotlVariantCard variant="success" actionText="View Results" onAction={() => {}} />
        <AxolotlVariantCard variant="empty" actionText="Reset Search" onAction={() => {}} />
        <AxolotlVariantCard variant="idle" actionText="Run Diagnostics" onAction={() => {}} />
      </div>
    </div>
  );
};
