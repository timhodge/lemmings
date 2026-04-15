import type { LevelData } from '../types';

/** Level 11: Deep Mine
 *
 * Massive solid terrain. Must mine diagonally down through
 * multiple layers. Wrong angle = dead end. Need to chain miners
 * and bashers to navigate through the earth. Exploders for
 * course corrections.
 */
const level: LevelData = {
  name: '11. Deep Mine',
  terrainColor: '#6a5a4a',
  backgroundColor: '#0a0808',
  spawnX: 60,
  spawnY: 49,
  exitX: 740,
  exitY: 439,
  lemmingCount: 15,
  saveRequired: 10,
  spawnInterval: 90,
  abilities: {
    miner: 10,
    basher: 6,
    digger: 4,
    blocker: 3,
    exploder: 3,
    builder: 3,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // Spawn platform
    ctx.fillRect(20, 50, 120, 12);
    ctx.fillRect(20, 20, 12, 42);
    ctx.fillRect(128, 20, 12, 42);

    // Massive terrain block - fill most of the screen
    ctx.fillRect(20, 80, 760, 360);

    // Carve out chambers connected by narrow passages
    // Lemmings must mine/bash between them

    // Chamber 1 (upper left, below spawn)
    ctx.clearRect(30, 90, 100, 40);

    // Chamber 2 (middle, reached by mining right+down from chamber 1)
    ctx.clearRect(250, 180, 120, 40);

    // Chamber 3 (right side, reached by bashing right from chamber 2)
    ctx.clearRect(500, 180, 100, 40);

    // Chamber 4 (lower middle, mine down from chamber 3)
    ctx.clearRect(350, 300, 120, 40);

    // Chamber 5 (exit chamber, bash right from chamber 4)
    ctx.clearRect(620, 300, 150, 50);

    // Exit platform (inside chamber 5)
    ctx.fillStyle = this.terrainColor;
    ctx.fillRect(650, 440, 130, 12);
    ctx.fillRect(770, 410, 12, 42);

    // Clear space above exit platform
    ctx.clearRect(630, 350, 150, 90);

    // Ground
    ctx.fillRect(0, h - 8, w, 8);
  },
};

export default level;
