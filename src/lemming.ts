import type { AbilityType } from './types';
import type { Terrain } from './terrain';

const GRAVITY = 1;
const WALK_SPEED = 0.5;
const MAX_FALL = 60; // fall distance before death
const LEMMING_WIDTH = 6;
const LEMMING_HEIGHT = 10;
const CLIMB_SPEED = 0.5;
const BUILD_STEP_WIDTH = 6;
const BUILD_STEP_HEIGHT = 2;
const MAX_BUILD_STEPS = 12;

export type LemmingState =
  | 'walking'
  | 'falling'
  | 'digging'
  | 'bashing'
  | 'building'
  | 'blocking'
  | 'climbing'
  | 'mining'
  | 'floating'
  | 'saved'
  | 'dead'
  | 'splat';

export class Lemming {
  x: number;
  y: number;
  direction: 1 | -1 = 1; // 1 = right, -1 = left
  state: LemmingState = 'falling';
  fallDistance = 0;
  animFrame = 0;
  animTimer = 0;

  // Ability state
  digTimer = 0;
  bashTimer = 0;
  buildCount = 0;
  mineTimer = 0;

  // Persistent abilities (survive state changes)
  isClimber = false;
  isFloater = false;

  // Colors for rendering
  readonly bodyColor: string;
  readonly hairColor: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.bodyColor = '#4040ff';
    this.hairColor = '#00cc00';
  }

  get isActive(): boolean {
    return this.state !== 'dead' && this.state !== 'saved' && this.state !== 'splat';
  }

  /** Check if an ability can be assigned */
  canAssign(ability: AbilityType): boolean {
    if (!this.isActive) return false;
    if (this.state === 'blocking') return false;
    if (ability === 'climber') return !this.isClimber;
    if (ability === 'floater') return !this.isFloater;
    return true;
  }

  /** Assign an ability */
  assign(ability: AbilityType): void {
    switch (ability) {
      case 'digger':
        this.state = 'digging';
        this.digTimer = 0;
        break;
      case 'basher':
        this.state = 'bashing';
        this.bashTimer = 0;
        break;
      case 'builder':
        this.state = 'building';
        this.buildCount = 0;
        break;
      case 'blocker':
        this.state = 'blocking';
        break;
      case 'climber':
        this.isClimber = true;
        break;
      case 'miner':
        this.state = 'mining';
        this.mineTimer = 0;
        break;
      case 'floater':
        this.isFloater = true;
        if (this.state === 'falling') {
          this.state = 'floating';
        }
        break;
    }
  }

  /** Update lemming for one frame */
  update(terrain: Terrain, exitX: number, exitY: number): void {
    if (!this.isActive) return;

    this.animTimer++;
    if (this.animTimer >= 8) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }

    switch (this.state) {
      case 'falling':
        this.updateFalling(terrain);
        break;
      case 'floating':
        this.updateFloating(terrain);
        break;
      case 'walking':
        this.updateWalking(terrain);
        break;
      case 'digging':
        this.updateDigging(terrain);
        break;
      case 'bashing':
        this.updateBashing(terrain);
        break;
      case 'building':
        this.updateBuilding(terrain);
        break;
      case 'blocking':
        // Blockers just stand there
        break;
      case 'climbing':
        this.updateClimbing(terrain);
        break;
      case 'mining':
        this.updateMining(terrain);
        break;
    }

    // Check exit
    if (this.isActive && this.state !== 'blocking') {
      const dx = this.x - exitX;
      const dy = this.y - exitY;
      if (dx * dx + dy * dy < 100) {
        this.state = 'saved';
      }
    }

    // Check bounds
    if (this.x < 0 || this.x >= terrain.width || this.y >= terrain.height) {
      this.state = 'dead';
    }
  }

  private updateFalling(terrain: Terrain): void {
    // Check for ground below
    if (terrain.isSolid(this.x, this.y + 1)) {
      if (this.fallDistance > MAX_FALL) {
        this.state = 'splat';
      } else {
        this.state = 'walking';
      }
      this.fallDistance = 0;
      return;
    }

    this.y += GRAVITY;
    this.fallDistance += GRAVITY;

    // Switch to floating if we have that ability
    if (this.isFloater && this.fallDistance > 10) {
      this.state = 'floating';
    }
  }

  private updateFloating(terrain: Terrain): void {
    if (terrain.isSolid(this.x, this.y + 1)) {
      this.state = 'walking';
      this.fallDistance = 0;
      return;
    }
    // Slow descent
    this.y += 0.3;
  }

  private updateWalking(terrain: Terrain): void {
    // Check for ground
    if (!terrain.isSolid(this.x, this.y) && !terrain.isSolid(this.x, this.y + 1)) {
      this.state = 'falling';
      this.fallDistance = 0;
      return;
    }

    // Walk up gentle slopes (check up to 2 pixels up)
    const nextX = this.x + this.direction * WALK_SPEED;
    let canWalk = false;
    let newY = this.y;

    for (let step = 0; step <= 2; step++) {
      if (!terrain.isSolid(nextX, this.y - step)) {
        canWalk = true;
        newY = this.y - step;
        // Make sure there's ground under the new position
        if (!terrain.isSolid(nextX, newY + 1) && !terrain.isSolid(nextX, newY)) {
          // Walk off edge, let falling handle it
          canWalk = true;
        }
        break;
      }
    }

    if (canWalk) {
      this.x = nextX;
      this.y = newY;
      // Snap to ground
      while (this.y < terrain.height - 1 && !terrain.isSolid(this.x, this.y + 1)) {
        this.y++;
        if (this.y - newY > 3) {
          this.state = 'falling';
          this.fallDistance = 0;
          return;
        }
      }
    } else {
      // Hit a wall
      if (this.isClimber) {
        this.state = 'climbing';
        return;
      }
      this.direction *= -1;
    }
  }

  private updateClimbing(terrain: Terrain): void {
    const checkX = this.x + this.direction;

    // Check if there's still a wall to climb
    if (!terrain.isSolid(checkX, this.y)) {
      // Reached the top, step onto ledge
      this.x = checkX;
      this.state = 'walking';
      return;
    }

    // Check if there's room above
    if (terrain.isSolid(this.x, this.y - 1)) {
      // Bonked head, fall back
      this.direction *= -1;
      this.state = 'falling';
      this.fallDistance = 0;
      return;
    }

    this.y -= CLIMB_SPEED;
  }

  private updateDigging(terrain: Terrain): void {
    this.digTimer++;
    if (this.digTimer < 8) return;
    this.digTimer = 0;

    // Check if there's terrain below to dig
    if (!terrain.isSolid(this.x, this.y + 1) && !terrain.isSolid(this.x - 2, this.y + 1) && !terrain.isSolid(this.x + 2, this.y + 1)) {
      this.state = 'falling';
      this.fallDistance = 0;
      return;
    }

    // Remove terrain below
    terrain.removeRect(this.x - LEMMING_WIDTH / 2 - 1, this.y, LEMMING_WIDTH + 2, 2);
    this.y += 2;
  }

  private updateBashing(terrain: Terrain): void {
    this.bashTimer++;
    if (this.bashTimer < 4) return;
    this.bashTimer = 0;

    const bashX = this.direction === 1 ? this.x + 2 : this.x - 4;

    // Check if there's terrain to bash
    let hasTerrain = false;
    for (let y = this.y - LEMMING_HEIGHT; y <= this.y; y++) {
      if (terrain.isSolid(bashX + (this.direction === 1 ? 2 : 0), y)) {
        hasTerrain = true;
        break;
      }
    }

    if (!hasTerrain) {
      this.state = 'walking';
      return;
    }

    // Remove terrain in front
    terrain.removeRect(bashX, this.y - LEMMING_HEIGHT, 4, LEMMING_HEIGHT + 1);
    this.x += this.direction * WALK_SPEED;
  }

  private updateBuilding(terrain: Terrain): void {
    this.buildCount++;
    if (this.buildCount > MAX_BUILD_STEPS) {
      this.state = 'walking';
      return;
    }

    // Place a step
    const stepX = this.direction === 1 ? this.x : this.x - BUILD_STEP_WIDTH;
    terrain.addRect(stepX, this.y, BUILD_STEP_WIDTH, BUILD_STEP_HEIGHT, '#a08050');

    // Move up and forward
    this.x += this.direction * (BUILD_STEP_WIDTH / 2);
    this.y -= BUILD_STEP_HEIGHT;

    // Check if hit ceiling
    if (terrain.isSolid(this.x, this.y - LEMMING_HEIGHT)) {
      this.state = 'walking';
    }
  }

  private updateMining(terrain: Terrain): void {
    this.mineTimer++;
    if (this.mineTimer < 6) return;
    this.mineTimer = 0;

    // Diagonal dig
    const mineX = this.x + this.direction * 3;
    const mineY = this.y + 2;

    // Check if there's terrain to mine
    if (!terrain.isSolid(mineX, mineY)) {
      this.state = 'falling';
      this.fallDistance = 0;
      return;
    }

    terrain.removeCircle(mineX, mineY, 5);
    this.x += this.direction * 2;
    this.y += 2;
  }

  /** Draw the lemming */
  draw(ctx: CanvasRenderingContext2D): void {
    if (this.state === 'dead') return;

    if (this.state === 'splat') {
      // Splat animation: just a small red mark
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(this.x - 3, this.y - 1, 6, 2);
      return;
    }

    if (this.state === 'saved') return;

    const x = Math.floor(this.x);
    const y = Math.floor(this.y);

    // Body
    ctx.fillStyle = this.bodyColor;
    ctx.fillRect(x - 2, y - LEMMING_HEIGHT, 4, LEMMING_HEIGHT);

    // Hair/head
    ctx.fillStyle = this.hairColor;
    ctx.fillRect(x - 2, y - LEMMING_HEIGHT, 4, 3);

    // Direction indicator (arm)
    ctx.fillStyle = this.bodyColor;
    if (this.direction === 1) {
      ctx.fillRect(x + 2, y - 6, 2, 2);
    } else {
      ctx.fillRect(x - 4, y - 6, 2, 2);
    }

    // Feet animation
    if (this.state === 'walking') {
      const legOffset = this.animFrame < 2 ? 1 : -1;
      ctx.fillRect(x - 1 + legOffset, y, 1, 1);
      ctx.fillRect(x + 1 - legOffset, y, 1, 1);
    }

    // Ability indicators
    if (this.state === 'blocking') {
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(x - 3, y - LEMMING_HEIGHT - 2, 6, 1);
    }
    if (this.isClimber) {
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(x - 1, y - LEMMING_HEIGHT - 1, 2, 1);
    }
    if (this.isFloater && this.state === 'floating') {
      // Umbrella
      ctx.fillStyle = '#ff88ff';
      ctx.fillRect(x - 4, y - LEMMING_HEIGHT - 3, 8, 1);
      ctx.fillRect(x, y - LEMMING_HEIGHT - 2, 1, 2);
    }
    if (this.state === 'building') {
      ctx.fillStyle = '#ffaa00';
      const brickX = this.direction === 1 ? x + 2 : x - 4;
      ctx.fillRect(brickX, y - 4, 2, 2);
    }
  }
}
