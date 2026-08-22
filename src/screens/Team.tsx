import React, { useState } from 'react';
import { useAppContext, TeamMember, UserRole, TeamCapabilities } from '../store/AppContext';
import { CustomSelect } from '../components/CustomSelect';
import { Tooltip } from '../components/Tooltip';
import { AnimatedIcon } from '../components/AnimatedIcon';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  X, 
  Trash2, 
  Settings, 
  Layers,
  Sparkles,
  Key,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Team: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { 
    teamMembers, 
    addTeamMember, 
    updateTeamMember, 
    deleteTeamMember, 
    currentRole, 
    categories,
    roleCategoryPermissions,
    toggleRoleCategoryPermission,
    showToast,
    themeMode 
  } = useAppContext();

  const isLight = themeMode !== 'dark';

  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  // Invite form state
  const [inviteName, setInviteName] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Member');
  const [inviteCategories, setInviteCategories] = useState<string[]>([]);

  // Initialize invite categories from categories list
  React.useEffect(() => {
    if (categories.length > 0 && inviteCategories.length === 0) {
      setInviteCategories(categories.map(c => c.name));
    }
  }, [categories]);

  const canManageTeam = currentRole === 'Admin' || currentRole === 'Manager';

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      showToast('Please enter name and email', 'error');
      return;
    }

    const defaultCaps: TeamCapabilities = {
      canChat: true,
      canUploadKB: inviteRole !== 'Guest',
      canInstallAgents: inviteRole === 'Admin' || inviteRole === 'Manager',
      canViewLibrary: true,
      canManageModels: inviteRole === 'Admin',
      canInviteOthers: inviteRole === 'Admin'
    };

    addTeamMember({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      allowedCategories: inviteCategories,
      capabilities: defaultCaps
    });

    showToast(`Invited ${inviteName} as ${inviteRole}`, 'success');
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  const roleDescriptions: Record<UserRole, { title: string; desc: string; badgeStyle: string; cardAccent: string }> = {
    Admin: {
      title: 'Full Hardware Administrator',
      desc: 'Complete control over Kamry NPU hardware, team provisioning, model updates, and all KB categories.',
      badgeStyle: isLight ? 'bg-zinc-900 text-white border border-black' : 'bg-zinc-800 text-zinc-100 border border-zinc-700',
      cardAccent: 'border-t-4 border-t-zinc-900'
    },
    Manager: {
      title: 'Departmental Manager',
      desc: 'Can upload to all KB categories, install marketplace agents, and manage team workflows.',
      badgeStyle: isLight ? 'bg-sky-100 text-sky-800 border border-sky-200/80' : 'bg-sky-950/80 text-sky-300 border border-sky-800/50',
      cardAccent: 'border-t-4 border-t-sky-500'
    },
    Member: {
      title: 'Team Member',
      desc: 'Standard inference & chat access. Finance documents hidden by default unless explicitly granted.',
      badgeStyle: isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/80' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50',
      cardAccent: 'border-t-4 border-t-emerald-500'
    },
    Guest: {
      title: 'External Auditor / Guest',
      desc: 'Strictly restricted to designated Contracts or audit folders. Cannot upload or install agents.',
      badgeStyle: isLight ? 'bg-amber-100 text-amber-800 border border-amber-200/80' : 'bg-amber-950/80 text-amber-300 border border-amber-800/50',
      cardAccent: 'border-t-4 border-t-amber-500'
    }
  };

  // Avatar gradient generator per user
  const getAvatarStyle = (name: string, role: UserRole) => {
    const char = name.charAt(0).toUpperCase();
    if (role === 'Admin') return isLight ? 'bg-gradient-to-br from-slate-800 to-zinc-900 text-white' : 'bg-gradient-to-br from-slate-700 to-zinc-800 text-white';
    if (role === 'Manager') return isLight ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white' : 'bg-gradient-to-br from-sky-400 to-blue-500 text-white';
    if (role === 'Guest') return isLight ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' : 'bg-gradient-to-br from-amber-600 to-orange-700 text-white';
    
    // Member palette based on initial
    if (char === 'D') return isLight ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white' : 'bg-gradient-to-br from-teal-400 to-emerald-500 text-white';
    if (char === 'E') return isLight ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white' : 'bg-gradient-to-br from-rose-400 to-pink-500 text-white';
    return isLight ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white';
  };

  // Helper for category badge styling
  const getCategoryBadgeStyle = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes('policy') || lower.includes('policies')) {
      return isLight ? 'bg-cyan-50 text-cyan-700 border border-cyan-200/80' : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50';
    }
    if (lower.includes('contract')) {
      return isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50';
    }
    if (lower.includes('hr')) {
      return isLight ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80' : 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/50';
    }
    if (lower.includes('finance')) {
      return isLight ? 'bg-rose-50 text-rose-700 border border-rose-200/80' : 'bg-rose-950/60 text-rose-300 border border-rose-800/50';
    }
    if (lower.includes('product')) {
      return isLight ? 'bg-blue-50 text-blue-700 border border-blue-200/80' : 'bg-blue-950/60 text-blue-300 border border-blue-800/50';
    }
    return isLight ? 'bg-zinc-100 text-zinc-700 border border-black/5' : 'bg-white/10 text-zinc-300 border border-white/10';
  };

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 font-familjen ${isLight ? 'bg-kamry-paper/40' : 'bg-[#141418]'}`}>
      
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b ${isLight ? 'border-black/5' : 'border-white/10'}`}>
        <div className="flex items-start gap-3">
          {onBack && (
            <button 
              onClick={onBack} 
              className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-kamry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'} mt-0.5`}
              title="Back to Settings"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl sm:text-3xl font-bricolage font-bold tracking-tight ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>
                Team & Access Control
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full font-martian text-[10px] font-bold uppercase tracking-wider ${isLight ? 'bg-sky-100 text-sky-700 border border-sky-200/80' : 'bg-sky-950/80 text-sky-300 border border-sky-800/50'}`}>
                {teamMembers.length} Members
              </span>
            </div>
            <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-kamry-graphite/70' : 'text-zinc-400'}`}>
              Manage local device access, role permissions, and Knowledge Base security scopes.
            </p>
          </div>
        </div>

        {/* Invite Member Button */}
        <button
          onClick={() => {
            if (!canManageTeam) {
              showToast('Admin or Manager role required to invite team members', 'error');
              return;
            }
            setIsInviteModalOpen(true);
          }}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-martian text-xs font-semibold shadow-sm transition-all ${
            canManageTeam 
              ? 'bg-black text-white hover:bg-zinc-800 hover:scale-[1.01] active:scale-[0.99] cursor-pointer' 
              : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed'
          }`}
        >
          <UserPlus size={16} />
          <span>Invite Member</span>
        </button>
      </div>

      {/* ADMIN RESTRICTION DEMO BANNER IF NOT ADMIN */}
      {!canManageTeam && (
        <div className={`border rounded-2xl p-4 flex items-center gap-3 font-familjen text-xs ${isLight ? 'bg-amber-500/10 border-amber-500/30 text-amber-900' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'}`}>
          <ShieldAlert size={20} className="text-amber-500 flex-shrink-0" />
          <div>
            <strong className="font-bricolage font-bold text-sm block">ADMIN RESTRICTION ACTIVE</strong>
            <span>
              You are currently viewing as <strong className="font-martian uppercase">{currentRole}</strong>. You can inspect the team directory and capabilities, but you cannot invite members or alter hardware security permissions. Switch to Admin using the top header control.
            </span>
          </div>
        </div>
      )}

      {/* ROLES LEGEND SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(['Admin', 'Manager', 'Member', 'Guest'] as UserRole[]).map(r => {
          const info = roleDescriptions[r];
          const count = teamMembers.filter(m => m.role === r).length;
          return (
            <div key={r} className={`border rounded-2xl p-4 shadow-xs space-y-2 ${info.cardAccent} ${isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'}`}>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded font-martian text-[10px] font-bold ${info.badgeStyle}`}>
                  {r}
                </span>
                <span className={`font-martian text-xs font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                  {count} {count === 1 ? 'user' : 'users'}
                </span>
              </div>
              <h3 className={`font-bricolage font-bold text-xs ${isLight ? 'text-zinc-900' : 'text-white'}`}>{info.title}</h3>
              <p className={`text-[11px] leading-snug ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>{info.desc}</p>
            </div>
          );
        })}
      </div>

      {/* MEMBER DIRECTORY TABLE */}
      <div className={`border rounded-2xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'}`}>
        <div className={`p-4 border-b flex items-center justify-between ${isLight ? 'border-black/10' : 'border-white/10'}`}>
          <div className="flex items-center gap-2">
            <Users size={16} className={isLight ? 'text-sky-600' : 'text-[#0EA5E9]'} />
            <h2 className={`font-bricolage font-bold text-sm ${isLight ? 'text-zinc-900' : 'text-white'}`}>Active Directory & Access Scopes</h2>
          </div>
          <span className={`font-martian text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Current session user role: <strong className={isLight ? 'text-zinc-900' : 'text-white'}>{currentRole}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-familjen">
            <thead className={`border-b font-martian text-[10px] uppercase tracking-wider ${isLight ? 'bg-zinc-50 border-black/10 text-zinc-500' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Allowed KB Categories</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-black/5' : 'divide-white/5'}`}>
              {teamMembers.map(member => (
                <tr key={member.id} className={`transition-colors ${isLight ? 'hover:bg-zinc-50/80' : 'hover:bg-white/5'}`}>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl font-bricolage font-bold flex items-center justify-center text-xs shadow-xs ${getAvatarStyle(member.name, member.role)}`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className={`font-bold text-xs sm:text-sm ${isLight ? 'text-zinc-900' : 'text-white'}`}>{member.name}</div>
                        <div className={`text-[11px] font-sans ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>{member.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded font-martian text-[10px] font-bold ${roleDescriptions[member.role].badgeStyle}`}>
                      {member.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    {member.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 font-martian text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-600 text-white shadow-2xs">
                        <CheckCircle2 size={12} className="text-white" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-martian text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-500 text-white shadow-2xs">
                        <Clock size={12} className="text-white" />
                        PENDING
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {member.allowedCategories.map(cat => (
                        <span key={cat} className={`px-2 py-0.5 rounded-md font-martian text-[10px] font-medium ${getCategoryBadgeStyle(cat)}`}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className={`py-3.5 px-3 font-martian text-[10px] ${isLight ? 'text-kamry-graphite/70' : 'text-zinc-400'}`}>
                    {member.lastActive}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Tooltip content={`Manage permissions for ${member.name}`} position="left">
                      <button
                        onClick={() => setSelectedMemberForEdit(member)}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-martian font-medium transition-colors cursor-pointer inline-flex items-center gap-1 group ${
                          isLight ? 'border-black/10 hover:bg-black/5 text-kamry-blackout' : 'border-white/10 hover:bg-white/10 text-white'
                        }`}
                      >
                        <AnimatedIcon type="scale" className={isLight ? 'text-kamry-graphite group-hover:text-kamry-blackout' : 'text-zinc-400 group-hover:text-white'}>
                          <Settings size={12} />
                        </AnimatedIcon>
                        <span>Permissions</span>
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CAPABILITIES PERMISSION MATRIX */}
      <div className={`border rounded-2xl p-5 shadow-sm space-y-4 ${isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'}`}>
        <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-black/10' : 'border-white/10'}`}>
          <div className="flex items-center gap-2">
            <Key size={18} className={isLight ? 'text-kamry-deep-carrier' : 'text-[#0EA5E9]'} />
            <h2 className={`font-bricolage font-bold text-base ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Role Capability Matrix</h2>
          </div>
          <span className={`font-martian text-[10px] uppercase ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>Enforced by local hardware security module</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-familjen">
            <thead className={`border-b font-martian text-[10px] uppercase ${isLight ? 'bg-zinc-50 border-black/10 text-kamry-graphite/70' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
              <tr>
                <th className="py-2.5 px-3">System Capability</th>
                <th className="py-2.5 px-3 text-center">Admin</th>
                <th className="py-2.5 px-3 text-center">Manager</th>
                <th className="py-2.5 px-3 text-center">Member</th>
                <th className="py-2.5 px-3 text-center">Guest</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${isLight ? 'divide-black/5' : 'divide-white/5'}`}>
              <tr>
                <td className={`py-3 px-3 font-medium ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Chat & Run Local Models</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
              </tr>
              <tr>
                <td className={`py-3 px-3 font-medium ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Upload to Knowledge Base</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
              </tr>
              <tr>
                <td className={`py-3 px-3 font-medium ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Install Marketplace Agents</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
              </tr>
              <tr>
                <td className={`py-3 px-3 font-medium ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Access Company AI Agents & Prompts</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓ (Scoped)</td>
              </tr>
              <tr>
                <td className={`py-3 px-3 font-medium ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Manage Models & NPU VRAM</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
              </tr>
              <tr>
                <td className={`py-3 px-3 font-medium ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Invite Team Members</td>
                <td className="text-center py-3 text-emerald-500 font-bold">✓</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* INVITE MEMBER MODAL */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-familjen ${isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10 text-white'}`}
            >
              <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-black/10' : 'border-white/10'}`}>
                <div className="flex items-center gap-2">
                  <UserPlus size={18} className={isLight ? 'text-kamry-deep-carrier' : 'text-[#0EA5E9]'} />
                  <h3 className={`font-bricolage font-bold text-base ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Invite New Team Member</h3>
                </div>
                <button onClick={() => setIsInviteModalOpen(false)} className={`p-1 ${isLight ? 'text-kamry-graphite hover:text-black' : 'text-zinc-400 hover:text-white'}`}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className={`font-martian text-xs font-semibold ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Full Name</label>
                  <input 
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-familjen focus:outline-none ${isLight ? 'bg-zinc-50 border-black/10 text-black focus:border-kamry-deep-carrier focus:bg-white' : 'bg-white/5 border-white/10 text-white focus:border-[#0EA5E9]'}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`font-martian text-xs font-semibold ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Work Email</label>
                  <input 
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="marcus@company.com"
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-familjen focus:outline-none ${isLight ? 'bg-zinc-50 border-black/10 text-black focus:border-kamry-deep-carrier focus:bg-white' : 'bg-white/5 border-white/10 text-white focus:border-[#0EA5E9]'}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`font-martian text-xs font-semibold ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Assigned Role</label>
                  <CustomSelect
                    fullWidth
                    value={inviteRole}
                    onChange={(val) => setInviteRole(val as UserRole)}
                    options={[
                      { value: 'Admin', label: 'Admin', description: 'Full Hardware & KB Access' },
                      { value: 'Manager', label: 'Manager', description: 'Departmental KB & Agent Management' },
                      { value: 'Member', label: 'Member', description: 'Standard Inference & Chat' },
                      { value: 'Guest', label: 'Guest', description: 'Restricted Contracts/Audit Access' },
                    ]}
                    buttonClassName={`w-full rounded-xl ${isLight ? 'bg-zinc-50 border-black/10' : 'bg-white/5 border-white/10 text-white'}`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className={`font-martian text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>
                      Knowledge Access Scopes
                    </label>
                    <span className={`text-[10px] font-martian ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>
                      {inviteCategories.length} / {categories.length} Allowed
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 pt-1">
                    {categories.map(cat => {
                      const isAllowed = inviteCategories.includes(cat.name);
                      return (
                        <div key={cat.id} className={`flex items-center justify-between p-2 rounded-xl border ${isLight ? 'border-black/10 bg-zinc-50/50' : 'border-white/10 bg-white/5'}`}>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <div>
                              <span className={`font-martian text-xs font-bold block leading-none ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>{cat.name}</span>
                              {cat.description && <span className={`text-[10px] ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>{cat.description}</span>}
                            </div>
                          </div>

                          <div className={`flex items-center p-0.5 rounded-lg text-[10px] font-martian font-bold ${isLight ? 'bg-zinc-200/80' : 'bg-white/10'}`}>
                            <button
                              type="button"
                              onClick={() => {
                                if (!isAllowed) setInviteCategories([...inviteCategories, cat.name]);
                              }}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                isAllowed ? 'bg-emerald-600 text-white shadow-2xs' : (isLight ? 'text-zinc-600 hover:text-black' : 'text-zinc-400 hover:text-white')
                              }`}
                            >
                              ALLOW
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (isAllowed) setInviteCategories(inviteCategories.filter(c => c !== cat.name));
                              }}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                !isAllowed ? 'bg-red-600 text-white shadow-2xs' : (isLight ? 'text-zinc-600 hover:text-black' : 'text-zinc-400 hover:text-white')
                              }`}
                            >
                              DENY
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={`flex items-center justify-end gap-2 pt-2 border-t ${isLight ? 'border-black/10' : 'border-white/10'}`}>
                  <button 
                    type="button" 
                    onClick={() => setIsInviteModalOpen(false)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-martian ${isLight ? 'border-black/10 hover:bg-black/5' : 'border-white/10 hover:bg-white/10 text-white'}`}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className={`px-4 py-2 rounded-xl text-white text-xs font-martian font-semibold ${isLight ? 'bg-kamry-blackout hover:bg-kamry-graphite' : 'bg-[#0EA5E9] hover:bg-blue-600'}`}
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MEMBER PERMISSIONS MODAL */}
      <AnimatePresence>
        {selectedMemberForEdit && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-familjen ${isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10 text-white'}`}
            >
              <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-black/10' : 'border-white/10'}`}>
                <div>
                  <h3 className={`font-bricolage font-bold text-base ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Member Permissions</h3>
                  <p className={`font-martian text-[10px] ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>{selectedMemberForEdit.name} • {selectedMemberForEdit.email}</p>
                </div>
                <button onClick={() => setSelectedMemberForEdit(null)} className={`p-1 ${isLight ? 'text-kamry-graphite hover:text-black' : 'text-zinc-400 hover:text-white'}`}>
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className={`font-martian text-xs font-semibold ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>User Role</label>
                  <CustomSelect
                    fullWidth
                    disabled={!canManageTeam}
                    value={selectedMemberForEdit.role}
                    onChange={(val) => {
                      const updatedRole = val as UserRole;
                      updateTeamMember(selectedMemberForEdit.id, { role: updatedRole });
                      setSelectedMemberForEdit({ ...selectedMemberForEdit, role: updatedRole });
                    }}
                    options={[
                      { value: 'Admin', label: 'Admin', description: 'Full Hardware & KB Access' },
                      { value: 'Manager', label: 'Manager', description: 'Departmental KB & Agent Management' },
                      { value: 'Member', label: 'Member', description: 'Standard Inference & Chat' },
                      { value: 'Guest', label: 'Guest', description: 'Restricted Contracts/Audit Access' },
                    ]}
                    buttonClassName={`w-full rounded-xl ${isLight ? 'bg-zinc-50 border-black/10' : 'bg-white/5 border-white/10 text-white'}`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className={`font-martian text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>
                      Knowledge Access Scopes
                    </label>
                    <span className={`text-[10px] font-martian ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>
                      {selectedMemberForEdit.allowedCategories.length} / {categories.length} Allowed
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 pt-1">
                    {categories.map(cat => {
                      const isAllowed = selectedMemberForEdit.allowedCategories.includes(cat.name);
                      return (
                        <div key={cat.id} className={`flex items-center justify-between p-2 rounded-xl border ${isLight ? 'border-black/10 bg-zinc-50/50' : 'border-white/10 bg-white/5'}`}>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <div>
                              <span className={`font-martian text-xs font-bold block leading-none ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>{cat.name}</span>
                              {cat.description && <span className={`text-[10px] ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>{cat.description}</span>}
                            </div>
                          </div>

                          <div className={`flex items-center p-0.5 rounded-lg text-[10px] font-martian font-bold ${isLight ? 'bg-zinc-200/80' : 'bg-white/10'}`}>
                            <button
                              type="button"
                              disabled={!canManageTeam}
                              onClick={() => {
                                if (!isAllowed) {
                                  const updated = [...selectedMemberForEdit.allowedCategories, cat.name];
                                  updateTeamMember(selectedMemberForEdit.id, { allowedCategories: updated });
                                  setSelectedMemberForEdit({ ...selectedMemberForEdit, allowedCategories: updated });
                                }
                              }}
                              className={`px-2 py-0.5 rounded-md transition-all ${
                                !canManageTeam ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                              } ${
                                isAllowed ? 'bg-emerald-600 text-white shadow-2xs' : (isLight ? 'text-zinc-600 hover:text-black' : 'text-zinc-400 hover:text-white')
                              }`}
                            >
                              ALLOW
                            </button>
                            <button
                              type="button"
                              disabled={!canManageTeam}
                              onClick={() => {
                                if (isAllowed) {
                                  const updated = selectedMemberForEdit.allowedCategories.filter(c => c !== cat.name);
                                  updateTeamMember(selectedMemberForEdit.id, { allowedCategories: updated });
                                  setSelectedMemberForEdit({ ...selectedMemberForEdit, allowedCategories: updated });
                                }
                              }}
                              className={`px-2 py-0.5 rounded-md transition-all ${
                                !canManageTeam ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                              } ${
                                !isAllowed ? 'bg-red-600 text-white shadow-2xs' : (isLight ? 'text-zinc-600 hover:text-black' : 'text-zinc-400 hover:text-white')
                              }`}
                            >
                              DENY
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between pt-3 border-t ${isLight ? 'border-black/10' : 'border-white/10'}`}>
                {canManageTeam && (
                  <button 
                    onClick={() => {
                      deleteTeamMember(selectedMemberForEdit.id);
                      showToast(`Removed ${selectedMemberForEdit.name} from box`);
                      setSelectedMemberForEdit(null);
                    }}
                    className="px-3.5 py-2 text-xs text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl font-martian font-bold flex items-center gap-1.5 cursor-pointer shadow-xs border border-red-700 transition-all"
                  >
                    <Trash2 size={14} /> Remove User
                  </button>
                )}

                <button 
                  onClick={() => {
                    showToast(`Saved access settings for ${selectedMemberForEdit.name}`);
                    setSelectedMemberForEdit(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-white text-xs font-martian font-semibold ml-auto ${isLight ? 'bg-kamry-blackout hover:bg-kamry-graphite' : 'bg-[#0EA5E9] hover:bg-blue-600'}`}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
