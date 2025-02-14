export type GameState = 'idle' | 'playing' | 'paused';

export type GroundhogState = 'idle' | 'hit';

export interface GroundhogConfig {
  x: number;
  y: number;
  scale: number;
  speed: number;
  health: number;
}

export interface GameScore {
  hits: number;
  misses: number;
  combo: number;
}
