export type AbilityType =
  | 'walker'
  | 'faller'
  | 'digger'
  | 'basher'
  | 'builder'
  | 'blocker'
  | 'climber'
  | 'miner'
  | 'floater'
  | 'exploder';

export interface LevelData {
  name: string;
  terrainColor: string;
  backgroundColor?: string;
  spawnX: number;
  spawnY: number;
  exitX: number;
  exitY: number;
  lemmingCount: number;
  saveRequired: number;
  spawnInterval: number;
  abilities: Partial<Record<AbilityType, number>>;
  buildTerrain: (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, w: number, h: number) => void;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}
