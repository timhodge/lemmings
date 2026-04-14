import type { LevelData } from '../types';

/** Level 1: Just Dig! - Introduction to digging. Dig straight down through 4 layers. */
const level: LevelData = {
  name: '1. Just Dig!',
  terrainColor: '#5a8a3a',
  spawnX: 400,
  spawnY: 50,
  exitX: 400,
  exitY: 430,
  lemmingCount: 10,
  saveRequired: 8,
  spawnInterval: 60,
  abilities: {
    digger: 10,
  },
  buildTerrain(ctx, _w, _h) {
    const c = this.terrainColor;
    ctx.fillStyle = c;

    // Spawn platform with walls to contain lemmings
    ctx.fillRect(280, 60, 240, 15);
    // Left wall
    ctx.fillRect(280, 20, 15, 55);
    // Right wall
    ctx.fillRect(505, 20, 15, 55);

    // Layer 2 - wider, walls on sides
    ctx.fillRect(230, 150, 340, 15);
    ctx.fillRect(230, 120, 15, 45);
    ctx.fillRect(555, 120, 15, 45);

    // Layer 3
    ctx.fillRect(180, 240, 440, 15);
    ctx.fillRect(180, 210, 15, 45);
    ctx.fillRect(605, 210, 15, 45);

    // Layer 4
    ctx.fillRect(130, 330, 540, 15);
    ctx.fillRect(130, 300, 15, 45);
    ctx.fillRect(655, 300, 15, 45);

    // Exit platform
    ctx.fillRect(80, 440, 640, 15);
  },
};

export default level;
