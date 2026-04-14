import type { LevelData } from '../types';

/** Level 1: Just Dig! - Introduction to digging. Dig straight down through layers.
 *
 * Gap math: most lemmings walk into the dug hole and fall from the platform
 * SURFACE, not the bottom. So the relevant gap is top-to-top, not bottom-to-top.
 * MAX_FALL = 60, but lemmings can snap 3px into a hole before falling starts,
 * so keep top-to-top gaps well under 55px to be safe.
 */
const level: LevelData = {
  name: '1. Just Dig!',
  terrainColor: '#5a8a3a',
  spawnX: 400,
  spawnY: 70,
  exitX: 400,
  exitY: 349,
  lemmingCount: 10,
  saveRequired: 8,
  spawnInterval: 80,
  abilities: {
    digger: 10,
  },
  buildTerrain(ctx, _w, _h) {
    const c = this.terrainColor;
    ctx.fillStyle = c;

    // Top-to-top gaps of 45px (well under 55px safe limit)

    // Spawn platform with walls
    ctx.fillRect(300, 80, 200, 15);
    ctx.fillRect(300, 45, 12, 50);
    ctx.fillRect(488, 45, 12, 50);

    // Layer 2 (top-to-top gap: 125 - 80 = 45)
    ctx.fillRect(260, 125, 280, 15);
    ctx.fillRect(260, 95, 12, 45);
    ctx.fillRect(528, 95, 12, 45);

    // Layer 3 (gap: 170 - 125 = 45)
    ctx.fillRect(220, 170, 360, 15);
    ctx.fillRect(220, 140, 12, 45);
    ctx.fillRect(568, 140, 12, 45);

    // Layer 4 (gap: 215 - 170 = 45)
    ctx.fillRect(180, 215, 440, 15);
    ctx.fillRect(180, 185, 12, 45);
    ctx.fillRect(608, 185, 12, 45);

    // Layer 5 (gap: 260 - 215 = 45)
    ctx.fillRect(140, 260, 520, 15);
    ctx.fillRect(140, 230, 12, 45);
    ctx.fillRect(648, 230, 12, 45);

    // Layer 6 (gap: 305 - 260 = 45)
    ctx.fillRect(100, 305, 600, 15);
    ctx.fillRect(100, 275, 12, 45);
    ctx.fillRect(688, 275, 12, 45);

    // Exit platform (gap: 350 - 305 = 45)
    ctx.fillRect(200, 350, 400, 15);
  },
};

export default level;
