# Shark UI 🦈

> An interactive artificial-life simulation and command-line interface generating randomized ASCII shark animations in real-time, featuring a sleek vertical phone frame, optics blur & transparency scales, species dossiers, and retro CRT terminal aesthetics.

Inspired by [`stackedlol/ascii-sharks`](https://github.com/stackedlol/ascii-sharks).

---

## 🌟 Highlights

- **Zoomed-Out 7-Shark Ecosystem**: Simulates 7 diverse shark species (`Classic White`, `Hammerhead`, `Shortfin Mako`, `Tiger Shark`, `Zebra Shark`, `Great Hammerhead`, and `Thresher Shark`) swimming simultaneously.
- **Dynamic ASCII Rasterization**: High-density character cells (6–7px × 9–10px) with anti-aliased edge sampling, light-reactive dorsal ridges, gill slits, and rhythmic body wave physics.
- **Optics & Blur Scale**: Real-time interactive controls for:
  - **Blur Scale (0% – 100%)**: Default **50% blurish** for a dreamy, aesthetic look.
  - **Transparency Scale (0% – 100%)**: Adjust translucency against the background.
  - **Monochrome Mode**: Pure Black & White (B&W) high-contrast rendering.
- **Interactive Start Controller**: Primary **Start / Pause** controller with live pulse indicators, plus companion actions:
  - 🎲 **Randomize**: Re-rolls new choreographies, sizes, and species combinations.
  - 🥩 **Feed Bait**: Drops food bait to trigger predatory convergence and feeding frenzies.
  - 🌊 **Ocean Surge**: Drives 90-knot hydrodynamic currents scattering bait balls.
  - 💻 **CLI Terminal**: Interactive retro CRT terminal with command auto-completion.
- **Artificial Life Physics**:
  - **Fish Schools**: Reynolds boid flocking (separation, alignment, cohesion) in Couzin zones with "wave of agitation" alarm contagion and fountain scatter.
  - **Predatory Spines**: Follow-the-leader kinematics with curvature stiffness constraints.
- **Local Bash Export**: Generate standalone self-contained `ascii-sharks.sh` bash scripts runnable directly in Linux/macOS terminal emulators.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/shark-ui.git
cd shark-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with the simulation.

### Build for Production

```bash
npm run build
npm run preview
```

---

## ⌨️ Interactive CLI Commands

Press **CLI** (or type in the terminal modal) to access command-line controls:

| Command | Description |
| :--- | :--- |
| `rand` / `randomize` | Generate randomized shark animations & species |
| `spawn <species>` | Spawn apex predator (`hammerhead`, `mako`, `tiger`, `thresher`, `zebra`, `classic`) |
| `feed` / `bait` | Drop food bait into the water column |
| `surge` | Surge ocean currents across the matrix |
| `ascii` / `snapshot` | Capture and print a pure text ASCII art snapshot |
| `export bash` | Download standalone runnable `.sh` terminal animation |
| `speed <multiplier>` | Adjust simulation time multiplier (e.g. `speed 1.5`) |
| `theme <light\|dark>` | Toggle between white and dark oceanic themes |
| `clear` | Clear all sharks from the canvas |
| `help` | Display command manual and syntax |

---

## 🛠️ Tech Stack

- **Framework**: React 19 (SPA on Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Audio**: Web Audio API synthesized sonar, splashes, and keyboard clicks

---

## 📄 License

Apache-2.0
