export type AbilityType =
  | 'walker'
  | 'faller'
  | 'digger'
  | 'basher'
  | 'builder'
  | 'blocker'
  | 'climber'
  | 'miner'
  | 'floater';

export interface LevelData {
  name: string;
  terrainColor: string;
  spawnX: number;
  spawnY: number;
  exitX: number;
  exitY: number;
  lemmingCount: number;
  saveRequired: number;
  spawnInterval: number; // frames between spawns
  abilities: Partial<Record<AbilityType, number>>;
  buildTerrain: (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, w: number, h: number) => void;
}

export interface Point {
  x: number;
  y: number;
}
