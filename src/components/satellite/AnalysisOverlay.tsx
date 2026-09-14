import React from 'react';
import { SimulatedSpillResult } from '../../types';

interface AnalysisOverlayProps {
  spillResult: SimulatedSpillResult;
  isMaskOnly?: boolean;
  showLabels?: boolean;
  showOriginMarker?: boolean;
  className?: string;
}

/**
 * Generates a smooth organic closed SVG path through a set of percentage coordinate points.
 */
function pointsToSmoothPath(points: { x: number; y: number }[]): string {
  if (!points || points.length < 3) return '';
  const len = points.length;
  let d = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < len; i++) {
    const p0 = points[(i - 1 + len) % len];
    const p1 = points[i];
    const p2 = points[(i + 1) % len];
    const p3 = points[(i + 2) % len];

    // Catmull-Rom to Cubic Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }

  d += ' Z';
  return d;
}

export const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({
  spillResult,
  isMaskOnly = false,
  showLabels = true,
  showOriginMarker = false,
  className = '',
}) => {
  const {
    polygonPoints,
    tailPoints,
    spillCenter,
    confidence,
    areaKm2,
  } = spillResult;

  const mainPathD = pointsToSmoothPath(polygonPoints);
  const tailPathD = pointsToSmoothPath(tailPoints);

  // Position of small GIS annotation (placed cleanly to the upper-right of the slick centroid)
  const annotationLeft = Math.min(84, Math.max(16, spillCenter.x + 14));
  const annotationTop = Math.max(14, spillCenter.y - 12);

  // If in binary mask mode (GIS remote sensing binary raster)
  if (isMaskOnly) {
    return (
      <div
        id="analysis-spill-mask-overlay"
        className={`absolute inset-0 pointer-events-none select-none overflow-hidden bg-black/90 ${className}`}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* High contrast binary segmentation mask */}
          <path d={tailPathD} fill="#ffffff" opacity="0.6" />
          <path d={mainPathD} fill="#ffffff" opacity="0.95" stroke="#38bdf8" strokeWidth="0.4" />
        </svg>

        {/* Small Mask Status Label */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 border border-white/20 text-[9px] font-mono text-white/70">
          BINARY EXTRACTION MASK // CLASS: HYDROCARBON
        </div>
      </div>
    );
  }

  return (
    <div
      id="analysis-spill-overlay"
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 
            Subtle warm analytical gradient:
            Dark amber (#78350f) -> muted orange (#9a3412) -> subtle red (#991b1b)
            STRICT LOW OPACITY (12% - 22%) so satellite image clearly dominates underneath
          */}
          <radialGradient
            id="gisOrganicSpillGrad"
            cx={`${spillCenter.x}%`}
            cy={`${spillCenter.y}%`}
            r="28%"
          >
            <stop offset="0%" stopColor="#78350f" stopOpacity="0.25" />
            <stop offset="35%" stopColor="#9a3412" stopOpacity="0.20" />
            <stop offset="70%" stopColor="#b45309" stopOpacity="0.14" />
            <stop offset="95%" stopColor="#b91c1c" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.0" />
          </radialGradient>

          {/* Secondary thin trailing sheen gradient */}
          <linearGradient id="gisTailSheenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b45309" stopOpacity="0.16" />
            <stop offset="60%" stopColor="#78350f" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#451a03" stopOpacity="0.02" />
          </linearGradient>

          {/* Soft edge antialiasing & feathered boundaries */}
          <filter id="gisFeatherEdge" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Very soft probability field blur */}
          <filter id="gisProbFieldBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" />
          </filter>
        </defs>

        {/* 1. Translucent probability field (gradual fade, no hard concentric rings) */}
        <path
          d={mainPathD}
          fill="url(#gisOrganicSpillGrad)"
          filter="url(#gisProbFieldBlur)"
          opacity="0.6"
        />

        {/* 2. Secondary trailing sheen plume (feathered, low opacity) */}
        <path
          d={tailPathD}
          fill="url(#gisTailSheenGrad)"
          filter="url(#gisFeatherEdge)"
          stroke="#d97706"
          strokeWidth="0.25"
          strokeOpacity="0.35"
        />

        {/* 3. Primary segmented organic oil spill layer */}
        <path
          d={mainPathD}
          fill="url(#gisOrganicSpillGrad)"
          filter="url(#gisFeatherEdge)"
        />

        {/* 4. Single refined GIS detection contour (thin line, low opacity, soft antialiasing) */}
        <path
          d={mainPathD}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="0.35"
          strokeOpacity="0.65"
          className="transition-opacity duration-1000"
        />

        {/* 5. Probable Origin Marker (Only subtle 8-12px point + thin ring when requested) */}
        {showOriginMarker && (
          <g transform={`translate(${spillCenter.x - 8}, ${spillCenter.y + 12})`}>
            {/* Soft pulsing ring */}
            <circle
              cx="0"
              cy="0"
              r="2.2"
              fill="none"
              stroke="#c084fc"
              strokeWidth="0.3"
              strokeOpacity="0.6"
              className="animate-ping"
            />
            {/* Small center point */}
            <circle
              cx="0"
              cy="0"
              r="0.9"
              fill="#e9d5ff"
              stroke="#9333ea"
              strokeWidth="0.25"
            />
          </g>
        )}
      </svg>

      {/* 
        Professional GIS Annotation Box
        Small, dark translucent, blurred, thin border, minimal.
        Placed near the slick without obstructing the core imagery.
      */}
      {showLabels && (
        <div
          id="spill-gis-annotation"
          className="absolute pointer-events-none transition-all duration-300"
          style={{
            left: `${annotationLeft}%`,
            top: `${annotationTop}%`,
          }}
        >
          {/* Subtle connecting hairline to centroid */}
          <div
            className="absolute -left-6 top-3 w-6 h-px bg-white/20 pointer-events-none"
            style={{ transform: 'rotate(15deg)', transformOrigin: 'right center' }}
          />

          <div className="px-2.5 py-1.5 rounded bg-[rgba(10,8,16,0.85)] border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.75)] backdrop-blur-[8px] text-left">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#F59E0B] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span>OIL SLICK</span>
            </div>
            <div className="text-xs font-mono font-bold text-white tracking-tight leading-snug mt-0.5">
              {areaKm2} <span className="text-[10px] font-normal text-white/60">km²</span>
            </div>
            <div className="text-[9px] font-mono text-[#D6A7FF] mt-0.5">
              CONFIDENCE {confidence}%
            </div>
          </div>
        </div>
      )}

      {/* Subtle Probable Origin Micro-label if enabled */}
      {showOriginMarker && (
        <div
          className="absolute text-[8.5px] font-mono text-[#D6A7FF] bg-black/75 px-1.5 py-0.5 rounded border border-[#C084FC]/40 pointer-events-none"
          style={{
            left: `${spillCenter.x - 7}%`,
            top: `${spillCenter.y + 16}%`,
          }}
        >
          PROBABLE ORIGIN
        </div>
      )}
    </div>
  );
};
