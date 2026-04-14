# Lemmings Clone

Browser-based Lemmings clone built with TypeScript and HTML5 Canvas.

## Tech Stack

- **TypeScript** + **Vite** (vanilla, no framework)
- **HTML5 Canvas** for rendering (800x500 internal resolution, CSS-scaled to fill viewport)
- **Bitmap terrain** via OffscreenCanvas + ImageData for pixel-level collision and destruction

## Architecture

### Core Systems

- `src/terrain.ts` - Bitmap terrain: solid = alpha > 0, destruction via pixel clearing, addRect for building
- `src/lemming.ts` - Entity with state machine, all physics constants, ability update logic
- `src/sprites.ts` - Pixel-art sprites as 8x12 character grids, pre-rendered to canvases for alpha compositing
- `src/particles.ts` - Particle effects for explosions, splats, save sparkles. Capped at 500 particles.
- `src/game.ts` - Game loop, input handling, ability toolbar, spawn/exit, speed/pause/nuke controls, hover highlight
- `src/main.ts` - Level select screen, level progression with localStorage unlock tracking

### Key Constants (lemming.ts)

| Constant | Value | Notes |
|----------|-------|-------|
| GRAVITY | 0.25 | Pixels per frame downward |
| WALK_SPEED | 0.125 | Pixels per frame horizontal |
| MAX_FALL | 60 | Pixels fallen before splat |
| CLIMB_SPEED | 0.125 | Pixels per frame climbing |
| BUILD_STEP_WIDTH | 6 | Pixels wide per stair step |
| BUILD_STEP_HEIGHT | 2 | Pixels tall per stair step |
| MAX_BUILD_STEPS | 12 | Steps before builder stops (reach: 36px forward, 24px up) |
| EXPLODE_RADIUS | 12 | Terrain destruction radius on detonation |
| EXPLODE_COUNTDOWN | 300 | Frames (5 seconds at 60fps) |

### Levels

8 levels in `src/levels/`, each teaching one ability:

1. **Just Dig!** - digger. Cascading pyramid of platforms, dig through each to reach the exit below. Top-to-top gaps of 45px (under 60px splat limit).
2. **Bridge the Gap** - builder, blocker, exploder. Same-height platforms with 30px gaps. Block the crowd, build bridges, explode the blockers.
3. **Bash Brothers** - basher, blocker. Corridor with walls to bash through.
4. **Mine Shaft** - miner, blocker, builder. Solid earth block, mine diagonally to reach the exit.
5. **Don't Look Down** - floater, digger. High spawn, long fall to exit. Must dig through floor then float down.
6. **Climb Every Mountain** - climber, floater, blocker. Staircase of walls to climb from bottom-left to top-right.
7. **Ka-Boom!** - exploder, blocker, builder. Thick walls too wide to bash, must explode through. Gap before exit needs building.
8. **The Gauntlet** - all abilities. Multi-section obstacle course.

Levels are defined programmatically (terrain drawn via Canvas API in `buildTerrain()`). Walls contain lemmings on platforms.

**Level design rules learned the hard way:**
- Fall distance is measured top-to-top between platforms, not bottom-to-top. Most lemmings walk into the dug hole and fall from the surface, not from where the digger exits.
- Account for 3px snap-down: walking lemmings walk a few pixels into a hole before switching to fall state. Keep top-to-top gaps under 55px.
- Builder staircase reaches 36px forward and 24px up (12 steps). Space gaps accordingly.
- Exit position must be at the walking surface y-coordinate (one pixel above the platform top), not inside or below the platform.
- If giving blockers, also give exploders so they can be cleared.

### Sprite System

Sprites are 8x12 character grids mapped to a color palette. Pre-rendered to HTMLCanvasElement pairs (normal + horizontally flipped) at startup, drawn via `drawImage()` for proper alpha compositing over terrain. Canvas cache is bounded (max ~64 entries).

To upgrade to hand-drawn pixel art: create PNG spritesheets in Aseprite, replace character grids with Image-based sprites. The `drawSprite()` interface stays the same.

### Abilities

| Ability | Behavior | Timer |
|---------|----------|-------|
| Walker | Default: walk forward, turn at walls, fall off edges | - |
| Digger | Remove 8px-wide strip below, move down 2px | 8 frames/dig |
| Basher | Remove 4px-wide vertical strip ahead, checks 8px lookahead | 4 frames/bash |
| Builder | Place 6x2 terrain step, move 3px forward + 2px up | 30 frames/step |
| Miner | Remove circular area diagonally down-forward | 6 frames/mine |
| Blocker | Stand still, deflect other walking lemmings. Can only be assigned exploder. | - |
| Climber | Scale vertical walls (persistent, survives state changes) | - |
| Floater | Slow descent (0.15 px/frame), prevents splat (persistent) | - |
| Exploder | 5-second countdown, then 12px radius terrain destruction. Kills the lemming. Blocker-turned-exploder stays in place. | 300 frames |

### Game Controls

- **Ability toolbar**: Click to select, click lemming to assign. Number keys 1-8 select abilities.
- **Speed**: 1x / 2x / 4x toggle (+ key or button)
- **Pause**: Space or P
- **Nuke**: Assigns exploder to all active lemmings with staggered timers
- **Hover highlight**: White selection box around hovered lemming when ability is selected. Red box if ability can't be assigned.
- **Click area**: 20px radius from lemming center

### Display

Internal canvas is 800x500. CSS scales to 98vw (max 1600px) with `aspect-ratio: 8/5` and `image-rendering: pixelated` for crisp pixel scaling. The game looks like a retro pixel art game at any screen size.

## Deployment

- **Live URL:** https://lemmings.offwalter.com
- **Hosting:** Caddy (Docker container `devsite-caddy`) on cc.offwalter.com VPS
- **DNS:** Cloudflare A record -> 87.99.142.88, DNS-only (not proxied), Caddy handles TLS via Let's Encrypt
- **Caddy config:** `/home/th/dev-sites/caddy/Caddyfile` (static file_server with gzip + security headers)
- **Docker Compose:** `/home/th/dev-sites/caddy/docker-compose.yml` (volume mounts dist/)
- **Volume mount:** `/home/th/projects/lemmings/dist` -> `/srv/lemmings:ro` in container
- **Cache headers:** Hashed assets get `immutable, max-age=31536000`. HTML gets `max-age=3600`.

After code changes: `npm run build` and files are served immediately (volume mount is live). No container restart needed.

To reload Caddy config: `docker exec devsite-caddy caddy reload --config /etc/caddy/Caddyfile`

## Dev Commands

```bash
npm run dev      # Vite dev server with HMR (port 5174)
npm run build    # TypeScript check + production build to dist/
npx tsc --noEmit # Type check only
```

## TODO

### Gameplay
- Levels 4-8 need playtesting and tuning (only 1-3 have been player-tested so far)
- Exit detection radius may need tuning on some levels (currently 10px: dx*dx + dy*dy < 100)
- Consider making exit detection a rectangle instead of circle for more predictable behavior
- Miner may need lookahead fix similar to basher fix
- Builder staircase: lemmings following a builder walk up the stairs as they're placed, may need tuning

### Visual
- Sprites are programmatic pixel art, not hand-drawn. Upgrade path: create PNG spritesheets in Aseprite
- No terrain textures (just flat colors). Could add noise/patterns to buildTerrain()
- No animation on spawn trapdoor or exit door
- Splat animation is just a red smear, could be more dramatic

### Audio
- No sound effects at all (dig, bash, build, splat, "oh no!", level complete jingle)
- No music

### Features
- No level editor
- No high scores or star ratings
- No retry count tracking
- No "save replay" functionality
- Mobile/touch support not tested
- No title screen or credits
