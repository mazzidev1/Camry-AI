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
    showToast 
  } = useAppContext();

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

  const roleDescriptions: Record<UserRole, { title: string; desc: string; color: string }> = {
    Admin: {
      title: 'Full Hardware Administrator',
      desc: 'Complete control over Camry NPU hardware, team provisioning, model updates, and all KB categories.',
      color: 'bg-camry-blackout text-white'
    },
    Manager: {
      title: 'Departmental Manager',
      desc: 'Can upload to all KB categories, install marketplace agents, and manage team workflows.',
      color: 'bg-blue-900 text-white'
    },
    Member: {
      title: 'Team Member',
      desc: 'Standard inference & chat access. Finance documents hidden by default unless explicitly granted.',
      color: 'bg-zinc-800 text-white'
    },
    Guest: {
      title: 'External Auditor / Guest',
      desc: 'Strictly restricted to designated Contracts or audit folders. Cannot upload or install agents.',
      color: 'bg-amber-900 text-white'
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-camry-paper/40 p-4 sm:p-8 space-y-6 font-familjen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/5">
        <div className="flex items-start gap-3">
          {onBack && (
            <button 
              onClick={onBack} 
              className="p-2 hover:bg-black/5 rounded-full transition-colors text-camry-graphite/60 hover:text-black mt-0.5"
              title="Back to Settings"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bricolage text-camry-blackout font-bold tracking-tight">
                Team & Access Control
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-camry-carrier/20 text-camry-deep-carrier font-martian text-[10px] font-semibold uppercase tracking-wider">
                {teamMembers.length} Members
              </span>
            </div>
            <p className="text-xs sm:text-sm text-camry-graphite/70 mt-1">
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
              ? 'bg-camry-blackout text-white hover:bg-camry-graphite hover:scale-[1.01]' 
              : 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <UserPlus size={16} />
          <span>Invite Member</span>
        </button>
      </div>

      {/* ADMIN RESTRICTION DEMO BANNER IF NOT ADMIN */}
      {!canManageTeam && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3 text-amber-900 font-familjen text-xs">
          <ShieldAlert size={20} className="text-amber-700 flex-shrink-0" />
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
            <div key={r} className="bg-white border border-black/10 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded font-martian text-[10px] font-bold ${info.color}`}>
                  {r}
                </span>
                <span className="font-martian text-xs font-bold text-camry-blackout">
                  {count} {count === 1 ? 'user' : 'users'}
                </span>
              </div>
              <h3 className="font-bricolage font-bold text-xs text-camry-blackout">{info.title}</h3>
              <p className="text-[11px] text-camry-graphite/70 leading-snug">{info.desc}</p>
            </div>
          );
        })}
      </div>

      {/* MEMBER DIRECTORY TABLE */}
      <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-camry-deep-carrier" />
            <h2 className="font-bricolage font-bold text-sm text-camry-blackout">Active Directory & Access Scopes</h2>
          </div>
          <span className="font-martian text-[10px] text-camry-graphite/60">
            Current session user role: <strong className="text-camry-blackout">{currentRole}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-familjen">
            <thead className="bg-zinc-50 border-b border-black/10 font-martian text-[10px] text-camry-graphite/70 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Allowed KB Categories</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {teamMembers.map(member => (
                <tr key={member.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-camry-blackout text-white font-bricolage font-bold flex items-center justify-center text-xs shadow-xs">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-camry-blackout text-xs sm:text-sm">{member.name}</div>
                        <div className="text-[11px] text-camry-graphite/60 font-martian">{member.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded font-martian text-[10px] font-bold ${roleDescriptions[member.role].color}`}>
                      {member.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    {member.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 font-martian text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-martian text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Clock size={12} className="text-amber-600" />
                        PENDING
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {member.allowedCategories.map(cat => (
                        <span key={cat} className="px-1.5 py-0.2 rounded bg-black/5 text-camry-graphite font-martian text-[9px]">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-martian text-[10px] text-camry-graphite/70">
                    {member.lastActive}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Tooltip content={`Manage permissions for ${member.name}`} position="left">
                      <button
                        onClick={() => setSelectedMemberForEdit(member)}
                        className="px-2.5 py-1 rounded-lg border border-black/10 hover:bg-black/5 text-xs font-martian text-camry-blackout font-medium transition-colors cursor-pointer inline-flex items-center gap-1 group"
                      >
                        <AnimatedIcon type="scale" className="text-camry-graphite group-hover:text-camry-blackout">
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
      <div className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <div className="flex items-center gap-2">
            <Key size={18} className="text-camry-deep-carrier" />
            <h2 className="font-bricolage font-bold text-base text-camry-blackout">Role Capability Matrix</h2>
          </div>
          <span className="font-martian text-[10px] text-camry-graphite/60 uppercase">Enforced by local hardware security module</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-familjen">
            <thead className="bg-zinc-50 border-b border-black/10 font-martian text-[10px] text-camry-graphite/70 uppercase">
              <tr>
                <th className="py-2.5 px-3">System Capability</th>
                <th className="py-2.5 px-3 text-center">Admin</th>
                <th className="py-2.5 px-3 text-center">Manager</th>
                <th className="py-2.5 px-3 text-center">Member</th>
                <th className="py-2.5 px-3 text-center">Guest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-xs">
              <tr>
                <td className="py-3 px-3 font-medium text-camry-blackout">Chat & Run Local Models</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-camry-blackout">Upload to Knowledge Base</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-camry-blackout">Install Marketplace Agents</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-camry-blackout">View Saved Library Artifacts</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓ (Scoped)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-camry-blackout">Manage Models & NPU VRAM</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
                <td className="text-center py-3 text-red-500 font-bold">✕</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-camry-blackout">Invite Team Members</td>
                <td className="text-center py-3 text-emerald-600 font-bold">✓</td>
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
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-familjen"
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <UserPlus size={18} className="text-camry-deep-carrier" />
                  <h3 className="font-bricolage font-bold text-base text-camry-blackout">Invite New Team Member</h3>
                </div>
                <button onClick={() => setIsInviteModalOpen(false)} className="p-1 text-camry-graphite hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-martian text-xs font-semibold text-camry-blackout">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl text-xs font-familjen focus:outline-none focus:border-camry-deep-carrier focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-martian text-xs font-semibold text-camry-blackout">Work Email</label>
                  <input 
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="marcus@company.com"
                    className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl text-xs font-familjen focus:outline-none focus:border-camry-deep-carrier focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-martian text-xs font-semibold text-camry-blackout">Assigned Role</label>
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
                    buttonClassName="w-full bg-zinc-50 border-black/10 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-martian text-xs font-semibold text-camry-blackout uppercase tracking-wider">
                      Knowledge Access Scopes
                    </label>
                    <span className="text-[10px] font-martian text-camry-graphite/60">
                      {inviteCategories.length} / {categories.length} Allowed
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 pt-1">
                    {categories.map(cat => {
                      const isAllowed = inviteCategories.includes(cat.name);
                      return (
                        <div key={cat.id} className="flex items-center justify-between p-2 rounded-xl border border-black/10 bg-zinc-50/50">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <div>
                              <span className="font-martian text-xs font-bold text-camry-blackout block leading-none">{cat.name}</span>
                              {cat.description && <span className="text-[10px] text-camry-graphite/60">{cat.description}</span>}
                            </div>
                          </div>

                          <div className="flex items-center bg-zinc-200/80 p-0.5 rounded-lg text-[10px] font-martian font-bold">
                            <button
                              type="button"
                              onClick={() => {
                                if (!isAllowed) setInviteCategories([...inviteCategories, cat.name]);
                              }}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                isAllowed ? 'bg-emerald-600 text-white shadow-2xs' : 'text-zinc-600 hover:text-black'
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
                                !isAllowed ? 'bg-red-600 text-white shadow-2xs' : 'text-zinc-600 hover:text-black'
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

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10">
                  <button 
                    type="button" 
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl border border-black/10 text-xs font-martian hover:bg-black/5"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-camry-blackout text-white text-xs font-martian font-semibold hover:bg-camry-graphite"
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
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-familjen"
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div>
                  <h3 className="font-bricolage font-bold text-base text-camry-blackout">Member Permissions</h3>
                  <p className="font-martian text-[10px] text-camry-graphite/60">{selectedMemberForEdit.name} • {selectedMemberForEdit.email}</p>
                </div>
                <button onClick={() => setSelectedMemberForEdit(null)} className="p-1 text-camry-graphite hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-martian text-xs font-semibold text-camry-blackout">User Role</label>
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
                    buttonClassName="w-full bg-zinc-50 border-black/10 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-martian text-xs font-semibold text-camry-blackout uppercase tracking-wider">
                      Knowledge Access Scopes
                    </label>
                    <span className="text-[10px] font-martian text-camry-graphite/60">
                      {selectedMemberForEdit.allowedCategories.length} / {categories.length} Allowed
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 pt-1">
                    {categories.map(cat => {
                      const isAllowed = selectedMemberForEdit.allowedCategories.includes(cat.name);
                      return (
                        <div key={cat.id} className="flex items-center justify-between p-2 rounded-xl border border-black/10 bg-zinc-50/50">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <div>
                              <span className="font-martian text-xs font-bold text-camry-blackout block leading-none">{cat.name}</span>
                              {cat.description && <span className="text-[10px] text-camry-graphite/60">{cat.description}</span>}
                            </div>
                          </div>

                          <div className="flex items-center bg-zinc-200/80 p-0.5 rounded-lg text-[10px] font-martian font-bold">
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
                                isAllowed ? 'bg-emerald-600 text-white shadow-2xs' : 'text-zinc-600 hover:text-black'
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
                                !isAllowed ? 'bg-red-600 text-white shadow-2xs' : 'text-zinc-600 hover:text-black'
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

              <div className="flex items-center justify-between pt-3 border-t border-black/10">
                {canManageTeam && (
                  <button 
                    onClick={() => {
                      deleteTeamMember(selectedMemberForEdit.id);
                      showToast(`Removed ${selectedMemberForEdit.name} from box`);
                      setSelectedMemberForEdit(null);
                    }}
                    className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-martian font-semibold flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Remove User
                  </button>
                )}

                <button 
                  onClick={() => {
                    showToast(`Saved access settings for ${selectedMemberForEdit.name}`);
                    setSelectedMemberForEdit(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-camry-blackout text-white text-xs font-martian font-semibold hover:bg-camry-graphite ml-auto"
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
