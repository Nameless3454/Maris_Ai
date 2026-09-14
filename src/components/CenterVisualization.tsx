import React from 'react';
import { Incident, Vessel, SimulationState, InvestigationStage, SatelliteImageData, SimulatedSpillResult } from '../types';
import { Compass, ZoomIn, Satellite, ExternalLink, ArrowRight } from 'lucide-react';
import { EarthGlobe3D } from './EarthGlobe3D';
import { INDIAN_VESSELS } from '../data/indianVessels';
import { InvestigationHud } from './InvestigationHud';

interface CenterVisualizationProps {
  incidents: Incident[];
  selectedIncident: Incident;
  onSelectIncident: (incident: Incident) => void;
  onInitiateInvestigation?: (incident: Incident) => void;
  timelineHour?: number;
  isPanelsVisible?: boolean;
  onTogglePanels?: () => void;
  vessels?: Vessel[];
  selectedVessel?: Vessel | null;
  onSelectVessel?: (vessel: Vessel) => void;
  targetRegion?: 'india' | 'atlantic' | 'indian-ocean' | 'arabian-sea' | 'bay-of-bengal' | null;
  onSetTargetRegion?: (region: 'india' | 'atlantic' | 'indian-ocean' | 'arabian-sea' | 'bay-of-bengal' | null) => void;
  mapProjection?: '3D Globe' | '2D Mercator';
  activeLayer?: 'all' | 'spills' | 'routes' | 'vessels';
  isRotating?: boolean;
  simulationState?: SimulationState;
  hindcastProgress?: number;
  forecastProgress?: number;
  scanAngle?: number;
  onStartSimulation?: () => void;
  onPlayPauseSimulation?: () => void;
  onSkipSimulationStage?: () => void;
  onResetSimulation?: () => void;
  onSelectSimulationStage?: (stage: InvestigationStage) => void;
  onOpenSatelliteAnalysis?: () => void;
  connectedSatelliteData?: {
    image: SatelliteImageData;
    result: SimulatedSpillResult;
  } | null;
}

export const CenterVisualization: React.FC<CenterVisualizationProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  isPanelsVisible = true,
  onTogglePanels,
  vessels = INDIAN_VESSELS,
  selectedVessel,
  onSelectVessel,
  targetRegion = null,
  onSetTargetRegion,
  mapProjection = '3D Globe',
  activeLayer = 'all',
  isRotating = false,
  simulationState,
  hindcastProgress = 0,
  forecastProgress = 0,
  scanAngle = 0,
  onStartSimulation,
  onPlayPauseSimulation,
  onSkipSimulationStage,
  onResetSimulation,
  onSelectSimulationStage,
  onOpenSatelliteAnalysis,
  connectedSatelliteData,
}) => {
  return (
    <main
      id="center-globe-container"
      aria-label="Interactive 3D Earth Maritime Command Intelligence"
      className="w-full h-full relative overflow-hidden select-none bg-[#050508] flex items-center justify-center"
    >
      {/* Deep Space Background Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(12,8,22,0.6) 0%, #050508 75%)',
        }}
      />

      {/* Subtle Purple Optical Corona behind the Earth */}
      <div className="absolute w-[680px] h-[680px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(157,0,255,0.12)_0%,rgba(157,0,255,0.04)_40%,transparent_70%)]" />

      {/* Primary 3D Earth Globe */}
      <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
        <EarthGlobe3D
          incidents={incidents}
          selectedIncident={selectedIncident}
          onSelectIncident={onSelectIncident}
          vessels={vessels}
          selectedVessel={selectedVessel}
          onSelectVessel={onSelectVessel}
          activeLayer={activeLayer}
          isRotating={isRotating}
          targetRegion={targetRegion}
          mapProjection={mapProjection}
          onRegionFocused={() => {
            if (onSetTargetRegion) onSetTargetRegion(null);
          }}
          simulationState={simulationState}
          hindcastProgress={hindcastProgress}
          forecastProgress={forecastProgress}
          scanAngle={scanAngle}
        />

        {/* Floating Investigation HUD Bar */}
        {simulationState && onStartSimulation && (
          <InvestigationHud
            simulationState={simulationState}
            onPlayPause={onPlayPauseSimulation || (() => {})}
            onSkipStage={onSkipSimulationStage || (() => {})}
            onReset={onResetSimulation || (() => {})}
            onStart={onStartSimulation}
            onSelectStage={onSelectSimulationStage || (() => {})}
          />
        )}

        {/* IMAGE -> GLOBE Linked Satellite Imagery HUD Banner */}
        {connectedSatelliteData && onOpenSatelliteAnalysis && (
          <div
            id="image-to-globe-hud-badge"
            className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
          >
            <div className="flex items-center gap-2.5 px-3 sm:px-4 py-1.5 rounded-full bg-[rgba(14,10,20,0.96)] border border-[rgba(0,240,255,0.35)] shadow-[0_10px_30px_rgba(0,0,0,0.85)] backdrop-blur-[16px] text-xs animate-fade-in">
              <div className="w-5 h-5 rounded-md bg-[rgba(0,240,255,0.12)] border border-[rgba(0,240,255,0.3)] flex items-center justify-center text-[#00F0FF]">
                <Satellite className="w-3 h-3" />
              </div>

              <div className="flex items-center gap-2 font-mono">
                <span className="font-semibold text-[#00F0FF] text-[11px] tracking-wide">
                  IMAGE → GLOBE
                </span>
                <span className="text-white/20 hidden sm:inline">•</span>
                <span className="text-[#D6A7FF] hidden sm:inline truncate max-w-[150px] text-xs">
                  {connectedSatelliteData.image.name}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[rgba(239,68,68,0.15)] text-[#FFA2A8] text-[10px] font-medium border border-[rgba(239,68,68,0.25)]">
                  {connectedSatelliteData.result.areaKm2} km²
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenSatelliteAnalysis}
                className="ml-1 px-2.5 py-0.5 rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] border border-white/10 text-[#F2EDF7] hover:text-white text-[11px] font-sans font-medium transition-all cursor-pointer flex items-center gap-1"
              >
                <span>View Imagery</span>
                <ArrowRight className="w-3 h-3 text-[#9A8AA5]" />
              </button>
            </div>
          </div>
        )}

        {/* Interactive Helper Hint */}
        <div className="absolute bottom-24 right-6 pointer-events-none z-20 hidden lg:flex items-center gap-2.5 text-[10px] font-mono text-[#81758F] maris-glass-floating px-3 py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          <span className="flex items-center gap-1">
            <Compass className="w-3 h-3 text-[#B026FF]" /> Drag to rotate
          </span>
          <span className="text-[rgba(255,255,255,0.15)]">•</span>
          <span className="flex items-center gap-1">
            <ZoomIn className="w-3 h-3 text-[#B026FF]" /> Scroll to zoom
          </span>
        </div>
      </div>
    </main>
  );
};
