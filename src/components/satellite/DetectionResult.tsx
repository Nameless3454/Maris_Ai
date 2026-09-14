import React from 'react';
import { SimulatedSpillResult } from '../../types';
import { Globe, ArrowRight, RotateCcw, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';

interface DetectionResultProps {
  result: SimulatedSpillResult;
  onVisualizeOnGlobe: () => void;
  onContinueInvestigation: () => void;
  onResetView: () => void;
  className?: string;
}

export const DetectionResult: React.FC<DetectionResultProps> = ({
  result,
  onVisualizeOnGlobe,
  onContinueInvestigation,
  onResetView,
  className = '',
}) => {
  return (
    <div
      id="satellite-detection-result"
      className={`w-full h-full flex flex-col justify-between bg-[rgba(14,10,20,0.96)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 sm:p-5 shadow-[0_16px_36px_rgba(0,0,0,0.85)] select-none text-[#F2EDF7] font-sans ${className}`}
    >
      <div className="space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              MARIS ANALYSIS
            </h3>
            <p className="text-[10px] font-mono text-[#81758F] mt-0.5">
              SAR SEGMENTATION REPORT
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-medium bg-[rgba(245,158,11,0.15)] text-[#FBBF24] border border-[rgba(245,158,11,0.3)]">
            TIER 1 DETECT
          </span>
        </div>

        {/* SECTION 1: DETECTION */}
        <div className="space-y-2.5">
          <div className="text-[10px] font-mono uppercase text-[#81758F] tracking-wider">
            DETECTION
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-[#9A8AA5]">Classification</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span className="text-xs font-semibold text-white">Oil Spill (Detected)</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-white/5">
            <span className="text-xs text-[#9A8AA5]">Confidence</span>
            <span className="text-xs font-mono font-bold text-[#34D399]">
              {result.confidence}%
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-white/5">
            <span className="text-xs text-[#9A8AA5]">Estimated Area</span>
            <span className="text-xs font-mono font-bold text-[#FBBF24]">
              {result.areaKm2} <span className="font-normal text-[10px] text-[#81758F]">km²</span>
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-white/5">
            <span className="text-xs text-[#9A8AA5]">Estimated Age</span>
            <span className="text-xs font-mono text-white">
              {result.estimatedAge}
            </span>
          </div>
        </div>

        {/* SECTION 2: SPILL GEOMETRY */}
        <div className="space-y-2.5 pt-2 border-t border-[rgba(255,255,255,0.08)]">
          <div className="text-[10px] font-mono uppercase text-[#81758F] tracking-wider">
            SPILL GEOMETRY
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-[#9A8AA5]">Length</span>
            <span className="text-xs font-mono text-white font-medium">
              {result.lengthKm ?? 18.6} km
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-white/5">
            <span className="text-xs text-[#9A8AA5]">Width</span>
            <span className="text-xs font-mono text-white font-medium">
              {result.widthKm ?? 4.2} km
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-white/5">
            <span className="text-xs text-[#9A8AA5]">Orientation</span>
            <span className="text-xs font-mono text-white font-medium">
              0{result.orientationDeg ?? 37}° (NE Drift)
            </span>
          </div>
        </div>

        {/* SECTION 3: DATA & PLATFORM */}
        <div className="space-y-2.5 pt-2 border-t border-[rgba(255,255,255,0.08)]">
          <div className="text-[10px] font-mono uppercase text-[#81758F] tracking-wider">
            DATA & ATTRIBUTION
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-[#9A8AA5]">SAR Feature</span>
            <span className="text-xs font-mono text-[#38BDF8]">
              Verified Dark Slick
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-white/5">
            <span className="text-xs text-[#9A8AA5]">Analysis Mode</span>
            <span className="text-xs font-mono text-[#D6A7FF]">
              DEMO SIMULATION
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: MISSION ACTIONS & CTAs */}
      <div className="pt-4 mt-4 border-t border-[rgba(255,255,255,0.08)] space-y-2">
        {/* IMAGE → GLOBE */}
        <button
          type="button"
          id="btn-visualize-on-globe"
          onClick={onVisualizeOnGlobe}
          className="w-full px-3.5 py-2 rounded-lg bg-[rgba(56,189,248,0.1)] hover:bg-[rgba(56,189,248,0.18)] border border-[rgba(56,189,248,0.35)] text-[#38BDF8] hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>IMAGE → GLOBE</span>
        </button>

        {/* CONTINUE INVESTIGATION */}
        <button
          type="button"
          id="btn-continue-investigation"
          onClick={onContinueInvestigation}
          className="w-full px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#8A00E8] to-[#B026FF] hover:from-[#9D00FF] hover:to-[#C14CFF] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(138,0,232,0.3)] border border-white/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>CONTINUE INVESTIGATION</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* RESET VIEW */}
        <button
          type="button"
          id="btn-reset-analysis-view"
          onClick={onResetView}
          className="w-full px-3 py-1.5 rounded-lg bg-transparent hover:bg-white/5 text-[#81758F] hover:text-white text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Analysis</span>
        </button>
      </div>
    </div>
  );
};
