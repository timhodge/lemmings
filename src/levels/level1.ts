import type { LevelData } from '../types';

const level1: LevelData = {
  name: 'Just Dig!',
  terrainColor: '#5a8a3a',
  spawnX: 100,
  spawnY: 40,
  exitX: 700,
  exitY: 390,
  lemmingCount: 10,
  saveRequired: 8,
  spawnInterval: 60,
  abilities: {
    digger: 10,
    basher: 5,
    builder: 5,
    blocker: 2,
    climber: 2,
    miner: 3,
    floater: 2,
  },
  buildTerrain(ctx, w, h) {
    // Ground platform
    ctx.fillStyle = this.terrainColor;
    ctx.fillRect(0, h - 20, w, 20);

    // Starting platform (elevated, left side)
    ctx.fillRect(50, 60, 120, 15);

    // Middle platform with gap they need to bridge or dig through
    ctx.fillRect(200, 150, 250, 15);

    // Vertical wall they can bash through
    ctx.fillRect(300, 165, 20, 100);

    // Lower platform
    ctx.fillRect(350, 260, 200, 15);

    // Pillar near exit (need to dig or go around)
    ctx.fillRect(580, 200, 20, 200);

    // Exit platform
    ctx.fillRect(640, 400, 120, 15);

    // Ramp terrain
    for (let i = 0; i < 80; i++) {
      ctx.fillRect(200 + i, 150 - i * 0.5, 2, 2);
    }

    // Some decorative terrain bumps
    ctx.fillRect(100, h - 35, 60, 15);
    ctx.fillRect(400, h - 50, 80, 30);
  },
};

export default level1;
