import { Stage } from '@pixi/react';
import { useCallback, useEffect, useState } from 'react';
import { Groundhog } from './Groundhog';
import { GameManager } from '../managers/GameManager';
import { ErrorBoundary } from './ErrorBoundary';
import { Loading } from './Loading';

export function Game() {
  const [gameManager, setGameManager] = useState<GameManager | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.querySelector('.game-canvas');
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const initGame = async () => {
      try {
        setIsLoading(true);
        const manager = new GameManager(dimensions.width, dimensions.height);
        setGameManager(manager);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initGame();

    return () => {
      gameManager?.cleanup();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [dimensions.width, dimensions.height]);

  const handleClick = useCallback(() => {
    if (!gameManager) return;
    gameManager.missHit();
  }, [gameManager]);

  if (error) {
    return (
      <div className="error-container">
        <h2 className="error-title">游戏加载失败</h2>
        <p className="error-message">{error.message}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          重试
        </button>
      </div>
    );
  }

  if (isLoading || !gameManager) {
    return <Loading />;
  }

  const score = gameManager.getScore();
  const state = gameManager.getState();

  return (
    <ErrorBoundary>
      <div className="game-container">
        <div className="score-board">
          <div className="score-item">
            <span className="score-label">击中</span>
            <span className="score-value">{score.hits}</span>
          </div>
          <div className="score-item">
            <span className="score-label">失误</span>
            <span className="score-value">{score.misses}</span>
          </div>
          <div className="score-item">
            <span className="score-label">连击</span>
            <span className="score-value">{score.combo}</span>
          </div>
        </div>

        <div className="game-canvas">
          <Stage
            width={dimensions.width}
            height={dimensions.height}
            options={{
              backgroundColor: 0x1a1a2e,
              antialias: true,
              resolution: window.devicePixelRatio || 1,
              autoDensity: true,
            }}
            onClick={handleClick}
          >
            {gameManager.getGroundhogs().map((config, index) => (
              <Groundhog
                key={index}
                config={config}
                onHit={() => gameManager.hitGroundhog(index)}
              />
            ))}
          </Stage>
        </div>

        <button
          className="game-button"
          onClick={() => {
            if (state === 'playing') {
              gameManager.pause();
            } else {
              gameManager.start();
            }
          }}
        >
          {state === 'playing' ? '暂停' : '开始'}
        </button>
      </div>
    </ErrorBoundary>
  );
}
