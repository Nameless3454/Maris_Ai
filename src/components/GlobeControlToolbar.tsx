import React from 'react';
import { RotateCw, Eye, EyeOff, Layers, Globe, Satellite } from 'lucide-react';

export interface GlobeControlToolbarProps {
  activeLayer: 'all' | 'spills' | 'routes' | 'vessels';
  onChangeLayer: (layer: 'all' | 'spills' | 'routes' | 'vessels') => void;
  onFocusRegion: (region: 'india' | 'atlantic') => void;
  isRotating: boolean;
  onToggleRotate: () => void;
  isPanelsVisible?: boolean;
  onTogglePanels?: () => void;
  onOpenSatelliteAnalysis?: () => void;
  className?: string;
}

export const GlobeControlToolbar: React.FC<GlobeControlToolbarProps> = ({
  activeLayer,
  onChangeLayer,
  onFocusRegion,
  isRotating,
  onToggleRotate,
  isPanelsVisible = true,
  onTogglePanels,
  onOpenSatelliteAnalysis,
  className = '',
}) => {
  return (
    <div
      id="maris-globe-control-toolbar"
      className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl maris-glass-floating border border-[rgba(176,38,255,0.35)] shadow-[0_8px_32px_rgba(0,0,0,0.7),0_0_20px_rgba(157,0,255,0.15)] pointer-events-auto max-w-full ${className}`}
    >
      {/* Tier 1: Primary Surveillance Layer Selectors */}
      <div className="flex items-center gap-1 w-full justify-center flex-wrap sm:flex-nowrap">
        <button
          type="button"
          onClick={() => onChangeLayer('all')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs font-mono font-semibold ${
            activeLayer === 'all'
              ? 'maris-nav-active shadow-[0_0_12px_rgba(176,38,255,0.45)]'
              : 'text-[#9D93AB] hover:text-[#D6A7FF] hover:bg-[rgba(157,0,255,0.1)]'
          }`}
        >
          Composite
        </button>

        <button
          type="button"
          onClick={() => onChangeLayer('spills')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs font-mono font-semibold ${
            activeLayer === 'spills'
              ? 'bg-[rgba(239,68,68,0.25)] text-[#FFA2A8] border border-[rgba(239,68,68,0.5)] shadow-[0_0_12px_rgba(239,68,68,0.35)]'
              : 'text-[#9D93AB] hover:text-[#FFA2A8] hover:bg-[rgba(239,68,68,0.1)]'
          }`}
        >
          Oil Spills
        </button>

        <button
          type="button"
          onClick={() => onChangeLayer('routes')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs font-mono font-semibold ${
            activeLayer === 'routes'
              ? 'bg-[rgba(168,85,247,0.25)] text-[#D8B4FE] border border-[rgba(168,85,247,0.5)] shadow-[0_0_12px_rgba(168,85,247,0.35)]'
              : 'text-[#9D93AB] hover:text-[#D8B4FE] hover:bg-[rgba(168,85,247,0.1)]'
          }`}
        >
          AIS Routes
        </button>

        <button
          type="button"
          onClick={() => {
            onChangeLayer('vessels');
            onFocusRegion('india');
          }}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap text-xs font-mono font-semibold ${
            activeLayer === 'vessels'
              ? 'bg-[rgba(6,182,212,0.25)] text-[#67E8F9] border border-[rgba(6,182,212,0.5)] shadow-[0_0_12px_rgba(6,182,212,0.35)]'
              : 'text-[#9D93AB] hover:text-[#67E8F9] hover:bg-[rgba(6,182,212,0.1)]'
          }`}
        >
          <span>🇮🇳</span>
          <span>Indian Fleet</span>
        </button>
      </div>

      {/* Tier 2: Viewport Focus, Teleport & Operations */}
      <div className="flex items-center gap-1.5 w-full justify-center pt-1 border-t border-[rgba(255,255,255,0.08)] flex-wrap sm:flex-nowrap">
        {/* Region Teleports */}
        <button
          type="button"
          onClick={() => onFocusRegion('india')}
          title="Teleport camera to Indian Subcontinent, Arabian Sea & Bay of Bengal"
          className="px-2 py-1 rounded-lg text-xs font-mono text-[#9D93AB] hover:text-[#FDE047] hover:bg-[rgba(253,224,71,0.12)] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
        >
          <span>🇮🇳</span>
          <span>India</span>
        </button>

        <button
          type="button"
          onClick={() => onFocusRegion('atlantic')}
          title="Teleport camera to Atlantic Ocean & Europe"
          className="px-2 py-1 rounded-lg text-xs font-mono text-[#9D93AB] hover:text-[#D6A7FF] hover:bg-[rgba(157,0,255,0.12)] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
        >
          <Globe className="w-3.5 h-3.5 text-[#B026FF]" />
          <span>Atlantic</span>
        </button>

        <div className="w-px h-3.5 bg-[rgba(255,255,255,0.15)] mx-0.5" />

        {/* Spin Toggle */}
        <button
          type="button"
          onClick={onToggleRotate}
          title={isRotating ? 'Pause Planetary Spin' : 'Enable Planetary Spin'}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer text-xs font-mono ${
            isRotating
              ? 'text-[#D6A7FF] bg-[rgba(157,0,255,0.22)] border border-[rgba(176,38,255,0.40)] shadow-[0_0_8px_rgba(157,0,255,0.3)]'
              : 'text-[#9D93AB] hover:text-[#F2EDF7] hover:bg-[rgba(255,255,255,0.05)]'
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin text-[#B026FF]' : ''}`} />
          <span>{isRotating ? 'Spinning' : 'Spin'}</span>
        </button>

        {/* Panels Toggle */}
        {onTogglePanels && (
          <button
            type="button"
            onClick={onTogglePanels}
            title={isPanelsVisible ? 'Hide Panels (Full Globe Focus)' : 'Show Dashboard Panels'}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer text-xs font-mono ${
              !isPanelsVisible
                ? 'text-[#6EE7B7] bg-[rgba(52,211,153,0.18)] border border-[rgba(52,211,153,0.4)] shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                : 'text-[#9D93AB] hover:text-[#D6A7FF] hover:bg-[rgba(255,255,255,0.05)]'
            }`}
          >
            {isPanelsVisible ? (
              <Eye className="w-3.5 h-3.5 text-[#B026FF]" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-[#6EE7B7]" />
            )}
            <span>{isPanelsVisible ? 'Panels' : 'Hidden'}</span>
          </button>
        )}

        {/* Satellite Image Analysis Trigger */}
        {onOpenSatelliteAnalysis && (
          <>
            <div className="w-px h-3.5 bg-[rgba(255,255,255,0.15)] mx-0.5" />
            <button
              type="button"
              onClick={onOpenSatelliteAnalysis}
              title="Upload and analyze satellite SAR image"
              className="px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer text-[#67E8F9] hover:text-white bg-[rgba(0,240,255,0.15)] hover:bg-[rgba(0,240,255,0.25)] border border-[rgba(0,240,255,0.4)] shadow-[0_0_8px_rgba(0,240,255,0.25)] text-xs font-mono font-bold"
            >
              <Satellite className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>SAR Swath</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
