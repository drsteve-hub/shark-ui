import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Shuffle,
  Utensils,
  Waves,
  Terminal as TerminalIcon,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  FileCode2,
  X,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  SlidersHorizontal,
  Eye,
  Github,
  Download,
  ExternalLink,
} from "lucide-react";
import { OceanEngine, type SharkKind } from "../engine";
import { SIMULATION_PRESETS } from "../data/presets";
import { soundFX } from "../utils/audio";
import { generateLocalBashScript } from "../utils/bashGenerator";
import { downloadProjectArchive } from "../utils/downloadArchive";

interface PhoneChatInterfaceProps {
  engineRef: React.MutableRefObject<OceanEngine | null>;
  onOpenTerminal: () => void;
  onOpenDossier: (kind: SharkKind) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  viewMode: "phone" | "fullscreen";
  setViewMode: (mode: "phone" | "fullscreen") => void;
  themeMode: "light" | "dark";
  setThemeMode: (mode: "light" | "dark") => void;
  blurLevel: number;
  setBlurLevel: (val: number) => void;
  transparencyLevel: number;
  setTransparencyLevel: (val: number) => void;
  isBlackAndWhite: boolean;
  setIsBlackAndWhite: (val: boolean) => void;
  scalePanelOpen: boolean;
  setScalePanelOpen: (val: boolean) => void;
}

interface ActionFeedback {
  id: string;
  title: string;
  message: string;
  type: "action" | "ascii" | "info";
  timestamp: string;
}

export const PhoneChatInterface: React.FC<PhoneChatInterfaceProps> = ({
  engineRef,
  onOpenTerminal,
  soundEnabled,
  setSoundEnabled,
  viewMode,
  setViewMode,
  themeMode,
  blurLevel,
  setBlurLevel,
  transparencyLevel,
  setTransparencyLevel,
  isBlackAndWhite,
  setIsBlackAndWhite,
  scalePanelOpen,
  setScalePanelOpen,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);
  const [copied, setCopied] = useState(false);
  const [gitCopied, setGitCopied] = useState(false);
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [sharkCount, setSharkCount] = useState(7);

  const handleDownloadArchive = () => {
    if (soundEnabled) soundFX.playKeypress();
    downloadProjectArchive("shark-ui.tar.gz");
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Sync state with engine
  useEffect(() => {
    const syncState = () => {
      const engine = engineRef.current;
      if (engine) {
        setIsPaused(engine.isPaused());
        setSharkCount(engine.world.sharks.length);
      }
    };
    syncState();
    const timer = setInterval(syncState, 600);
    return () => clearInterval(timer);
  }, [engineRef]);

  // Primary "Start" button toggle handler
  const handleToggleStart = () => {
    const engine = engineRef.current;
    if (!engine) return;

    if (soundEnabled) soundFX.playKeypress();

    if (engine.isPaused()) {
      engine.resume();
      setIsPaused(false);
      setFeedback({
        id: Date.now().toString(),
        title: "Simulation Started",
        message: "Ocean dynamics resumed with active predatory tracking.",
        type: "action",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    } else {
      engine.pause();
      setIsPaused(true);
      setFeedback({
        id: Date.now().toString(),
        title: "Simulation Paused",
        message: "Animation paused. Click Start to resume swimming.",
        type: "action",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }
  };

  const handleRandomize = () => {
    if (soundEnabled) soundFX.playKeypress();
    const engine = engineRef.current;
    if (engine) {
      const specs = engine.randomize(7, true);
      setIsPaused(false);
      engine.resume();
      setSharkCount(specs.length);
      const summary = specs.map((s) => `${s.kind} (${Math.round(s.size * 100)}%)`).join(", ");
      setFeedback({
        id: Date.now().toString(),
        title: "Randomized Sharks",
        message: `Generated fresh choreography with ${specs.length} sharks: ${summary}`,
        type: "action",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }
  };

  const handleDropBait = () => {
    if (soundEnabled) soundFX.playSplash();
    const engine = engineRef.current;
    if (engine) {
      const pos = engine.dropBait();
      setFeedback({
        id: Date.now().toString(),
        title: "Bait Dropped",
        message: `Food bait placed at (${Math.round(pos.x)}, ${Math.round(pos.y)}). Sharks are converging!`,
        type: "action",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }
  };

  const handleSurge = () => {
    if (soundEnabled) soundFX.playKeypress();
    const engine = engineRef.current;
    if (engine) {
      engine.surgeCurrent();
      setFeedback({
        id: Date.now().toString(),
        title: "Ocean Surge",
        message: "90-knot hydrodynamic surge propelled the water column!",
        type: "action",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }
  };

  const handleExportBash = () => {
    if (soundEnabled) soundFX.playKeypress();
    const script = generateLocalBashScript();
    const blob = new Blob([script], { type: "text/x-sh" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ascii-sharks.sh";
    a.click();
    URL.revokeObjectURL(url);

    setFeedback({
      id: Date.now().toString(),
      title: "Bash Script Exported",
      message: "Downloaded 'ascii-sharks.sh'. Run 'chmod +x ascii-sharks.sh && ./ascii-sharks.sh' in any terminal!",
      type: "action",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  };

  const handleSelectPreset = (presetId: string) => {
    setPresetMenuOpen(false);
    const preset = SIMULATION_PRESETS.find((p) => p.id === presetId);
    if (!preset || !engineRef.current) return;
    if (soundEnabled) soundFX.playKeypress();

    engineRef.current.setSharks(preset.sharks);
    if (preset.speed) engineRef.current.setSpeed(preset.speed);
    setIsPaused(false);
    engineRef.current.resume();
    setSharkCount(preset.sharks.length);

    setFeedback({
      id: Date.now().toString(),
      title: preset.name,
      message: `${preset.description} (${preset.sharks.length} sharks)`,
      type: "action",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLight = themeMode === "light";

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-4 select-none z-20">
      {/* Top Header Pill Controls */}
      <div className="w-full flex items-center justify-between pointer-events-auto">
        {/* Presets / Species Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              if (soundEnabled) soundFX.playKeypress();
              setPresetMenuOpen(!presetMenuOpen);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-medium transition active:scale-95 shadow-xs border ${
              isLight
                ? "bg-white/90 text-neutral-800 border-neutral-200/90 hover:bg-neutral-50"
                : "bg-neutral-900/90 text-neutral-200 border-neutral-800 hover:bg-neutral-800"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>Presets</span>
            <ChevronDown
              className={`w-3.5 h-3.5 opacity-60 transition-transform ${presetMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {presetMenuOpen && (
            <div
              className={`absolute top-full left-0 mt-2 w-64 rounded-2xl shadow-xl backdrop-blur-xl border p-2 z-40 animate-in fade-in zoom-in-95 duration-150 ${
                isLight
                  ? "bg-white/95 border-neutral-200 text-neutral-900 shadow-neutral-200/80"
                  : "bg-neutral-900/95 border-neutral-800 text-neutral-100 shadow-black/80"
              }`}
            >
              <div className="text-[10px] font-sans uppercase tracking-wider text-neutral-400 px-2 py-1 font-semibold">
                Ocean Choreographies
              </div>
              <div className="space-y-0.5">
                {SIMULATION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-sans transition flex items-center justify-between ${
                      isLight ? "hover:bg-neutral-100" : "hover:bg-neutral-800"
                    }`}
                  >
                    <span className="truncate">{preset.name}</span>
                    <span className="text-[9px] text-neutral-400 opacity-80 ml-2">
                      {preset.sharks.length} sharks
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Right Utilities */}
        <div className="flex items-center gap-1.5">
          {/* Optics Scale Toggle Button */}
          <button
            onClick={() => {
              if (soundEnabled) soundFX.playKeypress();
              setScalePanelOpen(!scalePanelOpen);
            }}
            title={scalePanelOpen ? "Hide Blur Scale" : "Open Blur & Transparency Scale"}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition active:scale-95 shadow-xs border text-xs font-sans font-medium ${
              scalePanelOpen
                ? isLight
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-900 border-white"
                : isLight
                ? "bg-white/90 text-neutral-700 hover:text-neutral-900 border-neutral-200/90 hover:bg-neutral-50"
                : "bg-neutral-900/90 text-neutral-300 hover:text-white border-neutral-800 hover:bg-neutral-800"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scale</span>
            <span className="text-[10px] opacity-75">{blurLevel}%</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute audio" : "Enable hydro audio"}
            className={`p-2 rounded-full transition active:scale-95 shadow-xs border ${
              isLight
                ? "bg-white/90 text-neutral-700 hover:text-neutral-900 border-neutral-200/90 hover:bg-neutral-50"
                : "bg-neutral-900/90 text-neutral-300 hover:text-white border-neutral-800 hover:bg-neutral-800"
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-sky-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 opacity-50" />
            )}
          </button>

          {/* Interactive CLI Terminal Trigger */}
          <button
            onClick={onOpenTerminal}
            title="Open CLI Terminal"
            className={`p-2 rounded-full transition active:scale-95 shadow-xs border ${
              isLight
                ? "bg-white/90 text-neutral-700 hover:text-neutral-900 border-neutral-200/90 hover:bg-neutral-50"
                : "bg-neutral-900/90 text-neutral-300 hover:text-white border-neutral-800 hover:bg-neutral-800"
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
          </button>

          {/* Export Bash Script */}
          <button
            onClick={handleExportBash}
            title="Download standalone bash script (.sh)"
            className={`p-2 rounded-full transition active:scale-95 shadow-xs border ${
              isLight
                ? "bg-white/90 text-neutral-700 hover:text-neutral-900 border-neutral-200/90 hover:bg-neutral-50"
                : "bg-neutral-900/90 text-neutral-300 hover:text-white border-neutral-800 hover:bg-neutral-800"
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
          </button>

          {/* GitHub Repo & Push Guide Modal Trigger */}
          <button
            onClick={() => {
              if (soundEnabled) soundFX.playKeypress();
              setGithubModalOpen(true);
            }}
            title="Push to GitHub: shark-ui"
            className={`p-2 rounded-full transition active:scale-95 shadow-xs border ${
              isLight
                ? "bg-white/90 text-neutral-700 hover:text-neutral-900 border-neutral-200/90 hover:bg-neutral-50"
                : "bg-neutral-900/90 text-neutral-300 hover:text-white border-neutral-800 hover:bg-neutral-800"
            }`}
          >
            <Github className="w-3.5 h-3.5" />
          </button>

          {/* View Mode Toggle (Phone / Fullscreen) */}
          <button
            onClick={() => setViewMode(viewMode === "phone" ? "fullscreen" : "phone")}
            title={viewMode === "phone" ? "Switch to Fullscreen" : "Switch to Phone View"}
            className={`p-2 rounded-full transition active:scale-95 shadow-xs border ${
              isLight
                ? "bg-white/90 text-neutral-700 hover:text-neutral-900 border-neutral-200/90 hover:bg-neutral-50"
                : "bg-neutral-900/90 text-neutral-300 hover:text-white border-neutral-800 hover:bg-neutral-800"
            }`}
          >
            {viewMode === "phone" ? (
              <Maximize2 className="w-3.5 h-3.5" />
            ) : (
              <Minimize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Center is clear for the zoomed-out ASCII sharks */}
      <div className="flex-1 pointer-events-none" />

      {/* Floating Action Feedback Drawer */}
      {feedback && (
        <div className="w-full max-w-sm mx-auto mb-2 pointer-events-auto animate-in slide-in-from-bottom-2 duration-150">
          <div
            className={`rounded-2xl border px-3.5 py-2 shadow-lg backdrop-blur-xl relative flex items-center justify-between ${
              isLight
                ? "bg-white/95 border-neutral-200/90 text-neutral-900 shadow-neutral-200/60"
                : "bg-neutral-900/95 border-neutral-800 text-neutral-100 shadow-black/80"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-medium leading-tight truncate">{feedback.title}</div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                  {feedback.message}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => copyToClipboard(feedback.message)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700 transition"
                title="Copy"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
              <button
                onClick={() => setFeedback(null)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700 transition"
                title="Close"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lower Section: Blur & Transparency Scale + Start Button Controller */}
      <div
        className="w-full max-w-sm mx-auto pointer-events-auto flex flex-col items-center gap-2"
        style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}
      >
        {/* Blur & Transparency Scale Panel */}
        {scalePanelOpen ? (
          <div
            className={`w-full rounded-2xl border p-3 shadow-lg backdrop-blur-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
              isLight
                ? "bg-white/95 border-neutral-200/90 text-neutral-900 shadow-neutral-200/70"
                : "bg-neutral-900/95 border-neutral-800 text-neutral-100 shadow-black/80"
            }`}
          >
            {/* Panel Title & Status */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-[11px] font-semibold tracking-tight">Blur & Transparency Scale</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsBlackAndWhite(!isBlackAndWhite)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition active:scale-95 border ${
                    isBlackAndWhite
                      ? isLight
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-900 border-white"
                      : isLight
                      ? "bg-neutral-100 text-neutral-600 border-neutral-200"
                      : "bg-neutral-800 text-neutral-300 border-neutral-700"
                  }`}
                  title="Toggle Black & White / Color Tint"
                >
                  {isBlackAndWhite ? "◐ Black & White" : "🎨 Color"}
                </button>

                <button
                  onClick={() => setScalePanelOpen(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
                  title="Minimize scale section"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Slider 1: Blur Scale */}
            <div className="space-y-1 mb-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-600 dark:text-neutral-300 font-medium">Blur Scale (Blurish)</span>
                <span className="font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800">
                  {blurLevel}% {blurLevel === 50 ? "· Default" : ""}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={blurLevel}
                onChange={(e) => setBlurLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-white"
              />
              <div className="flex justify-between text-[9px] text-neutral-400 font-mono">
                <span>0% Sharp</span>
                <span className={blurLevel === 50 ? "font-bold text-neutral-700 dark:text-neutral-200" : ""}>
                  50% Blur
                </span>
                <span>100% Deep</span>
              </div>
            </div>

            {/* Slider 2: Transparency Scale */}
            <div className="space-y-1 mb-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-600 dark:text-neutral-300 font-medium">Transparency</span>
                <span className="font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800">
                  {transparencyLevel}% {transparencyLevel === 0 ? "· Solid" : ""}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={transparencyLevel}
                onChange={(e) => setTransparencyLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-white"
              />
              <div className="flex justify-between text-[9px] text-neutral-400 font-mono">
                <span>0% Solid</span>
                <span>50% Glass</span>
                <span>100% Ghost</span>
              </div>
            </div>

            {/* Preset Scale Buttons */}
            <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] font-sans">
              <span className="text-neutral-400 text-[9px]">Presets:</span>
              <button
                onClick={() => {
                  setBlurLevel(50);
                  setTransparencyLevel(0);
                  setIsBlackAndWhite(true);
                }}
                className={`px-2 py-0.5 rounded-md border text-[10px] transition active:scale-95 ${
                  blurLevel === 50 && transparencyLevel === 0 && isBlackAndWhite
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                    : "bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
                }`}
              >
                50% Blur B&W (Default)
              </button>
              <button
                onClick={() => {
                  setBlurLevel(0);
                  setTransparencyLevel(0);
                  setIsBlackAndWhite(true);
                }}
                className={`px-2 py-0.5 rounded-md border text-[10px] transition active:scale-95 ${
                  blurLevel === 0 && isBlackAndWhite
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                    : "bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
                }`}
              >
                0% Sharp
              </button>
              <button
                onClick={() => {
                  setBlurLevel(80);
                  setTransparencyLevel(20);
                  setIsBlackAndWhite(true);
                }}
                className={`px-2 py-0.5 rounded-md border text-[10px] transition active:scale-95 ${
                  blurLevel === 80 && isBlackAndWhite
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                    : "bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
                }`}
              >
                80% Dreamy
              </button>
            </div>
          </div>
        ) : (
          /* Minimized Optics Bar */
          <button
            onClick={() => setScalePanelOpen(true)}
            className={`w-full max-w-[280px] py-1.5 px-3 rounded-full border text-[11px] font-sans transition-all active:scale-95 shadow-xs flex items-center justify-between ${
              isLight
                ? "bg-white/90 hover:bg-white text-neutral-700 border-neutral-200/90 shadow-2xs"
                : "bg-neutral-900/90 hover:bg-neutral-900 text-neutral-300 border-neutral-800"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3 text-sky-500" />
              <span>Blur: <strong>{blurLevel}%</strong></span>
              <span className="opacity-40">·</span>
              <span>{isBlackAndWhite ? "◐ B&W" : "🎨 Color"}</span>
            </div>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium flex items-center gap-0.5">
              Adjust Scale
              <ChevronUp className="w-3 h-3" />
            </span>
          </button>
        )}

        {/* Main "Start" / "Pause" Button */}
        <div className="w-full flex items-center justify-center gap-2">
          <button
            onClick={handleToggleStart}
            className={`group relative flex-1 max-w-[200px] py-2.5 px-5 rounded-full font-medium text-xs sm:text-sm tracking-wide transition-all duration-200 active:scale-95 flex items-center justify-center gap-2.5 shadow-md ${
              isPaused
                ? isLight
                  ? "bg-neutral-900 text-white hover:bg-neutral-800 shadow-neutral-900/20"
                  : "bg-white text-neutral-900 hover:bg-neutral-100 shadow-white/20"
                : isLight
                ? "bg-neutral-900 text-white hover:bg-neutral-800 shadow-neutral-900/15"
                : "bg-neutral-800 text-neutral-100 hover:bg-neutral-700 border border-neutral-700"
            }`}
            title={isPaused ? "Start swimming animation" : "Pause simulation"}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current transition-transform group-hover:scale-110" />
                <span className="font-semibold">Start</span>
              </>
            ) : (
              <>
                <div className="relative flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 relative" />
                </div>
                <Pause className="w-3 h-3 fill-current opacity-80" />
                <span className="font-semibold">Pause</span>
              </>
            )}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-normal ml-0.5 ${
                isPaused
                  ? "bg-white/20 text-white dark:bg-black/20 dark:text-neutral-900"
                  : "bg-emerald-500/20 text-emerald-300"
              }`}
            >
              {sharkCount}
            </span>
          </button>

          {/* Quick Randomize Trigger Button */}
          <button
            onClick={handleRandomize}
            title="Randomize sharks (species, sizes & trajectories)"
            className={`p-2.5 rounded-full transition active:scale-95 shadow-sm border flex items-center justify-center ${
              isLight
                ? "bg-white/95 text-neutral-700 hover:text-neutral-900 border-neutral-200/90 hover:bg-neutral-50"
                : "bg-neutral-900/95 text-neutral-300 hover:text-white border-neutral-800 hover:bg-neutral-800"
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lower Companion Micro-Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-center text-[11px] font-sans">
          <button
            onClick={handleRandomize}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full border transition active:scale-95 flex items-center gap-1 ${
              isLight
                ? "bg-white/85 hover:bg-white text-neutral-700 border-neutral-200/90 shadow-2xs"
                : "bg-neutral-900/85 hover:bg-neutral-900 text-neutral-300 border-neutral-800"
            }`}
          >
            <span>🎲</span>
            <span>Randomize</span>
          </button>

          <button
            onClick={handleDropBait}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full border transition active:scale-95 flex items-center gap-1 ${
              isLight
                ? "bg-white/85 hover:bg-white text-neutral-700 border-neutral-200/90 shadow-2xs"
                : "bg-neutral-900/85 hover:bg-neutral-900 text-neutral-300 border-neutral-800"
            }`}
          >
            <span>🥩</span>
            <span>Feed Bait</span>
          </button>

          <button
            onClick={handleSurge}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full border transition active:scale-95 flex items-center gap-1 ${
              isLight
                ? "bg-white/85 hover:bg-white text-neutral-700 border-neutral-200/90 shadow-2xs"
                : "bg-neutral-900/85 hover:bg-neutral-900 text-neutral-300 border-neutral-800"
            }`}
          >
            <span>🌊</span>
            <span>Surge</span>
          </button>

          <button
            onClick={onOpenTerminal}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full border transition active:scale-95 flex items-center gap-1 ${
              isLight
                ? "bg-white/85 hover:bg-white text-neutral-700 border-neutral-200/90 shadow-2xs"
                : "bg-neutral-900/85 hover:bg-neutral-900 text-neutral-300 border-neutral-800"
            }`}
          >
            <span>💻</span>
            <span>CLI</span>
          </button>
        </div>
      </div>

      {/* GitHub Repository Push Modal */}
      {githubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150 pointer-events-auto">
          <div
            className={`w-full max-w-md rounded-3xl border p-5 sm:p-6 shadow-2xl relative ${
              isLight
                ? "bg-white text-neutral-900 border-neutral-200 shadow-neutral-300/60"
                : "bg-[#0f1117] text-neutral-100 border-neutral-800 shadow-black/90"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight">Push to GitHub: shark-ui</h3>
                  <p className="text-[11px] text-neutral-400">Git repository initialized & committed</p>
                </div>
              </div>
              <button
                onClick={() => setGithubModalOpen(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Create repo on GitHub */}
            <div className="space-y-4 text-xs font-sans">
              <div>
                <div className="font-medium text-neutral-800 dark:text-neutral-200 mb-1 flex items-center justify-between">
                  <span>Step 1: Create repository on GitHub</span>
                  <a
                    href="https://github.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-sky-600 hover:underline flex items-center gap-1 font-normal"
                  >
                    <span>Open GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Go to GitHub and create a new repository named <strong>shark-ui</strong> (or <strong>shark-UI</strong>). Leave it blank (do not initialize with README).
                </p>
              </div>

              {/* Step 2: Push commands */}
              <div>
                <div className="font-medium text-neutral-800 dark:text-neutral-200 mb-1 flex items-center justify-between">
                  <span>Step 2: Run in your terminal to push</span>
                  <button
                    onClick={() => {
                      const snippet = `git remote add origin https://github.com/YOUR_USERNAME/shark-ui.git\ngit branch -M main\ngit push -u origin main`;
                      navigator.clipboard.writeText(snippet);
                      setGitCopied(true);
                      setTimeout(() => setGitCopied(false), 2000);
                    }}
                    className="text-[11px] text-sky-600 hover:underline flex items-center gap-1"
                  >
                    {gitCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy commands</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-neutral-900 text-neutral-200 rounded-xl p-3 font-mono text-[11px] leading-relaxed border border-neutral-800 overflow-x-auto select-all">
                  <div className="text-neutral-400"># Link to your new repository</div>
                  <div>git remote add origin https://github.com/&lt;USERNAME&gt;/shark-ui.git</div>
                  <div className="text-neutral-400 mt-1"># Push the main branch</div>
                  <div>git branch -M main</div>
                  <div>git push -u origin main</div>
                </div>
              </div>

              {/* Direct Download alternative */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="font-medium text-neutral-800 dark:text-neutral-200 mb-1">
                  Or download complete source archive:
                </div>
                <button
                  type="button"
                  onClick={handleDownloadArchive}
                  className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 font-medium transition active:scale-95 shadow-sm ${
                    downloadSuccess
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 border-transparent"
                  }`}
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Downloaded! Check Downloads Folder</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download shark-ui.tar.gz (Instant In-Browser)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
