import React, { useState, useRef, useEffect } from "react";
import {
  Terminal as TerminalIcon,
  CornerDownLeft,
  Trash2,
  Copy,
  Check,
  Download,
  HelpCircle,
  Shuffle,
  Utensils,
  Play,
  Pause,
  ExternalLink,
} from "lucide-react";
import { soundFX } from "../utils/audio";
import { OceanEngine, ALL_SHARK_KINDS, type SharkKind } from "../engine";
import { SHARK_SPECIES_DATA } from "../data/sharkSpecies";
import { SIMULATION_PRESETS } from "../data/presets";
import { generateLocalBashScript } from "../utils/bashGenerator";
import type { ThemeMode } from "./TopBar";

interface OutputLine {
  id: string;
  type: "input" | "output" | "error" | "ascii" | "success" | "system";
  text: string;
  timestamp: string;
}

interface TerminalViewProps {
  engineRef: React.MutableRefObject<OceanEngine | null>;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  onOpenDossier: (kind: SharkKind) => void;
  crtEnabled: boolean;
  setCrtEnabled: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

const COMMAND_SUGGESTIONS = [
  "rand",
  "spawn hammerhead",
  "feed",
  "preset feeding_frenzy",
  "species",
  "export text",
  "export bash",
  "theme green_crt",
  "status",
  "help",
];

const SHARK_TRIVIA = [
  "Sharks have existed for over 450 million years—predating trees, dinosaurs, and Saturn's rings.",
  "Hammerhead sharks have 360-degree vision in the vertical plane, allowing them to see above and below simultaneously.",
  "The Shortfin Mako is the cheetah of the ocean, accelerating faster than a sports car to speeds over 74 km/h.",
  "Shark skin is covered in microscopic tooth-like scales called dermal denticles that channel water turbulence and deter parasites.",
  "Pelagic Thresher sharks use their scythe tails as sonic whips, creating cavitation shockwaves to stun fish schools.",
  "Zebra sharks are born with vertical zebra stripes, which morph into speckled leopard-like dots as they reach adulthood.",
  "Sharks possess the Ampullae of Lorenzini—electroreceptors that detect the faint electrical pulses of a prey's heartbeat in the sand.",
];

export const TerminalView: React.FC<TerminalViewProps> = ({
  engineRef,
  theme,
  setTheme,
  onOpenDossier,
  crtEnabled,
  setCrtEnabled,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [lines, setLines] = useState<OutputLine[]>([
    {
      id: "init-banner",
      type: "system",
      text: `
  ____ _   _    _    ____  _  ______        ____ _     ___ 
 / ___| | | |  / \\  |  _ \\| |/ / ___|      / ___| |   |_ _|
 \\___ \\ |_| | / _ \\ | |_) | ' /\\___ \\ ____| |   | |    | | 
  ___) |  _  |/ ___ \\|  _ <| . \\ ___) |____| |___| |___ | | 
 |____/|_| |_/_/   \\_\\_| \\_\\_|\\_\\____/      \\____|_____|___|
 
 [ASCII SHARKS SIMULATOR & CLI INTERFACE v2.4]
 Connected to local hydro-simulation kernel.
 Type 'help' to inspect command list or 'rand' to randomize sharks.
`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const addLine = (type: OutputLine["type"], text: string) => {
    setLines((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        type,
        text,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    soundFX.playKeypress();

    // Add to input history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Record user input line
    addLine("input", `ocean@sharks:~$ ${trimmed}`);

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const engine = engineRef.current;

    switch (command) {
      case "help":
      case "man": {
        addLine(
          "output",
          `
COMMAND-LINE REFERENCE:
--------------------------------------------------------------------------------
GENERATION & SIMULATION:
  rand [count]           - Randomize active sharks with random species & sizes
  spawn <species> [size] - Spawn a shark (classic, hammerhead, tiger, mako, etc.)
  remove [id|last]       - Despawn a specific shark or the most recent
  clear / cls            - Clear terminal scrollback
  preset <name>          - Load scenario (pelagic, hammerhead_cove, frenzy, abyss)
  feed [x y] / bait      - Drop chum/bait at coordinates or random location
  splash [x y]           - Trigger water surface impact and bubble wake
  current [surge]        - Surge oceanic current and stimulate fish schooling
  speed <0.2 - 4.0>      - Adjust simulation clock rate
  pause / play / step    - Pause, resume, or step single physics frame

INSPECTION & BIOLOGY:
  species / list         - Print comprehensive ASCII roster of all 8 shark species
  info <species>         - View full anatomical dossier and ASCII wireframe
  status / top           - Print live ocean telemetry (counts, hunger, coords, FPS)
  trivia / lore          - Display marine biology facts & scientific trivia

SYSTEM & EXPORT:
  export text            - Copy current frame ASCII art to clipboard
  export bash            - Generate & download runnable bash terminal script
  theme <name>           - Change theme (oceanic, green_crt, amber, cyber, blood)
  sound [on|off]         - Toggle hydrophone audio synthesizer
  crt [on|off]           - Toggle CRT retro scanline filter
  history                - Show command history
--------------------------------------------------------------------------------
`
        );
        break;
      }

      case "rand":
      case "randomize":
      case "shuffle": {
        if (!engine) {
          addLine("error", "Engine unavailable.");
          break;
        }
        const count = args[0] ? parseInt(args[0], 10) : 4;
        const validCount = isNaN(count) ? 4 : Math.max(1, Math.min(8, count));
        const specs = engine.randomize(validCount, true);
        soundFX.playSplash();
        addLine(
          "success",
          `🎲 Ocean randomized with ${specs.length} sharks:
${specs.map((s, idx) => `  [#${idx + 1}] ${s.kind.toUpperCase()} (scale: ${s.size}x)`).join("\n")}`
        );
        break;
      }

      case "spawn": {
        if (!engine) {
          addLine("error", "Engine unavailable.");
          break;
        }
        const kindInput = args[0]?.toLowerCase() as SharkKind;
        if (!kindInput || !ALL_SHARK_KINDS.includes(kindInput)) {
          addLine(
            "error",
            `Unknown or missing species. Valid species:\n${ALL_SHARK_KINDS.join(", ")}\nExample: 'spawn hammerhead 1.2'`
          );
          break;
        }
        const sizeInput = args[1] ? parseFloat(args[1]) : 1.0;
        const validSize = isNaN(sizeInput) ? 1.0 : Math.max(0.4, Math.min(2.0, sizeInput));
        const shark = engine.spawnShark(kindInput, validSize);
        soundFX.playSplash();
        addLine(
          "success",
          `🦈 Spawned #${shark.id} ${kindInput.toUpperCase()} (length: ${Math.round(shark.length)}px, scale: ${validSize}x) into water column.`
        );
        break;
      }

      case "remove":
      case "rm":
      case "kill": {
        if (!engine) {
          addLine("error", "Engine unavailable.");
          break;
        }
        if (args[0] === "all") {
          engine.clearSharks();
          addLine("success", "Cleared all sharks from the ocean.");
          break;
        }
        const targetId = args[0] ? parseInt(args[0], 10) : undefined;
        const removed = engine.removeShark(isNaN(targetId!) ? "last" : targetId);
        if (removed) {
          addLine("success", `Despawned shark ${targetId ? `#${targetId}` : "last"}.`);
        } else {
          addLine("error", `Could not find shark ${targetId ? `#${targetId}` : ""}.`);
        }
        break;
      }

      case "feed":
      case "bait": {
        if (!engine) {
          addLine("error", "Engine unavailable.");
          break;
        }
        const x = args[0] ? parseInt(args[0], 10) : undefined;
        const y = args[1] ? parseInt(args[1], 10) : undefined;
        const res = engine.dropBait(x, y);
        soundFX.playSplash();
        addLine(
          "success",
          `🍖 Dropped chum/bait at coordinates (${res.x}, ${res.y})! Nearby predators scenting bait trail.`
        );
        break;
      }

      case "splash": {
        if (!engine) {
          addLine("error", "Engine unavailable.");
          break;
        }
        const x = args[0] ? parseInt(args[0], 10) : Math.random() * 600;
        const y = args[1] ? parseInt(args[1], 10) : Math.random() * 400;
        engine.world.splash(x, y);
        soundFX.playSplash();
        addLine("success", `Surface splash impact at (${Math.round(x)}, ${Math.round(y)}). Agitation wave propagating.`);
        break;
      }

      case "current":
      case "surge": {
        if (!engine) {
          addLine("error", "Engine unavailable.");
          break;
        }
        engine.surgeCurrent();
        soundFX.playSplash();
        addLine("success", "⚡ Oceanic current surged! Fish aligning into hydrodynamic schools.");
        break;
      }

      case "species":
      case "list": {
        const rows = ALL_SHARK_KINDS.map((k) => {
          const d = SHARK_SPECIES_DATA[k];
          return `  ${k.padEnd(12)} | ${d.commonName.padEnd(23)} | ${d.lengthRange.padEnd(18)} | ${d.burstSpeedKnots} kn | ${d.dangerRating}`;
        });
        addLine(
          "output",
          `
AVAILABLE SHARK SPECIES CATALOG:
========================================================================================
  SPECIES      | COMMON NAME             | LENGTH RANGE       | BURST | DANGER
========================================================================================
${rows.join("\n")}
========================================================================================
Type 'info <species>' to inspect complete anatomical dossier and ASCII wireframe.
`
        );
        break;
      }

      case "info": {
        const kind = args[0]?.toLowerCase() as SharkKind;
        if (!kind || !ALL_SHARK_KINDS.includes(kind)) {
          addLine("error", `Please provide a valid species: 'info hammerhead', 'info mako', 'info thresher', etc.`);
          break;
        }
        const d = SHARK_SPECIES_DATA[kind];
        onOpenDossier(kind);
        addLine(
          "output",
          `
[OPENED SPECIMEN DOSSIER: ${d.commonName.toUpperCase()}]
Scientific: ${d.scientificName} (${d.family})
Biome: ${d.biome}
Diet: ${d.diet}
Speed: ${d.cruiseSpeedKnots} kn cruise / ${d.burstSpeedKnots} kn burst
Notes: ${d.funFact}
`
        );
        break;
      }

      case "preset": {
        if (!engine) {
          addLine("error", "Engine unavailable.");
          break;
        }
        const name = args[0]?.toLowerCase();
        const found = SIMULATION_PRESETS.find(
          (p) => p.id === name || p.name.toLowerCase().includes(name || "")
        );
        if (!found) {
          addLine(
            "error",
            `Preset not found. Available presets:\n${SIMULATION_PRESETS.map((p) => `  ${p.id.padEnd(16)} - ${p.description}`).join("\n")}`
          );
          break;
        }
        engine.setSharks(found.sharks);
        if (found.speed) engine.setSpeed(found.speed);
        if (found.theme) setTheme(found.theme as ThemeMode);
        soundFX.playSplash();
        addLine(
          "success",
          `🌊 Loaded Preset [${found.name.toUpperCase()}]: ${found.description} (${found.sharks.length} sharks)`
        );
        break;
      }

      case "speed": {
        if (!engine) {
          addLine("error", "Engine unavailable.");
          break;
        }
        const val = parseFloat(args[0]);
        if (isNaN(val) || val < 0.1 || val > 4.0) {
          addLine("error", "Usage: 'speed <0.2 - 4.0>' (e.g. 'speed 1.5')");
          break;
        }
        engine.setSpeed(val);
        addLine("success", `Simulation speed set to ${val}x.`);
        break;
      }

      case "pause": {
        if (!engine) break;
        engine.pause();
        addLine("system", "⏸ Simulation PAUSED.");
        break;
      }

      case "play":
      case "resume": {
        if (!engine) break;
        engine.resume();
        addLine("system", "▶ Simulation RESUMED.");
        break;
      }

      case "step": {
        if (!engine) break;
        engine.stepOnce();
        addLine("system", "⏭ Advanced simulation by 1 timestep.");
        break;
      }

      case "status":
      case "top":
      case "telemetry": {
        if (!engine) {
          addLine("error", "Engine unavailable.");
          break;
        }
        const t = engine.getTelemetry();
        addLine(
          "output",
          `
OCEAN TELEMETRY KERNEL REPORT:
--------------------------------------------------
  Status:           ${t.paused ? "PAUSED" : "RUNNING"}
  Engine FPS:       ${t.fps}
  Elapsed Time:     ${t.time}s
  Predation Events: ${t.feedCount} bites recorded
  Active Baits:     ${t.baitsActive}
  Fish Schools:     ${t.livingFish} living / ${t.totalFish} total
  Predators Active: ${t.sharkCount}

ACTIVE PREDATOR ROSTER:
${t.sharks
  .map(
    (s) =>
      `  #${s.id.toString().padEnd(3)} | ${s.kind.padEnd(12)} | Length: ${s.length}px | Speed: ${s.speed}kn | Hunger: ${s.hunger}% | Pos: (${s.x}, ${s.y})`
  )
  .join("\n")}
--------------------------------------------------
`
        );
        break;
      }

      case "theme": {
        const val = args[0]?.toLowerCase() as ThemeMode;
        const validThemes: ThemeMode[] = [
          "oceanic",
          "green_crt",
          "amber",
          "cyan_cyber",
          "blood_frenzy",
          "matrix",
          "monochrome",
        ];
        if (!val || !validThemes.includes(val)) {
          addLine(
            "error",
            `Unknown theme. Available:\n${validThemes.join(", ")}\nExample: 'theme green_crt'`
          );
          break;
        }
        setTheme(val);
        addLine("success", `Theme switched to '${val}'.`);
        break;
      }

      case "sound": {
        const arg = args[0]?.toLowerCase();
        if (arg === "on") {
          setSoundEnabled(true);
          soundFX.setEnabled(true);
          soundFX.playSonarPing();
          addLine("success", "Hydrophone audio synthesizer enabled.");
        } else if (arg === "off") {
          setSoundEnabled(false);
          soundFX.setEnabled(false);
          addLine("success", "Hydrophone audio synthesizer muted.");
        } else {
          const next = !soundEnabled;
          setSoundEnabled(next);
          soundFX.setEnabled(next);
          if (next) soundFX.playSonarPing();
          addLine("success", `Hydrophone audio synthesizer is now ${next ? "ENABLED" : "MUTED"}.`);
        }
        break;
      }

      case "crt": {
        const arg = args[0]?.toLowerCase();
        if (arg === "on") {
          setCrtEnabled(true);
          addLine("success", "CRT scanlines filter enabled.");
        } else if (arg === "off") {
          setCrtEnabled(false);
          addLine("success", "CRT scanlines filter disabled.");
        } else {
          const next = !crtEnabled;
          setCrtEnabled(next);
          addLine("success", `CRT scanlines filter is now ${next ? "ENABLED" : "DISABLED"}.`);
        }
        break;
      }

      case "export": {
        const sub = args[0]?.toLowerCase();
        if (sub === "text" || sub === "ascii") {
          if (!engine) break;
          const art = engine.getAsciiSnapshot(64, 20);
          navigator.clipboard.writeText(art).catch(() => {});
          addLine("ascii", art);
          addLine("success", "📋 Copied ASCII art frame snapshot to clipboard!");
        } else if (sub === "bash" || sub === "sh") {
          const script = generateLocalBashScript();
          // Create download link
          const blob = new Blob([script], { type: "text/x-sh" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "ascii-sharks.sh";
          a.click();
          URL.revokeObjectURL(url);
          addLine(
            "success",
            `💻 Generated 'ascii-sharks.sh'!
Downloaded to your device. To run in your terminal:
  chmod +x ascii-sharks.sh && ./ascii-sharks.sh`
          );
        } else {
          addLine(
            "output",
            `Export options:
  'export text' - View & copy current real-time ASCII simulation frame
  'export bash' - Download executable bash script to run ASCII sharks in local terminal`
          );
        }
        break;
      }

      case "trivia":
      case "lore":
      case "fortune": {
        const quote = SHARK_TRIVIA[Math.floor(Math.random() * SHARK_TRIVIA.length)];
        addLine("output", `💡 MARINE FACT: "${quote}"`);
        break;
      }

      case "clear":
      case "cls": {
        setLines([]);
        break;
      }

      case "history": {
        if (history.length === 0) {
          addLine("output", "No command history recorded.");
        } else {
          addLine(
            "output",
            history.map((cmd, i) => `  ${(i + 1).toString().padStart(3, " ")}  ${cmd}`).join("\n")
          );
        }
        break;
      }

      default: {
        soundFX.playAlert();
        addLine(
          "error",
          `Command not recognized: '${command}'. Type 'help' to view available commands.`
        );
        break;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommand(inputVal);
      setInputVal("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(history[nextIndex] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex] || "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Autocomplete command or species
      const trimmed = inputVal.trimStart().toLowerCase();
      const allCommands = [
        "help",
        "rand",
        "randomize",
        "spawn",
        "remove",
        "clear",
        "preset",
        "feed",
        "splash",
        "current",
        "species",
        "info",
        "speed",
        "pause",
        "play",
        "step",
        "theme",
        "sound",
        "crt",
        "export",
        "status",
        "trivia",
        "history",
      ];

      const parts = trimmed.split(" ");
      if (parts.length === 1) {
        const match = allCommands.find((c) => c.startsWith(parts[0]));
        if (match) setInputVal(match + " ");
      } else if (parts[0] === "spawn" || parts[0] === "info") {
        const matchSpecies = ALL_SHARK_KINDS.find((k) => k.startsWith(parts[1]));
        if (matchSpecies) setInputVal(`${parts[0]} ${matchSpecies} `);
      } else if (parts[0] === "preset") {
        const matchPreset = SIMULATION_PRESETS.find((p) => p.id.startsWith(parts[1]));
        if (matchPreset) setInputVal(`preset ${matchPreset.id}`);
      } else if (parts[0] === "theme") {
        const matchTheme = [
          "oceanic",
          "green_crt",
          "amber",
          "cyan_cyber",
          "blood_frenzy",
          "matrix",
          "monochrome",
        ].find((t) => t.startsWith(parts[1]));
        if (matchTheme) setInputVal(`theme ${matchTheme}`);
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#05080f] font-mono text-xs text-slate-300 overflow-hidden select-text">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0a101a] border-b border-cyan-500/20 text-[11px] text-cyan-400 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold tracking-wider text-cyan-300">
            SHARK-SHELL v2.4 (VT100)
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">tty0: deepsea://ocean.local</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLines([])}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition"
            title="Clear terminal log"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Terminal Output Log Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs select-text scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
        {lines.map((l) => (
          <div key={l.id} className="leading-relaxed">
            {l.type === "input" ? (
              <div className="text-cyan-300 font-semibold flex items-baseline gap-1.5">
                <span className="text-emerald-400">ocean@sharks:~$</span>
                <span className="text-white select-text">{l.text.replace(/^ocean@sharks:~\$\s*/, "")}</span>
              </div>
            ) : l.type === "ascii" ? (
              <div className="relative group my-2 p-2 bg-black/80 rounded border border-cyan-900/60 overflow-x-auto">
                <button
                  onClick={() => copyToClipboard(l.text, l.id)}
                  className="absolute top-2 right-2 p-1 rounded bg-cyan-950/80 border border-cyan-600/40 text-cyan-300 hover:text-white transition"
                  title="Copy ASCII art"
                >
                  {copiedId === l.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <pre className="text-[10px] leading-[10px] sm:text-xs sm:leading-tight text-cyan-300 whitespace-pre font-mono">
                  {l.text}
                </pre>
              </div>
            ) : l.type === "error" ? (
              <div className="text-red-400 font-medium whitespace-pre-wrap">{l.text}</div>
            ) : l.type === "success" ? (
              <div className="text-emerald-400 whitespace-pre-wrap">{l.text}</div>
            ) : l.type === "system" ? (
              <div className="text-cyan-400/90 whitespace-pre-wrap">{l.text}</div>
            ) : (
              <div className="text-slate-300 whitespace-pre-wrap">{l.text}</div>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Suggested Quick Commands Bar */}
      <div className="px-3 py-1.5 bg-[#080d16] border-t border-cyan-500/10 flex items-center gap-1.5 overflow-x-auto select-none no-scrollbar">
        <span className="text-[10px] text-slate-500 uppercase font-semibold shrink-0">Quick:</span>
        {COMMAND_SUGGESTIONS.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleCommand(cmd)}
            className="shrink-0 px-2 py-0.5 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/50 text-[10px] text-cyan-300 hover:text-cyan-100 transition"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Command Input Prompt Form */}
      <div className="p-2.5 bg-[#0a101a] border-t border-cyan-500/20 flex items-center gap-2 select-none">
        <span className="text-emerald-400 font-bold shrink-0">ocean@sharks:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command... ('rand', 'spawn hammerhead', 'feed', 'help')"
          className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs placeholder:text-slate-600 focus:ring-0"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <button
          onClick={() => {
            handleCommand(inputVal);
            setInputVal("");
            inputRef.current?.focus();
          }}
          className="p-1 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-600/30 transition shrink-0"
          title="Send command (Enter)"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
