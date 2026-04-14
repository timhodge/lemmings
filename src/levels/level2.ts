import type { LevelData } from '../types';

/** Level 2: Bridge the Gap - Build across gaps between platforms.
 *
 * Builder reach: 12 steps, each 3px forward + 2px up = 36px forward, 24px up.
 * After staircase ends, lemming falls. Keep gaps ~30px so stairs bridge them.
 * After building up 24px and walking off, lemming falls ~24px back to
 * same-height platform. 24 < 60 MAX_FALL, so no splat.
 *
 * Platforms are all at the same height. Just builders, no blocker/exploder
 * headaches. Back wall on spawn keeps lemmings contained.
 */
const level: LevelData = {
  name: '2. Bridge the Gap',
  terrainColor: '#8a6a3a',
  spawnX: 80,
  spawnY: 240,
  exitX: 720,
  exitY: 260,
  lemmingCount: 10,
  saveRequired: 8,
  spawnInterval: 90,
  abilities: {
    builder: 15,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // All platforms at y=260, same height. Gaps of ~30px.

    // Spawn platform with back wall
    ctx.fillRect(30, 260, 120, 15);
    ctx.fillRect(30, 220, 12, 55);

    // Platform 2 (gap: 180-150 = 30px)
    ctx.fillRect(180, 260, 100, 15);

    // Platform 3 (gap: 310-280 = 30px)
    ctx.fillRect(310, 260, 100, 15);

    // Platform 4 (gap: 440-410 = 30px)
    ctx.fillRect(440, 260, 100, 15);

    // Platform 5 (gap: 570-540 = 30px)
    ctx.fillRect(570, 260, 100, 15);

    // Exit platform with back wall (gap: 700-670 = 30px)
    ctx.fillRect(700, 260, 80, 15);
    ctx.fillRect(768, 225, 12, 50);

    // Ground (death pit)
    ctx.fillRect(0, h - 10, w, 10);

    // Decorative rocks
    ctx.fillStyle = '#6a5030';
    ctx.fillRect(160, h - 30, 30, 20);
    ctx.fillRect(350, h - 25, 25, 15);
    ctx.fillRect(550, h - 35, 35, 25);
  },
};

export default level;
