import type { LevelData } from '../types';

/** Level 9: Stairway to Nowhere
 *
 * Vertical ascent. Lemmings start at bottom, exit is top-right.
 * Must build staircases UP, chaining multiple builders.
 * Walls force direction changes. Tight builder count.
 */
const level: LevelData = {
  name: '9. Stairway to Nowhere',
  terrainColor: '#7a6a5a',
  backgroundColor: '#0e0a1a',
  spawnX: 80,
  spawnY: 419,
  exitX: 720,
  exitY: 99,
  lemmingCount: 15,
  saveRequired: 10,
  spawnInterval: 80,
  abilities: {
    builder: 25,
    blocker: 4,
    exploder: 4,
    basher: 2,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // Ground level - spawn
    ctx.fillRect(20, 420, 200, 12);
    ctx.fillRect(20, 385, 12, 47);     // Back wall

    // Shelf 1 right side (build up-right from ground to here)
    // y=370, top-to-top from 420 = 50px. Builder climbs 24px, need to land on this.
    ctx.fillRect(300, 370, 200, 12);
    ctx.fillRect(488, 340, 12, 42);    // Right wall

    // Shelf 2 left side (build up-left from shelf 1)
    ctx.fillRect(100, 320, 200, 12);
    ctx.fillRect(100, 290, 12, 42);    // Left wall

    // Shelf 3 right side
    ctx.fillRect(350, 270, 200, 12);
    ctx.fillRect(538, 240, 12, 42);    // Right wall

    // Shelf 4 left side
    ctx.fillRect(150, 220, 200, 12);
    ctx.fillRect(150, 190, 12, 42);    // Left wall

    // Shelf 5 right side
    ctx.fillRect(400, 170, 200, 12);
    ctx.fillRect(588, 140, 12, 42);    // Right wall

    // Exit platform
    ctx.fillRect(640, 100, 150, 12);
    ctx.fillRect(778, 70, 12, 42);     // Right wall

    // Ground (death)
    ctx.fillRect(0, h - 8, w, 8);
  },
};

export default level;
