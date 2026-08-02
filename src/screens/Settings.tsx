import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../store/AppContext';
import { ChevronRight, Shield, Power, Monitor, HardDrive, Wifi, Network, Key, ArrowLeft, Copy, Eye, EyeOff, Check, Terminal, Lock, Download, Upload, FileCode, Users, Cpu, Bot, Layers, Activity } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Team } from './Team';
import { Tooltip } from '../components/Tooltip';
import { AnimatedIcon, IconAnimationType } from '../components/AnimatedIcon';
import { CamryMascot } from '../components/CamryMascot';
import { CamryLogo } from '../components/CamryLogo';
import { CustomSelect } from '../components/CustomSelect';
import { AxolotlStatusBadge } from '../components/AxolotlStatusBadge';

export const Settings: React.FC = () => {
  const { currentScreen, setCurrentScreen, settingsView, setSettingsView, showToast, exportConfig, importConfig, teamMembers, currentRole, setCurrentRole, themeMode } = useAppContext();
  const isLight = themeMode !== 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentScreen === 'team') {
      setSettingsView('team');
    }
  }, [currentScreen, setSettingsView]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importConfig(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className={`flex-1 h-full flex flex-col overflow-hidden relative ${isLight ? 'bg-camry-paper' : 'bg-[#141418]'}`}>
      <AnimatePresence mode="wait">
        {settingsView === 'main' && (
          <motion.div 
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute inset-0 flex flex-col"
          >
            {/* Header */}
            <div className={`p-4 sm:p-8 pb-3 sm:pb-4 flex-shrink-0 z-10 ${isLight ? 'bg-camry-paper' : 'bg-[#141418]'}`}>
              <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Settings</h1>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8 sm:pb-12">
              <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
                
                {/* Mini Dashboard View */}
                <MiniDashboard />

                {/* System Status & Role Access */}
                <div>
                  <div className={`font-martian text-xs mb-3 px-2 tracking-wider uppercase flex items-center justify-between ${isLight ? 'text-camry-graphite/50' : 'text-zinc-400'}`}>
                    <span>SYSTEM STATUS & ACCESS SCOPE</span>
                    <span className="text-[10px] text-emerald-500 font-mono font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      100% OPERATIONAL
                    </span>
                  </div>
                  <div className={`border rounded-xl shadow-sm overflow-hidden p-4 sm:p-5 space-y-4 ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
                    
                    {/* Camry OS Version & Status Badge */}
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border ${isLight ? 'bg-camry-graphite/5 border-black/5' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex items-center gap-3">
                        <CamryLogo variant={isLight ? "dark" : "light"} size="md" useMascot={true} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                              v2.4
                              <span className="text-emerald-500 font-bold ml-0.5">100%</span>
                            </span>
                          </div>
                          <p className={`text-xs font-familjen mt-0.5 ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>
                            Local NPU Inference Engine • Zero-Telemetry Air-Gapped Guarantee
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-xs bg-emerald-600 text-white">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          System Connected
                        </span>
                      </div>
                    </div>

                    {/* View As Role Selector */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div>
                        <label className={`text-sm font-semibold block ${isLight ? 'text-camry-blackout' : 'text-white'}`}>View As (Access Role Simulation)</label>
                        <p className={`text-xs font-familjen ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>
                          Simulate active workspace permissions and document access restrictions
                        </p>
                      </div>

                      <div className="w-full sm:w-72">
                        <CustomSelect
                          label="VIEW AS:"
                          size="sm"
                          fullWidth
                          value={currentRole}
                          onChange={(val) => {
                            setCurrentRole(val as any);
                            showToast(`Role switched to ${val} (simulated access scope)`);
                          }}
                          options={[
                            { value: 'Admin', label: 'Admin (Full Access)', description: 'Hardware Admin & Full Permissions' },
                            { value: 'Manager', label: 'Manager', description: 'Departmental KB & Agent Management' },
                            { value: 'Member', label: 'Member (Finance: Denied)', description: 'Standard Inference & Chat Access' },
                            { value: 'Guest', label: 'Guest (Contracts Only)', description: 'Restricted Contracts/Audit Access' },
                          ]}
                          buttonClassName={isLight ? "bg-[#F5F3EF] border-[#E2DDD5] text-[#18181B]" : "bg-white/5 border-white/10 text-white"}
                        />
                      </div>
                    </div>

                    {/* Interactive Axolotl System Activity Status Badge Component */}
                    <div className={`pt-2 border-t ${isLight ? 'border-black/5' : 'border-white/10'}`}>
                      <div className={`text-xs font-semibold mb-2 ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Live Axolotl Activity Badge</div>
                      <AxolotlStatusBadge showSelector={true} className="w-full" />
                    </div>

                  </div>
                </div>

                {/* Account */}
                <div className={`border rounded-xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
                  <SettingRow 
                    icon={<div className={`w-8 h-8 rounded flex items-center justify-center font-medium shadow-xs ${isLight ? 'bg-camry-graphite text-white' : 'bg-[#0066FF] text-white'}`}>D</div>}
                    title="digitalix"
                    subtitle="alex@nuvious.com"
                    tooltip="User profile and account settings"
                    right={<ChevronRight size={16} className={isLight ? "text-camry-graphite/40" : "text-zinc-500"} />}
                    onClick={() => {}}
                  />
                  <div className={`h-[1px] ml-14 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                  <SettingRow 
                    title="Feedback"
                    subtitle="Share feedback with the Camry team"
                    tooltip="Submit product feedback"
                    right={<ChevronRight size={16} className={isLight ? "text-camry-graphite/40" : "text-zinc-500"} />}
                    onClick={() => showToast("Feedback module not available in preview")}
                  />
                </div>

                {/* Organization & Team Settings */}
                <div>
                  <div className={`font-martian text-xs mb-3 px-2 tracking-wider uppercase ${isLight ? 'text-camry-graphite/50' : 'text-zinc-400'}`}>ORGANIZATION & ACCESS</div>
                  <div className={`border rounded-xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
                    <SettingRow 
                      icon={<Users size={18} className={isLight ? "text-camry-graphite/60" : "text-zinc-400"} />}
                      title="Team & Access Control"
                      subtitle="Manage members, assigned roles, and document security scopes"
                      tooltip="Manage workspace members and category permissions"
                      iconAnimation="scale"
                      right={
                        <div className="flex items-center gap-2">
                          <span className={`font-martian text-[11px] px-2 py-0.5 rounded font-semibold ${isLight ? 'bg-camry-carrier/15 text-camry-deep-carrier' : 'bg-[#0066FF]/20 text-[#0066FF]'}`}>
                            {teamMembers.length} Members
                          </span>
                          <ChevronRight size={16} className={isLight ? "text-camry-graphite/40" : "text-zinc-500"} />
                        </div>
                      }
                      onClick={() => setSettingsView('team')}
                    />
                  </div>
                </div>

                {/* Software Settings */}
                <div>
                  <div className={`font-martian text-xs mb-3 px-2 tracking-wider uppercase ${isLight ? 'text-camry-graphite/50' : 'text-zinc-400'}`}>SOFTWARE SETTINGS</div>
                  <div className={`border rounded-xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
                    <SettingRow 
                      icon={<Power size={18} className={isLight ? "text-camry-graphite/60" : "text-zinc-400"} />}
                      title="Auto Start"
                      subtitle="Automatically launch Camry OS on device boot"
                      tooltip="Toggle auto boot behavior"
                      iconAnimation="bounce"
                      right={<Toggle defaultChecked />}
                    />
                    <div className={`h-[1px] ml-12 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                    <SettingRow 
                      icon={<Shield size={18} className={isLight ? "text-camry-graphite/60" : "text-zinc-400"} />}
                      title="Privacy Policy"
                      subtitle="View zero-telemetry & on-device data guarantee"
                      tooltip="Read local privacy policy"
                      iconAnimation="scale"
                      right={<ChevronRight size={16} className={isLight ? "text-camry-graphite/40" : "text-zinc-500"} />}
                      onClick={() => setSettingsView('privacy')}
                    />
                  </div>
                </div>

                {/* Backup & Portability Settings */}
                <div>
                  <div className={`font-martian text-xs mb-3 px-2 tracking-wider uppercase ${isLight ? 'text-camry-graphite/50' : 'text-zinc-400'}`}>BACKUP & PORTABILITY</div>
                  <div className={`border rounded-xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
                    <SettingRow 
                      icon={<Download size={18} className={isLight ? "text-camry-carrier" : "text-[#0066FF]"} />}
                      title="Export Configuration & Agents"
                      subtitle="Save system preferences and agents to JSON file"
                      tooltip="Download backup JSON configuration"
                      iconAnimation="bounce"
                      right={
                        <Tooltip content="Export settings & agents JSON" position="left">
                          <button 
                            onClick={exportConfig}
                            className={`px-3 py-1.5 text-xs font-martian rounded-lg transition-colors shadow-sm cursor-pointer ${isLight ? 'bg-camry-blackout text-white hover:bg-camry-graphite' : 'bg-[#0066FF] text-white hover:bg-blue-600'}`}
                          >
                            Export JSON
                          </button>
                        </Tooltip>
                      }
                    />
                    <div className={`h-[1px] ml-12 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                    <SettingRow 
                      icon={<Upload size={18} className={isLight ? "text-camry-graphite/60" : "text-zinc-400"} />}
                      title="Import Configuration"
                      subtitle="Restore settings from a JSON backup file"
                      tooltip="Restore configuration from local file"
                      iconAnimation="bounce"
                      right={
                        <Tooltip content="Restore system backup from JSON file" position="left">
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className={`px-3 py-1.5 text-xs font-martian rounded-lg transition-colors cursor-pointer ${isLight ? 'bg-camry-graphite/10 text-camry-blackout hover:bg-camry-graphite/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                          >
                            Restore
                          </button>
                        </Tooltip>
                      }
                    />
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Device Settings */}
                <div>
                  <div className={`font-martian text-xs mb-3 px-2 tracking-wider uppercase ${isLight ? 'text-camry-graphite/50' : 'text-zinc-400'}`}>DEVICE SETTINGS</div>
                  <div className={`border rounded-xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
                    <SettingRow 
                      icon={<Monitor size={18} className={isLight ? "text-camry-graphite/60" : "text-zinc-400"} />}
                      title="Device Information"
                      subtitle="NPU serial number, hardware specs & firmware version"
                      tooltip="View hardware specifications"
                      iconAnimation="scale"
                      right={<ChevronRight size={16} className={isLight ? "text-camry-graphite/40" : "text-zinc-500"} />}
                      onClick={() => setSettingsView('device_info')}
                    />
                    <div className={`h-[1px] ml-12 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                    <SettingRow 
                      icon={<Terminal size={18} className={isLight ? "text-camry-graphite/60" : "text-zinc-400"} />}
                      title="Developer Console"
                      subtitle="Low-level system logs & kernel telemetry"
                      tooltip="Open developer terminal console"
                      iconAnimation="wiggle"
                      right={<ChevronRight size={16} className={isLight ? "text-camry-graphite/40" : "text-zinc-500"} />}
                      onClick={() => setSettingsView('console')}
                    />
                    <div className={`h-[1px] ml-12 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                    <SettingRow 
                      icon={<HardDrive size={18} className={isLight ? "text-camry-graphite/60" : "text-zinc-400"} />}
                      title="Storage Space"
                      subtitle="Local NVMe SSD allocation and model weights"
                      tooltip="Manage local SSD storage"
                      iconAnimation="pulse"
                      right={
                        <div className="flex items-center gap-3">
                          <span className={`font-martian text-xs ${isLight ? 'text-camry-graphite/50' : 'text-zinc-400'}`}>142 / 1000 GB</span>
                          <ChevronRight size={16} className={isLight ? "text-camry-graphite/40" : "text-zinc-500"} />
                        </div>
                      }
                      onClick={() => setSettingsView('storage')}
                    />
                    <div className={`h-[1px] ml-12 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                    <SettingRow 
                      icon={<Wifi size={18} className={isLight ? "text-camry-graphite/60" : "text-zinc-400"} />}
                      title="Wi-Fi"
                      subtitle="Wireless network connection status"
                      tooltip="Configure Wi-Fi connection"
                      iconAnimation="scale"
                      right={
                        <div className="flex items-center gap-3">
                          <span className={`text-sm ${isLight ? 'text-camry-graphite/50' : 'text-zinc-400'}`}>Connected</span>
                          <ChevronRight size={16} className={isLight ? "text-camry-graphite/40" : "text-zinc-500"} />
                        </div>
                      }
                      onClick={() => setSettingsView('wifi')}
                    />
                    <div className={`h-[1px] ml-12 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                    <SettingRow 
                      icon={<Key size={18} className={isLight ? "text-camry-graphite/60" : "text-zinc-400"} />}
                      title="API key"
                      subtitle="Optional cloud provider API keys"
                      tooltip="Manage remote API keys"
                      iconAnimation="rotate"
                      right={<ChevronRight size={16} className={isLight ? "text-camry-graphite/40" : "text-zinc-500"} />}
                      onClick={() => setSettingsView('api_key')}
                    />
                    <div className={`h-[1px] ml-12 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                    <SettingRow 
                      icon={<ArrowLeft size={18} className={`rotate-90 ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`} />}
                      title="Update"
                      subtitle="Check for Camry OS software updates"
                      tooltip="Check for software updates"
                      iconAnimation="bounce"
                      right={
                        <div className="flex items-center gap-3">
                          <span className={`font-martian text-xs px-2 py-1 rounded font-semibold ${isLight ? 'text-camry-carrier bg-camry-carrier/10' : 'text-[#0066FF] bg-[#0066FF]/20'}`}>Update available</span>
                          <ChevronRight size={16} className={isLight ? "text-camry-graphite/40" : "text-zinc-500"} />
                        </div>
                      }
                      onClick={() => setSettingsView('update')}
                    />
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {settingsView === 'api_key' && (
          <motion.div 
            key="api_key"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-camry-paper' : 'bg-[#141418]'}`}
          >
            <ApiKeySubScreen onBack={() => setSettingsView('main')} />
          </motion.div>
        )}

        {settingsView === 'console' && (
          <motion.div 
            key="console"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-camry-paper' : 'bg-[#141418]'}`}
          >
            <DeveloperConsoleSubScreen onBack={() => setSettingsView('main')} />
          </motion.div>
        )}

        {settingsView === 'device_info' && (
          <motion.div 
            key="device_info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-camry-paper' : 'bg-[#141418]'}`}
          >
            <DeviceInfoSubScreen onBack={() => setSettingsView('main')} />
          </motion.div>
        )}

        {settingsView === 'storage' && (
          <motion.div 
            key="storage"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-camry-paper' : 'bg-[#141418]'}`}
          >
            <StorageSubScreen onBack={() => setSettingsView('main')} />
          </motion.div>
        )}

        {settingsView === 'wifi' && (
          <motion.div 
            key="wifi"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-camry-paper' : 'bg-[#141418]'}`}
          >
            <WifiSubScreen onBack={() => setSettingsView('main')} />
          </motion.div>
        )}

        {settingsView === 'update' && (
          <motion.div 
            key="update"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-camry-paper' : 'bg-[#141418]'}`}
          >
            <UpdateSubScreen onBack={() => setSettingsView('main')} />
          </motion.div>
        )}

        {settingsView === 'privacy' && (
          <motion.div 
            key="privacy"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-camry-paper' : 'bg-[#141418]'}`}
          >
            <PrivacySubScreen onBack={() => setSettingsView('main')} />
          </motion.div>
        )}

        {settingsView === 'team' && (
          <motion.div 
            key="team"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute inset-0 z-20 flex flex-col overflow-hidden ${isLight ? 'bg-camry-paper' : 'bg-[#141418]'}`}
          >
            <Team onBack={() => {
              setSettingsView('main');
              if (currentScreen === 'team') {
                setCurrentScreen('settings');
              }
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ApiKeySubScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { showToast, themeMode } = useAppContext();
  const isLight = themeMode !== 'dark';
  const [showKey, setShowKey] = useState(false);
  const [showRegenModal, setShowRegenModal] = useState(false);
  
  const baseUrl = "http://[fd80:7:7:7::1]:80/v1";
  const apiKey = "3ebd8372-8c87-4faf-8846-ac3d8f99e12c";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(baseUrl);
    showToast("Copied Base URL");
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    showToast("Copied API Key");
  };

  return (
    <>
      <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-camry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <Key size={20} className={`flex-shrink-0 ${isLight ? 'text-camry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-camry-blackout' : 'text-white'}`}>API key</h1>
      </div>

      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className={`font-martian text-xs mb-3 tracking-wider ${isLight ? 'text-camry-graphite/50' : 'text-zinc-400'}`}>API KEY</div>
        
        <div className={`border rounded-xl shadow-sm p-4 sm:p-6 space-y-6 sm:space-y-8 ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-camry-graphite' : 'text-zinc-300'}`}>API Base URL</label>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`flex-1 border rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 font-martian text-xs sm:text-sm truncate ${isLight ? 'bg-camry-graphite/5 border-black/5 text-camry-blackout' : 'bg-white/5 border-white/10 text-white'}`}>
                {baseUrl}
              </div>
              <button 
                onClick={handleCopyUrl}
                className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg border transition-all flex-shrink-0 ${isLight ? 'border-black/10 bg-white hover:bg-black/5 text-camry-graphite/60' : 'border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300'}`}
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-camry-graphite' : 'text-zinc-300'}`}>API Key</label>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`flex-1 border rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 font-martian text-xs sm:text-sm flex items-center justify-between min-w-0 ${isLight ? 'bg-camry-graphite/5 border-black/5 text-camry-blackout' : 'bg-white/5 border-white/10 text-white'}`}>
                <span className="truncate mr-2">{showKey ? apiKey : '••••••••••••••••••••••••••••••••••••'}</span>
                <button onClick={() => setShowKey(!showKey)} className={`flex-shrink-0 ${isLight ? 'text-camry-graphite/40 hover:text-black' : 'text-zinc-400 hover:text-white'}`}>
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button 
                onClick={handleCopyKey}
                className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg border transition-all flex-shrink-0 ${isLight ? 'border-black/10 bg-white hover:bg-black/5 text-camry-graphite/60' : 'border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300'}`}
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className={`pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isLight ? 'border-black/5' : 'border-white/10'}`}>
            <p className={`font-familjen text-xs sm:text-sm ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>
              Point any OpenAI-compatible tool at your Camry device. Nothing leaves the building.
            </p>
            <button 
              onClick={() => setShowRegenModal(true)}
              className="px-3.5 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap w-fit cursor-pointer"
            >
              Regenerate key
            </button>
          </div>

        </div>
      </div>

      {/* Regen Confirm Modal */}
      <AnimatePresence>
        {showRegenModal && (
          <div className={`absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${isLight ? 'bg-camry-paper/80' : 'bg-black/80'}`}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-xl shadow-xl p-5 sm:p-6 max-w-sm w-full ${isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'}`}
            >
              <h3 className={`font-bricolage text-lg sm:text-xl mb-2 ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Regenerate API key?</h3>
              <p className={`font-familjen text-xs sm:text-sm mb-6 ${isLight ? 'text-camry-graphite/70' : 'text-zinc-400'}`}>
                Any applications using the current key will immediately lose access to Camry. This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button onClick={() => setShowRegenModal(false)} className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium ${isLight ? 'hover:bg-black/5 text-zinc-700' : 'hover:bg-white/10 text-zinc-300'}`}>Cancel</button>
                <button onClick={() => setShowRegenModal(false)} className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-red-600 text-white hover:bg-red-700">Regenerate</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};


const DeveloperConsoleSubScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { themeMode } = useAppContext();
  const isLight = themeMode !== 'dark';
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const possibleLogs = [
    "[INFO] Model Syncing",
    "[DEBUG] Network Handshake Success",
    "[INFO] INIT SYSTEM MODEL SYNC...",
    "[INFO] POLLING NPU TENSORS [OK]",
    "[DEBUG] VRAM ALLOCATION: 18.2GB",
    "[INFO] INDEXING LOCAL VECTOR STORE...",
    "[DEBUG] BACKGROUND WORKER THREAD SPAWNED [PID 4092]",
    "[INFO] HEARTBEAT: ALIVE",
    "[WARN] WIFI INTERFACE wlan0: SIGNAL -42dBm",
    "[DEBUG] FLUSHING KV CACHE...",
    "[INFO] TENSOR CORE ACTIVITY: NORMAL",
    "[INFO] WATCHDOG: NO ANOMALIES DETECTED",
    "[INFO] FIRMWARE VERSION 1.0.3 - VALIDATED"
  ];

  useEffect(() => {
    setLogs([
      "[INFO] CAMRY OS KERNEL v1.0.3 BOOTING...",
      "[INFO] LOADING HARDWARE ABSTRACTION LAYER...",
      "[INFO] SYSTEM READY."
    ]);

    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = `[${new Date().toISOString()}] ${possibleLogs[Math.floor(Math.random() * possibleLogs.length)]}`;
        const nextLogs = [...prev, newLog];
        if (nextLogs.length > 50) return nextLogs.slice(nextLogs.length - 50);
        return nextLogs;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <>
      <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-camry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <Terminal size={20} className={`flex-shrink-0 ${isLight ? 'text-camry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Developer Console</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className={`font-martian text-[10px] tracking-wider ${isLight ? 'text-camry-graphite/70' : 'text-zinc-400'}`}>LIVE</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 sm:p-8 items-center justify-start overflow-hidden">
        <div className={`w-full max-w-4xl h-[380px] sm:h-[500px] border rounded-xl flex flex-col shadow-sm overflow-hidden relative ${isLight ? 'bg-camry-graphite border-black/10' : 'bg-[#18181C] border-white/10'}`}>
          
          <div className="flex items-center px-4 py-3 border-b border-black/20 bg-black/20 flex-shrink-0">
            <span className="font-martian text-xs text-white/50">camry-syslogd</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 font-martian text-[10px] sm:text-[11px] leading-loose text-emerald-400" ref={scrollRef}>
            {logs.map((log, i) => (
              <div key={i} className="mb-1 opacity-80 hover:opacity-100 transition-opacity break-all">
                <span className="text-white/40 mr-2 sm:mr-4">›</span>
                {log}
              </div>
            ))}
            <div className="animate-pulse inline-block w-2 h-4 bg-emerald-400 mt-1" />
          </div>

        </div>
      </div>
    </>
  );
};

const DeviceInfoSubScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { themeMode } = useAppContext();
  const isLight = themeMode !== 'dark';
  return (
    <>
      <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-camry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <Monitor size={20} className={`flex-shrink-0 ${isLight ? 'text-camry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Device Information</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className={`border rounded-xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
          <SettingRow title="Model" right={<span className={`text-xs sm:text-sm font-martian ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>Camry Gen 1</span>} />
          <div className={`h-[1px] ml-4 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
          <SettingRow title="Serial Number" right={<span className={`text-xs sm:text-sm font-martian ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>C1-X992-0041</span>} />
          <div className={`h-[1px] ml-4 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
          <SettingRow title="Firmware" right={<span className={`text-xs sm:text-sm font-martian ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>v1.0.3 (Stable)</span>} />
          <div className={`h-[1px] ml-4 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
          <SettingRow title="NPU Core" right={<span className={`text-xs sm:text-sm font-martian ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>Tensor V2 - 40 TOPS</span>} />
          <div className={`h-[1px] ml-4 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
          <SettingRow title="RAM" right={<span className={`text-xs sm:text-sm font-martian ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>32GB LPDDR5X</span>} />
        </div>
      </div>
    </>
  );
};

const StorageSubScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { themeMode } = useAppContext();
  const isLight = themeMode !== 'dark';
  return (
    <>
      <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-camry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <HardDrive size={20} className={`flex-shrink-0 ${isLight ? 'text-camry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Storage Space</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className={`border rounded-xl shadow-sm p-4 sm:p-8 ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
          <div className="flex items-end justify-between mb-2">
            <span className={`font-bricolage text-2xl sm:text-3xl ${isLight ? 'text-camry-blackout' : 'text-white'}`}>142 GB</span>
            <span className={`font-martian text-xs sm:text-sm ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>of 1000 GB used</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden flex mb-6 ${isLight ? 'bg-camry-graphite/10' : 'bg-white/10'}`}>
            <div className="h-full bg-[#0066FF]" style={{ width: '10%' }}></div>
            <div className="h-full bg-indigo-400" style={{ width: '3%' }}></div>
            <div className="h-full bg-emerald-400" style={{ width: '1.2%' }}></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#0066FF]"></div><span className={`font-medium ${isLight ? 'text-camry-graphite' : 'text-zinc-200'}`}>Models</span></div>
              <span className={`font-martian ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>100 GB</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-indigo-400"></div><span className={`font-medium ${isLight ? 'text-camry-graphite' : 'text-zinc-200'}`}>System</span></div>
              <span className={`font-martian ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>30 GB</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-emerald-400"></div><span className={`font-medium ${isLight ? 'text-camry-graphite' : 'text-zinc-200'}`}>User Data</span></div>
              <span className={`font-martian ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>12 GB</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const WifiSubScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { themeMode } = useAppContext();
  const isLight = themeMode !== 'dark';
  return (
    <>
      <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-camry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <Wifi size={20} className={`flex-shrink-0 ${isLight ? 'text-camry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Wi-Fi</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className={`border rounded-xl shadow-sm overflow-hidden mb-6 sm:mb-8 ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
          <SettingRow title="Wi-Fi" right={<Toggle defaultChecked />} />
        </div>
        <div className={`font-martian text-xs mb-3 px-2 tracking-wider ${isLight ? 'text-camry-graphite/50' : 'text-zinc-400'}`}>KNOWN NETWORKS</div>
        <div className={`border rounded-xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
          <SettingRow title="Nuvious-Corp-5G" right={<span className="text-xs sm:text-sm font-medium text-[#0066FF]">Connected</span>} />
          <div className={`h-[1px] ml-4 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
          <SettingRow title="Nuvious-Guest" right={<Lock size={16} className={isLight ? "text-camry-graphite/40" : "text-zinc-500"} />} />
          <div className={`h-[1px] ml-4 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
          <SettingRow title="Starbucks WiFi" right={<span className={`text-xs sm:text-sm ${isLight ? 'text-camry-graphite/40' : 'text-zinc-500'}`}>Saved</span>} />
        </div>
      </div>
    </>
  );
};

const UpdateSubScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { themeMode } = useAppContext();
  const isLight = themeMode !== 'dark';
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);

  const startUpdate = () => {
    setIsUpdating(true);
    let curr = 0;
    const interval = setInterval(() => {
      curr += 5;
      if (curr >= 100) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsUpdating(false);
          setProgress(0);
        }, 1000);
      } else {
        setProgress(curr);
      }
    }, 200);
  };

  return (
    <>
      <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-camry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <ArrowLeft size={20} className={`rotate-90 flex-shrink-0 ${isLight ? 'text-camry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Software Update</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className={`border rounded-xl shadow-sm p-5 sm:p-8 text-center ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
          <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${isLight ? 'bg-camry-graphite/5' : 'bg-white/5'}`}>
            <ArrowLeft size={28} className="text-[#0066FF] rotate-90" />
          </div>
          <h2 className={`text-lg sm:text-xl font-bricolage mb-2 ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Camry OS v1.0.4 is available</h2>
          <p className={`text-xs sm:text-sm mb-6 sm:mb-8 ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>This update includes performance improvements for local model inference and various bug fixes.</p>
          
          {isUpdating ? (
            <div className="max-w-md mx-auto">
              <div className={`flex justify-between text-xs font-martian mb-2 ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>
                <span>Downloading...</span>
                <span>{progress}%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-black/5' : 'bg-white/10'}`}>
                <div className="h-full bg-[#0066FF] transition-all duration-200" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <button 
              onClick={startUpdate}
              className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${isLight ? 'bg-camry-blackout text-white hover:bg-camry-graphite' : 'bg-[#0066FF] text-white hover:bg-blue-600'}`}
            >
              Download & Install
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const PrivacySubScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { themeMode } = useAppContext();
  const isLight = themeMode !== 'dark';
  return (
    <>
      <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-camry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <Shield size={20} className={`flex-shrink-0 ${isLight ? 'text-camry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Privacy Policy</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className={`border rounded-xl shadow-sm p-5 sm:p-8 ${isLight ? 'bg-white border-black/5 text-camry-graphite' : 'bg-[#1C1C22] border-white/10 text-zinc-300'}`}>
          <h3 className={`font-bricolage text-base sm:text-lg mb-3 ${isLight ? 'text-camry-blackout' : 'text-white'}`}>Your Data Stays With You.</h3>
          <p className="mb-3 text-xs sm:text-sm">
            The Camry device is designed as a local-first appliance. By default, all AI models execute locally on the device's internal Neural Processing Unit (NPU).
          </p>
          <p className="mb-3 text-xs sm:text-sm">
            - <strong>No telemetry</strong> is sent to Nuvious servers.<br/>
            - <strong>No conversational data</strong> leaves the device unless you explicitly configure a remote endpoint API key.<br/>
            - <strong>Models are downloaded directly</strong> to the local storage layer and air-gapped from cloud synchronization by default.
          </p>
          <p className="text-xs sm:text-sm">
            You are in complete control of your digital footprint. For more details on specific model licenses, please refer to the documentation included with each downloaded artifact.
          </p>
        </div>
      </div>
    </>
  );
};

// Mini Dashboard Component
const MiniDashboard: React.FC = () => {
  const { 
    allAgents, 
    installedAgents, 
    categories, 
    kbDocuments, 
    setCurrentScreen, 
    setActiveAgent,
    showToast,
    themeMode
  } = useAppContext();
  const isLight = themeMode !== 'dark';

  const activeInstalledAgents = allAgents.filter(a => installedAgents.includes(a.id));
  const activeCount = activeInstalledAgents.filter(a => a.status === 'active').length || activeInstalledAgents.length;

  const categoryStats = categories.map(cat => {
    const docCount = kbDocuments.filter(d => d.category === cat.name).length;
    let weight = docCount * 14 + 10;
    if (cat.name === 'Client Files') weight += 50;
    if (cat.name === 'Contracts') weight += 35;
    if (cat.name === 'Policies' || cat.name === 'Internal Policies') weight += 20;
    return {
      cat,
      docCount,
      weight
    };
  });

  const totalWeight = categoryStats.reduce((acc, c) => acc + c.weight, 0) || 1;
  const sortedCategories = [...categoryStats].sort((a, b) => b.weight - a.weight);

  return (
    <div className={`border rounded-2xl shadow-sm p-4 sm:p-6 space-y-5 ${isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'}`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${isLight ? 'border-black/10' : 'border-white/10'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl text-white shadow-xs ${isLight ? 'bg-camry-blackout' : 'bg-[#0066FF]'}`}>
            <AnimatedIcon type="spin">
              <Cpu size={20} />
            </AnimatedIcon>
          </div>
          <div>
            <h2 className={`font-bricolage font-bold text-base sm:text-lg flex items-center gap-2 ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
              <span>AI System & Knowledge Mini Dashboard</span>
              <span className="text-[10px] font-martian font-bold px-2 py-0.5 rounded-md uppercase bg-emerald-600 text-white shadow-xs">
                100% On-Device NPU
              </span>
            </h2>
            <p className={`text-xs font-familjen ${isLight ? 'text-camry-graphite/70' : 'text-zinc-400'}`}>
              Real-time local token metrics, active agent pipelines, and top knowledge categories
            </p>
          </div>
        </div>

        <Tooltip content="Refresh system telemetry & NPU stats" position="left">
          <button 
            onClick={() => showToast("Telemetry refreshed: All NPU clusters nominal")}
            className={`p-2 rounded-xl border transition-all cursor-pointer self-start sm:self-auto ${isLight ? 'border-black/10 hover:bg-black/5 text-camry-graphite' : 'border-white/10 hover:bg-white/5 text-zinc-300'}`}
          >
            <AnimatedIcon type="rotate">
              <Activity size={16} />
            </AnimatedIcon>
          </button>
        </Tooltip>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* CARD 1: TOTAL AI TOKENS USED */}
        <div className={`p-4 rounded-xl border space-y-3 relative overflow-hidden group ${isLight ? 'border-black/10 bg-gradient-to-br from-zinc-50 to-white' : 'border-white/10 bg-white/5'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-martian font-bold uppercase tracking-wider ${isLight ? 'text-camry-graphite/70' : 'text-zinc-400'}`}>
              Total AI Tokens Used
            </span>
            <Tooltip content="Tokens processed on local NPU hardware" position="top">
              <span className={`p-1.5 rounded-lg ${isLight ? 'bg-zinc-100 text-zinc-600' : 'bg-white/10 text-zinc-300'}`}>
                <AnimatedIcon type="bounce">
                  <Cpu size={14} />
                </AnimatedIcon>
              </span>
            </Tooltip>
          </div>

          <div>
            <div className={`text-2xl font-bricolage font-bold flex items-baseline gap-2 ${isLight ? 'text-camry-blackout' : 'text-white'}`}>
              <span>2,845,190</span>
              <span className="text-xs font-martian text-emerald-500 font-semibold">+12.4% today</span>
            </div>
            <p className={`text-[11px] mt-0.5 font-mono ${isLight ? 'text-camry-graphite/60' : 'text-zinc-400'}`}>
              ~1,480 tokens/sec local NPU speed
            </p>
          </div>

          {/* Token Breakdown Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] font-martian font-semibold">
              <span className={isLight ? "text-zinc-700" : "text-zinc-300"}>1,620,400 Prompt (57%)</span>
              <span className="text-emerald-500">1,224,790 Output (43%)</span>
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden flex ${isLight ? 'bg-zinc-200' : 'bg-white/10'}`}>
              <div className={`h-full transition-all duration-500 ${isLight ? 'bg-zinc-700' : 'bg-blue-500'}`} style={{ width: '57%' }} title="Prompt Input Tokens" />
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: '43%' }} title="Completion Output Tokens" />
            </div>
          </div>

          <div className={`text-[10px] pt-1 flex items-center justify-between border-t font-martian ${isLight ? 'text-camry-graphite/70 border-black/5' : 'text-zinc-400 border-white/10'}`}>
            <span>Estimated API Cost:</span>
            <span className="font-bold text-emerald-500 font-mono">$0.00 (Local NPU)</span>
          </div>
        </div>

        {/* CARD 2: ACTIVE AGENTS */}
        <div className={`p-4 rounded-xl border space-y-3 ${isLight ? 'border-black/10 bg-gradient-to-br from-zinc-50 to-white' : 'border-white/10 bg-white/5'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-martian font-bold uppercase tracking-wider ${isLight ? 'text-camry-graphite/70' : 'text-zinc-400'}`}>
              Active Agents
            </span>
            <Tooltip content="Installed local agent workflows" position="top">
              <span className={`p-1.5 rounded-lg ${isLight ? 'bg-purple-50 text-purple-600' : 'bg-purple-950/50 text-purple-300'}`}>
                <AnimatedIcon type="wiggle">
                  <Bot size={14} />
                </AnimatedIcon>
              </span>
            </Tooltip>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bricolage font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>{activeInstalledAgents.length}</span>
            <span className={`text-xs font-martian ${isLight ? 'text-camry-graphite' : 'text-zinc-400'}`}>Installed ({activeCount} Active)</span>
          </div>

          {/* Agent Status List */}
          <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 scrollbar-none">
            {activeInstalledAgents.map(agent => (
              <Tooltip key={agent.id} content={`Launch agent thread: ${agent.name}`} position="top" className="w-full">
                <div 
                  onClick={() => {
                    setActiveAgent(agent.id);
                    setCurrentScreen('chat');
                  }}
                  className={`flex items-center justify-between p-1.5 rounded-lg border cursor-pointer transition-all w-full ${isLight ? 'bg-white border-black/5 hover:border-black/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
                    <span className={`text-xs font-martian font-bold truncate ${isLight ? 'text-camry-blackout' : 'text-white'}`}>{agent.name}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${isLight ? 'bg-zinc-100 text-camry-graphite' : 'bg-white/10 text-zinc-300'}`}>
                    {agent.currentVersion || 'v1.0'}
                  </span>
                </div>
              </Tooltip>
            ))}
          </div>

          <button 
            onClick={() => setCurrentScreen('agentStore')}
            className={`w-full text-center py-1 rounded-lg text-[11px] font-martian font-bold hover:underline cursor-pointer ${isLight ? 'text-camry-deep-carrier bg-camry-carrier/10' : 'text-[#0066FF] bg-[#0066FF]/20'}`}
          >
            + Browse Agent Store
          </button>
        </div>

        {/* CARD 3: TOP-REQUESTED KNOWLEDGE CATEGORIES */}
        <div className={`p-4 rounded-xl border space-y-3 ${isLight ? 'border-black/10 bg-gradient-to-br from-zinc-50 to-white' : 'border-white/10 bg-white/5'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-martian font-bold uppercase tracking-wider ${isLight ? 'text-camry-graphite/70' : 'text-zinc-400'}`}>
              Top Requested Categories
            </span>
            <Tooltip content="Knowledge Base query load by category" position="top">
              <span className={`p-1.5 rounded-lg ${isLight ? 'bg-amber-50 text-amber-600' : 'bg-amber-950/50 text-amber-300'}`}>
                <AnimatedIcon type="scale">
                  <Layers size={14} />
                </AnimatedIcon>
              </span>
            </Tooltip>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto pr-1 scrollbar-none">
            {sortedCategories.slice(0, 4).map(({ cat, docCount, weight }) => {
              const percentage = Math.round((weight / totalWeight) * 100);
              return (
                <Tooltip key={cat.id} content={`${cat.name}: ${docCount} docs, ${percentage}% of queries`} position="top" className="w-full">
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between text-xs font-martian">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className={`font-bold truncate ${isLight ? 'text-camry-blackout' : 'text-white'}`}>{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] flex-shrink-0">
                        <span className={isLight ? "text-camry-graphite" : "text-zinc-400"}>{docCount} docs</span>
                        <span className={`font-bold ${isLight ? 'text-camry-blackout' : 'text-white'}`}>{percentage}%</span>
                      </div>
                    </div>
                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-zinc-200' : 'bg-white/10'}`}>
                      <div 
                        className="h-full transition-all duration-500 rounded-full" 
                        style={{ width: `${percentage}%`, backgroundColor: cat.color }} 
                      />
                    </div>
                  </div>
                </Tooltip>
              );
            })}
          </div>

          <div className={`text-[10px] pt-1 border-t italic font-martian ${isLight ? 'text-camry-graphite/60 border-black/5' : 'text-zinc-400 border-white/10'}`}>
            Highest AI retrieval load: Client Files & Contracts (67%)
          </div>
        </div>

      </div>
    </div>
  );
};

// Helpers

const SettingRow = ({ icon, title, subtitle, tooltip, iconAnimation = 'scale', right, onClick }: any) => {
  const { themeMode } = useAppContext();
  const isLight = themeMode !== 'dark';
  const Component = onClick ? 'button' : 'div';
  const rowContent = (
    <Component 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3.5 sm:p-4 gap-3 ${
        onClick ? (isLight ? 'hover:bg-camry-graphite/5 transition-colors text-left cursor-pointer group' : 'hover:bg-white/5 transition-colors text-left cursor-pointer group') : ''
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {icon && (
          <AnimatedIcon type={iconAnimation as IconAnimationType} className={isLight ? 'text-camry-blackout group-hover:text-camry-carrier' : 'text-zinc-300 group-hover:text-[#0066FF]'}>
            {icon}
          </AnimatedIcon>
        )}
        <div className="min-w-0 flex-1">
          <div className={`font-medium text-xs sm:text-sm truncate ${isLight ? 'text-camry-blackout' : 'text-white'}`}>{title}</div>
          {subtitle && <div className={`text-[10px] sm:text-xs font-martian mt-0.5 truncate ${isLight ? 'text-camry-graphite/50' : 'text-zinc-400'}`}>{subtitle}</div>}
        </div>
      </div>
      <div className="flex-shrink-0 ml-2">{right}</div>
    </Component>
  );

  if (tooltip) {
    return <Tooltip content={tooltip} position="top" className="w-full">{rowContent}</Tooltip>;
  }

  return rowContent;
};

const Toggle = ({ defaultChecked = false }: { defaultChecked?: boolean }) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button 
      onClick={() => setOn(!on)}
      className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${on ? 'bg-[#0066FF]' : 'bg-zinc-500/40'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
};
