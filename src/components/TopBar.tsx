import React from "react";
import {
  Volume2,
  VolumeX,
  Shuffle,
  Play,
  Pause,
  Tv,
  Layout,
  Maximize2,
  Terminal,
  Zap,
  Sparkles,
  Utensils,
  Download,
} from "lucide-react";
import { soundFX } from "../utils/audio";

export type LayoutMode = "split" | "canvas" | "terminal";
export type ThemeMode = "oceanic" | "green_crt" | "amber" | "cyan_cyber" | "blood_frenzy" | "matrix" | "monochrome";

interface TopBarProps {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  crtEnabled: boolean;
  setCrtEnabled: (enabled: boolean) => void;
  paused: boolean;
  onTogglePause: () => void;
  onRandomize: () => void;
  onDropBait: () => void;
  onSurge: () => void;
  onExportBash: () => void;
  sharkCount: number;
  fishCount: number;
  fps: number;
  feedCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  layoutMode,
  setLayoutMode,
  theme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  crtEnabled,
  setCrtEnabled,
  paused,
  onTogglePause,
  onRandomize,
  onDropBait,
  onSurge,
  onExportBash,
  sharkCount,
  fishCount,
  fps,
  feedCount,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.setEnabled(next);
    if (next) soundFX.playSonarPing();
  };

  const toggleCrt = () => {
    setCrtEnabled(!crtEnabled);
    if (soundEnabled) soundFX.playKeypress();
  };

  return (
    <header className="border-b border-cyan-500/20 bg-[#070b12]/95 backdrop-blur-md px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none z-30">
      {/* Left: Retro Window Dots & Terminal Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block border border-red-400/40 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block border border-amber-400/40 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block border border-emerald-400/40 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
        </div>

        <div className="flex items-center gap-2 pl-1 border-l border-cyan-500/20 text-cyan-400 font-semibold tracking-wider">
          <span className="text-cyan-300">ASCII-SHARKS-CLI</span>
          <span className="text-cyan-700">/</span>
          <span className="text-cyan-600 hidden sm:inline">dev.ocean0</span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-700/40 text-[10px] text-cyan-300">
            v2.4
          </span>
        </div>
      </div>

      {/* Center: Live Ocean Telemetry Badges */}
      <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-400 bg-slate-900/50 px-3 py-1 rounded-md border border-cyan-500/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>SHARKS:</span>
          <strong className="text-cyan-300">{sharkCount}</strong>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1.5">
          <span>FISH:</span>
          <strong className="text-slate-300">{fishCount}</strong>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1.5">
          <span>BITES:</span>
          <strong className="text-red-400">{feedCount}</strong>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1.5">
          <span>FPS:</span>
          <strong className={fps < 30 ? "text-amber-400" : "text-emerald-400"}>{fps}</strong>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2">
        {/* Quick Randomize */}
        <button
          onClick={() => {
            if (soundEnabled) soundFX.playSplash();
            onRandomize();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/40 text-cyan-300 hover:text-cyan-100 transition shadow-[0_0_10px_rgba(6,182,212,0.15)] active:scale-95"
          title="Randomize shark species & sizes (CLI: 'rand')"
        >
          <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold">Randomize</span>
        </button>

        {/* Drop Chum / Bait */}
        <button
          onClick={() => {
            if (soundEnabled) soundFX.playSplash();
            onDropBait();
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 transition active:scale-95"
          title="Drop chum/bait into the water (CLI: 'feed')"
        >
          <Utensils className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">Drop Bait</span>
        </button>

        {/* Current Surge */}
        <button
          onClick={() => {
            if (soundEnabled) soundFX.playSplash();
            onSurge();
          }}
          className="flex items-center gap-1 px-2 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
          title="Surge ocean current (CLI: 'current')"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="hidden md:inline">Surge</span>
        </button>

        {/* Pause / Play */}
        <button
          onClick={() => {
            if (soundEnabled) soundFX.playKeypress();
            onTogglePause();
          }}
          className={`p-1.5 rounded border transition ${
            paused
              ? "bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/60"
              : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
          }`}
          title={paused ? "Resume simulation (CLI: 'play')" : "Pause simulation (CLI: 'pause')"}
        >
          {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        {/* Theme Selector */}
        <div className="relative">
          <select
            value={theme}
            onChange={(e) => {
              const val = e.target.value as ThemeMode;
              setTheme(val);
              if (soundEnabled) soundFX.playKeypress();
            }}
            className="bg-slate-900/90 border border-slate-700 text-cyan-300 text-xs rounded px-2 py-1.5 outline-none hover:border-cyan-500/50 cursor-pointer"
            title="Change color scheme (CLI: 'theme <name>')"
          >
            <option value="oceanic">🌊 Oceanic</option>
            <option value="green_crt">🟢 Green CRT</option>
            <option value="amber">🟠 Amber CRT</option>
            <option value="cyan_cyber">💎 Cyan Cyber</option>
            <option value="blood_frenzy">🩸 Blood Frenzy</option>
            <option value="matrix">💻 Matrix Rain</option>
            <option value="monochrome">⚪ Monochrome</option>
          </select>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className={`p-1.5 rounded border transition ${
            soundEnabled
              ? "bg-cyan-950/50 border-cyan-500/40 text-cyan-300"
              : "bg-slate-900 border-slate-700 text-slate-500"
          }`}
          title={soundEnabled ? "Mute audio (CLI: 'sound off')" : "Enable audio (CLI: 'sound on')"}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* CRT Scanline Toggle */}
        <button
          onClick={toggleCrt}
          className={`p-1.5 rounded border transition ${
            crtEnabled
              ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              : "bg-slate-900 border-slate-700 text-slate-500"
          }`}
          title={crtEnabled ? "Disable CRT Scanlines (CLI: 'crt off')" : "Enable CRT Scanlines (CLI: 'crt on')"}
        >
          <Tv className="w-3.5 h-3.5" />
        </button>

        {/* Local Bash Script Export */}
        <button
          onClick={() => {
            if (soundEnabled) soundFX.playKeypress();
            onExportBash();
          }}
          className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-cyan-100 transition"
          title="Get bash script for local terminal (CLI: 'export bash')"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline">Bash Script</span>
        </button>

        {/* Layout Mode Selector */}
        <div className="flex items-center rounded border border-slate-700 bg-slate-900 p-0.5 ml-1">
          <button
            onClick={() => {
              setLayoutMode("split");
              if (soundEnabled) soundFX.playKeypress();
            }}
            className={`p-1 rounded transition ${
              layoutMode === "split" ? "bg-cyan-950 text-cyan-300" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Split Mode (Canvas & Terminal)"
          >
            <Layout className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setLayoutMode("canvas");
              if (soundEnabled) soundFX.playKeypress();
            }}
            className={`p-1 rounded transition ${
              layoutMode === "canvas" ? "bg-cyan-950 text-cyan-300" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Full Canvas Viewport"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setLayoutMode("terminal");
              if (soundEnabled) soundFX.playKeypress();
            }}
            className={`p-1 rounded transition ${
              layoutMode === "terminal" ? "bg-cyan-950 text-cyan-300" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Full Terminal CLI Console"
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
