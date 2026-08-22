import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../store/AppContext';
import { ChevronRight, Shield, Power, Monitor, HardDrive, Wifi, Network, Key, ArrowLeft, Copy, Eye, EyeOff, Check, Terminal, Lock, Download, Upload, FileCode, Users, Cpu, Bot, Layers, Activity, BarChart2, RefreshCw, Loader2, Play, Pause, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Team } from './Team';
import { Tooltip } from '../components/Tooltip';
import { AnimatedIcon, IconAnimationType } from '../components/AnimatedIcon';
import { KamryLogo } from '../components/KamryLogo';
import { CustomSelect } from '../components/CustomSelect';

export const Settings: React.FC = () => {
  const { currentScreen, setCurrentScreen, settingsView, setSettingsView, showToast, exportConfig, importConfig, teamMembers, currentRole, setCurrentRole, themeMode } = useAppContext();
  const isLight = themeMode !== 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'hardware' | 'developer' | 'system'>('overview');

  useEffect(() => {
    if (currentScreen === 'team') {
      setActiveTab('team');
      setSettingsView('main');
    } else if (currentScreen === 'dashboard') {
      setActiveTab('overview');
      setSettingsView('main');
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
    <div className={`flex-1 h-full flex flex-col overflow-y-auto kamry-page-container kamry-section-gap relative ${isLight ? 'bg-kamry-paper' : 'bg-[#141418]'}`}>
      <AnimatePresence mode="wait">
        {settingsView === 'main' && (
          <motion.div 
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col space-y-6"
          >
            {/* Header & Main Navigation Tabs */}
            <div className={`pb-4 border-b shrink-0 space-y-4 ${isLight ? 'bg-kamry-paper border-black/10' : 'bg-[#141418] border-white/10'}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className={`kamry-h1-title ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Settings & System Management</h1>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  NPU Online • Air-Gapped
                </span>
              </div>

              {/* Navigation Tabs */}
              <div className={`flex items-center gap-3 p-1 rounded-xl border overflow-x-auto scrollbar-none ${
                isLight ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/10'
              }`}>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'overview'
                      ? (isLight ? 'bg-white text-kamry-blackout shadow-xs font-bold' : 'bg-[#0EA5E9] text-white shadow-xs font-bold')
                      : (isLight ? 'text-zinc-600 hover:text-black hover:bg-black/5' : 'text-zinc-400 hover:text-white hover:bg-white/5')
                  }`}
                >
                  <BarChart2 size={15} />
                  <span>Overview & Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('team')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'team'
                      ? (isLight ? 'bg-white text-kamry-blackout shadow-xs font-bold' : 'bg-[#0EA5E9] text-white shadow-xs font-bold')
                      : (isLight ? 'text-zinc-600 hover:text-black hover:bg-black/5' : 'text-zinc-400 hover:text-white hover:bg-white/5')
                  }`}
                >
                  <Users size={15} />
                  <span>Team & Access ({teamMembers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('hardware')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'hardware'
                      ? (isLight ? 'bg-white text-kamry-blackout shadow-xs font-bold' : 'bg-[#0EA5E9] text-white shadow-xs font-bold')
                      : (isLight ? 'text-zinc-600 hover:text-black hover:bg-black/5' : 'text-zinc-400 hover:text-white hover:bg-white/5')
                  }`}
                >
                  <Cpu size={15} />
                  <span>Hardware & Power</span>
                </button>

                <button
                  onClick={() => setActiveTab('developer')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'developer'
                      ? (isLight ? 'bg-white text-kamry-blackout shadow-xs font-bold' : 'bg-[#0EA5E9] text-white shadow-xs font-bold')
                      : (isLight ? 'text-zinc-600 hover:text-black hover:bg-black/5' : 'text-zinc-400 hover:text-white hover:bg-white/5')
                  }`}
                >
                  <Key size={15} />
                  <span>API Keys & Console</span>
                </button>

                <button
                  onClick={() => setActiveTab('system')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'system'
                      ? (isLight ? 'bg-white text-kamry-blackout shadow-xs font-bold' : 'bg-[#0EA5E9] text-white shadow-xs font-bold')
                      : (isLight ? 'text-zinc-600 hover:text-black hover:bg-black/5' : 'text-zinc-400 hover:text-white hover:bg-white/5')
                  }`}
                >
                  <SettingsIcon size={15} />
                  <span>System & Backup</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* TAB 1: OVERVIEW & TELEMETRY */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <AnalyticsSubScreen />
                </div>
              )}

              {/* TAB 2: TEAM & ACCESS CONTROL */}
              {activeTab === 'team' && (
                <div className="space-y-6">
                  <Team />
                </div>
              )}

              {/* TAB 3: HARDWARE & POWER */}
              {activeTab === 'hardware' && (
                <div className="space-y-6">
                  <div className={`font-martian text-xs mb-3 px-2 tracking-wider uppercase ${isLight ? 'text-kamry-graphite/50' : 'text-zinc-400'}`}>HARDWARE & PERFORMANCE</div>
                  <div className={`border rounded-xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
                    <SettingRow 
                      icon={<Monitor size={18} className={isLight ? "text-kamry-graphite/60" : "text-zinc-400"} />}
                      title="Device Information"
                      subtitle="NPU serial number, hardware specs & firmware version"
                      tooltip="View hardware specifications"
                      iconAnimation="scale"
                      right={<ChevronRight size={16} className={isLight ? "text-kamry-graphite/40" : "text-zinc-500"} />}
                      onClick={() => setSettingsView('device_info')}
                    />
                    <div className={`h-[1px] ml-12 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                    <SettingRow 
                      icon={<HardDrive size={18} className={isLight ? "text-kamry-graphite/60" : "text-zinc-400"} />}
                      title="Storage Space"
                      subtitle="Local NVMe SSD allocation and model weights"
                      tooltip="Manage local SSD storage"
                      iconAnimation="pulse"
                      right={
                        <div className="flex items-center gap-3">
                          <span className={`font-martian text-xs ${isLight ? 'text-kamry-graphite/50' : 'text-zinc-400'}`}>142 / 1000 GB</span>
                          <ChevronRight size={16} className={isLight ? "text-kamry-graphite/40" : "text-zinc-500"} />
                        </div>
                      }
                      onClick={() => setSettingsView('storage')}
                    />
                    <div className={`h-[1px] ml-12 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                    <SettingRow 
                      icon={<Wifi size={18} className={isLight ? "text-kamry-graphite/60" : "text-zinc-400"} />}
                      title="Wi-Fi & Network"
                      subtitle="Wireless network connection status"
                      tooltip="Configure Wi-Fi connection"
                      iconAnimation="scale"
                      right={
                        <div className="flex items-center gap-3">
                          <span className={`text-sm ${isLight ? 'text-kamry-graphite/50' : 'text-zinc-400'}`}>Connected</span>
                          <ChevronRight size={16} className={isLight ? "text-kamry-graphite/40" : "text-zinc-500"} />
                        </div>
                      }
                      onClick={() => setSettingsView('wifi')}
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: API KEYS & DEVELOPER */}
              {activeTab === 'developer' && (
                <div className="space-y-6">
                  <div className={`font-martian text-xs mb-3 px-2 tracking-wider uppercase ${isLight ? 'text-kamry-graphite/50' : 'text-zinc-400'}`}>DEVELOPER TOOLS & API</div>
                  <div className={`border rounded-xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
                    <SettingRow 
                      icon={<Key size={18} className={isLight ? "text-kamry-graphite/60" : "text-zinc-400"} />}
                      title="API Keys & Local Base URL"
                      subtitle="Base URL: http://[fd80:7:7:7::1]:80/v1 • Manage developer credentials"
                      tooltip="Manage remote API keys"
                      iconAnimation="rotate"
                      right={<ChevronRight size={16} className={isLight ? "text-kamry-graphite/40" : "text-zinc-500"} />}
                      onClick={() => setSettingsView('api_key')}
                    />
                    <div className={`h-[1px] ml-12 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                    <SettingRow 
                      icon={<Terminal size={18} className={isLight ? "text-kamry-graphite/60" : "text-zinc-400"} />}
                      title="Developer Terminal Console"
                      subtitle="Low-level system logs & kernel telemetry"
                      tooltip="Open developer terminal console"
                      iconAnimation="wiggle"
                      right={<ChevronRight size={16} className={isLight ? "text-kamry-graphite/40" : "text-zinc-500"} />}
                      onClick={() => setSettingsView('console')}
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: SYSTEM & BACKUP */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  {/* View As Role Selector */}
                  <div className={`border rounded-xl shadow-sm overflow-hidden p-4 sm:p-5 space-y-4 ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className={`text-sm font-semibold block ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Access Role Simulation (View As)</label>
                        <p className={`text-xs font-familjen ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>
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
                  </div>

                  {/* Software Settings */}
                  <div>
                    <div className={`font-martian text-xs mb-3 px-2 tracking-wider uppercase ${isLight ? 'text-kamry-graphite/50' : 'text-zinc-400'}`}>SOFTWARE PREFERENCES</div>
                    <div className={`border rounded-xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
                      <SettingRow 
                        icon={<Power size={18} className={isLight ? "text-kamry-graphite/60" : "text-zinc-400"} />}
                        title="Auto Start"
                        subtitle="Automatically launch Kamry OS on device boot"
                        tooltip="Toggle auto boot behavior"
                        iconAnimation="bounce"
                        right={<Toggle defaultChecked />}
                      />
                      <div className={`h-[1px] ml-12 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                      <SettingRow 
                        icon={<Shield size={18} className={isLight ? "text-kamry-graphite/60" : "text-zinc-400"} />}
                        title="Privacy Policy"
                        subtitle="View zero-telemetry & on-device data guarantee"
                        tooltip="Read local privacy policy"
                        iconAnimation="scale"
                        right={<ChevronRight size={16} className={isLight ? "text-kamry-graphite/40" : "text-zinc-500"} />}
                        onClick={() => setSettingsView('privacy')}
                      />
                      <div className={`h-[1px] ml-12 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                      <SettingRow 
                        icon={<ArrowLeft size={18} className={`rotate-90 ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`} />}
                        title="Software Update"
                        subtitle="Check for Kamry OS updates"
                        tooltip="Check for software updates"
                        iconAnimation="bounce"
                        right={
                          <div className="flex items-center gap-3">
                            <span className={`font-martian text-xs px-2 py-1 rounded font-semibold ${isLight ? 'text-kamry-carrier bg-kamry-carrier/10' : 'text-[#0EA5E9] bg-[#0EA5E9]/20'}`}>Update available</span>
                            <ChevronRight size={16} className={isLight ? "text-kamry-graphite/40" : "text-zinc-500"} />
                          </div>
                        }
                        onClick={() => setSettingsView('update')}
                      />
                    </div>
                  </div>

                  {/* Backup & Portability Settings */}
                  <div>
                    <div className={`font-martian text-xs mb-3 px-2 tracking-wider uppercase ${isLight ? 'text-kamry-graphite/50' : 'text-zinc-400'}`}>BACKUP & PORTABILITY</div>
                    <div className={`border rounded-xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
                      <SettingRow 
                        icon={<Download size={18} className={isLight ? "text-kamry-carrier" : "text-[#0EA5E9]"} />}
                        title="Export Configuration & Agents"
                        subtitle="Save system preferences and agents to JSON file"
                        tooltip="Download backup JSON configuration"
                        iconAnimation="bounce"
                        right={
                          <Tooltip content="Export settings & agents JSON" position="left">
                            <button 
                              onClick={exportConfig}
                              className={`px-3 py-1.5 text-xs font-martian rounded-lg transition-colors shadow-sm cursor-pointer ${isLight ? 'bg-kamry-blackout text-white hover:bg-kamry-graphite' : 'bg-[#0EA5E9] text-white hover:bg-blue-600'}`}
                            >
                              Export JSON
                            </button>
                          </Tooltip>
                        }
                      />
                      <div className={`h-[1px] ml-12 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
                      <SettingRow 
                        icon={<Upload size={18} className={isLight ? "text-kamry-graphite/60" : "text-zinc-400"} />}
                        title="Import Configuration"
                        subtitle="Restore settings from a JSON backup file"
                        tooltip="Restore configuration from local file"
                        iconAnimation="bounce"
                        right={
                          <Tooltip content="Restore system backup from JSON file" position="left">
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className={`px-3 py-1.5 text-xs font-martian rounded-lg transition-colors cursor-pointer ${isLight ? 'bg-kamry-graphite/10 text-kamry-blackout hover:bg-kamry-graphite/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
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
                </div>
              )}
            </div>
          </motion.div>
        )}

        {settingsView === 'api_key' && (
          <motion.div 
            key="api_key"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-kamry-paper' : 'bg-[#141418]'}`}
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
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-kamry-paper' : 'bg-[#141418]'}`}
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
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-kamry-paper' : 'bg-[#141418]'}`}
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
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-kamry-paper' : 'bg-[#141418]'}`}
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
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-kamry-paper' : 'bg-[#141418]'}`}
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
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-kamry-paper' : 'bg-[#141418]'}`}
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
            className={`absolute inset-0 z-20 flex flex-col ${isLight ? 'bg-kamry-paper' : 'bg-[#141418]'}`}
          >
            <PrivacySubScreen onBack={() => setSettingsView('main')} />
          </motion.div>
        )}

        {settingsView === 'analytics' && (
          <motion.div 
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute inset-0 z-20 flex flex-col overflow-hidden ${isLight ? 'bg-kamry-paper' : 'bg-[#141418]'}`}
          >
            <AnalyticsSubScreen onBack={() => {
              setSettingsView('main');
              if (currentScreen === 'dashboard') {
                setCurrentScreen('settings');
              }
            }} />
          </motion.div>
        )}

        {settingsView === 'team' && (
          <motion.div 
            key="team"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute inset-0 z-20 flex flex-col overflow-hidden ${isLight ? 'bg-kamry-paper' : 'bg-[#141418]'}`}
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
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-kamry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <Key size={20} className={`flex-shrink-0 ${isLight ? 'text-kamry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>API key</h1>
      </div>

      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className={`font-martian text-xs mb-3 tracking-wider ${isLight ? 'text-kamry-graphite/50' : 'text-zinc-400'}`}>API KEY</div>
        
        <div className={`border rounded-xl shadow-sm p-4 sm:p-6 space-y-6 sm:space-y-8 ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-kamry-graphite' : 'text-zinc-300'}`}>API Base URL</label>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`flex-1 border rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 font-martian text-xs sm:text-sm truncate ${isLight ? 'bg-kamry-graphite/5 border-black/5 text-kamry-blackout' : 'bg-white/5 border-white/10 text-white'}`}>
                {baseUrl}
              </div>
              <button 
                onClick={handleCopyUrl}
                className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg border transition-all flex-shrink-0 ${isLight ? 'border-black/10 bg-white hover:bg-black/5 text-kamry-graphite/60' : 'border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300'}`}
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-kamry-graphite' : 'text-zinc-300'}`}>API Key</label>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`flex-1 border rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 font-martian text-xs sm:text-sm flex items-center justify-between min-w-0 ${isLight ? 'bg-kamry-graphite/5 border-black/5 text-kamry-blackout' : 'bg-white/5 border-white/10 text-white'}`}>
                <span className="truncate mr-2">{showKey ? apiKey : '••••••••••••••••••••••••••••••••••••'}</span>
                <button onClick={() => setShowKey(!showKey)} className={`flex-shrink-0 ${isLight ? 'text-kamry-graphite/40 hover:text-black' : 'text-zinc-400 hover:text-white'}`}>
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button 
                onClick={handleCopyKey}
                className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg border transition-all flex-shrink-0 ${isLight ? 'border-black/10 bg-white hover:bg-black/5 text-kamry-graphite/60' : 'border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300'}`}
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className={`pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isLight ? 'border-black/5' : 'border-white/10'}`}>
            <p className={`font-familjen text-xs sm:text-sm ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>
              Point any OpenAI-compatible tool at your Kamry device. Nothing leaves the building.
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
          <div className={`absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${isLight ? 'bg-kamry-paper/80' : 'bg-black/80'}`}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-xl shadow-xl p-5 sm:p-6 max-w-sm w-full ${isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'}`}
            >
              <h3 className={`font-bricolage text-lg sm:text-xl mb-2 ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Regenerate API key?</h3>
              <p className={`font-familjen text-xs sm:text-sm mb-6 ${isLight ? 'text-kamry-graphite/70' : 'text-zinc-400'}`}>
                Any applications using the current key will immediately lose access to Kamry. This action cannot be undone.
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
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-kamry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <Terminal size={20} className={`flex-shrink-0 ${isLight ? 'text-kamry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Developer Console</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className={`font-martian text-[10px] tracking-wider ${isLight ? 'text-kamry-graphite/70' : 'text-zinc-400'}`}>LIVE</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 sm:p-8 items-center justify-start overflow-hidden">
        <div className={`w-full max-w-4xl h-[380px] sm:h-[500px] border rounded-xl flex flex-col shadow-sm overflow-hidden relative ${isLight ? 'bg-kamry-graphite border-black/10' : 'bg-[#18181C] border-white/10'}`}>
          
          <div className="flex items-center px-4 py-3 border-b border-black/20 bg-black/20 flex-shrink-0">
            <span className="font-martian text-xs text-white/50">kamry-syslogd</span>
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
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-kamry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <Monitor size={20} className={`flex-shrink-0 ${isLight ? 'text-kamry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Device Information</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className={`border rounded-xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
          <SettingRow title="Model" right={<span className={`text-xs sm:text-sm font-martian ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>Kamry Gen 1</span>} />
          <div className={`h-[1px] ml-4 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
          <SettingRow title="Serial Number" right={<span className={`text-xs sm:text-sm font-martian ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>C1-X992-0041</span>} />
          <div className={`h-[1px] ml-4 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
          <SettingRow title="Firmware" right={<span className={`text-xs sm:text-sm font-martian ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>v1.0.3 (Stable)</span>} />
          <div className={`h-[1px] ml-4 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
          <SettingRow title="NPU Core" right={<span className={`text-xs sm:text-sm font-martian ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>Tensor V2 - 40 TOPS</span>} />
          <div className={`h-[1px] ml-4 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
          <SettingRow title="RAM" right={<span className={`text-xs sm:text-sm font-martian ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>32GB LPDDR5X</span>} />
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
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-kamry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <HardDrive size={20} className={`flex-shrink-0 ${isLight ? 'text-kamry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Storage Space</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className={`border rounded-xl shadow-sm p-4 sm:p-8 ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
          <div className="flex items-end justify-between mb-2">
            <span className={`font-bricolage text-2xl sm:text-3xl ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>142 GB</span>
            <span className={`font-martian text-xs sm:text-sm ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>of 1000 GB used</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden flex mb-6 ${isLight ? 'bg-kamry-graphite/10' : 'bg-white/10'}`}>
            <div className="h-full bg-[#0EA5E9]" style={{ width: '10%' }}></div>
            <div className="h-full bg-indigo-400" style={{ width: '3%' }}></div>
            <div className="h-full bg-emerald-400" style={{ width: '1.2%' }}></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#0EA5E9]"></div><span className={`font-medium ${isLight ? 'text-kamry-graphite' : 'text-zinc-200'}`}>Models</span></div>
              <span className={`font-martian ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>100 GB</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-indigo-400"></div><span className={`font-medium ${isLight ? 'text-kamry-graphite' : 'text-zinc-200'}`}>System</span></div>
              <span className={`font-martian ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>30 GB</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-emerald-400"></div><span className={`font-medium ${isLight ? 'text-kamry-graphite' : 'text-zinc-200'}`}>User Data</span></div>
              <span className={`font-martian ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>12 GB</span>
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
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-kamry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <Wifi size={20} className={`flex-shrink-0 ${isLight ? 'text-kamry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Wi-Fi</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className={`border rounded-xl shadow-sm overflow-hidden mb-6 sm:mb-8 ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
          <SettingRow title="Wi-Fi" right={<Toggle defaultChecked />} />
        </div>
        <div className={`font-martian text-xs mb-3 px-2 tracking-wider ${isLight ? 'text-kamry-graphite/50' : 'text-zinc-400'}`}>KNOWN NETWORKS</div>
        <div className={`border rounded-xl shadow-sm overflow-hidden ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
          <SettingRow title="Nuvious-Corp-5G" right={<span className="text-xs sm:text-sm font-medium text-[#0EA5E9]">Connected</span>} />
          <div className={`h-[1px] ml-4 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
          <SettingRow title="Nuvious-Guest" right={<Lock size={16} className={isLight ? "text-kamry-graphite/40" : "text-zinc-500"} />} />
          <div className={`h-[1px] ml-4 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}></div>
          <SettingRow title="Starbucks WiFi" right={<span className={`text-xs sm:text-sm ${isLight ? 'text-kamry-graphite/40' : 'text-zinc-500'}`}>Saved</span>} />
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
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-kamry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <ArrowLeft size={20} className={`rotate-90 flex-shrink-0 ${isLight ? 'text-kamry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Software Update</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className={`border rounded-xl shadow-sm p-5 sm:p-8 text-center ${isLight ? 'bg-white border-black/5' : 'bg-[#1C1C22] border-white/10'}`}>
          <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${isLight ? 'bg-kamry-graphite/5' : 'bg-white/5'}`}>
            <ArrowLeft size={28} className="text-[#0EA5E9] rotate-90" />
          </div>
          <h2 className={`text-lg sm:text-xl font-bricolage mb-2 ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Kamry OS v1.0.4 is available</h2>
          <p className={`text-xs sm:text-sm mb-6 sm:mb-8 ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>This update includes performance improvements for local model inference and various bug fixes.</p>
          
          {isUpdating ? (
            <div className="max-w-md mx-auto">
              <div className={`flex justify-between text-xs font-martian mb-2 ${isLight ? 'text-kamry-graphite/60' : 'text-zinc-400'}`}>
                <span>Downloading...</span>
                <span>{progress}%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-black/5' : 'bg-white/10'}`}>
                <div className="h-full bg-[#0EA5E9] transition-all duration-200" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <button 
              onClick={startUpdate}
              className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${isLight ? 'bg-kamry-blackout text-white hover:bg-kamry-graphite' : 'bg-[#0EA5E9] text-white hover:bg-blue-600'}`}
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
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-black/5 text-kamry-graphite/60 hover:text-black' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}>
          <ArrowLeft size={20} />
        </button>
        <Shield size={20} className={`flex-shrink-0 ${isLight ? 'text-kamry-blackout' : 'text-white'}`} />
        <h1 className={`text-xl sm:text-2xl font-bricolage ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Privacy Policy</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className={`border rounded-xl shadow-sm p-5 sm:p-8 ${isLight ? 'bg-white border-black/5 text-kamry-graphite' : 'bg-[#1C1C22] border-white/10 text-zinc-300'}`}>
          <h3 className={`font-bricolage text-base sm:text-lg mb-3 ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>Your Data Stays With You.</h3>
          <p className="mb-3 text-xs sm:text-sm">
            The Kamry device is designed as a local-first appliance. By default, all AI models execute locally on the device's internal Neural Processing Unit (NPU).
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
    setSettingsView,
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
          <div className="p-2.5 rounded-xl text-white bg-black shadow-xs flex items-center justify-center">
            <AnimatedIcon type="spin">
              <Cpu size={20} className="text-white" />
            </AnimatedIcon>
          </div>
          <div>
            <h2 className={`font-bricolage font-bold text-base sm:text-lg flex items-center gap-2 ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>
              <span>AI System & Knowledge Dashboard</span>
              <span className="text-[10px] font-martian font-bold px-2.5 py-0.5 rounded-md uppercase bg-zinc-800 text-white shadow-xs tracking-wider">
                100% ON-DEVICE NPU
              </span>
            </h2>
            <p className={`text-xs font-familjen ${isLight ? 'text-kamry-graphite/70' : 'text-zinc-400'}`}>
              Real-time local token metrics, active agent pipelines, and top knowledge categories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button 
            onClick={() => setSettingsView('analytics')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer shadow-2xs ${
              isLight 
                ? 'bg-black text-white hover:bg-zinc-800' 
                : 'bg-sky-500 text-white hover:bg-sky-600'
            }`}
          >
            <BarChart2 size={14} />
            <span>Full Telemetry</span>
          </button>

          <Tooltip content="Refresh system telemetry & NPU stats" position="left">
            <button 
              onClick={() => showToast("Telemetry refreshed: All NPU clusters nominal")}
              className={`p-2 rounded-xl border transition-all cursor-pointer shadow-xs ${
                isLight ? 'border-black/10 bg-white hover:bg-zinc-50 text-zinc-700' : 'border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300'
              }`}
            >
              <AnimatedIcon type="rotate">
                <Activity size={18} />
              </AnimatedIcon>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* CARD 1: TOTAL AI TOKENS USED */}
        <div className={`p-4 rounded-xl border space-y-3 relative overflow-hidden ${isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-white/5'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-martian font-bold uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              TOTAL AI TOKENS USED
            </span>
            <Tooltip content="Tokens processed on local NPU hardware" position="top">
              <span className={`p-1.5 rounded-lg border ${isLight ? 'bg-zinc-100/80 border-black/5 text-zinc-600' : 'bg-white/10 border-white/5 text-zinc-300'}`}>
                <AnimatedIcon type="bounce">
                  <Cpu size={14} />
                </AnimatedIcon>
              </span>
            </Tooltip>
          </div>

          <div>
            <div className={`text-2xl font-bricolage font-bold flex items-baseline gap-2 ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>
              <span>2,845,190</span>
              <span className="text-xs font-martian text-zinc-500 font-medium">+12.4% today</span>
            </div>
            <p className={`text-[11px] mt-0.5 font-sans ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              ~1,480 tokens/sec local NPU speed
            </p>
          </div>

          {/* Token Breakdown Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-martian font-semibold">
              <span className={isLight ? "text-zinc-800" : "text-zinc-200"}>1,620,400 Prompt (57%)</span>
              <span className={isLight ? "text-zinc-800" : "text-zinc-200"}>1,224,790 Output (43%)</span>
            </div>
            <div className={`h-2.5 w-full rounded-full overflow-hidden flex ${isLight ? 'bg-zinc-200' : 'bg-white/10'}`}>
              <div className="h-full bg-[#3F3F46] transition-all duration-500" style={{ width: '57%' }} title="Prompt Input Tokens (57%)" />
              <div className="h-full bg-[#A1A1AA] transition-all duration-500" style={{ width: '43%' }} title="Completion Output Tokens (43%)" />
            </div>
          </div>

          <div className={`text-[11px] pt-1 flex items-center justify-between border-t font-martian ${isLight ? 'text-zinc-500 border-black/5' : 'text-zinc-400 border-white/10'}`}>
            <span>Estimated API Cost:</span>
            <span className={`font-bold font-mono ${isLight ? 'text-zinc-800' : 'text-white'}`}>$0.00 (Local NPU)</span>
          </div>
        </div>

        {/* CARD 2: ACTIVE AGENTS */}
        <div className={`p-4 rounded-xl border space-y-3 ${isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-white/5'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-martian font-bold uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              ACTIVE AGENTS
            </span>
            <Tooltip content="Installed local agent workflows" position="top">
              <span className={`p-1.5 rounded-lg border ${isLight ? 'bg-sky-50 border-sky-100 text-sky-600' : 'bg-sky-950/50 border-sky-800/40 text-sky-300'}`}>
                <AnimatedIcon type="wiggle">
                  <Bot size={14} />
                </AnimatedIcon>
              </span>
            </Tooltip>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bricolage font-bold ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>{activeInstalledAgents.length}</span>
            <span className={`text-xs font-martian ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Installed ({activeCount} Active)</span>
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
                  className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all w-full ${isLight ? 'bg-zinc-50/80 border-black/5 hover:border-black/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-zinc-400" />
                    <span className={`text-xs font-bold truncate ${isLight ? 'text-zinc-900' : 'text-white'}`}>{agent.name}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold border ${isLight ? 'bg-zinc-100 border-black/5 text-zinc-600' : 'bg-white/10 border-white/10 text-zinc-300'}`}>
                    {agent.currentVersion || 'V1.2.0'}
                  </span>
                </div>
              </Tooltip>
            ))}
          </div>

          <button 
            onClick={() => setCurrentScreen('agentStore')}
            className="w-full text-center py-2 rounded-xl text-xs font-martian font-bold transition-all cursor-pointer bg-[#E0F2FE] hover:bg-sky-200 text-[#0284C7] border border-sky-200/80 shadow-2xs"
          >
            + Browse Agent Store
          </button>
        </div>

        {/* CARD 3: TOP-REQUESTED KNOWLEDGE CATEGORIES */}
        <div className={`p-4 rounded-xl border space-y-3 ${isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-white/5'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-martian font-bold uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              TOP REQUESTED CATEGORIES
            </span>
            <Tooltip content="Knowledge Base query load by category" position="top">
              <span className={`p-1.5 rounded-lg border ${isLight ? 'bg-zinc-100/80 border-black/5 text-zinc-600' : 'bg-white/10 border-white/5 text-zinc-300'}`}>
                <AnimatedIcon type="scale">
                  <Layers size={14} />
                </AnimatedIcon>
              </span>
            </Tooltip>
          </div>

          <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1 scrollbar-none">
            {[
              { name: 'Client Files', count: 2, pct: 28, color: '#2563EB' },
              { name: 'Contracts', count: 2, pct: 23, color: '#10B981' },
              { name: 'Internal Policies', count: 2, pct: 18, color: '#06B6D4' },
              { name: 'Finance', count: 2, pct: 12, color: '#EF4444' }
            ].map((catItem) => (
              <Tooltip key={catItem.name} content={`${catItem.name}: ${catItem.count} docs, ${catItem.pct}% load`} position="top" className="w-full">
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between text-xs font-martian">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: catItem.color }} />
                      <span className={`font-bold truncate ${isLight ? 'text-zinc-900' : 'text-white'}`}>{catItem.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-sans text-[11px] flex-shrink-0">
                      <span className={isLight ? "text-zinc-500" : "text-zinc-400"}>{catItem.count} docs</span>
                      <span className={`font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>{catItem.pct}%</span>
                    </div>
                  </div>
                  <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-zinc-100' : 'bg-white/10'}`}>
                    <div 
                      className="h-full transition-all duration-500 rounded-full" 
                      style={{ width: `${catItem.pct}%`, backgroundColor: catItem.color }} 
                    />
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>

          <div className={`text-[11px] pt-2 border-t italic font-sans ${isLight ? 'text-zinc-500 border-black/5' : 'text-zinc-400 border-white/10'}`}>
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
        onClick ? (isLight ? 'hover:bg-kamry-graphite/5 transition-colors text-left cursor-pointer group' : 'hover:bg-white/5 transition-colors text-left cursor-pointer group') : ''
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {icon && (
          <AnimatedIcon type={iconAnimation as IconAnimationType} className={isLight ? 'text-kamry-blackout group-hover:text-kamry-carrier' : 'text-zinc-300 group-hover:text-[#0EA5E9]'}>
            {icon}
          </AnimatedIcon>
        )}
        <div className="min-w-0 flex-1">
          <div className={`font-medium text-xs sm:text-sm truncate ${isLight ? 'text-kamry-blackout' : 'text-white'}`}>{title}</div>
          {subtitle && <div className={`text-[10px] sm:text-xs font-martian mt-0.5 truncate ${isLight ? 'text-kamry-graphite/50' : 'text-zinc-400'}`}>{subtitle}</div>}
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

const AnalyticsSubScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { showToast, themeMode } = useAppContext();
  const isLight = themeMode !== 'dark';

  const [activeTab, setActiveTab] = useState<'NPU' | 'SOC' | 'RAM'>('NPU');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('12:50:00 today');

  const [npuValue, setNpuValue] = useState<number>(34.8);
  const [socValue, setSocValue] = useState<number>(27.4);
  const [ramValue, setRamValue] = useState<number>(56.2);

  const [metricsHistory, setMetricsHistory] = useState<Array<{ time: string; cpu: number; memory: number; npu: number }>>([
    { time: '12:50:00', cpu: 22, memory: 52, npu: 30 },
    { time: '12:50:05', cpu: 28, memory: 54, npu: 35 },
    { time: '12:50:10', cpu: 31, memory: 53, npu: 28 },
    { time: '12:50:15', cpu: 25, memory: 55, npu: 42 },
    { time: '12:50:20', cpu: 45, memory: 58, npu: 65 },
    { time: '12:50:25', cpu: 38, memory: 57, npu: 50 },
    { time: '12:50:30', cpu: 30, memory: 56, npu: 34 },
    { time: '12:50:35', cpu: 27, memory: 56, npu: 30 },
    { time: '12:50:40', cpu: 32, memory: 57, npu: 38 },
    { time: '12:50:45', cpu: 29, memory: 58, npu: 31 },
  ]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    const updateBreathingHardware = () => {
      const deltaNpu = (Math.random() * 4 - 1.8);
      const deltaSoc = (Math.random() * 3 - 1.4);
      const deltaRam = (Math.random() * 2 - 0.9);

      setNpuValue(prev => Math.min(96, Math.max(12, Number((prev + deltaNpu).toFixed(1)))));
      setSocValue(prev => Math.min(92, Math.max(10, Number((prev + deltaSoc).toFixed(1)))));
      setRamValue(prev => Math.min(94, Math.max(25, Number((prev + deltaRam).toFixed(1)))));

      timerId = setTimeout(updateBreathingHardware, Math.floor(Math.random() * 1800 + 800));
    };

    timerId = setTimeout(updateBreathingHardware, 1200);
    return () => clearTimeout(timerId);
  }, []);

  const [logs, setLogs] = useState<Array<{ id: string; timestamp: string; category: 'HW' | 'INF' | 'SYS' | 'WARN'; message: string }>>([
    { id: '1', timestamp: '12:50:00', category: 'SYS', message: 'Kamry OS NPU kernel initialized (32GB Unified VRAM allocated)' },
    { id: '2', timestamp: '12:50:08', category: 'HW', message: 'Core temperature 41°C — Thermal throttle disabled' },
    { id: '3', timestamp: '12:50:15', category: 'INF', message: 'Inference thread started for agent "meeting" (Latency: 14ms)' },
    { id: '4', timestamp: '12:50:22', category: 'HW', message: 'LPDDR5X Memory bandwidth test OK — 142 GB/s verified' },
    { id: '5', timestamp: '12:50:30', category: 'WARN', message: 'VRAM Usage reached 58% (18.5GB/32GB)' },
  ]);

  const [isLogsPaused, setIsLogsPaused] = useState(false);
  const [logFilter, setLogFilter] = useState<'ALL' | 'HW' | 'INF' | 'WARN'>('ALL');
  const logsScrollRef = useRef<HTMLDivElement>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastUpdated(`${timeStr} today`);
    setIsRefreshing(false);
    showToast("Telemetry re-fetched from Kamry device");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const newCpu = Math.min(95, Math.max(15, Math.floor(25 + Math.random() * 25 + (Math.sin(Date.now() / 3000) * 15))));
      const newMem = Math.min(90, Math.max(40, Math.floor(55 + (Math.cos(Date.now() / 4000) * 5))));
      const newNpu = Math.min(100, Math.max(10, Math.floor(30 + Math.random() * 30)));

      setMetricsHistory(prev => {
        const next = [...prev, { time: timeStr, cpu: newCpu, memory: newMem, npu: newNpu }];
        if (next.length > 20) return next.slice(next.length - 20);
        return next;
      });

      if (!isLogsPaused) {
        const categories: Array<'HW' | 'INF' | 'SYS' | 'WARN'> = ['HW', 'INF', 'SYS', 'HW'];
        const sampleMessages = [
          'NPU Tensor Core 0-3 load balanced: 38.2 TOPS',
          'Agent health check OK — 0 exceptions in last 60s',
          'VRAM KV Cache compaction completed (Saved 240MB)',
          'CPU Core 0-7 frequency stabilized at 3.8GHz',
          'Network Interface wlan0: 0 packet loss',
          'Unified Memory Bus speed verified: 142 GB/s',
        ];

        const cat = categories[Math.floor(Math.random() * categories.length)];
        const msg = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

        setLogs(prev => {
          const newEntry = {
            id: Date.now().toString(),
            timestamp: timeStr,
            category: cat,
            message: msg
          };
          const next = [...prev, newEntry];
          if (next.length > 50) return next.slice(next.length - 50);
          return next;
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLogsPaused]);

  useEffect(() => {
    if (logsScrollRef.current && !isLogsPaused) {
      logsScrollRef.current.scrollTop = logsScrollRef.current.scrollHeight;
    }
  }, [logs, isLogsPaused]);

  const latestMetric = metricsHistory[metricsHistory.length - 1] || { cpu: 28, memory: 56, npu: 35 };

  const filteredLogs = logs.filter(l => {
    if (logFilter === 'ALL') return true;
    return l.category === logFilter;
  });

  const createSvgPath = (key: 'cpu' | 'memory' | 'npu') => {
    if (metricsHistory.length < 2) return '';
    const width = 600;
    const height = 140;
    const points = metricsHistory.map((m, idx) => {
      const x = (idx / (metricsHistory.length - 1)) * width;
      const y = height - (m[key] / 100) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const createSvgArea = (key: 'cpu' | 'memory' | 'npu') => {
    if (metricsHistory.length < 2) return '';
    const width = 600;
    const height = 140;
    const linePath = createSvgPath(key);
    return `${linePath} L ${width},${height} L 0,${height} Z`;
  };

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden">
      {/* Top Header */}
      <div className={`p-4 sm:p-6 pb-3 border-b flex items-center justify-between flex-shrink-0 z-10 ${
        isLight ? 'bg-kamry-paper border-black/10' : 'bg-[#141418] border-white/10'
      }`}>
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
                isLight ? 'bg-white border-black/10 hover:bg-black/5 text-black' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
              }`}
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <h1 className={`text-lg sm:text-xl font-bricolage font-bold flex items-center gap-2 ${isLight ? 'text-black' : 'text-white'}`}>
              <BarChart2 size={20} className={isLight ? 'text-sky-600' : 'text-sky-400'} />
              <span>Analytics & On-Device NPU Telemetry</span>
            </h1>
            <p className={`text-xs font-sans ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Real-time hardware performance metrics, token analytics, and system kernel logs
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl text-xs font-mono transition-all shadow-2xs disabled:opacity-60 cursor-pointer ${
            isLight ? 'bg-white border-black/10 text-black hover:bg-zinc-50' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
          }`}
        >
          {isRefreshing ? <Loader2 size={14} className="animate-spin text-sky-500" /> : <RefreshCw size={14} />}
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          
          {/* Hardware Stat Tabs */}
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => setActiveTab('NPU')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeTab === 'NPU' 
                  ? (isLight ? 'bg-white border-sky-500 shadow-sm' : 'bg-[#1C1C22] border-sky-400 shadow-sm')
                  : (isLight ? 'bg-zinc-50 border-black/5' : 'bg-white/5 border-white/10')
              }`}
            >
              <div className={`text-xs font-mono uppercase ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>NPU TOPS LOAD</div>
              <div className={`text-2xl sm:text-3xl font-mono font-bold mt-1 ${isLight ? 'text-sky-600' : 'text-sky-400'}`}>
                {npuValue.toFixed(1)}%
              </div>
            </button>

            <button 
              onClick={() => setActiveTab('SOC')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeTab === 'SOC' 
                  ? (isLight ? 'bg-white border-blue-500 shadow-sm' : 'bg-[#1C1C22] border-blue-400 shadow-sm')
                  : (isLight ? 'bg-zinc-50 border-black/5' : 'bg-white/5 border-white/10')
              }`}
            >
              <div className={`text-xs font-mono uppercase ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>SOC UTILIZATION</div>
              <div className={`text-2xl sm:text-3xl font-mono font-bold mt-1 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
                {socValue.toFixed(1)}%
              </div>
            </button>

            <button 
              onClick={() => setActiveTab('RAM')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeTab === 'RAM' 
                  ? (isLight ? 'bg-white border-emerald-500 shadow-sm' : 'bg-[#1C1C22] border-emerald-400 shadow-sm')
                  : (isLight ? 'bg-zinc-50 border-black/5' : 'bg-white/5 border-white/10')
              }`}
            >
              <div className={`text-xs font-mono uppercase ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>UNIFIED VRAM</div>
              <div className={`text-2xl sm:text-3xl font-mono font-bold mt-1 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>
                {ramValue.toFixed(1)}%
              </div>
            </button>
          </div>

          {/* Real-time Hardware Performance Chart */}
          <div className={`p-5 sm:p-6 rounded-2xl border shadow-xs space-y-4 ${
            isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Cpu size={20} className={isLight ? 'text-sky-600' : 'text-sky-400'} />
                <h3 className={`font-bricolage text-base sm:text-lg font-bold ${isLight ? 'text-black' : 'text-white'}`}>
                  Real-Time Hardware Performance Telemetry
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE STREAM
              </span>
            </div>

            {/* Key Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-zinc-50 border-black/5' : 'bg-white/5 border-white/10'}`}>
                <div className="text-[11px] font-mono uppercase text-zinc-500">CPU Usage</div>
                <div className={`text-xl font-mono font-bold mt-0.5 ${isLight ? 'text-black' : 'text-white'}`}>{latestMetric.cpu}%</div>
                <div className="text-[11px] font-sans text-zinc-400">8 Cores @ 3.8GHz</div>
              </div>

              <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-zinc-50 border-black/5' : 'bg-white/5 border-white/10'}`}>
                <div className="text-[11px] font-mono uppercase text-zinc-500">Memory (RAM/VRAM)</div>
                <div className={`text-xl font-mono font-bold mt-0.5 ${isLight ? 'text-black' : 'text-white'}`}>{latestMetric.memory}%</div>
                <div className="text-[11px] font-sans text-zinc-400">{((latestMetric.memory / 100) * 32).toFixed(1)} GB / 32 GB Used</div>
              </div>

              <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-zinc-50 border-black/5' : 'bg-white/5 border-white/10'}`}>
                <div className="text-[11px] font-mono uppercase text-zinc-500">NPU TOPS Load</div>
                <div className={`text-xl font-mono font-bold mt-0.5 ${isLight ? 'text-black' : 'text-white'}`}>{latestMetric.npu}%</div>
                <div className="text-[11px] font-sans text-zinc-400">{((latestMetric.npu / 100) * 40).toFixed(1)} TOPS Active</div>
              </div>
            </div>

            {/* SVG Chart */}
            <div className={`relative h-44 rounded-xl p-4 overflow-hidden border flex flex-col justify-between ${
              isLight ? 'bg-black border-white/10' : 'bg-[#141418] border-white/15'
            }`}>
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cpuGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="memGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="35" x2="600" y2="35" stroke="#ffffff" strokeOpacity="0.1" strokeDasharray="4 4" />
                <line x1="0" y1="70" x2="600" y2="70" stroke="#ffffff" strokeOpacity="0.1" strokeDasharray="4 4" />
                <line x1="0" y1="105" x2="600" y2="105" stroke="#ffffff" strokeOpacity="0.1" strokeDasharray="4 4" />

                <path d={createSvgArea('memory')} fill="url(#memGrad2)" />
                <path d={createSvgPath('memory')} fill="none" stroke="#10b981" strokeWidth="2.5" />

                <path d={createSvgArea('cpu')} fill="url(#cpuGrad2)" />
                <path d={createSvgPath('cpu')} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

                <path d={createSvgPath('npu')} fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="3 3" />
              </svg>

              <div className="flex items-center justify-between font-mono text-[10px] text-white/60 pt-2 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-xs" /> CPU %</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-xs" /> Memory %</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-purple-500 rounded-xs" /> NPU TOPS %</span>
                </div>
                <span>Last updated: {lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* System Kernel Event Logs */}
          <div className={`p-5 sm:p-6 rounded-2xl border shadow-xs space-y-4 ${
            isLight ? 'bg-white border-black/10' : 'bg-[#1C1C22] border-white/10'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Terminal size={18} className={isLight ? 'text-black' : 'text-sky-400'} />
                <h3 className={`font-bricolage text-base sm:text-lg font-bold ${isLight ? 'text-black' : 'text-white'}`}>
                  System & Kernel Logs
                </h3>
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                  isLight ? 'bg-black text-white' : 'bg-sky-500 text-white'
                }`}>
                  {filteredLogs.length} Events
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`flex items-center p-1 rounded-lg font-mono text-[10px] ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
                  {(['ALL', 'HW', 'INF', 'WARN'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setLogFilter(f)}
                      className={`px-2 py-1 rounded cursor-pointer ${
                        logFilter === f 
                          ? (isLight ? 'bg-white text-black shadow-xs font-bold' : 'bg-sky-500 text-white shadow-xs font-bold') 
                          : (isLight ? 'text-zinc-500 hover:text-black' : 'text-zinc-400 hover:text-white')
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsLogsPaused(!isLogsPaused)}
                  className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 cursor-pointer ${
                    isLight ? 'border-black/10 hover:bg-black/5 text-black' : 'border-white/10 hover:bg-white/10 text-white'
                  }`}
                  title={isLogsPaused ? "Resume log stream" : "Pause log stream"}
                >
                  {isLogsPaused ? <Play size={12} className="text-emerald-500" /> : <Pause size={12} className="text-amber-500" />}
                </button>

                <button
                  onClick={() => {
                    setLogs([]);
                    showToast("Log buffer cleared");
                  }}
                  className="p-1.5 rounded-lg border border-red-500/20 text-red-500 text-xs hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Clear log buffer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div 
              ref={logsScrollRef}
              className={`rounded-xl p-4 h-60 overflow-y-auto font-mono text-xs leading-relaxed border space-y-1.5 ${
                isLight ? 'bg-black text-white border-white/10' : 'bg-[#141418] text-zinc-200 border-white/10'
              }`}
            >
              {filteredLogs.length === 0 ? (
                <div className="text-white/40 italic p-4 text-center">No logs matching filter.</div>
              ) : (
                filteredLogs.map(log => (
                  <div key={log.id} className="flex items-start gap-2 sm:gap-3 hover:bg-white/5 p-1 rounded transition-colors">
                    <span className="text-white/40 text-[10px] whitespace-nowrap pt-0.5">{log.timestamp}</span>
                    <span className={`px-1.5 py-0.2 text-[9px] rounded font-bold uppercase whitespace-nowrap ${
                      log.category === 'WARN' ? 'bg-red-900/80 text-red-200 border border-red-700' :
                      log.category === 'HW' ? 'bg-amber-950/80 text-amber-200 border border-amber-700' :
                      log.category === 'INF' ? 'bg-sky-950/80 text-sky-200 border border-sky-700' :
                      'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                    }`}>
                      [{log.category}]
                    </span>
                    <span className="text-white/90 text-[11px] sm:text-xs flex-1 break-words">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Status Footer Strip */}
          <div className={`border rounded-xl p-3 flex flex-wrap justify-between items-center gap-2 font-mono text-[10px] sm:text-xs ${
            isLight ? 'bg-zinc-100 border-black/5 text-zinc-600' : 'bg-[#1C1C22] border-white/10 text-zinc-400'
          }`}>
            <span>CAMRY ONE APPLIANCE</span>
            <span>256GB SSD</span>
            <span>FW v2.4</span>
            <span>UPTIME 4d 12h</span>
            <span>65W NOMINAL</span>
          </div>

        </div>
      </div>
    </div>
  );
};

const Toggle = ({ defaultChecked = false }: { defaultChecked?: boolean }) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button 
      onClick={() => setOn(!on)}
      className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${on ? 'bg-[#0EA5E9]' : 'bg-zinc-500/40'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
};
