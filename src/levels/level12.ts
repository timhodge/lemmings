import type { LevelData } from '../types';

/** Level 12: The Switchback
 *
 * Narrow corridors zigzagging down with walls at each turn.
 * Must bash through the wall at the end of each corridor,
 * then immediately build a bridge as they come out into open air
 * over a death pit to reach the next corridor entrance.
 * Blocker timing critical to prevent crowd from falling.
 */
const level: LevelData = {
  name: '12. The Switchback',
  terrainColor: '#7a7a6a',
  backgroundColor: '#0a0a0e',
  spawnX: 60,
  spawnY: 69,
  exitX: 740,
  exitY: 389,
  lemmingCount: 20,
  saveRequired: 14,
  spawnInterval: 60,
  abilities: {
    basher: 8,
    builder: 15,
    blocker: 5,
    exploder: 5,
    digger: 2,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // === Corridor 1: Top, going RIGHT ===
    ctx.fillRect(20, 80, 350, 12);     // Floor
    ctx.fillRect(20, 50, 350, 12);     // Ceiling
    ctx.fillRect(20, 50, 12, 42);      // Left wall
    ctx.fillRect(358, 50, 20, 42);     // Right wall (bash)

    // === Corridor 2: going LEFT (y=160, drop from 80 = 80... need bridge) ===
    // Bridge from corridor 1 exit to corridor 2 entrance
    // Corridor 2 at y=125 (125-80=45 safe drop)
    ctx.fillRect(350, 125, 350, 12);   // Floor
    ctx.fillRect(350, 95, 350, 12);    // Ceiling
    ctx.fillRect(688, 95, 12, 42);     // Right wall
    ctx.fillRect(350, 95, 20, 42);     // Left wall (bash out going left... wait)
    // Lemmings enter from right, walk left, bash left wall

    // Actually let me rethink. Zigzag: right, drop, left, drop, right...
    // Corridor 1: left to right, bash right wall, fall to corridor 2 start
    // Corridor 2: right to left, bash left wall, build to corridor 3
    // etc.

    // Let me redo with clean geometry:

    // === Corridor 1: y=80, left to right ===
    ctx.fillRect(20, 80, 300, 12);
    ctx.fillRect(20, 50, 12, 42);
    // End wall
    ctx.fillRect(308, 50, 20, 42);

    // === Drop zone + Corridor 2: y=125, right to left ===
    // After bashing right wall of C1, lemmings drop 45px to C2
    ctx.fillRect(300, 125, 400, 12);
    ctx.fillRect(688, 95, 12, 42);
    // End wall (left side, bash going left)
    ctx.fillRect(300, 95, 20, 42);

    // === Corridor 3: y=170, left to right ===
    // After bashing left wall of C2, need to build to C3
    // C3 starts at x=200 (30px gap from C2 exit at x=300)
    ctx.fillRect(100, 170, 300, 12);
    ctx.fillRect(100, 140, 12, 42);
    // End wall
    ctx.fillRect(388, 140, 20, 42);

    // === Drop + Corridor 4: y=215, right to left ===
    ctx.fillRect(380, 215, 380, 12);
    ctx.fillRect(748, 185, 12, 42);
    ctx.fillRect(380, 185, 20, 42);

    // === Corridor 5: y=260, left to right ===
    // Build from C4 exit to C5
    ctx.fillRect(200, 260, 300, 12);
    ctx.fillRect(200, 230, 12, 42);
    ctx.fillRect(488, 230, 20, 42);

    // === Drop to exit corridor: y=305 ===
    ctx.fillRect(480, 305, 280, 12);
    ctx.fillRect(748, 275, 12, 42);

    // === Build to exit platform: y=350 ===
    // 30px gap then exit
    ctx.fillRect(600, 390, 190, 12);
    ctx.fillRect(778, 360, 12, 42);

    // Need intermediate platform so drop isn't lethal
    // 305 to 390 = 85px, too far. Add step.
    ctx.fillRect(550, 350, 80, 12);    // Mid step (350-305=45 safe)

    // Ground (death)
    ctx.fillRect(0, h - 8, w, 8);
  },
};

export default level;
