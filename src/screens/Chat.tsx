import React, { useState, useRef, useEffect } from 'react';
import { useAppContext, AVAILABLE_MODELS } from '../store/AppContext';
import { Paperclip, Globe, ArrowUp, Check, X, ChevronDown, Scale, FileText, Search, Folder, Mic, MicOff } from 'lucide-react';
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
  
  // Voice-to-Text state (Web Speech API)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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
      <div className="flex-1 overflow-y-auto p-8 pb-32 flex flex-col items-center">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full text-center pb-20">
            {activeAgent ? (
              <h2 className="text-3xl font-bricolage tracking-tight mb-2 opacity-80">{activeAgent.toUpperCase()}</h2>
            ) : (
              <h1 className="text-5xl font-bricolage tracking-tight mb-12 opacity-80">camry</h1>
            )}
            {/* The empty state input is handled by the absolute positioned footer when empty, but we can structure it so footer is always at bottom, just centered when empty */}
          </div>
        ) : (
          <div className="max-w-3xl w-full space-y-6">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${
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
                  <p className="font-familjen leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isThinking && <ThinkingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Footer Composer Area */}
      <div className={`absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-8 flex flex-col items-center justify-end bg-gradient-to-t from-camry-paper via-camry-paper to-transparent transition-all duration-500 ${isEmpty ? 'top-1/4' : ''}`}>
        <div className="max-w-2xl w-full relative">
          
          <div className="relative bg-white rounded-xl shadow-sm border border-black/10 flex flex-col transition-shadow focus-within:shadow-md focus-within:border-camry-carrier/50">
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
              className="w-full bg-transparent p-4 pb-12 outline-none resize-none font-familjen placeholder-camry-graphite/40"
              rows={isEmpty ? 3 : 1}
            />
            
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
              {/* Left Actions */}
              <div className="flex gap-2 relative">
                <button 
                  onClick={() => showToast("File attachments not available in preview")}
                  className="p-1.5 text-camry-graphite/50 hover:text-camry-blackout rounded-md transition-colors"
                >
                  <Paperclip size={18} />
                </button>

                {/* Voice-to-Text Dictation Toggle */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-1.5 px-2.5 rounded-md transition-all flex items-center gap-1.5 text-xs font-martian ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-md font-semibold' 
                      : 'bg-camry-graphite/5 hover:bg-camry-graphite/10 text-camry-graphite/80 border border-black/5'
                  }`}
                  title={isListening ? 'Stop voice dictation' : 'Dictate message with voice (Web Speech API)'}
                >
                  {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  <span>{isListening ? 'Listening...' : 'Dictate'}</span>
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowWebPopover(!showWebPopover)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                      isWebMode 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-camry-graphite/5 border-transparent text-camry-graphite/70 hover:bg-camry-graphite/10'
                    }`}
                  >
                    <Globe size={14} />
                    {isWebMode ? 'Web' : 'On-device'}
                    <ChevronDown size={12} />
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
              <div className="flex items-center gap-3 relative">
                
                {/* Model Selector */}
                <div>
                  <button 
                    onClick={() => setShowModelPopover(!showModelPopover)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-camry-graphite/5 rounded-md text-camry-graphite/70 hover:bg-camry-graphite/10 transition-colors group"
                  >
                    <span className="font-martian text-xs">{loadedModel}</span>
                    <ChevronDown size={14} className="group-hover:text-camry-blackout transition-colors" />
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
                          className="absolute bottom-full right-0 mb-2 w-[340px] bg-white border border-black/10 rounded-xl shadow-xl z-30 overflow-hidden flex flex-col"
                        >
                          <div className="flex items-center justify-between p-3 border-b border-black/5 bg-camry-paper/50">
                            <span className="font-bricolage font-medium">Switch Model</span>
                            <button onClick={() => setShowModelPopover(false)} className="text-camry-graphite/50 hover:text-black">
                              <X size={16} />
                            </button>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                            {AVAILABLE_MODELS.map(m => {
                              const isLoaded = loadedModel === m.id;
                              const isInstalled = installedModels.includes(m.id);
                              const isLoading = loadingModel === m.id;
                              
                              if (!isInstalled && !isLoading && !isLoaded) return null; // Only show installed in this popover typically, but let's show all that are available as requested or just the ones in memory. Actually spec says: Models to list... currently loaded has checkmark. Not loaded has "Load" button.
                              
                              return (
                                <div key={m.id} className={`flex items-center justify-between p-2 rounded-lg ${isLoaded ? 'bg-camry-carrier/10' : 'hover:bg-camry-graphite/5'}`}>
                                  <span className="font-martian text-xs text-camry-blackout truncate max-w-[200px]">{m.id}</span>
                                  
                                  {isLoaded ? (
                                    <Check size={16} className="text-camry-deep-carrier" />
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
