import type { LevelData } from '../types';

/** Level 7: Ka-Boom! - Blow up thick walls */
const level: LevelData = {
  name: '7. Ka-Boom!',
  terrainColor: '#8a5a5a',
  backgroundColor: '#1e0e0e',
  spawnX: 80,
  spawnY: 175,
  exitX: 720,
  exitY: 195,
  lemmingCount: 20,
  saveRequired: 15,
  spawnInterval: 60,
  abilities: {
    exploder: 5,
    blocker: 4,
    basher: 5,
    builder: 5,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // Floor
    ctx.fillRect(20, 195, 760, 15);

    // Ceiling
    ctx.fillRect(20, 120, 760, 15);

    // Back wall left
    ctx.fillRect(20, 120, 15, 90);

    // Thick walls that need exploding (too thick to bash)
    ctx.fillRect(200, 135, 80, 60);
    ctx.fillRect(440, 135, 80, 60);

    // Back wall right
    ctx.fillRect(765, 120, 15, 90);

    // Gap before exit that needs building
    ctx.clearRect(640, 195, 45, 15);

    ctx.fillStyle = this.terrainColor;

    // Ground
    ctx.fillRect(0, h - 10, w, 10);
  },
};

export default level;
