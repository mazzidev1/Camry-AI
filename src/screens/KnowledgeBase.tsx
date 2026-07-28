import React, { useState, useRef } from 'react';
import { useAppContext, KBDocument, UserRole, Category } from '../store/AppContext';
import { Tooltip } from '../components/Tooltip';
import { AnimatedIcon } from '../components/AnimatedIcon';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  MoreVertical, 
  Trash2, 
  Eye, 
  RefreshCw, 
  ShieldAlert, 
  Lock, 
  Sparkles, 
  Layers, 
  ArrowRight,
  X,
  FileSpreadsheet,
  FileImage,
  FileCode,
  File,
  Clock,
  Loader2,
  Play,
  Plus,
  FolderPlus,
  Pencil,
  Tag,
  Folder,
  Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const KnowledgeBase: React.FC = () => {
  const { 
    kbDocuments, 
    addKBDocument, 
    updateKBDocumentStatus, 
    deleteKBDocument, 
    updateKBDocumentAccess,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    roleCategoryPermissions,
    currentRole,
    setCurrentScreen,
    setPendingChatPrompt,
    showToast 
  } = useAppContext();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<KBDocument | null>(null);
  const [selectedDocForRestrict, setSelectedDocForRestrict] = useState<KBDocument | null>(null);
  const [docToDelete, setDocToDelete] = useState<KBDocument | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Category Modal States
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatColor, setNewCatColor] = useState<string>('#1D4ED8');
  const [newCatDescription, setNewCatDescription] = useState<string>('');

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [reassignCategoryTarget, setReassignCategoryTarget] = useState<string>('Uncategorized');

  // File Upload with Category Selection Modal State
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);
  const [uploadCategory, setUploadCategory] = useState<string>('Client Files');
  const [showInlineCatCreate, setShowInlineCatCreate] = useState<boolean>(false);
  const [inlineCatName, setInlineCatName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const PRESET_COLORS = [
    '#1D4ED8', // Carrier Blue
    '#10B981', // Emerald
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#6366F1', // Indigo
    '#0D9488', // Teal
    '#F43F5E', // Rose
    '#64748B'  // Slate
  ];

  // Sequential animated file processing pipeline: QUEUED -> PROCESSING -> INDEXED
  const runProcessingSequence = (docId: string, docName: string) => {
    updateKBDocumentStatus(docId, 'QUEUED', 0);
    showToast(`Queued ${docName} for NPU embedding`, 'info');

    setTimeout(() => {
      updateKBDocumentStatus(docId, 'PROCESSING', 15);
      showToast(`Extracting OCR & Chunking: ${docName}...`, 'info');
    }, 900);

    setTimeout(() => {
      updateKBDocumentStatus(docId, 'PROCESSING', 45);
    }, 1800);

    setTimeout(() => {
      updateKBDocumentStatus(docId, 'PROCESSING', 78);
    }, 2700);

    setTimeout(() => {
      updateKBDocumentStatus(docId, 'PROCESSING', 95);
    }, 3500);

    setTimeout(() => {
      updateKBDocumentStatus(docId, 'INDEXED', 100);
      showToast(`Indexed ${docName} successfully on Camry NPU!`, 'success');
    }, 4200);
  };

  const handleCreateCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      showToast('Please enter a category name', 'error');
      return;
    }

    const created = addCategory({
      name: newCatName.trim(),
      color: newCatColor,
      description: newCatDescription.trim() || undefined
    });

    showToast(`Created category "${created.name}"`, 'success');
    setActiveCategory(created.name);
    setIsNewCategoryModalOpen(false);
    setNewCatName('');
    setNewCatDescription('');
  };

  const handleEditCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;

    updateCategory(editingCategory.id, {
      name: editingCategory.name.trim(),
      color: editingCategory.color,
      description: editingCategory.description
    });

    showToast(`Updated category "${editingCategory.name}"`, 'success');
    if (activeCategory === editingCategory.name) {
      setActiveCategory(editingCategory.name);
    }
    setEditingCategory(null);
  };

  const handleDeleteCategoryConfirm = () => {
    if (!categoryToDelete) return;
    const catName = categoryToDelete.name;
    deleteCategory(categoryToDelete.id, reassignCategoryTarget);
    showToast(`Deleted category "${catName}". Documents reassigned to ${reassignCategoryTarget}`);
    if (activeCategory === catName) {
      setActiveCategory('All');
    }
    setCategoryToDelete(null);
  };

  // Trigger batch ingestion simulation
  const handleSimulateBatchIngest = () => {
    const existingQueued = kbDocuments.find(d => d.status === 'QUEUED');
    if (existingQueued) {
      runProcessingSequence(existingQueued.id, existingQueued.name);
      return;
    }

    const firstCat = categories.find(c => !c.isSystem)?.name || 'Client Files';
    const sampleFiles = [
      { name: '2026_NPU_Acceleration_Benchmark.pdf', type: 'PDF' as const, size: '3.4 MB', pages: 18, cat: firstCat },
      { name: 'Q3_Capital_Expenditure_Budget.xlsx', type: 'XLSX' as const, size: '11.2 MB', pages: 85, cat: 'Finance' },
      { name: 'Data_Privacy_Governance_2026.docx', type: 'DOCX' as const, size: '2.8 MB', pages: 22, cat: 'Internal Policies' },
      { name: 'On_Premise_Cluster_Topology.png', type: 'IMG' as const, size: '4.1 MB', pages: 1, cat: 'Client Files' }
    ];
    const picked = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];

    const newId = addKBDocument({
      name: picked.name,
      type: picked.type,
      category: picked.cat,
      size: picked.size,
      uploadedBy: 'Amford',
      status: 'QUEUED',
      progress: 0,
      pages: picked.pages,
      extractedSnippet: `Simulated local NPU ingestion test document: ${picked.name}. Vector embeddings generated with zero cloud transmission.`
    });

    runProcessingSequence(newId, picked.name);
  };

  // Open Upload Modal when files are dropped or selected
  const handleFilesSelected = (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;
    setPendingFiles(fileList);
    setUploadCategory(activeCategory !== 'All' ? activeCategory : categories[0]?.name || 'Client Files');
  };

  const handleConfirmUpload = () => {
    if (!pendingFiles || pendingFiles.length === 0) return;

    let targetCat = uploadCategory;
    if (showInlineCatCreate && inlineCatName.trim()) {
      const created = addCategory({
        name: inlineCatName.trim(),
        color: '#1D4ED8',
        description: 'Created during document upload'
      });
      targetCat = created.name;
    }

    pendingFiles.forEach((file) => {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'TXT';
      let docType: KBDocument['type'] = 'TXT';
      if (ext.includes('PDF')) docType = 'PDF';
      else if (ext.includes('DOC')) docType = 'DOCX';
      else if (ext.includes('PPT')) docType = 'PPTX';
      else if (ext.includes('PNG') || ext.includes('JPG') || ext.includes('JPEG')) docType = 'IMG';
      else if (ext.includes('CSV')) docType = 'CSV';
      else if (ext.includes('XLS')) docType = 'XLSX';

      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      const newId = addKBDocument({
        name: file.name,
        type: docType,
        category: targetCat,
        size: sizeMb === '0.0 MB' ? '1.4 MB' : sizeMb,
        uploadedBy: 'Amford',
        status: 'QUEUED',
        progress: 0,
        pages: Math.floor(Math.random() * 25) + 3,
        extractedSnippet: `Extracted content from ${file.name}. Processed with local NPU OCR and vector index.`
      });

      runProcessingSequence(newId, file.name);
    });

    setPendingFiles(null);
    setShowInlineCatCreate(false);
    setInlineCatName('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  // Stats calculation
  const totalDocs = kbDocuments.length;
  const totalPages = kbDocuments.reduce((sum, d) => sum + (d.pages || 12), 0);
  const totalStorageMb = kbDocuments.reduce((sum, d) => sum + parseFloat(d.size || '1.0'), 0).toFixed(1);

  // Role permissions check
  const allowedCategoriesForCurrentRole = roleCategoryPermissions[currentRole] || [];

  // Filter docs by category & role accessibility
  const filteredDocs = kbDocuments.filter(d => {
    if (activeCategory !== 'All' && d.category !== activeCategory) return false;

    // Role-based filtering
    if (currentRole !== 'Admin') {
      const categoryAllowed = allowedCategoriesForCurrentRole.includes(d.category);
      if (!categoryAllowed) return false;
      if (d.restrictedRoles?.includes(currentRole)) return false;
    }

    return true;
  });

  const getFileIcon = (type: KBDocument['type']) => {
    switch (type) {
      case 'PDF': return <FileText size={16} className="text-red-500" />;
      case 'DOCX': return <FileText size={16} className="text-indigo-500" />;
      case 'PPTX': return <FileText size={16} className="text-amber-500" />;
      case 'IMG': return <FileImage size={16} className="text-emerald-500" />;
      case 'CSV':
      case 'XLSX': return <FileSpreadsheet size={16} className="text-emerald-600" />;
      default: return <FileCode size={16} className="text-zinc-500" />;
    }
  };

  const handleTryQuestion = () => {
    setPendingChatPrompt("When was the company founded, and what is our leave policy?");
    setCurrentScreen('chat');
  };

  const handleReindex = (doc: KBDocument) => {
    runProcessingSequence(doc.id, doc.name);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-camry-paper/40 p-4 sm:p-8 space-y-6 font-familjen">
      
      {/* Header Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bricolage text-camry-blackout font-bold tracking-tight">
              Knowledge Base
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-camry-carrier/20 text-camry-deep-carrier font-martian text-[10px] font-semibold uppercase tracking-wider">
              On-Premise RAG
            </span>
          </div>
          <p className="text-xs sm:text-sm text-camry-graphite/70 mt-1">
            Everything your Camry has learned about your organization. Nothing here leaves the building.
          </p>
        </div>
      </div>

      {/* ONBOARDING TIE-IN CALLOUT CARD */}
      <div className="bg-camry-graphite text-white rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10">
        <div className="space-y-1.5 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-camry-carrier/20 text-camry-carrier rounded-md font-martian text-[10px] uppercase tracking-wider font-semibold">
            <Sparkles size={12} />
            NEW-HIRE READY
          </div>
          <h2 className="text-base sm:text-lg font-bricolage text-white font-medium leading-snug">
            Because Camry has read your knowledge base, a new employee can ask it anything about the company on day one.
          </h2>
          <p className="text-xs text-white/60 font-familjen">
            Answers are cited directly from indexed PDFs, policy sheets, and master agreements with zero external cloud calls.
          </p>
        </div>

        <button
          onClick={handleTryQuestion}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-camry-blackout hover:bg-black text-white hover:text-camry-carrier border border-white/20 font-martian text-xs font-semibold shadow-sm transition-all flex-shrink-0 group"
        >
          <span>Try a question</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* UPLOAD ZONE */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-camry-deep-carrier bg-camry-carrier/10 shadow-lg scale-[1.005]' 
            : 'border-black/15 bg-white hover:border-black/30 hover:bg-zinc-50/80 shadow-sm'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => e.target.files && handleFilesSelected(e.target.files)} 
          className="hidden" 
          multiple
          accept=".pdf,.docx,.doc,.pptx,.ppt,.png,.jpg,.jpeg,.csv,.txt,.xlsx"
        />
        <div className="w-12 h-12 rounded-2xl bg-camry-blackout text-white flex items-center justify-center mx-auto mb-3 shadow-md">
          <Upload size={22} className={isDragging ? 'animate-bounce text-camry-carrier' : 'text-white'} />
        </div>
        <h3 className="text-sm sm:text-base font-bricolage font-bold text-camry-blackout">
          Drag files here or click to upload
        </h3>
        <p className="text-xs text-camry-graphite/60 mt-1 max-w-md mx-auto font-familjen">
          Supports PDF, DOCX, PPTX, Images, TXT, CSV. Files are chunked and embedded locally into Camry NVMe storage.
        </p>

        <div className="mt-4">
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="px-4 py-2 rounded-xl bg-camry-blackout text-white hover:bg-camry-graphite text-xs font-martian font-semibold shadow transition-all hover:scale-[1.02]"
          >
            Browse files
          </button>
        </div>
      </div>

      {/* LIVE STATS STRIP */}
      <div className="bg-white border border-black/10 rounded-xl p-3.5 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 font-martian text-xs text-camry-blackout">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-camry-deep-carrier" />
          <span className="font-bold tracking-wider uppercase text-camry-graphite/60 text-[10px]">INDEX STATS:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
          <div>DOCUMENTS <span className="font-bold text-camry-blackout">{totalDocs}</span></div>
          <span className="text-black/20">•</span>
          <div>PAGES <span className="font-bold text-camry-blackout">{totalPages.toLocaleString()}</span></div>
          <span className="text-black/20">•</span>
          <div>STORAGE <span className="font-bold text-camry-blackout">{totalStorageMb} / 256 GB</span></div>
          <span className="text-black/20">•</span>
          <div className="text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            LAST INDEXED 2 MIN AGO
          </div>
        </div>
      </div>

      {/* CATEGORY CHIPS */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none py-1">
          <span className="font-martian text-[10px] text-camry-graphite/60 uppercase tracking-wider pr-1 flex-shrink-0">
            Category:
          </span>

          {/* ALL CHIP */}
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-martian transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
              activeCategory === 'All' 
                ? 'bg-camry-blackout text-white shadow-sm font-bold' 
                : 'bg-white border border-black/10 text-camry-graphite hover:bg-black/5 font-medium'
            }`}
          >
            <span>ALL</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
              activeCategory === 'All' ? 'bg-white/20 text-white' : 'bg-black/5 text-camry-graphite'
            }`}>
              {kbDocuments.length} DOCS
            </span>
          </button>

          {/* DYNAMIC CATEGORY CHIPS */}
          {categories.map(cat => {
            const count = kbDocuments.filter(d => d.category === cat.name).length;
            const isActive = activeCategory === cat.name;
            const isDenied = currentRole !== 'Admin' && !allowedCategoriesForCurrentRole.includes(cat.name);

            return (
              <div 
                key={cat.id} 
                className="relative group flex-shrink-0"
              >
                <button
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-martian transition-all flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? 'bg-camry-blackout text-white shadow-sm font-bold' 
                      : isDenied
                      ? 'bg-zinc-100 border border-black/10 text-zinc-400 hover:bg-zinc-200'
                      : 'bg-white border border-black/10 text-camry-blackout hover:bg-black/5 font-medium'
                  }`}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-2xs" 
                    style={{ backgroundColor: cat.color }} 
                  />
                  <span>{cat.name}</span>

                  {isDenied ? (
                    <Lock size={12} className="text-amber-600 ml-0.5" title="Access Denied for current role" />
                  ) : (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-camry-graphite'
                    }`}>
                      {count} DOCS
                    </span>
                  )}
                </button>

                {/* Edit Category Button on Hover */}
                {!cat.isSystem && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategory(cat);
                    }}
                    className="absolute -top-1.5 -right-1.5 bg-white border border-black/15 hover:bg-black hover:text-white text-camry-graphite p-1 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                    title="Edit or Delete Category"
                  >
                    <Pencil size={10} />
                  </button>
                )}
              </div>
            );
          })}

          {/* "+ NEW CATEGORY" CHIP BUTTON */}
          <button
            onClick={() => setIsNewCategoryModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl border-2 border-dashed border-camry-deep-carrier/40 bg-camry-carrier/5 hover:bg-camry-carrier/15 text-camry-deep-carrier text-xs font-martian font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer hover:scale-[1.02]"
          >
            <Plus size={14} className="text-camry-deep-carrier" />
            <span>+ New category</span>
          </button>
        </div>

        {/* Dynamic Category Context Hint */}
        <p className="text-[11px] text-camry-graphite/60 italic font-familjen pl-1">
          Categories are yours to define — a hospital might use Departments and Patient Records; an airline might use Operations, Crew, and Maintenance.
        </p>
      </div>

      {/* DOCUMENT TABLE */}
      <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="px-5 py-3.5 bg-zinc-50 border-b border-black/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bricolage font-bold text-sm text-camry-blackout">
              Indexed Documents
            </h3>
            <span className="font-martian text-[10px] bg-black/5 text-camry-graphite px-2 py-0.5 rounded font-semibold">
              {filteredDocs.length} total
            </span>
          </div>

          <button
            onClick={handleSimulateBatchIngest}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-camry-blackout hover:bg-black text-white font-martian text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Play size={12} className="text-camry-carrier fill-camry-carrier" />
            <span>Simulate File Ingest (QUEUED → INDEXED)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-familjen">
            <thead className="bg-zinc-50/50 border-b border-black/10 font-martian text-[10px] text-camry-graphite/70 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Uploaded By</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredDocs.map((doc) => {
                const isRestrictedForCurrentRole = doc.restrictedRoles?.includes(currentRole) || 
                  (currentRole === 'Member' && doc.category === 'Finance') ||
                  (currentRole === 'Guest' && doc.category !== 'Contracts');

                return (
                  <tr 
                    key={doc.id} 
                    className={`hover:bg-zinc-50/80 transition-colors ${isRestrictedForCurrentRole ? 'bg-amber-50/30' : ''}`}
                  >
                    <td className="py-3 px-4 font-medium text-camry-blackout">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-black/5 flex-shrink-0">
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <div className="font-semibold text-camry-blackout text-xs sm:text-sm flex items-center gap-1.5">
                            <span>{doc.name}</span>
                            {isRestrictedForCurrentRole && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-martian font-semibold rounded flex items-center gap-1">
                                <Lock size={10} />
                                RESTRICTED ({currentRole.toUpperCase()})
                              </span>
                            )}
                          </div>
                          {doc.pages && (
                            <div className="text-[10px] text-camry-graphite/50 font-martian">
                              {doc.pages} pages extracted
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-martian text-[10px] bg-black/5 text-camry-blackout font-medium">
                        {doc.type}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-xs font-medium text-camry-graphite">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-martian text-[11px] text-camry-graphite">
                      {doc.size}
                    </td>

                    <td className="py-3 px-3 font-medium text-camry-blackout">
                      {doc.uploadedBy}
                    </td>

                    <td className="py-3 px-3 font-martian text-[10px] text-camry-graphite/70">
                      {doc.date}
                    </td>

                    <td className="py-3 px-3 min-w-[150px]">
                      {doc.status === 'INDEXED' ? (
                        <motion.span 
                          initial={{ scale: 0.9, opacity: 0.8 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-flex items-center gap-1 font-martian text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md shadow-2xs"
                        >
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          INDEXED ✓
                        </motion.span>
                      ) : doc.status === 'PROCESSING' ? (
                        <div className="w-36 space-y-1">
                          <div className="flex justify-between items-center text-[9px] font-martian text-zinc-700 font-bold">
                            <span className="flex items-center gap-1">
                              <Loader2 size={11} className="animate-spin text-zinc-500 shrink-0" />
                              PROCESSING…
                            </span>
                            <span className="font-mono">{doc.progress || 0}%</span>
                          </div>
                          <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden relative p-0.5 border border-zinc-200/50">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-zinc-500 to-emerald-500 rounded-full" 
                              initial={{ width: '0%' }}
                              animate={{ width: `${doc.progress || 0}%` }}
                              transition={{ ease: "easeInOut", duration: 0.4 }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 font-martian text-[10px] text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md shadow-2xs">
                            <Clock size={11} className="animate-pulse text-amber-600 shrink-0" />
                            QUEUED
                          </span>
                          <button
                            onClick={() => runProcessingSequence(doc.id, doc.name)}
                            className="px-2 py-0.5 rounded bg-camry-blackout hover:bg-black text-white text-[10px] font-martian font-semibold transition-all hover:scale-105 shrink-0 cursor-pointer"
                            title="Start NPU Ingestion"
                          >
                            Start
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right relative">
                      <Tooltip content="Document Options & Actions" position="left">
                        <button
                          onClick={() => setMenuOpenId(menuOpenId === doc.id ? null : doc.id)}
                          className="p-1.5 hover:bg-black/5 rounded-lg text-camry-graphite transition-colors cursor-pointer group"
                        >
                          <AnimatedIcon type="rotate">
                            <MoreVertical size={16} />
                          </AnimatedIcon>
                        </button>
                      </Tooltip>

                      {menuOpenId === doc.id && (
                        <div className="absolute right-3 top-10 w-48 bg-white border border-black/10 shadow-lg rounded-xl z-20 py-1 text-left text-xs font-familjen">
                          <button
                            onClick={() => {
                              setSelectedDocForPreview(doc);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-black/5 flex items-center gap-2 text-camry-blackout group cursor-pointer"
                          >
                            <AnimatedIcon type="scale" className="text-camry-graphite group-hover:text-camry-blackout">
                              <Eye size={14} />
                            </AnimatedIcon>
                            <span>Preview extracted text</span>
                          </button>

                          <button
                            onClick={() => {
                              handleReindex(doc);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-black/5 flex items-center gap-2 text-camry-blackout group cursor-pointer"
                          >
                            <AnimatedIcon type="spin" className="text-camry-graphite group-hover:text-camry-blackout">
                              <RefreshCw size={14} />
                            </AnimatedIcon>
                            <span>Re-index on NPU</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedDocForRestrict(doc);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-black/5 flex items-center gap-2 text-amber-800 font-medium group cursor-pointer"
                          >
                            <AnimatedIcon type="bounce" className="text-amber-600">
                              <ShieldAlert size={14} />
                            </AnimatedIcon>
                            <span>Restrict access</span>
                          </button>

                          <div className="border-t border-black/5 my-1" />

                          <button
                            onClick={() => {
                              setDocToDelete(doc);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium group cursor-pointer"
                          >
                            <AnimatedIcon type="wiggle" className="text-red-500">
                              <Trash2 size={14} />
                            </AnimatedIcon>
                            <span>Delete document</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {selectedDocForPreview && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black/10 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 font-familjen"
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-black/5">
                    {getFileIcon(selectedDocForPreview.type)}
                  </div>
                  <div>
                    <h3 className="font-bricolage font-bold text-base text-camry-blackout">{selectedDocForPreview.name}</h3>
                    <p className="font-martian text-[10px] text-camry-graphite/60">{selectedDocForPreview.size} • Category: {selectedDocForPreview.category}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDocForPreview(null)} className="p-1 text-camry-graphite hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="font-martian text-[10px] font-bold uppercase text-camry-graphite/60 tracking-wider">
                  LOCAL VECTOR SNIPPET PREVIEW:
                </div>
                <div className="p-3.5 bg-zinc-50 border border-black/10 rounded-xl text-xs text-camry-blackout leading-relaxed font-sans font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedDocForPreview.extractedSnippet || "Full document indexed on local Camry NVMe array."}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="font-martian text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
                  INDEX STATUS: {selectedDocForPreview.status}
                </div>
                <button 
                  onClick={() => setSelectedDocForPreview(null)}
                  className="px-4 py-2 rounded-xl bg-camry-blackout text-white text-xs font-martian font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESTRICT ACCESS MODAL */}
      <AnimatePresence>
        {selectedDocForRestrict && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black/10 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 font-familjen"
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="text-amber-600" size={18} />
                  <h3 className="font-bricolage font-bold text-base text-camry-blackout">Restrict Document Access</h3>
                </div>
                <button onClick={() => setSelectedDocForRestrict(null)} className="p-1 text-camry-graphite hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-camry-graphite">
                Select roles that are <strong className="text-red-600">DENIED</strong> access to <span className="font-semibold text-camry-blackout">{selectedDocForRestrict.name}</span>. Restricted users will not see this file or any Library outputs derived from it.
              </p>

              <div className="space-y-2">
                {(['Admin', 'Manager', 'Member', 'Guest'] as UserRole[]).map(r => {
                  const isRestricted = selectedDocForRestrict.restrictedRoles?.includes(r);
                  return (
                    <label key={r} className="flex items-center justify-between p-2.5 rounded-xl border border-black/10 hover:bg-zinc-50 cursor-pointer">
                      <span className="font-martian text-xs font-semibold text-camry-blackout">{r} Role</span>
                      <input 
                        type="checkbox"
                        checked={!!isRestricted}
                        onChange={(e) => {
                          const currentArr = selectedDocForRestrict.restrictedRoles || [];
                          const updated = e.target.checked 
                            ? [...currentArr, r]
                            : currentArr.filter(role => role !== r);
                          
                          setSelectedDocForRestrict({ ...selectedDocForRestrict, restrictedRoles: updated });
                        }}
                        className="w-4 h-4 rounded text-camry-blackout focus:ring-black"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button 
                  onClick={() => setSelectedDocForRestrict(null)}
                  className="px-3.5 py-2 rounded-xl border border-black/10 text-xs font-martian hover:bg-black/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    updateKBDocumentAccess(selectedDocForRestrict.id, selectedDocForRestrict.restrictedRoles || []);
                    showToast(`Updated access rules for ${selectedDocForRestrict.name}`);
                    setSelectedDocForRestrict(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-camry-blackout text-white text-xs font-martian font-semibold hover:bg-camry-graphite"
                >
                  Save Access Rules
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {docToDelete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black/10 rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 font-familjen"
            >
              <h3 className="font-bricolage font-bold text-base text-camry-blackout">Delete document from box?</h3>
              <p className="text-xs text-camry-graphite">
                Are you sure you want to delete <span className="font-semibold text-camry-blackout">{docToDelete.name}</span>? This will remove its vector indices from Camry NVMe storage.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setDocToDelete(null)} className="px-3.5 py-2 rounded-xl border border-black/10 text-xs font-martian hover:bg-black/5">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    deleteKBDocument(docToDelete.id);
                    showToast(`Deleted ${docToDelete.name}`);
                    setDocToDelete(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-martian font-semibold hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW CATEGORY MODAL */}
      <AnimatePresence>
        {isNewCategoryModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black/10 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 font-familjen"
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-camry-carrier/10 text-camry-deep-carrier">
                    <FolderPlus size={18} />
                  </div>
                  <div>
                    <h3 className="font-bricolage font-bold text-base text-camry-blackout">Create Category / Collection</h3>
                    <p className="text-xs text-camry-graphite/60">Define custom organization space for your company</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsNewCategoryModalOpen(false)} 
                  className="p-1 text-camry-graphite hover:text-black rounded-lg hover:bg-black/5"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-martian font-bold text-camry-blackout mb-1.5 uppercase">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Clinical Records, Crew Logs, IP Rights..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-zinc-50 text-xs text-camry-blackout focus:outline-none focus:ring-2 focus:ring-black font-familjen"
                  />
                </div>

                <div>
                  <label className="block text-xs font-martian font-bold text-camry-blackout mb-1.5 uppercase">
                    Color Badge Accent
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {PRESET_COLORS.map(c => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setNewCatColor(c)}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                          newCatColor === c ? 'scale-110 border-black shadow-md' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-martian font-bold text-camry-blackout mb-1.5 uppercase">
                    Description <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input 
                    type="text"
                    value={newCatDescription}
                    onChange={(e) => setNewCatDescription(e.target.value)}
                    placeholder="e.g. Patient intake sheets, shift logs, or supplier contracts"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-zinc-50 text-xs text-camry-blackout focus:outline-none focus:ring-2 focus:ring-black font-familjen"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10">
                  <button 
                    type="button"
                    onClick={() => setIsNewCategoryModalOpen(false)} 
                    className="px-4 py-2 rounded-xl border border-black/10 text-xs font-martian font-medium hover:bg-black/5"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-camry-blackout text-white text-xs font-martian font-bold hover:bg-camry-graphite shadow-sm"
                  >
                    Create Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT CATEGORY MODAL */}
      <AnimatePresence>
        {editingCategory && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black/10 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 font-familjen"
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-black/5 text-camry-blackout">
                    <Pencil size={18} />
                  </div>
                  <h3 className="font-bricolage font-bold text-base text-camry-blackout">
                    Manage "{editingCategory.name}"
                  </h3>
                </div>
                <button 
                  onClick={() => setEditingCategory(null)} 
                  className="p-1 text-camry-graphite hover:text-black rounded-lg hover:bg-black/5"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-martian font-bold text-camry-blackout mb-1.5 uppercase">
                    Category Name
                  </label>
                  <input 
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-zinc-50 text-xs text-camry-blackout focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-martian font-bold text-camry-blackout mb-1.5 uppercase">
                    Color Badge Accent
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {PRESET_COLORS.map(c => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setEditingCategory({ ...editingCategory, color: c })}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                          editingCategory.color === c ? 'scale-110 border-black shadow-md' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-martian font-bold text-camry-blackout mb-1.5 uppercase">
                    Description
                  </label>
                  <input 
                    type="text"
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-zinc-50 text-xs text-camry-blackout focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-black/10">
                  <button 
                    type="button"
                    onClick={() => {
                      const target = editingCategory;
                      setEditingCategory(null);
                      setCategoryToDelete(target);
                    }}
                    className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-martian font-semibold flex items-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    <span>Delete Category</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setEditingCategory(null)} 
                      className="px-3.5 py-2 rounded-xl border border-black/10 text-xs font-martian font-medium hover:bg-black/5"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-camry-blackout text-white text-xs font-martian font-bold hover:bg-camry-graphite shadow-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CATEGORY CONFIRMATION & DOCUMENT RE-ASSIGNMENT MODAL */}
      <AnimatePresence>
        {categoryToDelete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black/10 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 font-familjen"
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <Trash2 className="text-red-600" size={18} />
                  <h3 className="font-bricolage font-bold text-base text-camry-blackout">
                    Delete "{categoryToDelete.name}"?
                  </h3>
                </div>
                <button onClick={() => setCategoryToDelete(null)} className="p-1 text-camry-graphite hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-camry-graphite">
                Deleting this category will not delete your documents. Please select where existing documents in <span className="font-bold text-camry-blackout">{categoryToDelete.name}</span> should be moved:
              </p>

              <div>
                <label className="block text-xs font-martian font-bold text-camry-blackout mb-1.5 uppercase">
                  Reassign Documents To:
                </label>
                <select
                  value={reassignCategoryTarget}
                  onChange={(e) => setReassignCategoryTarget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-zinc-50 text-xs font-martian text-camry-blackout focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {categories.filter(c => c.id !== categoryToDelete.id).map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/10">
                <button 
                  onClick={() => setCategoryToDelete(null)} 
                  className="px-3.5 py-2 rounded-xl border border-black/10 text-xs font-martian hover:bg-black/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteCategoryConfirm}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-martian font-bold hover:bg-red-700 shadow-sm"
                >
                  Delete & Reassign Docs
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PENDING UPLOAD CATEGORY SELECTION MODAL */}
      <AnimatePresence>
        {pendingFiles && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black/10 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 font-familjen"
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <Upload className="text-camry-deep-carrier" size={18} />
                  <h3 className="font-bricolage font-bold text-base text-camry-blackout">
                    Assign Category for {pendingFiles.length} {pendingFiles.length === 1 ? 'File' : 'Files'}
                  </h3>
                </div>
                <button onClick={() => setPendingFiles(null)} className="p-1 text-camry-graphite hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-1 bg-zinc-50 p-3 rounded-xl border border-black/10 max-h-36 overflow-y-auto">
                <div className="text-[10px] font-martian font-bold text-camry-graphite uppercase">Files to index:</div>
                {pendingFiles.map((f, idx) => (
                  <div key={idx} className="text-xs font-mono text-camry-blackout truncate flex items-center gap-1.5">
                    <FileText size={12} className="text-camry-deep-carrier" />
                    <span>{f.name}</span>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-martian font-bold text-camry-blackout mb-1.5 uppercase">
                  Select Destination Category
                </label>
                
                {!showInlineCatCreate ? (
                  <div className="space-y-2">
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-zinc-50 text-xs font-martian font-semibold text-camry-blackout focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setShowInlineCatCreate(true)}
                      className="text-xs text-camry-deep-carrier font-martian font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} />
                      <span>Create new category on the fly</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 p-3 bg-camry-carrier/10 rounded-xl border border-camry-carrier/30">
                    <div className="flex items-center justify-between text-xs font-martian font-bold text-camry-blackout">
                      <span>New Category Name</span>
                      <button 
                        type="button" 
                        onClick={() => setShowInlineCatCreate(false)}
                        className="text-[10px] text-gray-500 hover:text-black"
                      >
                        Cancel
                      </button>
                    </div>
                    <input 
                      type="text"
                      autoFocus
                      placeholder="e.g. Avionics, Patient Records..."
                      value={inlineCatName}
                      onChange={(e) => setInlineCatName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-black/15 bg-white text-xs font-familjen text-camry-blackout focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/10">
                <button 
                  onClick={() => setPendingFiles(null)} 
                  className="px-3.5 py-2 rounded-xl border border-black/10 text-xs font-martian hover:bg-black/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmUpload}
                  className="px-5 py-2 rounded-xl bg-camry-blackout text-white text-xs font-martian font-bold hover:bg-camry-graphite shadow-sm flex items-center gap-1.5"
                >
                  <Play size={12} className="fill-white" />
                  <span>Start NPU Ingestion</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
