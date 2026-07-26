import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export interface AgentVersion {
  version: string;
  updatedAt: string;
  prompt: string;
  changes: string;
  author: string;
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
  status?: 'active' | 'idle' | 'error';
  statusReason?: string;
  versionHistory?: AgentVersion[];
  currentVersion?: string;
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
  { 
    id: 'legal', 
    name: 'Legal Assistant', 
    description: 'Contract review, precedent search, and drafting — fully on-device.', 
    likes: 312, 
    category: 'Legal', 
    status: 'idle', 
    statusReason: 'Ready on local NPU cache', 
    systemPrompt: 'You are an expert corporate legal assistant. Provide structured legal analysis, risk ratings, and contract clause advice.',
    currentVersion: 'v1.2.0',
    versionHistory: [
      { version: 'v1.2.0', updatedAt: '2026-07-24', prompt: 'You are an expert corporate legal assistant. Provide structured legal analysis, risk ratings, and contract clause advice.', changes: 'Added risk rating guidelines and contract clause recommendations.', author: 'Camry System' },
      { version: 'v1.1.0', updatedAt: '2026-07-10', prompt: 'You are an expert corporate legal assistant. Provide structured legal analysis and contract clause advice.', changes: 'Optimized for 30B parameter local model latency.', author: 'Camry System' },
      { version: 'v1.0.0', updatedAt: '2026-06-01', prompt: 'You are a legal assistant. Help draft and review contracts.', changes: 'Initial release on Camry ONE NPU.', author: 'Camry System' }
    ]
  },
  { 
    id: 'contract', 
    name: 'Contract Reviewer', 
    description: 'Flags risky clauses and redlines agreements in your firm\'s voice.', 
    likes: 289, 
    category: 'Legal', 
    status: 'active', 
    statusReason: 'Active processing thread', 
    systemPrompt: 'You are an agreement redline specialist. Identify liabilities and suggest replacement terms.',
    currentVersion: 'v1.1.0',
    versionHistory: [
      { version: 'v1.1.0', updatedAt: '2026-07-18', prompt: 'You are an agreement redline specialist. Identify liabilities and suggest replacement terms.', changes: 'Added liability cap detection rule.', author: 'Camry System' },
      { version: 'v1.0.0', updatedAt: '2026-06-15', prompt: 'You review contracts and highlight risky terms.', changes: 'Initial release.', author: 'Camry System' }
    ]
  },
  { 
    id: 'medical', 
    name: 'Medical Scribe', 
    description: 'Turns consultations into structured notes. Patient data stays local.', 
    likes: 204, 
    category: 'Medical', 
    status: 'idle', 
    statusReason: 'Standby mode', 
    systemPrompt: 'You are a medical scribe. Convert clinical inputs into clear SOAP notes format.',
    currentVersion: 'v1.0.1',
    versionHistory: [
      { version: 'v1.0.1', updatedAt: '2026-07-02', prompt: 'You are a medical scribe. Convert clinical inputs into clear SOAP notes format.', changes: 'Standardized SOAP note sections.', author: 'Camry System' },
      { version: 'v1.0.0', updatedAt: '2026-05-20', prompt: 'You convert clinical consultations into notes.', changes: 'Initial release.', author: 'Camry System' }
    ]
  },
  { 
    id: 'gov', 
    name: 'Gov Document Processor', 
    description: 'Bulk-processes forms and filings with zero cloud exposure.', 
    likes: 176, 
    category: 'Government', 
    status: 'error', 
    statusReason: 'VRAM Allocation Warning (1.2GB free)', 
    systemPrompt: 'You are a government regulatory compliance officer. Structure official filings and verify standards.',
    currentVersion: 'v1.0.0',
    versionHistory: [
      { version: 'v1.0.0', updatedAt: '2026-06-10', prompt: 'You are a government regulatory compliance officer. Structure official filings and verify standards.', changes: 'Initial release.', author: 'Camry System' }
    ]
  },
  { 
    id: 'industrial', 
    name: 'Industrial Copilot', 
    description: 'Maintenance logs, manuals, and incident reports, searchable offline.', 
    likes: 141, 
    category: 'Industrial', 
    status: 'idle', 
    statusReason: 'Standby mode', 
    systemPrompt: 'You are an industrial field systems co-pilot. Help troubleshoot equipment, read schematics, and parse logs.',
    currentVersion: 'v1.0.0',
    versionHistory: [
      { version: 'v1.0.0', updatedAt: '2026-06-12', prompt: 'You are an industrial field systems co-pilot. Help troubleshoot equipment, read schematics, and parse logs.', changes: 'Initial release.', author: 'Camry System' }
    ]
  },
  { 
    id: 'finance', 
    name: 'Finance Analyst', 
    description: 'Reconciliation, summaries, and reporting on private ledgers.', 
    likes: 98, 
    category: 'Finance', 
    status: 'idle', 
    statusReason: 'Standby mode', 
    systemPrompt: 'You are a financial controller. Provide ledger reconciliation, financial ratio calculations, and audit summaries.',
    currentVersion: 'v1.0.0',
    versionHistory: [
      { version: 'v1.0.0', updatedAt: '2026-06-18', prompt: 'You are a financial controller. Provide ledger reconciliation, financial ratio calculations, and audit summaries.', changes: 'Initial release.', author: 'Camry System' }
    ]
  },
  { 
    id: 'meeting', 
    name: 'Meeting Notetaker', 
    description: 'Transcribes and summarizes meetings on the box.', 
    likes: 255, 
    category: 'Other', 
    status: 'active', 
    statusReason: 'Recording audio buffer', 
    systemPrompt: 'You are an executive meeting recorder. Extract decisions, action items, and owners from transcriptions.',
    currentVersion: 'v1.2.0',
    versionHistory: [
      { version: 'v1.2.0', updatedAt: '2026-07-22', prompt: 'You are an executive meeting recorder. Extract decisions, action items, and owners from transcriptions.', changes: 'Added owner assignment formatting.', author: 'Camry System' },
      { version: 'v1.1.0', updatedAt: '2026-07-05', prompt: 'You transcribe meetings and summarize key decisions.', changes: 'Improved summary layout.', author: 'Camry System' }
    ]
  },
  { 
    id: 'translator', 
    name: 'Translator (Local)', 
    description: 'English ↔ Yoruba, Igbo, Hausa, French — no internet needed.', 
    likes: 187, 
    category: 'Other', 
    status: 'idle', 
    statusReason: 'Standby mode', 
    systemPrompt: 'You are a multilingual local translator specializing in West African and European languages.',
    currentVersion: 'v1.0.0',
    versionHistory: [
      { version: 'v1.0.0', updatedAt: '2026-06-25', prompt: 'You are a multilingual local translator specializing in West African and European languages.', changes: 'Initial release.', author: 'Camry System' }
    ]
  },
];

export let AVAILABLE_AGENTS: Agent[] = [...INITIAL_AGENTS];

export type ToastType = 'info' | 'success' | 'warning' | 'task_complete';

export interface ToastData {
  id: string;
  message: string;
  type?: ToastType;
  title?: string;
}

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
  reorderAgents: (newAgents: Agent[]) => void;
  
  activeAgent: string | null;
  setActiveAgent: (id: string | null) => void;
  
  chatHistory: Message[];
  addMessage: (msg: Message) => void;
  clearChat: () => void;
  
  settingsView: 'main' | 'api_key' | 'console' | 'device_info' | 'storage' | 'wifi' | 'update' | 'privacy';
  setSettingsView: (view: 'main' | 'api_key' | 'console' | 'device_info' | 'storage' | 'wifi' | 'update' | 'privacy') => void;
  
  toastData: ToastData | null;
  toastMessage: string | null;
  showToast: (msg: string, type?: ToastType, title?: string) => void;
  
  batteryLevel: number;
  isCharging: boolean;
  
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  
  exportConfig: () => void;
  importConfig: (jsonData: string) => boolean;
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

  const reorderAgents = (newAgents: Agent[]) => {
    setAgentsList(newAgents);
    showToast(`Agent priority order updated`);
  };
  
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [settingsView, setSettingsView] = useState<'main' | 'api_key' | 'console' | 'device_info' | 'storage' | 'wifi' | 'update' | 'privacy'>('main');
  
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number>(88);
  const [isCharging, setIsCharging] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  AVAILABLE_AGENTS = agentsList;

  // Battery Level Simulation Effect
  useEffect(() => {
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => {
        // Slowly fluctuate between 15% and 98%
        if (prev <= 16) return 96; // Simulated auto charge wrap-around
        return prev - 1;
      });
    }, 18000); // battery changes every 18s

    return () => clearInterval(batteryInterval);
  }, []);

  const showToast = (msg: string, type: ToastType = 'info', title?: string) => {
    const newToast: ToastData = {
      id: Date.now().toString(),
      message: msg,
      type,
      title
    };
    setToastData(newToast);
    setTimeout(() => {
      setToastData(current => current?.id === newToast.id ? null : current);
    }, 4000);
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

  const rollbackAgentVersion = (agentId: string, version: string) => {
    setAgentsList(prev => prev.map(a => {
      if (a.id === agentId && a.versionHistory) {
        const targetVer = a.versionHistory.find(v => v.version === version);
        if (targetVer) {
          return {
            ...a,
            systemPrompt: targetVer.prompt,
            currentVersion: targetVer.version,
            statusReason: `Rolled back to ${version} on NPU`
          };
        }
      }
      return a;
    }));
    showToast(`Rolled back agent settings to ${version}`);
  };
  
  const addMessage = (msg: Message) => {
    setChatHistory(prev => [...prev, msg]);
  };
  
  const clearChat = () => {
    setChatHistory([]);
  };

  // Export configuration and agent settings to JSON file
  const exportConfig = () => {
    const backupData = {
      app: "Camry OS",
      version: "1.0.4",
      exportedAt: new Date().toISOString(),
      device: {
        model: "Camry Gen 1",
        serial: "C1-X992-0041",
        firmware: "v1.0.3"
      },
      models: {
        installed: installedModels,
        loaded: loadedModel
      },
      agents: {
        installed: installedAgents,
        active: activeAgent,
        customAgents: agentsList.filter(a => a.id.startsWith('custom-'))
      }
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `camry-os-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("Configuration exported to JSON file");
  };

  const importConfig = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.models?.installed && Array.isArray(parsed.models.installed)) {
        setInstalledModels(parsed.models.installed);
      }
      if (parsed.models?.loaded) {
        setLoadedModel(parsed.models.loaded);
      }
      if (parsed.agents?.installed && Array.isArray(parsed.agents.installed)) {
        setInstalledAgents(parsed.agents.installed);
      }
      if (parsed.agents?.customAgents && Array.isArray(parsed.agents.customAgents)) {
        setAgentsList(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const newAgents = parsed.agents.customAgents.filter((a: Agent) => !existingIds.has(a.id));
          return [...newAgents, ...prev];
        });
      }
      if (parsed.agents?.active !== undefined) {
        setActiveAgent(parsed.agents.active);
      }
      showToast("Configuration restored from JSON backup");
      return true;
    } catch (err) {
      console.error("Failed to parse config file", err);
      showToast("Invalid JSON config backup file");
      return false;
    }
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
      rollbackAgentVersion,
      reorderAgents,
      activeAgent,
      setActiveAgent,
      chatHistory,
      addMessage,
      clearChat,
      settingsView,
      setSettingsView,
      toastData,
      toastMessage: toastData ? toastData.message : null,
      showToast,
      batteryLevel,
      isCharging,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      exportConfig,
      importConfig
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
