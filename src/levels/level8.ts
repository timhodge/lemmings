import type { LevelData } from '../types';

/** Level 8: The Gauntlet - Uses every ability */
const level: LevelData = {
  name: '8. The Gauntlet',
  terrainColor: '#6a6a6a',
  backgroundColor: '#0a0a1a',
  spawnX: 60,
  spawnY: 55,
  exitX: 740,
  exitY: 440,
  lemmingCount: 20,
  saveRequired: 12,
  spawnInterval: 40,
  abilities: {
    digger: 3,
    basher: 3,
    builder: 6,
    blocker: 2,
    climber: 5,
    miner: 2,
    floater: 5,
    exploder: 2,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // === Section 1: Spawn + dig down ===
    ctx.fillRect(20, 65, 140, 12);  // Spawn platform
    ctx.fillRect(20, 30, 12, 47);    // Left wall
    ctx.fillRect(148, 30, 12, 47);   // Right wall
    ctx.fillRect(20, 77, 140, 30);   // Thick floor to dig through

    // === Section 2: Corridor with walls to bash ===
    ctx.fillRect(20, 170, 300, 12);  // Corridor floor
    ctx.fillRect(20, 120, 300, 12);  // Corridor ceiling
    ctx.fillRect(20, 120, 12, 62);   // Left wall

    // Bash walls
    ctx.fillRect(120, 132, 20, 38);
    ctx.fillRect(230, 132, 20, 38);

    // === Section 3: Gap to build across ===
    // Floor continues at 320, gap until 430
    ctx.fillRect(420, 170, 60, 12);  // Landing pad

    // === Section 4: Thick wall to explode ===
    ctx.fillRect(480, 100, 60, 82);

    // === Section 5: Platform requiring climbing ===
    ctx.fillRect(540, 170, 140, 12);
    // Wall to climb
    ctx.fillRect(668, 80, 12, 102);
    ctx.fillRect(668, 80, 120, 12);  // Top platform

    // === Section 6: Long drop - need floaters ===
    // Exit platform
    ctx.fillRect(680, 450, 110, 12);
    ctx.fillRect(778, 420, 12, 42);  // Right wall

    // Ground (death)
    ctx.fillRect(0, h - 8, w, 8);
  },
};

export default level;
