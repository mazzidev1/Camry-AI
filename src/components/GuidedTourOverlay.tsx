import React, { useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { AnimatedIcon } from './AnimatedIcon';
import { CamryMascot } from './CamryMascot';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  FileText, 
  Settings, 
  Cpu, 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GuidedTourOverlay: React.FC = () => {
  const { 
    isTourOpen, 
    closeTour, 
    tourStep, 
    setTourStep, 
    setCurrentScreen, 
    setSettingsView,
    showToast,
    themeMode
  } = useAppContext();

  const isLight = themeMode === 'light';
  const totalSteps = 5;

  // Keyboard navigation support
  useEffect(() => {
    if (!isTourOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeTour();
      } else if (e.key === 'ArrowRight') {
        if (tourStep < totalSteps) {
          setTourStep(tourStep + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (tourStep > 1) {
          setTourStep(tourStep - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, tourStep, closeTour, setTourStep]);

  if (!isTourOpen) return null;

  const tourStepsData = [
    {
      step: 1,
      badge: 'WELCOME TO CAMRY OS',
      title: '100% Air-Gapped NPU AI Workstation',
      subtitle: 'Your private, on-premises AI intelligence appliance',
      icon: <Cpu size={24} className={isLight ? "text-sky-600" : "text-sky-400"} />,
      description: 'Camry OS runs entirely inside your local network hardware. All document indexing, vector searches, and LLM inferences occur on your local NPU with zero internet dependencies or external data leakage.',
      highlights: [
        'Local NPU Acceleration with ~1,480 tokens/sec throughput',
        'Strict Air-Gapped Security & Zero Cloud Telemetry',
        'Role-Based Access Control (Admin, Manager, Member, Guest)'
      ],
      actionLabel: 'Start Tour',
      targetScreen: 'chat' as const
    },
    {
      step: 2,
      badge: 'FEATURE 1 OF 3 — KNOWLEDGE BASE',
      title: 'Knowledge Base & Vector Index',
      subtitle: 'Ingest & vectorize private company documents',
      icon: <Layers size={24} className={isLight ? "text-sky-600" : "text-sky-400"} />,
      description: 'Upload PDFs, Word docs, spreadsheets, and meeting notes. Documents are vectorized locally into categories (Contracts, Finance, HR) with granular role-level access controls.',
      highlights: [
        'Category-based security permissions for sensitive data',
        'Instant semantic vector search across local files',
        'Restricted document toggles for Member & Guest roles'
      ],
      actionLabel: 'Explore Knowledge Base',
      targetScreen: 'knowledgeBase' as const
    },
    {
      step: 3,
      badge: 'FEATURE 2 OF 3 — LIBRARY',
      title: 'Library & Artifact Repository',
      subtitle: 'Central store for all generated outputs & documents',
      icon: <FileText size={24} className={isLight ? "text-sky-600" : "text-sky-400"} />,
      description: 'Access all AI-generated contract risk reports, executive meeting summaries, draft emails, and translation transcripts. Easily copy or download markdown files.',
      highlights: [
        'Organized by document types (Summaries, Analyses, Drafts)',
        'One-click Markdown export and content copying',
        'Role-filtered views to protect confidential executive reports'
      ],
      actionLabel: 'Open Library',
      targetScreen: 'library' as const
    },
    {
      step: 4,
      badge: 'FEATURE 3 OF 3 — SETTINGS & HARDWARE',
      title: 'Settings, Telemetry & Team Control',
      subtitle: 'NPU metrics, local power rail, and backup options',
      icon: <Settings size={24} className={isLight ? "text-sky-600" : "text-sky-400"} />,
      description: 'Monitor live hardware stats, manage team member permissions, test role scopes ("View As"), and export or restore complete JSON system configurations.',
      highlights: [
        'Live NPU VRAM, temperature, and token throughput counters',
        'Full JSON config backup & single-click restore engine',
        'Simulate Member / Manager / Guest access scopes'
      ],
      actionLabel: 'View Device Settings',
      targetScreen: 'settings' as const,
      subView: 'main' as const
    },
    {
      step: 5,
      badge: 'GET STARTED NOW',
      title: 'Local LLM Hub & AI Agents',
      subtitle: 'Deploy specialized local agents for Legal, Finance & Code',
      icon: <Bot size={24} className={isLight ? "text-sky-600" : "text-sky-400"} />,
      description: 'Switch between loaded models (Qwen 2.5, Llama 3) and install specialized agent workflows from the local Agent Store to customize prompt instructions.',
      highlights: [
        'Pre-loaded local models with no token usage limits',
        'Custom agent creation with rollback version control',
        'Global search bar (Cmd/Ctrl + K) to launch any agent instantly'
      ],
      actionLabel: 'Browse Agent Store',
      targetScreen: 'agentStore' as const
    }
  ];

  const currentStepData = tourStepsData[tourStep - 1];

  const handleNext = () => {
    if (tourStep < totalSteps) {
      setTourStep(tourStep + 1);
    } else {
      closeTour();
      showToast('Tour completed! Welcome to Camry OS.', 'success');
    }
  };

  const handlePrev = () => {
    if (tourStep > 1) {
      setTourStep(tourStep - 1);
    }
  };

  const handleJumpToScreen = () => {
    if (currentStepData.targetScreen) {
      setCurrentScreen(currentStepData.targetScreen);
      if (currentStepData.subView) {
        setSettingsView(currentStepData.subView);
      }
      showToast(`Navigated to ${currentStepData.title}`);
    }
  };

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors ${
        isLight ? 'bg-zinc-900/35 backdrop-blur-md' : 'bg-black/75 backdrop-blur-md'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden font-sans ${
            isLight 
              ? 'bg-white text-zinc-900 border-[#E2DDD5]' 
              : 'bg-[#16161A] text-white border-white/15'
          }`}
        >
          {/* Top Progress Bar */}
          <div className={`w-full h-1.5 ${isLight ? 'bg-zinc-100' : 'bg-white/10'}`}>
            <motion.div 
              className="bg-gradient-to-r from-sky-500 to-blue-600 h-1.5 transition-all duration-300"
              style={{ width: `${(tourStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Header Bar */}
          <div className={`p-5 pb-3 flex items-center justify-between border-b ${
            isLight ? 'border-zinc-100 bg-zinc-50/50' : 'border-white/10'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                isLight 
                  ? 'bg-sky-50 text-sky-700 border-sky-200' 
                  : 'bg-sky-500/20 text-sky-300 border-sky-400/30'
              }`}>
                {currentStepData.badge}
              </span>
              <span className={`text-xs font-mono font-medium ${isLight ? 'text-zinc-400' : 'text-white/40'}`}>
                {tourStep} of {totalSteps}
              </span>
            </div>

            <button
              onClick={closeTour}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isLight 
                  ? 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100' 
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
              title="Close tour"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Title & Icon Header */}
            <div className="flex items-start gap-3.5">
              {tourStep === 1 ? (
                <CamryMascot size={48} variant="full" animated={true} className="shrink-0 shadow-md" />
              ) : (
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${
                  isLight 
                    ? 'bg-[#0066FF]/10 border-[#0066FF]/20 text-[#0066FF]' 
                    : 'bg-[#0066FF]/20 border-[#0066FF]/40 text-blue-300'
                }`}>
                  <AnimatedIcon type="scale">
                    {currentStepData.icon}
                  </AnimatedIcon>
                </div>
              )}

              <div>
                <h2 className={`text-xl font-bold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                  {currentStepData.title}
                </h2>
                <p className={`text-xs font-medium mt-0.5 ${isLight ? 'text-sky-700' : 'text-sky-300/90'}`}>
                  {currentStepData.subtitle}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className={`text-sm leading-relaxed ${isLight ? 'text-zinc-600' : 'text-white/80'}`}>
              {currentStepData.description}
            </p>

            {/* Highlights Bullet List */}
            <div className={`border rounded-xl p-3.5 space-y-2 ${
              isLight ? 'bg-zinc-50/80 border-zinc-200/80' : 'bg-white/5 border-white/10'
            }`}>
              <div className={`text-[11px] uppercase tracking-wider font-semibold font-mono ${
                isLight ? 'text-zinc-400' : 'text-white/50'
              }`}>
                Key Highlights
              </div>
              <ul className={`space-y-2 text-xs ${isLight ? 'text-zinc-700' : 'text-white/90'}`}>
                {currentStepData.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className={`shrink-0 mt-0.5 ${isLight ? 'text-sky-600' : 'text-sky-400'}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Controls */}
          <div className={`p-4 sm:p-5 border-t flex flex-wrap items-center justify-between gap-3 ${
            isLight ? 'bg-zinc-50/80 border-zinc-100' : 'bg-white/5 border-white/10'
          }`}>
            {/* Left: Direct Feature Jump Action */}
            <button
              onClick={handleJumpToScreen}
              className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group whitespace-nowrap shrink-0 border ${
                isLight 
                  ? 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-700 hover:text-sky-900' 
                  : 'bg-sky-500/15 hover:bg-sky-500/25 border-sky-400/30 text-sky-200 hover:text-white'
              }`}
            >
              <span className="whitespace-nowrap">{currentStepData.actionLabel}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            {/* Right: Next / Prev / Skip Controls */}
            <div className="flex items-center gap-2 ml-auto shrink-0 flex-nowrap">
              {tourStep > 1 && (
                <button
                  onClick={handlePrev}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
                    isLight 
                      ? 'border-zinc-200 hover:bg-zinc-100 text-zinc-700' 
                      : 'border-white/10 hover:bg-white/10 text-white/80 hover:text-white'
                  }`}
                >
                  <ChevronLeft size={14} className="shrink-0" />
                  <span>Back</span>
                </button>
              )}

              <button
                onClick={closeTour}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isLight 
                    ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100' 
                    : 'text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                Skip
              </button>

              <button
                onClick={handleNext}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">{tourStep === totalSteps ? 'Finish Tour' : 'Next Step'}</span>
                <ChevronRight size={14} className="shrink-0" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
