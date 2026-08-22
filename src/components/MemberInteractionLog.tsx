import React, { useState } from 'react';
import { useAppContext, AgentInteraction } from '../store/AppContext';
import { Users, MessageSquare, ChevronRight, Copy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MemberInteractionLog: React.FC<{ agentId: string; agentName: string; compact?: boolean }> = ({ agentId, agentName, compact = false }) => {
  const { getAgentInteractions, themeMode, showToast, setActiveAgent, setCurrentScreen } = useAppContext();
  const interactions = getAgentInteractions(agentId);
  const [isLogListModalOpen, setIsLogListModalOpen] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<AgentInteraction | null>(null);
  const isLight = themeMode === 'light';

  return (
    <div className="mt-2">
      {/* Trigger Button on Agent Card */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsLogListModalOpen(true);
        }}
        className={`w-full py-2 px-3 rounded-[8px] border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
          isLight
            ? 'bg-zinc-50 border-black/10 hover:border-[#0EA5E9] hover:bg-sky-50 text-zinc-700'
            : 'bg-[#18181C] border-white/10 hover:border-[#0EA5E9] hover:bg-sky-950/30 text-zinc-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <Users size={14} className="text-[#0EA5E9]" />
          <span>Interacting Team Members ({interactions.length})</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#0EA5E9]">
          <span>View Logs</span>
          <ChevronRight size={13} />
        </div>
      </button>

      {/* ALL INTERACTING TEAM MEMBERS LIST MODAL */}
      <AnimatePresence>
        {isLogListModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={(e) => {
              e.stopPropagation();
              setIsLogListModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-xl rounded-[14px] border p-6 space-y-4 shadow-2xl flex flex-col max-h-[85vh] ${
                isLight ? 'bg-white border-black/10 text-black' : 'bg-[#1A1A20] border-white/10 text-white'
              }`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between pb-3 border-b shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-[8px] bg-sky-500/10 text-[#0EA5E9]">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base font-sans">Interacting Team Members</h3>
                    <p className={`text-xs font-sans ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      Logged interactions for agent <strong className={isLight ? 'text-black' : 'text-white'}>{agentName}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLogListModalOpen(false)}
                  className={`p-1.5 rounded-[6px] cursor-pointer text-zinc-400 transition-colors ${
                    isLight ? 'hover:bg-black/5 hover:text-black' : 'hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Members List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                {interactions.length === 0 ? (
                  <div className={`p-6 text-xs italic rounded-[8px] border border-dashed text-center font-sans ${
                    isLight ? 'border-black/10 text-zinc-400' : 'border-white/10 text-zinc-400'
                  }`}>
                    No team member interactions logged for this agent yet.
                  </div>
                ) : (
                  interactions.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => setSelectedInteraction(log)}
                      className={`p-3 rounded-[10px] border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                        isLight 
                          ? 'bg-zinc-50 border-black/10 hover:border-[#0EA5E9] hover:bg-sky-50/50' 
                          : 'bg-[#18181C] border-white/10 hover:border-[#0EA5E9] hover:bg-[#202026]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={log.memberAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'}
                          alt={log.memberName}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-black/10"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold truncate font-sans ${isLight ? 'text-zinc-950' : 'text-white'}`}>{log.memberName}</span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[6px] font-semibold ${
                              isLight ? 'bg-black/5 text-zinc-700' : 'bg-white/10 text-zinc-300'
                            }`}>
                              {log.memberRole}
                            </span>
                          </div>
                          <p className={`text-[11px] truncate mt-0.5 font-sans ${
                            isLight ? 'text-zinc-600' : 'text-zinc-300'
                          }`}>
                            {log.summary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] font-mono font-semibold text-[#0EA5E9]">
                            {log.messageCount} msgs
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            {log.lastActive}
                          </div>
                        </div>
                        <div className={`p-1 rounded-[6px] transition-colors ${
                          isLight ? 'bg-black/5 text-zinc-500 group-hover:bg-[#0EA5E9] group-hover:text-white' : 'bg-white/10 text-zinc-400 group-hover:bg-[#0EA5E9] group-hover:text-white'
                        }`}>
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHAT HISTORY MODAL FOR SELECTED MEMBER */}
      <AnimatePresence>
        {selectedInteraction && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-2xl rounded-[14px] border p-6 space-y-4 shadow-2xl flex flex-col max-h-[85vh] ${
                isLight ? 'bg-white border-black/10 text-black' : 'bg-[#1A1A20] border-white/10 text-white'
              }`}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between pb-3 border-b shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedInteraction.memberAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'}
                    alt={selectedInteraction.memberName}
                    className="w-10 h-10 rounded-full object-cover border border-black/10 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-base flex items-center gap-2 font-sans">
                      <span className={isLight ? 'text-zinc-950' : 'text-white'}>{selectedInteraction.memberName}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-[6px] bg-[#399FEE]/10 text-[#399FEE]">
                        {selectedInteraction.memberRole}
                      </span>
                    </h3>
                    <p className={`text-xs font-sans ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      Chat Session with <strong className={isLight ? 'text-black' : 'text-white'}>{agentName}</strong> • {selectedInteraction.lastActive}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInteraction(null)}
                  className={`p-1.5 rounded-[6px] text-zinc-400 transition-colors ${
                    isLight ? 'hover:bg-black/5 hover:text-black' : 'hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Topic Summary Banner */}
              <div className={`p-3 rounded-[10px] border text-xs font-sans ${
                isLight ? 'bg-zinc-100 border-black/5 text-zinc-700' : 'bg-white/5 border-white/10 text-zinc-300'
              }`}>
                <strong className={`font-semibold block mb-0.5 ${isLight ? 'text-black' : 'text-white'}`}>Session Overview:</strong>
                {selectedInteraction.summary}
              </div>

              {/* Chat Log History Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none">
                {selectedInteraction.chatHistory.map((msg, idx) => (
                  <div
                    key={msg.id || idx}
                    className={`flex flex-col gap-1 ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 px-1">
                      <span>{msg.role === 'user' ? selectedInteraction.memberName : agentName}</span>
                      {msg.model && <span>• {msg.model}</span>}
                    </div>
                    <div
                      className={`p-3 rounded-[10px] text-xs leading-relaxed max-w-[85%] whitespace-pre-wrap font-sans ${
                        msg.role === 'user'
                          ? (isLight ? 'bg-[#121418] text-white' : 'bg-white text-black')
                          : (isLight ? 'bg-zinc-100 text-zinc-800 border border-black/5' : 'bg-white/10 text-zinc-200 border border-white/10')
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className={`pt-3 border-t flex items-center justify-between shrink-0 ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      selectedInteraction.chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')
                    );
                    showToast('Chat transcript copied to clipboard', 'success');
                  }}
                  className={`h-8 px-3 rounded-[6px] text-xs font-semibold border flex items-center gap-1.5 font-sans ${
                    isLight ? 'border-black/10 hover:bg-black/5 text-zinc-800' : 'border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <Copy size={13} />
                  <span>Copy Transcript</span>
                </button>

                <button
                  onClick={() => {
                    setActiveAgent(agentId);
                    setCurrentScreen('chat');
                    setSelectedInteraction(null);
                    showToast(`Opened active workspace with ${agentName}`);
                  }}
                  className={`h-8 px-4 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 font-sans ${
                    isLight ? 'bg-[#121418] text-white hover:bg-black' : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  <MessageSquare size={13} />
                  <span>Open Agent Workspace</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
