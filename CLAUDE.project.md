# Lemmings Clone

Browser-based Lemmings clone built with TypeScript and HTML5 Canvas.

## Tech Stack

- **TypeScript** + **Vite** (vanilla, no framework)
- **HTML5 Canvas** for rendering (800x500 game area)
- **Bitmap terrain** via OffscreenCanvas + ImageData for pixel-level collision and destruction

## Architecture

### Core Systems

- `src/terrain.ts` - Bitmap terrain: solid=alpha>0, destruction via pixel clearing, addRect for building
- `src/lemming.ts` - Entity with state machine (walk/fall/dig/bash/build/block/climb/mine/float/explode)
- `src/sprites.ts` - Pixel-art sprites as 8x12 character grids, pre-rendered to canvases for alpha compositing
- `src/particles.ts` - Particle effects for explosions, splats, save sparkles
- `src/game.ts` - Game loop, input handling, ability toolbar, spawn/exit, speed/pause/nuke controls
- `src/main.ts` - Level select screen, level progression with localStorage unlock tracking

### Levels

8 levels in `src/levels/`, each teaching one ability:
1. Just Dig! - digger
2. Bridge the Gap - builder
3. Bash Brothers - basher
4. Mine Shaft - miner
5. Don't Look Down - floater
6. Climb Every Mountain - climber
7. Ka-Boom! - exploder
8. The Gauntlet - all abilities

Levels are defined programmatically (terrain drawn via Canvas API in `buildTerrain()`). Walls contain lemmings on platforms to prevent walk-off deaths before player can act.

### Sprite System

Sprites are defined as arrays of character strings mapped to a color palette. Each character = one pixel. Pre-rendered to HTMLCanvasElement at startup, then drawn via `drawImage()` for proper alpha compositing.

To upgrade to external sprite sheets: replace the character-grid definitions with PNG spritesheets loaded as Image objects. The `drawSprite()` interface wouldn't change much.

### Abilities

| Ability | Behavior |
|---------|----------|
| Walker | Default: walk forward, turn at walls, fall off edges |
| Digger | Remove terrain directly below |
| Basher | Remove terrain horizontally in facing direction |
| Builder | Place terrain steps diagonally upward |
| Miner | Remove terrain diagonally downward |
| Blocker | Stand still, deflect other lemmings |
| Climber | Scale vertical walls (persistent, survives state changes) |
| Floater | Slow descent, prevents splat death (persistent) |
| Exploder | 5-second countdown then terrain-destroying explosion (kills lemming) |

## Deployment

- **Hosting:** Caddy (Docker) on cc.offwalter.com VPS
- **Domain:** lemmings.offwalter.com
- **Build:** `npm run build` outputs to `dist/`
- **Caddy config:** `/home/th/dev-sites/caddy/Caddyfile` (static file_server with gzip)
- **Volume mount:** `dist/` mounted at `/srv/lemmings` in Caddy container

After code changes: `npm run build` and files are served immediately (volume mount is live).

## Dev Commands

```bash
npm run dev      # Vite dev server with HMR
npm run build    # TypeScript check + production build
npx tsc --noEmit # Type check only
```

## Known Limitations

- No sound effects
- No level editor (levels are code-defined)
- Sprites are procedural pixel art, not hand-drawn PNG spritesheets
- Single-player only, no high scores
