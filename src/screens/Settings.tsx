import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../store/AppContext';
import { ChevronRight, Shield, Power, Monitor, HardDrive, Wifi, Network, Key, ArrowLeft, Copy, Eye, EyeOff, Check, Terminal, Lock, Download, Upload, FileCode } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const Settings: React.FC = () => {
  const { settingsView, setSettingsView, showToast, exportConfig, importConfig } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
              <div className="max-w-2xl w-full space-y-6 sm:space-y-8">
                
                {/* Account */}
                <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
                  <SettingRow 
                    icon={<div className="w-8 h-8 rounded bg-camry-graphite text-white flex items-center justify-center font-medium">D</div>}
                    title="digitalix"
                    subtitle="alex@nuvious.com"
                    right={<ChevronRight size={16} className="text-camry-graphite/40" />}
                    onClick={() => {}}
                  />
                  <div className="h-[1px] bg-black/5 ml-14"></div>
                  <SettingRow 
                    title="Feedback"
                    right={<ChevronRight size={16} className="text-camry-graphite/40" />}
                    onClick={() => showToast("Feedback module not available in preview")}
                  />
                </div>

                {/* Software Settings */}
                <div>
                  <div className="font-martian text-xs text-camry-graphite/50 mb-3 px-2 tracking-wider">SOFTWARE SETTINGS</div>
                  <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
                    <SettingRow 
                      icon={<Power size={18} className="text-camry-graphite/60" />}
                      title="Auto Start"
                      right={<Toggle defaultChecked />}
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<Shield size={18} className="text-camry-graphite/60" />}
                      title="Privacy Policy"
                      right={<ChevronRight size={16} className="text-camry-graphite/40" />}
                      onClick={() => setSettingsView('privacy')}
                    />
                  </div>
                </div>

                {/* Backup & Portability Settings */}
                <div>
                  <div className="font-martian text-xs text-camry-graphite/50 mb-3 px-2 tracking-wider">BACKUP & PORTABILITY</div>
                  <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
                    <SettingRow 
                      icon={<Download size={18} className="text-camry-carrier" />}
                      title="Export Configuration & Agents"
                      subtitle="Save system preferences and agents to JSON file"
                      right={
                        <button 
                          onClick={exportConfig}
                          className="px-3 py-1.5 bg-camry-blackout text-white text-xs font-martian rounded-lg hover:bg-camry-graphite transition-colors shadow-sm"
                        >
                          Export JSON
                        </button>
                      }
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<Upload size={18} className="text-camry-graphite/60" />}
                      title="Import Configuration"
                      subtitle="Restore settings from a JSON backup file"
                      right={
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-camry-graphite/10 text-camry-blackout text-xs font-martian rounded-lg hover:bg-camry-graphite/20 transition-colors"
                        >
                          Restore
                        </button>
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
                  <div className="font-martian text-xs text-camry-graphite/50 mb-3 px-2 tracking-wider">DEVICE SETTINGS</div>
                  <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
                    <SettingRow 
                      icon={<Monitor size={18} className="text-camry-graphite/60" />}
                      title="Device Information"
                      right={<ChevronRight size={16} className="text-camry-graphite/40" />}
                      onClick={() => setSettingsView('device_info')}
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<Terminal size={18} className="text-camry-graphite/60" />}
                      title="Developer Console"
                      right={<ChevronRight size={16} className="text-camry-graphite/40" />}
                      onClick={() => setSettingsView('console')}
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<HardDrive size={18} className="text-camry-graphite/60" />}
                      title="Storage Space"
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
                      icon={<Network size={18} className="text-camry-graphite/60" />}
                      title="Networks"
                      right={
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-camry-graphite/50">Off</span>
                          <ChevronRight size={16} className="text-camry-graphite/40" />
                        </div>
                      }
                      onClick={() => showToast("Networks configuration not available")}
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<Key size={18} className="text-camry-graphite/60" />}
                      title="API key"
                      right={<ChevronRight size={16} className="text-camry-graphite/40" />}
                      onClick={() => setSettingsView('api_key')}
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<Power size={18} className="text-camry-graphite/60" />}
                      title="Auto Power-on"
                      right={<Toggle />}
                    />
                    <div className="h-[1px] bg-black/5 ml-12"></div>
                    <SettingRow 
                      icon={<ArrowLeft size={18} className="text-camry-graphite/60 rotate-90" />} // Update icon approx
                      title="Update"
                      right={
                        <div className="flex items-center gap-3">
                          <span className="font-martian text-xs text-camry-carrier bg-camry-carrier/10 px-2 py-1 rounded">Update available</span>
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

// Helpers

const SettingRow = ({ icon, title, subtitle, right, onClick }: any) => {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3.5 sm:p-4 gap-3 ${onClick ? 'hover:bg-camry-graphite/5 transition-colors text-left cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="min-w-0 flex-1">
          <div className="font-medium text-camry-blackout text-xs sm:text-sm truncate">{title}</div>
          {subtitle && <div className="text-[10px] sm:text-xs text-camry-graphite/50 font-martian mt-0.5 truncate">{subtitle}</div>}
        </div>
      </div>
      <div className="flex-shrink-0 ml-2">{right}</div>
    </Component>
  );
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
