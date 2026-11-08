import React from "react";
import { X, ShieldAlert, Zap, Compass, Activity, Dna } from "lucide-react";
import { SHARK_SPECIES_DATA, type SpeciesData } from "../data/sharkSpecies";
import type { SharkKind } from "../engine";
import { soundFX } from "../utils/audio";

interface SpeciesDossierModalProps {
  speciesKey: SharkKind | null;
  onClose: () => void;
  onSpawn: (kind: SharkKind) => void;
}

export const SpeciesDossierModal: React.FC<SpeciesDossierModalProps> = ({
  speciesKey,
  onClose,
  onSpawn,
}) => {
  if (!speciesKey) return null;
  const data: SpeciesData = SHARK_SPECIES_DATA[speciesKey] || SHARK_SPECIES_DATA.classic;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="relative w-full max-w-2xl bg-[#080d16] border border-cyan-500/40 rounded-lg shadow-[0_0_35px_rgba(6,182,212,0.25)] text-cyan-200 font-mono overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/30 bg-cyan-950/40">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-cyan-400" />
            <span className="text-xs uppercase tracking-widest text-cyan-300 font-bold">
              SPECIMEN DOSSIER: // {data.commonName}
            </span>
          </div>
          <button
            onClick={() => {
              soundFX.playKeypress();
              onClose();
            }}
            className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-900/50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4 text-xs">
          {/* Top Title & Latin Name */}
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-cyan-500/15 pb-3">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">{data.commonName}</h2>
              <p className="text-cyan-400/80 italic text-xs">{data.scientificName} • {data.family}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-600/40 text-[10px] text-cyan-300">
                {data.rarity}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                data.dangerRating.includes("Apex")
                  ? "bg-red-950/80 border-red-500/60 text-red-300"
                  : data.dangerRating === "High"
                  ? "bg-amber-950/80 border-amber-500/60 text-amber-300"
                  : "bg-emerald-950/80 border-emerald-500/60 text-emerald-300"
              }`}>
                {data.dangerRating}
              </span>
            </div>
          </div>

          {/* ASCII Wireframe & Diagram */}
          <div className="bg-black/80 rounded border border-cyan-900/50 p-3 flex flex-col items-center justify-center">
            <span className="text-[10px] text-cyan-500/60 uppercase tracking-widest self-start mb-1 font-mono">
              [ANATOMICAL ASCII WIREFRAME]
            </span>
            <pre className="text-cyan-300 text-[10px] sm:text-xs leading-none font-mono overflow-x-auto whitespace-pre max-w-full py-1 text-center select-text">
              {data.asciiArt.trim()}
            </pre>
          </div>

          {/* Biological Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded bg-cyan-950/30 border border-cyan-800/30">
              <span className="text-[10px] text-slate-400 block mb-0.5">Length Range</span>
              <strong className="text-white text-xs">{data.lengthRange}</strong>
            </div>
            <div className="p-2.5 rounded bg-cyan-950/30 border border-cyan-800/30">
              <span className="text-[10px] text-slate-400 block mb-0.5">Cruise Speed</span>
              <strong className="text-emerald-400 text-xs">{data.cruiseSpeedKnots} knots</strong>
            </div>
            <div className="p-2.5 rounded bg-cyan-950/30 border border-cyan-800/30">
              <span className="text-[10px] text-slate-400 block mb-0.5">Burst Acceleration</span>
              <strong className="text-cyan-300 text-xs">{data.burstSpeedKnots} knots</strong>
            </div>
            <div className="p-2.5 rounded bg-cyan-950/30 border border-cyan-800/30">
              <span className="text-[10px] text-slate-400 block mb-0.5">Primary Diet</span>
              <strong className="text-amber-300 text-xs truncate block" title={data.diet}>{data.diet}</strong>
            </div>
          </div>

          {/* Morphological Description */}
          <div className="space-y-1">
            <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
              Morphology & Biomechanics
            </span>
            <p className="text-slate-300 text-xs leading-relaxed bg-slate-900/40 p-2.5 rounded border border-slate-800">
              {data.description}
            </p>
          </div>

          {/* Marine Biology Fun Fact */}
          <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              Field Observation Note
            </span>
            <p className="text-xs text-slate-200 leading-normal italic">
              "{data.funFact}"
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-cyan-500/30 bg-cyan-950/30">
          <span className="text-[11px] text-cyan-500/80">CLI Code: `spawn {data.kind}`</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFX.playKeypress();
                onClose();
              }}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                soundFX.playSplash();
                onSpawn(data.kind);
                onClose();
              }}
              className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-semibold text-xs transition shadow-[0_0_12px_rgba(6,182,212,0.4)]"
            >
              Spawn Specimen Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
