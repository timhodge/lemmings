import type { AbilityType } from './types';
import type { Terrain } from './terrain';
import { drawSprite, getSpriteForState } from './sprites';

const GRAVITY = 0.25;
const WALK_SPEED = 0.125;
const MAX_FALL = 60;
const LEMMING_HEIGHT = 10;
const CLIMB_SPEED = 0.125;
const BUILD_STEP_WIDTH = 6;
const BUILD_STEP_HEIGHT = 2;
const MAX_BUILD_STEPS = 12;
const EXPLODE_COUNTDOWN = 300; // 5 seconds at 60fps
const EXPLODE_RADIUS = 12;

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
  | 'exploding'
  | 'saved'
  | 'dead'
  | 'splat'
  | 'exploded';

export class Lemming {
  x: number;
  y: number;
  direction: 1 | -1 = 1;
  state: LemmingState = 'falling';
  private prevState: LemmingState = 'falling';
  fallDistance = 0;
  animFrame = 0;
  animTimer = 0;

  // Ability timers
  digTimer = 0;
  bashTimer = 0;
  buildTimer = 0;
  buildCount = 0;
  mineTimer = 0;
  explodeTimer = 0;
  explodeInPlace = false;

  // Persistent abilities
  isClimber = false;
  isFloater = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get isActive(): boolean {
    return this.state !== 'dead' && this.state !== 'saved' && this.state !== 'splat' && this.state !== 'exploded';
  }

  get justExploded(): boolean {
    return this.state === 'exploded' && this.prevState !== 'exploded';
  }

  get justSaved(): boolean {
    return this.state === 'saved' && this.prevState !== 'saved';
  }

  get justDied(): boolean {
    return (this.state === 'dead' || this.state === 'splat') &&
      this.prevState !== 'dead' && this.prevState !== 'splat';
  }

  canAssign(ability: AbilityType): boolean {
    if (!this.isActive) return false;
    if (this.state === 'blocking' && ability !== 'exploder') return false;
    if (ability === 'climber') return !this.isClimber;
    if (ability === 'floater') return !this.isFloater;
    if (ability === 'exploder') return this.state !== 'exploding';
    return true;
  }

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
        this.buildTimer = 0;
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
      case 'exploder':
        this.explodeInPlace = this.state === 'blocking';
        this.state = 'exploding';
        this.explodeTimer = EXPLODE_COUNTDOWN;
        break;
    }
  }

  update(terrain: Terrain, exitX: number, exitY: number): void {
    this.prevState = this.state;
    if (!this.isActive) return;

    this.animTimer++;
    if (this.animTimer >= 8) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }

    // Exploder countdown runs on top of other states
    if (this.state === 'exploding') {
      this.explodeTimer--;
      if (this.explodeTimer <= 0) {
        terrain.removeCircle(this.x, this.y - 5, EXPLODE_RADIUS);
        // Cut a clean rectangular corridor through the crater at walking level
        // so lemmings don't snag on jagged circle-boundary pixels
        terrain.removeRect(
          this.x - EXPLODE_RADIUS, this.y - LEMMING_HEIGHT - 2,
          EXPLODE_RADIUS * 2, LEMMING_HEIGHT + 4
        );
        this.state = 'exploded';
        return;
      }
      // While counting down, stay put if was a blocker, otherwise walk
      if (!this.explodeInPlace) {
        if (!terrain.isSolid(this.x, this.y) && !terrain.isSolid(this.x, this.y + 1)) {
          this.y += GRAVITY;
        } else {
          this.updateWalking(terrain);
        }
      }
    } else {
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
          break;
        case 'climbing':
          this.updateClimbing(terrain);
          break;
        case 'mining':
          this.updateMining(terrain);
          break;
      }
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
    this.y += 0.15;
  }

  private updateWalking(terrain: Terrain): void {
    if (!terrain.isSolid(this.x, this.y) && !terrain.isSolid(this.x, this.y + 1)) {
      if (this.state !== 'exploding') this.state = 'falling';
      this.fallDistance = 0;
      return;
    }

    const nextX = this.x + this.direction * WALK_SPEED;
    let canWalk = false;
    let newY = this.y;

    // Check upward for slope climbing (stairs, ramps)
    for (let step = 0; step <= 6; step++) {
      if (!terrain.isSolid(nextX, this.y - step)) {
        canWalk = true;
        newY = this.y - step;
        break;
      }
    }

    // If blocked above, check downward for descending slopes (craters, dips)
    if (!canWalk) {
      for (let step = 1; step <= 6; step++) {
        if (!terrain.isSolid(nextX, this.y + step)) {
          canWalk = true;
          newY = this.y + step;
          break;
        }
      }
    }

    if (canWalk) {
      this.x = nextX;
      this.y = newY;
      // Snap down to ground
      let snapDist = 0;
      while (this.y < terrain.height - 1 && !terrain.isSolid(this.x, this.y + 1)) {
        this.y++;
        snapDist++;
        if (snapDist > 6) {
          if (this.state !== 'exploding') this.state = 'falling';
          this.fallDistance = 0;
          return;
        }
      }
    } else {
      if (this.isClimber && this.state !== 'exploding') {
        this.state = 'climbing';
        return;
      }
      this.direction *= -1;
    }
  }

  private updateClimbing(terrain: Terrain): void {
    const checkX = this.x + this.direction;
    if (!terrain.isSolid(checkX, this.y)) {
      this.x = checkX;
      this.state = 'walking';
      return;
    }
    if (terrain.isSolid(this.x, this.y - 1)) {
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

    if (!terrain.isSolid(this.x, this.y + 1) && !terrain.isSolid(this.x - 2, this.y + 1) && !terrain.isSolid(this.x + 2, this.y + 1)) {
      this.state = 'falling';
      this.fallDistance = 0;
      return;
    }
    terrain.removeRect(this.x - 5, this.y, 10, 2);
    this.y += 2;
  }

  private updateBashing(terrain: Terrain): void {
    this.bashTimer++;
    if (this.bashTimer < 4) return;
    this.bashTimer = 0;

    // Check for terrain anywhere ahead within bash reach (8px)
    const lookAhead = this.direction === 1 ? this.x + 1 : this.x - 8;
    let hasTerrain = false;
    for (let checkX = lookAhead; checkX < lookAhead + 8; checkX++) {
      for (let y = this.y - LEMMING_HEIGHT; y <= this.y; y++) {
        if (terrain.isSolid(checkX, y)) {
          hasTerrain = true;
          break;
        }
      }
      if (hasTerrain) break;
    }
    if (!hasTerrain) {
      this.state = 'walking';
      return;
    }
    // Clear a strip in front
    const bashX = this.direction === 1 ? Math.floor(this.x) + 1 : Math.floor(this.x) - 4;
    terrain.removeRect(bashX, this.y - LEMMING_HEIGHT, 4, LEMMING_HEIGHT + 1);
    this.x += this.direction * WALK_SPEED;
  }

  private updateBuilding(terrain: Terrain): void {
    this.buildTimer++;
    if (this.buildTimer < 45) return;
    this.buildTimer = 0;

    this.buildCount++;
    if (this.buildCount > MAX_BUILD_STEPS) {
      this.state = 'walking';
      return;
    }

    // Place the step FIRST, then check if we can continue.
    // This ensures the final step bridges right up to (or into) the wall.
    const stepX = this.direction === 1 ? this.x : this.x - BUILD_STEP_WIDTH;
    terrain.addRect(stepX, this.y, BUILD_STEP_WIDTH, BUILD_STEP_HEIGHT, '#a08050');

    // Now check if we can move to the next position
    const nextY = this.y - BUILD_STEP_HEIGHT;
    const nextX = this.x + this.direction * (BUILD_STEP_WIDTH / 2);
    const ceilingAbove = terrain.isSolid(nextX, nextY - LEMMING_HEIGHT);
    // Is the lemming's body blocked at the next position?
    const bodyBlocked = terrain.isSolid(nextX + this.direction, nextY) &&
                        terrain.isSolid(nextX + this.direction, nextY - 4);
    if (ceilingAbove || bodyBlocked) {
      // Can't continue, but the step is already placed. Turn around.
      this.direction *= -1;
      this.state = 'walking';
      return;
    }
    this.x = nextX;
    this.y = nextY;
  }

  private updateMining(terrain: Terrain): void {
    this.mineTimer++;
    if (this.mineTimer < 30) return;
    this.mineTimer = 0;

    // Check ahead and below for terrain to mine (look past the last cleared area)
    let hasTerrain = false;
    for (let d = 3; d <= 10; d++) {
      if (terrain.isSolid(this.x + this.direction * d, this.y + d)) {
        hasTerrain = true;
        break;
      }
    }
    if (!hasTerrain) {
      this.state = 'falling';
      this.fallDistance = 0;
      return;
    }
    const mineX = this.x + this.direction * 3;
    const mineY = this.y + 2;
    terrain.removeCircle(mineX, mineY, 5);
    this.x += this.direction * 2;
    this.y += 2;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.state === 'dead' || this.state === 'exploded') return;

    if (this.state === 'splat') {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(this.x - 3, this.y - 1, 6, 2);
      return;
    }

    if (this.state === 'saved') return;

    const x = Math.floor(this.x);
    const y = Math.floor(this.y);

    // Exploder countdown display
    if (this.state === 'exploding') {
      const secondsLeft = Math.ceil(this.explodeTimer / 60);
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(String(secondsLeft), x, y - 14);

      // Flash red when almost exploding
      if (this.explodeTimer < 60 && this.animFrame % 2 === 0) {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#ff2222';
        ctx.fillRect(x - 4, y - 12, 8, 12);
        ctx.globalAlpha = 1;
      }
    }

    // Use sprite system
    const spriteInfo = getSpriteForState(this.state, this.animFrame, this.isFloater);
    if (spriteInfo) {
      const [spriteName, frameIdx] = spriteInfo;
      drawSprite(ctx, spriteName, frameIdx, x, y, this.direction === -1);
    }

    // Climber indicator (yellow dot on head) when not climbing
    if (this.isClimber && this.state !== 'climbing') {
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(x - 1, y - 12, 2, 1);
    }
  }
}
