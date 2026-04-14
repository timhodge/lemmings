import { Terrain } from './terrain';
import { Lemming } from './lemming';
import type { AbilityType, LevelData } from './types';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private terrain: Terrain;
  private lemmings: Lemming[] = [];
  private level: LevelData;
  private frameCount = 0;
  private spawnedCount = 0;
  private savedCount = 0;
  private deadCount = 0;
  private selectedAbility: AbilityType | null = null;
  private abilityInventory: Map<AbilityType, number> = new Map();
  private running = false;
  private animFrameId = 0;

  // UI elements
  private outEl: HTMLElement;
  private savedEl: HTMLElement;
  private neededEl: HTMLElement;

  constructor(canvas: HTMLCanvasElement, level: LevelData) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.level = level;
    this.terrain = new Terrain(CANVAS_WIDTH, CANVAS_HEIGHT);

    this.outEl = document.getElementById('out-count')!;
    this.savedEl = document.getElementById('saved-count')!;
    this.neededEl = document.getElementById('needed-count')!;

    this.neededEl.textContent = String(level.saveRequired);

    // Initialize ability inventory
    for (const [ability, count] of Object.entries(level.abilities)) {
      this.abilityInventory.set(ability as AbilityType, count as number);
    }

    // Build terrain
    const terrainCtx = this.terrain.getContext() as unknown as CanvasRenderingContext2D;
    level.buildTerrain(terrainCtx, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.terrain.sync();

    // Draw spawn and exit markers
    this.buildToolbar();
    this.setupInput();
  }

  private buildToolbar(): void {
    const toolbar = document.getElementById('toolbar')!;
    toolbar.innerHTML = '';

    const abilities: AbilityType[] = ['climber', 'floater', 'blocker', 'basher', 'miner', 'digger', 'builder'];

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
  }

  private selectAbility(ability: AbilityType): void {
    this.selectedAbility = this.selectedAbility === ability ? null : ability;
    document.querySelectorAll('.ability-btn').forEach((btn) => {
      const el = btn as HTMLElement;
      el.classList.toggle('active', el.dataset.ability === this.selectedAbility);
    });
  }

  private setupInput(): void {
    this.canvas.addEventListener('click', (e) => {
      if (!this.selectedAbility) return;

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      // Find closest active lemming to click
      let closest: Lemming | null = null;
      let closestDist = 15; // max click distance

      for (const lem of this.lemmings) {
        if (!lem.isActive) continue;
        const dx = lem.x - clickX;
        const dy = (lem.y - 5) - clickY; // center of body
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
  }

  private updateToolbarCounts(): void {
    document.querySelectorAll('.ability-btn').forEach((btn) => {
      const el = btn as HTMLElement;
      const ability = el.dataset.ability as AbilityType;
      const count = this.abilityInventory.get(ability) ?? 0;
      const countEl = el.querySelector('.count')!;
      countEl.textContent = String(count);
    });
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

    this.update();
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
      const prevState = lem.state;
      lem.update(this.terrain, this.level.exitX, this.level.exitY);

      if (lem.state === 'saved' && prevState !== 'saved') {
        this.savedCount++;
      }
      if ((lem.state === 'dead' || lem.state === 'splat') && prevState !== 'dead' && prevState !== 'splat') {
        this.deadCount++;
      }

      // Blocker collision: other walkers bounce off blockers
      if (lem.state === 'walking') {
        for (const other of this.lemmings) {
          if (other === lem || other.state !== 'blocking') continue;
          const dx = lem.x - other.x;
          if (Math.abs(dx) < 6 && Math.abs(lem.y - other.y) < 12) {
            lem.direction = dx > 0 ? 1 : -1;
          }
        }
      }
    }

    // Update UI
    const activeCount = this.spawnedCount - this.savedCount - this.deadCount;
    this.outEl.textContent = String(activeCount);
    this.savedEl.textContent = String(this.savedCount);
  }

  private render(): void {
    // Clear
    this.ctx.fillStyle = '#1a1a3e';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw terrain
    this.terrain.drawTo(this.ctx);

    // Draw spawn point
    this.ctx.fillStyle = '#ffff00';
    this.ctx.fillRect(this.level.spawnX - 5, this.level.spawnY - 15, 10, 3);
    this.ctx.fillRect(this.level.spawnX - 1, this.level.spawnY - 12, 2, 12);

    // Draw exit
    this.ctx.fillStyle = '#00ffff';
    this.ctx.fillRect(this.level.exitX - 6, this.level.exitY - 12, 12, 12);
    this.ctx.fillStyle = '#008888';
    this.ctx.fillRect(this.level.exitX - 4, this.level.exitY - 10, 8, 10);
    this.ctx.fillStyle = '#00ffff';
    this.ctx.fillRect(this.level.exitX - 2, this.level.exitY - 6, 4, 6);

    // Draw lemmings
    for (const lem of this.lemmings) {
      lem.draw(this.ctx);
    }

    // Win/lose message
    if (this.spawnedCount >= this.level.lemmingCount && this.savedCount + this.deadCount >= this.spawnedCount) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      this.ctx.font = '32px Courier New';
      this.ctx.textAlign = 'center';

      if (this.savedCount >= this.level.saveRequired) {
        this.ctx.fillStyle = '#00ff88';
        this.ctx.fillText(`LEVEL COMPLETE!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      } else {
        this.ctx.fillStyle = '#ff4444';
        this.ctx.fillText(`LEVEL FAILED`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      }

      this.ctx.font = '18px Courier New';
      this.ctx.fillStyle = '#cccccc';
      this.ctx.fillText(
        `Saved ${this.savedCount} of ${this.level.lemmingCount} (needed ${this.level.saveRequired})`,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 20
      );
    }
  }
}
