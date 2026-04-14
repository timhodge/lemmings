/**
 * Terrain is a bitmap stored as an offscreen canvas.
 * Solid = any pixel with alpha > 0.
 * Destruction = set pixels to transparent.
 */
export class Terrain {
  readonly width: number;
  readonly height: number;
  private canvas: OffscreenCanvas;
  private ctx: OffscreenCanvasRenderingContext2D;
  private imageData: ImageData;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas = new OffscreenCanvas(width, height);
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
    this.imageData = this.ctx.getImageData(0, 0, width, height);
  }

  /** Get the drawing context for building terrain */
  getContext(): OffscreenCanvasRenderingContext2D {
    return this.ctx;
  }

  /** Call after drawing to sync the imageData cache */
  sync(): void {
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
  }

  /** Check if a pixel is solid (alpha > 0) */
  isSolid(x: number, y: number): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
    const idx = (Math.floor(y) * this.width + Math.floor(x)) * 4;
    return this.imageData.data[idx + 3] > 0;
  }

  /** Remove a rectangular region of terrain */
  removeRect(x: number, y: number, w: number, h: number): void {
    this.ctx.clearRect(Math.floor(x), Math.floor(y), w, h);
    // Update imageData for the affected region
    const sx = Math.max(0, Math.floor(x));
    const sy = Math.max(0, Math.floor(y));
    const ex = Math.min(this.width, Math.floor(x) + w);
    const ey = Math.min(this.height, Math.floor(y) + h);
    const region = this.ctx.getImageData(sx, sy, ex - sx, ey - sy);
    for (let ry = sy; ry < ey; ry++) {
      for (let rx = sx; rx < ex; rx++) {
        const srcIdx = ((ry - sy) * (ex - sx) + (rx - sx)) * 4;
        const dstIdx = (ry * this.width + rx) * 4;
        this.imageData.data[dstIdx] = region.data[srcIdx];
        this.imageData.data[dstIdx + 1] = region.data[srcIdx + 1];
        this.imageData.data[dstIdx + 2] = region.data[srcIdx + 2];
        this.imageData.data[dstIdx + 3] = region.data[srcIdx + 3];
      }
    }
  }

  /** Remove a circular region of terrain */
  removeCircle(cx: number, cy: number, radius: number): void {
    const r = Math.ceil(radius);
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= radius * radius) {
          const px = Math.floor(cx) + dx;
          const py = Math.floor(cy) + dy;
          if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
            const idx = (py * this.width + px) * 4;
            this.imageData.data[idx + 3] = 0;
          }
        }
      }
    }
    // Write back to canvas
    this.ctx.putImageData(
      this.imageData,
      0, 0,
      Math.floor(cx) - r, Math.floor(cy) - r,
      r * 2 + 1, r * 2 + 1
    );
  }

  /** Add terrain pixels in a rectangular region */
  addRect(x: number, y: number, w: number, h: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
    // Sync affected region
    const sx = Math.max(0, Math.floor(x));
    const sy = Math.max(0, Math.floor(y));
    const ex = Math.min(this.width, Math.floor(x) + w);
    const ey = Math.min(this.height, Math.floor(y) + h);
    const region = this.ctx.getImageData(sx, sy, ex - sx, ey - sy);
    for (let ry = sy; ry < ey; ry++) {
      for (let rx = sx; rx < ex; rx++) {
        const srcIdx = ((ry - sy) * (ex - sx) + (rx - sx)) * 4;
        const dstIdx = (ry * this.width + rx) * 4;
        this.imageData.data[dstIdx] = region.data[srcIdx];
        this.imageData.data[dstIdx + 1] = region.data[srcIdx + 1];
        this.imageData.data[dstIdx + 2] = region.data[srcIdx + 2];
        this.imageData.data[dstIdx + 3] = region.data[srcIdx + 3];
      }
    }
  }

  /** Draw terrain onto a visible canvas */
  drawTo(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.canvas, 0, 0);
  }
}
