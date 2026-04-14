import { Terrain } from './terrain';
import { Lemming } from './lemming';
import { ParticleSystem } from './particles';
import type { AbilityType, LevelData } from './types';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

type GameState = 'playing' | 'won' | 'lost' | 'paused';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private terrain!: Terrain;
  private lemmings: Lemming[] = [];
  private particles = new ParticleSystem();
  private level!: LevelData;
  private frameCount = 0;
  private spawnedCount = 0;
  private savedCount = 0;
  private deadCount = 0;
  private selectedAbility: AbilityType | null = null;
  private abilityInventory: Map<AbilityType, number> = new Map();
  private running = false;
  private animFrameId = 0;
  private gameState: GameState = 'playing';
  private speed = 1;
  private endTimer = 0;

  // Callbacks
  onLevelComplete?: (saved: number, required: number, total: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.setupInput();
  }

  loadLevel(level: LevelData): void {
    this.stop();
    this.level = level;
    this.lemmings = [];
    this.frameCount = 0;
    this.spawnedCount = 0;
    this.savedCount = 0;
    this.deadCount = 0;
    this.selectedAbility = null;
    this.gameState = 'playing';
    this.speed = 1;
    this.endTimer = 0;
    this.particles = new ParticleSystem();

    this.terrain = new Terrain(CANVAS_WIDTH, CANVAS_HEIGHT);
    this.abilityInventory.clear();

    for (const [ability, count] of Object.entries(level.abilities)) {
      this.abilityInventory.set(ability as AbilityType, count as number);
    }

    const terrainCtx = this.terrain.getContext() as unknown as CanvasRenderingContext2D;
    level.buildTerrain(terrainCtx, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.terrain.sync();

    this.buildToolbar();
    this.updateStatusBar();
  }

  private buildToolbar(): void {
    const toolbar = document.getElementById('toolbar')!;
    toolbar.innerHTML = '';

    const abilities: AbilityType[] = ['climber', 'floater', 'exploder', 'blocker', 'basher', 'miner', 'digger', 'builder'];

    for (const ability of abilities) {
      const count = this.abilityInventory.get(ability) ?? 0;
      if (count === 0) continue;

      const btn = document.createElement('button');
      btn.className = 'ability-btn';
      btn.dataset.ability = ability;
      btn.innerHTML = `<span class="count">${count}</span>${ability}`;
      btn.addEventListener('click', () => this.selectAbility(ability));
      toolbar.appendChild(btn);
    }

    // Speed button
    const speedBtn = document.createElement('button');
    speedBtn.className = 'ability-btn control-btn';
    speedBtn.id = 'speed-btn';
    speedBtn.innerHTML = '<span class="count">1x</span>speed';
    speedBtn.addEventListener('click', () => this.cycleSpeed());
    toolbar.appendChild(speedBtn);

    // Pause button
    const pauseBtn = document.createElement('button');
    pauseBtn.className = 'ability-btn control-btn';
    pauseBtn.id = 'pause-btn';
    pauseBtn.innerHTML = '<span class="count">||</span>pause';
    pauseBtn.addEventListener('click', () => this.togglePause());
    toolbar.appendChild(pauseBtn);

    // Nuke button
    const nukeBtn = document.createElement('button');
    nukeBtn.className = 'ability-btn control-btn nuke-btn';
    nukeBtn.innerHTML = '<span class="count">!</span>nuke';
    nukeBtn.addEventListener('click', () => this.nuke());
    toolbar.appendChild(nukeBtn);
  }

  private selectAbility(ability: AbilityType): void {
    this.selectedAbility = this.selectedAbility === ability ? null : ability;
    document.querySelectorAll('.ability-btn:not(.control-btn)').forEach((btn) => {
      const el = btn as HTMLElement;
      el.classList.toggle('active', el.dataset.ability === this.selectedAbility);
    });
  }

  private cycleSpeed(): void {
    if (this.speed === 1) this.speed = 2;
    else if (this.speed === 2) this.speed = 4;
    else this.speed = 1;
    const btn = document.getElementById('speed-btn');
    if (btn) btn.querySelector('.count')!.textContent = `${this.speed}x`;
  }

  private togglePause(): void {
    if (this.gameState === 'paused') {
      this.gameState = 'playing';
      const btn = document.getElementById('pause-btn');
      if (btn) {
        btn.querySelector('.count')!.textContent = '||';
        btn.classList.remove('active');
      }
    } else if (this.gameState === 'playing') {
      this.gameState = 'paused';
      const btn = document.getElementById('pause-btn');
      if (btn) {
        btn.querySelector('.count')!.textContent = '>';
        btn.classList.add('active');
      }
    }
  }

  private nuke(): void {
    if (this.gameState !== 'playing') return;
    for (const lem of this.lemmings) {
      if (lem.isActive && lem.state !== 'exploding') {
        lem.assign('exploder');
        // Stagger the countdowns slightly
        lem.explodeTimer = 60 + Math.floor(Math.random() * 120);
      }
    }
  }

  private setupInput(): void {
    this.canvas.addEventListener('click', (e) => {
      if (!this.selectedAbility || this.gameState !== 'playing') return;

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      let closest: Lemming | null = null;
      let closestDist = 15;

      for (const lem of this.lemmings) {
        if (!lem.isActive) continue;
        const dx = lem.x - clickX;
        const dy = (lem.y - 5) - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestDist) {
          closest = lem;
          closestDist = dist;
        }
      }

      if (closest && closest.canAssign(this.selectedAbility)) {
        const remaining = this.abilityInventory.get(this.selectedAbility) ?? 0;
        if (remaining > 0) {
          closest.assign(this.selectedAbility);
          this.abilityInventory.set(this.selectedAbility, remaining - 1);
          this.updateToolbarCounts();
        }
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'p':
        case ' ':
          e.preventDefault();
          this.togglePause();
          break;
        case '+':
        case '=':
          this.cycleSpeed();
          break;
        case '1': case '2': case '3': case '4':
        case '5': case '6': case '7': case '8': {
          const abilities: AbilityType[] = ['climber', 'floater', 'exploder', 'blocker', 'basher', 'miner', 'digger', 'builder'];
          const idx = parseInt(e.key) - 1;
          if (idx < abilities.length) {
            const ability = abilities[idx];
            if ((this.abilityInventory.get(ability) ?? 0) > 0) {
              this.selectAbility(ability);
            }
          }
          break;
        }
      }
    });
  }

  private updateToolbarCounts(): void {
    document.querySelectorAll('.ability-btn:not(.control-btn)').forEach((btn) => {
      const el = btn as HTMLElement;
      const ability = el.dataset.ability as AbilityType;
      const count = this.abilityInventory.get(ability) ?? 0;
      const countEl = el.querySelector('.count')!;
      countEl.textContent = String(count);
    });
  }

  private updateStatusBar(): void {
    const activeCount = this.spawnedCount - this.savedCount - this.deadCount;
    document.getElementById('out-count')!.textContent = String(activeCount);
    document.getElementById('saved-count')!.textContent = String(this.savedCount);
    document.getElementById('needed-count')!.textContent = String(this.level.saveRequired);
    document.getElementById('level-name')!.textContent = this.level.name;
  }

  start(): void {
    this.running = true;
    this.loop();
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.animFrameId);
  }

  private loop = (): void => {
    if (!this.running) return;

    for (let i = 0; i < this.speed; i++) {
      if (this.gameState === 'playing') {
        this.update();
      }
    }
    this.particles.update();
    this.render();
    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(): void {
    this.frameCount++;

    // Spawn lemmings
    if (this.spawnedCount < this.level.lemmingCount && this.frameCount % this.level.spawnInterval === 0) {
      const lem = new Lemming(this.level.spawnX, this.level.spawnY);
      this.lemmings.push(lem);
      this.spawnedCount++;
    }

    // Update all lemmings
    for (const lem of this.lemmings) {
      lem.update(this.terrain, this.level.exitX, this.level.exitY);

      if (lem.justExploded) {
        this.particles.explode(lem.x, lem.y);
        this.deadCount++;
      }
      if (lem.justSaved) {
        this.particles.sparkle(lem.x, lem.y);
        this.savedCount++;
      }
      if (lem.justDied) {
        if (lem.state === 'splat') {
          this.particles.splat(lem.x, lem.y);
        }
        this.deadCount++;
      }

      // Blocker collision
      if (lem.state === 'walking' || lem.state === 'exploding') {
        for (const other of this.lemmings) {
          if (other === lem || other.state !== 'blocking') continue;
          const dx = lem.x - other.x;
          if (Math.abs(dx) < 6 && Math.abs(lem.y - other.y) < 12) {
            lem.direction = dx > 0 ? 1 : -1;
          }
        }
      }
    }

    this.updateStatusBar();

    // Check end condition
    if (this.spawnedCount >= this.level.lemmingCount && this.savedCount + this.deadCount >= this.spawnedCount) {
      this.endTimer++;
      if (this.endTimer > 60) {
        this.gameState = this.savedCount >= this.level.saveRequired ? 'won' : 'lost';
        this.onLevelComplete?.(this.savedCount, this.level.saveRequired, this.level.lemmingCount);
      }
    }
  }

  private render(): void {
    const bg = this.level?.backgroundColor ?? '#1a1a3e';
    this.ctx.fillStyle = bg;
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (!this.terrain) return;

    this.terrain.drawTo(this.ctx);

    // Draw spawn trapdoor
    this.ctx.fillStyle = '#888888';
    this.ctx.fillRect(this.level.spawnX - 8, this.level.spawnY - 8, 16, 4);
    this.ctx.fillStyle = '#666666';
    this.ctx.fillRect(this.level.spawnX - 6, this.level.spawnY - 6, 12, 3);
    // Trapdoor doors
    this.ctx.fillStyle = '#aaaaaa';
    ctx_drawTriangle(this.ctx, this.level.spawnX - 4, this.level.spawnY - 4, this.level.spawnX, this.level.spawnY - 1, this.level.spawnX - 4, this.level.spawnY - 1);
    ctx_drawTriangle(this.ctx, this.level.spawnX + 4, this.level.spawnY - 4, this.level.spawnX, this.level.spawnY - 1, this.level.spawnX + 4, this.level.spawnY - 1);

    // Draw exit door
    this.ctx.fillStyle = '#444488';
    this.ctx.fillRect(this.level.exitX - 7, this.level.exitY - 14, 14, 14);
    this.ctx.fillStyle = '#6666aa';
    this.ctx.fillRect(this.level.exitX - 5, this.level.exitY - 12, 10, 12);
    // Door opening
    this.ctx.fillStyle = '#000033';
    this.ctx.fillRect(this.level.exitX - 3, this.level.exitY - 8, 6, 8);
    // Door arch
    this.ctx.fillStyle = '#8888cc';
    this.ctx.fillRect(this.level.exitX - 4, this.level.exitY - 9, 8, 1);
    // Flag on top
    this.ctx.fillStyle = '#00ff88';
    this.ctx.fillRect(this.level.exitX, this.level.exitY - 18, 1, 6);
    this.ctx.fillRect(this.level.exitX + 1, this.level.exitY - 18, 4, 3);

    // Draw lemmings
    for (const lem of this.lemmings) {
      lem.draw(this.ctx);
    }

    // Draw particles
    this.particles.draw(this.ctx);

    // Pause overlay
    if (this.gameState === 'paused') {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      this.ctx.font = 'bold 36px "Courier New", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      this.ctx.font = '14px "Courier New", monospace';
      this.ctx.fillStyle = '#aaaaaa';
      this.ctx.fillText('Press SPACE or P to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    }

    // End screen
    if (this.gameState === 'won' || this.gameState === 'lost') {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      this.ctx.font = 'bold 32px "Courier New", monospace';
      this.ctx.textAlign = 'center';

      if (this.gameState === 'won') {
        this.ctx.fillStyle = '#00ff88';
        this.ctx.fillText('LEVEL COMPLETE!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
      } else {
        this.ctx.fillStyle = '#ff4444';
        this.ctx.fillText('LEVEL FAILED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
      }

      this.ctx.font = '16px "Courier New", monospace';
      this.ctx.fillStyle = '#cccccc';
      this.ctx.fillText(
        `Saved ${this.savedCount} of ${this.level.lemmingCount} (needed ${this.level.saveRequired})`,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 10
      );

      this.ctx.font = '14px "Courier New", monospace';
      this.ctx.fillStyle = '#888888';
      if (this.gameState === 'won') {
        this.ctx.fillText('Click NEXT to continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
      } else {
        this.ctx.fillText('Click RETRY to try again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
      }
    }
  }

  getState(): GameState {
    return this.gameState;
  }

  getSavedCount(): number {
    return this.savedCount;
  }
}

function ctx_drawTriangle(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number
): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}
