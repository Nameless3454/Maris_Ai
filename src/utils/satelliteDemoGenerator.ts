/**
 * Generates an authentic high-resolution synthetic Sentinel-1 SAR (Synthetic Aperture Radar)
 * sea-surface image with radar backscatter, ocean swell wave patterns, dark slick feature,
 * and calibrated satellite telemetry stamps.
 */
export function generateSyntheticSarImage(): Promise<{
  dataUrl: string;
  name: string;
  width: number;
  height: number;
  sizeBytes: number;
}> {
  return new Promise((resolve) => {
    const width = 1280;
    const height = 960;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve({
        dataUrl: '',
        name: 'sentinel_demo_01.jpg',
        width: 1024,
        height: 768,
        sizeBytes: 1540000,
      });
      return;
    }

    // 1. Dark oceanic microwave radar base gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0c1626');
    bgGrad.addColorStop(0.35, '#121e33');
    bgGrad.addColorStop(0.7, '#0e1a2d');
    bgGrad.addColorStop(1, '#08111e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Synthetic SAR ocean backscatter & wave swells (Bragg scattering)
    ctx.strokeStyle = 'rgba(70, 110, 160, 0.12)';
    ctx.lineWidth = 1.5;
    for (let y = 0; y < height; y += 14) {
      ctx.beginPath();
      for (let x = 0; x < width; x += 20) {
        const swell = Math.sin((x + y * 0.4) * 0.03) * 6 + Math.cos(x * 0.015) * 3;
        if (x === 0) ctx.moveTo(x, y + swell);
        else ctx.lineTo(x, y + swell);
      }
      ctx.stroke();
    }

    // 3. SAR Speckle noise
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 22;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 1.2));
    }
    ctx.putImageData(imgData, 0, 0);

    // 4. Characteristic SAR low-backscatter dark slick (capillary wave dampening)
    ctx.save();
    ctx.fillStyle = 'rgba(3, 7, 14, 0.78)';
    ctx.filter = 'blur(16px)';
    ctx.beginPath();
    ctx.moveTo(width * 0.38, height * 0.32);
    ctx.bezierCurveTo(width * 0.48, height * 0.28, width * 0.62, height * 0.36, width * 0.68, height * 0.48);
    ctx.bezierCurveTo(width * 0.72, height * 0.58, width * 0.58, height * 0.68, width * 0.44, height * 0.64);
    ctx.bezierCurveTo(width * 0.32, height * 0.60, width * 0.28, height * 0.45, width * 0.38, height * 0.32);
    ctx.closePath();
    ctx.fill();

    // Secondary tail plume
    ctx.beginPath();
    ctx.moveTo(width * 0.42, height * 0.62);
    ctx.bezierCurveTo(width * 0.36, height * 0.74, width * 0.26, height * 0.78, width * 0.20, height * 0.82);
    ctx.bezierCurveTo(width * 0.18, height * 0.86, width * 0.25, height * 0.88, width * 0.32, height * 0.78);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 5. Radar Range & Azimuth Grid Overlays
    ctx.strokeStyle = 'rgba(64, 200, 224, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    for (let x = 120; x < width; x += 220) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 100; y < height; y += 180) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 6. SAR Mission Telemetry Watermarks
    ctx.fillStyle = 'rgba(103, 232, 249, 0.75)';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('SENTINEL-1C SAR-C // IW_GRDH_1SDV', 32, 44);

    ctx.font = '12px monospace';
    ctx.fillStyle = 'rgba(214, 167, 255, 0.75)';
    ctx.fillText('PASS: DESCENDING // POLARIZATION: VV+VH // ORBIT: 48129', 32, 66);
    ctx.fillText('ACQUISITION: 14.852°N, 88.248°E // BAY OF BENGAL', 32, 86);

    ctx.fillStyle = 'rgba(242, 237, 247, 0.65)';
    ctx.fillText('RESOLUTION: 10m/px // INCIDENCE: 38.4° // ESA COPERNICUS', width - 420, 44);

    // Reticle crosshairs
    ctx.strokeStyle = 'rgba(176, 38, 255, 0.45)';
    ctx.lineWidth = 1.5;
    const cx = width * 0.5;
    const cy = height * 0.48;
    ctx.beginPath();
    ctx.arc(cx, cy, 36, 0, Math.PI * 2);
    ctx.moveTo(cx - 50, cy);
    ctx.lineTo(cx - 20, cy);
    ctx.moveTo(cx + 20, cy);
    ctx.lineTo(cx + 50, cy);
    ctx.moveTo(cx, cy - 50);
    ctx.lineTo(cx, cy - 20);
    ctx.moveTo(cx, cy + 20);
    ctx.lineTo(cx, cy + 50);
    ctx.stroke();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    resolve({
      dataUrl,
      name: 'sentinel_demo_01.jpg',
      width,
      height,
      sizeBytes: Math.round(dataUrl.length * 0.75),
    });
  });
}

/**
 * Deterministically generates simulated detection data for any image based on its name/size hash.
 * This guarantees consistent values during the entire session for the same file.
 */
export function getDeterministicSpillData(imageName: string, width: number, height: number) {
  // Simple deterministic hash
  let hash = 0;
  const str = `${imageName}_${width}x${height}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const normalized = Math.abs(hash);

  // Center coordinates in percentage (default around 48% x, 46% y)
  const cx = 45 + (normalized % 12);
  const cy = 42 + ((normalized >> 3) % 14);

  return {
    confidence: 92,
    areaKm2: 42.8,
    estimatedAge: '4–7 hrs',
    severity: 'HIGH' as const,
    spillCenter: { x: cx, y: cy },
    lengthKm: 18.6,
    widthKm: 4.2,
    orientationDeg: 37,
    coordinates: {
      lat: '14°51\'07"N',
      lon: '88°14\'55"E',
    },
    // Irregular organic polygon vertices in % relative to image dimensions
    polygonPoints: [
      { x: cx - 18, y: cy - 6 },
      { x: cx - 14, y: cy - 11 },
      { x: cx - 6, y: cy - 14 },
      { x: cx + 2, y: cy - 12 },
      { x: cx + 11, y: cy - 8 },
      { x: cx + 19, y: cy - 2 },
      { x: cx + 24, y: cy + 5 },
      { x: cx + 21, y: cy + 10 },
      { x: cx + 14, y: cy + 13 },
      { x: cx + 5, y: cy + 15 },
      { x: cx - 4, y: cy + 14 },
      { x: cx - 11, y: cy + 11 },
      { x: cx - 17, y: cy + 4 },
      { x: cx - 21, y: cy - 1 },
    ],
    // Secondary trailing sheen contour
    tailPoints: [
      { x: cx - 6, y: cy + 14 },
      { x: cx - 12, y: cy + 20 },
      { x: cx - 19, y: cy + 25 },
      { x: cx - 25, y: cy + 29 },
      { x: cx - 22, y: cy + 32 },
      { x: cx - 14, y: cy + 27 },
      { x: cx - 7, y: cy + 21 },
      { x: cx - 2, y: cy + 15 },
    ],
  };
}
