import type { InputAction, ReefState } from "../simulation/reefState";

interface BubbleParticle {
  x: number;
  y: number;
  radius: number;
  vy: number;
  drift: number;
  age: number;
  life: number;
  alpha: number;
}

interface RippleParticle {
  x: number;
  y: number;
  radius: number;
  age: number;
  life: number;
}

interface FishEntity {
  spriteIndex: number;
  x: number;
  lane: number;
  speed: number;
  scale: number;
  phase: number;
  direction: 1 | -1;
}

const ASSETS = {
  reef: "/assets/abyssrium-desk/reef-taskbar-bg.png",
  fish: "/assets/abyssrium-desk/fish-sprites.png"
} as const;

export class TaskbarReefRenderer {
  private readonly context: CanvasRenderingContext2D;
  private readonly reefImage = new Image();
  private readonly fishImage = new Image();
  private readonly bubbles: BubbleParticle[] = [];
  private readonly ripples: RippleParticle[] = [];
  private readonly fish: FishEntity[] = [];
  private animationFrame = 0;
  private lastFrame = performance.now();
  private width = 1;
  private height = 1;
  private pointerX = 0.5;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly getState: () => ReefState,
    private readonly onTick: (now: number, deltaSeconds: number) => void
  ) {
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      throw new Error("Canvas 2D context is unavailable.");
    }

    this.context = context;
    this.reefImage.src = ASSETS.reef;
    this.fishImage.src = ASSETS.fish;
    this.seedFish();
    this.resize();
  }

  start(): void {
    const loop = (now: number): void => {
      const deltaSeconds = Math.min(0.05, (now - this.lastFrame) / 1000);
      this.lastFrame = now;
      this.onTick(now, deltaSeconds);
      this.update(deltaSeconds);
      this.draw(now / 1000);
      this.animationFrame = requestAnimationFrame(loop);
    };

    this.animationFrame = requestAnimationFrame(loop);
  }

  stop(): void {
    cancelAnimationFrame(this.animationFrame);
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  pushInput(action: InputAction): void {
    const x = action.x ?? this.width * (0.35 + Math.random() * 0.3);
    const y = action.y ?? this.height * 0.72;
    this.pointerX = clamp(x / this.width, 0, 1);

    if (action.kind === "pointerMove") {
      this.spawnBubbleStream(x, y, 1 + action.intensity * 2);
      this.spawnRipple(x, y);
      return;
    }

    if (action.kind === "pointerTap" || action.kind === "capture") {
      this.spawnBubbleBurst(x, y, 14 + Math.floor(action.intensity * 10));
      this.spawnRipple(x, y, 1.35);
      return;
    }

    if (action.kind === "keyboard") {
      const origin = this.width * (0.18 + Math.random() * 0.64);
      this.spawnBubbleBurst(origin, this.height * 0.82, 8);
    }
  }

  private seedFish(): void {
    this.fish.push(
      { spriteIndex: 0, x: 0.1, lane: 0.46, speed: 0.018, scale: 0.72, phase: 0, direction: 1 },
      { spriteIndex: 1, x: 0.72, lane: 0.58, speed: 0.014, scale: 0.62, phase: 1.8, direction: -1 },
      { spriteIndex: 2, x: 0.42, lane: 0.38, speed: 0.012, scale: 0.54, phase: 3.2, direction: 1 },
      { spriteIndex: 5, x: 0.84, lane: 0.66, speed: 0.01, scale: 0.86, phase: 4.8, direction: -1 }
    );
  }

  private update(deltaSeconds: number): void {
    const state = this.getState();
    const speedMultiplier = 0.8 + state.bubblePressure * 0.9;

    for (const fish of this.fish) {
      fish.x += fish.speed * speedMultiplier * deltaSeconds * fish.direction;
      fish.phase += deltaSeconds * (0.7 + state.glow * 0.4);

      if (fish.direction === 1 && fish.x > 1.14) {
        fish.x = -0.14;
      } else if (fish.direction === -1 && fish.x < -0.14) {
        fish.x = 1.14;
      }
    }

    for (const bubble of this.bubbles) {
      bubble.age += deltaSeconds;
      bubble.y -= bubble.vy * deltaSeconds;
      bubble.x += Math.sin(bubble.age * 8 + bubble.drift) * 9 * deltaSeconds;
    }

    for (const ripple of this.ripples) {
      ripple.age += deltaSeconds;
      ripple.radius += 46 * deltaSeconds;
    }

    removeDead(this.bubbles);
    removeDead(this.ripples);
  }

  private draw(time: number): void {
    const ctx = this.context;
    const state = this.getState();
    ctx.clearRect(0, 0, this.width, this.height);

    this.drawBackground(ctx, state, time);
    this.drawRipples(ctx);
    this.drawFish(ctx, state, time);
    this.drawBubbles(ctx, state);
    this.drawGlass(ctx, state, time);
  }

  private drawBackground(
    ctx: CanvasRenderingContext2D,
    state: ReefState,
    time: number
  ): void {
    if (this.reefImage.complete && this.reefImage.naturalWidth > 0) {
      const imageWidth = this.reefImage.naturalWidth;
      const imageHeight = this.reefImage.naturalHeight;
      const scale = Math.max(this.width / imageWidth, this.height / imageHeight);
      const drawWidth = imageWidth * scale;
      const drawHeight = imageHeight * scale;
      const drift = Math.sin(time * 0.08 + state.tide * Math.PI * 2) * 22;
      const dx = (this.width - drawWidth) * 0.5 + drift;
      const compactAnchor = this.height - drawHeight + 78;
      const expandedAnchor = this.height - drawHeight * 0.82;
      const dy = state.mode === "compact" ? compactAnchor : expandedAnchor;
      ctx.drawImage(this.reefImage, dx, dy, drawWidth, drawHeight);
    } else {
      const fallback = ctx.createLinearGradient(0, 0, 0, this.height);
      fallback.addColorStop(0, "#0e6f83");
      fallback.addColorStop(1, "#061f2e");
      ctx.fillStyle = fallback;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    const shade = ctx.createLinearGradient(0, 0, 0, this.height);
    shade.addColorStop(0, `rgba(2, 23, 34, ${state.mode === "compact" ? 0.08 : 0.18})`);
    shade.addColorStop(0.62, "rgba(3, 28, 42, 0.06)");
    shade.addColorStop(1, "rgba(2, 10, 20, 0.5)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawFish(
    ctx: CanvasRenderingContext2D,
    state: ReefState,
    time: number
  ): void {
    if (!this.fishImage.complete || this.fishImage.naturalWidth === 0) {
      return;
    }

    const columns = 4;
    const rows = 2;
    const cellWidth = this.fishImage.naturalWidth / columns;
    const cellHeight = this.fishImage.naturalHeight / rows;
    const baseSize = state.mode === "compact" ? this.height * 1.08 : this.height * 0.24;

    for (const fish of this.fish) {
      const col = fish.spriteIndex % columns;
      const row = Math.floor(fish.spriteIndex / columns);
      const leanToPointer = (this.pointerX - fish.x) * 0.12;
      const swimY = fish.lane + Math.sin(time * 1.4 + fish.phase) * 0.035;
      const x = (fish.x + leanToPointer) * this.width;
      const y = swimY * this.height;
      const drawHeight = baseSize * fish.scale;
      const drawWidth = drawHeight * (cellWidth / cellHeight);
      const flip = fish.direction === -1 ? -1 : 1;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(flip, 1);
      ctx.globalAlpha = state.mode === "compact" ? 0.94 : 0.98;
      ctx.drawImage(
        this.fishImage,
        col * cellWidth,
        row * cellHeight,
        cellWidth,
        cellHeight,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );
      ctx.restore();
    }
  }

  private drawBubbles(ctx: CanvasRenderingContext2D, state: ReefState): void {
    for (const bubble of this.bubbles) {
      const t = bubble.age / bubble.life;
      const alpha = bubble.alpha * (1 - t) * (0.65 + state.glow * 0.35);
      ctx.save();
      ctx.globalAlpha = alpha;
      const gradient = ctx.createRadialGradient(
        bubble.x - bubble.radius * 0.32,
        bubble.y - bubble.radius * 0.32,
        bubble.radius * 0.12,
        bubble.x,
        bubble.y,
        bubble.radius
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.95)");
      gradient.addColorStop(0.38, "rgba(157,238,255,0.34)");
      gradient.addColorStop(1, "rgba(82,180,220,0.05)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(220, 252, 255, 0.74)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  private drawRipples(ctx: CanvasRenderingContext2D): void {
    for (const ripple of this.ripples) {
      const t = ripple.age / ripple.life;
      ctx.save();
      ctx.globalAlpha = 0.5 * (1 - t);
      ctx.strokeStyle = "rgba(142, 241, 255, 0.8)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(ripple.x, ripple.y, ripple.radius * 1.8, ripple.radius * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  private drawGlass(
    ctx: CanvasRenderingContext2D,
    state: ReefState,
    time: number
  ): void {
    const sweepX = ((time * 32 + state.tide * this.width) % (this.width + 240)) - 180;
    const beam = ctx.createLinearGradient(sweepX, 0, sweepX + 180, 0);
    beam.addColorStop(0, "rgba(255,255,255,0)");
    beam.addColorStop(0.5, `rgba(196, 252, 255, ${0.04 + state.glow * 0.06})`);
    beam.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = beam;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.strokeStyle = "rgba(215, 251, 255, 0.26)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, this.width - 1, this.height - 1);
  }

  private spawnBubbleStream(x: number, y: number, amount: number): void {
    for (let index = 0; index < amount; index += 1) {
      this.bubbles.push(createBubble(x, y, 0.7));
    }
  }

  private spawnBubbleBurst(x: number, y: number, amount: number): void {
    for (let index = 0; index < amount; index += 1) {
      const spreadX = (Math.random() - 0.5) * this.width * 0.12;
      const spreadY = (Math.random() - 0.5) * this.height * 0.24;
      this.bubbles.push(createBubble(x + spreadX, y + spreadY, 1.15));
    }
  }

  private spawnRipple(x: number, y: number, scale = 1): void {
    this.ripples.push({
      x,
      y,
      radius: 8 * scale,
      age: 0,
      life: 0.72
    });
  }
}

const createBubble = (x: number, y: number, energy: number): BubbleParticle => ({
  x,
  y,
  radius: 2 + Math.random() * 7 * energy,
  vy: 14 + Math.random() * 38 * energy,
  drift: Math.random() * Math.PI * 2,
  age: 0,
  life: 1.2 + Math.random() * 1.4,
  alpha: 0.45 + Math.random() * 0.42
});

const removeDead = <T extends { age: number; life: number }>(items: T[]): void => {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (items[index].age >= items[index].life) {
      items.splice(index, 1);
    }
  }
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));
