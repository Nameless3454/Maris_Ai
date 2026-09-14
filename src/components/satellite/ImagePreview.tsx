import React, { useState } from 'react';
import { SatelliteImageData } from '../../types';
import { Play, RefreshCw, Trash2, Maximize2, Minimize2, ZoomIn, Satellite, CheckCircle2 } from 'lucide-react';

interface ImagePreviewProps {
  imageData: SatelliteImageData;
  onAnalyze: () => void;
  onChangeImage: () => void;
  onRemove: () => void;
  isAnalyzing?: boolean;
  statusText?: string;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageData,
  onAnalyze,
  onChangeImage,
  onRemove,
  isAnalyzing = false,
  statusText = 'READY FOR ANALYSIS',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div
      id="satellite-image-preview-panel"
      className={`w-full flex flex-col select-none ${className}`}
    >
      {/* Top Header Information Bar */}
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2">
          <Satellite className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span className="text-[11px] font-mono font-semibold tracking-wider text-[#F2EDF7] uppercase">
            SATELLITE IMAGE
          </span>
          <span className="text-xs text-[#81758F] hidden sm:inline">•</span>
          <span className="text-xs font-sans text-[#B9ADBF] truncate max-w-[200px] sm:max-w-xs">
            {imageData.name}
          </span>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.25)] text-[10px] font-mono text-[#34D399]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
          <span>{statusText}</span>
        </div>
      </div>

      {/* Hero Satellite Image Container */}
      <div
        id="image-preview-frame"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-full rounded-xl overflow-hidden bg-[#06040a] border border-[rgba(255,255,255,0.08)] shadow-[0_12px_30px_rgba(0,0,0,0.7)] group transition-all ${
          isFullscreen ? 'fixed inset-4 z-50 rounded-xl bg-black/95 flex items-center justify-center' : 'max-h-[460px]'
        }`}
      >
        {/* Subtle Technical Corner Reticles */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-[rgba(255,255,255,0.25)] pointer-events-none z-10" />
        <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-[rgba(255,255,255,0.25)] pointer-events-none z-10" />
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-[rgba(255,255,255,0.25)] pointer-events-none z-10" />
        <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-[rgba(255,255,255,0.25)] pointer-events-none z-10" />

        {/* Actual selected image preserving aspect ratio */}
        <img
          src={imageData.url}
          alt={imageData.name}
          className={`w-full h-auto max-h-[440px] object-contain block mx-auto transition-transform duration-300 pointer-events-none select-none rounded-lg ${
            isHovered && !isFullscreen ? 'scale-[1.015]' : 'scale-100'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Top-Right Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen((f) => !f)}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 border border-white/15 text-[#B9ADBF] hover:text-white transition-colors cursor-pointer z-10"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Interactive Hover Zoom Hint */}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[9.5px] font-sans text-[#B9ADBF] flex items-center gap-1.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3 h-3 text-[#00F0FF]" />
          <span>Interactive Zoom Active</span>
        </div>
      </div>

      {/* Metadata & Actions Footer */}
      <div className="mt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
        {/* Technical Metadata Details */}
        <div className="flex items-center gap-4 text-left">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#81758F]">
              RESOLUTION
            </div>
            <div className="text-xs font-mono font-medium text-[#F2EDF7]">
              {imageData.width} × {imageData.height}
            </div>
          </div>

          <div className="w-px h-6 bg-white/10" />

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#81758F]">
              FILE SIZE
            </div>
            <div className="text-xs font-mono font-medium text-[#F2EDF7]">
              {imageData.sizeFormatted}
            </div>
          </div>

          <div className="w-px h-6 bg-white/10 hidden xs:block" />

          <div className="hidden xs:block">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#81758F]">
              INGESTION
            </div>
            <div className="text-xs font-mono font-medium text-[#D6A7FF]">
              {imageData.loadedAt || 'Captured'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            id="btn-change-image"
            onClick={onChangeImage}
            disabled={isAnalyzing}
            className="px-2.5 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-xs font-sans text-[#B9ADBF] hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="w-3 h-3 text-[#9A8AA5]" />
            <span>Change Image</span>
          </button>

          <button
            type="button"
            id="btn-remove-image"
            onClick={onRemove}
            disabled={isAnalyzing}
            className="px-2.5 py-1.5 rounded-lg bg-[rgba(239,68,68,0.08)] hover:bg-[rgba(239,68,68,0.18)] border border-[rgba(239,68,68,0.22)] text-xs font-sans text-[#FFA2A8] hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove</span>
          </button>

          {/* Primary Action Button */}
          <button
            type="button"
            id="btn-analyze-image"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-[#8A00E8] to-[#B026FF] hover:from-[#9D00FF] hover:to-[#C14CFF] active:scale-[0.98] text-white text-xs font-sans font-semibold tracking-wide flex items-center justify-center gap-1.5 shadow-[0_2px_12px_rgba(138,0,232,0.35)] transition-all cursor-pointer border border-white/20 disabled:opacity-50 ml-1"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>ANALYZE IMAGE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

