import React, { useState } from 'react';
import { useAppContext, Agent, AgentVersion } from '../store/AppContext';
import { CustomSelect } from '../components/CustomSelect';
import { Grid, Heart, Scale, FileText, Activity, Landmark, Settings, TrendingUp, Edit3, Globe, Plus, Search, Trash2, Check, X, Bot, History, RotateCcw, BarChart3, Cpu, Zap, Eye, GripVertical, Move } from 'lucide-react';
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
  const { allAgents, installedAgents, installAgent, uninstallAgent, addCustomAgent, rollbackAgentVersion, reorderAgents, setCurrentScreen, setActiveAgent } = useAppContext();
  
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

  // Custom Agent Creation Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDesc, setNewAgentDesc] = useState('');
  const [newAgentCat, setNewAgentCat] = useState('Legal');
  const [newAgentPrompt, setNewAgentPrompt] = useState('');

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
    addCustomAgent({
      id,
      name: newAgentName,
      description: newAgentDesc || 'Custom functional AI agent created on Camry ONE.',
      category: newAgentCat,
      systemPrompt: newAgentPrompt || `You are ${newAgentName}, a specialized AI agent on Camry OS.`,
    });
    setNewAgentName('');
    setNewAgentDesc('');
    setNewAgentPrompt('');
    setShowCreateModal(false);
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-camry-paper overflow-hidden relative">
      {/* Header */}
      <div className="p-4 sm:p-8 pb-4 border-b border-black/5 bg-camry-paper/50 z-10 flex-shrink-0 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Grid className="text-camry-blackout flex-shrink-0" size={22} />
            <h1 className="text-xl sm:text-2xl font-bricolage text-camry-blackout">Agent Store</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search input */}
            <div className="relative flex-1 sm:flex-none">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-camry-graphite/40" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agents..."
                className="w-full sm:w-48 pl-8 pr-3 py-1.5 bg-white border border-black/10 rounded-lg text-xs font-familjen focus:outline-none focus:border-camry-deep-carrier"
              />
            </div>

            {/* Create Custom Agent Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-camry-blackout text-white rounded-lg text-xs font-medium hover:bg-camry-graphite transition-all shadow-sm flex-shrink-0"
            >
              <Plus size={14} />
              <span>Build Agent</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar flex-nowrap sm:flex-wrap">
            {['All', 'Installed', 'Legal', 'Medical', 'Government', 'Industrial', 'Finance', 'Other'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap flex-shrink-0 ${activeCat === cat ? 'bg-camry-blackout text-white border-transparent' : 'bg-white border-black/10 text-camry-graphite hover:bg-camry-graphite/5'}`}
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
          <div className="mb-4 p-3 bg-camry-carrier/10 border border-camry-deep-carrier/20 rounded-xl flex items-center justify-between font-martian text-xs text-camry-blackout shadow-sm">
            <div className="flex items-center gap-2.5">
              <Move size={16} className="text-camry-deep-carrier flex-shrink-0" />
              <span>Drag & drop agent cards by the handle <GripVertical size={14} className="inline-block text-camry-graphite/70" /> to customize priority order.</span>
            </div>
            <span className="text-[10px] text-camry-graphite/60 bg-white/60 px-2 py-0.5 rounded border border-black/5">
              {filteredAgents.length} Installed
            </span>
          </div>
        )}

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
                className={`bg-white rounded-xl p-4 sm:p-5 border transition-all flex flex-col h-full group relative ${
                  draggedAgentId === agent.id ? 'opacity-30 border-dashed border-camry-deep-carrier scale-[0.98]' :
                  dragOverAgentId === agent.id ? 'border-2 border-camry-deep-carrier bg-camry-carrier/10 scale-[1.02] shadow-lg' : 'border-black/5 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div 
                      className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-black/5 text-camry-graphite/40 hover:text-black transition-colors flex-shrink-0"
                      title="Drag to reorder agent priority"
                    >
                      <GripVertical size={16} />
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-camry-graphite/5 flex items-center justify-center transition-colors group-hover:bg-camry-carrier/10 flex-shrink-0">
                      {agent.id === 'legal' && <Scale size={22} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                      {agent.id === 'contract' && <FileText size={22} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                      {agent.id === 'medical' && <Activity size={22} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                      {agent.id === 'gov' && <Landmark size={22} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                      {agent.id === 'industrial' && <Settings size={22} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                      {agent.id === 'finance' && <TrendingUp size={22} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                      {agent.id === 'meeting' && <Edit3 size={22} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                      {agent.id === 'translator' && <Globe size={22} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                      {agent.id.startsWith('custom-') && <Bot size={22} className="text-camry-deep-carrier" />}
                    </div>
                  </div>

                  {/* Visual Status Indicator & Installed Tag */}
                  <div className="flex flex-wrap justify-end items-center gap-1">
                    {isInstalled ? (
                      <span className="inline-flex items-center gap-1 font-martian text-[9px] sm:text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                        <Check size={11} /> INSTALLED
                      </span>
                    ) : null}

                    {/* Agent Status Badge */}
                    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-martian text-[9px] sm:text-[10px] border ${
                      status === 'active' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : status === 'error'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        status === 'active' ? 'bg-emerald-500 animate-pulse' :
                        status === 'error' ? 'bg-red-500 animate-ping' : 'bg-amber-400'
                      }`} />
                      <span className="capitalize">{status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-1 gap-2">
                  <h3 className="font-bricolage text-base sm:text-lg text-camry-blackout font-medium">{agent.name}</h3>
                  <span className="font-martian text-[9px] sm:text-[10px] bg-black/5 px-1.5 py-0.5 rounded text-camry-graphite/60 flex-shrink-0">
                    {agent.currentVersion || 'v1.0.0'}
                  </span>
                </div>

                <p className="font-familjen text-xs sm:text-sm text-camry-graphite/70 flex-1 leading-relaxed mb-3">{agent.description}</p>
                
                {/* Status Reason Banner */}
                {agent.statusReason && (
                  <div className={`text-[9px] sm:text-[10px] font-martian px-2 py-1 rounded mb-3 break-words ${
                    status === 'error' ? 'bg-red-50 text-red-600 border border-red-100' :
                    status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    'bg-camry-graphite/5 text-camry-graphite/60'
                  }`}>
                    <span className="font-semibold uppercase tracking-wider mr-1">NPU Status:</span>
                    {agent.statusReason}
                  </div>
                )}

                <div className="mt-auto pt-3 border-t border-black/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-camry-graphite/40 font-martian text-xs">
                      <Heart size={13} /> {agent.likes}
                    </div>

                    {/* Version History Button */}
                    <button
                      onClick={() => {
                        setSelectedAgentForHistory(agent);
                        setShowHistoryModal(true);
                      }}
                      className="p-1 rounded hover:bg-black/5 text-camry-graphite/60 hover:text-black transition-colors flex items-center gap-1 text-[10px] sm:text-[11px] font-martian"
                      title="View Version History & Rollback"
                    >
                      <History size={13} />
                      <span>History</span>
                    </button>
                  </div>
                  
                  {isDownloading ? (
                    <div className="w-20">
                      <div className="w-full h-1 bg-camry-graphite/10 rounded-full overflow-hidden">
                        <div className="h-full bg-camry-carrier transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
                      </div>
                    </div>
                  ) : isInstalled ? (
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleOpen(agent.id)}
                        className="px-3 py-1.5 rounded bg-camry-blackout text-white text-xs font-medium hover:bg-camry-graphite transition-colors"
                      >
                        Launch
                      </button>
                      <button 
                        onClick={() => uninstallAgent(agent.id)}
                        title="Uninstall Agent"
                        className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleInstall(agent.id)}
                      className="px-4 py-1.5 rounded bg-camry-graphite/10 text-camry-blackout text-xs font-medium hover:bg-camry-graphite/20 transition-colors"
                    >
                      Get Agent
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* Create Custom Agent Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-black/10 text-camry-blackout relative"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/5">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-camry-deep-carrier" />
                  <h3 className="text-xl font-bricolage">Build On-Device Agent</h3>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-camry-graphite/50 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateAgentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-martian text-camry-graphite/70 mb-1">AGENT NAME</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Tax Audit Specialist"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm font-familjen focus:outline-none focus:border-camry-deep-carrier bg-camry-graphite/5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-martian text-camry-graphite/70 mb-1">CATEGORY</label>
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
                    buttonClassName="bg-camry-graphite/5 border-black/10 rounded-lg py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-martian text-camry-graphite/70 mb-1">SHORT DESCRIPTION</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Scans balance sheets & flags compliance gaps locally."
                    value={newAgentDesc}
                    onChange={(e) => setNewAgentDesc(e.target.value)}
                    className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm font-familjen focus:outline-none focus:border-camry-deep-carrier bg-camry-graphite/5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-martian text-camry-graphite/70 mb-1">SYSTEM INSTRUCTION / PERSONA</label>
                  <textarea 
                    rows={3}
                    placeholder="Instructions guiding model reasoning and outputs..."
                    value={newAgentPrompt}
                    onChange={(e) => setNewAgentPrompt(e.target.value)}
                    className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm font-familjen focus:outline-none focus:border-camry-deep-carrier bg-camry-graphite/5 resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-camry-graphite hover:bg-camry-graphite/5"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 rounded-lg text-xs font-medium bg-camry-blackout text-white hover:bg-camry-graphite shadow-sm"
                  >
                    Install Custom Agent
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Version History & Rollback Modal */}
      <AnimatePresence>
        {showHistoryModal && selectedAgentForHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-black/10 text-camry-blackout relative max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-camry-blackout text-white rounded-xl">
                    <History size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bricolage">{selectedAgentForHistory.name} — Version History</h3>
                    <p className="font-familjen text-xs text-camry-graphite/60">
                      View prompt iterations and restore previous agent configurations on-device
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHistoryModal(false)} 
                  className="p-1 rounded-lg hover:bg-black/5 text-camry-graphite/60 hover:text-black transition-colors"
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
                          ? 'bg-emerald-50/60 border-emerald-200 shadow-sm' 
                          : 'bg-camry-graphite/5 border-black/5 hover:border-black/15'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded font-martian text-xs font-bold ${
                            isCurrent ? 'bg-emerald-600 text-white' : 'bg-camry-blackout text-white'
                          }`}>
                            {ver.version}
                          </span>
                          {isCurrent && (
                            <span className="font-martian text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                              ACTIVE VERSION
                            </span>
                          )}
                          <span className="font-familjen text-xs text-camry-graphite/60">
                            • Released {ver.updatedAt} by {ver.author}
                          </span>
                        </div>

                        {!isCurrent && (
                          <button
                            onClick={() => {
                              rollbackAgentVersion(selectedAgentForHistory.id, ver.version);
                              setShowHistoryModal(false);
                            }}
                            className="px-3 py-1 rounded bg-camry-blackout text-white text-xs font-martian hover:bg-camry-graphite transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            <RotateCcw size={12} />
                            <span>Rollback</span>
                          </button>
                        )}
                      </div>

                      <div className="text-xs font-familjen text-camry-blackout font-medium mb-2">
                        <span className="font-martian text-[10px] text-camry-graphite/60 uppercase tracking-wider block">Changelog:</span>
                        {ver.changes}
                      </div>

                      <div className="bg-white/80 p-3 rounded-lg border border-black/5 font-mono text-[11px] text-camry-graphite leading-relaxed">
                        <span className="font-martian text-[10px] text-camry-graphite/50 uppercase tracking-wider block mb-1">System Prompt:</span>
                        "{ver.prompt}"
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 mt-4 border-t border-black/10 flex justify-end">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-camry-blackout text-white hover:bg-camry-graphite"
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

