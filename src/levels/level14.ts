import type { LevelData } from '../types';

/** Level 14: No Margin for Error
 *
 * The final level. Extremely tight ability counts. Every ability
 * must be used efficiently. Multiple sections requiring precise
 * timing. Scouts must carve the exact path with no wasted moves.
 * Blockers everywhere to manage the crowd.
 */
const level: LevelData = {
  name: '14. No Margin for Error',
  terrainColor: '#5a5a6a',
  backgroundColor: '#080810',
  spawnX: 60,
  spawnY: 59,
  exitX: 745,
  exitY: 449,
  lemmingCount: 25,
  saveRequired: 20,
  spawnInterval: 55,
  abilities: {
    digger: 2,
    basher: 3,
    builder: 6,
    blocker: 3,
    miner: 2,
    exploder: 3,
    climber: 2,
    floater: 2,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // === Section 1: Spawn, dig, navigate ===
    // Spawn box
    ctx.fillRect(20, 60, 120, 12);
    ctx.fillRect(20, 30, 12, 42);
    ctx.fillRect(128, 30, 12, 42);
    ctx.fillRect(20, 72, 120, 25);     // Thick floor (dig)

    // Landing after dig (y=140, from y=60: top-to-top = 80... too far)
    // Need thinner floor so dig exit is lower
    // Dig through floor bottom at y=97, land at y=140: 140-60=80 no good
    // Make floor thinner and landing closer
    ctx.fillRect(20, 105, 180, 12);    // Landing (105-60=45 safe)

    // Bash wall
    ctx.fillRect(140, 78, 20, 27);

    // === Section 2: Build across gap, then mine ===
    // Gap 30px
    ctx.fillRect(230, 105, 120, 12);   // Platform after gap
    // Solid block to mine through
    ctx.fillRect(230, 117, 120, 45);
    ctx.fillRect(230, 78, 12, 39);     // Left wall

    // === Section 3: Lower corridor with bash walls ===
    // After mining: land at y=200 (200-105=95 too far... miners go diagonal)
    // Miner exits roughly at y=160ish. Platform at y=175 (175-105=70...)
    // Need catch platform for post-mine
    ctx.fillRect(280, 175, 200, 12);   // Catch (175-105=70 too far for walkers)
    // Actually miners gradually go down. Other lemmings need a safe path.
    // Add step: y=145 (145-105=40 safe)
    ctx.fillRect(200, 145, 100, 12);

    // Then y=185 (185-145=40 safe)
    ctx.fillRect(300, 185, 250, 12);

    // Bash walls in this corridor
    ctx.fillRect(380, 160, 20, 25);
    ctx.fillRect(470, 160, 20, 25);

    // === Section 4: Explode wall, climb ===
    // Thick wall
    ctx.fillRect(540, 155, 45, 42);

    // After explosion: platform continues
    ctx.fillRect(585, 185, 100, 12);

    // Tall wall requiring climber
    ctx.fillRect(675, 140, 12, 57);
    ctx.fillRect(675, 140, 115, 12);   // Top of wall

    // === Section 5: Build down to exit ===
    // From wall top (y=140), need to get to exit at y=450
    // Step down: y=185 (already exists)
    // Need more steps down

    // y=230 (230-140=90 too far from wall top, need intermediate)
    // Platform off right side of wall
    ctx.fillRect(700, 185, 90, 12);    // Step (185-140=45 safe)

    // y=230 (230-185=45 safe)
    ctx.fillRect(650, 230, 140, 12);

    // y=275 (275-230=45)
    ctx.fillRect(600, 275, 190, 12);

    // y=320 (320-275=45)
    ctx.fillRect(550, 320, 240, 12);

    // y=365 (365-320=45)
    ctx.fillRect(600, 365, 190, 12);

    // y=410 (410-365=45)
    ctx.fillRect(650, 410, 140, 12);

    // Exit platform y=450 (450-410=40 safe)
    ctx.fillRect(680, 450, 110, 12);
    ctx.fillRect(778, 420, 12, 42);

    // Ground (death)
    ctx.fillRect(0, h - 8, w, 8);

    // Decorative supports
    ctx.fillStyle = '#3a3a4a';
    ctx.fillRect(100, 117, 6, h - 125);
    ctx.fillRect(400, 197, 6, h - 205);
    ctx.fillRect(700, 462, 6, h - 470);
  },
};

export default level;
