import React, { useState } from 'react';
import { useAppContext, LibraryItem, Agent } from '../store/AppContext';
import { CustomSelect } from '../components/CustomSelect';
import { Tooltip } from '../components/Tooltip';
import { AnimatedIcon } from '../components/AnimatedIcon';
import { 
  LayoutGrid, 
  List, 
  Search, 
  FileText, 
  Sparkles, 
  Calendar, 
  User, 
  Cpu, 
  Copy, 
  Download, 
  Trash2, 
  Eye, 
  X,
  Lock,
  MessageSquare,
  Bot,
  Plus,
  Check,
  History,
  Scale,
  Activity,
  Landmark,
  Shield,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Library: React.FC = () => {
  const { 
    themeMode,
    libraryItems, 
    deleteLibraryItem, 
    currentRole, 
    setCurrentScreen, 
    setPendingChatPrompt, 
    showToast,
    allAgents,
    installedAgents,
    setActiveAgent,
    addCustomAgent,
    categories: appCategories
  } = useAppContext();

  const isLight = themeMode === 'light';

  // Navigation tab: 'artifacts' | 'agents'
  const [activeTab, setActiveTab] = useState<'artifacts' | 'agents'>('artifacts');

  // Artifacts state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeType, setActiveType] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<LibraryItem | null>(null);

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

  const types = ['All', 'Analyses', 'Drafts', 'Summaries', 'Transcripts', 'Images'];
  const categories = ['All', ...appCategories.map(c => c.name)];
  const agentCategories = ['All', ...Array.from(new Set([...appCategories.map(c => c.name), 'Legal', 'Medical', 'Government', 'Industrial', 'Finance', 'Custom']))];

  // Filtering & Sorting logic for Artifacts
  let filtered = libraryItems.filter(item => {
    if (activeType !== 'All' && item.type !== activeType) return false;
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.snippet.toLowerCase().includes(q) || item.author.toLowerCase().includes(q);
    }
    return true;
  });

  if (sortBy === 'alphabetical') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === 'oldest') {
    filtered.sort((a, b) => a.id.localeCompare(b.id));
  } else {
    filtered.sort((a, b) => b.id.localeCompare(a.id));
  }

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

  const handleDownload = (item: LibraryItem) => {
    const blob = new Blob([item.content || item.snippet], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${item.title}`);
  };

  const handleAskAboutOutput = (item: LibraryItem) => {
    setPendingChatPrompt(`Regarding the library document "${item.title}": Can you explain the core conclusions and suggest follow-up actions?`);
    setCurrentScreen('chat');
  };

  const handleLaunchAgentChat = (agent: Agent) => {
    setActiveAgent(agent.id);
    setPendingChatPrompt(`Hello ${agent.name}, please assist me with our company workflow.`);
    setCurrentScreen('chat');
    showToast(`Active Agent set to ${agent.name}`, 'info');
  };

  const handleCreateAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) {
      showToast('Agent name is required', 'warning');
      return;
    }

    const createdId = `agent-${Date.now()}`;
    const initialVersionObj = {
      version: newAgentVersion || 'v1.0.0',
      updatedAt: new Date().toISOString().split('T')[0],
      prompt: newAgentPrompt || 'You are a specialized enterprise AI assistant for the company.',
      changes: 'Initial release for company workspace.',
      author: 'Amford (Admin)'
    };

    addCustomAgent({
      id: createdId,
      name: newAgentName.trim(),
      description: newAgentTagline.trim() || 'Custom company agent deployed on Camry Local NPU.',
      category: newAgentCategory,
      systemPrompt: newAgentPrompt.trim() || 'You are a specialized enterprise AI assistant for the company.',
      status: 'active',
      statusReason: 'Active processing thread',
      currentVersion: newAgentVersion || 'v1.0.0',
      versionHistory: [initialVersionObj]
    });

    setIsCreateAgentModalOpen(false);
    setNewAgentName('');
    setNewAgentTagline('');
    setNewAgentPrompt('');
    setNewAgentVersion('v1.0.0');
  };

  // Helper function to render Category icon
  const renderCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Legal': return <Scale size={16} className="text-amber-600" />;
      case 'Medical': return <Activity size={16} className="text-emerald-600" />;
      case 'Government': return <Landmark size={16} className="text-indigo-600" />;
      case 'Industrial': return <Layers size={16} className="text-purple-600" />;
      case 'Finance': return <Shield size={16} className="text-cyan-600" />;
      default: return <Bot size={16} className="text-camry-deep-carrier" />;
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 font-familjen transition-colors ${
      isLight ? 'bg-camry-paper/40 text-camry-blackout' : 'bg-[#141418] text-white'
    }`}>
      
      {/* Header with Top Tabs */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b ${
        isLight ? 'border-black/5' : 'border-white/10'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl sm:text-3xl font-bricolage font-bold tracking-tight ${
              isLight ? 'text-camry-blackout' : 'text-white'
            }`}>
              Library & Company Hub
            </h1>
          </div>
          <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-camry-graphite/70' : 'text-zinc-400'}`}>
            Access saved NPU outputs, document drafts, and enterprise AI Agents deployed for your company.
          </p>
        </div>

        {/* MAIN TAB TOGGLE: Artifacts vs Company Agents */}
        <div className={`flex items-center gap-1.5 p-1 rounded-2xl border self-start sm:self-auto ${
          isLight ? 'bg-zinc-200/60 border-black/5' : 'bg-[#1C1C22] border-white/10'
        }`}>
          <button
            onClick={() => setActiveTab('artifacts')}
            className={`px-3.5 py-1.5 rounded-xl font-martian text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'artifacts'
                ? (isLight ? 'bg-camry-blackout text-white font-bold shadow-sm' : 'bg-[#0066FF] text-white font-bold shadow-sm')
                : (isLight ? 'text-camry-graphite hover:text-black hover:bg-black/5' : 'text-zinc-400 hover:text-white hover:bg-white/10')
            }`}
          >
            <FileText size={14} />
            <span>Artifacts ({libraryItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3.5 py-1.5 rounded-xl font-martian text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'agents'
                ? (isLight ? 'bg-camry-blackout text-white font-bold shadow-sm' : 'bg-[#0066FF] text-white font-bold shadow-sm')
                : (isLight ? 'text-camry-graphite hover:text-black hover:bg-black/5' : 'text-zinc-400 hover:text-white hover:bg-white/10')
            }`}
          >
            <Bot size={14} className={isLight ? 'text-camry-carrier' : 'text-blue-300'} />
            <span>Company Agents ({allAgents.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SAVED ARTIFACTS VIEW */}
      {/* ========================================================= */}
      {activeTab === 'artifacts' && (
        <div className="space-y-6">
          {/* FILTER & SEARCH BAR FOR ARTIFACTS */}
          <div className={`border rounded-2xl p-4 shadow-sm space-y-3 ${
            isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Search box */}
              <div className="relative flex-1">
                <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isLight ? 'text-camry-graphite/40' : 'text-zinc-500'
                }`} />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search library artifacts by title, content, or author..."
                  className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs font-familjen transition-all focus:outline-none focus:ring-2 focus:ring-[#0066FF] ${
                    isLight 
                      ? 'bg-zinc-50 border-black/10 text-camry-blackout placeholder:text-camry-graphite/40' 
                      : 'bg-[#141418] border-white/15 text-white placeholder:text-zinc-500'
                  }`}
                />
              </div>

              {/* View mode & Sort selection */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <CustomSelect
                  label="SORT:"
                  size="sm"
                  value={sortBy}
                  onChange={(val) => setSortBy(val as any)}
                  options={[
                    { value: 'newest', label: 'Newest First' },
                    { value: 'oldest', label: 'Oldest First' },
                    { value: 'alphabetical', label: 'Title A-Z' },
                  ]}
                  buttonClassName={isLight ? 'bg-zinc-50 border-black/10 rounded-xl px-3 py-1.5 text-xs text-camry-blackout font-martian' : 'bg-[#141418] border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-martian'}
                />

                <div className={`flex items-center gap-1 border rounded-xl p-1 shadow-2xs ${
                  isLight ? 'bg-zinc-100 border-black/10' : 'bg-[#141418] border-white/10'
                }`}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-martian transition-all ${
                      viewMode === 'grid' 
                        ? (isLight ? 'bg-camry-blackout text-white shadow-2xs font-semibold' : 'bg-[#0066FF] text-white shadow-2xs font-semibold')
                        : (isLight ? 'text-camry-graphite hover:bg-black/5' : 'text-zinc-400 hover:bg-white/10')
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid size={15} />
                  </button>

                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-martian transition-all ${
                      viewMode === 'list' 
                        ? (isLight ? 'bg-camry-blackout text-white shadow-2xs font-semibold' : 'bg-[#0066FF] text-white shadow-2xs font-semibold')
                        : (isLight ? 'text-camry-graphite hover:bg-black/5' : 'text-zinc-400 hover:bg-white/10')
                    }`}
                    title="List view"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Type & Category pills */}
            <div className={`space-y-2 pt-1 border-t ${isLight ? 'border-black/5' : 'border-white/10'}`}>
              {/* Type filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className={`font-martian text-[10px] uppercase tracking-wider pr-1 flex-shrink-0 ${
                  isLight ? 'text-camry-graphite/60' : 'text-zinc-400'
                }`}>Type:</span>
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-martian transition-all flex-shrink-0 cursor-pointer ${
                      activeType === t 
                        ? (isLight ? 'bg-camry-carrier text-camry-blackout font-bold shadow-2xs' : 'bg-[#0066FF] text-white font-bold shadow-2xs')
                        : (isLight ? 'bg-zinc-100 text-camry-graphite hover:bg-zinc-200' : 'bg-white/10 text-zinc-300 hover:bg-white/15')
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Category filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className={`font-martian text-[10px] uppercase tracking-wider pr-1 flex-shrink-0 ${
                  isLight ? 'text-camry-graphite/60' : 'text-zinc-400'
                }`}>Category:</span>
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-martian transition-all flex-shrink-0 cursor-pointer ${
                      activeCategory === c 
                        ? (isLight ? 'bg-camry-blackout text-white font-semibold' : 'bg-[#0066FF] text-white font-semibold')
                        : (isLight ? 'bg-black/5 text-camry-graphite hover:bg-black/10' : 'bg-white/10 text-zinc-300 hover:bg-white/15')
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ARTIFACTS CONTAINER */}
          {filtered.length === 0 ? (
            <div className={`border rounded-2xl p-12 text-center space-y-2 ${
              isLight ? 'bg-white border-black/10 text-camry-graphite/60' : 'bg-[#1C1C22] border-white/10 text-zinc-400'
            }`}>
              <FileText size={32} className={`mx-auto ${isLight ? 'text-black/20' : 'text-white/20'}`} />
              <h3 className={`font-bricolage text-base font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>No library items found</h3>
              <p className="text-xs">Try clearing search filters or generate new outputs in Chat.</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(item => {
                const isRestricted = item.restrictedRoles?.includes(currentRole) || 
                  (currentRole === 'Member' && item.category === 'Finance') ||
                  (currentRole === 'Guest' && item.category !== 'Contracts');

                return (
                  <div 
                    key={item.id}
                    onClick={() => !isRestricted && setSelectedItem(item)}
                    className={`border rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between group ${
                      isRestricted 
                        ? (isLight ? 'opacity-60 border-amber-200 bg-amber-50/20 cursor-not-allowed' : 'opacity-60 border-amber-900/50 bg-amber-950/20 cursor-not-allowed')
                        : (isLight ? 'bg-white border-black/10 hover:border-black/30 hover:shadow-md cursor-pointer' : 'bg-[#1C1C22] border-white/10 hover:border-white/30 hover:shadow-md cursor-pointer')
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md font-martian text-[10px] font-bold ${
                            isLight ? 'bg-camry-blackout text-white' : 'bg-[#0066FF] text-white'
                          }`}>
                            {item.type}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md font-martian text-[10px] ${
                            isLight ? 'bg-black/5 text-camry-graphite' : 'bg-white/10 text-zinc-300'
                          }`}>
                            {item.category}
                          </span>
                        </div>

                        {isRestricted && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-martian text-[9px] font-bold flex items-center gap-1">
                            <Lock size={10} /> RESTRICTED
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className={`font-bricolage font-bold text-base transition-colors line-clamp-2 ${
                        isLight ? 'text-camry-blackout group-hover:text-[#0066FF]' : 'text-white group-hover:text-blue-400'
                      }`}>
                        {item.title}
                      </h3>

                      {/* Image preview if image type */}
                      {item.imageUrl ? (
                        <div className={`rounded-xl overflow-hidden border aspect-video relative ${
                          isLight ? 'border-black/10 bg-black/5' : 'border-white/10 bg-white/5'
                        }`}>
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <p className={`text-xs line-clamp-3 leading-relaxed font-familjen ${
                          isLight ? 'text-camry-graphite/80' : 'text-zinc-300'
                        }`}>
                          {item.snippet}
                        </p>
                      )}
                    </div>

                    {/* Footer metadata */}
                    <div className={`pt-4 mt-4 border-t space-y-2 ${isLight ? 'border-black/5' : 'border-white/10'}`}>
                      <div className={`flex items-center justify-between font-martian text-[10px] ${
                        isLight ? 'text-camry-graphite/60' : 'text-zinc-400'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <User size={12} />
                          <span>{item.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Cpu size={12} className="text-[#0066FF]" />
                          <span>{item.modelUsed}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className={`font-martian text-[10px] ${
                          isLight ? 'text-camry-graphite/50' : 'text-zinc-500'
                        }`}>
                          {item.date}
                        </span>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Tooltip content="Copy artifact text" position="top">
                            <button
                              onClick={() => handleCopy(item.content || item.snippet)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer group ${
                                isLight ? 'hover:bg-black/5 text-camry-graphite hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                              }`}
                            >
                              <AnimatedIcon type="scale">
                                <Copy size={14} />
                              </AnimatedIcon>
                            </button>
                          </Tooltip>

                          <Tooltip content="Download markdown document" position="top">
                            <button
                              onClick={() => handleDownload(item)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer group ${
                                isLight ? 'hover:bg-black/5 text-camry-graphite hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                              }`}
                            >
                              <AnimatedIcon type="bounce">
                                <Download size={14} />
                              </AnimatedIcon>
                            </button>
                          </Tooltip>

                          <Tooltip content="Delete artifact" position="top">
                            <button
                              onClick={() => setItemToDelete(item)}
                              className={`p-1.5 rounded-lg text-red-500 transition-colors cursor-pointer group ${
                                isLight ? 'hover:bg-red-50' : 'hover:bg-red-950/30'
                              }`}
                            >
                              <AnimatedIcon type="wiggle">
                                <Trash2 size={14} />
                              </AnimatedIcon>
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div className={`border rounded-2xl shadow-xs overflow-hidden ${
              isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-familjen">
                  <thead className={`border-b font-martian text-[10px] uppercase tracking-wider ${
                    isLight ? 'bg-zinc-50 border-black/10 text-camry-graphite/70' : 'bg-[#141418] border-white/10 text-zinc-400'
                  }`}>
                    <tr>
                      <th className="py-3 px-4">Title & Excerpt</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Author</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-black/5' : 'divide-white/10'}`}>
                    {filtered.map(item => {
                      const isRestricted = item.restrictedRoles?.includes(currentRole) || 
                        (currentRole === 'Member' && item.category === 'Finance') ||
                        (currentRole === 'Guest' && item.category !== 'Contracts');

                      return (
                        <tr 
                          key={item.id}
                          onClick={() => !isRestricted && setSelectedItem(item)}
                          className={`transition-colors cursor-pointer ${
                            isRestricted 
                              ? (isLight ? 'opacity-50 bg-amber-50/10 cursor-not-allowed' : 'opacity-50 bg-amber-950/20 cursor-not-allowed') 
                              : (isLight ? 'hover:bg-zinc-50/80' : 'hover:bg-white/5')
                          }`}
                        >
                          <td className="py-3 px-4 max-w-xs sm:max-w-md">
                            <div className={`font-bricolage font-bold text-sm truncate ${
                              isLight ? 'text-camry-blackout' : 'text-white'
                            }`}>
                              {item.title}
                            </div>
                            <div className={`text-[11px] truncate ${isLight ? 'text-camry-graphite/70' : 'text-zinc-400'}`}>
                              {item.snippet}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded font-martian text-[10px] font-bold ${
                              isLight ? 'bg-camry-blackout text-white' : 'bg-[#0066FF] text-white'
                            }`}>
                              {item.type}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded font-martian text-[10px] ${
                              isLight ? 'bg-black/5 text-camry-graphite' : 'bg-white/10 text-zinc-300'
                            }`}>
                              {item.category}
                            </span>
                          </td>

                          <td className={`py-3 px-3 font-martian text-[11px] ${
                            isLight ? 'text-camry-graphite' : 'text-zinc-300'
                          }`}>
                            {item.author}
                          </td>

                          <td className={`py-3 px-3 font-martian text-[10px] whitespace-nowrap ${
                            isLight ? 'text-camry-graphite/60' : 'text-zinc-400'
                          }`}>
                            {item.date}
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => !isRestricted && setSelectedItem(item)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isLight ? 'hover:bg-black/5 text-camry-graphite hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                                }`}
                                title="View details"
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                onClick={() => handleCopy(item.content || item.snippet)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isLight ? 'hover:bg-black/5 text-camry-graphite hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                                }`}
                                title="Copy text"
                              >
                                <Copy size={15} />
                              </button>
                              <button
                                onClick={() => setItemToDelete(item)}
                                className={`p-1.5 rounded-lg text-red-500 transition-colors ${
                                  isLight ? 'hover:bg-red-50' : 'hover:bg-red-950/30'
                                }`}
                                title="Delete item"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: COMPANY CREATED AGENTS VIEW */}
      {/* ========================================================= */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          {/* TOP ACTION BAR: Search, Filter & Create Agent */}
          <div className={`border rounded-2xl p-4 shadow-sm space-y-3 ${
            isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Agent Search */}
              <div className="relative flex-1">
                <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isLight ? 'text-camry-graphite/40' : 'text-zinc-500'
                }`} />
                <input 
                  type="text"
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  placeholder="Search company agents by name, category, or system instructions..."
                  className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs font-familjen transition-all focus:outline-none focus:ring-2 focus:ring-[#0066FF] ${
                    isLight 
                      ? 'bg-zinc-50 border-black/10 text-camry-blackout placeholder:text-camry-graphite/40' 
                      : 'bg-[#141418] border-white/15 text-white placeholder:text-zinc-500'
                  }`}
                />
              </div>

              {/* Create Company Agent Button */}
              <button
                onClick={() => setIsCreateAgentModalOpen(true)}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-martian text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] cursor-pointer ${
                  isLight ? 'bg-camry-blackout hover:bg-black text-white' : 'bg-[#0066FF] hover:bg-[#0052CC] text-white'
                }`}
              >
                <Plus size={15} className={isLight ? 'text-camry-carrier' : 'text-white'} />
                <span>+ Create Company Agent</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className={`flex items-center gap-2 overflow-x-auto pt-2 border-t scrollbar-none ${
              isLight ? 'border-black/5' : 'border-white/10'
            }`}>
              <span className={`font-martian text-[10px] uppercase tracking-wider pr-1 flex-shrink-0 ${
                isLight ? 'text-camry-graphite/60' : 'text-zinc-400'
              }`}>
                Department Scopes:
              </span>
              {agentCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setAgentCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-martian transition-all flex-shrink-0 cursor-pointer ${
                    agentCategoryFilter === cat 
                      ? (isLight ? 'bg-camry-blackout text-white font-bold shadow-2xs' : 'bg-[#0066FF] text-white font-bold shadow-2xs')
                      : (isLight ? 'bg-zinc-100 text-camry-graphite hover:bg-zinc-200' : 'bg-white/10 text-zinc-300 hover:bg-white/15')
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* AGENTS GRID */}
          {filteredAgents.length === 0 ? (
            <div className={`border rounded-2xl p-12 text-center space-y-3 ${
              isLight ? 'bg-white border-black/10 text-camry-graphite/60' : 'bg-[#1C1C22] border-white/10 text-zinc-400'
            }`}>
              <Bot size={36} className={`mx-auto ${isLight ? 'text-black/20' : 'text-white/20'}`} />
              <h3 className={`font-bricolage text-base font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>No company agents match search</h3>
              <p className="text-xs">Try resetting category filters or build a new agent for your workspace.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAgents.map(agent => {
                return (
                  <motion.div 
                    key={agent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between group ${
                      isLight 
                        ? 'bg-white border-black/10 hover:border-black/30 hover:shadow-md' 
                        : 'bg-[#1C1C22] border-white/10 hover:border-white/30 hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Icon, Name, Category & Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2.5 rounded-xl border shrink-0 ${
                            isLight ? 'bg-zinc-100 border-black/5' : 'bg-white/5 border-white/10'
                          }`}>
                            {renderCategoryIcon(agent.category)}
                          </div>
                          <div>
                            <h3 className={`font-bricolage font-bold text-base transition-colors ${
                              isLight ? 'text-camry-blackout group-hover:text-[#0066FF]' : 'text-white group-hover:text-blue-400'
                            }`}>
                              {agent.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`font-martian text-[10px] font-semibold px-2 py-0.5 rounded ${
                                isLight ? 'text-camry-graphite bg-black/5' : 'text-zinc-300 bg-white/10'
                              }`}>
                                {agent.category || 'Custom'}
                              </span>
                              <span className={`font-martian text-[10px] font-bold px-2 py-0.5 rounded ${
                                isLight ? 'text-camry-deep-carrier bg-camry-carrier/15' : 'text-blue-400 bg-blue-950/40'
                              }`}>
                                {agent.currentVersion || 'v1.0.0'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          {agent.status === 'active' ? (
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-martian font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded-full shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              ACTIVE
                            </span>
                          ) : agent.status === 'error' ? (
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-martian font-bold text-white bg-red-600 px-2.5 py-0.5 rounded-full shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              ALERT
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-martian font-bold text-white bg-amber-500 px-2.5 py-0.5 rounded-full shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              STANDBY
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className={`text-xs leading-relaxed font-familjen line-clamp-2 ${
                        isLight ? 'text-camry-graphite/80' : 'text-zinc-300'
                      }`}>
                        {agent.description}
                      </p>

                      {/* System Prompt snippet */}
                      {agent.systemPrompt && (
                        <div className={`p-2.5 border rounded-xl font-mono text-[11px] line-clamp-2 relative ${
                          isLight ? 'bg-zinc-50 border-black/5 text-camry-graphite/90' : 'bg-[#141418] border-white/10 text-zinc-300'
                        }`}>
                          <span className={`font-martian text-[9px] font-bold block mb-0.5 ${
                            isLight ? 'text-black/40' : 'text-zinc-500'
                          }`}>SYSTEM INSTRUCTIONS:</span>
                          "{agent.systemPrompt}"
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className={`pt-4 mt-4 border-t flex items-center justify-between gap-2 ${
                      isLight ? 'border-black/5' : 'border-white/10'
                    }`}>
                      <button
                        onClick={() => setSelectedAgentForDetails(agent)}
                        className={`p-1.5 rounded-lg font-martian text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                          isLight ? 'hover:bg-black/5 text-camry-graphite hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                        }`}
                        title="View System Prompt & Versions"
                      >
                        <History size={14} />
                        <span>Prompt & Logs</span>
                      </button>

                      <button
                        onClick={() => handleLaunchAgentChat(agent)}
                        className={`px-3 py-1.5 rounded-xl font-martian text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all hover:scale-105 cursor-pointer ${
                          isLight ? 'bg-camry-blackout hover:bg-black text-white' : 'bg-[#0066FF] hover:bg-[#0052CC] text-white'
                        }`}
                      >
                        <MessageSquare size={13} className={isLight ? 'text-camry-carrier' : 'text-white'} />
                        <span>Launch Chat</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE NEW COMPANY AGENT */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isCreateAgentModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 font-familjen ${
                isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#1C1C22] border-white/15 text-white'
              }`}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between pb-3 border-b ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${isLight ? 'bg-camry-carrier/20 text-camry-blackout' : 'bg-blue-950/40 text-blue-400'}`}>
                    <Bot size={20} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bricolage font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Create Company AI Agent</h2>
                    <p className={`text-xs ${isLight ? 'text-camry-graphite/70' : 'text-zinc-400'}`}>Deploy a customized agent on local Camry NPU for team workflows</p>
                  </div>
                </div>

                <button onClick={() => setIsCreateAgentModalOpen(false)} className={`p-1 cursor-pointer ${isLight ? 'text-camry-graphite hover:text-black' : 'text-zinc-400 hover:text-white'}`}>
                  <X size={20} />
                </button>
              </div>

              {/* Agent Form */}
              <form onSubmit={handleCreateAgentSubmit} className="space-y-4 text-xs font-familjen">
                <div>
                  <label className={`block font-martian font-bold mb-1 ${isLight ? 'text-camry-blackout' : 'text-zinc-200'}`}>Agent Name *</label>
                  <input 
                    type="text" 
                    required
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    placeholder="e.g. Audit Compliance Officer"
                    className={`w-full px-3 py-2 border rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066FF] ${
                      isLight ? 'bg-zinc-50 border-black/10 text-camry-blackout' : 'bg-[#141418] border-white/15 text-white'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-martian font-bold mb-1 ${isLight ? 'text-camry-blackout' : 'text-zinc-200'}`}>Department Scope</label>
                    <CustomSelect
                      fullWidth
                      value={newAgentCategory}
                      onChange={(val) => setNewAgentCategory(val)}
                      options={agentCategories.filter(c => c !== 'All').map(cat => ({ value: cat, label: cat }))}
                      buttonClassName={isLight ? 'bg-zinc-50 border-black/10 rounded-xl' : 'bg-[#141418] border-white/15 rounded-xl text-white'}
                    />
                  </div>

                  <div>
                    <label className={`block font-martian font-bold mb-1 ${isLight ? 'text-camry-blackout' : 'text-zinc-200'}`}>Initial Version</label>
                    <input 
                      type="text"
                      value={newAgentVersion}
                      onChange={(e) => setNewAgentVersion(e.target.value)}
                      placeholder="v1.0.0"
                      className={`w-full px-3 py-2 border rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#0066FF] ${
                        isLight ? 'bg-zinc-50 border-black/10 text-camry-blackout' : 'bg-[#141418] border-white/15 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block font-martian font-bold mb-1 ${isLight ? 'text-camry-blackout' : 'text-zinc-200'}`}>Short Description / Purpose</label>
                  <input 
                    type="text"
                    value={newAgentTagline}
                    onChange={(e) => setNewAgentTagline(e.target.value)}
                    placeholder="e.g. Scans contract clauses against corporate risk policies."
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF] ${
                      isLight ? 'bg-zinc-50 border-black/10 text-camry-blackout' : 'bg-[#141418] border-white/15 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-martian font-bold mb-1 ${isLight ? 'text-camry-blackout' : 'text-zinc-200'}`}>System Instructions / Prompt</label>
                  <textarea 
                    rows={4}
                    value={newAgentPrompt}
                    onChange={(e) => setNewAgentPrompt(e.target.value)}
                    placeholder="You are an enterprise AI compliance specialist. Analyze contracts, flag high-risk indemnities, and respond with structured markdown analysis..."
                    className={`w-full px-3 py-2 border rounded-xl font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0066FF] ${
                      isLight ? 'bg-zinc-50 border-black/10 text-camry-blackout' : 'bg-[#141418] border-white/15 text-white'
                    }`}
                  />
                </div>

                {/* Form Buttons */}
                <div className={`pt-3 border-t flex items-center justify-end gap-2 ${
                  isLight ? 'border-black/10' : 'border-white/10'
                }`}>
                  <button 
                    type="button" 
                    onClick={() => setIsCreateAgentModalOpen(false)}
                    className={`px-4 py-2 rounded-xl border text-xs font-martian cursor-pointer ${
                      isLight ? 'border-black/10 hover:bg-black/5 text-camry-blackout' : 'border-white/10 hover:bg-white/10 text-white'
                    }`}
                  >
                    Cancel
                  </button>

                  <button 
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-martian font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Check size={14} className="text-white" />
                    <span>Deploy Agent</span>
                  </button>
                </div>
              </form>
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
              className={`border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col font-familjen ${
                isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#1C1C22] border-white/15 text-white'
              }`}
            >
              {/* Header */}
              <div className={`flex items-start justify-between pb-3 border-b shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded font-martian text-[10px] font-bold ${
                      isLight ? 'bg-camry-blackout text-white' : 'bg-[#0066FF] text-white'
                    }`}>
                      {selectedAgentForDetails.category || 'Custom'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded font-martian text-[10px] font-bold ${
                      isLight ? 'bg-camry-carrier/20 text-camry-blackout' : 'bg-blue-950/40 text-blue-300'
                    }`}>
                      {selectedAgentForDetails.currentVersion || 'v1.0.0'}
                    </span>
                  </div>
                  <h2 className={`text-xl font-bricolage font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
                    {selectedAgentForDetails.name}
                  </h2>
                </div>

                <button onClick={() => setSelectedAgentForDetails(null)} className={`p-1 cursor-pointer ${isLight ? 'text-camry-graphite hover:text-black' : 'text-zinc-400 hover:text-white'}`}>
                  <X size={20} />
                </button>
              </div>

              {/* System Prompt View */}
              <div className="space-y-1">
                <label className={`font-martian text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-camry-blackout' : 'text-zinc-200'
                }`}>Active System Instructions</label>
                <div className="p-3 bg-zinc-900 text-emerald-400 font-mono text-xs rounded-xl border border-black/20 overflow-y-auto max-h-36 leading-relaxed">
                  {selectedAgentForDetails.systemPrompt || 'No explicit system prompt specified.'}
                </div>
              </div>

              {/* Version History Log */}
              <div className="space-y-2 flex-1 overflow-y-auto pt-2">
                <label className={`font-martian text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? 'text-camry-blackout' : 'text-zinc-200'
                }`}>
                  <History size={14} className="text-[#0066FF]" />
                  <span>Version Audit Log</span>
                </label>

                {selectedAgentForDetails.versionHistory && selectedAgentForDetails.versionHistory.length > 0 ? (
                  <div className="space-y-2">
                    {selectedAgentForDetails.versionHistory.map((ver, idx) => (
                      <div key={ver.version + idx} className={`p-3 border rounded-xl space-y-1 text-xs ${
                        isLight ? 'bg-zinc-50 border-black/10' : 'bg-[#141418] border-white/10'
                      }`}>
                        <div className="flex items-center justify-between font-martian text-[11px]">
                          <span className={`font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>{ver.version}</span>
                          <span className={isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}>{ver.updatedAt} • By {ver.author}</span>
                        </div>
                        <p className={isLight ? 'text-camry-graphite text-xs' : 'text-zinc-300 text-xs'}>{ver.changes}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-xs italic p-3 rounded-xl border ${
                    isLight ? 'bg-zinc-50 border-black/5 text-camry-graphite' : 'bg-[#141418] border-white/5 text-zinc-400'
                  }`}>
                    Single version deployed ({selectedAgentForDetails.currentVersion || 'v1.0.0'}).
                  </p>
                )}
              </div>

              {/* Footer action */}
              <div className={`pt-3 border-t flex items-center justify-between gap-2 shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <button
                  onClick={() => handleCopy(selectedAgentForDetails.systemPrompt || '')}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-martian font-semibold flex items-center gap-1.5 cursor-pointer ${
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
                  className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-martian text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <MessageSquare size={14} className="text-white" />
                  <span>Launch Agent Chat</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DOCUMENT VIEWER MODAL / SIDE PANEL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col font-familjen ${
                isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#1C1C22] border-white/15 text-white'
              }`}
            >
              {/* Header */}
              <div className={`flex items-start justify-between pb-3 border-b flex-shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded font-martian text-[10px] font-bold ${
                      isLight ? 'bg-camry-blackout text-white' : 'bg-[#0066FF] text-white'
                    }`}>
                      {selectedItem.type}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded font-martian text-[10px] ${
                      isLight ? 'bg-black/5 text-camry-graphite' : 'bg-white/10 text-zinc-300'
                    }`}>
                      {selectedItem.category}
                    </span>
                  </div>
                  <h2 className={`text-xl font-bricolage font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
                    {selectedItem.title}
                  </h2>
                </div>

                <button onClick={() => setSelectedItem(null)} className={`p-1.5 cursor-pointer ${isLight ? 'text-camry-graphite hover:text-black' : 'text-zinc-400 hover:text-white'}`}>
                  <X size={20} />
                </button>
              </div>

              {/* Author & Model strip */}
              <div className={`flex flex-wrap items-center justify-between gap-2 p-3 border rounded-xl font-martian text-xs flex-shrink-0 ${
                isLight ? 'bg-zinc-50 border-black/5 text-camry-graphite' : 'bg-[#141418] border-white/10 text-zinc-300'
              }`}>
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span>Author: <strong className={isLight ? 'text-camry-blackout' : 'text-white'}>{selectedItem.author}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu size={14} className="text-[#0066FF]" />
                  <span>Model: <strong className={isLight ? 'text-camry-blackout' : 'text-white'}>{selectedItem.modelUsed}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{selectedItem.date}</span>
                </div>
              </div>

              {/* Document Content View */}
              <div className={`flex-1 overflow-y-auto p-4 border rounded-xl space-y-3 font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                isLight ? 'bg-zinc-50/50 border-black/10 text-camry-blackout' : 'bg-[#141418] border-white/10 text-zinc-200'
              }`}>
                {selectedItem.imageUrl ? (
                  <div className="space-y-3">
                    <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full rounded-xl border border-black/10" />
                    <p className={`text-xs font-familjen ${isLight ? 'text-camry-graphite' : 'text-zinc-400'}`}>{selectedItem.snippet}</p>
                  </div>
                ) : (
                  selectedItem.content || selectedItem.snippet
                )}
              </div>

              {/* Action Toolbar */}
              <div className={`pt-3 border-t flex flex-wrap items-center justify-between gap-3 flex-shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <button
                  onClick={() => handleAskAboutOutput(selectedItem)}
                  className="px-4 py-2 rounded-xl bg-[#0066FF] text-white hover:bg-[#0052CC] font-martian text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare size={15} />
                  <span>Ask Camry about this output</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(selectedItem.content || selectedItem.snippet)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-martian font-semibold flex items-center gap-1.5 cursor-pointer ${
                      isLight ? 'border-black/10 hover:bg-black/5 text-camry-blackout' : 'border-white/10 hover:bg-white/10 text-white'
                    }`}
                  >
                    <Copy size={14} />
                    <span>Copy Text</span>
                  </button>

                  <button
                    onClick={() => handleDownload(selectedItem)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-martian font-semibold flex items-center gap-1.5 cursor-pointer ${
                      isLight ? 'border-black/10 hover:bg-black/5 text-camry-blackout' : 'border-white/10 hover:bg-white/10 text-white'
                    }`}
                  >
                    <Download size={14} />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 font-familjen ${
                isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#1C1C22] border-white/15 text-white'
              }`}
            >
              <h3 className={`font-bricolage font-bold text-base ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Delete library artifact?</h3>
              <p className={`text-xs ${isLight ? 'text-camry-graphite' : 'text-zinc-300'}`}>
                Are you sure you want to delete <span className={`font-semibold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>{itemToDelete.title}</span>? This cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button 
                  onClick={() => setItemToDelete(null)} 
                  className={`px-3.5 py-2 rounded-xl border text-xs font-martian cursor-pointer ${
                    isLight ? 'border-black/10 hover:bg-black/5 text-camry-blackout' : 'border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    deleteLibraryItem(itemToDelete.id);
                    showToast(`Deleted ${itemToDelete.title}`);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-martian font-semibold hover:bg-red-700 cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
