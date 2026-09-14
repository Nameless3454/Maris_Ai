import React, { useState, useCallback } from 'react';
import {
  SatelliteImageData,
  AnalysisViewMode,
  SimulatedSpillResult,
} from '../../types';
import { SatelliteUploader } from './SatelliteUploader';
import { ImagePreview } from './ImagePreview';
import { AnalysisProgress } from './AnalysisProgress';
import { ComparisonViewer } from './ComparisonViewer';
import { DetectionResult } from './DetectionResult';
import { getDeterministicSpillData } from '../../utils/satelliteDemoGenerator';
import { X, Satellite, Layers, Globe, Sliders } from 'lucide-react';

interface SatelliteAnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectToGlobe: (data: {
    image: SatelliteImageData;
    result: SimulatedSpillResult;
    startInvestigation: boolean;
  }) => void;
  className?: string;
}

export const SatelliteAnalysisPanel: React.FC<SatelliteAnalysisPanelProps> = ({
  isOpen,
  onClose,
  onConnectToGlobe,
  className = '',
}) => {
  const [currentImage, setCurrentImage] = useState<SatelliteImageData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
  const [spillResult, setSpillResult] = useState<SimulatedSpillResult | null>(null);
  const [viewMode, setViewMode] = useState<AnalysisViewMode>('detected');

  const handleImageLoaded = useCallback((data: SatelliteImageData) => {
    setCurrentImage(data);
    setHasAnalyzed(false);
    setIsAnalyzing(false);
    setSpillResult(null);
    setViewMode('detected');
  }, []);

  const handleStartAnalysis = useCallback(() => {
    if (!currentImage) return;
    setIsAnalyzing(true);
  }, [currentImage]);

  const handleAnalysisCompleted = useCallback(() => {
    if (!currentImage) return;
    const resultData = getDeterministicSpillData(
      currentImage.name,
      currentImage.width,
      currentImage.height
    );
    setSpillResult(resultData);
    setIsAnalyzing(false);
    setHasAnalyzed(true);
    setViewMode('detected');
  }, [currentImage]);

  const handleRemoveImage = useCallback(() => {
    if (currentImage?.file) {
      URL.revokeObjectURL(currentImage.url);
    }
    setCurrentImage(null);
    setHasAnalyzed(false);
    setIsAnalyzing(false);
    setSpillResult(null);
  }, [currentImage]);

  const handleResetView = useCallback(() => {
    setHasAnalyzed(false);
    setIsAnalyzing(false);
    setSpillResult(null);
    setViewMode('detected');
  }, []);

  const handleVisualizeOnGlobe = useCallback(() => {
    if (!currentImage || !spillResult) return;
    onConnectToGlobe({
      image: currentImage,
      result: spillResult,
      startInvestigation: false,
    });
    onClose();
  }, [currentImage, spillResult, onConnectToGlobe, onClose]);

  const handleContinueInvestigation = useCallback(() => {
    if (!currentImage || !spillResult) return;
    onConnectToGlobe({
      image: currentImage,
      result: spillResult,
      startInvestigation: true,
    });
    onClose();
  }, [currentImage, spillResult, onConnectToGlobe, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="satellite-analysis-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="satellite-analysis-modal-window"
        className={`relative w-full ${
          !currentImage ? 'max-w-2xl' : !hasAnalyzed ? 'max-w-3xl' : 'max-w-6xl'
        } max-h-[94vh] flex flex-col rounded-xl bg-[rgba(12,9,18,0.96)] border border-[rgba(255,255,255,0.08)] shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_1px_rgba(255,255,255,0.15)] backdrop-blur-[24px] overflow-hidden my-auto transition-all duration-300 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar - Refined Intelligence Workstation Header */}
        <div className="shrink-0 px-4 sm:px-6 py-3 bg-[rgba(16,12,24,0.92)] border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[rgba(28,21,42,0.85)] border border-[rgba(176,38,255,0.3)] flex items-center justify-center text-[#D6A7FF] shadow-sm">
              <Satellite className="w-3.5 h-3.5 text-[#00F0FF]" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-wider uppercase text-[#9A8AA5]">
                SATELLITE IMAGE ANALYSIS
              </div>
              <div className="text-xs font-sans font-medium text-[#F2EDF7]">
                SAR / EO imagery ingestion
              </div>
            </div>
          </div>

          {/* Right Status Indicator & Close Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.25)] text-[10px] font-mono text-[#34D399]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
              <span>{isAnalyzing ? 'SCANNING' : hasAnalyzed ? 'CLASSIFIED' : 'READY'}</span>
            </div>

            <button
              type="button"
              id="btn-close-satellite-modal"
              onClick={onClose}
              aria-label="Close Satellite Analysis Panel"
              className="p-1 rounded-lg text-[#81758F] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
          {/* STATE 1: No image loaded (Uploader Dropzone) */}
          {!currentImage && (
            <SatelliteUploader
              onImageLoaded={handleImageLoaded}
            />
          )}

          {/* STATE 2: Image Loaded - Ready or Analyzing */}
          {currentImage && !hasAnalyzed && (
            <div className="relative">
              <ImagePreview
                imageData={currentImage}
                onAnalyze={handleStartAnalysis}
                onChangeImage={handleRemoveImage}
                onRemove={handleRemoveImage}
                isAnalyzing={isAnalyzing}
                statusText={isAnalyzing ? 'ANALYZING...' : 'READY FOR ANALYSIS'}
              />

              {/* Animated Progress Overlay when analyzing */}
              {isAnalyzing && (
                <AnalysisProgress onComplete={handleAnalysisCompleted} />
              )}
            </div>
          )}

          {/* STATE 3: Detection Completed - 70/30 Hero Workstation + Right-Side Analysis Panel */}
          {currentImage && hasAnalyzed && spillResult && (
            <div className="flex flex-col lg:flex-row gap-4 animate-fade-in items-stretch">
              {/* Left Column: Hero Satellite Image Viewport (68-72% visual workspace) */}
              <div className="w-full lg:w-[72%] flex flex-col">
                <ComparisonViewer
                  imageUrl={currentImage.url}
                  imageName={currentImage.name}
                  spillResult={spillResult}
                  viewMode={viewMode}
                  onChangeViewMode={setViewMode}
                />
              </div>

              {/* Right Column: Professional GIS Remote Sensing Analysis Panel (28-32%) */}
              <div className="w-full lg:w-[28%] lg:min-w-[280px] flex flex-col">
                <DetectionResult
                  result={spillResult}
                  onVisualizeOnGlobe={handleVisualizeOnGlobe}
                  onContinueInvestigation={handleContinueInvestigation}
                  onResetView={handleResetView}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
