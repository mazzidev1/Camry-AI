import React, { useState } from 'react';
import { useAppContext, Agent } from '../store/AppContext';
import { Grid, Heart, Scale, FileText, Activity, Landmark, Settings, TrendingUp, Edit3, Globe, Plus, Search, Trash2, Check, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AgentStore: React.FC = () => {
  const { allAgents, installedAgents, installAgent, uninstallAgent, addCustomAgent, setCurrentScreen, setActiveAgent } = useAppContext();
  
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [activeCat, setActiveCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
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

  const filteredAgents = allAgents.filter(a => {
    const cat = getAgentCat(a);
    const matchesCat = activeCat === 'All' || cat === activeCat;
    const matchesSearch = searchQuery === '' || 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
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
      <div className="p-8 pb-4 border-b border-black/5 bg-camry-paper/50 z-10 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Grid className="text-camry-blackout" size={24} />
            <h1 className="text-2xl font-bricolage text-camry-blackout">Agent Store</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-camry-graphite/40" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agents..."
                className="pl-8 pr-3 py-1.5 bg-white border border-black/10 rounded-lg text-xs font-familjen focus:outline-none focus:border-camry-deep-carrier w-48"
              />
            </div>

            {/* Create Custom Agent Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-camry-blackout text-white rounded-lg text-xs font-medium hover:bg-camry-graphite transition-all shadow-sm"
            >
              <Plus size={14} />
              <span>Build Agent</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          {['All', 'Legal', 'Medical', 'Government', 'Industrial', 'Finance', 'Other'].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCat === cat ? 'bg-camry-blackout text-white border-transparent' : 'bg-white border-black/10 text-camry-graphite hover:bg-camry-graphite/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 pt-6">
        
        {/* Featured Banners */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-camry-graphite text-white rounded-2xl p-6 relative overflow-hidden flex flex-col justify-end min-h-[150px] shadow-lg">
            <div className="absolute top-4 right-4 px-2 py-1 bg-camry-blackout rounded text-[10px] font-martian tracking-wider text-white/70">INTELLIGENCE, ON-PREMISE.</div>
            <h2 className="text-xl font-bricolage mb-2 relative z-10">The legal team's<br/>private AI.</h2>
            <div className="w-12 h-1 bg-camry-carrier rounded-full"></div>
          </div>
          <div className="bg-camry-blackout text-white rounded-2xl p-6 relative overflow-hidden flex flex-col justify-end min-h-[150px] shadow-lg">
             <div className="absolute top-4 right-4 px-2 py-1 bg-white/10 rounded text-[10px] font-martian tracking-wider text-white/70">INTELLIGENCE, ON-PREMISE.</div>
            <h2 className="text-xl font-bricolage mb-2 relative z-10">Patient data that<br/>never leaves the building.</h2>
            <div className="w-12 h-1 bg-camry-carrier rounded-full"></div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-6 pb-8">
          {filteredAgents.map(agent => {
            const isInstalled = installedAgents.includes(agent.id);
            const isDownloading = downloading === agent.id;

            return (
              <div key={agent.id} className="bg-white rounded-xl p-5 border border-black/5 shadow-sm hover:shadow-md transition-all flex flex-col h-full group relative">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-xl bg-camry-graphite/5 flex items-center justify-center transition-colors group-hover:bg-camry-carrier/10">
                    {agent.id === 'legal' && <Scale size={24} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                    {agent.id === 'contract' && <FileText size={24} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                    {agent.id === 'medical' && <Activity size={24} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                    {agent.id === 'gov' && <Landmark size={24} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                    {agent.id === 'industrial' && <Settings size={24} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                    {agent.id === 'finance' && <TrendingUp size={24} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                    {agent.id === 'meeting' && <Edit3 size={24} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                    {agent.id === 'translator' && <Globe size={24} className="text-camry-graphite/70 group-hover:text-camry-carrier transition-colors" />}
                    {agent.id.startsWith('custom-') && <Bot size={24} className="text-camry-deep-carrier" />}
                  </div>

                  {isInstalled && (
                    <span className="inline-flex items-center gap-1 font-martian text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      <Check size={12} /> INSTALLED
                    </span>
                  )}
                </div>
                
                <h3 className="font-bricolage text-lg text-camry-blackout mb-1">{agent.name}</h3>
                <p className="font-familjen text-sm text-camry-graphite/70 flex-1 leading-relaxed mb-4">{agent.description}</p>
                
                <div className="mt-auto pt-3 border-t border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-camry-graphite/40 font-martian text-xs">
                    <Heart size={14} /> {agent.likes}
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
                  <select 
                    value={newAgentCat}
                    onChange={(e) => setNewAgentCat(e.target.value)}
                    className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm font-familjen focus:outline-none focus:border-camry-deep-carrier bg-camry-graphite/5"
                  >
                    <option value="Legal">Legal</option>
                    <option value="Medical">Medical</option>
                    <option value="Government">Government</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Finance">Finance</option>
                    <option value="Other">Other</option>
                  </select>
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
    </div>
  );
};

