import { GameState, GroundhogConfig, GameScore } from '../types/game';
import { GAME_CONFIG } from '../config/assets';

export class GameManager {
  private groundhogs: GroundhogConfig[] = [];
  private gameState: GameState = 'idle';
  private score: GameScore = { hits: 0, misses: 0, combo: 0 };
  private spawnInterval: number | null = null;
  private gameLoop: number | null = null;
  private lastUpdate: number = 0;

  constructor(private width: number, private height: number) {
    // Initialize with one groundhog for testing
    this.spawnGroundhog();
  }

  start() {
    if (this.gameState === 'playing') return;
    
    this.gameState = 'playing';
    this.score = { hits: 0, misses: 0, combo: 0 };
    this.lastUpdate = Date.now();
    this.startSpawning();
    this.startGameLoop();
  }

  pause() {
    if (this.gameState !== 'playing') return;
    this.gameState = 'paused';
    this.stopSpawning();
    this.stopGameLoop();
  }

  resume() {
    if (this.gameState !== 'paused') return;
    this.gameState = 'playing';
    this.lastUpdate = Date.now();
    this.startSpawning();
    this.startGameLoop();
  }

  cleanup() {
    this.stopSpawning();
    this.stopGameLoop();
    this.groundhogs = [];
  }

  getState(): GameState {
    return this.gameState;
  }

  getScore(): GameScore {
    return this.score;
  }

  getGroundhogs(): GroundhogConfig[] {
    return this.groundhogs;
  }

  hitGroundhog(index: number) {
    if (this.gameState !== 'playing') return;

    const groundhog = this.groundhogs[index];
    if (!groundhog) return;

    groundhog.health--;
    if (groundhog.health <= 0) {
      this.groundhogs = this.groundhogs.filter((_, i) => i !== index);
    }

    this.score.hits++;
    this.score.combo++;
  }

  missHit() {
    if (this.gameState !== 'playing') return;
    this.score.misses++;
    this.score.combo = 0;
  }

  private startGameLoop() {
    if (this.gameLoop) return;

    const updateFrame = () => {
      const now = Date.now();
      const deltaTime = now - this.lastUpdate;
      this.lastUpdate = now;

      this.update(deltaTime);
      this.gameLoop = requestAnimationFrame(updateFrame);
    };

    this.lastUpdate = Date.now();
    this.gameLoop = requestAnimationFrame(updateFrame);
  }

  private stopGameLoop() {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
  }

  private startSpawning() {
    if (this.spawnInterval) return;

    this.spawnInterval = window.setInterval(() => {
      if (this.groundhogs.length < GAME_CONFIG.groundhog.maxGroundhogs) {
        this.spawnGroundhog();
      }
    }, GAME_CONFIG.groundhog.spawnInterval);
  }

  private stopSpawning() {
    if (this.spawnInterval) {
      window.clearInterval(this.spawnInterval);
      this.spawnInterval = null;
    }
  }

  private spawnGroundhog() {
    const margin = 50;
    const x = Math.random() * (this.width - margin * 2) + margin;
    const y = Math.random() * (this.height - margin * 2) + margin;

    this.groundhogs.push({
      x,
      y,
      scale: 1,
      speed: GAME_CONFIG.groundhog.baseSpeed * (1 + Math.random() * 0.5),
      health: GAME_CONFIG.groundhog.baseHealth,
    });
  }

  private update(deltaTime: number) {
    if (this.gameState !== 'playing') return;

    // Update groundhog positions
    this.groundhogs.forEach((groundhog) => {
      groundhog.x += groundhog.speed * (deltaTime / 1000);
      
      // Wrap around when reaching screen edge
      if (groundhog.x > this.width + 50) {
        groundhog.x = -50;
      }
    });
  }
}
