import type { LevelData } from '../types';

/** Level 1: Just Dig! - Introduction to digging. Dig straight down through layers. */
const level: LevelData = {
  name: '1. Just Dig!',
  terrainColor: '#5a8a3a',
  spawnX: 400,
  spawnY: 70,
  exitX: 400,
  exitY: 380,
  lemmingCount: 10,
  saveRequired: 8,
  spawnInterval: 80,
  abilities: {
    digger: 10,
  },
  buildTerrain(ctx, _w, _h) {
    const c = this.terrainColor;
    ctx.fillStyle = c;

    // All gaps between layers are ~45px (well under 60px MAX_FALL)

    // Spawn platform with walls
    ctx.fillRect(300, 80, 200, 15);   // dig exits at y=95
    ctx.fillRect(300, 45, 12, 50);
    ctx.fillRect(488, 45, 12, 50);

    // Layer 2 (gap: 140-95 = 45px)
    ctx.fillRect(260, 140, 280, 15);  // dig exits at y=155
    ctx.fillRect(260, 110, 12, 45);
    ctx.fillRect(528, 110, 12, 45);

    // Layer 3 (gap: 200-155 = 45px)
    ctx.fillRect(220, 200, 360, 15);  // dig exits at y=215
    ctx.fillRect(220, 170, 12, 45);
    ctx.fillRect(568, 170, 12, 45);

    // Layer 4 (gap: 260-215 = 45px)
    ctx.fillRect(180, 260, 440, 15);  // dig exits at y=275
    ctx.fillRect(180, 230, 12, 45);
    ctx.fillRect(608, 230, 12, 45);

    // Layer 5 (gap: 330-275 = 55px, still safe)
    ctx.fillRect(140, 330, 520, 15);  // dig exits at y=345
    ctx.fillRect(140, 300, 12, 45);
    ctx.fillRect(648, 300, 12, 45);

    // Exit platform (gap: 390-345 = 45px)
    ctx.fillRect(100, 390, 600, 15);
  },
};

export default level;
