import React, { useState, useMemo } from 'react';
import { useAppContext, LibraryItem, GeneratedDocument, UserRole } from '../store/AppContext';
import { CustomSelect } from '../components/CustomSelect';
import { 
  Search, 
  FileText, 
  Copy, 
  Download, 
  Eye, 
  X, 
  MessageSquare, 
  Bot, 
  User, 
  Calendar, 
  Cpu, 
  FolderArchive, 
  FileSpreadsheet, 
  FileImage, 
  FileCheck, 
  Trash2, 
  LayoutGrid, 
  List, 
  Video 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Library: React.FC = () => {
  const { 
    themeMode, 
    libraryItems, 
    sessionDocuments,
    setCurrentScreen, 
    setActiveAgent, 
    setPendingChatPrompt, 
    showToast,
    categories: appCategories,
    currentRole
  } = useAppContext();

  const isLight = themeMode === 'light';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [generatorFilter, setGeneratorFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'generator'>('newest');
  
  // Selected Document for Full Details Modal
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  // Local state for items so user can delete
  const [localItems, setLocalItems] = useState<LibraryItem[]>(libraryItems);

  // Combine library items with session documents (avoid duplicates by ID)
  const allUnifiedFiles = useMemo(() => {
    const combined: LibraryItem[] = [...localItems];
    
    // Convert sessionDocuments into LibraryItems if not already present
    sessionDocuments.forEach((doc: GeneratedDocument) => {
      if (!combined.some(item => item.id === doc.id || item.title === doc.title)) {
        combined.unshift({
          id: doc.id,
          title: doc.title,
          type: doc.type === 'MD' ? 'MD' : (doc.type as any) || 'Doc',
          category: doc.category || 'General',
          snippet: doc.content.slice(0, 180).replace(/[#*`_]/g, '') + '...',
          content: doc.content,
          author: doc.author || 'You',
          modelUsed: doc.modelUsed || 'gpt-oss-120b',
          agentName: doc.agentName || 'Camry Assistant',
          date: doc.createdAt || 'Just now'
        });
      }
    });

    return combined;
  }, [localItems, sessionDocuments]);

  // Specific required file types
  const availableTypes = ['All', 'PDF', 'Doc', 'Sheet', 'MD', 'Image', 'Video'];
  const availableCategories = ['All', ...Array.from(new Set([...appCategories.map(c => c.name), 'Contracts', 'Finance', 'HR', 'Client Files', 'Case Law', 'General']))];
  
  const allGenerators = useMemo(() => {
    const set = new Set<string>();
    allUnifiedFiles.forEach(f => {
      if (f.agentName) set.add(`AI: ${f.agentName}`);
      if (f.author) set.add(`User: ${f.author}`);
    });
    return ['All', ...Array.from(set)];
  }, [allUnifiedFiles]);

  // Filter and Sort logic
  const filteredFiles = useMemo(() => {
    return allUnifiedFiles.filter(item => {
      // Role access check
      if (item.restrictedRoles && item.restrictedRoles.includes(currentRole as UserRole)) {
        return false;
      }

      // Type Filter
      if (typeFilter !== 'All' && item.type.toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }

      // Category Filter
      if (categoryFilter !== 'All' && item.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      // Generator Filter
      if (generatorFilter !== 'All') {
        if (generatorFilter.startsWith('AI: ')) {
          const agent = generatorFilter.replace('AI: ', '');
          if (item.agentName !== agent) return false;
        } else if (generatorFilter.startsWith('User: ')) {
          const author = generatorFilter.replace('User: ', '');
          if (item.author !== author) return false;
        }
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSnippet = item.snippet.toLowerCase().includes(q);
        const matchesAuthor = item.author.toLowerCase().includes(q);
        const matchesAgent = item.agentName?.toLowerCase().includes(q) || false;
        const matchesModel = item.modelUsed.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesContent = item.content.toLowerCase().includes(q);

        if (!matchesTitle && !matchesSnippet && !matchesAuthor && !matchesAgent && !matchesModel && !matchesCategory && !matchesContent) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'generator') {
        const genA = a.agentName || a.author;
        const genB = b.agentName || b.author;
        return genA.localeCompare(genB);
      }
      if (sortBy === 'oldest') {
        return a.id.localeCompare(b.id);
      }
      // default: newest
      return b.id.localeCompare(a.id);
    });
  }, [allUnifiedFiles, typeFilter, categoryFilter, generatorFilter, searchQuery, sortBy, currentRole]);

  // Helpers
  const handleCopyContent = (content: string, title?: string) => {
    navigator.clipboard.writeText(content);
    showToast(`Copied "${title || 'file content'}" to clipboard`, 'success');
  };

  const handleDownloadFile = (item: LibraryItem) => {
    const extension = item.type === 'Image' ? 'png' : item.type === 'Sheet' ? 'csv' : item.type === 'PDF' ? 'pdf' : 'md';
    const blob = new Blob([item.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${item.title}`, 'success');
  };

  const handleOpenInChat = (item: LibraryItem) => {
    if (item.agentName) {
      setActiveAgent(item.agentName.toLowerCase().includes('legal') ? 'legal' : 
                     item.agentName.toLowerCase().includes('finance') ? 'finance' : 
                     item.agentName.toLowerCase().includes('medical') ? 'medical' : 
                     item.agentName.toLowerCase().includes('contract') ? 'contract' : null);
    }
    setPendingChatPrompt(`Regarding the document "${item.title}":\n\n${item.snippet}\n\nLet's continue working on this.`);
    setCurrentScreen('chat');
    showToast(`Opened "${item.title}" with Chat`, 'info');
  };

  const handleDeleteItem = (id: string, title: string) => {
    setLocalItems(prev => prev.filter(i => i.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    showToast(`Deleted "${title}" from Library`, 'info');
  };

  const getTypeIcon = (type: string, size = 16) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText size={size} className="text-red-500 shrink-0" />;
      case 'doc':
      case 'drafts':
      case 'draft':
        return <FileText size={size} className="text-blue-500 shrink-0" />;
      case 'sheet':
      case 'analyses':
        return <FileSpreadsheet size={size} className="text-emerald-500 shrink-0" />;
      case 'md':
      case 'summaries':
        return <FileCheck size={size} className="text-indigo-500 shrink-0" />;
      case 'image':
      case 'images':
        return <FileImage size={size} className="text-indigo-500 shrink-0" />;
      case 'video':
        return <Video size={size} className="text-rose-500 shrink-0" />;
      default:
        return <FileText size={size} className="text-zinc-400 shrink-0" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return isLight ? 'bg-red-50 text-red-700 border-red-200' : 'bg-red-950/40 text-red-300 border-red-800/40';
      case 'doc':
      case 'drafts':
        return isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-950/40 text-blue-300 border-blue-800/40';
      case 'sheet':
      case 'analyses':
        return isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40';
      case 'md':
      case 'summaries':
        return isLight ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-indigo-950/40 text-indigo-300 border-indigo-800/40';
      case 'image':
      case 'images':
        return isLight ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-indigo-950/40 text-indigo-300 border-indigo-800/40';
      case 'video':
        return isLight ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-rose-950/40 text-rose-300 border-rose-800/40';
      default:
        return isLight ? 'bg-zinc-100 text-zinc-700 border-zinc-200' : 'bg-white/10 text-zinc-300 border-white/10';
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto camry-page-container camry-section-gap transition-colors font-sans ${
      isLight ? 'bg-camry-paper text-camry-blackout' : 'bg-[#141418] text-white'
    }`}>
      <div className="space-y-6">
        {/* HEADER SECTION */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${
        isLight ? 'border-black/10' : 'border-white/10'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              isLight ? 'bg-blue-50/80 border-blue-200 text-[#0EA5E9]' : 'bg-blue-950/40 border-blue-800/40 text-blue-400'
            }`}>
              <FolderArchive size={22} />
            </div>
            <h1 className={`camry-h1-title ${
              isLight ? 'text-camry-blackout' : 'text-white'
            }`}>
              Files Library
            </h1>
          </div>
          <p className={`text-sm leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Explore documents, images, sheets, and video files generated in your workspace.
          </p>
        </div>
      </div>

      {/* QUICK STATS METRIC BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className={`p-4 rounded-2xl border shadow-2xs ${
          isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Files</span>
            <FileText size={16} className="text-sky-500" />
          </div>
          <div className={`text-2xl font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
            {allUnifiedFiles.length}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Across all formats</div>
        </div>

        <div className={`p-4 rounded-2xl border shadow-2xs ${
          isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Created</span>
            <Bot size={16} className="text-emerald-500" />
          </div>
          <div className={`text-2xl font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
            {allUnifiedFiles.filter(f => f.agentName).length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">On-premise NPU</div>
        </div>

        <div className={`p-4 rounded-2xl border shadow-2xs ${
          isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">User Created</span>
            <User size={16} className="text-indigo-500" />
          </div>
          <div className={`text-2xl font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
            {allUnifiedFiles.filter(f => !f.agentName || f.author !== 'System').length}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Workspace contributors</div>
        </div>

        <div className={`p-4 rounded-2xl border shadow-2xs ${
          isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Models</span>
            <Cpu size={16} className="text-sky-500" />
          </div>
          <div className={`text-2xl font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
            {new Set(allUnifiedFiles.map(f => f.modelUsed)).size}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">100% Offline inference</div>
        </div>
      </div>

      {/* SEARCH, FILTER & VIEW CONTROLS */}
      <div className={`border rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 ${
        isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'
      }`}>
        {/* Search Bar & Dropdowns */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-zinc-400' : 'text-zinc-500'
            }`} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files by title, creator, category, or content..."
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] ${
                isLight 
                  ? 'bg-zinc-50 border-black/10 text-camry-blackout placeholder:text-zinc-400' 
                  : 'bg-[#141418] border-white/15 text-white placeholder:text-zinc-500'
              }`}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Filter by Generator / Author */}
            <div className="w-full sm:w-48">
              <CustomSelect
                fullWidth
                value={generatorFilter}
                onChange={(val) => setGeneratorFilter(val)}
                options={allGenerators.map(g => ({ value: g, label: g }))}
                buttonClassName={isLight ? 'bg-zinc-50 border-black/10 rounded-xl py-2.5 text-xs' : 'bg-[#141418] border-white/15 rounded-xl py-2.5 text-xs text-white'}
              />
            </div>

            {/* Filter by Category */}
            <div className="w-full sm:w-40">
              <CustomSelect
                fullWidth
                value={categoryFilter}
                onChange={(val) => setCategoryFilter(val)}
                options={availableCategories.map(c => ({ value: c, label: c === 'All' ? 'All Categories' : c }))}
                buttonClassName={isLight ? 'bg-zinc-50 border-black/10 rounded-xl py-2.5 text-xs' : 'bg-[#141418] border-white/15 rounded-xl py-2.5 text-xs text-white'}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-36">
              <CustomSelect
                fullWidth
                value={sortBy}
                onChange={(val) => setSortBy(val as any)}
                options={[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'title', label: 'Title (A-Z)' },
                  { value: 'generator', label: 'Creator' }
                ]}
                buttonClassName={isLight ? 'bg-zinc-50 border-black/10 rounded-xl py-2.5 text-xs' : 'bg-[#141418] border-white/15 rounded-xl py-2.5 text-xs text-white'}
              />
            </div>

            {/* View Mode Toggle: Grid vs Table */}
            <div className={`flex items-center border rounded-xl p-1 shrink-0 ${
              isLight ? 'bg-zinc-100 border-black/10' : 'bg-[#141418] border-white/10'
            }`}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' 
                    ? (isLight ? 'bg-white shadow-xs text-[#0EA5E9]' : 'bg-white/15 text-sky-400')
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' 
                    ? (isLight ? 'bg-white shadow-xs text-[#0EA5E9]' : 'bg-white/15 text-sky-400')
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
                title="Table View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Specific Required File Type Filter Pills */}
        <div className={`flex items-center justify-between gap-2 overflow-x-auto pt-3 border-t scrollbar-none ${
          isLight ? 'border-black/5' : 'border-white/10'
        }`}>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className={`text-xs font-semibold uppercase tracking-wider pr-1 flex-shrink-0 ${
              isLight ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              Format:
            </span>
            {availableTypes.map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex-shrink-0 cursor-pointer whitespace-nowrap ${
                  typeFilter.toLowerCase() === t.toLowerCase()
                    ? (isLight ? 'bg-camry-blackout text-white font-semibold shadow-2xs' : 'bg-[#0EA5E9] text-white font-semibold shadow-2xs')
                    : (isLight ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200' : 'bg-white/10 text-zinc-300 hover:bg-white/15')
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <span className={`text-xs font-medium flex-shrink-0 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Showing <strong>{filteredFiles.length}</strong> of <strong>{allUnifiedFiles.length}</strong> files
          </span>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredFiles.length === 0 ? (
        <div className={`border rounded-2xl p-12 text-center space-y-3 ${
          isLight ? 'bg-white border-black/10 text-zinc-500' : 'bg-[#1C1C22] border-white/10 text-zinc-400'
        }`}>
          <FolderArchive size={40} className={`mx-auto ${isLight ? 'text-zinc-300' : 'text-zinc-600'}`} />
          <h3 className={`text-base font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
            No files found
          </h3>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            Try adjusting your search query, format filter, or category filter.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ========================================================= */
        /* GRID VIEW OF FILES */
        /* ========================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFiles.map(item => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between group ${
                  isLight 
                    ? 'bg-white border-black/10 hover:border-black/30 hover:shadow-md' 
                    : 'bg-[#1C1C22] border-white/10 hover:border-white/30 hover:shadow-md'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top Bar: Type Badge, Category, Date */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${getTypeBadgeColor(item.type)}`}>
                        {getTypeIcon(item.type, 13)}
                        <span>{item.type}</span>
                      </span>

                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        isLight ? 'bg-black/5 text-zinc-700' : 'bg-white/10 text-zinc-300'
                      }`}>
                        {item.category}
                      </span>
                    </div>

                    <span className={`text-[11px] font-mono shrink-0 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      {item.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => setSelectedItem(item)}
                    className={`font-bold text-base line-clamp-2 cursor-pointer transition-colors ${
                      isLight ? 'text-camry-blackout hover:text-[#0EA5E9]' : 'text-white hover:text-sky-400'
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Media / Snippet Preview */}
                  {item.imageUrl ? (
                    <div 
                      onClick={() => setSelectedItem(item)}
                      className="h-32 w-full rounded-xl overflow-hidden cursor-pointer relative bg-black/10 border border-black/5"
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : item.videoUrl ? (
                    <div 
                      onClick={() => setSelectedItem(item)}
                      className="h-32 w-full rounded-xl overflow-hidden cursor-pointer relative bg-black/80 border border-white/10 flex items-center justify-center text-white"
                    >
                      <Video size={32} className="text-rose-400 animate-pulse" />
                      <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded font-mono text-zinc-300">
                        MP4 Video
                      </span>
                    </div>
                  ) : (
                    <p 
                      onClick={() => setSelectedItem(item)}
                      className={`text-xs sm:text-sm leading-relaxed line-clamp-3 cursor-pointer ${
                        isLight ? 'text-zinc-600' : 'text-zinc-300'
                      }`}
                    >
                      {item.snippet}
                    </p>
                  )}

                  {/* SIMPLE CREATED BY DISPLAY */}
                  <div className={`px-3 py-2 rounded-xl border flex items-center justify-between text-xs ${
                    isLight ? 'bg-zinc-50 border-black/5' : 'bg-[#141418] border-white/5'
                  }`}>
                    <span className={`text-[11px] font-medium ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      Created by:
                    </span>
                    <div className="flex items-center gap-1.5 font-semibold">
                      {item.agentName ? (
                        <>
                          <Bot size={14} className="text-sky-500 shrink-0" />
                          <span className={isLight ? 'text-camry-blackout' : 'text-white'}>{item.agentName}</span>
                        </>
                      ) : (
                        <>
                          <User size={14} className="text-indigo-500 shrink-0" />
                          <span className={isLight ? 'text-camry-blackout' : 'text-white'}>{item.author}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className={`pt-3 mt-3 border-t flex items-center justify-between gap-2 ${
                  isLight ? 'border-black/10' : 'border-white/10'
                }`}>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isLight ? 'hover:bg-black/5 text-zinc-600 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Eye size={13} />
                    <span>Preview</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyContent(item.content, item.title)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isLight ? 'hover:bg-black/5 text-zinc-600 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                      }`}
                      title="Copy content"
                    >
                      <Copy size={14} />
                    </button>

                    <button
                      onClick={() => handleDownloadFile(item)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isLight ? 'hover:bg-black/5 text-zinc-600 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                      }`}
                      title="Download file"
                    >
                      <Download size={14} />
                    </button>

                    <button
                      onClick={() => handleOpenInChat(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0EA5E9] hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Open in Chat"
                    >
                      <MessageSquare size={12} />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* ========================================================= */
        /* DENSE TABLE VIEW */
        /* ========================================================= */
        <div className={`border rounded-2xl overflow-hidden shadow-xs ${
          isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b font-semibold uppercase tracking-wider text-[11px] ${
                  isLight ? 'bg-zinc-50 border-black/10 text-zinc-600' : 'bg-[#141418] border-white/10 text-zinc-400'
                }`}>
                  <th className="p-3.5 pl-5">File Title</th>
                  <th className="p-3.5">Format</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Created By</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {filteredFiles.map(item => (
                  <tr 
                    key={item.id}
                    className={`transition-colors cursor-pointer ${
                      isLight ? 'hover:bg-zinc-50/80' : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="p-3.5 pl-5 font-semibold" onClick={() => setSelectedItem(item)}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        {getTypeIcon(item.type, 16)}
                        <span className={`truncate max-w-xs sm:max-w-sm ${isLight ? 'text-camry-blackout font-bold' : 'text-white font-bold'}`}>
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5" onClick={() => setSelectedItem(item)}>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${getTypeBadgeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3.5" onClick={() => setSelectedItem(item)}>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        isLight ? 'bg-black/5 text-zinc-700' : 'bg-white/10 text-zinc-300'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3.5" onClick={() => setSelectedItem(item)}>
                      <div className="flex items-center gap-1.5 font-medium">
                        {item.agentName ? (
                          <>
                            <Bot size={13} className="text-sky-500 shrink-0" />
                            <span className={isLight ? 'text-zinc-800' : 'text-zinc-200'}>{item.agentName}</span>
                          </>
                        ) : (
                          <>
                            <User size={13} className="text-indigo-500 shrink-0" />
                            <span className={isLight ? 'text-zinc-800' : 'text-zinc-200'}>{item.author}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-zinc-400" onClick={() => setSelectedItem(item)}>
                      {item.date}
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isLight ? 'hover:bg-black/5 text-zinc-600' : 'hover:bg-white/10 text-zinc-400'
                          }`}
                          title="Preview"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleCopyContent(item.content, item.title)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isLight ? 'hover:bg-black/5 text-zinc-600' : 'hover:bg-white/10 text-zinc-400'
                          }`}
                          title="Copy content"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => handleDownloadFile(item)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isLight ? 'hover:bg-black/5 text-zinc-600' : 'hover:bg-white/10 text-zinc-400'
                          }`}
                          title="Download file"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenInChat(item)}
                          className="p-1.5 rounded-lg bg-[#0EA5E9] hover:bg-sky-500 text-white cursor-pointer shadow-2xs"
                          title="Open in Chat"
                        >
                          <MessageSquare size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: FILE PREVIEW */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`border rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] flex flex-col ${
                isLight ? 'bg-white border-black/10 text-camry-blackout' : 'bg-[#1C1C22] border-white/15 text-white'
              }`}
            >
              {/* Header */}
              <div className={`flex items-start justify-between pb-3.5 border-b shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <div className="space-y-1.5 min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold ${getTypeBadgeColor(selectedItem.type)}`}>
                      {getTypeIcon(selectedItem.type, 13)}
                      <span>{selectedItem.type}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      isLight ? 'bg-black/5 text-zinc-700' : 'bg-white/10 text-zinc-300'
                    }`}>
                      {selectedItem.category}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {selectedItem.date}
                    </span>
                  </div>

                  <h2 className={`text-xl sm:text-2xl font-bold truncate ${
                    isLight ? 'text-camry-blackout' : 'text-white'
                  }`}>
                    {selectedItem.title}
                  </h2>
                </div>

                <button 
                  onClick={() => setSelectedItem(null)} 
                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                    isLight ? 'text-zinc-500 hover:bg-black/5 hover:text-black' : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* CREATED BY INFO */}
              <div className={`px-4 py-2.5 rounded-xl border flex items-center justify-between text-xs shrink-0 ${
                isLight ? 'bg-zinc-50 border-black/10' : 'bg-[#141418] border-white/10'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-medium">Created by:</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    {selectedItem.agentName ? (
                      <>
                        <Bot size={15} className="text-sky-500 shrink-0" />
                        <span className={isLight ? 'text-camry-blackout' : 'text-white'}>{selectedItem.agentName}</span>
                      </>
                    ) : (
                      <>
                        <User size={15} className="text-indigo-500 shrink-0" />
                        <span className={isLight ? 'text-camry-blackout' : 'text-white'}>{selectedItem.author}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                  <Cpu size={13} className="text-sky-500 shrink-0" />
                  <span>{selectedItem.modelUsed}</span>
                </div>
              </div>

              {/* File Content / Video / Image Preview */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
                {selectedItem.videoUrl ? (
                  <div className="rounded-xl overflow-hidden border border-black/10 bg-black flex items-center justify-center">
                    <video src={selectedItem.videoUrl} controls className="w-full max-h-96 rounded-xl" />
                  </div>
                ) : selectedItem.imageUrl ? (
                  <div className="rounded-xl overflow-hidden border border-black/10 max-h-96 flex items-center justify-center bg-black/20">
                    <img 
                      src={selectedItem.imageUrl} 
                      alt={selectedItem.title} 
                      className="max-h-96 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className={`p-4 rounded-xl border font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isLight 
                      ? 'bg-zinc-50 border-black/10 text-zinc-800' 
                      : 'bg-[#141418] border-white/10 text-zinc-200'
                  }`}>
                    {selectedItem.content}
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className={`pt-3.5 border-t flex items-center justify-between gap-2.5 shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <button
                  onClick={() => handleDeleteItem(selectedItem.id, selectedItem.title)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs border border-red-700"
                >
                  <Trash2 size={14} />
                  <span>Delete File</span>
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleCopyContent(selectedItem.content, selectedItem.title)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      isLight ? 'border-black/10 hover:bg-black/5 text-camry-blackout' : 'border-white/10 hover:bg-white/10 text-white'
                    }`}
                  >
                    <Copy size={14} />
                    <span>Copy Content</span>
                  </button>

                  <button
                    onClick={() => handleDownloadFile(selectedItem)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      isLight ? 'border-black/10 hover:bg-black/5 text-camry-blackout' : 'border-white/10 hover:bg-white/10 text-white'
                    }`}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => {
                      handleOpenInChat(selectedItem);
                      setSelectedItem(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0EA5E9] hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>Continue in Chat</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

