import type { Particle } from './types';

export class ParticleSystem {
  private particles: Particle[] = [];

  /** Spawn an explosion burst */
  explode(x: number, y: number): void {
    const colors = ['#ff4400', '#ff8800', '#ffcc00', '#ffffff', '#ff2200'];
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30 + (Math.random() - 0.5) * 0.5;
      const speed = 1 + Math.random() * 3;
      this.particles.push({
        x,
        y: y - 5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 30 + Math.random() * 30,
        maxLife: 60,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1 + Math.random() * 2,
      });
    }
  }

  /** Spawn a splat effect */
  splat(x: number, y: number): void {
    for (let i = 0; i < 8; i++) {
      const angle = -Math.PI * Math.random();
      const speed = 0.5 + Math.random() * 1.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 20 + Math.random() * 15,
        maxLife: 35,
        color: i < 4 ? '#4040ff' : '#00cc00',
        size: 1,
      });
    }
  }

  /** Spawn save sparkles */
  sparkle(x: number, y: number): void {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = 0.5 + Math.random() * 1;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y - 5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        life: 20 + Math.random() * 20,
        maxLife: 40,
        color: i % 2 === 0 ? '#00ffff' : '#ffffff',
        size: 1,
      });
    }
  }

  update(): void {
    // Cap particle count to prevent memory issues during nuke
    if (this.particles.length > 500) {
      this.particles.splice(0, this.particles.length - 500);
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // gravity
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      const alpha = Math.min(1, p.life / (p.maxLife * 0.3));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), Math.ceil(p.size), Math.ceil(p.size));
    }
    ctx.globalAlpha = 1;
  }
}
