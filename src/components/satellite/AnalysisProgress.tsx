import React, { useEffect, useState } from 'react';
import { Check, Loader2, Scan } from 'lucide-react';

interface AnalysisProgressProps {
  onComplete: () => void;
  className?: string;
}

interface Step {
  id: number;
  label: string;
  targetPercent: number;
  confidenceVal: number;
  durationMs: number;
}

const ANALYSIS_STEPS: Step[] = [
  { id: 1, label: 'Calibrating SAR Range & Azimuth Swath', targetPercent: 20, confidenceVal: 18, durationMs: 800 },
  { id: 2, label: 'Backscatter Threshold & Ocean Segmentation', targetPercent: 45, confidenceVal: 48, durationMs: 850 },
  { id: 3, label: 'Dark Formation Morphology Classification', targetPercent: 70, confidenceVal: 74, durationMs: 900 },
  { id: 4, label: 'Boundary Delineation & Feature Extraction', targetPercent: 90, confidenceVal: 88, durationMs: 850 },
  { id: 5, label: 'Target Verification & Co-registration', targetPercent: 100, confidenceVal: 92, durationMs: 700 },
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  onComplete,
  className = '',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [confidenceDisplay, setConfidenceDisplay] = useState<number>(0);

  useEffect(() => {
    let accumulatedTime = 0;
    const timers: NodeJS.Timeout[] = [];

    setProgressPercent(0);
    setConfidenceDisplay(0);

    ANALYSIS_STEPS.forEach((step, idx) => {
      accumulatedTime += step.durationMs;
      const timer = setTimeout(() => {
        setCurrentStepIndex(idx);
        setProgressPercent(step.targetPercent);
        setConfidenceDisplay(step.confidenceVal);

        if (idx === ANALYSIS_STEPS.length - 1) {
          const finalTimer = setTimeout(() => {
            onComplete();
          }, 600);
          timers.push(finalTimer);
        }
      }, accumulatedTime - step.durationMs);

      timers.push(timer);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  return (
    <div
      id="satellite-analysis-progress"
      className={`absolute inset-0 bg-[rgba(6,5,10,0.85)] backdrop-blur-[10px] flex flex-col items-center justify-center p-6 select-none z-20 overflow-hidden ${className}`}
    >
      {/* 
        Subtle Remote Sensing Scanner Line
        Clean 1px laser sweep with soft tail moving vertically across the image
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="w-full h-24 bg-gradient-to-b from-transparent via-[#00F0FF]/15 to-transparent relative"
          style={{
            animation: 'radarSweep 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          }}
        >
          {/* Crisp 1px scanner head */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#00F0FF]/60 shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
        </div>

        {/* Small segmented region blocks that appear during analysis */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
            {progressPercent >= 45 && (
              <rect x="36" y="38" width="8" height="6" fill="#00F0FF" fillOpacity="0.15" stroke="#00F0FF" strokeWidth="0.2" strokeDasharray="1,1" />
            )}
            {progressPercent >= 55 && (
              <rect x="44" y="35" width="10" height="8" fill="#00F0FF" fillOpacity="0.18" stroke="#00F0FF" strokeWidth="0.2" strokeDasharray="1,1" />
            )}
            {progressPercent >= 70 && (
              <rect x="52" y="40" width="12" height="10" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="0.2" />
            )}
            {progressPercent >= 85 && (
              <path
                d="M 38,36 Q 52,32 62,42 Q 68,52 54,58 Q 40,56 38,36 Z"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="0.35"
                strokeOpacity="0.8"
                strokeDasharray="1.5,1"
              />
            )}
          </svg>
        </div>

        {/* Fine Geospatial Coordinate Grid */}
        <div
          className="w-full h-full opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <style>{`
        @keyframes radarSweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(450%); }
        }
      `}</style>

      {/* Main Glass Telemetry Card */}
      <div className="relative w-full max-w-sm bg-[rgba(14,10,20,0.95)] border border-[rgba(255,255,255,0.09)] rounded-xl p-5 shadow-[0_20px_45px_rgba(0,0,0,0.85)]">
        {/* Header with animating confidence readout (0% -> 92%) */}
        <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF]">
              <Scan className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div>
              <h4 className="text-xs font-sans font-semibold text-white tracking-tight">
                Processing Remote Sensing
              </h4>
              <span className="text-[10px] font-mono text-[#81758F] uppercase tracking-wider">
                SAR Deep Learning Extraction
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[9px] font-mono text-[#81758F] uppercase">
              CONFIDENCE
            </div>
            <span className="text-base font-mono font-bold text-[#34D399]">
              {confidenceDisplay}%
            </span>
          </div>
        </div>

        {/* Clean Linear Progress Bar */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-[#8A00E8] via-[#B026FF] to-[#38BDF8] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step-by-step checklist */}
        <div className="space-y-1.5">
          {ANALYSIS_STEPS.map((step, idx) => {
            const isCompleted = progressPercent > step.targetPercent || (progressPercent === 100 && idx === 4);
            const isCurrent = currentStepIndex === idx && !isCompleted;

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-md transition-all text-xs ${
                  isCurrent
                    ? 'bg-white/5 text-white'
                    : isCompleted
                    ? 'text-white/80'
                    : 'text-[#81758F]/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-mono shrink-0 ${
                      isCompleted
                        ? 'bg-[#34D399]/20 text-[#34D399]'
                        : isCurrent
                        ? 'bg-[#00F0FF]/20 text-[#00F0FF]'
                        : 'bg-white/5 text-[#81758F]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-2.5 h-2.5" /> : isCurrent ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : step.id}
                  </div>
                  <span className="text-[11px] font-sans truncate max-w-[220px]">
                    {step.label}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-[#81758F]">
                  {step.targetPercent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
