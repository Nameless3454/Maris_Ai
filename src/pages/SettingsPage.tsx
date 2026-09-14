import React, { useState } from 'react';
import {
  Bell,
  Database,
  RotateCcw,
  Save,
  CheckCircle2,
  Sliders,
  Globe,
  Sparkles,
  Radio,
  Wifi,
  Satellite,
} from 'lucide-react';
import { AppSettings } from '../types';

export interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
  onResetSettings: () => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings,
  onShowToast,
}) => {
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const handleSave = () => {
    localStorage.setItem('maris_settings', JSON.stringify(settings));
    setIsSavedRecently(true);
    if (onShowToast) onShowToast('System settings saved and applied to MARIS terminal', 'success');
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  const handleReset = () => {
    onResetSettings();
    if (onShowToast) onShowToast('Settings reset to default operational profile', 'info');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-3 sm:p-5 max-w-[1400px] w-full mx-auto animate-fade-in font-mono">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(157,0,255,0.14)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-[#F2EDF7]">
              System Settings & Operational Profile
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[rgba(176,38,255,0.2)] border border-[rgba(176,38,255,0.45)] text-[#E9D5FF] tracking-wider">
              OPERATOR CONFIGURATION
            </span>
          </div>
          <p className="text-xs text-[#81758F] mt-0.5">
            Manage satellite telemetry refresh cadence, alerts sensitivity, UI visual render engine & simulation parameters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="settings-reset-btn"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-xs text-[#B9ADBF] hover:text-[#F2EDF7] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET SETTINGS</span>
          </button>

          <button
            type="button"
            id="settings-save-btn"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg maris-btn-investigate text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(157,0,255,0.45)] active:scale-95"
          >
            {isSavedRecently ? <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSavedRecently ? 'SAVED' : 'SAVE SETTINGS'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Setting Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-6">
        {/* SECTION 1: GENERAL */}
        <div className="maris-glass-primary rounded-xl border border-[rgba(157,0,255,0.22)] p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Sliders className="w-4 h-4 text-[#B026FF]" />
            <h2 className="text-xs font-bold text-[#F2EDF7] uppercase tracking-wider">
              GENERAL
            </h2>
          </div>

          {/* Dashboard refresh rate */}
          <div className="space-y-2">
            <label className="text-xs text-[#B9ADBF] block font-semibold">
              Dashboard refresh rate
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['5s', '10s', '30s', '1m'] as const).map((rate) => {
                const labelMap = { '5s': '5 seconds', '10s': '10 seconds', '30s': '30 seconds', '1m': '1 minute' };
                const isSelected = settings.general.refreshRate === rate;
                return (
                  <button
                    key={rate}
                    type="button"
                    id={`setting-refresh-${rate}`}
                    onClick={() => {
                      onUpdateSettings((prev) => ({
                        ...prev,
                        general: { ...prev.general, refreshRate: rate },
                      }));
                      if (onShowToast) onShowToast(`Telemetry refresh rate set to ${labelMap[rate]}`, 'info');
                    }}
                    className={`py-2 px-2.5 rounded-lg text-xs transition-all cursor-pointer text-center font-mono ${
                      isSelected
                        ? 'bg-[rgba(157,0,255,0.35)] border border-[#C14CFF] text-white shadow-[0_0_12px_rgba(157,0,255,0.4)] font-bold'
                        : 'bg-[rgba(18,13,24,0.6)] border border-[rgba(255,255,255,0.06)] text-[#81758F] hover:text-[#D9B8FF] hover:border-[rgba(157,0,255,0.3)]'
                    }`}
                  >
                    {labelMap[rate]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map projection */}
          <div className="space-y-2">
            <label className="text-xs text-[#B9ADBF] block font-semibold">
              Map projection
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['3D Globe', '2D Mercator'] as const).map((proj) => {
                const isSelected = settings.general.mapProjection === proj;
                return (
                  <button
                    key={proj}
                    type="button"
                    id={`setting-proj-${proj.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => {
                      onUpdateSettings((prev) => ({
                        ...prev,
                        general: { ...prev.general, mapProjection: proj },
                      }));
                      if (onShowToast) onShowToast(`Map projection shifted to ${proj}`, 'info');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-2 font-mono ${
                      isSelected
                        ? 'bg-[rgba(157,0,255,0.35)] border border-[#C14CFF] text-white shadow-[0_0_12px_rgba(157,0,255,0.4)] font-bold'
                        : 'bg-[rgba(18,13,24,0.6)] border border-[rgba(255,255,255,0.06)] text-[#81758F] hover:text-[#D9B8FF] hover:border-[rgba(157,0,255,0.3)]'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{proj}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Default region */}
          <div className="space-y-2">
            <label className="text-xs text-[#B9ADBF] block font-semibold">
              Default region
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Indian Ocean', 'Arabian Sea', 'Bay of Bengal'] as const).map((reg) => {
                const isSelected = settings.general.defaultRegion === reg;
                return (
                  <button
                    key={reg}
                    type="button"
                    id={`setting-region-${reg.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => {
                      onUpdateSettings((prev) => ({
                        ...prev,
                        general: { ...prev.general, defaultRegion: reg },
                      }));
                      if (onShowToast) onShowToast(`Default viewport focused on ${reg}`, 'info');
                    }}
                    className={`py-2 px-2 rounded-lg text-[11px] transition-all cursor-pointer text-center font-mono ${
                      isSelected
                        ? 'bg-[rgba(157,0,255,0.35)] border border-[#C14CFF] text-white shadow-[0_0_12px_rgba(157,0,255,0.4)] font-bold'
                        : 'bg-[rgba(18,13,24,0.6)] border border-[rgba(255,255,255,0.06)] text-[#81758F] hover:text-[#D9B8FF] hover:border-[rgba(157,0,255,0.3)]'
                    }`}
                  >
                    {reg}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 2: NOTIFICATIONS */}
        <div className="maris-glass-primary rounded-xl border border-[rgba(157,0,255,0.22)] p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Bell className="w-4 h-4 text-[#06B6D4]" />
            <h2 className="text-xs font-bold text-[#F2EDF7] uppercase tracking-wider">
              NOTIFICATIONS
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { key: 'criticalIncidents' as const, label: 'Critical incidents', desc: 'Emergency tier-1 maritime oil plume alerts' },
              { key: 'oilSpillAlerts' as const, label: 'Oil spill alerts', desc: 'Satellite automated synthetic aperture radar detections' },
              { key: 'vesselAnomalies' as const, label: 'Vessel anomalies', desc: 'Ballast discharge, dark ship transponder deactivation' },
              { key: 'satelliteUpdates' as const, label: 'Satellite updates', desc: 'Constellation telemetry & orbital pass synchronizations' },
            ].map((item) => {
              const isEnabled = settings.notifications[item.key];
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[rgba(18,13,24,0.6)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(157,0,255,0.25)] transition-all"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#F2EDF7]">{item.label}</div>
                    <div className="text-[10px] text-[#81758F]">{item.desc}</div>
                  </div>
                  <button
                    type="button"
                    id={`setting-notif-${item.key}`}
                    onClick={() => {
                      const nextVal = !isEnabled;
                      onUpdateSettings((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          [item.key]: nextVal,
                        },
                      }));
                      if (onShowToast) {
                        onShowToast(`${item.label} notifications ${nextVal ? 'ENABLED' : 'MUTED'}`, nextVal ? 'success' : 'info');
                      }
                    }}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                      isEnabled
                        ? 'bg-[rgba(16,185,129,0.2)] text-[#34D399] border border-[rgba(16,185,129,0.4)] shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                        : 'bg-[rgba(255,255,255,0.05)] text-[#81758F] border border-[rgba(255,255,255,0.1)] hover:text-[#B9ADBF]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-[#34D399] animate-pulse' : 'bg-[#64748B]'}`} />
                    <span>{isEnabled ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: DISPLAY */}
        <div className="maris-glass-primary rounded-xl border border-[rgba(157,0,255,0.22)] p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Sparkles className="w-4 h-4 text-[#D9B8FF]" />
            <h2 className="text-xs font-bold text-[#F2EDF7] uppercase tracking-wider">
              DISPLAY
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { key: 'glassEffects' as const, label: 'Glass effects', desc: 'Multi-layer glassmorphic acrylic blurs (18px-24px)' },
              { key: 'purpleGlow' as const, label: 'Purple glow', desc: 'Electric purple ambient field lighting & node haloes' },
            ].map((item) => {
              const isEnabled = settings.display[item.key];
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[rgba(18,13,24,0.6)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(157,0,255,0.25)] transition-all"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#F2EDF7]">{item.label}</div>
                    <div className="text-[10px] text-[#81758F]">{item.desc}</div>
                  </div>
                  <button
                    type="button"
                    id={`setting-display-${item.key}`}
                    onClick={() => {
                      const nextVal = !isEnabled;
                      onUpdateSettings((prev) => ({
                        ...prev,
                        display: {
                          ...prev.display,
                          [item.key]: nextVal,
                        },
                      }));
                      if (onShowToast) {
                        onShowToast(`${item.label} ${nextVal ? 'ENABLED' : 'DISABLED'}`, 'info');
                      }
                    }}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                      isEnabled
                        ? 'bg-[rgba(157,0,255,0.3)] text-[#D6A7FF] border border-[#B026FF] shadow-[0_0_10px_rgba(157,0,255,0.3)]'
                        : 'bg-[rgba(255,255,255,0.05)] text-[#81758F] border border-[rgba(255,255,255,0.1)] hover:text-[#B9ADBF]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-[#B026FF] animate-pulse' : 'bg-[#64748B]'}`} />
                    <span>{isEnabled ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: DATA */}
        <div className="maris-glass-primary rounded-xl border border-[rgba(157,0,255,0.22)] p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Database className="w-4 h-4 text-[#FDE047]" />
            <h2 className="text-xs font-bold text-[#F2EDF7] uppercase tracking-wider">
              DATA
            </h2>
          </div>

          <div className="space-y-3">
            {/* DATA SOURCE TOGGLE */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[rgba(18,13,24,0.6)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(157,0,255,0.25)] transition-all">
              <div>
                <div className="text-xs font-semibold text-[#F2EDF7]">Data source</div>
                <div className="text-[10px] text-[#81758F]">Operational ingestion stream</div>
              </div>
              <button
                type="button"
                id="setting-data-source-toggle"
                onClick={() => {
                  const nextSource =
                    settings.data.dataSource === 'DEMO / SIMULATED'
                      ? 'LIVE SATELLITE FEED'
                      : 'DEMO / SIMULATED';
                  onUpdateSettings((prev) => ({
                    ...prev,
                    data: { ...prev.data, dataSource: nextSource },
                  }));
                  if (onShowToast) {
                    onShowToast(`Data source stream shifted to ${nextSource}`, 'success');
                  }
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 border ${
                  settings.data.dataSource === 'LIVE SATELLITE FEED'
                    ? 'bg-[rgba(16,185,129,0.25)] text-[#34D399] border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'bg-[rgba(176,38,255,0.2)] text-[#E9D5FF] border-[rgba(176,38,255,0.45)] hover:bg-[rgba(176,38,255,0.3)]'
                }`}
                title="Click to toggle between DEMO and LIVE SATELLITE FEED"
              >
                <Satellite className="w-3.5 h-3.5" />
                <span>{settings.data.dataSource}</span>
              </button>
            </div>

            {/* AIS SYNCHRONIZATION TOGGLE */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[rgba(18,13,24,0.6)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(157,0,255,0.25)] transition-all">
              <div>
                <div className="text-xs font-semibold text-[#F2EDF7]">AIS synchronization</div>
                <div className="text-[10px] text-[#81758F]">Coastal AIS transponder data stream</div>
              </div>
              <button
                type="button"
                id="setting-ais-sync-toggle"
                onClick={() => {
                  const nextSync =
                    settings.data.aisSync === 'SIMULATED' ? 'LIVE AIS STREAM' : 'SIMULATED';
                  onUpdateSettings((prev) => ({
                    ...prev,
                    data: { ...prev.data, aisSync: nextSync },
                  }));
                  if (onShowToast) {
                    onShowToast(`AIS synchronization mode: ${nextSync}`, 'info');
                  }
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 border ${
                  settings.data.aisSync === 'LIVE AIS STREAM'
                    ? 'bg-[rgba(6,182,212,0.25)] text-[#67E8F9] border-[#06B6D4] shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                    : 'bg-[rgba(6,182,212,0.15)] text-[#67E8F9] border-[rgba(6,182,212,0.3)] hover:bg-[rgba(6,182,212,0.22)]'
                }`}
                title="Click to toggle AIS stream synchronization mode"
              >
                <Wifi className="w-3.5 h-3.5" />
                <span>{settings.data.aisSync}</span>
              </button>
            </div>

            {/* SATELLITE SYNCHRONIZATION TOGGLE */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[rgba(18,13,24,0.6)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(157,0,255,0.25)] transition-all">
              <div>
                <div className="text-xs font-semibold text-[#F2EDF7]">Satellite synchronization</div>
                <div className="text-[10px] text-[#81758F]">SAR & multi-spectral radar downlinks</div>
              </div>
              <button
                type="button"
                id="setting-satellite-sync-toggle"
                onClick={() => {
                  const nextSync =
                    settings.data.satelliteSync === 'SIMULATED'
                      ? 'LIVE SENSORS (SENTINEL-1)'
                      : 'SIMULATED';
                  onUpdateSettings((prev) => ({
                    ...prev,
                    data: { ...prev.data, satelliteSync: nextSync },
                  }));
                  if (onShowToast) {
                    onShowToast(`Satellite sensor downlink: ${nextSync}`, 'info');
                  }
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 border ${
                  settings.data.satelliteSync === 'LIVE SENSORS (SENTINEL-1)'
                    ? 'bg-[rgba(245,158,11,0.25)] text-[#FDE047] border-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                    : 'bg-[rgba(245,158,11,0.15)] text-[#FDE047] border-[rgba(245,158,11,0.3)] hover:bg-[rgba(245,158,11,0.22)]'
                }`}
                title="Click to toggle satellite radar downlink mode"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{settings.data.satelliteSync}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
