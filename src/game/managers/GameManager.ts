import { GroundhogConfig } from '../types/game';
import { GAME_CONFIG } from '../config/assets';

export class GameManager {
  private _groundhogs: GroundhogConfig[] = [];
  private nextId = 1;
  private isRunning = false;

  constructor() {
    this._groundhogs = [];
  }

  start() {
    this.isRunning = true;
    this._groundhogs = [];
    this.spawnGroundhog();
  }

  stop() {
    this.isRunning = false;
    this._groundhogs = [];
  }

  update() {
    if (!this.isRunning) return;

    // 随机生成新地鼠
    if (this._groundhogs.length < GAME_CONFIG.groundhog.maxGroundhogs && Math.random() < 0.05) {
      this.spawnGroundhog();
    }

    // 更新现有地鼠
    this._groundhogs = this._groundhogs.filter(groundhog => {
      groundhog.lifetime -= 16;
      return groundhog.lifetime > 0;
    });
  }

  removeGroundhog(id: string) {
    this._groundhogs = this._groundhogs.filter(g => g.id !== id);
  }

  private spawnGroundhog() {
    const id = String(this.nextId++);
    
    // 将画布分成 3x3 的网格，在网格交叉点生成地鼠
    const gridSize = 3;
    const margin = 100;
    const gridX = Math.floor(Math.random() * gridSize);
    const gridY = Math.floor(Math.random() * gridSize);
    
    const x = margin + (800 - 2 * margin) * (gridX / (gridSize - 1));
    const y = margin + (600 - 2 * margin) * (gridY / (gridSize - 1));
    
    this._groundhogs.push({
      id,
      x,
      y,
      scale: 0.8, // 增大地鼠尺寸
      lifetime: 3000, // 3秒后消失
    });
  }

  get groundhogs() {
    return this._groundhogs;
  }
}
