import { AsciiRenderer } from "./renderer";
import { World, type SharkSpec } from "./world";

const STEP = 1 / 60;
const MAX_STEPS = 4;

/**
 * Wires World + AsciiRenderer to a canvas: fixed-timestep loop, resize,
 * pointer input, pausing off-screen, and prefers-reduced-motion.
 */
export class OceanEngine {
  public world: World;
  public renderer: AsciiRenderer;
  public paused = false;
  public speedMultiplier = 1;
  public fps = 60;
  public onEvent?: (event: { kind: "eat" | "splash"; x: number; y: number }) => void;

  private raf = 0;
  private last = 0;
  private acc = 0;
  private frameCount = 0;
  private lastFpsTime = performance.now();
  private visible = true;
  private reducedMotion: MediaQueryList;
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private disposed = false;

  constructor(private canvas: HTMLCanvasElement, sharks?: SharkSpec[], initialTheme: "light" | "dark" = "light") {
    this.world = new World(sharks);
    this.renderer = new AsciiRenderer(canvas, initialTheme);
    this.renderer.setFontFamily(getComputedStyle(canvas).fontFamily);
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.schedule();
    });
    this.intersectionObserver.observe(canvas);

    this.reducedMotion.addEventListener("change", this.onMotionPreference);
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("pointerdown", this.onPointerDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", this.onPointerLeave);
    window.addEventListener("blur", this.onPointerLeave);

    this.resize();
    // Canvas text can't trigger a webfont load; once the mono face is in, redraw.
    document.fonts?.load(`600 16px ${getComputedStyle(canvas).fontFamily}`).then(() => {
      if (!this.disposed && this.reducedMotion.matches) this.drawStill();
    });
    this.schedule();
  }

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.reducedMotion.removeEventListener("change", this.onMotionPreference);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerdown", this.onPointerDown);
    document.documentElement.removeEventListener("pointerleave", this.onPointerLeave);
    window.removeEventListener("blur", this.onPointerLeave);
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.resize(rect.width, rect.height, dpr);
    this.world.resize(rect.width, rect.height, this.renderer.cellWidth, this.renderer.cellHeight);
    if (this.reducedMotion.matches) this.drawStill();
  }

  private schedule() {
    cancelAnimationFrame(this.raf);
    if (this.disposed || !this.visible || this.reducedMotion.matches) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (now: number) => {
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;

    this.frameCount++;
    if (now - this.lastFpsTime >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.frameCount = 0;
      this.lastFpsTime = now;
    }

    if (!this.paused) {
      this.acc += dt * this.speedMultiplier;
      let steps = 0;
      while (this.acc >= STEP && steps < MAX_STEPS) {
        this.world.step(STEP);
        this.acc -= STEP;
        steps++;
      }
      if (steps === MAX_STEPS) this.acc = 0;
    }

    if (this.onEvent && this.world.events.length > 0) {
      for (const ev of this.world.events) {
        this.onEvent(ev);
      }
    }

    this.renderer.render(this.world, dt * (this.paused ? 0 : this.speedMultiplier));
    this.raf = requestAnimationFrame(this.frame);
  };

  /** Reduced motion: let the ecosystem settle, then show a single frame. */
  private drawStill() {
    if (this.world.time < 4) {
      for (let i = 0; i < 240; i++) this.world.step(STEP);
    }
    this.renderer.render(this.world, STEP);
  }

  private onMotionPreference = () => {
    if (this.reducedMotion.matches) {
      cancelAnimationFrame(this.raf);
      this.drawStill();
    } else {
      this.schedule();
    }
  };

  private toLocal(e: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
    return { x, y, inside };
  }

  private onPointerMove = (e: PointerEvent) => {
    const { x, y, inside } = this.toLocal(e);
    const p = this.world.pointer;
    p.x = x;
    p.y = y;
    p.active = inside && e.pointerType !== "touch";
  };

  private onPointerDown = (e: PointerEvent) => {
    const { x, y, inside } = this.toLocal(e);
    if (inside && !this.reducedMotion.matches) {
      this.world.splash(x, y);
      if (this.onEvent) {
        this.onEvent({ kind: "splash", x, y });
      }
    }
  };

  private onPointerLeave = () => {
    this.world.pointer.active = false;
  };

  // Public interactive CLI controls
  setTheme(mode: "light" | "dark") {
    this.renderer.setTheme(mode);
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  togglePause() {
    this.paused = !this.paused;
    return this.paused;
  }

  isPaused() {
    return this.paused;
  }

  stepOnce() {
    this.world.step(STEP);
    this.renderer.render(this.world, STEP);
  }

  setSpeed(mult: number) {
    this.speedMultiplier = Math.max(0.1, Math.min(mult, 4.0));
  }

  getSpeed() {
    return this.speedMultiplier;
  }

  spawnShark(kind?: any, size?: number) {
    return this.world.spawnShark(kind, size);
  }

  removeShark(idOrIndex?: number | "last") {
    return this.world.removeShark(idOrIndex);
  }

  clearSharks() {
    this.world.clearSharks();
  }

  setSharks(specs: SharkSpec[]) {
    this.world.setSharks(specs);
  }

  randomize(count = 4, mixSpecies = true) {
    return this.world.randomize(count, mixSpecies);
  }

  dropBait(x?: number, y?: number) {
    const res = this.world.dropBait(x, y);
    if (this.onEvent) {
      this.onEvent({ kind: "splash", x: res.x, y: res.y });
    }
    return res;
  }

  surgeCurrent() {
    this.world.surgeCurrent();
  }

  getTelemetry() {
    return {
      ...this.world.getTelemetry(),
      fps: this.fps,
      paused: this.paused,
      speed: this.speedMultiplier,
    };
  }

  getAsciiSnapshot(cols = 72, rows = 24) {
    return this.renderer.getAsciiSnapshot(cols, rows);
  }
}
