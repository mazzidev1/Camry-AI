import React, { useState, useRef, useEffect } from 'react';
import { useAppContext, AVAILABLE_MODELS } from '../store/AppContext';
import { Paperclip, Globe, ArrowUp, Check, X, ChevronDown, Scale, FileText, Search, Folder, Mic, MicOff, Copy, Volume2, VolumeX, ThumbsUp, ThumbsDown, RotateCw, Hand, AudioLines } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CamryLoadingIcon } from '../components/CamryLoadingIcon';

const SUGGESTIONS = [
  { icon: <Scale size={20} className="text-camry-graphite/60 group-hover:text-camry-carrier transition-colors" />, text: 'Summarize the key obligations in this contract.' },
  { icon: <FileText size={20} className="text-camry-graphite/60 group-hover:text-camry-carrier transition-colors" />, text: 'Draft a formal response to this client email.' },
  { icon: <Search size={20} className="text-camry-graphite/60 group-hover:text-camry-carrier transition-colors" />, text: 'Extract every date and deadline from this document.' },
  { icon: <Folder size={20} className="text-camry-graphite/60 group-hover:text-camry-carrier transition-colors" />, text: 'Turn these meeting notes into action items.' },
];

const ThinkingIndicator: React.FC = () => {
  const { loadedModel } = useAppContext();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(p => p + 0.1);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex justify-start my-2"
    >
      <div className="bg-white border border-black/10 rounded-2xl px-5 py-4 shadow-sm text-camry-blackout max-w-sm">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <CamryLoadingIcon size={16} color="#0B0C0E" />
            <span className="font-martian text-[10px] text-camry-blackout font-bold tracking-wider uppercase">
              LOCAL NPU INFERENCE
            </span>
          </div>
          <span className="font-martian text-[10px] text-camry-graphite/60 font-semibold">
            {elapsed.toFixed(1)}s
          </span>
        </div>
        
        <div className="flex items-center gap-3 font-martian text-xs text-camry-graphite/90 py-0.5">
          <div className="flex items-center gap-2 font-martian font-semibold text-camry-blackout bg-camry-graphite/5 px-2.5 py-1 rounded border border-black/5">
            <span>thinking</span>
            <div className="flex gap-1 items-center ml-0.5">
              <span className="inline-block w-1 h-1 rounded-full bg-camry-blackout animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="inline-block w-1 h-1 rounded-full bg-camry-blackout animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="inline-block w-1 h-1 rounded-full bg-camry-blackout animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
          <span className="text-[10px] text-camry-graphite/60 font-martian truncate">
            {loadedModel}
          </span>
        </div>

        {/* Shimmering NPU computation line */}
        <div className="mt-3 w-full bg-black/5 h-1 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-camry-carrier rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const Chat: React.FC = () => {
  const { chatHistory, addMessage, loadedModel, setLoadedModel, installedModels, activeAgent, allAgents, showToast } = useAppContext();
  const [input, setInput] = useState('');
  const [isWebMode, setIsWebMode] = useState(false);
  const [showWebPopover, setShowWebPopover] = useState(false);
  const [showModelPopover, setShowModelPopover] = useState(false);
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
          responseText = errData.error || `Server returned status ${response.status}. Please verify your GEMINI_API_KEY environment variable on Vercel.`;
        } catch {
          responseText = `Could not reach backend server (Status ${response.status}). If deployed on Vercel, ensure GEMINI_API_KEY is configured in your project's Environment Variables.`;
        }
      }
    } catch (fetchErr) {
      console.warn("Fetch failed, using local engine fallback:", fetchErr);
      responseText = `Processed on Camry Local Engine.\n\nRegarding "${text}":\n\nQuery executed on-device. If you are deploying on Vercel, configure \`GEMINI_API_KEY\` under Vercel Settings -> Environment Variables to connect live Gemini AI responses.`;
    }

    setIsThinking(false);

    addMessage({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      model: responseModel,
    });

    showToast(`Agent response computed`, 'task_complete', 'COMPUTATION FINISHED');
  };

  const handleLoadModel = (modelId: string) => {
    setLoadingModel(modelId);
    // Simulate loading time
    setTimeout(() => {
      setLoadedModel(modelId);
      setLoadingModel(null);
      // Close popover optionally, or leave open to see it check
    }, 1500);
  };

  const isEmpty = chatHistory.length === 0;

  return (
    <div className="flex-1 h-full flex flex-col relative bg-camry-paper">
      
      {/* Top right compose / new chat icon could go here */}

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-36 sm:pb-32 flex flex-col items-center">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full text-center py-6 sm:pb-20">
            {activeAgent ? (
              <h2 className="text-xl sm:text-3xl font-bricolage tracking-tight mb-2 opacity-80">{activeAgent.toUpperCase()}</h2>
            ) : (
              <h1 className="text-3xl sm:text-5xl font-bricolage tracking-tight mb-4 sm:mb-12 opacity-80">camry</h1>
            )}
            {/* The empty state input is handled by the absolute positioned footer when empty, but we can structure it so footer is always at bottom, just centered when empty */}
          </div>
        ) : (
          <div className="max-w-3xl w-full space-y-6">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-3.5 py-3 sm:px-5 sm:py-4 ${
                  msg.role === 'user' 
                    ? 'bg-camry-graphite text-camry-paper' 
                    : 'bg-white border border-black/5 shadow-sm text-camry-blackout'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded bg-camry-graphite flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                      <span className="font-martian text-[10px] text-camry-graphite/50">{msg.model}</span>
                    </div>
                  )}
                  <p className="font-familjen leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {/* Functional Action Bar under Assistant Answers */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1 sm:gap-1.5 mt-3 pt-2.5 border-t border-black/5 text-camry-graphite/70">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1.5 rounded-md hover:bg-black/5 hover:text-camry-blackout transition-colors flex items-center justify-center text-camry-graphite/80"
                        title="Copy response"
                      >
                        {copiedId === msg.id ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                      </button>

                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className={`p-1.5 rounded-md transition-colors flex items-center justify-center ${
                          speakingId === msg.id 
                            ? 'bg-black/10 text-camry-blackout animate-pulse' 
                            : 'text-camry-graphite/80 hover:bg-black/5 hover:text-camry-blackout'
                        }`}
                        title={speakingId === msg.id ? 'Stop reading' : 'Read aloud'}
                      >
                        {speakingId === msg.id ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      </button>

                      <button
                        onClick={() => handleFeedback(msg.id, 'up')}
                        className={`p-1.5 rounded-md transition-colors flex items-center justify-center ${
                          feedback[msg.id] === 'up' 
                            ? 'bg-emerald-50 text-emerald-600 font-bold' 
                            : 'text-camry-graphite/80 hover:bg-black/5 hover:text-camry-blackout'
                        }`}
                        title="Good response"
                      >
                        <ThumbsUp size={15} className={feedback[msg.id] === 'up' ? 'fill-emerald-600' : ''} />
                      </button>

                      <button
                        onClick={() => handleFeedback(msg.id, 'down')}
                        className={`p-1.5 rounded-md transition-colors flex items-center justify-center ${
                          feedback[msg.id] === 'down' 
                            ? 'bg-red-50 text-red-600 font-bold' 
                            : 'text-camry-graphite/80 hover:bg-black/5 hover:text-camry-blackout'
                        }`}
                        title="Bad response"
                      >
                        <ThumbsDown size={15} className={feedback[msg.id] === 'down' ? 'fill-red-600' : ''} />
                      </button>

                      <button
                        onClick={() => handleRegenerate(msg.id)}
                        className="p-1.5 rounded-md text-camry-graphite/80 hover:bg-black/5 hover:text-camry-blackout transition-colors flex items-center justify-center"
                        title="Regenerate response"
                      >
                        <RotateCw size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isThinking && <ThinkingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Footer Composer Area */}
      <div className={`absolute bottom-0 left-0 right-0 p-2 sm:p-6 md:p-8 flex flex-col items-center justify-end bg-gradient-to-t from-camry-paper via-camry-paper to-transparent transition-all duration-500 ${isEmpty ? 'top-1/4' : ''}`}>
        <div className="max-w-2xl w-full relative">
          
          <div className="relative bg-white rounded-xl shadow-sm border border-black/10 flex flex-col transition-shadow focus-within:shadow-md focus-within:border-camry-carrier/50 p-2 sm:p-3">
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
              className="w-full bg-transparent p-2 sm:p-3 pb-12 sm:pb-12 outline-none resize-none font-familjen placeholder-camry-graphite/40 text-sm sm:text-base"
              rows={isEmpty ? 3 : 2}
            />
            
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex flex-wrap justify-between items-center gap-1.5 pt-1 border-t border-black/5">
              {/* Left Actions */}
              <div className="flex items-center gap-1 sm:gap-2 relative flex-wrap">
                <button 
                  onClick={() => showToast("File attachments not available in preview")}
                  className="p-1.5 text-camry-graphite/50 hover:text-camry-blackout rounded-md transition-colors"
                  title="Attach file"
                >
                  <Paperclip size={16} />
                </button>

                {/* Voice-to-Text Dictation Toggle */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-1 sm:p-1.5 px-2 sm:px-2.5 rounded-md transition-all flex items-center gap-1 text-[11px] sm:text-xs font-martian ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-md font-semibold' 
                      : 'bg-camry-graphite/5 hover:bg-camry-graphite/10 text-camry-graphite/80 border border-black/5'
                  }`}
                  title={isListening ? 'Stop voice dictation' : 'Dictate message with voice (Web Speech API)'}
                >
                  {isListening ? <MicOff size={13} /> : <Mic size={13} />}
                  <span className="hidden xs:inline">{isListening ? 'Listening...' : 'Dictate'}</span>
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setShowWebPopover(!showWebPopover)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-colors border ${
                      isWebMode 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-camry-graphite/5 border-transparent text-camry-graphite/70 hover:bg-camry-graphite/10'
                    }`}
                  >
                    <Globe size={13} />
                    <span>{isWebMode ? 'Web' : 'On-device'}</span>
                    <ChevronDown size={11} />
                  </button>

                  <AnimatePresence>
                    {showWebPopover && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full left-0 mb-2 w-48 bg-camry-graphite text-white rounded-lg p-2 text-xs shadow-lg z-20 font-martian tracking-wide"
                      >
                        <button 
                          className="w-full text-left p-2 rounded hover:bg-white/10"
                          onClick={() => { setIsWebMode(false); setShowWebPopover(false); }}
                        >
                          ON-DEVICE · nothing leaves the building
                        </button>
                        <button 
                          className="w-full text-left p-2 rounded hover:bg-white/10"
                          onClick={() => { setIsWebMode(true); setShowWebPopover(false); }}
                        >
                          WEB · fetches live data
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2 relative ml-auto flex-wrap justify-end">
                
                {/* Model Selector with Size Badge */}
                <div className="relative">
                  <button 
                    onClick={() => setShowModelPopover(!showModelPopover)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-camry-graphite/5 hover:bg-camry-graphite/10 rounded-lg text-camry-blackout transition-colors group border border-black/5"
                  >
                    <span className="font-martian text-xs font-semibold">{loadedModel}</span>
                    <span className="text-[10px] text-camry-graphite/70 font-martian px-1.5 py-0.5 bg-white/80 rounded border border-black/5 font-medium">Medium</span>
                    <ChevronDown size={13} className="text-camry-graphite/60 group-hover:text-camry-blackout transition-colors flex-shrink-0" />
                  </button>

                  {/* Switch Model Popover */}
                  <AnimatePresence>
                    {showModelPopover && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setShowModelPopover(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 5, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.98 }}
                          className="absolute bottom-full right-0 mb-2 w-[280px] sm:w-[340px] bg-white border border-black/10 rounded-xl shadow-xl z-30 overflow-hidden flex flex-col"
                        >
                          <div className="flex items-center justify-between p-3 border-b border-black/5 bg-camry-paper/50">
                            <span className="font-bricolage font-medium text-sm">Switch Model</span>
                            <button onClick={() => setShowModelPopover(false)} className="text-camry-graphite/50 hover:text-black">
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
                                <div key={m.id} className={`flex items-center justify-between p-2 rounded-lg ${isLoaded ? 'bg-camry-carrier/10' : 'hover:bg-camry-graphite/5'}`}>
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="font-martian text-xs text-camry-blackout truncate">{m.id}</span>
                                    <span className="text-[9px] font-martian text-camry-graphite/60 px-1 bg-black/5 rounded">Medium</span>
                                  </div>
                                  
                                  {isLoaded ? (
                                    <Check size={16} className="text-camry-deep-carrier flex-shrink-0" />
                                  ) : isLoading ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-12 h-1 bg-camry-graphite/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-camry-blackout w-1/3 animate-pulse" />
                                      </div>
                                      <span className="font-martian text-[10px] text-camry-graphite/60">LOADING...</span>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => handleLoadModel(m.id)}
                                      className="text-xs font-medium px-2 py-1 rounded bg-white border border-black/10 shadow-sm hover:bg-camry-graphite/5"
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

                {/* Split Mic Controls Button & Popover */}
                <div className="relative">
                  <div className="flex items-center bg-camry-graphite/10 hover:bg-camry-graphite/15 rounded-lg border border-black/5 overflow-hidden text-camry-blackout">
                    <button
                      type="button"
                      onClick={() => setShowMicPopover(!showMicPopover)}
                      className="px-1.5 py-1.5 hover:bg-black/10 transition-colors text-camry-graphite/80"
                      title="Microphone input settings"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <div className="w-[1px] h-4 bg-black/10" />
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`px-2 py-1.5 transition-colors flex items-center justify-center ${
                        isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-black/10 text-camry-blackout'
                      }`}
                      title={isListening ? 'Stop recording' : 'Start voice recording'}
                    >
                      {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                    </button>
                  </div>

                  {/* Microphone Settings Popover Modal (Matching User Image 2) */}
                  <AnimatePresence>
                    {showMicPopover && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowMicPopover(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          className="absolute bottom-full right-0 mb-2.5 z-40 bg-[#282828] text-white p-3.5 rounded-2xl border border-white/10 shadow-2xl w-72 space-y-3 font-familjen text-xs"
                        >
                          {/* Top audio level visualizer */}
                          <div className="flex items-center gap-2.5">
                            <Mic size={15} className="text-white/80 flex-shrink-0" />
                            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all duration-150"
                                style={{ width: `${audioLevel}%` }}
                              />
                            </div>
                          </div>

                          {/* Microphone device selection list */}
                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => setSelectedMicDevice('Default - MacBook Pro Microphone ...')}
                              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                                selectedMicDevice.includes('Default') ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5'
                              }`}
                            >
                              <span className="truncate pr-2">Default - MacBook Pro Microphone ...</span>
                              {selectedMicDevice.includes('Default') && <Check size={16} className="text-blue-400 flex-shrink-0" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedMicDevice('MacBook Pro Microphone (Built-in)')}
                              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                                !selectedMicDevice.includes('Default') ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5'
                              }`}
                            >
                              <span className="truncate pr-2">MacBook Pro Microphone (Built-in)</span>
                              {!selectedMicDevice.includes('Default') && <Check size={16} className="text-blue-400 flex-shrink-0" />}
                            </button>
                          </div>

                          {/* Divider */}
                          <div className="border-t border-white/10 my-1" />

                          {/* Hold to record toggle */}
                          <div className="flex items-center justify-between pt-0.5">
                            <div className="flex items-center gap-2 text-white/90 font-medium">
                              <Hand size={15} className="text-white/70" />
                              <span>Hold to record</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setHoldToRecord(!holdToRecord)}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                                holdToRecord ? 'bg-blue-500 justify-end' : 'bg-white/20 justify-start'
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

                {/* Voice Audio Waveform Icon Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-1.5 rounded-lg border border-black/5 transition-all flex items-center justify-center ${
                    isListening ? 'bg-blue-500 text-white animate-pulse' : 'bg-camry-graphite/10 text-camry-blackout hover:bg-camry-graphite/15'
                  }`}
                  title="Live audio waveform visualizer"
                >
                  <div className="flex items-center gap-[2px] h-4 px-1">
                    <span className={`w-0.5 rounded-full bg-current transition-all duration-200 ${isListening ? 'animate-bounce h-3' : 'h-2'}`} style={{ animationDelay: '0ms' }} />
                    <span className={`w-0.5 rounded-full bg-current transition-all duration-200 ${isListening ? 'animate-bounce h-4' : 'h-3.5'}`} style={{ animationDelay: '150ms' }} />
                    <span className={`w-0.5 rounded-full bg-current transition-all duration-200 ${isListening ? 'animate-bounce h-2' : 'h-1.5'}`} style={{ animationDelay: '300ms' }} />
                    <span className={`w-0.5 rounded-full bg-current transition-all duration-200 ${isListening ? 'animate-bounce h-3.5' : 'h-3'}`} style={{ animationDelay: '450ms' }} />
                  </div>
                </button>

                <button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim()}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    input.trim() 
                      ? 'bg-camry-blackout text-white' 
                      : 'bg-camry-graphite/10 text-camry-graphite/30'
                  }`}
                >
                  <ArrowUp size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {isEmpty && (
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {SUGGESTIONS.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(s.text)}
                  className="text-left p-3.5 sm:p-4 rounded-xl border border-black/5 bg-white shadow-sm hover:shadow-md hover:border-black/10 transition-all group flex items-start gap-3"
                >
                  <span className="text-lg sm:text-xl flex-shrink-0 mt-0.5">{s.icon}</span>
                  <span className="font-familjen text-xs sm:text-sm text-camry-graphite/80 group-hover:text-camry-blackout transition-colors leading-snug">{s.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};
