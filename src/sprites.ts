/**
 * Pixel-art sprite system for lemmings.
 * Each frame is rows of characters mapped to colors via PALETTE.
 * 0=transparent. Sprites are 8x12, origin at bottom-center.
 *
 * Sprites are pre-rendered to canvases for proper alpha compositing
 * (putImageData doesn't respect transparency, drawImage does).
 */

export type SpriteFrame = string[];

const PALETTE: Record<string, string> = {
  H: '#00cc00', // Hair
  S: '#ffcc88', // Skin
  B: '#4040ff', // Body
  F: '#333366', // Feet
  T: '#aa8844', // Tool
  R: '#ff4444', // Red warning
  U: '#ff88ff', // Umbrella
  K: '#884488', // Umbrella handle
};

const SPRITE_W = 8;
const SPRITE_H = 12;

const SPRITES: Record<string, SpriteFrame[]> = {
  walk: [
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBB000',
      '0BBBBB00',
      '0BBBB000',
      '00BB0000',
      '00BB0000',
      '0F00F000',
      '00000000',
      '00000000',
    ],
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBB000',
      '0BBBB0B0',
      '0BBBB000',
      '00BB0000',
      '00BB0000',
      '00FF0000',
      '00000000',
      '00000000',
    ],
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBB000',
      '0BBBBB00',
      '0BBBB000',
      '00BB0000',
      '00BB0000',
      '00F0F000',
      '00000000',
      '00000000',
    ],
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBB000',
      '0BBBB0B0',
      '0BBBB000',
      '00BB0000',
      '00BB0000',
      '0F00F000',
      '00000000',
      '00000000',
    ],
  ],
  fall: [
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      'BBBBB000',
      '0BBBB000',
      '0BBBBB00',
      '0BBBB000',
      '00BB0000',
      '00BB0000',
      '0F00F000',
      '00000000',
      '00000000',
    ],
  ],
  dig: [
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBB000',
      '0BBBB000',
      '0BBBB000',
      '00BT0000',
      '00BB0000',
      '0F00F000',
      '0000T000',
      '00000000',
    ],
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBB000',
      '0BBBB000',
      '0BBBB000',
      '0TB00000',
      '00BB0000',
      '0F00F000',
      'T0000000',
      '00000000',
    ],
  ],
  bash: [
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBB000',
      '0BBBBTTT',
      '0BBBB000',
      '00BB0000',
      '00BB0000',
      '0F00F000',
      '00000000',
      '00000000',
    ],
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB0TT',
      '0BBBB0T0',
      '0BBBBT00',
      '0BBBB000',
      '00BB0000',
      '00BB0000',
      '0F00F000',
      '00000000',
      '00000000',
    ],
  ],
  build: [
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBB000',
      '0BBBBTT0',
      '0BBBB000',
      '00BB0000',
      '00BB0000',
      '0F00F000',
      '00000000',
      '00000000',
    ],
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBB0T0',
      '0BBBBT00',
      '0BBBB000',
      '00BB0000',
      '00BB0000',
      '0F00F000',
      '00000000',
      '00000000',
    ],
  ],
  block: [
    [
      '0RRRR000',
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      'BBBBBB00',
      '0BBBB000',
      '0BBBB000',
      '00BB0000',
      '0FFFF000',
      '00000000',
      '00000000',
    ],
  ],
  climb: [
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBBB00',
      '0BBBB000',
      '0BBBB000',
      '0BBBB000',
      '00BB0000',
      '00BF0000',
      '00F00000',
      '00000000',
      '00000000',
    ],
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBBB00',
      '0BBBB000',
      '0BBBB000',
      '00BB0000',
      '00FB0000',
      '000F0000',
      '00000000',
      '00000000',
    ],
  ],
  mine: [
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBB000',
      '0BBBB000',
      '0BBBBT00',
      '00BB0T00',
      '00BB00T0',
      '0F00F000',
      '00000000',
      '00000000',
    ],
    [
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBB000',
      '0BBBBT00',
      '0BBBB0T0',
      '00BB00T0',
      '00BB0000',
      '0F00F000',
      '00000000',
      '00000000',
    ],
  ],
  float: [
    [
      'UUUUUUUU',
      '0U0KK0U0',
      '000KK000',
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBB000',
      '0BBBB000',
      '00BB0000',
      '0F00F000',
      '00000000',
    ],
  ],
  explode: [
    [
      '000R0000',
      '00HH0000',
      '00HH0000',
      '00SS0000',
      '0BBBB000',
      '0BBBB000',
      '0BBBB000',
      '0BBBB000',
      '00BB0000',
      '00BB0000',
      '0F00F000',
      '00000000',
    ],
  ],
};

// Canvas cache: key -> { normal: HTMLCanvasElement, flipped: HTMLCanvasElement }
const canvasCache = new Map<string, { normal: HTMLCanvasElement; flipped: HTMLCanvasElement }>();

function getFrameCanvases(spriteName: string, frameIdx: number): { normal: HTMLCanvasElement; flipped: HTMLCanvasElement } {
  const key = `${spriteName}_${frameIdx}`;
  const cached = canvasCache.get(key);
  if (cached) return cached;

  const frame = SPRITES[spriteName][frameIdx];

  // Render normal (facing right)
  const normal = document.createElement('canvas');
  normal.width = SPRITE_W;
  normal.height = SPRITE_H;
  const nCtx = normal.getContext('2d')!;
  renderFrameToCtx(nCtx, frame, false);

  // Render flipped (facing left)
  const flipped = document.createElement('canvas');
  flipped.width = SPRITE_W;
  flipped.height = SPRITE_H;
  const fCtx = flipped.getContext('2d')!;
  renderFrameToCtx(fCtx, frame, true);

  const result = { normal, flipped };
  canvasCache.set(key, result);
  return result;
}

function renderFrameToCtx(ctx: CanvasRenderingContext2D, frame: SpriteFrame, flipH: boolean): void {
  for (let row = 0; row < frame.length; row++) {
    const line = frame[row];
    for (let col = 0; col < line.length; col++) {
      const srcCol = flipH ? (SPRITE_W - 1 - col) : col;
      const ch = line[srcCol];
      if (ch === '0') continue;
      const color = PALETTE[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(col, row, 1, 1);
    }
  }
}

/**
 * Get the sprite name and frame for a lemming state.
 * Returns [spriteName, frameIndex] or null if no sprite matches.
 */
export function getSpriteForState(
  state: string,
  animFrame: number,
  isFloating: boolean,
): [string, number] | null {
  switch (state) {
    case 'walking':
      return ['walk', animFrame % 4];
    case 'falling':
      return isFloating ? ['float', 0] : ['fall', 0];
    case 'floating':
      return ['float', 0];
    case 'digging':
      return ['dig', animFrame % 2];
    case 'bashing':
      return ['bash', animFrame % 2];
    case 'building':
      return ['build', animFrame % 2];
    case 'blocking':
      return ['block', 0];
    case 'climbing':
      return ['climb', animFrame % 2];
    case 'mining':
      return ['mine', animFrame % 2];
    case 'exploding':
      return ['explode', 0];
    default:
      return null;
  }
}

/**
 * Draw a sprite at position (origin = bottom center).
 * Uses pre-rendered canvases for proper alpha compositing.
 */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  spriteName: string,
  frameIdx: number,
  x: number,
  y: number,
  facingLeft: boolean,
): void {
  const frames = SPRITES[spriteName];
  if (!frames) return;

  const idx = frameIdx % frames.length;
  const { normal, flipped } = getFrameCanvases(spriteName, idx);
  const src = facingLeft ? flipped : normal;

  const drawX = Math.floor(x) - Math.floor(SPRITE_W / 2);
  const drawY = Math.floor(y) - SPRITE_H + 1;

  ctx.drawImage(src, drawX, drawY);
}
