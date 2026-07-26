import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Screen = 'onboarding' | 'chat' | 'modelStore' | 'agentStore' | 'dashboard' | 'settings';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model: string;
}

export interface Model {
  id: string;
  name: string;
  type: string;
  params: string;
  size: string;
  downloads: number;
  likes: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  likes: number;
  systemPrompt?: string;
  category?: string;
  isFeatured?: boolean;
  tagline?: string;
}

export const AVAILABLE_MODELS: Model[] = [
  { id: 'gpt-oss-120b', name: 'gpt-oss-120b', type: 'Text Generation', params: '120B', size: '61.0GB', downloads: 121, likes: 17 },
  { id: 'Qwen3-30B-Thinking-2507', name: 'Qwen3-30B-Thinking-2507', type: 'Text Generation', params: '30B', size: '19.7GB', downloads: 47, likes: 5 },
  { id: 'Qwen3-Coder-30B', name: 'Qwen3-Coder-30B', type: 'Text Generation', params: '30B', size: '19.7GB', downloads: 48, likes: 12 },
  { id: 'Qwen3-30B-Instruct-2507', name: 'Qwen3-30B-Instruct-2507', type: 'Text Generation', params: '30B', size: '19.7GB', downloads: 48, likes: 15 },
  { id: 'gpt-oss-20b', name: 'gpt-oss-20b', type: 'Text Generation', params: '20B', size: '12.0GB', downloads: 25, likes: 2 },
  { id: 'Image-Creating Realistic', name: 'Image-Creating Realistic', type: 'Text-to-Image', params: '10B', size: '9.0GB', downloads: 39, likes: 2 },
  { id: 'Z-Image-Turbo', name: 'Z-Image-Turbo', type: 'Text-to-Image', params: '10B', size: '9.0GB', downloads: 50, likes: 9 },
  { id: 'Qwen3-8B', name: 'Qwen3-8B', type: 'Text Generation', params: '8B', size: '4.5GB', downloads: 95, likes: 15 },
];

export const INITIAL_AGENTS: Agent[] = [
  { id: 'legal', name: 'Legal Assistant', description: 'Contract review, precedent search, and drafting — fully on-device.', likes: 312, category: 'Legal', systemPrompt: 'You are an expert corporate legal assistant. Provide structured legal analysis and contract clause advice.' },
  { id: 'contract', name: 'Contract Reviewer', description: 'Flags risky clauses and redlines agreements in your firm\'s voice.', likes: 289, category: 'Legal', systemPrompt: 'You are an agreement redline specialist. Identify liabilities and suggest replacement terms.' },
  { id: 'medical', name: 'Medical Scribe', description: 'Turns consultations into structured notes. Patient data stays local.', likes: 204, category: 'Medical', systemPrompt: 'You are a medical scribe. Convert clinical inputs into clear SOAP notes format.' },
  { id: 'gov', name: 'Gov Document Processor', description: 'Bulk-processes forms and filings with zero cloud exposure.', likes: 176, category: 'Government', systemPrompt: 'You are a government regulatory compliance officer. Structure official filings and verify standards.' },
  { id: 'industrial', name: 'Industrial Copilot', description: 'Maintenance logs, manuals, and incident reports, searchable offline.', likes: 141, category: 'Industrial', systemPrompt: 'You are an industrial field systems co-pilot. Help troubleshoot equipment, read schematics, and parse logs.' },
  { id: 'finance', name: 'Finance Analyst', description: 'Reconciliation, summaries, and reporting on private ledgers.', likes: 98, category: 'Finance', systemPrompt: 'You are a financial controller. Provide ledger reconciliation, financial ratio calculations, and audit summaries.' },
  { id: 'meeting', name: 'Meeting Notetaker', description: 'Transcribes and summarizes meetings on the box.', likes: 255, category: 'Other', systemPrompt: 'You are an executive meeting recorder. Extract decisions, action items, and owners from transcriptions.' },
  { id: 'translator', name: 'Translator (Local)', description: 'English ↔ Yoruba, Igbo, Hausa, French — no internet needed.', likes: 187, category: 'Other', systemPrompt: 'You are a multilingual local translator specializing in West African and European languages.' },
];

export let AVAILABLE_AGENTS: Agent[] = [...INITIAL_AGENTS];

interface AppContextType {
  isOnboarded: boolean;
  setIsOnboarded: (val: boolean) => void;
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  
  installedModels: string[];
  installModel: (id: string) => void;
  
  loadedModel: string;
  setLoadedModel: (id: string) => void;
  
  allAgents: Agent[];
  installedAgents: string[];
  installAgent: (id: string) => void;
  uninstallAgent: (id: string) => void;
  addCustomAgent: (agent: Omit<Agent, 'likes'>) => void;
  
  activeAgent: string | null;
  setActiveAgent: (id: string | null) => void;
  
  chatHistory: Message[];
  addMessage: (msg: Message) => void;
  clearChat: () => void;
  
  settingsView: 'main' | 'api_key' | 'console' | 'device_info' | 'storage' | 'wifi' | 'update' | 'privacy';
  setSettingsView: (view: 'main' | 'api_key' | 'console' | 'device_info' | 'storage' | 'wifi' | 'update' | 'privacy') => void;
  
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  
  const [installedModels, setInstalledModels] = useState<string[]>(['gpt-oss-120b']);
  const [loadedModel, setLoadedModel] = useState<string>('gpt-oss-120b');
  
  const [agentsList, setAgentsList] = useState<Agent[]>(INITIAL_AGENTS);
  const [installedAgents, setInstalledAgents] = useState<string[]>(['meeting', 'legal']);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [settingsView, setSettingsView] = useState<'main' | 'api_key' | 'console' | 'device_info' | 'storage' | 'wifi' | 'update' | 'privacy'>('main');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  AVAILABLE_AGENTS = agentsList;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };
  
  const installModel = (id: string) => {
    if (!installedModels.includes(id)) {
      setInstalledModels([...installedModels, id]);
    }
  };
  
  const installAgent = (id: string) => {
    if (!installedAgents.includes(id)) {
      setInstalledAgents([...installedAgents, id]);
      showToast(`Agent installed: ${id}`);
    }
  };

  const uninstallAgent = (id: string) => {
    setInstalledAgents(prev => prev.filter(a => a !== id));
    if (activeAgent === id) setActiveAgent(null);
    showToast(`Agent uninstalled`);
  };

  const addCustomAgent = (newAgentData: Omit<Agent, 'likes'>) => {
    const newAgent: Agent = {
      ...newAgentData,
      likes: 1,
    };
    setAgentsList(prev => [newAgent, ...prev]);
    setInstalledAgents(prev => [...prev, newAgent.id]);
    showToast(`Created & installed custom agent: ${newAgent.name}`);
  };
  
  const addMessage = (msg: Message) => {
    setChatHistory(prev => [...prev, msg]);
  };
  
  const clearChat = () => {
    setChatHistory([]);
  };

  // When onboarding is finished, go to chat
  const handleSetIsOnboarded = (val: boolean) => {
    setIsOnboarded(val);
    if (val) {
      setCurrentScreen('chat');
    }
  };

  return (
    <AppContext.Provider value={{
      isOnboarded,
      setIsOnboarded: handleSetIsOnboarded,
      currentScreen,
      setCurrentScreen,
      installedModels,
      installModel,
      loadedModel,
      setLoadedModel,
      allAgents: agentsList,
      installedAgents,
      installAgent,
      uninstallAgent,
      addCustomAgent,
      activeAgent,
      setActiveAgent,
      chatHistory,
      addMessage,
      clearChat,
      settingsView,
      setSettingsView,
      toastMessage,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
