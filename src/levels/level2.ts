import type { LevelData } from '../types';

/** Level 2: Bridge the Gap - Build across gaps between pillars */
const level: LevelData = {
  name: '2. Bridge the Gap',
  terrainColor: '#8a6a3a',
  spawnX: 80,
  spawnY: 200,
  exitX: 720,
  exitY: 220,
  lemmingCount: 10,
  saveRequired: 8,
  spawnInterval: 50,
  abilities: {
    builder: 20,
    blocker: 2,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // Spawn platform with back wall
    ctx.fillRect(20, 210, 130, 15);
    ctx.fillRect(20, 170, 15, 55);

    // Pillar 1
    ctx.fillRect(230, 200, 40, 25);
    ctx.fillRect(230, 225, 15, 260);

    // Pillar 2
    ctx.fillRect(390, 200, 40, 25);
    ctx.fillRect(405, 225, 15, 260);

    // Pillar 3
    ctx.fillRect(550, 200, 40, 25);
    ctx.fillRect(550, 225, 15, 260);

    // Exit platform with back wall
    ctx.fillRect(660, 230, 130, 15);
    ctx.fillRect(775, 190, 15, 55);

    // Ground (pit)
    ctx.fillRect(0, h - 10, w, 10);
  },
};

export default level;
