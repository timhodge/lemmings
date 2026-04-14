import type { LevelData } from '../types';

/** Level 4: Mine Shaft - Mine diagonally through solid earth */
const level: LevelData = {
  name: '4. Mine Shaft',
  terrainColor: '#7a6a5a',
  backgroundColor: '#0e0e1e',
  spawnX: 100,
  spawnY: 50,
  exitX: 680,
  exitY: 430,
  lemmingCount: 12,
  saveRequired: 8,
  spawnInterval: 55,
  abilities: {
    miner: 8,
    blocker: 2,
    builder: 3,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // Spawn platform with walls
    ctx.fillRect(40, 60, 150, 12);
    ctx.fillRect(40, 25, 12, 47);
    ctx.fillRect(178, 25, 12, 47);

    // Massive solid block they need to mine diagonally through
    // Goes from upper-left to lower-right
    ctx.fillRect(30, 90, 730, 340);

    // Carve out a chamber for the exit
    ctx.clearRect(620, 410, 150, 30);

    // Exit platform
    ctx.fillStyle = this.terrainColor;
    ctx.fillRect(620, 440, 150, 12);

    // Right wall to stop them
    ctx.fillRect(770, 410, 12, 42);

    // Ground
    ctx.fillRect(0, h - 10, w, 10);
  },
};

export default level;
