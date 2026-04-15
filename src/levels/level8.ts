import type { LevelData } from '../types';

/** Level 8: The Gauntlet - Multi-level obstacle course using every ability.
 *
 * Three tiers: top -> middle -> bottom, zigzagging left to right.
 * Each tier has multiple obstacles. All drops <= 45px top-to-top.
 *
 * Top tier (y=100):   Spawn -> dig -> bash 2 walls -> drop right
 * Middle tier (y=200): bash wall -> build gap -> explode wall -> mine down
 * Bottom tier (y=300): bash wall -> build gap -> climb wall -> exit
 */
const level: LevelData = {
  name: '8. The Gauntlet',
  terrainColor: '#6a6a6a',
  backgroundColor: '#0a0a1a',
  spawnX: 55,
  spawnY: 89,
  exitX: 745,
  exitY: 299,
  lemmingCount: 20,
  saveRequired: 12,
  spawnInterval: 70,
  abilities: {
    digger: 4,
    basher: 8,
    builder: 10,
    blocker: 4,
    miner: 4,
    exploder: 4,
    climber: 3,
    floater: 3,
  },
  buildTerrain(ctx, w, h) {
    ctx.fillStyle = this.terrainColor;

    // ============ TOP TIER (y=100) - left to right ============

    // Spawn box
    ctx.fillRect(20, 100, 100, 12);    // Spawn platform
    ctx.fillRect(20, 65, 12, 47);      // Left wall
    ctx.fillRect(108, 65, 12, 47);     // Right wall
    ctx.fillRect(20, 112, 100, 20);    // Thick floor to dig through

    // Corridor at y=145 (top-to-top: 145 - 100 = 45px, safe)
    ctx.fillRect(20, 145, 500, 12);
    ctx.fillRect(20, 115, 12, 42);     // Left back wall

    // Bash walls on top tier
    ctx.fillRect(130, 118, 20, 27);
    ctx.fillRect(250, 118, 20, 27);

    // Drop zone: corridor ends, lemmings fall to middle tier
    // Right edge of top corridor is at x=520

    // ============ MIDDLE TIER (y=190) - right to left ============
    // Top-to-top: 190 - 145 = 45px (safe)

    // Middle corridor goes right to left
    ctx.fillRect(200, 190, 340, 12);
    ctx.fillRect(528, 165, 12, 37);    // Right wall (catches them from drop)

    // Bash wall
    ctx.fillRect(430, 165, 20, 25);

    // Build gap (30px)
    // Corridor ends at x=200, landing at x=140
    ctx.fillRect(100, 190, 70, 12);

    // Explode wall (50px thick, too wide to bash)
    ctx.fillRect(30, 165, 50, 37);

    // Platform after explode wall continues left
    // Actually lemmings go left through exploded wall, then need to drop
    // Platform for catching after wall
    ctx.fillRect(20, 190, 70, 12);

    // Mine ramp: solid block to mine diagonally down through
    ctx.fillRect(20, 202, 80, 40);

    // ============ BOTTOM TIER (y=280) - left to right ============
    // Lemmings emerge from mine at roughly y=240ish, need to get to y=280
    // Intermediate catch (top-to-top from mine area ~235 to 260 = 25px safe)
    ctx.fillRect(20, 260, 120, 12);

    // Bottom corridor (top-to-top: 300 - 260 = 40px, safe)
    ctx.fillRect(80, 300, 500, 12);
    ctx.fillRect(20, 260, 12, 52);     // Left wall

    // Bash wall
    ctx.fillRect(200, 275, 20, 25);

    // Build gap (30px)
    // Corridor break at x=380, landing at x=410
    ctx.fillRect(410, 300, 80, 12);

    // Tall wall to climb
    ctx.fillRect(490, 250, 12, 62);

    // Platform after climb
    ctx.fillRect(490, 250, 120, 12);

    // Another bash wall
    ctx.fillRect(560, 225, 20, 25);

    // Final stretch to exit (same elevation y=300 would need drop from 250)
    // Top-to-top: 300 - 250 = 50px, tight but under 60
    ctx.fillRect(650, 300, 140, 12);
    ctx.fillRect(778, 270, 12, 42);    // Right wall

    // Ground (death)
    ctx.fillRect(0, h - 8, w, 8);

    // Decorative supports
    ctx.fillStyle = '#4a4a5a';
    ctx.fillRect(100, 157, 6, h - 165);
    ctx.fillRect(300, 157, 6, h - 165);
    ctx.fillRect(500, 202, 6, h - 210);
    ctx.fillRect(700, 312, 6, h - 320);
  },
};

export default level;
