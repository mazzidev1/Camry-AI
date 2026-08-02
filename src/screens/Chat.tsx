import React, { useState, useRef, useEffect } from 'react';
import { useAppContext, AVAILABLE_MODELS, GeneratedDocument } from '../store/AppContext';
import { 
  Paperclip, Globe, ArrowUp, Check, X, ChevronDown, Scale, FileText, Search, 
  Folder, Mic, MicOff, Copy, Volume2, VolumeX, ThumbsUp, ThumbsDown, RotateCw, 
  Hand, Download, Eye, Files, Sparkles, ExternalLink, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CamryLoadingIcon } from '../components/CamryLoadingIcon';
import { DocumentViewer } from '../components/DocumentViewer';
import { CamryOrb } from '../components/CamryOrb';
import { CamryMascot } from '../components/CamryMascot';
import { AgentLogo } from '../components/AgentLogo';
import { AxolotlStatusBadge } from '../components/AxolotlStatusBadge';
import { AxolotlVariantCard } from '../components/AxolotlVariants';

const SUGGESTIONS = [
  { icon: <Scale size={20} className="text-camry-graphite/60 group-hover:text-camry-blackout transition-colors" />, text: 'Summarize the key obligations in this contract.' },
  { icon: <FileText size={20} className="text-camry-graphite/60 group-hover:text-camry-blackout transition-colors" />, text: 'Draft a formal prompt for Camry desktop app design.' },
  { icon: <Search size={20} className="text-camry-graphite/60 group-hover:text-camry-blackout transition-colors" />, text: 'Extract every date and deadline from this document.' },
  { icon: <Folder size={20} className="text-camry-graphite/60 group-hover:text-camry-blackout transition-colors" />, text: 'Turn these meeting notes into action items.' },
];

const VoiceWaveIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="6" y1="10" x2="6" y2="14" />
    <line x1="10" y1="6" x2="10" y2="18" />
    <line x1="14" y1="8" x2="14" y2="16" />
    <line x1="18" y1="11" x2="18" y2="13" />
  </svg>
);

const ThinkingIndicator: React.FC = () => {
  const { loadedModel, themeMode } = useAppContext();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(p => p + 0.1);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const isLight = themeMode === 'light';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex flex-col items-start my-2 space-y-3 w-full max-w-2xl"
    >
      {/* NPU Computation Status Card */}
      <div className={`border rounded-2xl px-4 sm:px-5 py-3.5 shadow-sm w-full sm:w-auto min-w-[280px] transition-colors duration-200 ${
        isLight ? 'bg-white border-[#E2DDD5] text-[#18181B]' : 'bg-[#16161A] border-[#2E2E38] text-white'
      }`}>
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <CamryMascot size={22} mood="thinking" animated={true} />
            <span className={`font-mono text-[10px] font-bold tracking-wider uppercase ${
              isLight ? 'text-zinc-700' : 'text-zinc-300'
            }`}>
              LOCAL NPU INFERENCE
            </span>
          </div>
          <span className="font-mono text-[10px] text-zinc-400 font-semibold">
            {elapsed.toFixed(1)}s
          </span>
        </div>
        
        <div className="flex items-center gap-3 font-mono text-xs py-0.5">
          <div className={`flex items-center gap-2 font-semibold px-2.5 py-1 rounded-xl border ${
            isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-800' : 'bg-white/5 border-white/10 text-white'
          }`}>
            <span>thinking</span>
            <div className="flex gap-1 items-center ml-0.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full animate-bounce ${isLight ? 'bg-zinc-800' : 'bg-white'}`} style={{ animationDelay: '0ms' }} />
              <span className={`inline-block w-1.5 h-1.5 rounded-full animate-bounce ${isLight ? 'bg-zinc-800' : 'bg-white'}`} style={{ animationDelay: '150ms' }} />
              <span className={`inline-block w-1.5 h-1.5 rounded-full animate-bounce ${isLight ? 'bg-zinc-800' : 'bg-white'}`} style={{ animationDelay: '300ms' }} />
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[140px]">
            {loadedModel}
          </span>
        </div>

        {/* Shimmering NPU computation line */}
        <div className={`mt-3 w-full h-1 rounded-full overflow-hidden relative ${isLight ? 'bg-zinc-100' : 'bg-white/5'}`}>
          <motion.div 
            className={`h-full rounded-full ${isLight ? 'bg-sky-500' : 'bg-sky-400'}`}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Response Message Skeleton */}
      <div className={`border rounded-2xl p-4 sm:p-5 shadow-sm w-full max-w-xl space-y-3 transition-colors duration-200 ${
        isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#16161A] border-[#2E2E38]'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-lg flex items-center justify-center ${isLight ? 'bg-zinc-200' : 'bg-white/10'}`}>
            <div className={`w-1 h-1 rounded-full ${isLight ? 'bg-zinc-400' : 'bg-white/50'}`} />
          </div>
          <div className={`h-3 w-24 rounded animate-pulse ${isLight ? 'bg-zinc-200' : 'bg-white/10'}`} />
        </div>
        
        <div className="space-y-2 pt-1">
          <div className={`h-4 rounded-xl w-11/12 animate-pulse ${isLight ? 'bg-zinc-200' : 'bg-white/10'}`} />
          <div className={`h-4 rounded-xl w-4/5 animate-pulse ${isLight ? 'bg-zinc-200' : 'bg-white/10'}`} />
          <div className={`h-4 rounded-xl w-3/5 animate-pulse ${isLight ? 'bg-zinc-200' : 'bg-white/10'}`} />
        </div>
      </div>
    </motion.div>
  );
};

export const Chat: React.FC = () => {
  const { 
    chatHistory, 
    addMessage, 
    loadedModel, 
    setLoadedModel, 
    installedModels, 
    activeAgent, 
    allAgents, 
    showToast,
    activeDocument,
    setActiveDocument,
    sessionDocuments,
    addDocument,
    kbDocuments,
    pendingChatPrompt,
    setPendingChatPrompt,
    setCurrentScreen,
    themeMode
  } = useAppContext();

  const isLight = themeMode === 'light';

  const [input, setInput] = useState('');

  // Handle pending prompt passed from Knowledge Base or Library
  useEffect(() => {
    if (pendingChatPrompt) {
      setInput(pendingChatPrompt);
      setPendingChatPrompt(null);
    }
  }, [pendingChatPrompt, setPendingChatPrompt]);
  const [isWebMode, setIsWebMode] = useState(false);
  const [showPlusPopover, setShowPlusPopover] = useState(false);
  const [showWebPopover, setShowWebPopover] = useState(false);
  const [showModelPopover, setShowModelPopover] = useState(false);
  const [showDocsListModal, setShowDocsListModal] = useState(false);
  const [isDocExpanded, setIsDocExpanded] = useState(false);

  const [loadingModel, setLoadingModel] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  
  // Voice-to-Text & Mic options state
  const [isListening, setIsListening] = useState(false);
  const [showMicPopover, setShowMicPopover] = useState(false);
  const [selectedMicDevice, setSelectedMicDevice] = useState('Default - MacBook Pro Microphone ...');
  const [holdToRecord, setHoldToRecord] = useState(true);
  const [audioLevel, setAudioLevel] = useState(65);
  const recognitionRef = useRef<any>(null);

  // Animate audio level indicator when mic popover is open or dictating
  useEffect(() => {
    let timer: any;
    if (showMicPopover || isListening) {
      timer = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 50) + 35);
      }, 180);
    }
    return () => clearInterval(timer);
  }, [showMicPopover, isListening]);

  // Message Action Bar state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Response copied to clipboard');
    setTimeout(() => {
      setCopiedId(prev => (prev === id ? null : prev));
    }, 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech not supported in this browser environment');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      showToast('Speech stopped');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
    showToast('Reading response aloud...');
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedback(prev => {
      const current = prev[id];
      if (current === type) {
        const copy = { ...prev };
        delete copy[id];
        showToast('Feedback removed');
        return copy;
      }
      showToast(type === 'up' ? 'Feedback saved: Helpful response' : 'Feedback saved: Unhelpful response');
      return { ...prev, [id]: type };
    });
  };

  const handleRegenerate = (msgId: string) => {
    const idx = chatHistory.findIndex(m => m.id === msgId);
    let userPrompt = '';

    if (idx !== -1) {
      for (let i = idx - 1; i >= 0; i--) {
        if (chatHistory[i].role === 'user') {
          userPrompt = chatHistory[i].content;
          break;
        }
      }
    }

    if (!userPrompt) {
      const lastUserMsg = [...chatHistory].reverse().find(m => m.role === 'user');
      if (lastUserMsg) userPrompt = lastUserMsg.content;
    }

    if (!userPrompt) {
      showToast('No prompt found to regenerate response');
      return;
    }

    showToast('Regenerating answer...');
    handleSend(userPrompt);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      showToast('Voice dictation paused');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Web Speech API is not supported in this browser environment');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        showToast(`Dictation status: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
      showToast('Listening... Speak to dictate your message');
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      showToast('Could not initialize speech recognition microphone input');
      setIsListening(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isThinking]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: text,
      model: loadedModel
    });
    
    setInput('');
    setIsThinking(true);
    
    const activeAgentObj = activeAgent ? allAgents.find(a => a.id === activeAgent) : null;
    
    let responseText = '';
    let responseModel = loadedModel;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          agentName: activeAgentObj ? activeAgentObj.name : undefined,
          systemInstruction: activeAgentObj?.systemPrompt || activeAgentObj?.description,
          modelName: loadedModel,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        responseText = data.text || 'No response returned.';
        responseModel = data.model || loadedModel;
      } else {
        try {
          const errData = await response.json();
          responseText = errData.error || `Server returned status ${response.status}.`;
        } catch {
          responseText = `Could not reach backend server (Status ${response.status}).`;
        }
      }
    } catch (fetchErr) {
      console.warn("Fetch failed, using local engine fallback:", fetchErr);
      responseText = `Processed on Camry Local Engine.\n\nRegarding "${text}":\n\nQuery executed on-device.`;
    }

    setIsThinking(false);

    // Auto-detect document generation in assistant output
    let commentary = responseText;
    let generatedDoc: GeneratedDocument | undefined = undefined;

    // Check for markdown codeblocks ```markdown ... ``` or ```doc ... ```
    const codeBlockMatch = responseText.match(/```(?:markdown|doc|txt|md)?\s*([\s\S]*?)```/i);
    if (codeBlockMatch && codeBlockMatch[1].trim().length > 40) {
      const docBody = codeBlockMatch[1].trim();
      const firstHeader = docBody.split('\n').find(l => l.startsWith('#'))?.replace(/^#+\s*/, '') || 'Generated Document';
      const docTitle = firstHeader.length > 40 ? firstHeader.slice(0, 40) + '...' : firstHeader;
      
      commentary = responseText.replace(/```(?:markdown|doc|txt|md)?\s*[\s\S]*?```/gi, '').trim() || 
        `I've compiled "${docTitle}" for you. Click below to view and open the full document.`;

      generatedDoc = {
        id: `doc-${Date.now()}`,
        title: docTitle,
        type: 'MD',
        content: docBody,
        createdAt: 'Just now',
      };
    } else if (
      text.toLowerCase().includes('doc') || 
      text.toLowerCase().includes('draft') || 
      text.toLowerCase().includes('prompt') || 
      text.toLowerCase().includes('contract') || 
      text.toLowerCase().includes('spec') || 
      text.toLowerCase().includes('summarize')
    ) {
      if (responseText.length > 200) {
        const lines = responseText.split('\n');
        let docTitle = 'Generated Document';
        const firstHeader = lines.find(l => l.startsWith('#'))?.replace(/^#+\s*/, '');
        if (firstHeader) {
          docTitle = firstHeader.length > 35 ? firstHeader.slice(0, 35) + '...' : firstHeader;
        } else {
          docTitle = text.length > 30 ? text.slice(0, 30) + '...' : text;
        }

        const firstSentence = responseText.split(/\.\s|\n/)[0];
        commentary = firstSentence.length < 150 ? `${firstSentence}. I have prepared the complete document:` : 'I have prepared the complete document for you:';

        generatedDoc = {
          id: `doc-${Date.now()}`,
          title: docTitle,
          type: 'MD',
          content: responseText,
          createdAt: 'Just now'
        };
      }
    }

    const assistantMsgId = (Date.now() + 1).toString();

    if (generatedDoc) {
      generatedDoc.messageId = assistantMsgId;
      addDocument(generatedDoc);
      setActiveDocument(generatedDoc);
      showToast(`Generated "${generatedDoc.title}"`, 'success', 'DOCUMENT CREATED');
    } else {
      showToast(`Agent response computed`, 'task_complete', 'COMPUTATION FINISHED');
    }

    addMessage({
      id: assistantMsgId,
      role: 'assistant',
      content: commentary,
      model: responseModel,
      document: generatedDoc
    });
  };

  const handleLoadModel = (modelId: string) => {
    setLoadingModel(modelId);
    setTimeout(() => {
      setLoadedModel(modelId);
      setLoadingModel(null);
    }, 1500);
  };

  const isEmpty = chatHistory.length === 0;

  return (
    <div className="flex-1 h-full flex flex-row relative overflow-hidden transition-colors duration-200 bg-transparent">
      
      {/* Left Chat Main Area */}
      <div className={`flex-1 h-full flex flex-col relative transition-all duration-300 overflow-hidden ${
        activeDocument ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Top Header Bar for Chat Section (Includes Document Icon in Top Right) */}
        <div className={`h-12 border-b border-t-0 border-l-0 border-r-0 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-10 transition-all duration-300 camry-glass rounded-none ${
          isLight ? 'border-[#E2DDD5]' : 'border-white/5'
        }`}>
          <div className="flex items-center gap-2">
            {activeAgent ? (
              <AgentLogo agentId={activeAgent} size={22} className="shrink-0 shadow-sm" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
            <span className={`font-display text-xs sm:text-sm font-bold tracking-tight ${
              isLight ? 'text-[#18181B]' : 'text-white'
            }`}>
              {activeAgent ? (allAgents.find(a => a.id === activeAgent)?.name || activeAgent.toUpperCase()) : 'CAMRY ON-DEVICE CHAT'}
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              isLight ? 'bg-zinc-100 text-zinc-600 border border-[#E2DDD5]' : 'bg-white/5 text-zinc-400'
            }`}>
              {loadedModel}
            </span>
          </div>

          {/* Top Right Controls: Session Documents Icon */}
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowDocsListModal(!showDocsListModal)}
              className={`p-2 rounded-xl transition-all flex items-center gap-2 relative border ${
                sessionDocuments.length > 0 
                  ? 'bg-sky-500 hover:bg-sky-600 text-white border-sky-400' 
                  : isLight 
                    ? 'bg-white border-[#E2DDD5] hover:bg-zinc-100 text-zinc-800'
                    : 'bg-[#16161A] border-[#2E2E38] hover:bg-[#202026] text-white'
              }`}
              title="View generated documents from this chat session"
            >
              <Files size={16} />
              <span className="font-mono text-xs font-bold hidden sm:inline">Docs</span>
              {sessionDocuments.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-sky-600 font-mono text-[9px] font-bold flex items-center justify-center">
                  {sessionDocuments.length}
                </span>
              )}
            </button>

            {/* Session Documents Popover List Modal */}
            <AnimatePresence>
              {showDocsListModal && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowDocsListModal(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className={`absolute top-full right-0 mt-2 z-40 border rounded-2xl shadow-2xl w-80 sm:w-96 p-4 space-y-3 ${
                      isLight ? 'bg-white border-[#E2DDD5] text-[#18181B]' : 'bg-[#16161A] border-[#2E2E38] text-white'
                    }`}
                  >
                    <div className={`flex items-center justify-between border-b pb-2 ${isLight ? 'border-zinc-100' : 'border-white/10'}`}>
                      <div className="flex items-center gap-2">
                        <Files size={18} className="text-sky-500" />
                        <h3 className="font-display text-sm font-bold">
                          Session Documents ({sessionDocuments.length})
                        </h3>
                      </div>
                      <button 
                        onClick={() => setShowDocsListModal(false)}
                        className={`p-1 rounded-lg ${isLight ? 'text-zinc-400 hover:text-black' : 'text-zinc-500 hover:text-white'}`}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {sessionDocuments.length === 0 ? (
                      <div className="text-center py-6 space-y-2">
                        <FileText size={28} className="mx-auto opacity-40 text-sky-500" />
                        <p className="font-sans text-xs font-medium">No documents generated in this session yet.</p>
                        <p className="font-mono text-[10px] text-zinc-400">Ask Camry to draft a contract, design prompt, or spec!</p>
                      </div>
                    ) : (
                      <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                        {sessionDocuments.map(doc => (
                          <div
                            key={doc.id}
                            onClick={() => {
                              setActiveDocument(doc);
                              setShowDocsListModal(false);
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              activeDocument?.id === doc.id 
                                ? 'bg-sky-500/10 border-sky-500/30' 
                                : isLight 
                                  ? 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
                                  : 'bg-[#202026] border-white/5 hover:bg-[#2E2E38]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isLight ? 'bg-zinc-200 text-zinc-800' : 'bg-white/10 text-white'
                              }`}>
                                <FileText size={16} />
                              </div>
                              <div className="min-w-0">
                                <h4 className={`text-xs font-bold truncate ${isLight ? 'text-zinc-800' : 'text-white'}`}>
                                  {doc.title}
                                </h4>
                                <p className="font-mono text-[9px] text-zinc-400">
                                  Document · {doc.type} · {doc.createdAt}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDocument(doc);
                                setShowDocsListModal(false);
                              }}
                              className="p-1.5 rounded-lg bg-sky-500 text-white hover:bg-sky-600 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0"
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Chat Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-36 sm:pb-32 flex flex-col items-center">
          {isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full text-center py-6 pb-20 sm:pb-32">
              {activeAgent ? (
                <AgentLogo 
                  agentId={activeAgent} 
                  name={allAgents.find(a => a.id === activeAgent)?.name} 
                  size={64} 
                  className="mb-5 shadow-2xl" 
                />
              ) : (
                <div className="relative mb-6 flex flex-col items-center">
                  <CamryMascot size={84} variant="full" animated={true} className="shadow-2xl hover:scale-105 transition-transform" />
                  <div className={`mt-3.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border shadow-sm ${
                    isLight ? 'bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/20' : 'bg-[#0066FF]/20 text-blue-300 border-[#0066FF]/40'
                  }`}>
                    Hi, I'm Camry! · Local NPU AI
                  </div>
                </div>
              )}
              
              <h2 className={`text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-2 transition-colors duration-200 ${
                isLight ? 'text-[#18181B]' : 'text-white'
              }`}>
                {activeAgent ? `Hello, I'm ${allAgents.find(a => a.id === activeAgent)?.name || activeAgent}` : 'Hi, there'}
              </h2>
              <p className={`text-sm md:text-base font-sans transition-colors duration-200 mb-8 max-w-md ${
                isLight ? 'text-zinc-500' : 'text-zinc-400'
              }`}>
                Tell us what you need, and we'll handle the rest.
              </p>

              {/* Bento Quick Actions Grid */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setInput("Can you help me answer the pending RFP documentation and verify on-premises security?")}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer shadow-sm flex flex-col justify-between h-28 group ${
                    isLight 
                      ? 'bg-white border-[#E2DDD5] hover:bg-[#EFECE6]' 
                      : 'bg-[#16161A] border-[#2E2E38] hover:bg-[#202026]'
                  }`}
                >
                  <Sparkles size={16} className="text-sky-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-[10px] font-bold font-mono uppercase tracking-wide text-zinc-400 mb-0.5">Task</div>
                    <div className={`text-xs sm:text-[13px] font-semibold leading-tight ${isLight ? 'text-[#18181B]' : 'text-zinc-100'}`}>
                      Answer RFP documentation
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setInput("Analyze our device health logs and run a complete on-premise security audit.")}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer shadow-sm flex flex-col justify-between h-28 group ${
                    isLight 
                      ? 'bg-white border-[#E2DDD5] hover:bg-[#EFECE6]' 
                      : 'bg-[#16161A] border-[#2E2E38] hover:bg-[#202026]'
                  }`}
                >
                  <Globe size={16} className="text-blue-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-[10px] font-bold font-mono uppercase tracking-wide text-zinc-400 mb-0.5">Security</div>
                    <div className={`text-xs sm:text-[13px] font-semibold leading-tight ${isLight ? 'text-[#18181B]' : 'text-zinc-100'}`}>
                      Conduct on-premise audit
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setInput("How is the model performing? I want to provide system feedback regarding performance.")}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer shadow-sm flex flex-col justify-between h-28 group ${
                    isLight 
                      ? 'bg-white border-[#E2DDD5] hover:bg-[#EFECE6]' 
                      : 'bg-[#16161A] border-[#2E2E38] hover:bg-[#202026]'
                  }`}
                >
                  <ThumbsUp size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-[10px] font-bold font-mono uppercase tracking-wide text-zinc-400 mb-0.5">Support</div>
                    <div className={`text-xs sm:text-[13px] font-semibold leading-tight ${isLight ? 'text-[#18181B]' : 'text-zinc-100'}`}>
                      Provide feedback
                    </div>
                  </div>
                </button>
              </div>

              {/* Calendar Integration Card */}
              <div className="w-full mb-6">
                <button
                  onClick={() => showToast("Syncing with corporate calendar (simulated)")}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer shadow-sm flex items-center justify-between group ${
                    isLight 
                      ? 'bg-[#EFECE6] border-[#E2DDD5] hover:bg-white' 
                      : 'bg-[#202026] border-[#2E2E38] hover:bg-[#2E2E38]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isLight ? 'bg-sky-500/10 text-sky-600' : 'bg-sky-500/20 text-sky-400'
                    }`}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-[#18181B]' : 'text-white'}`}>
                        Connect Calendar
                      </h4>
                      <p className={`text-[10px] sm:text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        Sync your schedule to prep for upcoming briefs automatically
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                    isLight ? 'bg-zinc-200 text-zinc-700' : 'bg-white/10 text-white/90'
                  }`}>
                    Connect
                  </span>
                </button>
              </div>

              {/* Live Axolotl Mascot NPU Activity Status & State Cards in Chat */}
              <div className="w-full text-left space-y-4 pt-2 border-t border-black/5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-zinc-400">
                    AXOLOTL MASCOT SYSTEM STATES & NOTIFICATIONS
                  </span>
                </div>
                
                <AxolotlStatusBadge showSelector={true} className="w-full shadow-sm" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <AxolotlVariantCard 
                    variant="idle" 
                    title="Standby Mode" 
                    description="Zero external telemetry. Local NPU standing by." 
                    actionText="Check Hardware"
                    onAction={() => showToast("Local NPU hardware status: 100% nominal", "success", "NPU READY")}
                  />
                  <AxolotlVariantCard 
                    variant="success" 
                    title="Task Completed" 
                    description="Documents and query vector index successfully synced." 
                    actionText="View Output"
                    onAction={() => showToast("All chat & RAG indexes updated", "success", "SYNC OK")}
                  />
                  <AxolotlVariantCard 
                    variant="empty" 
                    title="No Documents" 
                    description="Query returned zero matching local document files." 
                    actionText="Upload File"
                    onAction={() => setInput("Draft a new contract document for me")}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl w-full space-y-6">
              {chatHistory.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[92%] sm:max-w-[85%] rounded-2xl px-3.5 py-3 sm:px-5 sm:py-4 border transition-all ${
                      isUser 
                        ? isLight 
                          ? 'bg-[#18181B] text-[#EDEBE4] border-zinc-800 shadow-md' 
                          : 'bg-[#202026] text-white border-zinc-800 shadow-md' 
                        : isLight 
                          ? 'bg-white border-[#E2DDD5] text-zinc-900 shadow-sm' 
                          : 'bg-[#16161A] border-[#2E2E38] text-white shadow-md'
                    }`}>
                      {!isUser && (
                        <div className="flex items-center gap-2 mb-2 pb-1 border-b border-zinc-100/10">
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center ${isLight ? 'bg-zinc-100' : 'bg-white/5'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-sky-500' : 'bg-sky-400'}`} />
                          </div>
                          <span className="font-mono text-[10px] text-zinc-400">{msg.model}</span>
                        </div>
                      )}

                      {/* Commentary Text */}
                      <p className="font-sans leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                        {msg.content}
                      </p>

                      {/* Knowledge Base Citation Chips */}
                      {!isUser && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-zinc-100/10">
                          <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider">CITED SOURCES:</span>
                          <button
                            onClick={() => setCurrentScreen('knowledgeBase')}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold border transition-all ${
                              isLight 
                                ? 'bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-700' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                            }`}
                          >
                            <FileText size={10} />
                            <span>Company Handbook.pdf</span>
                          </button>
                          <button
                            onClick={() => setCurrentScreen('knowledgeBase')}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold border transition-all ${
                              isLight 
                                ? 'bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-700' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                            }`}
                          >
                            <FileText size={10} />
                            <span>Employment Policy 2026.docx</span>
                          </button>
                        </div>
                      )}

                      {/* Clickable Document Card inside Chat Bubble */}
                      {msg.document && (
                        <div 
                          onClick={() => setActiveDocument(msg.document!)}
                          className={`mt-3 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-sm ${
                            isLight 
                              ? 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100' 
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-zinc-300 dark:group-hover:bg-white/20 transition-colors ${
                              isLight ? 'bg-zinc-200 text-zinc-700' : 'bg-white/10 text-white'
                            }`}>
                              <FileText size={20} />
                            </div>
                            <div className="min-w-0">
                              <h4 className={`font-display font-bold text-xs sm:text-sm truncate transition-colors ${
                                isLight ? 'text-[#18181B] group-hover:text-black' : 'text-white group-hover:text-white'
                              }`}>
                                {msg.document.title}
                              </h4>
                              <p className="font-mono text-[10px] text-zinc-400">
                                Document · {msg.document.type}
                              </p>
                            </div>
                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDocument(msg.document!);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-sky-500 text-white hover:bg-sky-600 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                          >
                            <Download size={13} />
                            <span className="hidden xs:inline">Download and open</span>
                            <span className="xs:hidden">Open</span>
                          </button>
                        </div>
                      )}

                      {/* Functional Action Bar under Assistant Answers */}
                      {!isUser && (
                        <div className={`flex items-center gap-1 sm:gap-1.5 mt-3 pt-2 border-t text-zinc-400 ${
                          isLight ? 'border-zinc-100' : 'border-white/5'
                        }`}>
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                              isLight ? 'hover:bg-zinc-100 hover:text-black' : 'hover:bg-white/5 hover:text-white'
                            }`}
                            title="Copy response"
                          >
                            {copiedId === msg.id ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                          </button>

                          <button
                            onClick={() => handleSpeak(msg.id, msg.content)}
                            className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                              speakingId === msg.id 
                                ? isLight ? 'bg-zinc-200 text-black animate-pulse' : 'bg-white/15 text-white animate-pulse'
                                : isLight ? 'hover:bg-zinc-100 hover:text-black' : 'hover:bg-white/5 hover:text-white'
                            }`}
                            title={speakingId === msg.id ? 'Stop reading' : 'Read aloud'}
                          >
                            {speakingId === msg.id ? <VolumeX size={15} /> : <Volume2 size={15} />}
                          </button>

                          <button
                            onClick={() => handleFeedback(msg.id, 'up')}
                            className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                              feedback[msg.id] === 'up' 
                                ? 'bg-emerald-500/10 text-emerald-500 font-bold' 
                                : isLight ? 'hover:bg-zinc-100 hover:text-black' : 'hover:bg-white/5 hover:text-white'
                            }`}
                            title="Good response"
                          >
                            <ThumbsUp size={15} className={feedback[msg.id] === 'up' ? 'fill-emerald-500' : ''} />
                          </button>

                          <button
                            onClick={() => handleFeedback(msg.id, 'down')}
                            className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                              feedback[msg.id] === 'down' 
                                ? 'bg-red-500/10 text-red-500 font-bold' 
                                : isLight ? 'hover:bg-zinc-100 hover:text-black' : 'hover:bg-white/5 hover:text-white'
                            }`}
                            title="Bad response"
                          >
                            <ThumbsDown size={15} className={feedback[msg.id] === 'down' ? 'fill-red-500' : ''} />
                          </button>

                          <button
                            onClick={() => handleRegenerate(msg.id)}
                            className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                              isLight ? 'hover:bg-zinc-100 hover:text-black' : 'hover:bg-white/5 hover:text-white'
                            }`}
                            title="Regenerate response"
                          >
                            <RotateCw size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {isThinking && <ThinkingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Footer Composer Area */}
        <div className={`absolute bottom-0 left-0 right-0 p-2 sm:p-6 md:p-8 flex flex-col items-center justify-end bg-gradient-to-t transition-all duration-500 ${
          isLight ? 'from-[#EDEBE4] via-[#EDEBE4]/95' : 'from-[#121418] via-[#121418]/95'
        } to-transparent ${isEmpty ? 'top-1/4' : ''}`}>
          <div className="max-w-2xl w-full relative">
            
            <div className={`relative rounded-2xl shadow-sm border flex flex-col transition-all duration-300 focus-within:shadow-md p-2.5 sm:p-3.5 camry-glass ${
              isLight 
                ? 'border-[#E2DDD5] focus-within:border-sky-500' 
                : 'border-[#2E2E38] focus-within:border-sky-500'
            }`}>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                placeholder="Ask anything..."
                className={`w-full bg-transparent px-1 py-1.5 sm:px-2 sm:py-2 outline-none resize-none font-sans text-sm sm:text-base leading-relaxed ${
                  isLight ? 'text-zinc-900 placeholder-zinc-400' : 'text-white placeholder-zinc-500'
                }`}
                rows={isEmpty ? 2 : 1}
                style={{ minHeight: isEmpty ? '64px' : '44px' }}
              />
                          <div className={`flex items-center justify-between gap-2 pt-2 border-t mt-1.5 ${
                isLight ? 'border-zinc-100' : 'border-white/5'
              }`}>
                {/* Left Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 relative shrink-0 max-w-[70%] sm:max-w-none">
                  
                  {/* Plus / Attach / Options Button */}
                  <div className="relative shrink-0">
                    <button 
                      onClick={() => {
                        setShowPlusPopover(!showPlusPopover);
                        setShowModelPopover(false);
                        setShowMicPopover(false);
                      }}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                        showPlusPopover
                          ? isLight ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-950'
                          : isLight 
                            ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200/80' 
                            : 'bg-[#22222A] hover:bg-[#2C2C36] text-zinc-200 border border-white/10'
                      }`}
                      title="More options (Attach, Search mode, Actions)"
                    >
                      <Plus size={18} strokeWidth={2.5} className={`transition-transform duration-200 ${showPlusPopover ? 'rotate-45' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showPlusPopover && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setShowPlusPopover(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            className={`absolute bottom-full left-0 mb-3 w-72 rounded-2xl p-2 shadow-2xl z-40 border font-sans ${
                              isLight ? 'bg-white border-[#E2DDD5] text-zinc-900' : 'bg-[#1C1C23] border-[#2E2E38] text-white'
                            }`}
                          >
                            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2.5 py-1 font-bold">
                              ATTACH & OPTIONS
                            </div>

                            {/* Option 1: Attach File */}
                            <button 
                              onClick={() => {
                                setShowPlusPopover(false);
                                showToast("File attachment feature active for current session");
                              }}
                              className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${
                                isLight ? 'hover:bg-zinc-100' : 'hover:bg-white/5'
                              }`}
                            >
                              <div className={`p-2 rounded-lg shrink-0 ${isLight ? 'bg-zinc-100 text-zinc-700' : 'bg-white/10 text-zinc-200'}`}>
                                <Paperclip size={16} />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-semibold">Attach File or Document</div>
                                <div className="text-[10px] text-zinc-400 truncate">PDF, TXT, DOCX, Code files</div>
                              </div>
                            </button>

                            <div className={`my-1 border-t ${isLight ? 'border-zinc-100' : 'border-white/5'}`} />

                            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2.5 py-1 font-bold">
                              SEARCH ENGINE MODE
                            </div>

                            {/* Option 2A: On-device */}
                            <button 
                              onClick={() => {
                                setIsWebMode(false);
                                setShowPlusPopover(false);
                                showToast("Switched to On-device (offline) mode");
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                                !isWebMode 
                                  ? isLight ? 'bg-zinc-100 font-semibold' : 'bg-white/10 font-semibold'
                                  : isLight ? 'hover:bg-zinc-100' : 'hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`p-1.5 rounded-lg shrink-0 ${!isWebMode ? 'bg-sky-500/10 text-sky-500' : 'text-zinc-400'}`}>
                                  <Scale size={15} />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold">On-device Engine</div>
                                  <div className="text-[10px] text-zinc-400 truncate">Offline · Privacy first local model</div>
                                </div>
                              </div>
                              {!isWebMode && <Check size={16} className="text-sky-500 shrink-0 ml-1" />}
                            </button>

                            {/* Option 2B: Web Live Search */}
                            <button 
                              onClick={() => {
                                setIsWebMode(true);
                                setShowPlusPopover(false);
                                showToast("Switched to Live Web Search mode");
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                                isWebMode 
                                  ? isLight ? 'bg-zinc-100 font-semibold' : 'bg-white/10 font-semibold'
                                  : isLight ? 'hover:bg-zinc-100' : 'hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`p-1.5 rounded-lg shrink-0 ${isWebMode ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-400'}`}>
                                  <Globe size={15} />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold">Web Search Live</div>
                                  <div className="text-[10px] text-zinc-400 truncate">Real-time web grounding search</div>
                                </div>
                              </div>
                              {isWebMode && <Check size={16} className="text-emerald-500 shrink-0 ml-1" />}
                            </button>

                            <div className={`my-1 border-t ${isLight ? 'border-zinc-100' : 'border-white/5'}`} />

                            {/* Option 3: Quick Action */}
                            <button 
                              onClick={() => {
                                setShowPlusPopover(false);
                                showToast("Chat session refreshed");
                              }}
                              className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-medium transition-colors ${
                                isLight ? 'hover:bg-zinc-100 text-zinc-700' : 'hover:bg-white/5 text-zinc-300'
                              }`}
                            >
                              <Sparkles size={15} className="text-amber-500 shrink-0" />
                              <span>Quick prompt recommendations</span>
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Model Selector Pill right next to the plus button */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setShowModelPopover(!showModelPopover);
                        setShowPlusPopover(false);
                        setShowMicPopover(false);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-full font-sans transition-all border shadow-sm cursor-pointer ${
                        isLight 
                          ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-900' 
                          : 'bg-[#22222A] hover:bg-[#2C2C36] border-white/10 text-white'
                      }`}
                    >
                      <span className="font-mono text-xs font-bold truncate max-w-[100px] min-[400px]:max-w-[140px] sm:max-w-[190px]">
                        {loadedModel}
                      </span>
                      {isWebMode && (
                        <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-mono font-bold shrink-0">
                          WEB
                        </span>
                      )}
                      <ChevronDown size={13} className="text-zinc-400 shrink-0" />
                    </button>

                    <AnimatePresence>
                      {showModelPopover && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setShowModelPopover(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 5, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                            className={`absolute bottom-full left-0 mb-2 w-[280px] sm:w-[320px] border rounded-2xl shadow-2xl z-30 overflow-hidden flex flex-col ${
                              isLight ? 'bg-white border-[#E2DDD5] text-zinc-900' : 'bg-[#16161A] border-[#2E2E38] text-white'
                            }`}
                          >
                            <div className={`flex items-center justify-between p-3 border-b ${
                              isLight ? 'bg-zinc-50 border-zinc-100' : 'bg-white/5 border-white/5'
                            }`}>
                              <span className="font-display font-bold text-sm">Switch Model</span>
                              <button onClick={() => setShowModelPopover(false)} className={`p-1 rounded ${isLight ? 'hover:bg-zinc-200 text-zinc-400 hover:text-black' : 'hover:bg-white/5 text-zinc-500 hover:text-white'}`}>
                                <X size={16} />
                              </button>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                              {AVAILABLE_MODELS.map(m => {
                                const isLoaded = loadedModel === m.id;
                                const isInstalled = installedModels.includes(m.id);
                                const isLoading = loadingModel === m.id;
                                
                                if (!isInstalled && !isLoading && !isLoaded) return null;
                                
                                return (
                                  <div key={m.id} className={`flex items-center justify-between p-2 rounded-xl transition-colors border ${
                                    isLoaded 
                                      ? isLight 
                                        ? 'bg-zinc-100 border-zinc-200 text-zinc-900 font-bold' 
                                        : 'bg-white/10 border-white/10 text-white font-bold'
                                      : 'border-transparent'
                                  }`}>
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="font-mono text-xs truncate font-medium">{m.id}</span>
                                    </div>
                                    
                                    {isLoaded ? (
                                      <Check size={16} className="text-emerald-500 shrink-0" />
                                    ) : isLoading ? (
                                      <div className="flex items-center gap-2">
                                        <div className="w-12 h-1 bg-zinc-200 rounded-full overflow-hidden">
                                          <div className="h-full bg-emerald-500 w-1/3 animate-pulse" />
                                        </div>
                                        <span className="font-mono text-[9px] text-zinc-400">LOADING...</span>
                                      </div>
                                    ) : (
                                      <button 
                                        onClick={() => handleLoadModel(m.id)}
                                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border shadow-sm transition-colors ${
                                          isLight 
                                            ? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50' 
                                            : 'bg-[#202026] border-zinc-800 text-zinc-300 hover:bg-[#2E2E38]'
                                        }`}
                                      >
                                        Load
                                      </button>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 relative ml-auto shrink-0">
                  
                  {/* Mic Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        toggleListening();
                        setShowMicPopover(!showMicPopover);
                        setShowPlusPopover(false);
                        setShowModelPopover(false);
                      }}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border shadow-sm ${
                        isListening
                          ? 'bg-red-500 border-red-500 text-white animate-pulse'
                          : isLight
                            ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200/80 text-zinc-700'
                            : 'bg-[#22222A] hover:bg-[#2C2C36] border-white/10 text-zinc-200'
                      }`}
                      title="Microphone input settings"
                    >
                      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>

                    <AnimatePresence>
                      {showMicPopover && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setShowMicPopover(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.96 }}
                            className="absolute bottom-full right-0 mb-2.5 z-40 bg-[#1E1E24] text-white p-3.5 rounded-2xl border border-white/10 shadow-2xl w-72 space-y-3 font-mono text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <Mic size={15} className="text-white/80 shrink-0" />
                              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full transition-all duration-150"
                                  style={{ width: `${audioLevel}%` }}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <button
                                type="button"
                                onClick={() => setSelectedMicDevice('Default - MacBook Pro Microphone ...')}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                                  selectedMicDevice.includes('Default') ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5'
                                }`}
                              >
                                <span className="truncate pr-2">Default - MacBook Pro Microphone ...</span>
                                {selectedMicDevice.includes('Default') && <Check size={16} className="text-emerald-400 shrink-0" />}
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedMicDevice('MacBook Pro Microphone (Built-in)')}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                                  !selectedMicDevice.includes('Default') ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5'
                                }`}
                              >
                                <span className="truncate pr-2">MacBook Pro Microphone (Built-in)</span>
                                {!selectedMicDevice.includes('Default') && <Check size={16} className="text-emerald-400 shrink-0" />}
                              </button>
                            </div>

                            <div className="border-t border-white/10 my-1" />

                            <div className="flex items-center justify-between pt-0.5">
                              <div className="flex items-center gap-2 text-white/90 font-medium">
                                <Hand size={15} className="text-white/70" />
                                <span>Hold to record</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => setHoldToRecord(!holdToRecord)}
                                className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                                  holdToRecord ? 'bg-emerald-500 justify-end' : 'bg-white/20 justify-start'
                                }`}
                              >
                                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Send / Voice Mode Action Button */}
                  <button 
                    onClick={() => {
                      if (input.trim()) {
                        handleSend(input);
                      } else {
                        toggleListening();
                      }
                    }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-md shrink-0 active:scale-95 ${
                      input.trim()
                        ? 'bg-[#0066FF] text-white hover:bg-[#0052CC] shadow-[#0066FF]/30'
                        : isLight 
                          ? 'bg-zinc-900 text-white hover:bg-black' 
                          : 'bg-white text-zinc-950 hover:bg-zinc-100'
                    }`}
                    title={input.trim() ? "Send message" : "Voice mode"}
                  >
                    {input.trim() ? (
                      <ArrowUp size={18} strokeWidth={2.5} />
                    ) : (
                      <VoiceWaveIcon size={16} />
                    )}
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Side Document Viewer Panel */}
      <AnimatePresence>
        {activeDocument && (
          <DocumentViewer
            document={activeDocument}
            onClose={() => setActiveDocument(null)}
            isExpanded={isDocExpanded}
            onToggleExpand={() => setIsDocExpanded(!isDocExpanded)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};
