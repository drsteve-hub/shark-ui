import React, { useEffect, useRef, useState } from "react";
import { OceanEngine } from "../engine";
import { soundFX } from "../utils/audio";
import { Compass, Crosshair } from "lucide-react";

interface OceanCanvasProps {
  engineRef: React.MutableRefObject<OceanEngine | null>;
  themeMode?: "light" | "dark";
  blurLevel?: number;
  transparencyLevel?: number;
  isBlackAndWhite?: boolean;
  onEvent?: (event: { kind: "eat" | "splash"; x: number; y: number }) => void;
  onSharkHover?: (shark: { id: number; kind: string; length: number; speed: number; hunger: number; x?: number; y?: number } | null) => void;
  onClickInteraction?: (coords: { x: number; y: number }) => void;
}

export const OceanCanvas: React.FC<OceanCanvasProps> = ({
  engineRef,
  themeMode = "light",
  blurLevel = 50,
  transparencyLevel = 0,
  isBlackAndWhite = true,
  onEvent,
  onSharkHover,
  onClickInteraction,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [inspectedShark, setInspectedShark] = useState<{
    id: number;
    kind: string;
    length: number;
    speed: number;
    hunger: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new OceanEngine(canvas, undefined, themeMode);
    engineRef.current = engine;

    engine.onEvent = (ev) => {
      if (ev.kind === "eat") {
        soundFX.playBite();
      } else if (ev.kind === "splash") {
        soundFX.playSplash();
      }
      if (onEvent) onEvent(ev);
    };

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Sync theme changes with the engine without recreation
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setTheme(themeMode);
    }
  }, [themeMode]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !engineRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setHoverPos({ x, y });

    // Find if hovering near any shark snout
    const sharks = engineRef.current.world.sharks;
    let found = null;
    for (const sh of sharks) {
      const sx = sh.nodes[0];
      const sy = sh.nodes[1];
      const d = Math.hypot(sx - x, sy - y);
      if (d < sh.length * 0.35 + 25) {
        found = {
          id: sh.id,
          kind: sh.kind,
          length: Math.round(sh.length),
          speed: Math.round(sh.speed),
          hunger: Math.round(sh.hunger * 100),
          x: sx,
          y: sy,
        };
        break;
      }
    }
    setInspectedShark(found);
    if (onSharkHover) onSharkHover(found);
  };

  const handlePointerLeave = () => {
    setHoverPos(null);
    setInspectedShark(null);
    if (onSharkHover) onSharkHover(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !engineRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Default click drops bait / creates ripple splash
    engineRef.current.dropBait(x, y);
    if (onClickInteraction) {
      onClickInteraction({ x, y });
    }
  };

  const isLight = themeMode === "light";

  // Map 0-100% blur to 0px - 3.6px blur (50% = 1.8px soft aesthetic blur)
  const blurPx = (blurLevel / 100) * 3.6;
  // Map 0-100% transparency to 1.0 -> 0.15 opacity
  const opacity = Math.max(0.12, 1 - (transparencyLevel / 100) * 0.88);
  const grayscale = isBlackAndWhite ? 1 : 0;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      className={`relative w-full h-full overflow-hidden select-none cursor-crosshair group ${
        isLight ? "bg-[#ffffff]" : "bg-[#03060a]"
      }`}
    >
      {/* Canvas with dynamic blur, transparency, and black & white scale */}
      <canvas
        ref={canvasRef}
        aria-label="ASCII Sharks Animation Canvas"
        className="w-full h-full block font-mono transition-[filter,opacity] duration-100"
        style={{
          filter: `grayscale(${grayscale}) blur(${blurPx.toFixed(2)}px)`,
          opacity: opacity.toFixed(2),
          transform: blurPx > 0.1 ? "scale(1.025)" : "none",
        }}
      />

      {/* Subtle Coordinate / Grid sensor HUD badge */}
      <div
        className={`absolute bottom-3 left-3 pointer-events-none flex items-center gap-2 text-[10px] font-mono px-2 py-0.5 rounded transition-opacity opacity-40 group-hover:opacity-85 ${
          isLight
            ? "text-neutral-500 bg-white/80 border border-neutral-200 shadow-xs"
            : "text-cyan-500/70 bg-black/60 border border-cyan-500/20"
        }`}
      >
        <Compass className={`w-3 h-3 ${isLight ? "text-neutral-600" : "text-cyan-400"}`} />
        <span>
          {hoverPos ? `${hoverPos.x}X · ${hoverPos.y}Y` : "WATER STANDBY"}
        </span>
      </div>

      {/* Shark Inspector Hover Card */}
      {inspectedShark && (
        <div
          className={`absolute z-30 pointer-events-none text-xs font-mono p-2.5 rounded-lg shadow-lg backdrop-blur-md min-w-[170px] transition-all duration-75 ${
            isLight
              ? "bg-white/95 border border-neutral-200 text-neutral-800 shadow-neutral-200/50"
              : "bg-black/90 border border-cyan-400/60 text-cyan-200 shadow-cyan-950/50"
          }`}
          style={{
            left: Math.min(window.innerWidth - 190, Math.max(10, inspectedShark.x - 70)),
            top: Math.max(10, inspectedShark.y - 85),
          }}
        >
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-cyan-500/30 pb-1 mb-1.5">
            <span className="font-bold uppercase tracking-wider text-[11px]">{inspectedShark.kind}</span>
            <span className="text-[10px] opacity-60">#{inspectedShark.id}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]">
            <span className="text-neutral-400">Speed</span>
            <span className="text-right font-semibold text-emerald-600">{inspectedShark.speed} kn</span>
            <span className="text-neutral-400">Length</span>
            <span className="text-right font-semibold text-sky-600">{inspectedShark.length} px</span>
            <span className="text-neutral-400">Hunger</span>
            <span className="text-right font-semibold text-amber-600">{inspectedShark.hunger}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
