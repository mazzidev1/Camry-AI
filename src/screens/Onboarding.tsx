import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Check } from 'lucide-react';
import { CamryLogo } from '../components/CamryLogo';

export const Onboarding: React.FC = () => {
  const { setIsOnboarded, loadedModel } = useAppContext();
  const [step, setStep] = useState(1);
  const [deviceName, setDeviceName] = useState('Office Camry');
  const [showManualIp, setShowManualIp] = useState(false);
  const [manualIp, setManualIp] = useState('http://[fd80:7:7:7::1]:80');

  // Scanning simulation
  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        setStep(2.5); // 2.5 means found device
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (step === 3) {
      const timer = setTimeout(() => {
        setStep(3.5); // Connected
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center relative bg-camry-paper text-camry-blackout overflow-y-auto p-4 sm:p-6">
      
      {/* Faint Africa Motif Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-[800px] h-[800px]" stroke="currentColor" fill="none" strokeWidth="2">
          {/* Abstract simple Africa outline approx */}
          <path d="M 120 100 C 180 80, 240 100, 280 140 C 320 200, 300 280, 240 340 C 200 380, 160 360, 140 300 C 120 260, 80 240, 80 180 C 80 140, 100 120, 120 100 Z" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center z-10 flex flex-col items-center"
          >
            <div className="mb-4">
              <CamryLogo variant="dark" layout="stacked" size="lg" />
            </div>
            <div className="font-martian text-xs tracking-[0.2em] text-camry-graphite/60 mb-8">INTELLIGENCE, ON-PREMISE.</div>
            <p className="text-camry-graphite/80 text-lg mb-8 font-familjen">Let's connect this computer to your Camry device.</p>
            <button 
              onClick={() => setStep(2)}
              className="bg-camry-blackout text-camry-paper px-8 py-3 rounded-lg font-medium shadow-md hover:bg-camry-graphite transition-all focus:ring-2 focus:ring-camry-carrier focus:ring-offset-2 focus:ring-offset-camry-paper"
            >
              Find my device
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="text-center z-10 flex flex-col items-center"
          >
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-camry-carrier/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border border-camry-carrier/50 animate-pulse" />
              <Monitor size={32} className="text-camry-carrier" />
            </div>
            <div className="font-martian text-sm text-camry-graphite/70 animate-pulse">SCANNING LOCAL NETWORK...</div>
          </motion.div>
        )}

        {step === 2.5 && (
          <motion.div 
            key="step2.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center z-10 flex flex-col items-center max-w-md w-full"
          >
            <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm w-full flex flex-col items-center text-center">
              {showManualIp ? (
                <div className="w-full flex flex-col items-center">
                  <label className="block text-sm font-medium text-camry-graphite mb-2 self-start">Device IP Address</label>
                  <input 
                    type="text"
                    value={manualIp}
                    onChange={(e) => setManualIp(e.target.value)}
                    className="w-full border border-black/10 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:border-camry-deep-carrier font-martian text-sm text-camry-blackout bg-camry-graphite/5"
                  />
                  <button 
                    onClick={() => setStep(3)}
                    className="w-full bg-camry-blackout text-camry-paper px-6 py-3 rounded-lg font-medium hover:bg-camry-graphite transition-all"
                  >
                    Connect
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-camry-graphite/5 flex items-center justify-center mb-4">
                    <Monitor size={28} className="text-camry-blackout" />
                  </div>
                  <h2 className="text-2xl font-bricolage mb-1">CAMRY ONE</h2>
                  <div className="font-martian text-xs text-camry-graphite/60 mb-6 bg-camry-graphite/5 px-3 py-1 rounded">
                    192.168.1.42 · 256GB · FW 1.0.3
                  </div>
                  <button 
                    onClick={() => setStep(3)}
                    className="w-full bg-camry-blackout text-camry-paper px-6 py-3 rounded-lg font-medium hover:bg-camry-graphite transition-all"
                  >
                    Connect
                  </button>
                </>
              )}
            </div>
            {!showManualIp && (
              <button 
                onClick={() => setShowManualIp(true)}
                className="mt-6 text-sm text-camry-graphite/60 hover:text-camry-blackout transition-colors underline underline-offset-4"
              >
                Enter IP manually
              </button>
            )}
          </motion.div>
        )}

        {(step === 3 || step === 3.5) && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center z-10 flex flex-col items-center max-w-md w-full"
          >
            <div className="mb-8 font-martian text-sm flex items-center gap-2">
              {step === 3 ? (
                <span className="text-camry-graphite/70 animate-pulse">PAIRING...</span>
              ) : (
                <span className="text-camry-deep-carrier flex items-center gap-2">
                  CONNECTED <Check size={16} />
                </span>
              )}
            </div>

            <div className={`w-full transition-opacity duration-500 ${step === 3 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm w-full text-left mb-6">
                <label className="block text-sm font-medium text-camry-graphite mb-2">Device Name</label>
                <input 
                  type="text" 
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className="w-full border border-black/10 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:border-camry-deep-carrier font-familjen"
                />
                
                <div className="bg-camry-graphite/5 rounded-lg p-4 font-martian text-xs text-camry-graphite/70 space-y-2">
                  <div className="flex justify-between"><span>MODEL</span><span className="text-camry-blackout">CAMRY ONE</span></div>
                  <div className="flex justify-between"><span>MEMORY</span><span className="text-camry-blackout">256GB</span></div>
                  <div className="flex justify-between"><span>FIRMWARE</span><span className="text-camry-blackout">1.0.3</span></div>
                  <div className="flex justify-between border-t border-black/5 pt-2 mt-2">
                    <span>LOADED AI</span><span className="text-camry-blackout">{loadedModel}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsOnboarded(true)}
                className="w-full bg-camry-blackout text-camry-paper px-6 py-3 rounded-lg font-medium hover:bg-camry-graphite transition-all flex items-center justify-center gap-2"
              >
                Enter Camry
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
