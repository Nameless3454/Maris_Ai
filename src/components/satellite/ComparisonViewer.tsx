import React, { useState, useRef, useCallback } from 'react';
import { AnalysisViewMode, SimulatedSpillResult } from '../../types';
import { AnalysisOverlay } from './AnalysisOverlay';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Navigation } from 'lucide-react';

interface ComparisonViewerProps {
  imageUrl: string;
  imageName: string;
  spillResult: SimulatedSpillResult;
  viewMode: AnalysisViewMode;
  onChangeViewMode: (mode: AnalysisViewMode) => void;
  className?: string;
}

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({
  imageUrl,
  imageName,
  spillResult,
  viewMode,
  onChangeViewMode,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const updateSliderPos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pct);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderPos(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateSliderPos(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      updateSliderPos(e.touches[0].clientX);
    }
  };

  return (
    <div
      id="comparison-viewer"
      className={`w-full flex flex-col select-none ${className}`}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Minimal Image Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-[rgba(255,255,255,0.06)]">
        {/* Layer Mode Segmented Tabs: ORIGINAL | DETECTION | MASK | COMPARE */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[rgba(16,12,24,0.8)] border border-[rgba(255,255,255,0.08)] text-xs">
          <button
            type="button"
            id="tab-view-original"
            onClick={() => onChangeViewMode('original')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px] font-sans font-medium ${
              viewMode === 'original'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-[#9A8AA5] hover:text-[#F2EDF7]'
            }`}
          >
            ORIGINAL
          </button>

          <button
            type="button"
            id="tab-view-detected"
            onClick={() => onChangeViewMode('detected')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px] font-sans font-medium ${
              viewMode === 'detected'
                ? 'bg-[rgba(245,158,11,0.15)] text-[#FBBF24] border border-[rgba(245,158,11,0.3)] shadow-sm'
                : 'text-[#9A8AA5] hover:text-[#FBBF24]'
            }`}
          >
            DETECTION
          </button>

          <button
            type="button"
            id="tab-view-mask"
            onClick={() => onChangeViewMode('mask')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px] font-sans font-medium ${
              viewMode === 'mask'
                ? 'bg-[rgba(56,189,248,0.15)] text-[#38BDF8] border border-[rgba(56,189,248,0.3)] shadow-sm'
                : 'text-[#9A8AA5] hover:text-[#38BDF8]'
            }`}
          >
            MASK
          </button>

          <button
            type="button"
            id="tab-view-comparison"
            onClick={() => onChangeViewMode('comparison')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px] font-sans font-medium ${
              viewMode === 'comparison'
                ? 'bg-[rgba(176,38,255,0.18)] text-[#E9D5FF] border border-[rgba(176,38,255,0.35)] shadow-sm'
                : 'text-[#9A8AA5] hover:text-[#E9D5FF]'
            }`}
          >
            COMPARE
          </button>
        </div>

        {/* Minimal Zoom & View Controls: ZOOM - | 100% | ZOOM + | FIT */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] p-0.5">
            <button
              type="button"
              title="Zoom Out"
              onClick={() => setZoomLevel((z) => Math.max(0.7, Number((z - 0.15).toFixed(2))))}
              className="p-1 rounded text-[#9A8AA5] hover:text-white transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              title="Reset Zoom to Fit"
              onClick={() => setZoomLevel(1.0)}
              className="px-2 text-[10px] font-mono text-[#D6A7FF] hover:text-white min-w-[36px] text-center cursor-pointer"
            >
              {Math.round(zoomLevel * 100)}%
            </button>

            <button
              type="button"
              title="Zoom In"
              onClick={() => setZoomLevel((z) => Math.min(2.5, Number((z + 0.15).toFixed(2))))}
              className="p-1 rounded text-[#9A8AA5] hover:text-white transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Workstation'}
            onClick={() => setIsFullscreen((f) => !f)}
            className="p-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.08)] text-[#9A8AA5] hover:text-[#00F0FF] transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Hero Image Workspace Viewport */}
      <div
        ref={containerRef}
        id="comparison-canvas-wrapper"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className={`relative w-full rounded-xl overflow-hidden bg-[#07050d] border border-[rgba(255,255,255,0.08)] flex items-center justify-center shadow-[inset_0_2px_12px_rgba(0,0,0,0.85)] ${
          isFullscreen ? 'fixed inset-4 z-50 rounded-xl bg-black/95' : 'min-h-[380px] max-h-[580px]'
        }`}
      >
        {/* Corner Reticles */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-white/20 pointer-events-none z-20" />
        <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-white/20 pointer-events-none z-20" />
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-white/20 pointer-events-none z-20" />
        <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-white/20 pointer-events-none z-20" />

        {/* 
          Professional Geospatial Map Annotations:
          - Compact top corner status: ● SPILL DETECTED | CONFIDENCE 92%
          - Coordinates: Lat / Lon
          - Scale bar: SCALE 10 km
          - North indicator: N ↑
        */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none flex items-center gap-2">
          <div className="px-2 py-0.5 rounded bg-black/75 border border-white/10 text-[10px] font-mono text-white/90 flex items-center gap-1.5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            <span className="font-semibold text-[#FBBF24]">SPILL DETECTED</span>
            <span className="text-white/30">|</span>
            <span className="text-[#D6A7FF]">CONFIDENCE {spillResult.confidence}%</span>
          </div>

          <div className="hidden sm:block px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9.5px] font-mono text-[#9A8AA5] backdrop-blur-sm">
            {spillResult.coordinates?.lat || "14°51'07\"N"} {spillResult.coordinates?.lon || "88°14'55\"E"}
          </div>
        </div>

        {/* North Indicator & Scale Bar (Bottom corners) */}
        <div className="absolute bottom-3 right-3 z-20 pointer-events-none flex items-center gap-3">
          {/* Scale 10 km GIS annotation */}
          <div className="flex flex-col items-end text-[9px] font-mono text-[#81758F] bg-black/60 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
            <span>SCALE 10 km</span>
            <div className="w-16 h-1 border-b-2 border-l-2 border-r-2 border-[#81758F] mt-0.5" />
          </div>

          {/* North Arrow */}
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-[#81758F] backdrop-blur-sm">
            <span>N</span>
            <Navigation className="w-2.5 h-2.5 text-[#38BDF8] rotate-[-45deg]" />
          </div>
        </div>

        {/* Scalable Container for Zoom */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-100"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Base Layer: Crisp Original Satellite Image */}
          <img
            src={imageUrl}
            alt={imageName}
            className="w-full h-auto max-h-[560px] object-contain block mx-auto pointer-events-none select-none rounded-lg"
            referrerPolicy="no-referrer"
          />

          {/* Mode 1: DETECTION (Subtle organic segmentation overlay) */}
          {viewMode === 'detected' && (
            <AnalysisOverlay spillResult={spillResult} />
          )}

          {/* Mode 2: MASK (Binary GIS mask) */}
          {viewMode === 'mask' && (
            <AnalysisOverlay spillResult={spillResult} isMaskOnly={true} />
          )}

          {/* Mode 3: COMPARE (Interactive Split Slider with thin divider) */}
          {viewMode === 'comparison' && (
            <>
              {/* Clipped Overlaid Detected Layer */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{
                  clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
                }}
              >
                <img
                  src={imageUrl}
                  alt={imageName}
                  className="w-full h-auto max-h-[560px] object-contain block mx-auto"
                  referrerPolicy="no-referrer"
                />
                <AnalysisOverlay spillResult={spillResult} />
              </div>

              {/* Draggable Divider Line (Thin 1px line, no giant glowing handle) */}
              <div
                id="comparison-slider-divider"
                onMouseDown={handleMouseDown}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                className="absolute top-0 bottom-0 w-px bg-white/70 hover:bg-[#00F0FF] cursor-ew-resize pointer-events-auto z-30 transition-colors"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Minimal Grab Indicator (Small 12x24px pill, no neon glow) */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-6 rounded-sm bg-[#0E0A14] border border-white/40 flex items-center justify-center cursor-ew-resize shadow-md">
                  <div className="w-0.5 h-3 bg-white/60 rounded-full" />
                </div>
              </div>

              {/* Minimal Bottom Labels */}
              <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/75 border border-white/10 text-[9px] font-mono text-[#81758F] pointer-events-none z-10">
                ORIGINAL
              </div>
              <div className="absolute bottom-3 left-24 px-2 py-0.5 rounded bg-black/75 border border-white/10 text-[9px] font-mono text-[#FBBF24] pointer-events-none z-10">
                DETECTION
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
