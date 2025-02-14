import { Stage, Container } from '@pixi/react';
import { useCallback, useState, useEffect, useRef } from 'react';
import { Groundhog } from './Groundhog';
import { GameManager } from '../managers/GameManager';
import { GAME_CONFIG } from '../config/assets';
import * as PIXI from 'pixi.js';

export function Game() {
  const [groundhogs, setGroundhogs] = useState<ReturnType<GameManager['groundhogs']>>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isScoreChanged, setIsScoreChanged] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [comboTimer, setComboTimer] = useState<number | null>(null);
  const [comboWarning, setComboWarning] = useState(false);
  
  const managerRef = useRef<GameManager>();
  const missClickRef = useRef(false);
  const lastHitTimeRef = useRef<number>(0);
  const stageRef = useRef<PIXI.Container>(null);

  useEffect(() => {
    managerRef.current = new GameManager();
    return () => {
      managerRef.current?.stop();
    };
  }, []);

  // 计算连击倍数
  const getComboMultiplier = useCallback((currentCombo: number) => {
    const { multipliers } = GAME_CONFIG.score.combo;
    for (let i = multipliers.length - 1; i >= 0; i--) {
      if (currentCombo >= multipliers[i].threshold) {
        return multipliers[i].multiplier;
      }
    }
    return 1;
  }, []);

  // 计算时间奖励
  const getTimeBonus = useCallback((hitTime: number) => {
    const timeDiff = hitTime - lastHitTimeRef.current;
    const { threshold, perfect, good } = GAME_CONFIG.score.timeBonus;
    
    if (timeDiff < threshold) {
      return perfect;
    } else {
      return good;
    }
  }, []);

  // 重置连击计时器
  const resetComboTimer = useCallback(() => {
    if (comboTimer) {
      clearTimeout(comboTimer);
    }
    
    if (combo > 0) {
      // 设置连击衰减警告
      const warningTimer = setTimeout(() => {
        setComboWarning(true);
      }, GAME_CONFIG.score.combo.decay.warning);

      // 设置连击重置
      const decayTimer = setTimeout(() => {
        setCombo(0);
        setComboWarning(false);
      }, GAME_CONFIG.score.combo.decay.time);

      setComboTimer(decayTimer);
      return warningTimer;
    }
    
    return null;
  }, [combo, comboTimer]);

  const handleHit = useCallback((id: string) => {
    if (gameState !== 'playing') return;
    
    const now = Date.now();
    missClickRef.current = false;
    
    // 计算分数
    const baseScore = GAME_CONFIG.score.base;
    const comboMultiplier = getComboMultiplier(combo);
    const timeBonus = getTimeBonus(now);
    const totalScore = Math.floor(baseScore * comboMultiplier * timeBonus);
    
    setScore(prev => prev + totalScore);
    setCombo(prev => prev + 1);
    setIsScoreChanged(true);
    setComboWarning(false);
    
    // 更新最后击中时间
    lastHitTimeRef.current = now;
    
    // 重置连击计时器
    resetComboTimer();
    
    setTimeout(() => {
      setIsScoreChanged(false);
    }, 500);
    
    managerRef.current?.removeGroundhog(id);
    if (managerRef.current) {
      setGroundhogs([...managerRef.current.groundhogs]);
    }
  }, [combo, gameState, getComboMultiplier, getTimeBonus, resetComboTimer]);

  const handleMiss = useCallback(() => {
    if (gameState !== 'playing' || !missClickRef.current) return;
    setCombo(0);
    setComboWarning(false);
    if (comboTimer) {
      clearTimeout(comboTimer);
      setComboTimer(null);
    }
  }, [gameState, comboTimer]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setComboWarning(false);
    lastHitTimeRef.current = Date.now();
    managerRef.current?.start();
  }, []);

  const endGame = useCallback(() => {
    setGameState('ended');
    setComboWarning(false);
    if (comboTimer) {
      clearTimeout(comboTimer);
      setComboTimer(null);
    }
    managerRef.current?.stop();
  }, [comboTimer]);

  useEffect(() => {
    if (!managerRef.current) return;

    const interval = setInterval(() => {
      if (gameState === 'playing') {
        managerRef.current?.update();
        setGroundhogs([...managerRef.current.groundhogs]);
      }
    }, 16);

    return () => {
      clearInterval(interval);
    };
  }, [gameState]);

  useEffect(() => {
    if (stageRef.current) {
      const handleCanvasClick = (e: PIXI.FederatedPointerEvent) => {
        if (gameState === 'playing') {
          missClickRef.current = true;
          setTimeout(() => {
            handleMiss();
          }, 50);
        }
      };

      stageRef.current.eventMode = 'dynamic';
      stageRef.current.on('click', handleCanvasClick);
      stageRef.current.on('tap', handleCanvasClick);

      return () => {
        if (stageRef.current) {
          stageRef.current.off('click');
          stageRef.current.off('tap');
        }
      };
    }
  }, [gameState, handleMiss]);

  return (
    <div className="game-container">
      <div className={`score-board ${combo >= GAME_CONFIG.score.combo.threshold ? 'combo-active' : ''} ${comboWarning ? 'combo-warning' : ''}`}>
        <div className="score-item">
          <span className="score-label">得分</span>
          <span className="score-value" data-changed={isScoreChanged}>{score}</span>
        </div>
        <div className="score-item">
          <span className="score-label">连击</span>
          <span className="score-value">{combo}</span>
        </div>
      </div>

      <div className="game-canvas">
        <Stage 
          width={800} 
          height={600} 
          options={{ 
            backgroundAlpha: 0,
            eventMode: 'dynamic',
          }}
        >
          <Container ref={stageRef}>
            {groundhogs.map(groundhog => (
              <Groundhog
                key={groundhog.id}
                config={groundhog}
                onHit={() => handleHit(groundhog.id)}
              />
            ))}
          </Container>
        </Stage>
      </div>

      {gameState === 'idle' && (
        <button className="game-button" onClick={startGame}>
          开始
        </button>
      )}
      
      {gameState === 'playing' && (
        <button className="game-button" onClick={endGame}>
          结束
        </button>
      )}
      
      {gameState === 'ended' && (
        <button className="game-button" onClick={startGame}>
          重新开始
        </button>
      )}
    </div>
  );
}
