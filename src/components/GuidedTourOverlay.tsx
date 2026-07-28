import React, { useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { AnimatedIcon } from './AnimatedIcon';
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
    showToast 
  } = useAppContext();

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
      icon: <Cpu size={24} className="text-sky-400" />,
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
      icon: <Layers size={24} className="text-sky-400" />,
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
      icon: <FileText size={24} className="text-sky-400" />,
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
      icon: <Settings size={24} className="text-sky-400" />,
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
      icon: <Bot size={24} className="text-sky-400" />,
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-camry-blackout text-white rounded-2xl border border-white/15 shadow-2xl overflow-hidden font-familjen"
        >
          {/* Top Progress Bar */}
          <div className="w-full bg-white/10 h-1.5">
            <motion.div 
              className="bg-gradient-to-r from-sky-400 to-blue-500 h-1.5 transition-all duration-300"
              style={{ width: `${(tourStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Header Bar */}
          <div className="p-6 pb-2 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-martian text-[10px] font-bold uppercase tracking-wider">
                {currentStepData.badge}
              </span>
              <span className="text-white/40 font-martian text-xs">
                {tourStep} of {totalSteps}
              </span>
            </div>

            <button
              onClick={closeTour}
              className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Close tour"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-5">
            {/* Title & Icon Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/30 border border-sky-400/30 flex items-center justify-center shrink-0 shadow-inner">
                <AnimatedIcon type="scale">
                  {currentStepData.icon}
                </AnimatedIcon>
              </div>

              <div>
                <h2 className="text-xl font-bricolage font-bold text-white tracking-tight">
                  {currentStepData.title}
                </h2>
                <p className="text-xs text-sky-300/90 font-medium mt-0.5">
                  {currentStepData.subtitle}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-white/80 leading-relaxed font-normal">
              {currentStepData.description}
            </p>

            {/* Highlights Bullet List */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2">
              <div className="text-[11px] font-martian text-white/50 uppercase tracking-wider font-semibold">
                Key Highlights
              </div>
              <ul className="space-y-2 text-xs text-white/90">
                {currentStepData.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-sky-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-6 pt-2 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: Direct Feature Jump Action */}
            <button
              onClick={handleJumpToScreen}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-200 hover:text-white text-xs font-martian font-semibold transition-all cursor-pointer group"
            >
              <span>{currentStepData.actionLabel}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Right: Next / Prev / Skip Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {tourStep > 1 && (
                <button
                  onClick={handlePrev}
                  className="px-3 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-white/80 hover:text-white text-xs font-martian transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft size={14} />
                  <span>Back</span>
                </button>
              )}

              <button
                onClick={closeTour}
                className="px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 text-xs font-martian transition-colors cursor-pointer"
              >
                Skip
              </button>

              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-martian text-xs font-bold shadow-md hover:shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{tourStep === totalSteps ? 'Finish Tour' : 'Next Step'}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
