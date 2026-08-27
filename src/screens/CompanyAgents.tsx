import React, { useState, useRef } from 'react';
import { useAppContext, Agent, AgentAttachedDoc } from '../store/AppContext';
import { CustomSelect } from '../components/CustomSelect';
import { MemberInteractionLog } from '../components/MemberInteractionLog';
import { 
  Search, 
  FileText, 
  Copy, 
  X, 
  MessageSquare, 
  Bot, 
  Plus, 
  Check, 
  History, 
  Scale, 
  Activity, 
  Landmark, 
  Shield, 
  Layers, 
  Upload, 
  FolderPlus, 
  FileSpreadsheet, 
  FileImage, 
  FileCode, 
  CheckSquare, 
  Square, 
  Database, 
  File
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CompanyAgents: React.FC = () => {
  const { 
    themeMode,
    setCurrentScreen, 
    setPendingChatPrompt, 
    showToast,
    allAgents,
    setActiveAgent,
    addCustomAgent,
    kbDocuments,
    addKBDocument,
    categories: appCategories
  } = useAppContext();

  const isLight = themeMode === 'light';

  // Company Agents state
  const [agentSearch, setAgentSearch] = useState<string>('');
  const [agentCategoryFilter, setAgentCategoryFilter] = useState<string>('All');
  const [selectedAgentForDetails, setSelectedAgentForDetails] = useState<Agent | null>(null);
  const [isCreateAgentModalOpen, setIsCreateAgentModalOpen] = useState<boolean>(false);

  // New Agent Form State
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentCategory, setNewAgentCategory] = useState('Legal');
  const [newAgentTagline, setNewAgentTagline] = useState('');
  const [newAgentPrompt, setNewAgentPrompt] = useState('');
  const [newAgentVersion, setNewAgentVersion] = useState('v1.0.0');

  // Agent Document Knowledge Base & Upload State
  const [attachedDocs, setAttachedDocs] = useState<AgentAttachedDoc[]>([]);
  const [isKbPickerOpen, setIsKbPickerOpen] = useState<boolean>(false);
  const [kbSearchQuery, setKbSearchQuery] = useState<string>('');
  const [kbCategoryFilter, setKbCategoryFilter] = useState<string>('All');
  const [selectedKbDocIds, setSelectedKbDocIds] = useState<string[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', ...appCategories.map(c => c.name)];
  const agentCategories = ['All', ...Array.from(new Set([...appCategories.map(c => c.name), 'Legal', 'Medical', 'Government', 'Industrial', 'Finance', 'Custom']))];

  // Filtering Company Agents
  const filteredAgents = allAgents.filter(agent => {
    if (agentCategoryFilter !== 'All' && agent.category !== agentCategoryFilter) return false;
    if (agentSearch.trim()) {
      const q = agentSearch.toLowerCase();
      return agent.name.toLowerCase().includes(q) || 
        agent.description.toLowerCase().includes(q) || 
        (agent.systemPrompt && agent.systemPrompt.toLowerCase().includes(q));
    }
    return true;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'success');
  };

  const handleLaunchAgentChat = (agent: Agent) => {
    setActiveAgent(agent.id);
    setPendingChatPrompt(`Hello ${agent.name}, please assist me with our company workflow.`);
    setCurrentScreen('chat');
    showToast(`Active Agent set to ${agent.name}`, 'info');
  };

  const getDocTypeIcon = (type?: string, size = 16) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return <FileText size={size} className="text-red-500 shrink-0" />;
      case 'DOCX':
      case 'DOC':
        return <FileText size={size} className="text-indigo-500 shrink-0" />;
      case 'XLSX':
      case 'XLS':
      case 'CSV':
        return <FileSpreadsheet size={size} className="text-emerald-600 shrink-0" />;
      case 'IMG':
      case 'PNG':
      case 'JPG':
      case 'JPEG':
        return <FileImage size={size} className="text-amber-500 shrink-0" />;
      case 'CODE':
      case 'TS':
      case 'JS':
      case 'PY':
      case 'JSON':
        return <FileCode size={size} className="text-sky-500 shrink-0" />;
      default:
        return <File size={size} className="text-zinc-400 shrink-0" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newDocs: AgentAttachedDoc[] = [];
    const timestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    Array.from(files).forEach((file, index) => {
      const extension = file.name.split('.').pop()?.toUpperCase() || 'TXT';
      const docId = `upload-${Date.now()}-${index}`;
      
      const newAttachedDoc: AgentAttachedDoc = {
        id: docId,
        name: file.name,
        type: extension,
        size: formatFileSize(file.size),
        source: 'upload',
        date: timestamp,
      };
      newDocs.push(newAttachedDoc);

      // Auto-index into Knowledge Base store
      addKBDocument({
        name: file.name,
        type: extension as any,
        size: formatFileSize(file.size),
        category: newAgentCategory || 'General',
        tags: ['Agent Attached', 'Local Upload', newAgentCategory],
        extractedSnippet: `Locally indexed reference document: ${file.name} (${formatFileSize(file.size)}). Parsed into on-device NPU vector store for grounding.`,
        isRestricted: false
      });
    });

    setAttachedDocs(prev => [...prev, ...newDocs]);
    showToast(`Attached ${newDocs.length} document${newDocs.length > 1 ? 's' : ''} to agent`, 'success');
  };

  const handleOpenKbPicker = () => {
    const existingKbIds = attachedDocs
      .filter(d => d.source === 'knowledgeBase')
      .map(d => d.id.replace('kb-link-', ''));
    setSelectedKbDocIds(existingKbIds);
    setKbSearchQuery('');
    setKbCategoryFilter('All');
    setIsKbPickerOpen(true);
  };

  const handleToggleKbDoc = (docId: string) => {
    setSelectedKbDocIds(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleSelectAllFilteredKbDocs = (filteredList: typeof kbDocuments) => {
    const ids = filteredList.map(d => d.id);
    setSelectedKbDocIds(prev => Array.from(new Set([...prev, ...ids])));
  };

  const handleClearSelectedKbDocs = () => {
    setSelectedKbDocIds([]);
  };

  const handleApplyKbSelection = () => {
    const uploadedDocs = attachedDocs.filter(d => d.source === 'upload');
    const selectedDocsData = kbDocuments.filter(doc => selectedKbDocIds.includes(doc.id));
    
    const kbAttachedDocs: AgentAttachedDoc[] = selectedDocsData.map(doc => ({
      id: `kb-link-${doc.id}`,
      name: doc.name,
      type: doc.type,
      size: doc.size,
      source: 'knowledgeBase' as const,
      category: doc.category,
      date: doc.date
    }));

    setAttachedDocs([...uploadedDocs, ...kbAttachedDocs]);
    setIsKbPickerOpen(false);
    showToast(`Linked ${kbAttachedDocs.length} Knowledge Base document${kbAttachedDocs.length !== 1 ? 's' : ''}`, 'success');
  };

  const handleRemoveAttachedDoc = (docId: string) => {
    setAttachedDocs(prev => prev.filter(d => d.id !== docId));
  };

  const handleCreateAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) {
      showToast('Agent name is required', 'error');
      return;
    }

    const systemPromptText = newAgentPrompt.trim() || `You are ${newAgentName.trim()}, an enterprise AI agent deployed on Camry NPU. Provide authoritative, concise, and structured guidance in ${newAgentCategory}.`;

    const createdAgent: Agent = {
      id: `agent-custom-${Date.now()}`,
      name: newAgentName.trim(),
      category: newAgentCategory,
      description: newAgentTagline.trim() || `Enterprise AI specialist for ${newAgentCategory} operations.`,
      status: 'active',
      likes: 0,
      currentVersion: newAgentVersion.trim() || 'v1.0.0',
      systemPrompt: systemPromptText,
      attachedDocuments: [...attachedDocs],
      versionHistory: [
        {
          version: newAgentVersion.trim() || 'v1.0.0',
          updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          author: 'You (Admin)',
          prompt: systemPromptText,
          changes: `Initial agent creation with ${attachedDocs.length} grounded knowledge document${attachedDocs.length !== 1 ? 's' : ''}.`
        }
      ]
    };

    addCustomAgent(createdAgent);
    showToast(`Company Agent "${createdAgent.name}" deployed successfully!`, 'success');
    
    // Reset Form
    setNewAgentName('');
    setNewAgentTagline('');
    setNewAgentPrompt('');
    setNewAgentVersion('v1.0.0');
    setAttachedDocs([]);
    setIsCreateAgentModalOpen(false);
  };

  const renderCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'legal':
        return <Scale size={18} className="text-indigo-400 shrink-0" />;
      case 'medical':
        return <Activity size={18} className="text-emerald-400 shrink-0" />;
      case 'government':
        return <Landmark size={18} className="text-amber-400 shrink-0" />;
      case 'industrial':
        return <Shield size={18} className="text-cyan-400 shrink-0" />;
      case 'finance':
        return <FileSpreadsheet size={18} className="text-teal-400 shrink-0" />;
      default:
        return <Layers size={18} className="text-sky-400 shrink-0" />;
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto camry-page-container camry-section-gap transition-colors font-sans ${
      isLight ? 'bg-camry-paper text-camry-blackout' : 'bg-[#141418] text-white'
    }`}>
      
      <div className="space-y-6">
        {/* Page Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
          isLight ? 'border-black/10' : 'border-white/10'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border ${
                isLight ? 'bg-blue-50/70 border-blue-200 text-[#0EA5E9]' : 'bg-blue-950/40 border-blue-800/40 text-blue-400'
              }`}>
                <Bot size={22} />
              </div>
              <h1 className={`camry-h1-title ${
                isLight ? 'text-camry-blackout' : 'text-white'
              }`}>
                Company AI Agents
              </h1>
            </div>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Deploy, ground, and manage enterprise on-premise AI agents with corporate knowledge and local NPU RAG.
            </p>
          </div>

          {/* Clean, fixed Create Company Agent button */}
          <button
            onClick={() => setIsCreateAgentModalOpen(true)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[6px] text-sm font-medium transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shrink-0 shadow-xs camry-touch-target ${
              isLight 
                ? 'bg-camry-blackout hover:bg-black text-white' 
                : 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white'
            }`}
          >
            <Plus size={16} className={isLight ? 'text-sky-400' : 'text-white'} />
            <span>Create Company Agent</span>
          </button>
        </div>

        {/* FILTER & SEARCH BAR */}
        <div className={`border rounded-[10px] p-4 sm:p-6 shadow-xs space-y-4 ${
          isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'
        }`}>
          <div className="relative">
            <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-zinc-400' : 'text-zinc-500'
            }`} />
            <input 
              type="text"
              value={agentSearch}
              onChange={(e) => setAgentSearch(e.target.value)}
              placeholder="Search company agents by name, category, or system instructions..."
              className={`w-full pl-10 pr-4 py-2.5 border rounded-[10px] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] ${
                isLight 
                  ? 'bg-zinc-50 border-black/10 text-camry-blackout placeholder:text-zinc-400' 
                  : 'bg-[#141418] border-white/15 text-white placeholder:text-zinc-500'
              }`}
            />
          </div>

          {/* Category Filter Pills */}
          <div className={`flex items-center gap-3 overflow-x-auto pt-3 border-t scrollbar-none ${
            isLight ? 'border-black/5' : 'border-white/10'
          }`}>
            <span className={`text-xs font-semibold uppercase tracking-wider pr-1 flex-shrink-0 ${
              isLight ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              Department Scope:
            </span>
            {agentCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setAgentCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all flex-shrink-0 cursor-pointer whitespace-nowrap camry-touch-target ${
                  agentCategoryFilter === cat 
                    ? (isLight ? 'bg-camry-blackout text-white font-semibold shadow-2xs' : 'bg-[#0EA5E9] text-white font-semibold shadow-2xs')
                    : (isLight ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200' : 'bg-white/10 text-zinc-300 hover:bg-white/15')
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* AGENTS GRID */}
        {filteredAgents.length === 0 ? (
          <div className={`border rounded-[10px] camry-empty-padding text-center space-y-3 ${
            isLight ? 'bg-white border-black/10 text-zinc-500' : 'bg-[#1C1C22] border-white/10 text-zinc-400'
          }`}>
            <Bot size={40} className={`mx-auto ${isLight ? 'text-zinc-300' : 'text-zinc-600'}`} />
            <h3 className={`text-base font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
              No company agents match search
            </h3>
            <p className="text-xs max-w-sm mx-auto leading-relaxed">
              Try resetting category filters or build a new agent tailored for your workspace.
            </p>
          </div>
        ) : (
          <div className="camry-card-grid">
            {filteredAgents.map(agent => {
              return (
                <motion.div 
                  key={agent.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-[10px] camry-card-padding shadow-xs transition-all flex flex-col justify-between group ${
                    isLight 
                      ? 'bg-white border-black/10 hover:border-black/30 hover:shadow-md' 
                      : 'bg-[#1C1C22] border-white/10 hover:border-white/30 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Top Bar: Icon, Name & Category */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl border shrink-0 ${
                          isLight ? 'bg-zinc-100 border-black/5' : 'bg-white/5 border-white/10'
                        }`}>
                          {renderCategoryIcon(agent.category)}
                        </div>
                        <div>
                          <h3 className={`font-bold text-base transition-colors ${
                            isLight ? 'text-camry-blackout group-hover:text-[#0EA5E9]' : 'text-white group-hover:text-blue-400'
                          }`}>
                            {agent.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                              isLight ? 'text-zinc-700 bg-black/5' : 'text-zinc-300 bg-white/10'
                            }`}>
                              {agent.category || 'Custom'}
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                              isLight ? 'text-[#0EA5E9] bg-blue-50' : 'text-blue-400 bg-blue-950/40'
                            }`}>
                              {agent.currentVersion || 'v1.0.0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${
                      isLight ? 'text-zinc-600' : 'text-zinc-300'
                    }`}>
                      {agent.description}
                    </p>

                    {/* System Prompt snippet */}
                    {agent.systemPrompt && (
                      <div className={`p-3 border rounded-xl font-mono text-xs line-clamp-2 relative ${
                        isLight ? 'bg-zinc-50 border-black/5 text-zinc-700' : 'bg-[#141418] border-white/10 text-zinc-300'
                      }`}>
                        <span className={`text-[10px] font-semibold block mb-0.5 uppercase tracking-wider ${
                          isLight ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>
                          SYSTEM INSTRUCTIONS:
                        </span>
                        "{agent.systemPrompt}"
                      </div>
                    )}

                    {/* Attached Knowledge Documents Badge */}
                    {agent.attachedDocuments && agent.attachedDocuments.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${
                          isLight 
                            ? 'bg-blue-50 border-blue-200/70 text-[#0EA5E9]' 
                            : 'bg-blue-950/30 border-blue-800/40 text-blue-300'
                        }`}>
                          <Database size={13} className="shrink-0" />
                          <span>{agent.attachedDocuments.length} Knowledge Doc{agent.attachedDocuments.length > 1 ? 's' : ''} Linked</span>
                        </span>
                      </div>
                    )}
                    {/* Member Interactions Log */}
                    <MemberInteractionLog agentId={agent.id} agentName={agent.name} />
                  </div>

                  {/* Action Bar */}
                  <div className={`pt-4 mt-4 border-t flex items-center justify-between gap-2 ${
                    isLight ? 'border-black/10' : 'border-white/10'
                  }`}>
                    <button
                      onClick={() => setSelectedAgentForDetails(agent)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isLight ? 'hover:bg-black/5 text-zinc-600 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                      }`}
                      title="View Versions, System Prompt & Attached Docs"
                    >
                      <History size={14} />
                      <span>Versions</span>
                    </button>

                    <button
                      onClick={() => handleLaunchAgentChat(agent)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all hover:scale-105 cursor-pointer ${
                        isLight ? 'bg-camry-blackout hover:bg-black text-white' : 'bg-[#0EA5E9] hover:bg-sky-500 text-white'
                      }`}
                    >
                      <MessageSquare size={13} className={isLight ? 'text-sky-400' : 'text-white'} />
                      <span>Launch Chat</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: CREATE NEW COMPANY AGENT */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isCreateAgentModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`border rounded-2xl max-w-2xl sm:max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] flex flex-col my-auto ${
                isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#1C1C22] border-white/15 text-white'
              }`}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between pb-3.5 border-b shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isLight ? 'bg-blue-50 text-[#0EA5E9]' : 'bg-blue-950/40 text-blue-400'}`}>
                    <Bot size={22} />
                  </div>
                  <div>
                    <h2 className={`text-lg sm:text-xl font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
                      Create Company AI Agent
                    </h2>
                    <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      Deploy a customized agent on local Camry NPU for team workflows
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsCreateAgentModalOpen(false)} 
                  className={`p-1.5 cursor-pointer rounded-lg transition-colors ${
                    isLight ? 'text-zinc-500 hover:bg-black/5 hover:text-black' : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Agent Form */}
              <form onSubmit={handleCreateAgentSubmit} className="space-y-4 text-xs sm:text-sm flex-1 overflow-y-auto pr-1">
                <div>
                  <label className={`block font-semibold text-xs uppercase tracking-wider mb-1.5 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    Agent Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    placeholder="e.g. Audit Compliance Officer"
                    className={`w-full px-3.5 py-2.5 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] ${
                      isLight ? 'bg-zinc-50 border-black/10 text-camry-blackout' : 'bg-[#141418] border-white/15 text-white'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block font-semibold text-xs uppercase tracking-wider mb-1.5 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                      Department Scope
                    </label>
                    <CustomSelect
                      fullWidth
                      value={newAgentCategory}
                      onChange={(val) => setNewAgentCategory(val)}
                      options={agentCategories.filter(c => c !== 'All').map(cat => ({ value: cat, label: cat }))}
                      buttonClassName={isLight ? 'bg-zinc-50 border-black/10 rounded-xl py-2.5' : 'bg-[#141418] border-white/15 rounded-xl py-2.5 text-white'}
                    />
                  </div>

                  <div>
                    <label className={`block font-semibold text-xs uppercase tracking-wider mb-1.5 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                      Initial Version
                    </label>
                    <input 
                      type="text" 
                      value={newAgentVersion}
                      onChange={(e) => setNewAgentVersion(e.target.value)}
                      placeholder="v1.0.0"
                      className={`w-full px-3.5 py-2.5 border rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] ${
                        isLight ? 'bg-zinc-50 border-black/10 text-camry-blackout' : 'bg-[#141418] border-white/15 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block font-semibold text-xs uppercase tracking-wider mb-1.5 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    Short Description / Purpose
                  </label>
                  <input 
                    type="text" 
                    value={newAgentTagline}
                    onChange={(e) => setNewAgentTagline(e.target.value)}
                    placeholder="e.g. Scans contract clauses against corporate risk policies."
                    className={`w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] ${
                      isLight ? 'bg-zinc-50 border-black/10 text-camry-blackout' : 'bg-[#141418] border-white/15 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-semibold text-xs uppercase tracking-wider mb-1.5 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    System Instructions / Prompt
                  </label>
                  <textarea 
                    rows={3}
                    value={newAgentPrompt}
                    onChange={(e) => setNewAgentPrompt(e.target.value)}
                    placeholder="You are an enterprise AI compliance specialist. Analyze contracts, flag high-risk indemnities, and respond with structured markdown analysis..."
                    className={`w-full p-3.5 border rounded-xl font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] ${
                      isLight ? 'bg-zinc-50 border-black/10 text-camry-blackout' : 'bg-[#141418] border-white/15 text-white'
                    }`}
                  />
                </div>

                {/* KNOWLEDGE BASE & REFERENCE DOCUMENTS GROUNDING SECTION */}
                <div className={`p-4 sm:p-5 border rounded-2xl space-y-3.5 ${
                  isLight ? 'bg-zinc-50/70 border-black/10' : 'bg-[#141418] border-white/10'
                }`}>
                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => handleFileUpload(e.target.files)} 
                    multiple 
                    accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.pptx,.png,.jpg,.jpeg,.json,.md"
                    className="hidden" 
                  />

                  {/* Header: Title, Description & Action Buttons */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${isLight ? 'bg-sky-100/70 text-[#0EA5E9]' : 'bg-sky-950/60 text-sky-400'}`}>
                          <Database size={17} className="shrink-0" />
                        </div>
                        <h4 className={`text-sm sm:text-base font-bold tracking-tight whitespace-nowrap ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
                          Knowledge Base & Reference Documents
                        </h4>
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                        Ground this agent with corporate knowledge or upload local documents for on-device NPU RAG.
                      </p>
                    </div>

                    {/* Action Buttons: Upload Document & Add from KB */}
                    <div className="flex items-center gap-2.5 flex-wrap pt-0.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all hover:scale-[1.01] cursor-pointer whitespace-nowrap ${
                          isLight 
                            ? 'bg-white border-black/15 text-camry-blackout hover:bg-zinc-100 shadow-2xs' 
                            : 'bg-white/10 border-white/15 text-white hover:bg-white/15 shadow-2xs'
                        }`}
                      >
                        <Upload size={14} className="text-[#0EA5E9] shrink-0" />
                        <span className="whitespace-nowrap">Upload Document</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenKbPicker}
                        className="px-3.5 py-2 rounded-xl bg-[#0EA5E9] hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-all hover:scale-[1.01] shadow-2xs cursor-pointer whitespace-nowrap"
                      >
                        <FolderPlus size={14} className="text-white shrink-0" />
                        <span className="whitespace-nowrap">Add from Knowledge Base</span>
                        {attachedDocs.filter(d => d.source === 'knowledgeBase').length > 0 && (
                          <span className="ml-1 px-1.5 py-0.5 bg-white/25 rounded-full text-[10px] font-bold">
                            {attachedDocs.filter(d => d.source === 'knowledgeBase').length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Dropzone & Attached Documents List */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(false);
                      handleFileUpload(e.dataTransfer.files);
                    }}
                    className={`border-2 border-dashed rounded-xl p-4 transition-all ${
                      isDraggingFile 
                        ? 'border-[#0EA5E9] bg-blue-500/10' 
                        : (isLight ? 'border-black/15 bg-white' : 'border-white/15 bg-[#18181D]')
                    }`}
                  >
                    {attachedDocs.length === 0 ? (
                      <div className="text-center py-5 px-3 space-y-2">
                        <Upload size={24} className={`mx-auto ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`} />
                        <div className={`text-xs font-semibold ${isLight ? 'text-camry-blackout' : 'text-zinc-200'}`}>
                          No documents attached yet
                        </div>
                        <p className={`text-xs leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                          Drag & drop files here, or click <strong className="text-[#0EA5E9] cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>Upload Document</strong> or <strong className="text-[#0EA5E9] cursor-pointer hover:underline" onClick={handleOpenKbPicker}>Add from Knowledge Base</strong>
                        </p>
                        <span className={`text-[11px] block ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          Supports PDF, DOCX, XLSX, CSV, PPTX, TXT, MD, PNG, JPG (Auto-indexed into local NPU memory)
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs pb-1.5 border-b border-black/5 dark:border-white/5">
                          <span className={`font-semibold ${isLight ? 'text-camry-blackout' : 'text-zinc-200'}`}>
                            Attached Reference Documents ({attachedDocs.length})
                          </span>
                          <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>
                            {attachedDocs.filter(d => d.source === 'knowledgeBase').length} KB • {attachedDocs.filter(d => d.source === 'upload').length} Uploaded
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                          {attachedDocs.map((doc) => (
                            <div 
                              key={doc.id}
                              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 text-xs transition-colors ${
                                isLight ? 'bg-zinc-50 border-black/10' : 'bg-[#141418] border-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {getDocTypeIcon(doc.type, 16)}
                                <div className="min-w-0">
                                  <div className={`font-semibold truncate text-xs ${isLight ? 'text-camry-blackout' : 'text-white'}`} title={doc.name}>
                                    {doc.name}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                      doc.source === 'knowledgeBase'
                                        ? (isLight ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-blue-950/40 text-blue-300 border border-blue-800/40')
                                        : (isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40')
                                    }`}>
                                      {doc.source === 'knowledgeBase' ? 'Knowledge Base' : 'Direct Upload'}
                                    </span>
                                    <span className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                      {doc.size}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveAttachedDoc(doc.id)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                                  isLight ? 'hover:bg-red-50 text-zinc-400 hover:text-red-600' : 'hover:bg-red-950/30 text-zinc-400 hover:text-red-400'
                                }`}
                                title="Remove document"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className={`italic ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            Drop more files here to append
                          </span>
                          <button 
                            type="button"
                            onClick={() => setAttachedDocs([])}
                            className="text-red-500 hover:underline cursor-pointer font-medium"
                          >
                            Clear all attached
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className={`pt-3.5 border-t flex items-center justify-end gap-2.5 shrink-0 ${
                  isLight ? 'border-black/10' : 'border-white/10'
                }`}>
                  <button 
                    type="button" 
                    onClick={() => setIsCreateAgentModalOpen(false)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                      isLight ? 'border-black/10 hover:bg-black/5 text-camry-blackout' : 'border-white/10 hover:bg-white/10 text-white'
                    }`}
                  >
                    Cancel
                  </button>

                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Check size={14} className="text-white" />
                    <span>Deploy Agent {attachedDocs.length > 0 ? `(${attachedDocs.length} Docs)` : ''}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: KNOWLEDGE BASE DOCUMENT SELECTOR PICKER */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isKbPickerOpen && (
          <div className="fixed inset-0 bg-black/75 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`border rounded-2xl max-w-2xl sm:max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[85vh] flex flex-col ${
                isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#1C1C22] border-white/15 text-white'
              }`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between pb-3.5 border-b shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isLight ? 'bg-blue-50 text-[#0EA5E9]' : 'bg-blue-950/50 text-blue-400'}`}>
                    <Database size={20} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-base sm:text-lg ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
                      Select Documents from Knowledge Base
                    </h3>
                    <p className={`text-xs sm:text-sm ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      Choose indexed enterprise files to connect to your new agent
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsKbPickerOpen(false)} 
                  className={`p-1.5 rounded-lg cursor-pointer ${
                    isLight ? 'text-zinc-500 hover:bg-black/5 hover:text-black' : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search & Category Filter */}
              <div className="space-y-2.5 shrink-0">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isLight ? 'text-zinc-400' : 'text-zinc-500'
                    }`} />
                    <input 
                      type="text" 
                      value={kbSearchQuery}
                      onChange={(e) => setKbSearchQuery(e.target.value)}
                      placeholder="Search Knowledge Base by name or snippet..."
                      className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] ${
                        isLight ? 'bg-zinc-50 border-black/10 text-camry-blackout' : 'bg-[#141418] border-white/15 text-white'
                      }`}
                    />
                  </div>

                  <div className="w-full sm:w-52">
                    <CustomSelect
                      fullWidth
                      value={kbCategoryFilter}
                      onChange={(val) => setKbCategoryFilter(val)}
                      options={['All', ...categories.filter(c => c !== 'All')].map(c => ({ value: c, label: c }))}
                      buttonClassName={isLight ? 'bg-zinc-50 border-black/10 rounded-xl py-2' : 'bg-[#141418] border-white/15 rounded-xl py-2 text-white'}
                    />
                  </div>
                </div>

                {/* Quick Select Buttons & Count */}
                {(() => {
                  const filteredKbDocs = kbDocuments.filter(doc => {
                    if (kbCategoryFilter !== 'All' && doc.category !== kbCategoryFilter) return false;
                    if (kbSearchQuery.trim()) {
                      const q = kbSearchQuery.toLowerCase();
                      return doc.name.toLowerCase().includes(q) || (doc.extractedSnippet && doc.extractedSnippet.toLowerCase().includes(q));
                    }
                    return true;
                  });

                  return (
                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-xs ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                        Showing <strong>{filteredKbDocs.length}</strong> indexed document{filteredKbDocs.length !== 1 ? 's' : ''} • <strong>{selectedKbDocIds.length}</strong> selected
                      </span>

                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleSelectAllFilteredKbDocs(filteredKbDocs)}
                          className="text-[#0EA5E9] hover:underline cursor-pointer font-semibold"
                        >
                          Select All
                        </button>
                        <span className={isLight ? 'text-black/20' : 'text-white/20'}>|</span>
                        <button
                          type="button"
                          onClick={handleClearSelectedKbDocs}
                          className={`cursor-pointer ${isLight ? 'text-zinc-600 hover:text-black' : 'text-zinc-400 hover:text-white'}`}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Document Checkbox List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
                {(() => {
                  const filteredKbDocs = kbDocuments.filter(doc => {
                    if (kbCategoryFilter !== 'All' && doc.category !== kbCategoryFilter) return false;
                    if (kbSearchQuery.trim()) {
                      const q = kbSearchQuery.toLowerCase();
                      return doc.name.toLowerCase().includes(q) || (doc.extractedSnippet && doc.extractedSnippet.toLowerCase().includes(q));
                    }
                    return true;
                  });

                  if (filteredKbDocs.length === 0) {
                    return (
                      <div className={`p-8 border rounded-xl text-center space-y-2 ${
                        isLight ? 'bg-zinc-50 border-black/10 text-zinc-500' : 'bg-[#141418] border-white/10 text-zinc-400'
                      }`}>
                        <Database size={28} className={`mx-auto ${isLight ? 'text-zinc-300' : 'text-zinc-600'}`} />
                        <div className={`text-xs font-semibold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
                          No matching knowledge base documents
                        </div>
                        <p className="text-[11px]">Try adjusting your search query or department scope filter.</p>
                      </div>
                    );
                  }

                  return filteredKbDocs.map(doc => {
                    const isSelected = selectedKbDocIds.includes(doc.id);

                    return (
                      <div
                        key={doc.id}
                        onClick={() => handleToggleKbDoc(doc.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? (isLight ? 'bg-blue-50/70 border-[#0EA5E9] shadow-2xs' : 'bg-blue-950/40 border-[#0EA5E9] shadow-2xs')
                            : (isLight ? 'bg-zinc-50/60 border-black/5 hover:bg-zinc-100/80' : 'bg-[#141418] border-white/5 hover:bg-white/5')
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="shrink-0 text-[#0EA5E9]">
                            {isSelected ? <CheckSquare size={18} /> : <Square size={18} className={isLight ? 'text-zinc-400' : 'text-zinc-600'} />}
                          </div>

                          <div className="shrink-0">
                            {getDocTypeIcon(doc.type, 20)}
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <div className={`font-semibold text-xs sm:text-sm truncate ${
                              isSelected 
                                ? (isLight ? 'text-camry-blackout font-bold' : 'text-white font-bold') 
                                : (isLight ? 'text-camry-blackout' : 'text-zinc-200')
                            }`}>
                              {doc.name}
                            </div>
                            <div className="flex items-center gap-2 text-xs flex-wrap">
                              <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                                isLight ? 'bg-black/5 text-zinc-700' : 'bg-white/10 text-zinc-300'
                              }`}>
                                {doc.category}
                              </span>
                              <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>
                                {doc.size}
                              </span>
                              <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>
                                • {doc.date}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status tag */}
                        <div className="shrink-0">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <Check size={10} />
                            INDEXED
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Modal Footer */}
              <div className={`pt-3.5 border-t flex items-center justify-between gap-2 shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <span className={`text-xs ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  <strong>{selectedKbDocIds.length}</strong> document{selectedKbDocIds.length !== 1 ? 's' : ''} selected
                </span>

                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsKbPickerOpen(false)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                      isLight ? 'border-black/10 hover:bg-black/5 text-camry-blackout' : 'border-white/10 hover:bg-white/10 text-white'
                    }`}
                  >
                    Cancel
                  </button>

                  <button 
                    type="button"
                    onClick={handleApplyKbSelection}
                    className="px-5 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Check size={14} className="text-white" />
                    <span>Attach Selected Documents ({selectedKbDocIds.length})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: AGENT SYSTEM PROMPT & VERSION HISTORY */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedAgentForDetails && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`border rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[85vh] flex flex-col ${
                isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#1C1C22] border-white/15 text-white'
              }`}
            >
              {/* Header */}
              <div className={`flex items-start justify-between pb-3.5 border-b shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                      isLight ? 'bg-camry-blackout text-white' : 'bg-[#0EA5E9] text-white'
                    }`}>
                      {selectedAgentForDetails.category || 'Custom'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                      isLight ? 'bg-blue-50 text-[#0EA5E9]' : 'bg-blue-950/40 text-blue-300'
                    }`}>
                      {selectedAgentForDetails.currentVersion || 'v1.0.0'}
                    </span>
                  </div>
                  <h2 className={`text-xl font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
                    {selectedAgentForDetails.name}
                  </h2>
                </div>

                <button 
                  onClick={() => setSelectedAgentForDetails(null)} 
                  className={`p-1.5 cursor-pointer rounded-lg ${
                    isLight ? 'text-zinc-500 hover:text-black hover:bg-black/5' : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* System Prompt View */}
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wider ${
                  isLight ? 'text-zinc-700' : 'text-zinc-300'
                }`}>
                  Active System Instructions
                </label>
                <div className="p-3.5 bg-zinc-900 text-emerald-400 font-mono text-xs rounded-xl border border-black/20 overflow-y-auto max-h-36 leading-relaxed whitespace-pre-wrap">
                  {selectedAgentForDetails.systemPrompt || 'No explicit system prompt specified.'}
                </div>
              </div>

              {/* Attached Documents section */}
              {selectedAgentForDetails.attachedDocuments && selectedAgentForDetails.attachedDocuments.length > 0 && (
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                    isLight ? 'text-zinc-700' : 'text-zinc-300'
                  }`}>
                    <Database size={13} className="text-[#0EA5E9]" />
                    <span>Attached Knowledge Documents ({selectedAgentForDetails.attachedDocuments.length})</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-36 overflow-y-auto">
                    {selectedAgentForDetails.attachedDocuments.map(doc => (
                      <div key={doc.id} className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs ${
                        isLight ? 'bg-zinc-50 border-black/10' : 'bg-[#141418] border-white/10'
                      }`}>
                        {getDocTypeIcon(doc.type, 16)}
                        <div className="min-w-0">
                          <div className={`font-semibold truncate text-xs ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
                            {doc.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              doc.source === 'knowledgeBase'
                                ? (isLight ? 'bg-blue-50 text-blue-700' : 'bg-blue-950/40 text-blue-300')
                                : (isLight ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-950/40 text-emerald-300')
                            }`}>
                              {doc.source === 'knowledgeBase' ? 'Knowledge Base' : 'Uploaded'}
                            </span>
                            <span className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                              {doc.size}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Version History Log */}
              <div className="space-y-2 flex-1 overflow-y-auto pt-1">
                <label className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? 'text-zinc-700' : 'text-zinc-300'
                }`}>
                  <History size={14} className="text-[#0EA5E9]" />
                  <span>Version Audit Log</span>
                </label>

                {selectedAgentForDetails.versionHistory && selectedAgentForDetails.versionHistory.length > 0 ? (
                  <div className="space-y-2">
                    {selectedAgentForDetails.versionHistory.map((ver, idx) => (
                      <div key={ver.version + idx} className={`p-3 border rounded-xl space-y-1 text-xs ${
                        isLight ? 'bg-zinc-50 border-black/10' : 'bg-[#141418] border-white/10'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>{ver.version}</span>
                          <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>{ver.updatedAt} • By {ver.author}</span>
                        </div>
                        <p className={`leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>{ver.changes}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-xs italic p-3 rounded-xl border ${
                    isLight ? 'bg-zinc-50 border-black/5 text-zinc-500' : 'bg-[#141418] border-white/5 text-zinc-400'
                  }`}>
                    Single version deployed ({selectedAgentForDetails.currentVersion || 'v1.0.0'}).
                  </p>
                )}
              </div>

              {/* Footer action */}
              <div className={`pt-3.5 border-t flex items-center justify-between gap-2.5 shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <button
                  onClick={() => handleCopy(selectedAgentForDetails.systemPrompt || '')}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                    isLight ? 'border-black/10 hover:bg-black/5 text-camry-blackout' : 'border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <Copy size={14} />
                  <span>Copy Prompt</span>
                </button>

                <button
                  onClick={() => {
                    handleLaunchAgentChat(selectedAgentForDetails);
                    setSelectedAgentForDetails(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <MessageSquare size={14} className="text-white" />
                  <span>Launch Agent Chat</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
