import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Sparkles, FileWarning, Satellite, Crosshair } from 'lucide-react';
import { SatelliteImageData } from '../../types';
import { generateSyntheticSarImage } from '../../utils/satelliteDemoGenerator';

interface SatelliteUploaderProps {
  onImageLoaded: (data: SatelliteImageData) => void;
  onError?: (errorMessage: string) => void;
  className?: string;
}

export const SatelliteUploader: React.FC<SatelliteUploaderProps> = ({
  onImageLoaded,
  onError,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const processSelectedFile = (file: File) => {
    setErrorMessage(null);

    // 1. File type validation
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      const err = 'UNSUPPORTED FORMAT: Please upload a PNG, JPG, or JPEG image.';
      setErrorMessage(err);
      if (onError) onError(err);
      return;
    }

    // 2. File size validation (Max 25MB)
    const maxSizeBytes = 25 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const err = 'FILE TOO LARGE: Image exceeds the 25MB threshold. Please upload a smaller satellite swath.';
      setErrorMessage(err);
      if (onError) onError(err);
      return;
    }

    // 3. Client-side URL creation & Dimension extraction
    try {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const data: SatelliteImageData = {
          name: file.name,
          url: objectUrl,
          width: img.naturalWidth || 1024,
          height: img.naturalHeight || 768,
          sizeFormatted: formatFileSize(file.size),
          file,
          loadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
        };
        onImageLoaded(data);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        const err = 'CORRUPTED IMAGE: Unable to decode image data. Please ensure the file is a valid image.';
        setErrorMessage(err);
        if (onError) onError(err);
      };

      img.src = objectUrl;
    } catch {
      const err = 'UNEXPECTED ERROR: Could not process file in browser.';
      setErrorMessage(err);
      if (onError) onError(err);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleLoadDemoImage = async () => {
    try {
      setIsLoadingDemo(true);
      setErrorMessage(null);
      const synthetic = await generateSyntheticSarImage();
      const data: SatelliteImageData = {
        name: synthetic.name,
        url: synthetic.dataUrl,
        width: synthetic.width,
        height: synthetic.height,
        sizeFormatted: formatFileSize(synthetic.sizeBytes),
        loadedAt: '14:50 UTC',
      };
      onImageLoaded(data);
    } catch {
      setErrorMessage('Could not load demo image swatch.');
    } finally {
      setIsLoadingDemo(false);
    }
  };

  return (
    <div id="satellite-uploader" className={`w-full max-w-xl mx-auto py-2 ${className}`}>
      {/* Hidden native HTML file input */}
      <input
        ref={fileInputRef}
        type="file"
        id="satellite-file-input"
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Error Banner */}
      {errorMessage && (
        <div
          id="uploader-error-banner"
          className="mb-3.5 p-2.5 rounded-lg bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.3)] text-[#FFA2A8] text-xs flex items-center justify-between gap-2 animate-fade-in"
        >
          <div className="flex items-center gap-2">
            <FileWarning className="w-3.5 h-3.5 shrink-0 text-[#F87171]" />
            <span className="font-sans font-medium">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-[10px] font-mono uppercase text-[#FFA2A8] hover:text-white underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Refined Ingestion Surface Drop Zone */}
      <div
        id="satellite-dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative w-full rounded-xl p-6 sm:p-8 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center select-none overflow-hidden border ${
          isDragging
            ? 'border-[#00F0FF]/80 bg-[rgba(0,240,255,0.06)] shadow-[0_0_25px_rgba(0,240,255,0.2)] scale-[1.008]'
            : 'border-[rgba(176,38,255,0.2)] hover:border-[rgba(176,38,255,0.45)] bg-gradient-to-b from-[rgba(18,14,28,0.6)] to-[rgba(10,8,16,0.85)] hover:bg-[rgba(22,17,34,0.7)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* Subtle Technical Corner Reticles */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-[rgba(255,255,255,0.18)] pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-[rgba(255,255,255,0.18)] pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-[rgba(255,255,255,0.18)] pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-[rgba(255,255,255,0.18)] pointer-events-none" />

        {/* Faint Geospatial Coordinate Watermark */}
        <div className="absolute top-2 right-4 text-[9px] font-mono text-[#81758F]/40 tracking-wider pointer-events-none hidden sm:block">
          12°18.4'N • 84°32.1'E
        </div>

        {/* Background Orbital Geometry */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
          <div className="w-48 h-48 rounded-full border border-dashed border-[rgba(0,240,255,0.5)]" />
          <div className="absolute w-72 h-72 rounded-full border border-[rgba(176,38,255,0.3)]" />
        </div>

        {/* Refined Satellite Ingestion Icon (44px, not enormous) */}
        <div className="relative w-11 h-11 rounded-xl bg-[rgba(26,20,38,0.85)] border border-[rgba(176,38,255,0.3)] group-hover:border-[rgba(0,240,255,0.4)] flex items-center justify-center mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all group-hover:-translate-y-0.5">
          <Satellite className="w-5 h-5 text-[#D6A7FF] group-hover:text-[#00F0FF] transition-colors" />
          {/* Subtle faint orbital ring */}
          <span className="absolute -inset-1 rounded-xl border border-[rgba(0,240,255,0.2)] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Clean Main Instruction (Modern Sans-serif, not heavy all-caps mono) */}
        <h3 className="text-sm sm:text-base font-sans font-semibold text-[#F2EDF7] tracking-tight mb-1">
          {isDragging ? 'Drop satellite image to ingest' : 'Drop satellite imagery here'}
        </h3>

        {/* Clean Subtitle */}
        <p className="text-xs font-sans text-[#B9ADBF] mb-3">
          or <span className="text-[#D6A7FF] group-hover:text-[#00F0FF] font-medium transition-colors">browse from your computer</span>
        </p>

        {/* Technical Supported Format Badge */}
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[10px] font-mono text-[#9A8AA5]">
          <ImageIcon className="w-3 h-3 text-[#B026FF]" />
          <span>PNG • JPG • JPEG • Max 25 MB</span>
        </div>
      </div>

      {/* Refined Footer: Client-side Security Status & Demo Action */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-left self-start sm:self-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#34D399] shadow-[0_0_6px_rgba(52,211,153,0.6)] shrink-0" />
          <div>
            <div className="text-[10px] font-mono font-medium tracking-wider text-[#9A8AA5] uppercase">
              CLIENT-SIDE PROCESSING
            </div>
            <div className="text-[10px] font-sans text-[#81758F]">
              Zero server upload • Analysis runs in sandbox
            </div>
          </div>
        </div>

        <button
          type="button"
          id="btn-try-demo-image"
          onClick={(e) => {
            e.stopPropagation();
            handleLoadDemoImage();
          }}
          disabled={isLoadingDemo}
          className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[rgba(138,0,232,0.22)] to-[rgba(176,38,255,0.28)] hover:from-[rgba(138,0,232,0.4)] hover:to-[rgba(176,38,255,0.45)] border border-[rgba(176,38,255,0.4)] hover:border-[rgba(214,167,255,0.7)] text-[#E9D5FF] hover:text-white text-xs font-sans font-medium tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.3)] disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 text-[#00F0FF] ${isLoadingDemo ? 'animate-spin' : ''}`} />
          <span>{isLoadingDemo ? 'Synthesizing SAR Swath...' : 'TRY DEMO IMAGE'}</span>
        </button>
      </div>
    </div>
  );
};

