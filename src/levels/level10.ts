import type { LevelData } from '../types';

/** Level 10: Bash and Catch
 *
 * Lemmings trapped in sealed boxes stacked vertically.
 * Must bash out the right wall of each box, but there's nothing
 * outside - instant fall. Need a builder ready to catch them
 * the moment they bash through. Bash-to-build timing is critical.
 */
const level: LevelData = {
  name: '10. Bash and Catch',
  terrainColor: '#5a6a7a',
  backgroundColor: '#0a0e1a',
  spawnX: 80,
  spawnY: 99,
  exitX: 720,
  exitY: 389,
  lemmingCount: 15,
  saveRequired: 10,
  spawnInterval: 80,
  abilities: {
    basher: 6,
    builder: 20,
    blocker: 4,
    exploder: 4,
    digger: 3,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // === Box 1 (top) - spawn here ===
    ctx.fillRect(30, 100, 200, 12);    // Floor
    ctx.fillRect(30, 60, 200, 12);     // Ceiling
    ctx.fillRect(30, 60, 12, 52);      // Left wall
    ctx.fillRect(218, 60, 20, 52);     // Right wall (bash through this)

    // === Box 2 (middle-right) ===
    // Lemmings bash out of box 1, fall right, need to build to box 2
    // Box 2 floor at y=200 (top-to-top from box 1: 200-100=100, too far!)
    // Need builder bridge from box 1 exit to box 2
    ctx.fillRect(350, 200, 200, 12);   // Floor
    ctx.fillRect(350, 160, 200, 12);   // Ceiling
    ctx.fillRect(350, 160, 12, 52);    // Left wall (build to this)
    ctx.fillRect(538, 160, 20, 52);    // Right wall (bash through)

    // === Box 3 (lower-left) ===
    ctx.fillRect(100, 300, 200, 12);   // Floor
    ctx.fillRect(100, 260, 200, 12);   // Ceiling
    ctx.fillRect(100, 260, 12, 52);    // Left wall
    ctx.fillRect(288, 260, 20, 52);    // Right wall (bash through)

    // === Exit platform ===
    ctx.fillRect(600, 390, 190, 12);
    ctx.fillRect(778, 360, 12, 42);    // Right wall

    // Ground (death)
    ctx.fillRect(0, h - 8, w, 8);
  },
};

export default level;
