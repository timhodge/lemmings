import type { LevelData } from '../types';

/** Level 3: Bash Brothers - Bash through walls in a corridor */
const level: LevelData = {
  name: '3. Bash Brothers',
  terrainColor: '#6a6a7a',
  backgroundColor: '#1a1a2e',
  spawnX: 60,
  spawnY: 245,
  exitX: 740,
  exitY: 259,
  lemmingCount: 15,
  saveRequired: 10,
  spawnInterval: 80,
  abilities: {
    basher: 6,
    blocker: 2,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // Corridor floor
    ctx.fillRect(20, 260, 760, 15);

    // Corridor ceiling
    ctx.fillRect(20, 200, 760, 15);

    // Back wall (left, behind spawn)
    ctx.fillRect(20, 200, 15, 75);

    // Walls to bash through (thick enough to need bashing)
    ctx.fillRect(160, 215, 25, 45);
    ctx.fillRect(310, 215, 25, 45);
    ctx.fillRect(460, 215, 25, 45);
    ctx.fillRect(610, 215, 25, 45);

    // Back wall (right, past exit)
    ctx.fillRect(765, 200, 15, 75);

    // Ground
    ctx.fillRect(0, h - 10, w, 10);
  },
};

export default level;
