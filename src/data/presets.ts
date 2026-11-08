import type { SharkSpec } from "../engine";

export interface SimulationPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  sharks: SharkSpec[];
  speed?: number;
  theme?: string;
}

export const SIMULATION_PRESETS: SimulationPreset[] = [
  {
    id: "pelagic",
    name: "Classic Pelagic Patrol",
    badge: "STANDARD",
    description: "Four Great White Sharks cruising in staggered oceanic depths, following classic pelagic patrol routes.",
    sharks: [
      { kind: "classic", size: 1.0 },
      { kind: "classic", size: 0.85 },
      { kind: "classic", size: 0.75 },
      { kind: "classic", size: 0.65 },
    ],
    speed: 1.0,
    theme: "oceanic",
  },
  {
    id: "hammerhead_cove",
    name: "Hammerhead Cove",
    badge: "SEAMOUNT",
    description: "A synchronized school of Great Hammerheads and Scalloped Hammerheads sweeping across volcanic sea pinnacles.",
    sharks: [
      { kind: "greathammer", size: 1.2 },
      { kind: "hammerhead", size: 0.95 },
      { kind: "hammerhead", size: 0.8 },
      { kind: "greathammer", size: 0.7 },
    ],
    speed: 1.1,
    theme: "cyan_cyber",
  },
  {
    id: "feeding_frenzy",
    name: "Feeding Frenzy",
    badge: "HIGH AGGRESSION",
    description: "High-octane predation zone: rapid Shortfin Makos and aggressive Tiger Sharks hunting dense bait balls.",
    sharks: [
      { kind: "mako", size: 1.15 },
      { kind: "tiger", size: 1.05 },
      { kind: "mako", size: 0.9 },
      { kind: "classic", size: 0.8 },
    ],
    speed: 1.35,
    theme: "blood_frenzy",
  },
  {
    id: "abyss",
    name: "Abyssal Solitude",
    badge: "DEEP TRENCH",
    description: "A gigantic solitary Pelagic Thresher with an elongated scythe tail undulating slowly through the midnight zone.",
    sharks: [
      { kind: "thresher", size: 1.45 },
    ],
    speed: 0.85,
    theme: "green_crt",
  },
  {
    id: "shallow_nursery",
    name: "Lagoon Nursery",
    badge: "DOCILE",
    description: "Peaceful coral lagoon populated by undulating Zebra sharks and resting Nurse sharks foraging along the sandy floor.",
    sharks: [
      { kind: "zebra", size: 0.95 },
      { kind: "nurse", size: 0.85 },
      { kind: "zebra", size: 0.75 },
      { kind: "nurse", size: 0.65 },
    ],
    speed: 0.9,
    theme: "amber",
  },
  {
    id: "apex_clash",
    name: "All-Species Apex Clash",
    badge: "FULL ROSTER",
    description: "One of each of all 8 known shark species simultaneously coexisting and competing in the open water column.",
    sharks: [
      { kind: "greathammer", size: 1.25 },
      { kind: "classic", size: 1.1 },
      { kind: "tiger", size: 1.0 },
      { kind: "mako", size: 0.95 },
      { kind: "thresher", size: 0.9 },
      { kind: "hammerhead", size: 0.85 },
      { kind: "zebra", size: 0.75 },
      { kind: "nurse", size: 0.7 },
    ],
    speed: 1.1,
    theme: "matrix",
  },
  {
    id: "megalodon",
    name: "The Megalodon",
    badge: "COLOSSAL",
    description: "A colossal, monolithic apex predator dwarfing all other aquatic life in the water column.",
    sharks: [
      { kind: "classic", size: 1.85 },
    ],
    speed: 0.95,
    theme: "oceanic",
  },
];
