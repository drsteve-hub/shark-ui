/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { OceanCanvas } from "./components/OceanCanvas";
import { PhoneChatInterface } from "./components/PhoneChatInterface";
import { TerminalView } from "./components/TerminalView";
import { SpeciesDossierModal } from "./components/SpeciesDossierModal";
import { OceanEngine, type SharkKind } from "./engine";
import { soundFX } from "./utils/audio";
import {
  Smartphone,
  Maximize2,
  Terminal as TerminalIcon,
  X,
  Sun,
  Moon,
  Sparkles,
  Wifi,
  Battery,
} from "lucide-react";

export default function App() {
  const engineRef = useRef<OceanEngine | null>(null);

  const [viewMode, setViewMode] = useState<"phone" | "fullscreen">("phone");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [dossierSpecies, setDossierSpecies] = useState<SharkKind | null>(null);
  const [currentTime, setCurrentTime] = useState("9:41");

  // Visual optics scale: default 50% blurish and black & white
  const [blurLevel, setBlurLevel] = useState(50);
  const [transparencyLevel, setTransparencyLevel] = useState(0);
  const [isBlackAndWhite, setIsBlackAndWhite] = useState(true);
  const [scalePanelOpen, setScalePanelOpen] = useState(true);

  // Keep clock updated
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleSpawnSpecies = (kind: SharkKind) => {
    const engine = engineRef.current;
    if (engine) {
      engine.spawnShark(kind, 1.05);
    }
  };

  const isLight = themeMode === "light";

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center transition-colors duration-300 font-sans ${
        isLight ? "bg-[#f4f4f5] text-neutral-900" : "bg-[#09090b] text-neutral-100"
      }`}
    >
      {/* Subtle Studio Backdrop Header Controls (visible outside the phone frame) */}
      {viewMode === "phone" && (
        <header className="absolute top-3 left-0 right-0 px-6 flex items-center justify-between z-30 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
              ascii-sharks
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">· html vertical mode</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Light / Dark Mode Toggle */}
            <button
              onClick={() => setThemeMode(isLight ? "dark" : "light")}
              className={`p-1.5 rounded-full border text-xs transition active:scale-95 ${
                isLight
                  ? "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100 shadow-2xs"
                  : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800"
              }`}
              title={isLight ? "Switch to dark mode" : "Switch to white background"}
            >
              {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            {/* Viewport Mode Switcher */}
            <button
              onClick={() => setViewMode("fullscreen")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition active:scale-95 ${
                isLight
                  ? "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100 shadow-2xs"
                  : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800"
              }`}
            >
              <Maximize2 className="w-3 h-3" />
              <span>Full Screen</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Container: Long Vertical View Like Phone or Fullscreen */}
      <div
        className={`relative transition-all duration-300 flex flex-col overflow-hidden ${
          viewMode === "phone"
            ? "w-full max-w-[400px] h-[92vh] max-h-[850px] rounded-[48px] border-[10px] border-[#18181b] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] bg-white ring-1 ring-black/10"
            : "w-full h-full rounded-none border-0"
        }`}
      >
        {/* Modern Smartphone Status Bar (Top Notch & Info) */}
        {viewMode === "phone" && (
          <div className="relative w-full h-11 shrink-0 px-7 flex items-center justify-between text-neutral-900 dark:text-white z-30 select-none pointer-events-none">
            {/* Clock */}
            <span className="text-[12px] font-semibold tracking-tight">{currentTime}</span>

            {/* Dynamic Island Pill */}
            <div className="w-24 h-5 bg-[#18181b] rounded-full flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0a0a0c] border border-neutral-800/80 mr-3" />
              <span className="w-2 h-2 rounded-full bg-[#1e293b]" />
            </div>

            {/* Signal & Battery Icons */}
            <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200">
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-mono font-medium">100%</span>
                <Battery className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* Interior Screen Body */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          {/* Ocean Canvas: Crisp, Pure White Background, Undulating Sharks */}
          <OceanCanvas
            engineRef={engineRef}
            themeMode={themeMode}
            blurLevel={blurLevel}
            transparencyLevel={transparencyLevel}
            isBlackAndWhite={isBlackAndWhite}
            onSharkHover={() => {}}
            onClickInteraction={() => {}}
          />

          {/* Interactive Chat & Controller Interface */}
          <PhoneChatInterface
            engineRef={engineRef}
            onOpenTerminal={() => setTerminalOpen(true)}
            onOpenDossier={(kind) => setDossierSpecies(kind)}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            viewMode={viewMode}
            setViewMode={setViewMode}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            blurLevel={blurLevel}
            setBlurLevel={setBlurLevel}
            transparencyLevel={transparencyLevel}
            setTransparencyLevel={setTransparencyLevel}
            isBlackAndWhite={isBlackAndWhite}
            setIsBlackAndWhite={setIsBlackAndWhite}
            scalePanelOpen={scalePanelOpen}
            setScalePanelOpen={setScalePanelOpen}
          />
        </div>

        {/* Phone Home Bar Indicator */}
        {viewMode === "phone" && (
          <div className="w-full py-1.5 flex justify-center items-center z-30 pointer-events-none bg-transparent">
            <div className="w-32 h-1 bg-neutral-900/30 dark:bg-white/30 rounded-full" />
          </div>
        )}
      </div>

      {/* Terminal View Drawer / Modal */}
      {terminalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl h-[85vh] max-h-[720px] rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-[#09090b] flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-mono font-semibold text-neutral-200">
                  ascii-sharks interactive cli terminal
                </span>
              </div>
              <button
                onClick={() => setTerminalOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <TerminalView
                engineRef={engineRef}
                theme="oceanic"
                setTheme={() => {}}
                onOpenDossier={(kind) => setDossierSpecies(kind)}
                crtEnabled={false}
                setCrtEnabled={() => {}}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
              />
            </div>
          </div>
        </div>
      )}

      {/* Species Biological Dossier Modal */}
      <SpeciesDossierModal
        speciesKey={dossierSpecies}
        onClose={() => setDossierSpecies(null)}
        onSpawn={handleSpawnSpecies}
      />
    </div>
  );
}
