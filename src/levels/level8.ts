import type { LevelData } from '../types';

/** Level 8: The Gauntlet - Uses every ability.
 *
 * Left-to-right obstacle course. One main corridor elevation.
 * Scouts solve each obstacle, crowd follows through the carved path.
 *
 * Flow: Spawn -> dig floor -> bash 3 walls -> build gap ->
 *       explode thick wall -> mine through ramp -> walk to exit
 *
 * All top-to-top gaps <= 45px.
 */
const level: LevelData = {
  name: '8. The Gauntlet',
  terrainColor: '#6a6a6a',
  backgroundColor: '#0a0a1a',
  spawnX: 55,
  spawnY: 195,
  exitX: 755,
  exitY: 249,
  lemmingCount: 20,
  saveRequired: 12,
  spawnInterval: 70,
  abilities: {
    digger: 3,
    basher: 5,
    builder: 8,
    blocker: 3,
    miner: 3,
    exploder: 4,
    climber: 2,
    floater: 2,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // Main corridor is at y=250. Everything feeds into this.

    // === SECTION 1: Spawn + Dig ===
    // Spawn at y=205, dig through floor, drop 45px to corridor at y=250
    ctx.fillRect(20, 205, 100, 12);    // Spawn surface
    ctx.fillRect(20, 170, 12, 47);     // Left wall
    ctx.fillRect(108, 170, 12, 47);    // Right wall
    ctx.fillRect(20, 217, 100, 20);    // Thick floor to dig through

    // === SECTION 2: Bash Corridor ===
    // Corridor at y=250 with 3 walls
    ctx.fillRect(20, 250, 340, 12);    // Corridor floor
    ctx.fillRect(20, 220, 12, 42);     // Left back wall

    // Bash walls
    ctx.fillRect(100, 220, 20, 30);
    ctx.fillRect(190, 220, 20, 30);
    ctx.fillRect(280, 220, 20, 30);

    // === SECTION 3: Build Gap ===
    // 30px gap to bridge
    ctx.fillRect(400, 250, 60, 12);    // Landing

    // === SECTION 4: Explode Wall ===
    // 50px thick wall, can't bash through
    ctx.fillRect(460, 215, 50, 47);

    // Platform after wall
    ctx.fillRect(510, 250, 60, 12);

    // === SECTION 5: Mine Through Ramp ===
    // Solid ramp sitting on the corridor. Miner digs diagonally through.
    // After mining, there's a tunnel the crowd walks through.
    ctx.fillRect(570, 220, 100, 42);   // Solid block (fills corridor height)

    // === SECTION 6: Exit ===
    // Platform continues to exit
    ctx.fillRect(670, 250, 120, 12);
    ctx.fillRect(778, 220, 12, 42);    // Right wall

    // Ground (death)
    ctx.fillRect(0, h - 8, w, 8);

    // Decorative supports
    ctx.fillStyle = '#4a4a5a';
    ctx.fillRect(80, 262, 8, h - 270);
    ctx.fillRect(250, 262, 8, h - 270);
    ctx.fillRect(450, 262, 8, h - 270);
    ctx.fillRect(700, 262, 8, h - 270);
  },
};

export default level;
