export type GameState = 'idle' | 'playing' | 'paused';

export type GroundhogState = 'idle' | 'hit';

export interface GroundhogConfig {
  id: string;
  x: number;
  y: number;
  scale: number;
  lifetime: number;
}

export interface GameScore {
  hits: number;
  misses: number;
  combo: number;
}
