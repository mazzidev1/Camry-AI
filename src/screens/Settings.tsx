import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../store/AppContext';
import { ChevronRight, Shield, Power, Monitor, HardDrive, Wifi, Network, Key, ArrowLeft, Copy, Eye, EyeOff, Check, Terminal, Lock, Download, Upload, FileCode, Users, Cpu, Bot, Layers, Zap, Activity } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Team } from './Team';
import { Tooltip } from '../components/Tooltip';
import { AnimatedIcon, IconAnimationType } from '../components/AnimatedIcon';

export const Settings: React.FC = () => {
  const { currentScreen, settingsView, setSettingsView, showToast, exportConfig, importConfig, teamMembers } = useAppContext();
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
    <div className="flex-1 h-full flex flex-col bg-camry-paper overflow-hidden relative">
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
            <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex-shrink-0 bg-camry-paper z-10">
              <h1 className="text-xl sm:text-2xl font-bricolage text-camry-blackout">Settings</h1>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8 sm:pb-12">
              <div className="max-w-4xl w-full space-y-6 sm:space-y-8">
                
                {/* Mini Dashboard View */}
                <MiniDashboard />

                {/* Account */}
                <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
                  <SettingRow 
                    icon={<div className="w-8 h-8 rounded bg-camry-graphite text-white flex items-center justify-center font-medium shadow-xs">D</div>}
                    title="digitalix"
                    subtitle="alex@nuvious.com"
                    tooltip="User profile and account settings"
                    right={<ChevronRight size={16} className="text-camry-graphite/40" />}
                    onClick={() => {}}
                  />
                  <div className="h-[1px] bg-black/5 ml-14"></div>
                  <SettingRow 
                    title="Feedback"
                    subtitle="Share feedback with the Camry team"
                    tooltip="Submit product feedback"
                    right={<ChevronRight size={16} className="text-camry-graphite/40" />}
                    onClick={() => showToast("Feedback module not available in preview")}
                  />
                </div>

                {/* Organization & Team Settings */}
                <div>
                  <div className="font-martian text-xs text-camry-graphite/50 mb-3 px-2 tracking-wider uppercase">ORGANIZATION & ACCESS</div>
                  <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
                    <SettingRow 
                      icon={<Users size={18} className="text-camry-graphite/60" />}
                      title="Team & Access Control"
                      subtitle="Manage members, assigned roles, and document security scopes"
                      tooltip="Manage workspace members and category permissions"
                      iconAnimation="scale"
                      right={
                        <div className="flex items-center gap-2">
                          <span className="font-martian text-[11px] bg-camry-carrier/15 text-camry-deep-carrier px-2 py-0.5 rounded font-semibold">
                            {teamMembers.length} Members
                          </span>
                          <ChevronRight size={16} className="text-camry-graphite/40" />
                        </div>
                      }
                      onClick={() => setSettingsView('team')}
                    />
                  </div>
                </div>

                {/* Software Settings */}
                <div>
                  <div className="font-martian text-xs text-camry-graphite/50 mb-3 px-2 tracking-wider uppercase">SOFTWARE SETTINGS</div>
                  <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
                    <SettingRow 
                      icon={<Power size={18} className="text-camry-graphite/60" />}
                      title="Auto Start"
                      subtitle="Automatically launch Camry OS on device boot"
                      tooltip="Toggle auto boot behavior"
                      iconAnimation="bounce"
                      right={<Toggle defaultChecked />}
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<Shield size={18} className="text-camry-graphite/60" />}
                      title="Privacy Policy"
                      subtitle="View zero-telemetry & on-device data guarantee"
                      tooltip="Read local privacy policy"
                      iconAnimation="scale"
                      right={<ChevronRight size={16} className="text-camry-graphite/40" />}
                      onClick={() => setSettingsView('privacy')}
                    />
                  </div>
                </div>

                {/* Backup & Portability Settings */}
                <div>
                  <div className="font-martian text-xs text-camry-graphite/50 mb-3 px-2 tracking-wider uppercase">BACKUP & PORTABILITY</div>
                  <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
                    <SettingRow 
                      icon={<Download size={18} className="text-camry-carrier" />}
                      title="Export Configuration & Agents"
                      subtitle="Save system preferences and agents to JSON file"
                      tooltip="Download backup JSON configuration"
                      iconAnimation="bounce"
                      right={
                        <Tooltip content="Export settings & agents JSON" position="left">
                          <button 
                            onClick={exportConfig}
                            className="px-3 py-1.5 bg-camry-blackout text-white text-xs font-martian rounded-lg hover:bg-camry-graphite transition-colors shadow-sm cursor-pointer"
                          >
                            Export JSON
                          </button>
                        </Tooltip>
                      }
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<Upload size={18} className="text-camry-graphite/60" />}
                      title="Import Configuration"
                      subtitle="Restore settings from a JSON backup file"
                      tooltip="Restore configuration from local file"
                      iconAnimation="bounce"
                      right={
                        <Tooltip content="Restore system backup from JSON file" position="left">
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-camry-graphite/10 text-camry-blackout text-xs font-martian rounded-lg hover:bg-camry-graphite/20 transition-colors cursor-pointer"
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
                  <div className="font-martian text-xs text-camry-graphite/50 mb-3 px-2 tracking-wider uppercase">DEVICE SETTINGS</div>
                  <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
                    <SettingRow 
                      icon={<Monitor size={18} className="text-camry-graphite/60" />}
                      title="Device Information"
                      subtitle="NPU serial number, hardware specs & firmware version"
                      tooltip="View hardware specifications"
                      iconAnimation="scale"
                      right={<ChevronRight size={16} className="text-camry-graphite/40" />}
                      onClick={() => setSettingsView('device_info')}
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<Terminal size={18} className="text-camry-graphite/60" />}
                      title="Developer Console"
                      subtitle="Low-level system logs & kernel telemetry"
                      tooltip="Open developer terminal console"
                      iconAnimation="wiggle"
                      right={<ChevronRight size={16} className="text-camry-graphite/40" />}
                      onClick={() => setSettingsView('console')}
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<HardDrive size={18} className="text-camry-graphite/60" />}
                      title="Storage Space"
                      subtitle="Local NVMe SSD allocation and model weights"
                      tooltip="Manage local SSD storage"
                      iconAnimation="pulse"
                      right={
                        <div className="flex items-center gap-3">
                          <span className="font-martian text-xs text-camry-graphite/50">142 / 1000 GB</span>
                          <ChevronRight size={16} className="text-camry-graphite/40" />
                        </div>
                      }
                      onClick={() => setSettingsView('storage')}
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<Wifi size={18} className="text-camry-graphite/60" />}
                      title="Wi-Fi"
                      subtitle="Wireless network connection status"
                      tooltip="Configure Wi-Fi connection"
                      iconAnimation="scale"
                      right={
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-camry-graphite/50">Connected</span>
                          <ChevronRight size={16} className="text-camry-graphite/40" />
                        </div>
                      }
                      onClick={() => setSettingsView('wifi')}
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<Key size={18} className="text-camry-graphite/60" />}
                      title="API key"
                      subtitle="Optional cloud provider API keys"
                      tooltip="Manage remote API keys"
                      iconAnimation="rotate"
                      right={<ChevronRight size={16} className="text-camry-graphite/40" />}
                      onClick={() => setSettingsView('api_key')}
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<ArrowLeft size={18} className="text-camry-graphite/60 rotate-90" />}
                      title="Update"
                      subtitle="Check for Camry OS software updates"
                      tooltip="Check for software updates"
                      iconAnimation="bounce"
                      right={
                        <div className="flex items-center gap-3">
                          <span className="font-martian text-xs text-camry-carrier bg-camry-carrier/10 px-2 py-1 rounded font-semibold">Update available</span>
                          <ChevronRight size={16} className="text-camry-graphite/40" />
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
            className="absolute inset-0 bg-camry-paper z-20 flex flex-col"
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
            className="absolute inset-0 bg-camry-paper z-20 flex flex-col"
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
            className="absolute inset-0 bg-camry-paper z-20 flex flex-col"
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
            className="absolute inset-0 bg-camry-paper z-20 flex flex-col"
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
            className="absolute inset-0 bg-camry-paper z-20 flex flex-col"
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
            className="absolute inset-0 bg-camry-paper z-20 flex flex-col"
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
            className="absolute inset-0 bg-camry-paper z-20 flex flex-col"
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
            className="absolute inset-0 bg-camry-paper z-20 flex flex-col overflow-hidden"
          >
            <Team onBack={() => setSettingsView('main')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ApiKeySubScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { showToast } = useAppContext();
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
        <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-colors text-camry-graphite/60 hover:text-black">
          <ArrowLeft size={20} />
        </button>
        <Key size={20} className="text-camry-blackout flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl font-bricolage text-camry-blackout">API key</h1>
      </div>

      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className="font-martian text-xs text-camry-graphite/50 mb-3 tracking-wider">API KEY</div>
        
        <div className="bg-white border border-black/5 rounded-xl shadow-sm p-4 sm:p-6 space-y-6 sm:space-y-8">
          
          <div>
            <label className="block text-sm font-medium text-camry-graphite mb-2">API Base URL</label>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 bg-camry-graphite/5 border border-black/5 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 font-martian text-xs sm:text-sm text-camry-blackout truncate">
                {baseUrl}
              </div>
              <button 
                onClick={handleCopyUrl}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg border border-black/10 bg-white hover:bg-black/5 hover:border-black/20 transition-all text-camry-graphite/60 flex-shrink-0"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-camry-graphite mb-2">API Key</label>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 bg-camry-graphite/5 border border-black/5 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 font-martian text-xs sm:text-sm text-camry-blackout flex items-center justify-between min-w-0">
                <span className="truncate mr-2">{showKey ? apiKey : '••••••••••••••••••••••••••••••••••••'}</span>
                <button onClick={() => setShowKey(!showKey)} className="text-camry-graphite/40 hover:text-black flex-shrink-0">
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button 
                onClick={handleCopyKey}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg border border-black/10 bg-white hover:bg-black/5 hover:border-black/20 transition-all text-camry-graphite/60 flex-shrink-0"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="font-familjen text-xs sm:text-sm text-camry-graphite/60">
              Point any OpenAI-compatible tool at your Camry device. Nothing leaves the building.
            </p>
            <button 
              onClick={() => setShowRegenModal(true)}
              className="px-3.5 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap w-fit"
            >
              Regenerate key
            </button>
          </div>

        </div>
      </div>

      {/* Regen Confirm Modal */}
      <AnimatePresence>
        {showRegenModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-camry-paper/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black/10 rounded-xl shadow-xl p-5 sm:p-6 max-w-sm w-full"
            >
              <h3 className="font-bricolage text-lg sm:text-xl text-camry-blackout mb-2">Regenerate API key?</h3>
              <p className="font-familjen text-xs sm:text-sm text-camry-graphite/70 mb-6">
                Any applications using the current key will immediately lose access to Camry. This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button onClick={() => setShowRegenModal(false)} className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-black/5">Cancel</button>
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
    // Initial logs
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
        <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-colors text-camry-graphite/60 hover:text-black">
          <ArrowLeft size={20} />
        </button>
        <Terminal size={20} className="text-camry-blackout flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl font-bricolage text-camry-blackout">Developer Console</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-camry-carrier animate-pulse shadow-[0_0_8px_rgba(155,209,255,0.6)]" />
          <span className="font-martian text-[10px] text-camry-graphite/70 tracking-wider">LIVE</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 sm:p-8 items-center justify-start overflow-hidden">
        <div className="w-full max-w-4xl h-[380px] sm:h-[500px] bg-camry-graphite border border-black/10 rounded-xl flex flex-col shadow-sm overflow-hidden relative">
          
          <div className="flex items-center px-4 py-3 border-b border-black/20 bg-black/20 flex-shrink-0">
            <span className="font-martian text-xs text-white/50">camry-syslogd</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 font-martian text-[10px] sm:text-[11px] leading-loose text-camry-carrier/80" ref={scrollRef}>
            {logs.map((log, i) => (
              <div key={i} className="mb-1 opacity-80 hover:opacity-100 transition-opacity break-all">
                <span className="text-white/40 mr-2 sm:mr-4">›</span>
                {log}
              </div>
            ))}
            {/* Blinking cursor */}
            <div className="animate-pulse inline-block w-2 h-4 bg-camry-carrier/80 mt-1" />
          </div>

        </div>
      </div>
    </>
  );
};

const DeviceInfoSubScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <>
      <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-colors text-camry-graphite/60 hover:text-black">
          <ArrowLeft size={20} />
        </button>
        <Monitor size={20} className="text-camry-blackout flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl font-bricolage text-camry-blackout">Device Information</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
          <SettingRow title="Model" right={<span className="text-xs sm:text-sm font-martian text-camry-graphite/60">Camry Gen 1</span>} />
          <div className="h-[1px] bg-black/5 ml-4"></div>
          <SettingRow title="Serial Number" right={<span className="text-xs sm:text-sm font-martian text-camry-graphite/60">C1-X992-0041</span>} />
          <div className="h-[1px] bg-black/5 ml-4"></div>
          <SettingRow title="Firmware" right={<span className="text-xs sm:text-sm font-martian text-camry-graphite/60">v1.0.3 (Stable)</span>} />
          <div className="h-[1px] bg-black/5 ml-4"></div>
          <SettingRow title="NPU Core" right={<span className="text-xs sm:text-sm font-martian text-camry-graphite/60">Tensor V2 - 40 TOPS</span>} />
          <div className="h-[1px] bg-black/5 ml-4"></div>
          <SettingRow title="RAM" right={<span className="text-xs sm:text-sm font-martian text-camry-graphite/60">32GB LPDDR5X</span>} />
        </div>
      </div>
    </>
  );
};

const StorageSubScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <>
      <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-colors text-camry-graphite/60 hover:text-black">
          <ArrowLeft size={20} />
        </button>
        <HardDrive size={20} className="text-camry-blackout flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl font-bricolage text-camry-blackout">Storage Space</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className="bg-white border border-black/5 rounded-xl shadow-sm p-4 sm:p-8">
          <div className="flex items-end justify-between mb-2">
            <span className="font-bricolage text-2xl sm:text-3xl text-camry-blackout">142 GB</span>
            <span className="font-martian text-xs sm:text-sm text-camry-graphite/60">of 1000 GB used</span>
          </div>
          <div className="w-full h-3 bg-camry-graphite/10 rounded-full overflow-hidden flex mb-6">
            <div className="h-full bg-camry-carrier" style={{ width: '10%' }}></div>
            <div className="h-full bg-indigo-400" style={{ width: '3%' }}></div>
            <div className="h-full bg-emerald-400" style={{ width: '1.2%' }}></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-camry-carrier"></div><span className="text-camry-graphite font-medium">Models</span></div>
              <span className="font-martian text-camry-graphite/60">100 GB</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-indigo-400"></div><span className="text-camry-graphite font-medium">System</span></div>
              <span className="font-martian text-camry-graphite/60">30 GB</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-emerald-400"></div><span className="text-camry-graphite font-medium">User Data</span></div>
              <span className="font-martian text-camry-graphite/60">12 GB</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const WifiSubScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <>
      <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-colors text-camry-graphite/60 hover:text-black">
          <ArrowLeft size={20} />
        </button>
        <Wifi size={20} className="text-camry-blackout flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl font-bricolage text-camry-blackout">Wi-Fi</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden mb-6 sm:mb-8">
          <SettingRow title="Wi-Fi" right={<Toggle defaultChecked />} />
        </div>
        <div className="font-martian text-xs text-camry-graphite/50 mb-3 px-2 tracking-wider">KNOWN NETWORKS</div>
        <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
          <SettingRow title="Nuvious-Corp-5G" right={<span className="text-xs sm:text-sm font-medium text-camry-carrier">Connected</span>} />
          <div className="h-[1px] bg-black/5 ml-4"></div>
          <SettingRow title="Nuvious-Guest" right={<Lock size={16} className="text-camry-graphite/40" />} />
          <div className="h-[1px] bg-black/5 ml-4"></div>
          <SettingRow title="Starbucks WiFi" right={<span className="text-xs sm:text-sm text-camry-graphite/40">Saved</span>} />
        </div>
      </div>
    </>
  );
};

const UpdateSubScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
        <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-colors text-camry-graphite/60 hover:text-black">
          <ArrowLeft size={20} />
        </button>
        <ArrowLeft size={20} className="text-camry-blackout rotate-90 flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl font-bricolage text-camry-blackout">Software Update</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className="bg-white border border-black/5 rounded-xl shadow-sm p-5 sm:p-8 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-camry-graphite/5 rounded-full flex items-center justify-center mb-4">
            <ArrowLeft size={28} className="text-camry-carrier rotate-90" />
          </div>
          <h2 className="text-lg sm:text-xl font-bricolage text-camry-blackout mb-2">Camry OS v1.0.4 is available</h2>
          <p className="text-camry-graphite/60 text-xs sm:text-sm mb-6 sm:mb-8">This update includes performance improvements for local model inference and various bug fixes.</p>
          
          {isUpdating ? (
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-xs font-martian text-camry-graphite/60 mb-2">
                <span>Downloading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-camry-carrier transition-all duration-200" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <button 
              onClick={startUpdate}
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-camry-blackout text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-camry-graphite transition-colors"
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
  return (
    <>
      <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-colors text-camry-graphite/60 hover:text-black">
          <ArrowLeft size={20} />
        </button>
        <Shield size={20} className="text-camry-blackout flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl font-bricolage text-camry-blackout">Privacy Policy</h1>
      </div>
      <div className="px-4 sm:px-8 md:px-16 pt-4 sm:pt-8 max-w-3xl w-full">
        <div className="bg-white border border-black/5 rounded-xl shadow-sm p-5 sm:p-8 prose prose-sm text-camry-graphite">
          <h3 className="font-bricolage text-base sm:text-lg text-camry-blackout mb-3">Your Data Stays With You.</h3>
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
    showToast 
  } = useAppContext();

  // Installed agents list
  const activeInstalledAgents = allAgents.filter(a => installedAgents.includes(a.id));
  const activeCount = activeInstalledAgents.filter(a => a.status === 'active').length || activeInstalledAgents.length;

  // Category stats calculation
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
    <div className="bg-white border border-black/10 rounded-2xl shadow-sm p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-camry-blackout text-white shadow-xs">
            <AnimatedIcon type="spin">
              <Cpu size={20} />
            </AnimatedIcon>
          </div>
          <div>
            <h2 className="font-bricolage font-bold text-base sm:text-lg text-camry-blackout flex items-center gap-2">
              <span>AI System & Knowledge Mini Dashboard</span>
              <span className="text-[10px] font-martian font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                100% On-Device NPU
              </span>
            </h2>
            <p className="text-xs text-camry-graphite/70 font-familjen">
              Real-time local token metrics, active agent pipelines, and top knowledge categories
            </p>
          </div>
        </div>

        <Tooltip content="Refresh system telemetry & NPU stats" position="left">
          <button 
            onClick={() => showToast("Telemetry refreshed: All NPU clusters nominal")}
            className="p-2 rounded-xl border border-black/10 hover:bg-black/5 text-camry-graphite transition-all cursor-pointer self-start sm:self-auto"
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
        <div className="p-4 rounded-xl border border-black/10 bg-gradient-to-br from-zinc-50 to-white space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-martian font-bold text-camry-graphite/70 uppercase tracking-wider">
              Total AI Tokens Used
            </span>
            <Tooltip content="Tokens processed on local NPU hardware" position="top">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <AnimatedIcon type="bounce">
                  <Zap size={14} />
                </AnimatedIcon>
              </span>
            </Tooltip>
          </div>

          <div>
            <div className="text-2xl font-bricolage font-bold text-camry-blackout flex items-baseline gap-2">
              <span>2,845,190</span>
              <span className="text-xs font-martian text-emerald-600 font-semibold">+12.4% today</span>
            </div>
            <p className="text-[11px] text-camry-graphite/60 mt-0.5 font-mono">
              ~1,480 tokens/sec local NPU speed
            </p>
          </div>

          {/* Token Breakdown Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] font-martian font-semibold">
              <span className="text-blue-700">1,620,400 Prompt (57%)</span>
              <span className="text-emerald-700">1,224,790 Output (43%)</span>
            </div>
            <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: '57%' }} title="Prompt Input Tokens" />
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: '43%' }} title="Completion Output Tokens" />
            </div>
          </div>

          <div className="text-[10px] text-camry-graphite/70 pt-1 flex items-center justify-between border-t border-black/5 font-martian">
            <span>Estimated API Cost:</span>
            <span className="font-bold text-emerald-600 font-mono">$0.00 (Local NPU)</span>
          </div>
        </div>

        {/* CARD 2: ACTIVE AGENTS */}
        <div className="p-4 rounded-xl border border-black/10 bg-gradient-to-br from-zinc-50 to-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-martian font-bold text-camry-graphite/70 uppercase tracking-wider">
              Active Agents
            </span>
            <Tooltip content="Installed local agent workflows" position="top">
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <AnimatedIcon type="wiggle">
                  <Bot size={14} />
                </AnimatedIcon>
              </span>
            </Tooltip>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bricolage font-bold text-camry-blackout">{activeInstalledAgents.length}</span>
            <span className="text-xs font-martian text-camry-graphite">Installed ({activeCount} Active)</span>
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
                  className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-black/5 hover:border-black/20 cursor-pointer transition-all w-full"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
                    <span className="text-xs font-martian font-bold text-camry-blackout truncate">{agent.name}</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-camry-graphite uppercase font-semibold">
                    {agent.currentVersion || 'v1.0'}
                  </span>
                </div>
              </Tooltip>
            ))}
          </div>

          <button 
            onClick={() => setCurrentScreen('agentStore')}
            className="w-full text-center py-1 rounded-lg text-[11px] font-martian font-bold text-camry-deep-carrier hover:underline bg-camry-carrier/10 cursor-pointer"
          >
            + Browse Agent Store
          </button>
        </div>

        {/* CARD 3: TOP-REQUESTED KNOWLEDGE CATEGORIES */}
        <div className="p-4 rounded-xl border border-black/10 bg-gradient-to-br from-zinc-50 to-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-martian font-bold text-camry-graphite/70 uppercase tracking-wider">
              Top Requested Categories
            </span>
            <Tooltip content="Knowledge Base query load by category" position="top">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
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
                        <span className="font-bold text-camry-blackout truncate">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] flex-shrink-0">
                        <span className="text-camry-graphite">{docCount} docs</span>
                        <span className="font-bold text-camry-blackout">{percentage}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
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

          <div className="text-[10px] text-camry-graphite/60 pt-1 border-t border-black/5 italic font-martian">
            Highest AI retrieval load: Client Files & Contracts (67%)
          </div>
        </div>

      </div>
    </div>
  );
};

// Helpers

const SettingRow = ({ icon, title, subtitle, tooltip, iconAnimation = 'scale', right, onClick }: any) => {
  const Component = onClick ? 'button' : 'div';
  const rowContent = (
    <Component 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3.5 sm:p-4 gap-3 ${onClick ? 'hover:bg-camry-graphite/5 transition-colors text-left cursor-pointer group' : ''}`}
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {icon && (
          <AnimatedIcon type={iconAnimation as IconAnimationType} className="text-camry-blackout group-hover:text-camry-carrier">
            {icon}
          </AnimatedIcon>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-medium text-camry-blackout text-xs sm:text-sm truncate">{title}</div>
          {subtitle && <div className="text-[10px] sm:text-xs text-camry-graphite/50 font-martian mt-0.5 truncate">{subtitle}</div>}
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
      className={`w-11 h-6 rounded-full p-1 transition-colors ${on ? 'bg-camry-carrier' : 'bg-camry-graphite/20'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
};
