import React, { useState } from 'react';
import { useAppContext, Agent, AgentVersion, AVAILABLE_MODELS } from '../store/AppContext';
import { CustomSelect } from '../components/CustomSelect';
import { AgentLogo } from '../components/AgentLogo';
import { Grid, Heart, Plus, Search, Trash2, Check, X, Bot, History, RotateCcw, BarChart3, Cpu, Eye, GripVertical, Move, Sparkles, Send, Sliders, RefreshCw, AlertCircle, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

// Telemetry datasets for agents
const AGENT_TELEMETRY_DATA: Record<string, Array<{ time: string; tokens: number; requests: number }>> = {
  all: [
    { time: '09:00', tokens: 12400, requests: 82 },
    { time: '10:00', tokens: 18900, requests: 124 },
    { time: '11:00', tokens: 26500, requests: 189 },
    { time: '12:00', tokens: 34200, requests: 240 },
    { time: '13:00', tokens: 41800, requests: 310 },
    { time: '14:00', tokens: 52100, requests: 412 },
    { time: '15:00', tokens: 68400, requests: 520 },
  ],
  legal: [
    { time: '09:00', tokens: 4200, requests: 28 },
    { time: '10:00', tokens: 6800, requests: 45 },
    { time: '11:00', tokens: 9500, requests: 62 },
    { time: '12:00', tokens: 13400, requests: 88 },
    { time: '13:00', tokens: 17200, requests: 110 },
    { time: '14:00', tokens: 22800, requests: 154 },
    { time: '15:00', tokens: 29100, requests: 198 },
  ],
  contract: [
    { time: '09:00', tokens: 3800, requests: 24 },
    { time: '10:00', tokens: 5900, requests: 39 },
    { time: '11:00', tokens: 8100, requests: 52 },
    { time: '12:00', tokens: 10800, requests: 71 },
    { time: '13:00', tokens: 13500, requests: 90 },
    { time: '14:00', tokens: 16900, requests: 118 },
    { time: '15:00', tokens: 21400, requests: 146 },
  ],
  meeting: [
    { time: '09:00', tokens: 3100, requests: 22 },
    { time: '10:00', tokens: 5400, requests: 38 },
    { time: '11:00', tokens: 8200, requests: 59 },
    { time: '12:00', tokens: 11000, requests: 78 },
    { time: '13:00', tokens: 13900, requests: 98 },
    { time: '14:00', tokens: 17500, requests: 126 },
    { time: '15:00', tokens: 21800, requests: 160 },
  ],
  medical: [
    { time: '09:00', tokens: 2100, requests: 14 },
    { time: '10:00', tokens: 3800, requests: 26 },
    { time: '11:00', tokens: 5100, requests: 37 },
    { time: '12:00', tokens: 6200, requests: 46 },
    { time: '13:00', tokens: 7300, requests: 58 },
    { time: '14:00', tokens: 8900, requests: 72 },
    { time: '15:00', tokens: 11200, requests: 92 },
  ],
};

export const AgentStore: React.FC = () => {
  const { allAgents, installedAgents, installAgent, uninstallAgent, addCustomAgent, updateCustomAgent, rollbackAgentVersion, reorderAgents, setCurrentScreen, setActiveAgent, themeMode, showToast } = useAppContext();
  const isLight = themeMode !== 'dark';
  
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [activeCat, setActiveCat] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Idle' | 'Error'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drag and drop reordering state
  const [draggedAgentId, setDraggedAgentId] = useState<string | null>(null);
  const [dragOverAgentId, setDragOverAgentId] = useState<string | null>(null);

  const handleReorderAgents = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    const sourceIdx = allAgents.findIndex(a => a.id === sourceId);
    const targetIdx = allAgents.findIndex(a => a.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const updated = [...allAgents];
    const [moved] = updated.splice(sourceIdx, 1);
    updated.splice(targetIdx, 0, moved);
    reorderAgents(updated);
  };
  
  // Analytics state
  const [selectedAnalyticsAgent, setSelectedAnalyticsAgent] = useState<string>('all');
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState<boolean>(false);

  // Version History Modal state
  const [selectedAgentForHistory, setSelectedAgentForHistory] = useState<Agent | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Custom Agent Creation Modal and interactive sandbox state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDesc, setNewAgentDesc] = useState('');
  const [newAgentCat, setNewAgentCat] = useState('Legal');
  const [newAgentPrompt, setNewAgentPrompt] = useState('');
  
  // Model Selector & Playground Testing
  const [customSelectedModelId, setCustomSelectedModelId] = useState<string | null>(null);
  const [testMessages, setTestMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: string; model?: string }>>([]);
  const [testInput, setTestInput] = useState('');
  const [isTestThinking, setIsTestThinking] = useState(false);

  // Custom Agent Editing States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [editAgentName, setEditAgentName] = useState('');
  const [editAgentDesc, setEditAgentDesc] = useState('');
  const [editAgentCat, setEditAgentCat] = useState('Legal');
  const [editAgentPrompt, setEditAgentPrompt] = useState('');
  const [editSelectedModelId, setEditSelectedModelId] = useState<string | null>(null);
  const [editTestMessages, setEditTestMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: string; model?: string }>>([]);
  const [editTestInput, setEditTestInput] = useState('');
  const [isEditTestThinking, setIsEditTestThinking] = useState(false);

  // Standalone Playground States
  const [playgroundSelectedAgentId, setPlaygroundSelectedAgentId] = useState<string>('legal');
  const [playgroundSelectedModelId, setPlaygroundSelectedModelId] = useState<string | null>(null);
  const [playgroundMessages, setPlaygroundMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: string; model?: string }>>([]);
  const [playgroundInput, setPlaygroundInput] = useState('');
  const [isPlaygroundThinking, setIsPlaygroundThinking] = useState(false);
  const [isMonitoringActive, setIsMonitoringActive] = useState(true);

  const getRecommendedModel = (category: string, prompt: string) => {
    const p = prompt.toLowerCase();
    if (category === 'Legal' || category === 'Finance') {
      return {
        id: 'gpt-oss-120b',
        reason: 'Superior parametric accuracy for clause detection, audited balance sheets, and regulatory alignment.'
      };
    }
    if (category === 'Medical' || p.includes('think') || p.includes('reason') || p.includes('diagnose') || p.includes('clinical')) {
      return {
        id: 'Qwen3-30B-Thinking-2507',
        reason: 'Deep cognitive reasoning trace suited for differential diagnosis and step-by-step multi-factor verification.'
      };
    }
    if (category === 'Industrial' || p.includes('code') || p.includes('program') || p.includes('script') || p.includes('automat') || p.includes('query')) {
      return {
        id: 'Qwen3-Coder-30B',
        reason: 'Fine-tuned syntactical and logical instruction set optimized for industrial automation codes and JSON parsing.'
      };
    }
    if (category === 'Government' || p.includes('summar') || p.includes('admin') || p.includes('comply') || p.includes('policy')) {
      return {
        id: 'Qwen3-30B-Instruct-2507',
        reason: 'Aligned safety guidelines and structured formatting for public policies, summaries, and administrative memos.'
      };
    }
    return {
      id: 'Qwen3-8B',
      reason: 'Balanced parameter scale providing ultra-low inference latency for rapid classifications and low-overhead pipelines.'
    };
  };

  const activeModelId = customSelectedModelId || getRecommendedModel(newAgentCat, newAgentPrompt).id;

  const handleSendTest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!testInput.trim() || isTestThinking) return;

    const userMsg = {
      role: 'user' as const,
      content: testInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setTestMessages(prev => [...prev, userMsg]);
    setTestInput('');
    setIsTestThinking(true);

    const activePrompt = newAgentPrompt.trim() || `You are ${newAgentName.trim() || 'Custom Agent'}, a specialized AI agent on Camry OS.`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg.content,
          agentName: newAgentName.trim() || 'Custom Agent',
          systemInstruction: activePrompt,
          modelName: activeModelId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestMessages(prev => [...prev, {
          role: 'assistant',
          content: data.text || 'No response returned from NPU core.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          model: data.model || activeModelId
        }]);
        showToast('Test response computed successfully', 'task_complete', 'NPU SANDBOX');
      } else {
        throw new Error(`Server status ${response.status}`);
      }
    } catch (err) {
      console.warn("Test inference failed, using sandbox local compiler simulator:", err);
      // Realistic local NPU simulation response
      setTimeout(() => {
        const simulatedText = `Processed on simulated ${activeModelId} NPU instruction thread.

Regarding your test input "${userMsg.content}":

The local model on your Camry ONE appliance has executed this dry-run query using your customized system prompt:
"${activePrompt.slice(0, 100)}${activePrompt.length > 100 ? '...' : ''}"

Output alignment looks excellent! No regressions detected across simulated memory space. Configure further on the left panel or install whenever you are ready!`;

        setTestMessages(prev => [...prev, {
          role: 'assistant',
          content: simulatedText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          model: `${activeModelId} (Simulated)`
        }]);
        showToast('Sandbox test simulated successfully', 'task_complete', 'NPU SANDBOX');
      }, 800);
    } finally {
      setIsTestThinking(false);
    }
  };

  const resetCreateForm = () => {
    setNewAgentName('');
    setNewAgentDesc('');
    setNewAgentPrompt('');
    setNewAgentCat('Legal');
    setCustomSelectedModelId(null);
    setTestMessages([]);
    setTestInput('');
    setIsTestThinking(false);
  };

  const resetEditForm = () => {
    setEditingAgentId(null);
    setEditAgentName('');
    setEditAgentDesc('');
    setEditAgentPrompt('');
    setEditAgentCat('Legal');
    setEditSelectedModelId(null);
    setEditTestMessages([]);
    setEditTestInput('');
    setIsEditTestThinking(false);
  };

  const handleEditAgentStart = (agent: Agent) => {
    setEditingAgentId(agent.id);
    setEditAgentName(agent.name);
    setEditAgentDesc(agent.description);
    setEditAgentPrompt(agent.systemPrompt || '');
    setEditAgentCat(agent.category || 'Legal');
    setEditSelectedModelId(null);
    setEditTestMessages([]);
    setEditTestInput('');
    setIsEditTestThinking(false);
    setShowEditModal(true);
  };

  const handleEditAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgentId || !editAgentName.trim()) {
      showToast('Agent name is required', 'error', 'VALIDATION');
      return;
    }

    updateCustomAgent(editingAgentId, {
      name: editAgentName.trim(),
      description: editAgentDesc.trim() || 'Custom functional AI agent updated on Camry ONE.',
      category: editAgentCat,
      systemPrompt: editAgentPrompt.trim() || `You are ${editAgentName.trim()}, a specialized AI agent on Camry OS.`,
    });

    setShowEditModal(false);
    resetEditForm();
  };

  const handleSendEditTest = async () => {
    if (!editTestInput.trim()) return;
    
    const userMsg = {
      role: 'user' as const,
      content: editTestInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    
    setEditTestMessages(prev => [...prev, userMsg]);
    setEditTestInput('');
    setIsEditTestThinking(true);

    const rec = getRecommendedModel(editAgentCat, editAgentPrompt);
    const activeModelId = editSelectedModelId || rec.id;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: editTestInput }],
          model: activeModelId,
          systemPrompt: editAgentPrompt
        })
      });

      if (response.ok) {
        const data = await response.json();
        setEditTestMessages(prev => [...prev, {
          role: 'assistant',
          content: data.text || 'No response returned from NPU core.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          model: data.model || activeModelId
        }]);
        showToast('Test response computed successfully', 'task_complete', 'NPU SANDBOX');
      } else {
        throw new Error(`Server status ${response.status}`);
      }
    } catch (err) {
      setTimeout(() => {
        const simulatedText = `[Simulated ${activeModelId} Thread]
Refining system prompt adjustments for "${editAgentName}":

Regarding: "${userMsg.content}"

The Camry ONE offline compiler has successfully validated your updated rules:
"${editAgentPrompt.slice(0, 100)}${editAgentPrompt.length > 100 ? '...' : ''}"

The simulated response matches expected precision parameters!`;

        setEditTestMessages(prev => [...prev, {
          role: 'assistant',
          content: simulatedText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          model: `${activeModelId} (Simulated)`
        }]);
        showToast('Blueprint test simulated', 'task_complete', 'NPU SANDBOX');
      }, 700);
    } finally {
      setIsEditTestThinking(false);
    }
  };

  const handleSendPlaygroundTest = async () => {
    if (!playgroundInput.trim()) return;

    const currentAgent = allAgents.find(a => a.id === playgroundSelectedAgentId) || allAgents[0];
    const rec = getRecommendedModel(currentAgent?.category || 'Other', currentAgent?.systemPrompt || '');
    const activeModelId = playgroundSelectedModelId || rec.id;

    const userMsg = {
      role: 'user' as const,
      content: playgroundInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setPlaygroundMessages(prev => [...prev, userMsg]);
    setPlaygroundInput('');
    setIsPlaygroundThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: playgroundInput }],
          model: activeModelId,
          systemPrompt: currentAgent?.systemPrompt || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPlaygroundMessages(prev => [...prev, {
          role: 'assistant',
          content: data.text || 'No response returned from NPU core.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          model: data.model || activeModelId
        }]);
        showToast('Playground message computed', 'task_complete', 'PLAYGROUND');
      } else {
        throw new Error(`Server status ${response.status}`);
      }
    } catch (err) {
      setTimeout(() => {
        let simulatedText = `[Active Playground Trace - ${activeModelId}]

Using custom system instructions from agent "${currentAgent?.name}":
"${(currentAgent?.systemPrompt || '').slice(0, 120)}..."

Tested Query: "${userMsg.content}"

Response parameters processed securely on-premises within your Camry ONE hardware clusters. No internet connection was used.`;

        if (currentAgent?.id === 'legal') {
          simulatedText = `[Legal Assistant Sandbox Engine]
I have processed your contract dry-run request: "${userMsg.content}".
Evaluating clause risk profiles using local ${activeModelId} parameters...

1. High Liability Risk: detected standard indemnification asymmetry.
2. Governing Jurisdiction: local host device is pinned to sovereign African zone (Nairobi, Kenya).

This simulation verifies that your custom ruleset executes perfectly.`;
        } else if (currentAgent?.id === 'medical') {
          simulatedText = `[Medical Assistant Sandbox Engine]
I have analyzed the health data input: "${userMsg.content}".
cross-referencing localized clinical parameters...

Recommendation Alignment:
- Validated against on-device medical terminology indexes.
- Disclaimer: This is a sandbox simulation to verify sovereign LLM behavior.`;
        }

        setPlaygroundMessages(prev => [...prev, {
          role: 'assistant',
          content: simulatedText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          model: `${activeModelId} (Simulated)`
        }]);
        showToast('Playground test completed', 'task_complete', 'PLAYGROUND');
      }, 900);
    } finally {
      setIsPlaygroundThinking(false);
    }
  };

  const getAgentCat = (agent: Agent) => {
    if (agent.category) return agent.category;
    if (['legal', 'contract'].includes(agent.id)) return 'Legal';
    if (['medical'].includes(agent.id)) return 'Medical';
    if (['gov'].includes(agent.id)) return 'Government';
    if (['industrial'].includes(agent.id)) return 'Industrial';
    if (['finance'].includes(agent.id)) return 'Finance';
    return 'Other';
  };

  const getAgentStatus = (agent: Agent): 'active' | 'idle' | 'error' => {
    if (agent.status) return agent.status;
    return 'idle';
  };

  const filteredAgents = allAgents.filter(a => {
    const cat = getAgentCat(a);
    const status = getAgentStatus(a);
    const isInstalled = installedAgents.includes(a.id);
    const matchesCat = activeCat === 'All' || (activeCat === 'Installed' ? isInstalled : cat === activeCat);
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Active' && status === 'active') ||
      (statusFilter === 'Idle' && status === 'idle') ||
      (statusFilter === 'Error' && status === 'error');
    const matchesSearch = searchQuery === '' || 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const handleInstall = (id: string) => {
    setDownloading(id);
    setDownloadProgress(0);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setDownloadProgress(100);
        installAgent(id);
        setDownloading(null);
      } else {
        setDownloadProgress(currentProgress);
      }
    }, 120);
  };

  const handleOpen = (id: string) => {
    setActiveAgent(id);
    setCurrentScreen('chat');
  };

  const handleCreateAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;
    const id = `custom-${Date.now()}`;
    const initialVersionObj = {
      version: 'v1.0.0',
      updatedAt: new Date().toISOString().split('T')[0],
      prompt: newAgentPrompt.trim() || `You are ${newAgentName.trim()}, a specialized AI agent on Camry OS.`,
      changes: 'Initial release on Camry ONE NPU.',
      author: 'System Owner (Admin)'
    };

    addCustomAgent({
      id,
      name: newAgentName.trim(),
      description: newAgentDesc.trim() || 'Custom functional AI agent created on Camry ONE.',
      category: newAgentCat,
      systemPrompt: newAgentPrompt.trim() || `You are ${newAgentName.trim()}, a specialized AI agent on Camry OS.`,
      status: 'active',
      statusReason: `Active processing thread running on ${activeModelId}`,
      currentVersion: 'v1.0.0',
      versionHistory: [initialVersionObj]
    });
    resetCreateForm();
    setShowCreateModal(false);
  };

  return (
    <div className={`flex-1 h-full flex flex-col overflow-hidden relative transition-colors ${
      isLight ? 'bg-camry-paper' : 'bg-[#141418] text-white'
    }`}>
      {/* Header */}
      <div className={`p-4 sm:p-8 pb-4 border-b z-10 flex-shrink-0 space-y-3 ${
        isLight ? 'bg-camry-paper/50 border-black/5' : 'bg-[#141418]/80 border-white/10'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Grid className={`flex-shrink-0 ${isLight ? 'text-camry-blackout' : 'text-[#0066FF]'}`} size={22} />
            <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Agent Store</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search input */}
            <div className="relative flex-1 sm:flex-none">
              <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isLight ? 'text-camry-graphite/40' : 'text-zinc-500'
              }`} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agents..."
                className={`w-full sm:w-48 pl-8 pr-3 py-1.5 border rounded-lg text-xs font-familjen transition-all focus:outline-none focus:ring-2 focus:ring-[#0066FF] ${
                  isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#1C1C22] border-white/15 text-white placeholder:text-zinc-500'
                }`}
              />
            </div>

            {/* Create Custom Agent Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-xs flex-shrink-0 cursor-pointer ${
                isLight ? 'bg-camry-blackout hover:bg-black text-white' : 'bg-[#0066FF] hover:bg-[#0052CC] text-white'
              }`}
            >
              <Plus size={14} />
              <span>Build Agent</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar flex-nowrap sm:flex-wrap">
            {['All', 'Installed', 'Playground Sandbox 🧪', 'Legal', 'Medical', 'Government', 'Industrial', 'Finance', 'Other'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  activeCat === cat 
                    ? (isLight ? 'bg-camry-blackout text-white border-transparent' : 'bg-[#0066FF] text-white border-transparent')
                    : (isLight ? 'bg-white border-black/10 text-camry-graphite hover:bg-camry-graphite/5' : 'bg-[#1C1C22] border-white/10 text-zinc-300 hover:bg-white/10')
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-4 sm:pt-6">
        {/* Grid */}
        {activeCat === 'Installed' && (
          <div className={`mb-4 p-3 border rounded-xl flex items-center justify-between font-martian text-xs shadow-xs ${
            isLight ? 'bg-camry-carrier/10 border-camry-deep-carrier/20 text-camry-blackout' : 'bg-blue-950/40 border-blue-800/40 text-blue-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <Move size={16} className={`flex-shrink-0 ${isLight ? 'text-camry-deep-carrier' : 'text-blue-400'}`} />
              <span>Drag & drop agent cards by the handle <GripVertical size={14} className="inline-block opacity-70" /> to customize priority order.</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded border ${
              isLight ? 'text-camry-graphite/60 bg-white/60 border-black/5' : 'text-zinc-300 bg-white/10 border-white/10'
            }`}>
              {filteredAgents.length} Installed
            </span>
          </div>
        )}

        {activeCat === 'Playground Sandbox 🧪' ? (
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-220px)] min-h-[500px] overflow-hidden">
            {/* Left Column: Config Panel */}
            <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto pr-0 lg:pr-2 no-scrollbar shrink-0">
              {/* Agent Picker Card */}
              <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
                isLight ? 'bg-white border-black/5 shadow-xs' : 'bg-[#1C1C22] border-white/10 shadow-xs'
              }`}>
                <h3 className="font-bricolage text-sm font-semibold flex items-center gap-2">
                  <Bot size={16} className="text-[#0066FF]" />
                  Blueprint Selection
                </h3>
                <p className={`text-xs ${isLight ? 'text-camry-graphite/70' : 'text-zinc-400'} leading-relaxed`}>
                  Select a pre-installed or custom AI agent blueprint to load into the sandbox.
                </p>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-martian font-bold opacity-60">SELECT ACTIVE AGENT</label>
                  <select 
                    value={playgroundSelectedAgentId}
                    onChange={(e) => {
                      setPlaygroundSelectedAgentId(e.target.value);
                      setPlaygroundMessages([]);
                    }}
                    className={`p-2 rounded-lg text-xs font-familjen border focus:ring-1 focus:ring-[#0066FF] ${
                      isLight ? 'bg-zinc-50 border-black/10 text-camry-blackout' : 'bg-[#141418] border-white/15 text-white'
                    }`}
                  >
                    {allAgents.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({getAgentCat(a)})</option>
                    ))}
                  </select>
                </div>
                
                {/* Active Prompt Preview */}
                {(() => {
                  const currentAgent = allAgents.find(a => a.id === playgroundSelectedAgentId) || allAgents[0];
                  if (!currentAgent) return null;
                  return (
                    <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-dashed border-black/5 dark:border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-martian font-bold opacity-60">SYSTEM COMPILER RULES</span>
                        <span className="text-[9px] font-martian opacity-50 px-1.5 py-0.25 bg-black/5 dark:bg-white/5 rounded">
                          {currentAgent.currentVersion || 'v1.0.0'}
                        </span>
                      </div>
                      <div className={`p-2.5 rounded-lg text-xs font-mono max-h-36 overflow-y-auto break-words whitespace-pre-wrap ${
                        isLight ? 'bg-zinc-100 text-camry-graphite' : 'bg-[#141418] text-zinc-300'
                      }`}>
                        {currentAgent.systemPrompt || 'No specific prompt rules configured.'}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Hardware / Model Configuration Card */}
              <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
                isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'
              }`}>
                <h3 className="font-bricolage text-sm font-semibold flex items-center gap-2">
                  <Cpu size={16} className="text-[#0066FF]" />
                  Sovereign NPU Target
                </h3>
                
                {/* Camry recommendation */}
                {(() => {
                  const currentAgent = allAgents.find(a => a.id === playgroundSelectedAgentId) || allAgents[0];
                  const rec = getRecommendedModel(currentAgent?.category || 'Other', currentAgent?.systemPrompt || '');
                  return (
                    <div className={`p-2.5 rounded-lg text-xs leading-relaxed flex flex-col gap-1 ${
                      isLight ? 'bg-emerald-50 text-emerald-800' : 'bg-emerald-950/20 text-emerald-300'
                    }`}>
                      <div className="flex items-center gap-1 font-semibold text-[10px] font-martian">
                        <Sparkles size={12} className="text-emerald-500" />
                        RECOMMENDED NPU COMPILATION
                      </div>
                      <div>
                        Use <strong className="font-mono">{rec.id}</strong> — {rec.reason}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-martian font-bold opacity-60">TARGET CHIP COMPILER MODEL</label>
                  <select 
                    value={playgroundSelectedModelId || ''}
                    onChange={(e) => setPlaygroundSelectedModelId(e.target.value || null)}
                    className={`p-2 rounded-lg text-xs font-familjen border focus:ring-1 focus:ring-[#0066FF] ${
                      isLight ? 'bg-zinc-50 border-black/10 text-camry-blackout' : 'bg-[#141418] border-white/15 text-white'
                    }`}
                  >
                    <option value="">Recommended (Auto-tune)</option>
                    {AVAILABLE_MODELS.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.params} / {m.size})</option>
                    ))}
                  </select>
                </div>

                {/* Hyperparameter Simulators */}
                <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-black/5 dark:border-white/10">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-martian opacity-75">
                      <span>TEMPERATURE</span>
                      <span className="font-mono">0.2 (Low-Risk Analytical)</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.1" defaultValue="0.2" className="accent-[#0066FF] h-1 bg-black/10 dark:bg-white/10 rounded-lg cursor-pointer" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-martian opacity-75">
                      <span>TOP_P (NUCLEUS)</span>
                      <span className="font-mono">0.95</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.05" defaultValue="0.95" className="accent-[#0066FF] h-1 bg-black/10 dark:bg-white/10 rounded-lg cursor-pointer" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-martian opacity-75">
                      <span>NPU CORE PRIORITY</span>
                      <span className="font-mono text-emerald-500">MAX_PERF</span>
                    </div>
                    <input type="range" min="1" max="4" step="1" defaultValue="4" className="accent-[#0066FF] h-1 bg-black/10 dark:bg-white/10 rounded-lg cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Simulation Scenarios Deck */}
              <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
                isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'
              }`}>
                <h3 className="font-bricolage text-sm font-semibold flex items-center gap-2">
                  <Sliders size={16} className="text-[#0066FF]" />
                  Simulated Input Templates
                </h3>
                <p className={`text-xs ${isLight ? 'text-camry-graphite/70' : 'text-zinc-400'} leading-relaxed`}>
                  Inject simulated high-complexity enterprise contexts to stress-test your agent prompt rules.
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      label: 'NDA Clause Audit',
                      text: 'Analyze standard mutual NDA liability provisions for cross-border African data sovereignty guidelines.',
                      cat: 'Legal'
                    },
                    {
                      label: 'Clinical EHR Synopsis',
                      text: 'Synthesize 12-month patient electronic health record data regarding diabetic medication contraindications.',
                      cat: 'Medical'
                    },
                    {
                      label: 'Ledger Audit Profile',
                      text: 'Review corporate balance sheet transaction histories for repetitive sub-dollar rounding discrepancies.',
                      cat: 'Finance'
                    },
                    {
                      label: 'Sovereign Compliance Risk',
                      text: 'Conduct high-precision regulatory audit simulation against localized compliance frameworks.',
                      cat: 'Government'
                    }
                  ].map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPlaygroundInput(tpl.text)}
                      className={`p-2.5 rounded-lg text-left border text-xs transition-all hover:border-[#0066FF]/40 cursor-pointer ${
                        isLight ? 'bg-zinc-50 border-black/5 text-camry-blackout hover:bg-zinc-100' : 'bg-[#141418] border-white/5 text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-[10px] font-martian">{tpl.label}</span>
                        <span className="text-[8px] font-martian opacity-60 uppercase bg-black/5 dark:bg-white/5 px-1 rounded">{tpl.cat}</span>
                      </div>
                      <p className="line-clamp-1 opacity-80 text-[10px] leading-snug">{tpl.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Interaction Sandbox & Metrics */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden h-full">
              {/* Telemetry Monitor Panel */}
              <div className={`p-4 rounded-xl border flex flex-col gap-3 flex-shrink-0 ${
                isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'
              }`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-bricolage text-sm font-semibold flex items-center gap-2">
                    <RefreshCw size={15} className={`text-[#0066FF] ${isPlaygroundThinking ? 'animate-spin' : ''}`} />
                    Real-time Response Telemetry
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] font-martian opacity-60">CAMRY NPU LIVE</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'INFERENCE LATENCY', value: isPlaygroundThinking ? 'Computing...' : '18.4ms (avg)', desc: 'NPU dispatch latency' },
                    { label: 'COMPILING SPEED', value: isPlaygroundThinking ? 'Generating...' : '1,480 tok/s', desc: 'Hardware burst limit' },
                    { label: 'VRAM ALLOCATION', value: '22.4 GB / 64 GB', desc: 'Sovereign Cluster-04' },
                    { label: 'COMPILER ALIGNMENT', value: '99.4% Pass', desc: 'Pre-deployment audit' }
                  ].map((m, idx) => (
                    <div key={idx} className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                      isLight ? 'bg-zinc-50 border-black/5' : 'bg-[#141418] border-white/5'
                    }`}>
                      <span className="text-[9px] font-martian opacity-50 block truncate">{m.label}</span>
                      <span className={`text-xs font-semibold my-1 font-martian ${
                        idx === 0 && isPlaygroundThinking ? 'text-blue-500' :
                        idx === 3 ? 'text-emerald-500' : ''
                      }`}>{m.value}</span>
                      <span className="text-[8px] opacity-40 block truncate">{m.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Simulator Canvas */}
              <div className={`flex-1 rounded-xl border flex flex-col overflow-hidden ${
                isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'
              }`}>
                {/* Chat header info */}
                <div className={`px-4 py-2 border-b flex items-center justify-between text-xs font-martian ${
                  isLight ? 'bg-zinc-50 border-black/5 text-camry-graphite/70' : 'bg-[#141418] border-white/10 text-zinc-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded font-semibold text-[9px]">SANDBOX SHELL</span>
                    <span>Active blueprint: <strong className="text-[#0066FF]">{(allAgents.find(a => a.id === playgroundSelectedAgentId) || allAgents[0])?.name}</strong></span>
                  </div>
                  <button 
                    onClick={() => setPlaygroundMessages([])}
                    className="hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Clear Feed
                  </button>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
                  {playgroundMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                      <div className="p-4 bg-blue-500/10 text-blue-500 rounded-full mb-3">
                        <Bot size={36} />
                      </div>
                      <h4 className="font-bricolage text-sm font-semibold mb-1">Interactive Blueprint Playground</h4>
                      <p className="text-xs max-w-sm leading-relaxed">
                        Simulate real-time inputs or load a template from the left deck to monitor NPU alignment, response accuracy, and localized compiler performance metrics securely.
                      </p>
                    </div>
                  ) : (
                    playgroundMessages.map((msg, i) => (
                      <div 
                        key={i} 
                        className={`flex flex-col max-w-[85%] ${
                          msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                        }`}
                      >
                        <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                          msg.role === 'user' 
                            ? (isLight ? 'bg-camry-blackout text-white rounded-tr-none' : 'bg-[#0066FF] text-white rounded-tr-none')
                            : (isLight ? 'bg-zinc-100 text-camry-blackout rounded-tl-none border border-black/5' : 'bg-[#141418] text-white rounded-tl-none border border-white/10')
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[9px] font-martian opacity-50">
                          <span>{msg.role === 'user' ? 'Simulator User' : msg.model || 'Camry NPU Thread'}</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}

                  {isPlaygroundThinking && (
                    <div className="self-start flex flex-col max-w-[85%] items-start">
                      <div className={`p-3 rounded-xl rounded-tl-none text-xs leading-relaxed flex items-center gap-2 ${
                        isLight ? 'bg-zinc-100 text-camry-graphite border border-black/5' : 'bg-[#141418] text-zinc-400 border border-white/10'
                      }`}>
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="font-mono text-[10px]">Processing securely on Camry ONE NPU cluster...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Panel */}
                <div className={`p-3 border-t flex gap-2 items-center ${
                  isLight ? 'border-black/5 bg-zinc-50' : 'border-white/10 bg-[#16161C]'
                }`}>
                  <input
                    type="text"
                    value={playgroundInput}
                    onChange={(e) => setPlaygroundInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendPlaygroundTest();
                    }}
                    placeholder="Enter test user prompt to simulate NPU compilation..."
                    className={`flex-1 p-2 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-[#0066FF] ${
                      isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#141418] border-white/15 text-white'
                    }`}
                  />
                  <button
                    onClick={handleSendPlaygroundTest}
                    disabled={isPlaygroundThinking || !playgroundInput.trim()}
                    className={`p-2 rounded-lg text-white transition-all cursor-pointer flex items-center justify-center ${
                      playgroundInput.trim() && !isPlaygroundThinking 
                        ? 'bg-[#0066FF] hover:bg-[#0052CC]' 
                        : 'bg-zinc-500/20 text-zinc-400 cursor-not-allowed'
                    }`}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-8">
          {filteredAgents.map(agent => {
            const isInstalled = installedAgents.includes(agent.id);
            const isDownloading = downloading === agent.id;
            const status = getAgentStatus(agent);

            return (
              <div 
                key={agent.id} 
                draggable={true}
                onDragStart={(e) => {
                  setDraggedAgentId(agent.id);
                  e.dataTransfer.setData('text/plain', agent.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverAgentId !== agent.id) {
                    setDragOverAgentId(agent.id);
                  }
                }}
                onDragLeave={() => {
                  if (dragOverAgentId === agent.id) {
                    setDragOverAgentId(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const sourceId = e.dataTransfer.getData('text/plain') || draggedAgentId;
                  if (sourceId && sourceId !== agent.id) {
                    handleReorderAgents(sourceId, agent.id);
                  }
                  setDraggedAgentId(null);
                  setDragOverAgentId(null);
                }}
                onDragEnd={() => {
                  setDraggedAgentId(null);
                  setDragOverAgentId(null);
                }}
                className={`rounded-xl p-4 sm:p-5 border transition-all flex flex-col h-full group relative ${
                  draggedAgentId === agent.id ? 'opacity-30 border-dashed border-[#0066FF] scale-[0.98]' :
                  dragOverAgentId === agent.id ? 'border-2 border-[#0066FF] bg-blue-500/10 scale-[1.02] shadow-lg' : 
                  isLight ? 'bg-white border-black/5 shadow-xs hover:shadow-md' : 'bg-[#1C1C22] border-white/10 shadow-xs hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div 
                      className={`cursor-grab active:cursor-grabbing p-1 rounded transition-colors flex-shrink-0 ${
                        isLight ? 'hover:bg-black/5 text-camry-graphite/40 hover:text-black' : 'hover:bg-white/10 text-zinc-500 hover:text-white'
                      }`}
                      title="Drag to reorder agent priority"
                    >
                      <GripVertical size={16} />
                    </div>
                    <AgentLogo 
                      agentId={agent.id} 
                      name={agent.name} 
                      size={44} 
                      className="group-hover:scale-105 transition-transform" 
                    />
                  </div>

                  {/* Visual Status Indicator & Installed Tag */}
                  <div className="flex flex-wrap justify-end items-center gap-1">
                    {isInstalled ? (
                      <span className="inline-flex items-center gap-1 font-martian text-[9px] sm:text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold shadow-xs">
                        <Check size={11} /> INSTALLED
                      </span>
                    ) : null}

                    {/* Agent Status Badge */}
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-martian text-[9px] sm:text-[10px] font-bold shadow-xs ${
                      status === 'active' 
                        ? 'bg-emerald-600 text-white' 
                        : status === 'error'
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full bg-white ${
                        status === 'active' ? 'animate-pulse' :
                        status === 'error' ? 'animate-ping' : ''
                      }`} />
                      <span className="capitalize">{status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-1 gap-2">
                  <h3 className={`font-bricolage text-base sm:text-lg font-medium ${isLight ? 'text-camry-blackout' : 'text-white'}`}>{agent.name}</h3>
                  <span className={`font-martian text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${
                    isLight ? 'bg-black/5 text-camry-graphite/60' : 'bg-white/10 text-zinc-400'
                  }`}>
                    {agent.currentVersion || 'v1.0.0'}
                  </span>
                </div>

                <p className={`font-familjen text-xs sm:text-sm flex-1 leading-relaxed mb-3 ${
                  isLight ? 'text-camry-graphite/70' : 'text-zinc-300'
                }`}>{agent.description}</p>
                
                {/* Status Reason Banner */}
                {agent.statusReason && (
                  <div className={`text-[9px] sm:text-[10px] font-martian px-2 py-1 rounded mb-3 break-words ${
                    status === 'error' ? (isLight ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-red-950/40 text-red-300 border border-red-800/40') :
                    status === 'active' ? (isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40') :
                    (isLight ? 'bg-camry-graphite/5 text-camry-graphite/60' : 'bg-white/5 text-zinc-400')
                  }`}>
                    <span className="font-semibold uppercase tracking-wider mr-1">NPU Status:</span>
                    {agent.statusReason}
                  </div>
                )}

                <div className={`mt-auto pt-3 border-t flex items-center justify-between gap-2 ${
                  isLight ? 'border-black/5' : 'border-white/10'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 font-martian text-xs ${
                      isLight ? 'text-camry-graphite/40' : 'text-zinc-500'
                    }`}>
                      <Heart size={13} /> {agent.likes}
                    </div>

                    {/* Version History Button */}
                    <button
                      onClick={() => {
                        setSelectedAgentForHistory(agent);
                        setShowHistoryModal(true);
                      }}
                      className={`p-1 rounded transition-colors flex items-center gap-1 text-[10px] sm:text-[11px] font-martian cursor-pointer ${
                        isLight ? 'hover:bg-black/5 text-camry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                      }`}
                      title="View Version History & Rollback"
                    >
                      <History size={13} />
                      <span>History</span>
                    </button>

                    {/* Edit Custom Agent Button */}
                    {!['legal', 'contract', 'medical', 'gov', 'industrial', 'finance', 'meeting'].includes(agent.id) && (
                      <button
                        onClick={() => handleEditAgentStart(agent)}
                        className={`p-1 rounded transition-colors flex items-center gap-1 text-[10px] sm:text-[11px] font-martian cursor-pointer ${
                          isLight ? 'hover:bg-black/5 text-amber-600 hover:text-amber-700' : 'hover:bg-white/10 text-amber-400 hover:text-amber-300'
                        }`}
                        title="Edit Custom Agent Blueprint"
                      >
                        <Sliders size={12} />
                        <span>Edit</span>
                      </button>
                    )}

                    {/* Quick Sandbox Tester */}
                    <button
                      onClick={() => {
                        setPlaygroundSelectedAgentId(agent.id);
                        setActiveCat('Playground Sandbox 🧪');
                        showToast(`Loaded ${agent.name} into Sandbox`, 'info', 'PLAYGROUND');
                      }}
                      className={`p-1 rounded transition-colors flex items-center gap-1 text-[10px] sm:text-[11px] font-martian cursor-pointer ${
                        isLight ? 'hover:bg-black/5 text-[#0066FF] hover:text-[#0052CC]' : 'hover:bg-white/10 text-blue-400 hover:text-blue-300'
                      }`}
                      title="Test in Playground Sandbox"
                    >
                      <Play size={12} />
                      <span>Sandbox</span>
                    </button>
                  </div>
                  
                  {isDownloading ? (
                    <div className="w-20">
                      <div className={`w-full h-1 rounded-full overflow-hidden ${isLight ? 'bg-camry-graphite/10' : 'bg-white/10'}`}>
                        <div className="h-full bg-[#0066FF] transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
                      </div>
                    </div>
                  ) : isInstalled ? (
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleOpen(agent.id)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                          isLight ? 'bg-camry-blackout text-white hover:bg-black' : 'bg-[#0066FF] text-white hover:bg-[#0052CC]'
                        }`}
                      >
                        Launch
                      </button>
                      <button 
                        onClick={() => uninstallAgent(agent.id)}
                        title="Uninstall Agent"
                        className="p-1.5 rounded text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleInstall(agent.id)}
                      className={`px-4 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                        isLight ? 'bg-camry-graphite/10 text-camry-blackout hover:bg-camry-graphite/20' : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Get Agent
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </>
    )}

      </div>

      {/* Create Custom Agent Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border relative font-familjen ${
                isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#1C1C22] border-white/15 text-white'
              }`}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${
                isLight ? 'border-black/5 bg-zinc-50/50' : 'border-white/10 bg-[#16161C]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0066FF] rounded-lg text-white">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold font-bricolage leading-none ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
                      On-Device Agent Workshop
                    </h3>
                    <p className={`text-xs mt-1 ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>
                      Design specialized agent blueprints and simulate NPU compilation.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    resetCreateForm();
                    setShowCreateModal(false);
                  }} 
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    isLight ? 'hover:bg-black/5 text-camry-graphite/50 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form surrounding split panes */}
              <form onSubmit={handleCreateAgentSubmit} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left Column: Blueprint Designer */}
                  <div className="md:col-span-6 flex flex-col gap-4 pr-0 md:pr-6 md:border-r border-black/5 dark:border-white/10">
                    <div>
                      <span className="text-[10px] font-martian font-bold tracking-wider text-blue-500 uppercase block mb-1">
                        STEP 1: AGENT IDENTITY
                      </span>
                      <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-camry-graphite/80' : 'text-zinc-300'}`}>
                        Agent Name
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Risk Auditor Pro"
                        value={newAgentName}
                        onChange={(e) => setNewAgentName(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-familjen focus:outline-none focus:ring-2 focus:ring-[#0066FF] ${
                          isLight ? 'border-black/10 bg-camry-graphite/5 text-camry-blackout' : 'border-white/15 bg-[#141418] text-white'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-camry-graphite/80' : 'text-zinc-300'}`}>
                          Industry Category
                        </label>
                        <CustomSelect
                          fullWidth
                          value={newAgentCat}
                          onChange={(val) => setNewAgentCat(val)}
                          options={[
                            { value: 'Legal', label: 'Legal' },
                            { value: 'Medical', label: 'Medical' },
                            { value: 'Government', label: 'Government' },
                            { value: 'Industrial', label: 'Industrial' },
                            { value: 'Finance', label: 'Finance' },
                            { value: 'Other', label: 'Other' },
                          ]}
                          buttonClassName={isLight ? 'bg-camry-graphite/5 border-black/10 rounded-lg py-2 text-xs font-medium' : 'bg-[#141418] border-white/15 rounded-lg py-2 text-white text-xs font-medium'}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-camry-graphite/80' : 'text-zinc-300'}`}>
                          Short Purpose
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. Scans and reviews files"
                          value={newAgentDesc}
                          onChange={(e) => setNewAgentDesc(e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 text-xs font-familjen focus:outline-none focus:ring-2 focus:ring-[#0066FF] ${
                            isLight ? 'border-black/10 bg-camry-graphite/5 text-camry-blackout' : 'border-white/15 bg-[#141418] text-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-martian font-bold tracking-wider text-blue-500 uppercase block mb-1">
                        STEP 2: SYSTEM INSTRUCTIONS
                      </span>
                      <div className="flex items-center justify-between mb-1">
                        <label className={`block text-xs font-semibold ${isLight ? 'text-camry-graphite/80' : 'text-zinc-300'}`}>
                          Instruction Persona Prompt
                        </label>
                        <span className="text-[10px] text-zinc-400 font-mono">Max token budget: 4,096</span>
                      </div>
                      <textarea 
                        rows={4}
                        required
                        placeholder="e.g. You are an expert risk analyst. Audit the inputted financial ledgers and flag discrepancies, showing your compliance confidence rating..."
                        value={newAgentPrompt}
                        onChange={(e) => setNewAgentPrompt(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-xs font-familjen focus:outline-none focus:ring-2 focus:ring-[#0066FF] resize-none leading-relaxed ${
                          isLight ? 'border-black/10 bg-camry-graphite/5 text-camry-blackout' : 'border-white/15 bg-[#141418] text-white'
                        }`}
                      />
                    </div>

                    {/* Model Recommendation Engine */}
                    <div className="mt-2 pt-2 border-t border-dashed border-black/5 dark:border-white/10">
                      <span className="text-[10px] font-martian font-bold tracking-wider text-emerald-500 uppercase block mb-1">
                        STEP 3: ENGINE OPTIMIZATION
                      </span>

                      {/* Recommendation Alert Block */}
                      {(() => {
                        const rec = getRecommendedModel(newAgentCat, newAgentPrompt);
                        const modelDetails = AVAILABLE_MODELS.find(m => m.id === rec.id) || AVAILABLE_MODELS[0];
                        return (
                          <div className="space-y-3">
                            <div className={`p-3.5 rounded-xl border flex gap-3 ${
                              isLight ? 'bg-emerald-50/50 border-emerald-200/60' : 'bg-emerald-950/20 border-emerald-900/40'
                            }`}>
                              <Sparkles size={18} className="text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-martian uppercase tracking-wider">
                                  <span>Camry NPU Recommends</span>
                                  <span className="px-1.5 py-0.5 bg-emerald-600 text-white font-mono text-[9px] rounded font-bold">
                                    {modelDetails.params} Local
                                  </span>
                                </h4>
                                <p className={`text-xs font-semibold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                                  {modelDetails.name} — Recommended Engine
                                </p>
                                <p className={`text-[11px] leading-relaxed ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                  {rec.reason}
                                </p>
                              </div>
                            </div>

                            {/* Dropdown Selector Override */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className={`block text-xs font-semibold ${isLight ? 'text-camry-graphite/80' : 'text-zinc-300'}`}>
                                  Target On-Device LLM (Override)
                                </label>
                                {customSelectedModelId && (
                                  <button 
                                    type="button"
                                    onClick={() => setCustomSelectedModelId(null)}
                                    className="text-[10px] text-emerald-600 hover:underline flex items-center gap-1 font-bold"
                                  >
                                    <RotateCcw size={10} /> Reset to Recommended
                                  </button>
                                )}
                              </div>
                              <CustomSelect
                                fullWidth
                                value={activeModelId}
                                onChange={(val) => setCustomSelectedModelId(val)}
                                options={AVAILABLE_MODELS.filter(m => m.type === 'Text Generation').map(m => {
                                  const isRec = m.id === rec.id;
                                  return {
                                    value: m.id,
                                    label: `${m.name} (${m.params}) ${isRec ? '★ RECOMMENDED' : ''}`
                                  };
                                })}
                                buttonClassName={isLight ? 'bg-camry-graphite/5 border-black/10 rounded-lg py-2 text-xs font-medium' : 'bg-[#141418] border-white/15 rounded-lg py-2 text-white text-xs font-medium'}
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right Column: Interactive Sandbox testing sandbox */}
                  <div className="md:col-span-6 flex flex-col h-full min-h-[350px] overflow-hidden">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/10 flex-shrink-0">
                      <div>
                        <span className="text-[10px] font-martian font-bold tracking-wider text-[#0066FF] uppercase block">
                          VALIDATION PLAYGROUND
                        </span>
                        <span className="text-xs font-bold block mt-0.5">
                          Inference Dry-Run Sandbox
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Sandbox Core</span>
                      </div>
                    </div>

                    {/* Messages Panel Container */}
                    <div className="flex-1 flex flex-col justify-between overflow-hidden">
                      
                      {/* Interactive sandbox History */}
                      <div className={`flex-1 overflow-y-auto rounded-xl p-3.5 space-y-3.5 min-h-[220px] max-h-[360px] ${
                        isLight ? 'bg-zinc-50 border border-black/5' : 'bg-black/30 border border-white/5'
                      }`}>
                        {testMessages.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-3">
                            <Bot size={32} className="text-blue-500 opacity-60 animate-bounce" />
                            <div className="max-w-[280px]">
                              <p className={`text-xs font-bold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                                Local Sandbox Ready
                              </p>
                              <p className={`text-[11px] leading-relaxed mt-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                Write a test message below (e.g., "Audit my ledger") to verify how this agent behaves in real-time under the current blueprint configuration.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {testMessages.map((msg, idx) => (
                              <div 
                                key={idx} 
                                className={`flex flex-col max-w-[85%] ${
                                  msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                                }`}
                              >
                                <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                                  msg.role === 'user'
                                    ? 'bg-[#0066FF] text-white rounded-br-none'
                                    : isLight
                                    ? 'bg-zinc-100 text-zinc-800 border border-black/5 rounded-bl-none'
                                    : 'bg-zinc-800 text-zinc-200 border border-white/5 rounded-bl-none'
                                }`}>
                                  <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-1 px-1">
                                  <span className={`text-[9px] font-mono ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                    {msg.timestamp}
                                  </span>
                                  {msg.model && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold uppercase tracking-wider scale-90">
                                      {msg.model}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* Thinking skeleton */}
                            {isTestThinking && (
                              <div className="flex flex-col items-start max-w-[85%] mr-auto animate-pulse">
                                <div className={`px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-2 text-xs font-semibold ${
                                  isLight ? 'bg-zinc-100 text-zinc-600' : 'bg-zinc-800 text-zinc-400'
                                }`}>
                                  <RefreshCw size={12} className="animate-spin text-blue-500" />
                                  <span>Simulating local NPU inference...</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Clear history button */}
                      {testMessages.length > 0 && (
                        <div className="flex justify-end mt-1.5">
                          <button 
                            type="button" 
                            onClick={() => setTestMessages([])} 
                            className={`text-[10px] font-semibold flex items-center gap-1 transition-colors ${
                              isLight ? 'text-red-600 hover:text-red-700' : 'text-red-400 hover:text-red-300'
                            }`}
                          >
                            <Trash2 size={11} /> Reset Test Sandbox
                          </button>
                        </div>
                      )}

                      {/* Playground prompt entry */}
                      <div className="mt-3">
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder={isTestThinking ? "Computing..." : "Type sandbox query..."}
                            disabled={isTestThinking}
                            value={testInput}
                            onChange={(e) => setTestInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSendTest();
                              }
                            }}
                            className={`flex-1 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              isLight ? 'border-black/10 bg-white text-camry-blackout' : 'border-white/10 bg-[#121216] text-white'
                            }`}
                          />
                          <button 
                            type="button"
                            disabled={!testInput.trim() || isTestThinking}
                            onClick={() => handleSendTest()}
                            className="px-3.5 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <Send size={12} />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Sticky Footer */}
                <div className={`px-6 py-4 border-t flex items-center justify-between flex-shrink-0 ${
                  isLight ? 'bg-zinc-50/50 border-black/5' : 'bg-[#16161C] border-white/10'
                }`}>
                  <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold">
                    <Check size={14} />
                    <span>Dry-run compilation verified • Standby</span>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => {
                        resetCreateForm();
                        setShowCreateModal(false);
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isLight ? 'text-camry-graphite hover:bg-black/5' : 'text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!newAgentName.trim()}
                      className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <Play size={11} className="fill-white" /> Compile & Install Agent
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Custom Agent Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border relative font-familjen ${
                isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#1C1C22] border-white/15 text-white'
              }`}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${
                isLight ? 'border-black/5 bg-zinc-50/50' : 'border-white/10 bg-[#16161C]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 rounded-lg text-white">
                    <Sliders size={20} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold font-bricolage leading-none ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
                      Modify Custom Agent Blueprint
                    </h3>
                    <p className={`text-xs mt-1 ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>
                      Update instructions, categories, or system prompts. Saves will generate a new auto-incremented version.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    resetEditForm();
                    setShowEditModal(false);
                  }} 
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    isLight ? 'hover:bg-black/5 text-camry-graphite/50 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form surrounding split panes */}
              <form onSubmit={handleEditAgentSubmit} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left Column: Blueprint Designer */}
                  <div className="md:col-span-6 flex flex-col gap-4 pr-0 md:pr-6 md:border-r border-black/5 dark:border-white/10">
                    <div>
                      <span className="text-[10px] font-martian font-bold tracking-wider text-amber-500 uppercase block mb-1">
                        IDENTITY & DOMAIN
                      </span>
                      <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-camry-graphite/80' : 'text-zinc-300'}`}>
                        Agent Name
                      </label>
                      <input 
                        type="text" 
                        required
                        value={editAgentName}
                        onChange={(e) => setEditAgentName(e.target.value)}
                        placeholder="e.g. Legal Drafter"
                        className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                          isLight ? 'border-black/10 bg-white text-camry-blackout' : 'border-white/15 bg-[#141418] text-white'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-camry-graphite/80' : 'text-zinc-300'}`}>
                          Taxonomy Category
                        </label>
                        <CustomSelect
                          fullWidth
                          value={editAgentCat}
                          onChange={(val) => setEditAgentCat(val)}
                          options={[
                            { value: 'Legal', label: 'Legal' },
                            { value: 'Medical', label: 'Medical' },
                            { value: 'Government', label: 'Government' },
                            { value: 'Industrial', label: 'Industrial' },
                            { value: 'Finance', label: 'Finance' },
                            { value: 'Other', label: 'Other' }
                          ]}
                          buttonClassName={isLight ? 'bg-camry-graphite/5 border-black/10 rounded-lg py-2 text-xs font-medium' : 'bg-[#141418] border-white/15 rounded-lg py-2 text-white text-xs font-medium'}
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-camry-graphite/80' : 'text-zinc-300'}`}>
                          Agent Status
                        </label>
                        <div className={`p-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${
                          isLight ? 'bg-zinc-50 border-black/10' : 'bg-[#141418] border-white/10'
                        }`}>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active on Local Core</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-camry-graphite/80' : 'text-zinc-300'}`}>
                        Blueprint Purpose / Description
                      </label>
                      <input 
                        type="text" 
                        value={editAgentDesc}
                        onChange={(e) => setEditAgentDesc(e.target.value)}
                        placeholder="Provide a brief summary of what this agent does..."
                        className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                          isLight ? 'border-black/10 bg-white text-camry-blackout' : 'border-white/15 bg-[#141418] text-white'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className={`block text-xs font-semibold ${isLight ? 'text-camry-graphite/80' : 'text-zinc-300'}`}>
                          System Instructions (Prompt Rules)
                        </label>
                        <span className="text-[10px] font-martian opacity-50 font-bold uppercase">Sovereign Compiler System</span>
                      </div>
                      <textarea 
                        required
                        rows={4}
                        value={editAgentPrompt}
                        onChange={(e) => setEditAgentPrompt(e.target.value)}
                        placeholder="Explain step-by-step how the custom agent should think, react, and structure responses..."
                        className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono ${
                          isLight ? 'border-black/10 bg-white text-camry-blackout' : 'border-white/15 bg-[#141418] text-white'
                        }`}
                      />
                    </div>

                    {/* Hardware Engine Recommender */}
                    <div className="mt-1">
                      {(() => {
                        const rec = getRecommendedModel(editAgentCat, editAgentPrompt);
                        const activeModelId = editSelectedModelId || rec.id;
                        const modelDetails = AVAILABLE_MODELS.find(m => m.id === activeModelId) || AVAILABLE_MODELS[0];
                        
                        return (
                          <div className="space-y-3">
                            <div className={`p-3 rounded-xl border flex gap-3 ${
                              isLight ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-500/5 border-emerald-500/15'
                            }`}>
                              <div className="p-2 bg-emerald-500 text-white rounded-lg self-start">
                                <Cpu size={16} />
                              </div>
                              <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-martian uppercase tracking-wider">
                                  <span>Camry NPU Recommends</span>
                                  <span className="px-1.5 py-0.5 bg-emerald-600 text-white font-mono text-[9px] rounded font-bold">
                                    {modelDetails.params} Local
                                  </span>
                                </h4>
                                <p className={`text-xs font-semibold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                                  {modelDetails.name} — Recommended Engine
                                </p>
                                <p className={`text-[11px] leading-relaxed ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                  {rec.reason}
                                </p>
                              </div>
                            </div>

                            {/* Dropdown Selector Override */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className={`block text-xs font-semibold ${isLight ? 'text-camry-graphite/80' : 'text-zinc-300'}`}>
                                  Target On-Device LLM (Override)
                                </label>
                                {editSelectedModelId && (
                                  <button 
                                    type="button"
                                    onClick={() => setEditSelectedModelId(null)}
                                    className="text-[10px] text-emerald-600 hover:underline flex items-center gap-1 font-bold"
                                  >
                                    <RotateCcw size={10} /> Reset to Recommended
                                  </button>
                                )}
                              </div>
                              <CustomSelect
                                fullWidth
                                value={activeModelId}
                                onChange={(val) => setEditSelectedModelId(val)}
                                options={AVAILABLE_MODELS.filter(m => m.type === 'Text Generation').map(m => {
                                  const isRec = m.id === rec.id;
                                  return {
                                    value: m.id,
                                    label: `${m.name} (${m.params}) ${isRec ? '★ RECOMMENDED' : ''}`
                                  };
                                })}
                                buttonClassName={isLight ? 'bg-camry-graphite/5 border-black/10 rounded-lg py-2 text-xs font-medium' : 'bg-[#141418] border-white/15 rounded-lg py-2 text-white text-xs font-medium'}
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right Column: Interactive Sandbox testing sandbox */}
                  <div className="md:col-span-6 flex flex-col h-full min-h-[350px] overflow-hidden">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/10 flex-shrink-0">
                      <div>
                        <span className="text-[10px] font-martian font-bold tracking-wider text-amber-500 uppercase block">
                          VALIDATION PLAYGROUND
                        </span>
                        <span className="text-xs font-bold block mt-0.5">
                          Inference Dry-Run Sandbox
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Sandbox Core</span>
                      </div>
                    </div>

                    {/* Messages Panel Container */}
                    <div className="flex-1 flex flex-col justify-between overflow-hidden">
                      
                      {/* Interactive sandbox History */}
                      <div className={`flex-1 overflow-y-auto rounded-xl p-3.5 space-y-3.5 min-h-[220px] max-h-[360px] no-scrollbar ${
                        isLight ? 'bg-zinc-50 border border-black/5' : 'bg-black/30 border border-white/5'
                      }`}>
                        {editTestMessages.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-3">
                            <Bot size={32} className="text-amber-500 opacity-60 animate-bounce" />
                            <div className="max-w-[280px]">
                              <p className={`text-xs font-bold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                                Local Sandbox Ready
                              </p>
                              <p className={`text-[11px] leading-relaxed mt-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                Write a test message below (e.g., "Audit my ledger") to verify how this edited agent behaves in real-time under the modified configuration.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {editTestMessages.map((msg, idx) => (
                              <div 
                                key={idx} 
                                className={`flex flex-col max-w-[85%] ${
                                  msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                                }`}
                              >
                                <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                                  msg.role === 'user'
                                    ? 'bg-amber-600 text-white rounded-br-none'
                                    : isLight
                                    ? 'bg-zinc-100 text-zinc-800 border border-black/5 rounded-bl-none'
                                    : 'bg-zinc-800 text-zinc-200 border border-white/5 rounded-bl-none'
                                }`}>
                                  <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-1 px-1">
                                  <span className={`text-[9px] font-mono ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                    {msg.timestamp}
                                  </span>
                                  {msg.model && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider scale-90">
                                      {msg.model}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* Thinking skeleton */}
                            {isEditTestThinking && (
                              <div className="flex flex-col items-start max-w-[85%] mr-auto animate-pulse">
                                <div className={`px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-2 text-xs font-semibold ${
                                  isLight ? 'bg-zinc-100 text-zinc-600' : 'bg-zinc-800 text-zinc-400'
                                }`}>
                                  <RefreshCw size={12} className="animate-spin text-amber-500" />
                                  <span>Simulating local NPU inference...</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Clear history button */}
                      {editTestMessages.length > 0 && (
                        <div className="flex justify-end mt-1.5">
                          <button 
                            type="button" 
                            onClick={() => setEditTestMessages([])} 
                            className={`text-[10px] font-semibold flex items-center gap-1 transition-colors ${
                              isLight ? 'text-red-600 hover:text-red-700' : 'text-red-400 hover:text-red-300'
                            }`}
                          >
                            <Trash2 size={11} /> Reset Test Sandbox
                          </button>
                        </div>
                      )}

                      {/* Playground prompt entry */}
                      <div className="mt-3">
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder={isEditTestThinking ? "Computing..." : "Type sandbox query..."}
                            disabled={isEditTestThinking}
                            value={editTestInput}
                            onChange={(e) => setEditTestInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSendEditTest();
                              }
                            }}
                            className={`flex-1 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                              isLight ? 'border-black/10 bg-white text-camry-blackout' : 'border-white/10 bg-[#121216] text-white'
                            }`}
                          />
                          <button 
                            type="button"
                            disabled={!editTestInput.trim() || isEditTestThinking}
                            onClick={() => handleSendEditTest()}
                            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <Send size={12} />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Sticky Footer */}
                <div className={`px-6 py-4 border-t flex items-center justify-between flex-shrink-0 ${
                  isLight ? 'bg-zinc-50/50 border-black/5' : 'bg-[#16161C] border-white/10'
                }`}>
                  <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold">
                    <Check size={14} />
                    <span>Dry-run compilation verified • Standby</span>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => {
                        resetEditForm();
                        setShowEditModal(false);
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isLight ? 'text-camry-graphite hover:bg-black/5' : 'text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!editAgentName.trim()}
                      className="px-5 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <Play size={11} className="fill-white" /> Compile & Reinstall Agent
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Version History & Rollback Modal */}
      <AnimatePresence>
        {showHistoryModal && selectedAgentForHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-2xl max-w-xl w-full p-6 shadow-2xl border relative max-h-[85vh] flex flex-col font-familjen ${
                isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#1C1C22] border-white/15 text-white'
              }`}
            >
              <div className={`flex items-center justify-between pb-4 mb-4 border-b ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isLight ? 'bg-camry-blackout text-white' : 'bg-[#0066FF] text-white'}`}>
                    <History size={18} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bricolage ${isLight ? 'text-camry-blackout' : 'text-white'}`}>{selectedAgentForHistory.name} — Version History</h3>
                    <p className={`font-familjen text-xs ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>
                      View prompt iterations and restore previous agent configurations on-device
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHistoryModal(false)} 
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    isLight ? 'hover:bg-black/5 text-camry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Version Timeline */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {(selectedAgentForHistory.versionHistory || [
                  { version: selectedAgentForHistory.currentVersion || 'v1.0.0', updatedAt: '2026-07-20', prompt: selectedAgentForHistory.systemPrompt || 'Default agent system prompt.', changes: 'Initial release on Camry ONE NPU.', author: 'Camry System' }
                ]).map((ver) => {
                  const isCurrent = (selectedAgentForHistory.currentVersion || 'v1.0.0') === ver.version;

                  return (
                    <div 
                      key={ver.version} 
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent 
                          ? (isLight ? 'bg-emerald-50/60 border-emerald-200 shadow-xs' : 'bg-emerald-950/40 border-emerald-800/40 shadow-xs')
                          : (isLight ? 'bg-camry-graphite/5 border-black/5 hover:border-black/15' : 'bg-[#141418] border-white/10 hover:border-white/20')
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded font-martian text-xs font-bold ${
                            isCurrent ? 'bg-emerald-600 text-white' : (isLight ? 'bg-camry-blackout text-white' : 'bg-[#0066FF] text-white')
                          }`}>
                            {ver.version}
                          </span>
                          {isCurrent && (
                            <span className="font-martian text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold shadow-xs">
                              ACTIVE VERSION
                            </span>
                          )}
                          <span className={`font-familjen text-xs ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>
                            • Released {ver.updatedAt} by {ver.author}
                          </span>
                        </div>

                        {!isCurrent && (
                          <button
                            onClick={() => {
                              rollbackAgentVersion(selectedAgentForHistory.id, ver.version);
                              setShowHistoryModal(false);
                            }}
                            className="px-3 py-1 rounded bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-martian transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <RotateCcw size={12} />
                            <span>Rollback</span>
                          </button>
                        )}
                      </div>

                      <div className={`text-xs font-familjen font-medium mb-2 ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
                        <span className={`font-martian text-[10px] uppercase tracking-wider block ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>Changelog:</span>
                        {ver.changes}
                      </div>

                      <div className={`p-3 rounded-lg border font-mono text-[11px] leading-relaxed ${
                        isLight ? 'bg-white/80 border-black/5 text-camry-graphite' : 'bg-[#141418] border-white/10 text-emerald-400'
                      }`}>
                        <span className={`font-martian text-[10px] uppercase tracking-wider block mb-1 ${isLight ? 'text-camry-graphite/50' : 'text-zinc-500'}`}>System Prompt:</span>
                        "{ver.prompt}"
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`pt-4 mt-4 border-t flex justify-end ${isLight ? 'border-black/10' : 'border-white/10'}`}>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                    isLight ? 'bg-camry-blackout text-white hover:bg-black' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Close History
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

