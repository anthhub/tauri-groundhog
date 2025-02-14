import { Sprite } from '@pixi/react';
import { useCallback, useState, useEffect, useRef } from 'react';
import { GroundhogConfig } from '../types/game';
import { GAME_CONFIG } from '../config/assets';
import * as PIXI from 'pixi.js';

// 临时使用一个简单的图片，后续会替换为精灵图
// const TEMP_GROUNDHOG = 'https://pixijs.io/pixi-react/img/bunny.png';

interface GroundhogProps {
  config: GroundhogConfig;
  onHit?: () => void;
}

export function Groundhog({ config, onHit }: GroundhogProps) {
  const [isHit, setIsHit] = useState(false);
  const [hitSound] = useState(() => new Audio(GAME_CONFIG.groundhog.sounds.hit));
  const spriteRef = useRef<PIXI.Sprite>(null);
  
  useEffect(() => {
    if (spriteRef.current) {
      spriteRef.current.eventMode = 'dynamic';
      spriteRef.current.cursor = 'pointer';
      
      const handleClick = (e: PIXI.FederatedPointerEvent) => {
        if (isHit) return;
        
        e.stopPropagation();
        setIsHit(true);
        hitSound.currentTime = 0;
        hitSound.play().catch(() => {});
        onHit?.();

        setTimeout(() => {
          setIsHit(false);
        }, GAME_CONFIG.groundhog.hitAnimationDuration);
      };

      spriteRef.current.on('click', handleClick);
      spriteRef.current.on('tap', handleClick);

      return () => {
        if (spriteRef.current) {
          spriteRef.current.off('click');
          spriteRef.current.off('tap');
        }
      };
    }
  }, [isHit, hitSound, onHit]);

  useEffect(() => {
    return () => {
      hitSound.pause();
      hitSound.currentTime = 0;
    };
  }, [hitSound]);

  return (
    <Sprite
      ref={spriteRef}
      image={isHit ? GAME_CONFIG.groundhog.images.hit : GAME_CONFIG.groundhog.images.idle}
      x={config.x}
      y={config.y}
      scale={{ x: config.scale * (isHit ? 0.8 : 1), y: config.scale * (isHit ? 0.8 : 1) }}
      anchor={0.5}
      alpha={isHit ? 0.7 : 1}
      tint={isHit ? 0xff0000 : 0xffffff}
    />
  );
}
