import type { LevelData } from '../types';

/** Level 5: Don't Look Down - Long fall requires floaters */
const level: LevelData = {
  name: "5. Don't Look Down",
  terrainColor: '#5a7a8a',
  backgroundColor: '#0a1520',
  spawnX: 400,
  spawnY: 35,
  exitX: 400,
  exitY: 450,
  lemmingCount: 15,
  saveRequired: 12,
  spawnInterval: 70,
  abilities: {
    floater: 15,
    digger: 3,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // Spawn platform with walls (high up)
    ctx.fillRect(300, 45, 200, 12);
    ctx.fillRect(300, 15, 12, 42);
    ctx.fillRect(488, 15, 12, 42);

    // Exit platform way down below with walls
    ctx.fillRect(300, 460, 200, 12);
    ctx.fillRect(300, 460, 12, 30);
    ctx.fillRect(488, 460, 12, 30);

    // A thick floor the lemmings must dig through to start falling
    ctx.fillRect(300, 57, 200, 20);

    // Ground (death for non-floaters)
    ctx.fillRect(0, h - 8, w, 8);
  },
};

export default level;
