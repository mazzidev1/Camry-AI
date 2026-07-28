import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Screen = 'onboarding' | 'chat' | 'knowledgeBase' | 'library' | 'team' | 'modelStore' | 'agentStore' | 'dashboard' | 'settings';

export type UserRole = 'Admin' | 'Manager' | 'Member' | 'Guest';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
  isSystem?: boolean;
}

export interface KBDocument {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'PPTX' | 'IMG' | 'CSV' | 'TXT' | 'XLSX';
  category: string;
  size: string;
  uploadedBy: string;
  date: string;
  status: 'INDEXED' | 'PROCESSING' | 'QUEUED';
  progress?: number;
  restrictedRoles?: UserRole[];
  extractedSnippet?: string;
  pages?: number;
}

export interface LibraryItem {
  id: string;
  title: string;
  type: 'Drafts' | 'Summaries' | 'Analyses' | 'Transcripts' | 'Images';
  category: string;
  snippet: string;
  content: string;
  author: string;
  modelUsed: string;
  agentName?: string;
  date: string;
  restrictedRoles?: UserRole[];
  imageUrl?: string;
}

export interface TeamCapabilities {
  canChat: boolean;
  canUploadKB: boolean;
  canInstallAgents: boolean;
  canViewLibrary: boolean;
  canManageModels: boolean;
  canInviteOthers: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: 'ACTIVE' | 'INVITED — PENDING';
  lastActive: string;
  allowedCategories: string[];
  capabilities: TeamCapabilities;
}

export interface GeneratedDocument {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt: string;
  messageId?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model: string;
  document?: GeneratedDocument;
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

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Client Files', color: '#1D4ED8', icon: 'FolderGit2', description: 'Active and archived client matter files & correspondence' },
  { id: 'cat-2', name: 'Contracts', color: '#10B981', icon: 'FileText', description: 'Master service agreements, vendor SLAs & NDAs' },
  { id: 'cat-3', name: 'Case Law', color: '#8B5CF6', icon: 'Scale', description: 'Judicial precedents, statutory filings & legal research' },
  { id: 'cat-4', name: 'Internal Policies', color: '#06B6D4', icon: 'Shield', description: 'Corporate governance, compliance & ethics handbooks' },
  { id: 'cat-5', name: 'HR', color: '#F59E0B', icon: 'Users', description: 'Employment policies, staff records & onboarding guides' },
  { id: 'cat-6', name: 'Finance', color: '#EF4444', icon: 'Landmark', description: 'Audited ledgers, capital budgets & expenditure decks' },
  { id: 'cat-7', name: 'Uncategorized', color: '#64748B', icon: 'Layers', description: 'General uncategorized documents', isSystem: true },
];

export const DEFAULT_ROLE_CATEGORIES: Record<UserRole, string[]> = {
  Admin: ['Client Files', 'Contracts', 'Case Law', 'Internal Policies', 'HR', 'Finance', 'Uncategorized'],
  Manager: ['Client Files', 'Contracts', 'Case Law', 'Internal Policies', 'HR', 'Finance', 'Uncategorized'],
  Member: ['Client Files', 'Contracts', 'Case Law', 'Internal Policies', 'HR', 'Uncategorized'],
  Guest: ['Contracts', 'Client Files'],
};

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

  activeDocument: GeneratedDocument | null;
  setActiveDocument: (doc: GeneratedDocument | null) => void;
  sessionDocuments: GeneratedDocument[];
  addDocument: (doc: GeneratedDocument) => void;
  
  settingsView: 'main' | 'api_key' | 'console' | 'device_info' | 'storage' | 'wifi' | 'update' | 'privacy' | 'team';
  setSettingsView: (view: 'main' | 'api_key' | 'console' | 'device_info' | 'storage' | 'wifi' | 'update' | 'privacy' | 'team') => void;
  
  // Dynamic Category / Collections Management
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string, reassignToCategoryName?: string) => void;
  roleCategoryPermissions: Record<UserRole, string[]>;
  toggleRoleCategoryPermission: (role: UserRole, categoryName: string) => void;

  // Knowledge Base State
  kbDocuments: KBDocument[];
  addKBDocument: (doc: Omit<KBDocument, 'id' | 'date'>) => string;
  updateKBDocumentStatus: (id: string, status: 'INDEXED' | 'PROCESSING' | 'QUEUED', progress?: number) => void;
  deleteKBDocument: (id: string) => void;
  updateKBDocumentAccess: (id: string, restrictedRoles: UserRole[]) => void;

  // Library State
  libraryItems: LibraryItem[];
  addLibraryItem: (item: Omit<LibraryItem, 'id' | 'date'>) => void;
  deleteLibraryItem: (id: string) => void;

  // Team State
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'status' | 'lastActive'>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  // Demo Role Simulation
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Pending Chat Prompt
  pendingChatPrompt: string | null;
  setPendingChatPrompt: (prompt: string | null) => void;

  toastData: ToastData | null;
  toastMessage: string | null;
  showToast: (msg: string, type?: ToastType, title?: string) => void;
  
  batteryLevel: number;
  isCharging: boolean;
  
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  
  exportConfig: () => void;
  importConfig: (jsonData: string) => boolean;

  // Guided Tour State
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  tourStep: number;
  setTourStep: (step: number) => void;
  startTour: () => void;
  closeTour: () => void;

  // Theme Mode State (Dark Surface vs Daylight)
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
  toggleThemeMode: () => void;
}

const INITIAL_SAMPLE_DOC: GeneratedDocument = {
  id: 'doc-1',
  title: 'Camry app design prompt',
  type: 'MD',
  createdAt: 'Just now',
  messageId: 'msg-2',
  content: `# CAMRY DESKTOP APP — CLICKABLE PROTOTYPE BUILD PROMPT

**For Claude Design · Produces a high-fidelity, clickable desktop-app prototype**

---

### 0. WHAT YOU ARE BUILDING
Build a **clickable desktop-application prototype** for **Camry** — the desktop client (macOS/Windows) that a business installs on their computers to talk to the Camry AI appliance: a headless on-premise AI box sitting on the office network. The box has **no screen of its own**; this app is the entire interface to it.

The app is a **local client for a networked device**. It talks to the box over the local network via an OpenAI-compatible API at a local IP. Every "device" control in the app (Wi-Fi, storage, power, updates) is the app reaching into the box and controlling it remotely. Keep this mental model visible in the design: the user always feels they are operating *their own machine in the building*, not a cloud service.

Deliver a **single-window desktop app** rendered inside a realistic desktop-OS chrome (rounded window, traffic-light controls top-left), with a **persistent left navigation rail** and a **main content area** that swaps between screens. All navigation and key interactions must actually work (clickable, with state changes, hovers, popovers, modals, and toggles). Use in-memory state only — no backend, no localStorage.

Build **six primary screens** plus their sub-states:
1. Onboarding / device pairing (first-run)
2. Chat (home) + Switch-Model popover
3. Model Store
4. Agent Store
5. Dashboard
6. Settings (incl. API key sub-screen)

---

### 1. BRAND SYSTEM (APPLY THROUGHOUT — THIS IS NON-NEGOTIABLE)
Camry's identity is disciplined, engineering-serious, quiet. The opposite of playful. Think "precision instrument," not "consumer gadget."

**Colors:**
- Backgrounds: Warm Paper \`#EDEBE4\` and Dark Graphite \`#121418\`
- Accent: Carrier Blue \`#1D4ED8\`
`
};

const INITIAL_SAMPLE_CHAT: Message[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'answer this question "In 3-4 sentences, describe your business idea, the problem space and the market potential. What made you pick this idea?"',
    model: 'gpt-oss-120b',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: "Here's a version that fits the 3-4 sentence limit while hitting all four asks (idea, problem, market, why you):\n\nCamry builds on-premise AI appliances for African businesses — a device you plug into your office network that gives your whole team private AI, paid for once, with no subscriptions and no data ever leaving the building. The problem is that African enterprises are being pushed to cloud AI that is expensive, laggy, and risky for sensitive client data.",
    model: 'gpt-oss-120b',
    document: INITIAL_SAMPLE_DOC
  }
];

export const INITIAL_KB_DOCUMENTS: KBDocument[] = [
  {
    id: 'kb-1',
    name: 'Company Handbook.pdf',
    type: 'PDF',
    category: 'Internal Policies',
    size: '4.2 MB',
    uploadedBy: 'Amford',
    date: '12 JUN 2026',
    status: 'INDEXED',
    pages: 42,
    extractedSnippet: 'Camry Inc Employee Guide 2026: Working hours, remote conduct, hardware usage policies, and code of ethics.'
  },
  {
    id: 'kb-2',
    name: 'Employment Policy 2026.docx',
    type: 'DOCX',
    category: 'HR',
    size: '1.8 MB',
    uploadedBy: 'Sarah',
    date: '18 JUL 2026',
    status: 'INDEXED',
    pages: 18,
    extractedSnippet: 'Leave Entitlements: All full-time employees receive 25 business days annual leave plus statutory holidays.'
  },
  {
    id: 'kb-3',
    name: 'Client Master Agreement.pdf',
    type: 'PDF',
    category: 'Contracts',
    size: '8.5 MB',
    uploadedBy: 'Francis',
    date: '20 JUL 2026',
    status: 'INDEXED',
    pages: 64,
    extractedSnippet: 'Master Services Terms: On-premise deployment specifications, hardware maintenance SLAs, and liability capping.'
  },
  {
    id: 'kb-4',
    name: 'Q1 Board Deck.pptx',
    type: 'PPTX',
    category: 'Finance',
    size: '14.1 MB',
    uploadedBy: 'Amford',
    date: '27 JUL 2026',
    status: 'PROCESSING',
    progress: 62,
    pages: 35,
    restrictedRoles: ['Member', 'Guest'],
    extractedSnippet: 'Q1 Financial performance overview, balance sheet, and local NPU deployment expenditure.'
  },
  {
    id: 'kb-5',
    name: 'Office Floor Plan.png',
    type: 'IMG',
    category: 'Client Files',
    size: '3.6 MB',
    uploadedBy: 'Sarah',
    date: '02 MAY 2026',
    status: 'INDEXED',
    pages: 1,
    extractedSnippet: 'Server room physical security layout, badge access zones, and Camry hardware enclosure rack location.'
  },
  {
    id: 'kb-6',
    name: 'Refund Policy.docx',
    type: 'DOCX',
    category: 'Internal Policies',
    size: '0.9 MB',
    uploadedBy: 'David',
    date: '14 FEB 2026',
    status: 'INDEXED',
    pages: 6,
    extractedSnippet: 'Hardware Warranty & Refund Terms: 30-day money-back guarantee for initial appliance testing.'
  },
  {
    id: 'kb-7',
    name: 'Founding Certificate.pdf',
    type: 'PDF',
    category: 'Case Law',
    size: '1.2 MB',
    uploadedBy: 'Amford',
    date: '10 JAN 2026',
    status: 'INDEXED',
    pages: 4,
    extractedSnippet: 'Incorporation & founding documents: Established October 2024 to provide private on-premise AI hardware.'
  },
  {
    id: 'kb-8',
    name: 'Q2 Financial Audit & Ledger.xlsx',
    type: 'XLSX',
    category: 'Finance',
    size: '12.4 MB',
    uploadedBy: 'David',
    date: '22 JUL 2026',
    status: 'INDEXED',
    pages: 120,
    restrictedRoles: ['Member', 'Guest'],
    extractedSnippet: 'Audited financial reconciliation statements, operational ledger entries, and capital reserves.'
  },
  {
    id: 'kb-9',
    name: 'Product Roadmap 2027.pptx',
    type: 'PPTX',
    category: 'Client Files',
    size: '6.8 MB',
    uploadedBy: 'Francis',
    date: '15 JUL 2026',
    status: 'INDEXED',
    pages: 28,
    extractedSnippet: 'Next-gen NPU acceleration hardware specifications, agent marketplace evolution, and multi-node clusters.'
  },
  {
    id: 'kb-10',
    name: 'Vendor Security Evaluation.pdf',
    type: 'PDF',
    category: 'Contracts',
    size: '2.1 MB',
    uploadedBy: 'Guest Auditor',
    date: '27 JUL 2026',
    status: 'QUEUED',
    pages: 14,
    extractedSnippet: 'Third-party hardware security audit report confirming zero external data leakage or internet requirement.'
  }
];

export const INITIAL_LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: 'lib-1',
    title: 'Contract Risk Analysis — Acme MSA',
    type: 'Analyses',
    category: 'Contracts',
    snippet: 'Key risks identified in Section 8 (Indemnity limits capped at $50k) and Section 14 (Governing law in foreign jurisdiction). Recommend standard redline terms.',
    content: `# Contract Risk Analysis — Acme MSA\n\n### Summary\nThe Acme Master Services Agreement contains two high-priority risk clauses that require legal redlining before executive signature.\n\n### Key Risk Observations\n1. **Section 8 (Indemnification Cap)**: Liability is currently capped at $50,000, which does not adequately protect against potential hardware outage losses.\n2. **Section 14 (Jurisdiction)**: Governed by external arbitration rules. Recommend changing to local commercial court.\n3. **Data Security**: Compliant with on-premise execution rules. Zero external API calls detected.\n\n### Recommended Action\nReplace Clause 8.2 with Camry standard indemnification wording.`,
    author: 'Amford',
    modelUsed: 'gpt-oss-120b',
    agentName: 'Legal Assistant',
    date: '12 MAR 2026'
  },
  {
    id: 'lib-2',
    title: 'Client Pitch Email Draft',
    type: 'Drafts',
    category: 'Client Files',
    snippet: 'Dear Client, Following our discussion on on-premise AI security, Camry ONE operates completely offline inside your firewall...',
    content: `Subject: Private On-Premise AI for Your Enterprise — Camry ONE\n\nDear Client,\n\nFollowing our recent discussion on data privacy and AI adoption, I am sharing details on **Camry ONE**.\n\nUnlike cloud AI providers that process your corporate data on external servers, Camry ONE is a dedicated hardware appliance that sits directly inside your office server room.\n\nKey Highlights:\n- **100% On-Premise**: Your contracts, financial ledgers, and patient records never touch the public internet.\n- **Flat-Rate Hardware**: Pay once for the appliance with zero monthly token fees.\n- **Local NPU Acceleration**: Instant responses with sub-15ms local latency.\n\nLet us know when you would like a live hardware demonstration in your office.\n\nBest regards,\nSarah Jenkins`,
    author: 'Sarah',
    modelUsed: 'Qwen3-30B-Instruct-2507',
    agentName: 'General Assistant',
    date: '18 APR 2026'
  },
  {
    id: 'lib-3',
    title: 'Q2 Executive Board Meeting Summary',
    type: 'Summaries',
    category: 'Finance',
    snippet: 'Decisions: 1. Approved $1.2M VRAM expansion. 2. Finalized Q3 hiring plan. 3. Approved local audit protocol.',
    content: `# Q2 Executive Board Meeting Summary\n\n**Date:** July 22, 2026\n**Attendees:** Amford, Francis, Sarah, David\n\n### Key Decisions\n1. **Capital Allocation**: Approved $1.2M budget for additional Camry NPU cluster expansion.\n2. **Q3 Recruitment**: Approved hiring 4 senior hardware engineers and 2 compliance leads.\n3. **Data Governance**: Formally adopted zero-cloud policy across all regional offices.\n\n### Action Items\n- [ ] Amford: Finalize hardware supplier procurement.\n- [ ] Sarah: Publish updated Onboarding Guide in Knowledge Base.`,
    author: 'Amford',
    modelUsed: 'gpt-oss-120b',
    agentName: 'Meeting Notetaker',
    date: '22 JUL 2026',
    restrictedRoles: ['Member', 'Guest']
  },
  {
    id: 'lib-4',
    title: 'French Commercial Agreement Translation',
    type: 'Transcripts',
    category: 'Contracts',
    snippet: 'Accord de Niveau de Service Commercial : Les parties conviennent par la présente de maintenir un temps de fonctionnement de 99.9%...',
    content: `# Accord de Niveau de Service Commercial (SLA)\n\n**parties :** Camry Hardware Systems & Client Enterprise\n**Statut :** Traduction certifiée sur NPU local\n\n### Clause 1. Service et Disponibilité\nLes parties conviennent par la présente de maintenir un temps de fonctionnement minimal de 99,9% pour l'équipement d'intelligence artificielle sur site.\n\n### Clause 2. Confidentialité des Données\nToutes les opérations d'inférence doivent demeurer au sein du réseau local de l'entreprise sans transmission externe.`,
    author: 'Francis',
    modelUsed: 'Qwen3-Coder-30B',
    agentName: 'Translator (Local)',
    date: '04 JUN 2026'
  },
  {
    id: 'lib-5',
    title: 'Suspicious Transaction Fraud Pattern Report',
    type: 'Analyses',
    category: 'Finance',
    snippet: 'Anomaly detected in ledgerbatch_409: 14 structured wires under $10,000 threshold within 48 hours. Recommend compliance review.',
    content: `# Suspicious Transaction Fraud Pattern Report\n\n**Batch:** ledgerbatch_409\n**Model:** gpt-oss-120b (Finance Agent)\n\n### Findings\nDuring automated local ledger audit, 14 structured wire transfers totaling $134,200 were identified within a 48-hour window. Each individual wire was set at $9,800 to avoid standard reporting triggers.\n\n### Compliance Recommendation\nFlag account ACCT-8839 for manual review by the Internal Audit Committee.`,
    author: 'David',
    modelUsed: 'gpt-oss-120b',
    agentName: 'Finance Analyst',
    date: '15 JUL 2026',
    restrictedRoles: ['Member', 'Guest']
  },
  {
    id: 'lib-6',
    title: 'Hardware Architecture Diagram Render',
    type: 'Images',
    category: 'Client Files',
    snippet: 'Conceptual rendering of Camry NPU dual-die module layout with active cooling fins and local NVMe caching array.',
    content: 'Conceptual high-performance rendering of Camry NPU hardware topology generated on local image model.',
    author: 'Francis',
    modelUsed: 'Z-Image-Turbo',
    agentName: 'Image Creator',
    date: '10 MAY 2026',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'lib-7',
    title: 'New Employee Onboarding FAQ Guide',
    type: 'Drafts',
    category: 'HR',
    snippet: 'Welcome to Camry! Your hardware box is pre-loaded with company policies. Here is how to query the Knowledge Base on Day 1...',
    content: `# New Employee Onboarding FAQ\n\nWelcome to the team! All company policies, benefits, and handbooks are indexed locally on your Camry box.\n\n### FAQ\n**Q: How do I ask Camry about company policies?**\nA: Open the Chat interface and ask natural questions. Camry reads directly from the Knowledge Base.\n\n**Q: Is my chat private?**\nA: Yes. All inference runs locally on the Camry NPU in your building. No data ever leaves the hardware.`,
    author: 'Sarah',
    modelUsed: 'gpt-oss-120b',
    agentName: 'HR Copilot',
    date: '01 JUL 2026'
  },
  {
    id: 'lib-8',
    title: 'Vendor SLA Redline & Indemnity Review',
    type: 'Analyses',
    category: 'Contracts',
    snippet: 'Redline recommendation: Clause 4.2 mutual indemnification must require 30-day cure period for intellectual property disputes.',
    content: `# Vendor SLA Redline & Indemnity Review\n\n**Agreement:** TechServices Master Vendor Contract\n**Agent:** Contract Reviewer\n\n### Redline Clause 4.2\n*Original:* "Vendor shall indemnify Customer against all claims immediately upon notice."\n*Revised:* "Vendor shall indemnify Customer against third-party IP infringement claims, provided Vendor receives written notice within 30 days and sole control of defense."`,
    author: 'Amford',
    modelUsed: 'gpt-oss-120b',
    agentName: 'Contract Reviewer',
    date: '19 JUN 2026'
  },
  {
    id: 'lib-9',
    title: 'Product Technical Specs Summary',
    type: 'Summaries',
    category: 'Case Law',
    snippet: 'Camry ONE Specs: Dual NPU array, 256GB unified RAM, 2TB PCIe 5.0 local storage, zero external telemetry ports.',
    content: `# Camry ONE Appliance Specifications\n\n- **Compute:** Dual Custom NPU Accelerators (480 TOPS FP16)\n- **Memory:** 256 GB LPDDR5 Unified System RAM\n- **Storage:** 2 TB NVMe PCIe 5.0 Encrypted Local Flash\n- **Networking:** Dual 10GbE RJ45 Local LAN Ports (Air-gapped capable)\n- **Security:** Hardware TPM 2.0, AES-256 Flash Encryption`,
    author: 'Francis',
    modelUsed: 'Qwen3-Coder-30B',
    agentName: 'Industrial Copilot',
    date: '28 JUN 2026'
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Amford',
    email: 'amford@company.com',
    role: 'Admin',
    status: 'ACTIVE',
    lastActive: '2 MIN AGO',
    allowedCategories: ['Policies', 'Contracts', 'HR', 'Finance', 'Product'],
    capabilities: {
      canChat: true,
      canUploadKB: true,
      canInstallAgents: true,
      canViewLibrary: true,
      canManageModels: true,
      canInviteOthers: true
    }
  },
  {
    id: 'tm-2',
    name: 'Francis',
    email: 'francis@company.com',
    role: 'Admin',
    status: 'ACTIVE',
    lastActive: '15 MIN AGO',
    allowedCategories: ['Policies', 'Contracts', 'HR', 'Finance', 'Product'],
    capabilities: {
      canChat: true,
      canUploadKB: true,
      canInstallAgents: true,
      canViewLibrary: true,
      canManageModels: true,
      canInviteOthers: true
    }
  },
  {
    id: 'tm-3',
    name: 'Sarah',
    email: 'sarah@company.com',
    role: 'Manager',
    status: 'ACTIVE',
    lastActive: '1 HR AGO',
    allowedCategories: ['Policies', 'Contracts', 'HR', 'Finance', 'Product'],
    capabilities: {
      canChat: true,
      canUploadKB: true,
      canInstallAgents: true,
      canViewLibrary: true,
      canManageModels: true,
      canInviteOthers: false
    }
  },
  {
    id: 'tm-4',
    name: 'David',
    email: 'david@company.com',
    role: 'Member',
    status: 'ACTIVE',
    lastActive: '3 HRS AGO',
    allowedCategories: ['Policies', 'Contracts', 'HR', 'Product'],
    capabilities: {
      canChat: true,
      canUploadKB: true,
      canInstallAgents: false,
      canViewLibrary: true,
      canManageModels: false,
      canInviteOthers: false
    }
  },
  {
    id: 'tm-5',
    name: 'Guest Auditor',
    email: 'auditor@kpmg-external.com',
    role: 'Guest',
    status: 'ACTIVE',
    lastActive: 'YESTERDAY',
    allowedCategories: ['Contracts'],
    capabilities: {
      canChat: true,
      canUploadKB: false,
      canInstallAgents: false,
      canViewLibrary: true,
      canManageModels: false,
      canInviteOthers: false
    }
  },
  {
    id: 'tm-6',
    name: 'Elena Vance',
    email: 'elena@company.com',
    role: 'Member',
    status: 'INVITED — PENDING',
    lastActive: 'NEVER',
    allowedCategories: ['Policies', 'Contracts', 'HR', 'Product'],
    capabilities: {
      canChat: true,
      canUploadKB: true,
      canInstallAgents: false,
      canViewLibrary: true,
      canManageModels: false,
      canInviteOthers: false
    }
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  
  const [installedModels, setInstalledModels] = useState<string[]>(['gpt-oss-120b']);
  const [loadedModel, setLoadedModel] = useState<string>('gpt-oss-120b');
  
  const [agentsList, setAgentsList] = useState<Agent[]>(INITIAL_AGENTS);
  const [installedAgents, setInstalledAgents] = useState<string[]>(['meeting', 'legal']);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  // Knowledge Base, Library, Team, Categories & Role state
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [roleCategoryPermissions, setRoleCategoryPermissions] = useState<Record<UserRole, string[]>>(DEFAULT_ROLE_CATEGORIES);
  const [kbDocuments, setKbDocuments] = useState<KBDocument[]>(INITIAL_KB_DOCUMENTS);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(INITIAL_LIBRARY_ITEMS);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [currentRole, setCurrentRole] = useState<UserRole>('Admin');
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(null);

  const addCategory = (catData: Omit<Category, 'id'>): Category => {
    const newId = `cat-${Date.now()}`;
    const newCategory: Category = {
      ...catData,
      id: newId,
      color: catData.color || '#1D4ED8'
    };
    setCategories(prev => [...prev, newCategory]);

    // Automatically add newly created category to Admin, Manager, and Member role permissions
    setRoleCategoryPermissions(prev => ({
      ...prev,
      Admin: Array.from(new Set([...(prev.Admin || []), newCategory.name])),
      Manager: Array.from(new Set([...(prev.Manager || []), newCategory.name])),
      Member: Array.from(new Set([...(prev.Member || []), newCategory.name])),
    }));

    // Update allowedCategories for team members
    setTeamMembers(prev => prev.map(m => {
      if (m.role === 'Admin' || m.role === 'Manager' || m.role === 'Member') {
        if (!m.allowedCategories.includes(newCategory.name)) {
          return { ...m, allowedCategories: [...m.allowedCategories, newCategory.name] };
        }
      }
      return m;
    }));

    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const oldCat = categories.find(c => c.id === id);
    if (!oldCat) return;

    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

    if (updates.name && updates.name !== oldCat.name) {
      const oldName = oldCat.name;
      const newName = updates.name;

      setKbDocuments(prev => prev.map(d => d.category === oldName ? { ...d, category: newName } : d));
      setLibraryItems(prev => prev.map(i => i.category === oldName ? { ...i, category: newName } : i));
      setTeamMembers(prev => prev.map(m => ({
        ...m,
        allowedCategories: m.allowedCategories.map(c => c === oldName ? newName : c)
      })));
      setRoleCategoryPermissions(prev => {
        const updated: Record<UserRole, string[]> = { ...prev };
        (Object.keys(updated) as UserRole[]).forEach(role => {
          updated[role] = (updated[role] || []).map(c => c === oldName ? newName : c);
        });
        return updated;
      });
    }
  };

  const deleteCategory = (id: string, reassignToCategoryName: string = 'Uncategorized') => {
    const catToDelete = categories.find(c => c.id === id);
    if (!catToDelete || catToDelete.isSystem) return;

    const nameToDelete = catToDelete.name;

    setCategories(prev => prev.filter(c => c.id !== id));
    setKbDocuments(prev => prev.map(d => d.category === nameToDelete ? { ...d, category: reassignToCategoryName } : d));
    setLibraryItems(prev => prev.map(i => i.category === nameToDelete ? { ...i, category: reassignToCategoryName } : i));
    setTeamMembers(prev => prev.map(m => ({
      ...m,
      allowedCategories: m.allowedCategories.filter(c => c !== nameToDelete)
    })));
    setRoleCategoryPermissions(prev => {
      const updated: Record<UserRole, string[]> = { ...prev };
      (Object.keys(updated) as UserRole[]).forEach(role => {
        updated[role] = (updated[role] || []).filter(c => c !== nameToDelete);
      });
      return updated;
    });
  };

  const toggleRoleCategoryPermission = (role: UserRole, categoryName: string) => {
    setRoleCategoryPermissions(prev => {
      const currentList = prev[role] || [];
      const exists = currentList.includes(categoryName);
      const updatedList = exists 
        ? currentList.filter(c => c !== categoryName)
        : [...currentList, categoryName];
      return {
        ...prev,
        [role]: updatedList
      };
    });
  };

  const addKBDocument = (docData: Omit<KBDocument, 'id' | 'date'>) => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    const id = `kb-${Date.now()}`;
    const newDoc: KBDocument = {
      ...docData,
      id,
      date: dateStr
    };
    setKbDocuments(prev => [newDoc, ...prev]);
    return id;
  };

  const updateKBDocumentStatus = (id: string, status: 'INDEXED' | 'PROCESSING' | 'QUEUED', progress?: number) => {
    setKbDocuments(prev => prev.map(d => d.id === id ? { ...d, status, progress: progress !== undefined ? progress : d.progress } : d));
  };

  const deleteKBDocument = (id: string) => {
    setKbDocuments(prev => prev.filter(d => d.id !== id));
  };

  const updateKBDocumentAccess = (id: string, restrictedRoles: UserRole[]) => {
    setKbDocuments(prev => prev.map(d => d.id === id ? { ...d, restrictedRoles } : d));
  };

  const addLibraryItem = (itemData: Omit<LibraryItem, 'id' | 'date'>) => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    const newItem: LibraryItem = {
      ...itemData,
      id: `lib-${Date.now()}`,
      date: dateStr
    };
    setLibraryItems(prev => [newItem, ...prev]);
  };

  const deleteLibraryItem = (id: string) => {
    setLibraryItems(prev => prev.filter(i => i.id !== id));
  };

  const addTeamMember = (memberData: Omit<TeamMember, 'id' | 'status' | 'lastActive'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `tm-${Date.now()}`,
      status: 'INVITED — PENDING',
      lastActive: 'NEVER'
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const reorderAgents = (newAgents: Agent[]) => {
    setAgentsList(newAgents);
    showToast(`Agent priority order updated`);
  };
  
  const [chatHistory, setChatHistory] = useState<Message[]>(INITIAL_SAMPLE_CHAT);
  const [sessionDocuments, setSessionDocuments] = useState<GeneratedDocument[]>([INITIAL_SAMPLE_DOC]);
  const [activeDocument, setActiveDocument] = useState<GeneratedDocument | null>(null);

  const addDocument = (doc: GeneratedDocument) => {
    setSessionDocuments(prev => [doc, ...prev.filter(d => d.id !== doc.id)]);
  };
  const [settingsView, setSettingsView] = useState<'main' | 'api_key' | 'console' | 'device_info' | 'storage' | 'wifi' | 'update' | 'privacy' | 'team'>('main');
  
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number>(88);
  const [isCharging, setIsCharging] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Tour State
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(1);

  // Theme Mode State
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  const toggleThemeMode = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Synchronize HTML classes with themeMode
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [themeMode]);

  const startTour = () => {
    setTourStep(1);
    setIsTourOpen(true);
  };

  const closeTour = () => {
    setIsTourOpen(false);
  };
  
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
      activeDocument,
      setActiveDocument,
      sessionDocuments,
      addDocument,
      settingsView,
      setSettingsView,
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      roleCategoryPermissions,
      toggleRoleCategoryPermission,
      kbDocuments,
      addKBDocument,
      updateKBDocumentStatus,
      deleteKBDocument,
      updateKBDocumentAccess,
      libraryItems,
      addLibraryItem,
      deleteLibraryItem,
      teamMembers,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      currentRole,
      setCurrentRole,
      pendingChatPrompt,
      setPendingChatPrompt,
      toastData,
      toastMessage: toastData ? toastData.message : null,
      showToast,
      batteryLevel,
      isCharging,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      exportConfig,
      importConfig,
      isTourOpen,
      setIsTourOpen,
      tourStep,
      setTourStep,
      startTour,
      closeTour,
      themeMode,
      setThemeMode,
      toggleThemeMode
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
