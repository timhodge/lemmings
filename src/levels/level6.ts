import type { LevelData } from '../types';

/** Level 6: Climb Every Mountain - Scale walls to reach the exit */
const level: LevelData = {
  name: '6. Climb Every Mountain',
  terrainColor: '#5a6a4a',
  backgroundColor: '#101a10',
  spawnX: 80,
  spawnY: 430,
  exitX: 720,
  exitY: 59,
  lemmingCount: 12,
  saveRequired: 8,
  spawnInterval: 90,
  abilities: {
    climber: 12,
    builder: 5,
    blocker: 2,
    exploder: 1,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // Ground level with walls
    ctx.fillRect(20, 440, 180, 15);
    ctx.fillRect(20, 400, 12, 55);

    // Step 1: wall + platform
    ctx.fillRect(188, 350, 15, 105);
    ctx.fillRect(188, 350, 120, 12);

    // Step 2: wall + platform
    ctx.fillRect(370, 260, 15, 102);
    ctx.fillRect(370, 260, 120, 12);

    // Step 3: wall + platform
    ctx.fillRect(540, 170, 15, 102);
    ctx.fillRect(540, 170, 120, 12);

    // Final: wall + exit platform
    ctx.fillRect(660, 60, 15, 122);
    ctx.fillRect(660, 60, 130, 12);
    // Right wall to stop
    ctx.fillRect(778, 30, 12, 42);

    // Ground
    ctx.fillRect(0, h - 10, w, 10);
  },
};

export default level;
