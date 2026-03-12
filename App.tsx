
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from './components/Layout';
import CameraFeed from './components/CameraFeed';
import CriminalGallery from './components/CriminalGallery';
import AlertBanner from './components/AlertBanner';
import HistoryLog from './components/HistoryLog';
import { Criminal, DetectionResult } from './types';
import { INITIAL_CRIMINALS, ALARM_SOUND_URL } from './constants';
import { performFacialRecognition, EnhancedDetectionResult } from './services/geminiService';

const App: React.FC = () => {
  const [criminals, setCriminals] = useState<Criminal[]>(INITIAL_CRIMINALS);
  const [logs, setLogs] = useState<DetectionResult[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [activeAlert, setActiveAlert] = useState<DetectionResult | null>(null);
  
  const isAnalyzingRef = useRef(false);
  const quotaExceededRef = useRef(false);
  const [uiProcessing, setUiProcessing] = useState(false);
  const [uiQuotaError, setUiQuotaError] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(ALARM_SOUND_URL);
    audioRef.current.loop = true;
    audioRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    let timer: number;
    if (cooldownSeconds > 0) {
      timer = window.setInterval(() => {
        setCooldownSeconds(prev => prev - 1);
      }, 1000);
    } else if (cooldownSeconds === 0 && uiQuotaError) {
      setUiQuotaError(false);
      quotaExceededRef.current = false;
    }
    return () => clearInterval(timer);
  }, [cooldownSeconds, uiQuotaError]);

  const handleCapture = useCallback(async (base64: string) => {
    if (isAnalyzingRef.current || quotaExceededRef.current) return;
    
    isAnalyzingRef.current = true;
    setUiProcessing(true);

    try {
      const result: EnhancedDetectionResult = await performFacialRecognition(base64, criminals);
      
      if (result.errorType === 'QUOTA_EXHAUSTED') {
        quotaExceededRef.current = true;
        setUiQuotaError(true);
        // 90s is the safest recovery window for persistent 429s
        setCooldownSeconds(90); 
        return;
      }

      setLogs(prev => [result, ...prev].slice(0, 50));

      if (result.isCriminal && result.confidence >= 50) {
        setActiveAlert(prev => {
          if (!prev) {
            audioRef.current?.play().catch(e => console.error("Alarm error:", e));
            return result;
          }
          return prev;
        });
      }
    } finally {
      isAnalyzingRef.current = false;
      setUiProcessing(false);
    }
  }, [criminals]);

  const stopAlert = () => {
    setActiveAlert(null);
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const addCriminal = (criminal: Criminal) => {
    setCriminals(prev => [criminal, ...prev]);
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 h-full max-w-screen-2xl mx-auto flex flex-col gap-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          
          <div className="lg:col-span-8 flex flex-col gap-6">
            <CameraFeed 
              onCapture={handleCapture} 
              isMonitoring={isMonitoring && !uiQuotaError} 
              activeAlert={!!activeAlert} 
            />
            
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-neutral-900 rounded-xl border border-neutral-800 shadow-xl relative overflow-hidden">
              {uiQuotaError && (
                <div className="absolute inset-0 bg-red-950/80 backdrop-blur-xl flex items-center justify-center border border-red-500/50 z-20 animate-in fade-in duration-300">
                  <div className="flex flex-col items-center gap-4 text-red-500 max-w-xs text-center">
                    <div className="text-4xl font-black tabular-nums tracking-tighter">{cooldownSeconds}s</div>
                    <div className="w-full h-1 bg-red-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${(cooldownSeconds / 90) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-bold text-[10px] uppercase tracking-[0.2em]">API Quota Cooldown Active</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6">
                <div>
                  <h2 className={`text-xl font-bold transition-colors ${isMonitoring ? 'text-red-500' : 'text-white'}`}>
                    {isMonitoring ? 'METERED SCANNING' : 'SYSTEM STANDBY'}
                  </h2>
                  <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase mt-1">Throttle: 2 Requests / Min</p>
                </div>
                <div className="hidden sm:flex flex-col items-center">
                  <div className={`w-32 h-1 bg-neutral-800 rounded overflow-hidden relative ${uiProcessing ? 'block' : 'invisible'}`}>
                    <div className="absolute inset-0 bg-red-600 animate-pulse w-full h-full" />
                  </div>
                  <span className="text-[10px] text-neutral-600 font-bold mt-2 uppercase tracking-tighter">AI Link Status</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  className={`px-8 py-3 rounded-lg font-black tracking-widest text-xs transition-all flex items-center gap-2 border-2 ${
                    isMonitoring 
                    ? 'bg-red-600/10 text-red-500 border-red-500/50 hover:bg-red-500/20' 
                    : 'bg-white text-black border-white hover:bg-neutral-200 shadow-lg'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-red-500 animate-ping' : 'bg-black'}`} />
                  {isMonitoring ? 'STOP SURVEILLANCE' : 'ENGAGE SENTINEL'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="flex-1 min-h-[400px]">
                <CriminalGallery criminals={criminals} onAdd={addCriminal} />
             </div>
             <div className="h-[300px]">
                <HistoryLog logs={logs} />
             </div>
          </div>
        </div>
      </div>

      {activeAlert && (
        <AlertBanner result={activeAlert} onDismiss={stopAlert} />
      )}

      <div className="fixed bottom-4 right-4 text-[10px] text-neutral-700 font-mono uppercase tracking-[0.3em] hidden md:block">
        Sentinel AI | Quota Protection V.4.0
      </div>
    </Layout>
  );
};

export default App;
