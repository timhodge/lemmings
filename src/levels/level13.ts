import type { LevelData } from '../types';

/** Level 13: Precision Mining
 *
 * Series of thick platforms. Must mine at exact spots to create
 * diagonal tunnels connecting each level. If you mine too early
 * or late, the tunnel misses the next platform. Bashers needed
 * for horizontal corrections. Very tight miner count.
 */
const level: LevelData = {
  name: '13. Precision Mining',
  terrainColor: '#6a6a5a',
  backgroundColor: '#0e0e0a',
  spawnX: 100,
  spawnY: 69,
  exitX: 700,
  exitY: 419,
  lemmingCount: 15,
  saveRequired: 10,
  spawnInterval: 90,
  abilities: {
    miner: 8,
    basher: 6,
    blocker: 4,
    exploder: 4,
    builder: 4,
    digger: 2,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // Spawn platform
    ctx.fillRect(40, 70, 160, 12);
    ctx.fillRect(40, 40, 12, 42);
    ctx.fillRect(188, 40, 12, 42);

    // Thick platform 1 (mine diagonally right+down through this)
    ctx.fillRect(40, 82, 300, 40);

    // Platform 2 (catch after mining, walk right, mine again)
    ctx.fillRect(200, 160, 300, 40);
    // Left wall to prevent backtracking
    ctx.fillRect(200, 130, 12, 42);

    // Platform 3
    ctx.fillRect(350, 240, 300, 40);
    ctx.fillRect(350, 210, 12, 42);

    // Platform 4 - need to bash through a wall then mine down
    ctx.fillRect(250, 320, 350, 40);
    ctx.fillRect(250, 290, 12, 42);
    // Internal wall (bash through)
    ctx.fillRect(450, 290, 20, 30);

    // Exit platform
    ctx.fillRect(600, 420, 180, 12);
    ctx.fillRect(768, 390, 12, 42);

    // Ground (death)
    ctx.fillRect(0, h - 8, w, 8);
  },
};

export default level;
