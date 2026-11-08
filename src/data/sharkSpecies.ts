import type { SharkKind } from "../engine";

export interface SpeciesData {
  kind: SharkKind;
  commonName: string;
  scientificName: string;
  family: string;
  lengthRange: string;
  cruiseSpeedKnots: number;
  burstSpeedKnots: number;
  dangerRating: "Harmless" | "Moderate" | "High" | "Apex Superpredator";
  rarity: "Common" | "Uncommon" | "Rare" | "Legendary";
  biome: string;
  diet: string;
  description: string;
  asciiArt: string;
  funFact: string;
}

export const SHARK_SPECIES_DATA: Record<SharkKind, SpeciesData> = {
  classic: {
    kind: "classic",
    commonName: "Great White Shark",
    scientificName: "Carcharodon carcharias",
    family: "Lamnidae (Mackerel sharks)",
    lengthRange: "4.0 – 6.1 m (13 – 20 ft)",
    cruiseSpeedKnots: 2.2,
    burstSpeedKnots: 30.0,
    dangerRating: "Apex Superpredator",
    rarity: "Uncommon",
    biome: "Coastal temperate to epipelagic open water",
    diet: "Pinnipeds (seals, sea lions), large pelagic fish, dolphins",
    description: "The archetypal apex marine predator. Features a heavy fusiform body, serrated triangular teeth, dark slate-grey countershading, and an acute olfactory sense capable of detecting one drop of blood in 100 liters of water.",
    funFact: "Great Whites can launch their entire multi-ton bodies completely out of the water (breaching) when ambushing seals from below.",
    asciiArt: `
                __
               /  \\
              / ..|\\
             (_\\  |_/
            /  \\@/  \\
           /     _   \\
       _.-"     / )   "-._
     .'  _.-"\\ ( ( /"-._  '.
    / .-'     \\_\\_\\/    '-. \\
   / /                     \\ \\
  / /   ___           ___   \\ \\
 (_/   /   \\         /   \\   \\_)
       \\___/         \\___/
`,
  },
  hammerhead: {
    kind: "hammerhead",
    commonName: "Scalloped Hammerhead",
    scientificName: "Sphyrna lewini",
    family: "Sphyrnidae",
    lengthRange: "3.0 – 4.3 m (10 – 14 ft)",
    cruiseSpeedKnots: 2.5,
    burstSpeedKnots: 22.0,
    dangerRating: "Moderate",
    rarity: "Common",
    biome: "Tropical warm-temperate continental shelves and seamounts",
    diet: "Squid, stingrays, small schooling teleost fish",
    description: "Famous for its lateral cephalofoil head with indented scalloped lobes. Provides enhanced binocular stereo vision, wider olfactory range, and an expansive 360-degree electroreceptive ampullae of Lorenzini sensor network.",
    funFact: "Often forms massive daytime schools of hundreds of sharks around underwater volcanic seamounts, dispersing into solitary hunters at night.",
    asciiArt: `
          .==================.
         /   (o)        (o)   \\
        [                      ]
         \\________  __________/
                  ||
              .--'||'--.
             /    ||    \\
            /     ||     \\
           /    .-''-.    \\
          /   .'      '.   \\
         (__.'          '.__)
`,
  },
  greathammer: {
    kind: "greathammer",
    commonName: "Great Hammerhead",
    scientificName: "Sphyrna mokarran",
    family: "Sphyrnidae",
    lengthRange: "4.5 – 6.1 m (15 – 20 ft)",
    cruiseSpeedKnots: 2.8,
    burstSpeedKnots: 26.0,
    dangerRating: "High",
    rarity: "Rare",
    biome: "Tropical coastal lagoons, deep drop-offs and reefs",
    diet: "Stingrays, skates, smaller sharks, groupers, crabs",
    description: "The largest hammerhead species in the world. Distinguished by its almost completely straight front cephalofoil margin with a subtle central notch and a towering, sickle-shaped first dorsal fin that cuts through the surface.",
    funFact: "Uses its wide cephalofoil like a hydraulic clamp to pin thrashing stingrays against the sandy sea bottom before feeding.",
    asciiArt: `
     .=====================================.
    [  (o)                             (o)  ]
     \\_________________  __________________/
                       ||
                   .--'||'--.
                  /    ||    \\
                 /    /||\\    \\
                /    / || \\    \\
               /    /  ||  \\    \\
              /   .'   ||   '.   \\
             (__.'     ||     '.__)
                       /\\
                      /  \\
`,
  },
  tiger: {
    kind: "tiger",
    commonName: "Tiger Shark",
    scientificName: "Galeocerdo cuvier",
    family: "Galeocerdonidae",
    lengthRange: "3.5 – 5.5 m (11 – 18 ft)",
    cruiseSpeedKnots: 2.1,
    burstSpeedKnots: 24.0,
    dangerRating: "Apex Superpredator",
    rarity: "Uncommon",
    biome: "Tropical and subtropical reef flats and oceanic margins",
    diet: "Sea turtles, fish, birds, squid, rays, carrion",
    description: "The 'wastebasket of the sea.' Known for dark vertical tiger-like camouflage stripes along its flanks, a wide blunt square snout, and uniquely cockscomb-shaped serrated teeth capable of cleaving sea turtle carapaces cleanly in half.",
    funFact: "Tiger sharks have an ultra-flexible palate and stomach, and have been documented swallowing license plates, suits of armor, and oil drums.",
    asciiArt: `
              .-------.
             /  (o)    \\
            /   ____    \\
           /   / || \\    \\
          /   |  ||  |    \\
        .'  /||  ||  ||\\   '.
       /   / ||  ||  || \\    \\
      /   /  ||  ||  ||  \\    \\
     (   /   ||  ||  ||   \\    )
      '-'    ||  ||  ||    '-'
`,
  },
  zebra: {
    kind: "zebra",
    commonName: "Zebra / Leopard Shark",
    scientificName: "Stegostoma tigrinum",
    family: "Stegostomatidae",
    lengthRange: "2.0 – 2.5 m (6.5 – 8.2 ft)",
    cruiseSpeedKnots: 1.4,
    burstSpeedKnots: 14.0,
    dangerRating: "Harmless",
    rarity: "Common",
    biome: "Indo-Pacific shallow coral reefs and rubble flats",
    diet: "Mollusks, crustaceans, small benthic fish",
    description: "Easily identified by its elongated, blade-like caudal fin which accounts for half its total body length. Juveniles bear bold zebra stripes that morph into speckled leopard spots as adults. A docile bottom dweller with flexible pectoral fins.",
    funFact: "Unlike many pelagic sharks that must constantly swim to breathe, zebra sharks pump water over their gills using buccal pumping while lounging on coral sand.",
    asciiArt: `
             .-----.
            /  o o  \\
           /    ~    \\
          /  :  :  :  \\
         /   :  :  :   \\
        /    :  :  :    \\
       /     :  :  :     \\
      (      :  :  :      )
       \\     :  :  :     /
        \\    '..'..'    /
         \\             /
          '-----------'
              \\   /
               \\ /
                V
`,
  },
  mako: {
    kind: "mako",
    commonName: "Shortfin Mako Shark",
    scientificName: "Isurus oxyrinchus",
    family: "Lamnidae",
    lengthRange: "3.0 – 4.0 m (10 – 13 ft)",
    cruiseSpeedKnots: 3.5,
    burstSpeedKnots: 40.0,
    dangerRating: "High",
    rarity: "Rare",
    biome: "Open temperate and tropical epipelagic high seas",
    diet: "Swordfish, tuna, bonitos, squids, pelagic sharks",
    description: "The fastest shark in the world. Features a conical torpedo-like snout, narrow streamlined waist, metallic cobalt blue dorsum, large jet-black eyes, and a symmetrical crescent-shaped caudal tail built for supersonic ocean cruising.",
    funFact: "The Shortfin Mako can clock speeds exceeding 74 km/h (46 mph) and leap up to 9 meters (30 feet) clear into the air when hooked or hunting.",
    asciiArt: `
                /\\
               /  \\
              / /\\ \\
             / /  \\ \\
            / /    \\ \\
           / / (o)  \\ \\
          / /        \\ \\
         /_/__________\\_\\
           \\          /
            \\        /
             \\      /
              \\    /
               \\  /
                \\/
`,
  },
  thresher: {
    kind: "thresher",
    commonName: "Pelagic Thresher Shark",
    scientificName: "Alopias pelagicus",
    family: "Alopiidae",
    lengthRange: "3.0 – 5.5 m (10 – 18 ft)",
    cruiseSpeedKnots: 2.4,
    burstSpeedKnots: 28.0,
    dangerRating: "Moderate",
    rarity: "Rare",
    biome: "Deep oceanic drop-offs, open pelagic waters",
    diet: "Herring, mackerel, pelagic sardines, squid",
    description: "Possesses the most spectacular tail in the animal kingdom: an extraordinary scythe-like upper caudal fin lobe equal in length to the rest of its entire body. Features enormous dark eyes adapted for low-light abyssal hunting.",
    funFact: "Threshers weaponize their whip tails like sonic bullwhips, accelerating the fin tip to over 80 km/h to generate shockwaves that stun and kill entire schools of fish.",
    asciiArt: `
                  /\\
                 /  \\
                /    \\
               /      \\
              /   /\\   \\
             /   /  \\   \\
            /   /    \\   \\
           /   /      \\   \\
          /   /        \\   \\
         /   /          \\   \\
        /   /            \\   \\
       /   /              \\   \\
      (___/                \\___)
`,
  },
  nurse: {
    kind: "nurse",
    commonName: "Nurse Shark",
    scientificName: "Ginglymostoma cirratum",
    family: "Ginglymostomatidae",
    lengthRange: "2.2 – 3.0 m (7.2 – 9.8 ft)",
    cruiseSpeedKnots: 1.2,
    burstSpeedKnots: 16.0,
    dangerRating: "Harmless",
    rarity: "Common",
    biome: "Warm shallow reefs, mangrove channels, sea grass flats",
    diet: "Crabs, lobsters, octopuses, sea urchins, resting stingrays",
    description: "A sedentary bottom-dwelling shark with sensory barbels hanging from its snout like a catfish, strong rounded pectoral fins, small serrated crushing teeth, and a powerful suction pharynx capable of hoovering conch from shells.",
    funFact: "A nurse shark can generate one of the strongest suction-feeding vacuums of any aquatic vertebrate—equivalent to 1/3 of an atmosphere within fractions of a millisecond.",
    asciiArt: `
             .-----.
           .'  ===  '.
          /  (o) (o)  \\
         |    w   w    |
          \\   =====   /
           '.       .'
             '-----'
              /   \\
             |     |
             \\     /
              '---'
`,
  },
};
